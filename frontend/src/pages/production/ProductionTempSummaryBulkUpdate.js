import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Chip, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import jsPDF from "jspdf";
import Selects from "react-select";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import PageHeading from "../../components/PageHeading";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';
import ExportData from "../../components/ExportData";
import MessageAlert from "../../components/MessageAlert";
import AlertDialog from "../../components/Alert";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";


function ProductionTempSummaryBulkUpdate() {


    const [loaderList, setLoaderList] = useState(false)

    const [batchNumber, setBatchNumber] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [isLoadMorePopupOpen, setIsLoadMorePopupOpen] = useState(false);

    const handleLoadMoreClosePopup = () => {
        setIsLoadMorePopupOpen(false); // Close the popup without loading more
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

    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    let now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    let currtime = `${hours}:${minutes}`;
    const [selectedTypeFrom, setSelectedTypeForm] = useState([])
    const [typeMaster, setTypeMaster] = useState([])

    const handleTypeChangeFrom = (options) => {
        setSelectedTypeForm(options);
        const selectedCategories = selectedOptionsCategory.map(option => option.value);
        const selectedTypes = options.map(option => option.value);
        fetchAllSubCategory(selectedCategories, selectedTypes); // Pass only the values
        setSelectedOptionsSubCategory([]);
    };

    const customValueRendererTypeFrom = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Type";
    };
    const gridRef = useRef(null);
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);
    const [selectedMode, setSelectedMode] = useState("Today")
    const mode = [
        { label: "Today", value: "Today" },
        { label: "Tomorrow", value: "Tomorrow" },
        { label: "Yesterday", value: "Yesterday" },
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Custom", value: "Custom" }
    ]
    let exportColumnNames = [
        'Project',
        'Vendor',
        'Date',
        'Upload Date',
        'Process Date',
        'Category',
        // 'Type',
        'Sub Category',
        'Count',
        'T-Rate',
        'Flag Count',
        'Total',
        // 'New Rate',
        // 'New Total',
        // 'Difference',
    ]

    let exportRowValues =
        ['vendor', 'vendornew', 'formatteddate', 'uploaddate', 'processdate', 'filenameupdated',
            // 'type', 
            'category', 'matchcount',
            'orate', 'flagcount',
            'oldtotal',
            //  'newrate',
            // 'newtotal', 'difference'
        ];
    //    today date fetching
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const [fromdate, setFromdate] = useState(today)
    const [todate, setTodate] = useState(today)
    const [vendors, setVendors] = useState([]);
    const [selectedProject, setSelectedProject] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState([]);
    let [valueVendor, setValueVendor] = useState([]);
    const [projmaster, setProjmaster] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [projectCheck, setProjectCheck] = useState(false);

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [projectOpt, setProjmasterOpt] = useState([]);
    const [vendorOpt, setVendormasterOpt] = useState([]);
    const [categoryOpt, setCategoryOPt] = useState([]);
    const [subcategory, setSubCategoryOpt] = useState([]);
    const [selectedOptionsCategory, setSelectedOptionsCategory] = useState([]);
    const [selectedOptionsSubCategory, setSelectedOptionsSubCategory] = useState([]);


    const fetchAllTypemaster = async (vendor, category) => {
        setPageName(!pageName);
        try {
            let res_module = await axios.post(SERVICE.QUEUE_TYPE_MASTER_CATEGORY_WISE_TYPE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                vendor: vendor,
                category: category

            });
            const resdata = res_module?.data?.queuetypemasters
                .map(item => String(item.type || '').trim()) // Trim and ensure string
                .filter(Boolean);
            const uniqueMap = new Map();

            resdata.forEach(item => {
                const key = item.toLowerCase(); // Case-insensitive key
                if (!uniqueMap.has(key)) {
                    uniqueMap.set(key, item); // Store original value
                }
            });

            const branchdata = Array.from(uniqueMap.values()).map(item => ({
                label: item,
                value: item
            }));
            setTypeMaster(branchdata);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };



    //get all project.
    const fetchProjMaster = async () => {
        try {
            let res_project = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const projectopt = [
                ...res_project?.data?.projmaster.map((item) => ({
                    ...item,
                    label: item.name,
                    value: item.name,
                })),
            ];

            setProjmasterOpt(projectopt);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const handleProjectChange = (options) => {
        const selectedValues = options.map((a) => a.value);
        setSelectedProject(options);
        fetchVendorsDropDown(options)
        fetchAllCategory(options);
        setSelectedVendor([])
        setSelectedOptionsCategory([]);
        setSelectedOptionsSubCategory([]);
        setSelectedTypeForm([]);
    };



    const handleVendorChange = (options) => {
        setValueVendor(
            options.map((a, index) => {
                return a.value;
            })
        );

        setSelectedVendor(options);
        setSelectedOptionsCategory([]);
        setSelectedOptionsSubCategory([]);
        setSelectedTypeForm([]);
    };

    const handleCategoryChange = (options) => {


        setSelectedOptionsCategory(options);
        setSelectedOptionsSubCategory([]);
    };

    const handleSubCategoryChange = (options) => {
        setSelectedOptionsSubCategory(options);
    };

    const customValueRendererProject = (valueProject, _categoryname) => {
        return valueProject?.length ? valueProject.map(({ label }) => label)?.join(", ") : "Please Select Project";
    };

    const customValueRendererVendor = (valueVendor, _categoryname) => {
        return valueVendor?.length ? valueVendor.map(({ label }) => label)?.join(", ") : "Please Select Vendor";
    };

    const customValueRendererCategory = (valueCompanyCategory, _categoryname) => {
        return valueCompanyCategory?.length ? valueCompanyCategory.map(({ label }) => label)?.join(", ") : "Please Select Category";
    };

    const customValueRendererSubCategory = (valueSubCat, _categoryname) => {
        return valueSubCat?.length ? valueSubCat.map(({ label }) => label)?.join(", ") : "Please Select SubCategory";
    };

    useEffect(() => {
        fetchProjMaster();
    }, []);

    //image

    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, 'Production Temp Summary .png');
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const username = isUserRoleAccess.username;
    const userData = {
        name: username,
        date: new Date(),
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

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        queuetype: true,
        uploaddate: true,
        processdate: true,
        project: true,
        vendornew: true,
        vendor: true,
        formatteddate: true,
        filenameupdated: true,
        category: true,
        orate: true,
        flagcount: true,
        oldtotal: true,
        newrate: true,
        newtotal: true,
        matchcount: true,
        difference: true,
        type: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedProject.length == 0) {
            setPopupContentMalert("Please Select Project!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedVendor.length == 0) {
            setPopupContentMalert("Please Select Vendor!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsCategory.length == 0) {
            setPopupContentMalert("Please Select Category!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        else if (selectedOptionsSubCategory.length == 0) {
            setPopupContentMalert("Please Select Subcategory!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        else if (fromdate === "") {
            setPopupContentMalert("Please Select From Date!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (todate === "") {
            setPopupContentMalert("Please Select To Date!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (new Date(todate) < new Date(fromdate)) {
            // Check if todate is less than fromdate
            setPopupContentMalert("To Date must be greater than or equal to From Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            // If all conditions are met, proceed with the fetch
            // fetchProductionIndividual();
            fetchBatchFilter(1);
        }
    };


    const handleclear = async (e) => {
        setPageName(!pageName)
        e.preventDefault();
        setProjmaster([])
        setSelectedOptionsCategory([]);
        setSelectedOptionsSubCategory([]);
        setVendormasterOpt([]);
        setSelectedTypeForm([]);
        setTypeMaster([])
        setSelectedProject([]);
        setSelectedVendor([]);
        setCategoryOPt([]);
        setSubCategoryOpt([]);
        setFromdate(today)
        setTodate(today)
        setSelectedMode("Today")


    };



    let result = [];

    selectedProject
        .map((d) => d.value)
        .forEach((proj) => {
            selectedVendor
                .map((d) => d.value)
                .forEach((vend) => {
                    // if (vendorOpt.some((v) => v.projectname === proj && v.name === vend)) {
                    result.push(`${proj}-${vend}`);
                    // }
                });
        });
    let projvendor = [...new Set(result)];

    const fetchBatchFilter = async (batchNum) => {
        setProjmaster([]);
        setLoaderList(true);
        try {
            let res_employee = await axios.post(
                SERVICE.PRODUCTION_TEMP_SUMMARY_REPORT,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    filename: selectedOptionsCategory.map((item) => item.value),
                    category: selectedOptionsSubCategory.map((item) => item.value),
                    // vendor: selectedVendor.map(item => item.value),
                    project: selectedProject.map(item => item.value),
                    projectvendor: projvendor,
                    // type: selectedTypeFrom.map(item => item.value),
                    fromdate: fromdate,
                    todate: todate,
                    batchNumber: batchNum,
                    batchSize: 50000,
                }
            );


            if (res_employee.data.count === 0) {
                setHasMoreData(false);
                setIsLoading(false);
                if (projmaster.length > 0) {
                    setPopupContentMalert("Fully Loaded");
                    setPopupSeverityMalert("success");
                    handleClickOpenPopupMalert();
                }
            } else {

                const itemsWithSerialNumber = res_employee?.data?.prodresult?.map((item, index) => ({
                    ...item,

                    id: item._id,
                    serialNumber: index + 1,
                    // formatteddate: moment(item.formatteddate).format("DD/MM/YYYY"),
                    formatteddate: item.formatteddate

                }));


                setProjmaster(itemsWithSerialNumber)
                setBatchNumber(batchNum);
                setIsLoading(false);
                // if (itemsWithSerialNumber.length > 0) {
                //     setIsLoadMorePopupOpen(true);
                // }
            }
        } catch (err) {
            setLoaderList(false);
            setIsLoading(false);
            setHasMoreData(false);
        } finally {
            setLoaderList(false);
            setIsLoading(false);
            setIsLoading(false);
        }
    };

    const fetchBatch = async (batchNum) => {
        setLoaderList(true);
        try {
            let res_employee = await axios.post(
                SERVICE.PRODUCTION_ORIGINAL_SUMMARY_REPORT,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    filename: selectedOptionsCategory.map((item) => item.value),
                    category: selectedOptionsSubCategory.map((item) => item.value),
                    vendor: selectedVendor.map(item => item.value),
                    project: selectedProject.map(item => item.value),
                    projectvendor: projvendor,
                    // type: selectedTypeFrom.map(item => item.value),
                    fromdate: fromdate,
                    todate: todate,
                    batchNumber: batchNum,
                    batchSize: 50000,
                }
            );



            if (res_employee.data.count === 0) {
                setHasMoreData(false);
                setLoaderList(false);
                setIsLoading(false);

                setPopupContentMalert("Fully Loaded");
                setPopupSeverityMalert("success");
                handleClickOpenPopupMalert();
            } else {
                const filtered = res_employee?.data?.prodresult.filter((item) => item != null);

                const itemsWithSerialNumber = res_employee?.data?.prodresult?.map((item, index) => ({
                    ...item,
                    id: item._id,
                    serialNumber: index + 1,
                    // formatteddate: moment(item.formatteddate).format("DD/MM/YYYY")
                    formatteddate: item.formatteddate

                }));


                setProjmaster((prevData) => [...prevData, ...itemsWithSerialNumber])
                setBatchNumber(batchNum);
                setLoaderList(false);
                setIsLoading(false);
                // setIsLoadMorePopupOpen(true);
            }
        } catch (err) {
            setLoaderList(false);
            setIsLoading(false);
            setHasMoreData(false);
        } finally {
            setLoaderList(false);
            setIsLoading(false);
        }
    };

    const loadMore = () => {
        const nextBatchNumber = batchNumber + 1;
        setBatchNumber(nextBatchNumber);
        fetchBatch(nextBatchNumber);
    };
    const handleLoadMore = () => {
        setIsLoadMorePopupOpen(false); // Close the popup
        const nextBatchNumber = batchNumber + 1;
        setBatchNumber(nextBatchNumber);
        fetchBatch(nextBatchNumber); // Fetch the next batch
    };





    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Production Temp Summary",
        pageStyle: "print",
    });

    const addSerialNumber = async (datas) => {
        setItems(datas);
    };
    useEffect(() => {
        addSerialNumber(projmaster);
    }, [projmaster]);

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
    const searchTerms = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

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
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 85,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "formatteddate",
            headerName: "Date",
            flex: 0,
            width: 160,
            hide: !columnVisibility.formatteddate,
            headerClassName: "bold-header",
        },
        {
            field: "uploaddate",
            headerName: "Upload Date",
            flex: 0,
            width: 160,
            hide: !columnVisibility.uploaddate,
            headerClassName: "bold-header",
        },
        {
            field: "processdate",
            headerName: "Process Date",
            flex: 0,
            width: 160,
            hide: !columnVisibility.processdate,
            headerClassName: "bold-header",
        },
        {
            field: "formatteddate",
            headerName: "Date",
            flex: 0,
            width: 160,
            hide: !columnVisibility.formatteddate,
            headerClassName: "bold-header",
        },
        { field: "vendor", headerName: "Project", flex: 0, width: 200, hide: !columnVisibility.vendor, headerClassName: "bold-header" },
        { field: "vendornew", headerName: "Vendor", flex: 0, width: 200, hide: !columnVisibility.vendornew, headerClassName: "bold-header" },
        { field: "filenameupdated", headerName: "Category", flex: 0, width: 250, hide: !columnVisibility.filenameupdated, headerClassName: "bold-header" },
        // { field: "type", headerName: "Type", flex: 0, width: 180, hide: !columnVisibility.type, headerClassName: "bold-header" },
        { field: "category", headerName: "SubCategory", flex: 0, width: 250, hide: !columnVisibility.category, headerClassName: "bold-header" },
        { field: "matchcount", headerName: "Count", flex: 0, width: 180, hide: !columnVisibility.matchcount, headerClassName: "bold-header" },
        { field: "orate", headerName: "T-rate", flex: 0, width: 120, hide: !columnVisibility.orate, headerClassName: "bold-header" },
        { field: "flagcount", headerName: "Flag Count", flex: 0, width: 120, hide: !columnVisibility.flagcount, headerClassName: "bold-header" },
        { field: "oldtotal", headerName: "Total", flex: 0, width: 120, hide: !columnVisibility.oldtotal, headerClassName: "bold-header" },
        // { field: "newrate", headerName: "New Rate", flex: 0, width: 150, hide: !columnVisibility.newrate, headerClassName: "bold-header" },
        // { field: "newtotal", headerName: "New Total", flex: 0, width: 150, hide: !columnVisibility.newtotal, headerClassName: "bold-header" },
        // { field: "difference", headerName: "Difference", flex: 0, width: 150, hide: !columnVisibility.difference, headerClassName: "bold-header" },

    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            vendor: item.vendor,
            processdate: item.processdate,
            uploaddate: item.uploaddate,
            vendornew: item.vendornew,
            matchcount: item.matchcount,
            fromdate: item.fromdate,
            formatteddate: item.formatteddate,
            filenameupdated: item.filenameupdated,
            category: item.category,
            orate: item.orate,
            flagcount: item.flagcount,
            oldtotal: item.oldtotal,
            flagcount: item.flagcount,
            newrate: item.newrate,
            newtotal: item.newtotal,
            difference: item.difference,
            type: item.type,
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





    const fetchVendorsDropDown = async (e) => {
        setPageName(!pageName)
        const branchArr = e.map((t) => t.name)
        try {

            let res_vendor = await axios.get(SERVICE.VENDORMASTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });


            const projFilt = res_vendor?.data?.vendormaster?.filter((item) => branchArr.includes(item.projectname))
            setVendormasterOpt(
                projFilt?.map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            );


            // setVendormasterOpt(vendorall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const fetchAllCategory = async (e) => {
        const branchArr = e.map((t) => t.name)
        try {
            let res_module = await axios.get(SERVICE.CATEGORYPROD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const categoryOpt = Array.from(new Set(
                res_module?.data?.categoryprod
                    .filter((item) => branchArr.includes(item.project))
                    .map((t) => t.name)
            )).map((name) => ({
                label: name,
                value: name,
            }));
            setCategoryOPt(categoryOpt);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    //get all category.
    const fetchAllSubCategory = async (category, type) => {
        try {
            let res_module = await axios.get(SERVICE.SUBCATEGORYPROD_LIST_LIMITED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const projFilt = res_module?.data?.subcategoryprod


            setSubCategoryOpt(projFilt);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };


    useEffect(() => {

        fetchAllSubCategory();

    }, [selectedOptionsCategory])



    const [fileFormat, setFormat] = useState('')
    const getDateRange = (mode) => {
        const today = new Date();
        let fromdate, todate;

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };

        switch (mode) {
            case "Today":
                fromdate = todate = formatDate(today);
                break;
            case "Tomorrow":
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                fromdate = todate = formatDate(tomorrow);
                break;
            case "Yesterday":
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                fromdate = todate = formatDate(yesterday);
                break;
            case "This Week":
                const startOfThisWeek = new Date(today);
                startOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Monday
                const endOfThisWeek = new Date(startOfThisWeek);
                endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
                fromdate = formatDate(startOfThisWeek);
                todate = formatDate(endOfThisWeek);
                break;
            case "This Month":
                fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
                todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
                break;
            case "Last Week":
                const startOfLastWeek = new Date(today);
                startOfLastWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 - 7); // Last Monday
                const endOfLastWeek = new Date(startOfLastWeek);
                endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
                fromdate = formatDate(startOfLastWeek);
                todate = formatDate(endOfLastWeek);
                break;
            case "Last Month":
                fromdate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)); // 1st of last month
                todate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // Last day of last month
                break;
            default:
                fromdate = todate = "";
        }

        return { fromdate, todate };
    };


    const formatDateForInput = (date) => {
        if (isNaN(date.getTime())) {
            return ''; // Return empty if the date is invalid
        }
        return date.toISOString().split("T")[0]; // Converts date to 'yyyy-MM-dd' format
    };


    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Production Temp Summary"),
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

    return (
        <Box>
            <Headtitle title={"Production Temp Summary"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Production Temp Summary"
                modulename="Production"
                submodulename="SetUp"
                mainpagename="Production Temp Summary"
                subpagename=""
                subsubpagename=""
            />
            <>
                <Box sx={userStyle.selectcontainer}>
                    <Grid item xs={8}>
                        <Typography sx={userStyle.importheadtext}>Production Temp Summary</Typography>
                    </Grid>
                    <>
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth>
                                    <Typography>Project<b style={{ color: "red" }}>*</b></Typography>
                                    <MultiSelect
                                        options={projectOpt}
                                        value={selectedProject}
                                        onChange={(e) => {
                                            handleProjectChange(e);
                                        }}
                                        valueRenderer={customValueRendererProject}
                                        labelledBy="Please Select Project"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth>
                                    <Typography>Vendor<b style={{ color: "red" }}>*</b></Typography>
                                    <MultiSelect
                                        options={vendorOpt}
                                        value={selectedVendor}
                                        onChange={(e) => {
                                            handleVendorChange(e);
                                        }}
                                        valueRenderer={customValueRendererVendor}
                                        labelledBy="Please Select Vendor"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth>
                                    <Typography>Category<b style={{ color: "red" }}>*</b></Typography>
                                    <MultiSelect
                                        options={categoryOpt}
                                        value={selectedOptionsCategory}
                                        onChange={handleCategoryChange}
                                        valueRenderer={customValueRendererCategory}
                                        labelledBy="Please Select Category"
                                    />
                                </FormControl>
                            </Grid>
                            {/* <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Type <b style={{ color: "red" }}>*</b>
                                    </Typography>

                                    <MultiSelect options={typeMaster}
                                        value={selectedTypeFrom}
                                        onChange={handleTypeChangeFrom}
                                        valueRenderer={customValueRendererTypeFrom}
                                        labelledBy="Please Select Type"
                                    />
                                </FormControl>
                            </Grid> */}
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth>
                                    <Typography>Sub Category<b style={{ color: "red" }}>*</b></Typography>
                                    <MultiSelect
                                        // options={subcategory}
                                        options={Array.from(new Set(subcategory
                                            ?.filter(
                                                (comp) =>
                                                    selectedOptionsCategory
                                                        .map((item) => item.value)
                                                        .includes(comp.categoryname)
                                            )
                                            ?.map((com) => com.name)
                                        ))
                                            .map((name) => ({
                                                label: name,
                                                value: name,
                                            }))}
                                        value={selectedOptionsSubCategory}
                                        onChange={handleSubCategoryChange}
                                        valueRenderer={customValueRendererSubCategory}
                                        labelledBy="Please Select SubCategory"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Filter Mode<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        labelId="mode-select-label"
                                        options={mode}
                                        style={colourStyles}
                                        value={{ label: selectedMode, value: selectedMode }}
                                        onChange={(selectedOption) => {
                                            let fromdate = '';
                                            let todate = '';
                                            if (selectedOption.value) {
                                                const dateRange = getDateRange(selectedOption.value);
                                                fromdate = dateRange.fromdate; // Already formatted in 'dd-MM-yyyy'
                                                todate = dateRange.todate; // Already formatted in 'dd-MM-yyyy'
                                            }
                                            setFromdate(formatDateForInput(new Date(fromdate.split('-').reverse().join('-'))))
                                            setTodate(formatDateForInput(new Date(todate.split('-').reverse().join('-'))))
                                            setSelectedMode(selectedOption.value); // Update the mode
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        From Date
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedname"
                                        type="date"
                                        value={fromdate}
                                        disabled={selectedMode != "Custom"}
                                        onChange={(e) => {
                                            setFromdate(e.target.value);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        To  Date
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedname"
                                        type="date"
                                        value={todate}
                                        disabled={selectedMode != "Custom"}
                                        onChange={(e) => {
                                            setTodate(e.target.value);
                                        }}
                                    />
                                </FormControl>

                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={12} >
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmit}>
                                        Filter
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={12} >
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                                        Clear
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lproductiontempsummary") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Production Temp Summary List</Typography>
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
                                        <MenuItem value={projmaster?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelproductiontempsummary") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvproductiontempsummary") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printproductiontempsummary") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfproductiontempsummary") && (
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
                                    {isUserRoleCompare?.includes("imageproductiontempsummary") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>

                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTable}
                                        setItems={setItems}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPage}
                                        maindatas={projmaster}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        paginated={false}
                                        totalDatas={projmaster}
                                    />
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
                        <br />
                        <br />

                        {/* {hasMoreData && !isLoading && projmaster.length > 0 && (
                            <Button variant="contained" onClick={loadMore}>
                                Load More
                            </Button>
                        )} */}
                        <br />
                        {loaderList ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>

                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                                    searchQuery={searchedString}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={projmaster}
                                />
                            </>
                        )}
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
            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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

                <Dialog open={isLoadMorePopupOpen} onClose={handleLoadMoreClosePopup} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "60px", color: "skyblue" }} />
                        <Typography variant="h6">Loaded {projmaster.length} Data</Typography>
                        <Typography variant="body1"> Do you want to load more data?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button sx={buttonStyles.btncancel} onClick={handleLoadMoreClosePopup}>
                            No
                        </Button>
                        <Button sx={buttonStyles.buttonsubmit} onClick={handleLoadMore} color="primary">
                            Yes
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
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={projmaster ?? []}
                filename={"Production Temp Summary"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
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
        </Box>
    );
}

export default ProductionTempSummaryBulkUpdate;