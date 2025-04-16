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
import ExportDataView from '../../components/ExportData.js';
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
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


function ProductionTempSummary() {


    const [loaderList, setLoaderList] = useState(false)

    const [batchNumber, setBatchNumber] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const gridRefview = useRef(null);


    const [productionoriginalView, setProductionoriginalView] = useState([]);
    const [productionViewCheck, setProductionViewcheck] = useState(false);

    const [filteredRowDataview, setFilteredRowDataview] = useState([]);
    const [filteredChangesview, setFilteredChangesview] = useState(null);
    const [isHandleChangeview, setIsHandleChangeview] = useState(false);
    const [searchedStringview, setSearchedStringview] = useState("");
    const gridRefTableview = useRef(null);
    const gridRefTableImgview = useRef(null);





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
    const [selectedRows, setSelectedRows] = useState([]);

    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleClickOpenalert = () => {
        setIsHandleChange(true);
        if (selectedRowsBulkTemp.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };


    //Delete model
    const [isDeleteOpencheckboxundo, setIsDeleteOpencheckboxundo] = useState(false);

    const handleClickOpencheckboxundo = () => {
        setIsDeleteOpencheckboxundo(true);
    };
    const handleCloseModcheckboxundo = () => {
        setIsDeleteOpencheckboxundo(false);
    };

    //Delete model undo
    const [isDeleteOpenalertundo, setIsDeleteOpenalertundo] = useState(false);
    const handleClickOpenalertundo = () => {
        if (selectedRowsBulkTemp.length === 0) {
            setIsDeleteOpenalertundo(true);
        } else {
            setIsDeleteOpencheckboxundo(true);
        }
    };
    const handleCloseModalertundo = () => {
        setIsDeleteOpenalertundo(false);
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
    const [selectedRowsBulkTemp, setSelectedRowsBulkTemp] = useState([]);
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
        matched: true,
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

    const fetchBatchFilterold = async () => {
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
                }
            );

            let res_bulk = await axios.post(SERVICE.PRODUCTON_SUMMMARY_BULK_TEMP_FILTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                fromdate: fromdate,
                todate: todate,
            });

            const bulkdata = res_bulk.data.productiontempbulks


            const itemsWithSerialNumber = res_employee?.data?.prodresult?.map((item, index) => {
                // const matched = bulkdata.find(d =>
                //     //     d.category === item.category &&
                //     //     d.filenameupdated === item.filenameupdated &&
                //     //     d.project === item.vendor &&
                //     //     d.vendor === item.vendornew &&
                //     //     new Date(d.selectedfromdate) >= new Date(item.selectedfromdate) &&
                //     //     new Date(d.selectedtodate) <= new Date(item.selectedtodate)
                //     console.log(
                //         d.category === item.category,
                //         d.filenameupdated === item.filenameupdated,
                //         d.project === item.vendor,
                //         d.vendor === item.vendornew,
                //         new Date(d.selectedfromdate), new Date(item.selectedfromdate),
                //         new Date(d.selectedtodate), new Date(item.selectedtodate)


                //     )
                // )

                const matched = bulkdata.find(d => {

                    const fromDateValid = new Date(item.selectedfromdate) >= new Date(d.selectedfromdate);
                    const toDateValid = new Date(item.selectedtodate) <= new Date(d.selectedtodate);

                    return d.category === item.category &&
                        d.filenameupdated === item.filenameupdated &&
                        d.project === item.vendor &&
                        d.vendor === item.vendornew &&
                        fromDateValid &&
                        toDateValid;
                });


                console.log(matched, "matched")
                return {
                    ...item,
                    id: item._id,
                    serialNumber: index + 1,
                    matched: matched ? true : false,
                    formatteddate: item.formatteddate
                }
            });
            setProjmaster(itemsWithSerialNumber)

            setIsLoading(false);

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










    const fetchBatchFilter = async () => {
        setProjmaster([]);
        setLoaderList(true);

        try {

            async function fetchDataInBatches() {
                let batchNumber = 1;
                let allData = [];
                let hasMoreData = true;
                let allusers = [];
                let apiUrl;
                let totalBatchNumber = Math.ceil(selectedOptionsSubCategory.length / 500);
                setLoaderList(true);
                while (hasMoreData) {
                    try {
                        apiUrl = SERVICE.PRODUCTION_TEMP_SUMMARY_REPORT;
                        const currentBatch = Number(batchNumber) * 500;
                        const beforeBatch = (Number(batchNumber) - 1) * 500;

                        const response = await axios.post(
                            apiUrl,
                            {

                                filename: selectedOptionsCategory.map((item) => item.value),
                                category: selectedOptionsSubCategory.map((item) => item.value).slice(beforeBatch, currentBatch),
                                project: selectedProject.map(item => item.value),
                                projectvendor: projvendor,
                                fromdate: fromdate,
                                todate: todate,
                                page: page,
                                pageSize: pageSize,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${auth.APIToken}`,
                                },
                            }
                        );


                        const productionupload = response.data.prodresult || [];
                        if (batchNumber > 0 && batchNumber > totalBatchNumber) {
                            hasMoreData = false;
                        } else {
                            let filtered = productionupload.filter((item) => item != null && item !== undefined);
                            allData = [...filtered];
                            console.log(batchNumber, totalBatchNumber, filtered.length, 'batch');
                            batchNumber++;
                        }
                    } catch (err) {
                        console.log(err, 'err123888');
                        setLoaderList(false);
                        setPopupContentMalert(err.response.data.message === 'shifttiming' ? 'Shifttime value is undefined' : 'something went wrong!');
                        setPopupSeverityMalert('info');
                        handleClickOpenPopupMalert();

                        allData = -1;

                        hasMoreData = false;
                    }
                }

                return allData;
            }

            fetchDataInBatches().then(async (allData) => {
                try {

                    let res_bulk = await axios.post(SERVICE.PRODUCTON_SUMMMARY_BULK_TEMP_FILTER, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        fromdate: fromdate,
                        todate: todate,
                    });

                    const bulkdata = res_bulk.data.productiontempbulks
                    const itemsWithSerialNumber = allData?.map((item, index) => {


                        const matched = bulkdata.find(d => {

                            const fromDateValid = new Date(item.selectedfromdate) >= new Date(d.selectedfromdate);
                            const toDateValid = new Date(item.selectedtodate) <= new Date(d.selectedtodate);

                            return d.category === item.category &&
                                d.filenameupdated === item.filenameupdated &&
                                d.project === item.vendor &&
                                d.vendor === item.vendornew &&
                                fromDateValid &&
                                toDateValid;
                        });

                        console.log(matched, "matched")
                        return {
                            ...item,

                            id: index + 1,
                            serialNumber: index + 1,
                            matched: matched ? true : false,
                            formatteddate: item.formatteddate
                        }

                    });
                    setProjmaster(itemsWithSerialNumber)
                    setLoaderList(false);
                } catch (err) {
                    setLoaderList(false);
                }
            })
        } catch (err) {
            console.log(err, "erroerro")
            setLoaderList(false);
            setIsLoading(false);
            setHasMoreData(false);
        }
    };



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
        setSelectedRowsBulkTemp([]);
        setSelectAllChecked(false);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRowsBulkTemp([]);
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

    // const totalPages = Math.ceil(filteredDatas?.length / pageSize);
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
            width: 85,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "matched", headerName: "Status", flex: 0, width: 150, hide: !columnVisibility.matched, headerClassName: "bold-header",
            cellRenderer: (params) => (

                <Grid sx={{ display: "flex" }}>
                    {/* <Typography>{params.data.matched ? "Created" : "Pending"}</Typography> */}
                    {params.data.matched === true ?
                        <Chip
                            sx={{ height: "25px", borderRadius: "0px" }}
                            color={"success"}
                            variant="outlined"
                            label={"Created"}
                        />
                        :
                        <Chip
                            sx={{ height: "25px", borderRadius: "0px" }}
                            color={"warning"}
                            variant="outlined"
                            label={"Pending"}
                        />

                    }
                </Grid>
            ),

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

                    <Button
                        sx={userStyle.buttonedit}
                        onClick={() => {
                            getviewCode(params.data);
                        }}
                    >
                        <VisibilityOutlinedIcon style={{ fontsize: 'large' }} />
                    </Button>

                </Grid>
            ),
        },

    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.serialNumber,
            serialNumber: item.serialNumber,
            vendor: item.vendor,
            selectedfromdate: item.selectedfromdate,
            selectedtodate: item.selectedtodate,
            fromdate: item.fromdate,
            matched: item.matched,
            todate: item.todate,
            processdate: item.processdate,
            uploaddate: item.uploaddate,
            vendornew: item.vendornew,
            matchcount: item.matchcount,
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
        checkbox: selectedRowsBulkTemp.includes(row.id),
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


    const delGroupcheckbox = async () => {
        setPageName(!pageName)
        if (selectedRowsBulkTemp.filter(item => item.matched != true).length === 0) {


            setPopupContentMalert("Already These Data Added");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
            handleCloseModcheckbox();

        } else {




            try {
                const deletePromises = selectedRowsBulkTemp.filter(item => item.matched != true)?.map((item) => {
                    return axios.post(`${SERVICE.GET_PRODUCTIONTEMP_BULK_CREATE}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        project: item.vendor,
                        vendor: item.vendornew,
                        selectedfromdate: item.selectedfromdate,
                        selectedtodate: item.selectedtodate,
                        // fromdate: item.fromdate,
                        // todate: item.todate,
                        filenameupdated: item.filenameupdated,
                        category: item.category,
                        count: item.matchcount,
                        addedby: [
                            {
                                name: String(isUserRoleAccess?.username),
                                date: String(new Date()),
                            },
                        ],

                    });
                });

                // Wait for all delete requests to complete
                await Promise.all(deletePromises);
                setIsHandleChange(false);
                handleCloseModcheckbox();
                setSelectedRowsBulkTemp([]);
                setSelectAllChecked(false);
                setPage(1);
                setFilteredRowData([])
                setFilteredChanges(null)
                await fetchBatchFilterold();
                setPopupContent("Updated Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
            } catch (err) {
                handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            }
        }
    };


    const delGroupcheckboxundo = async () => {
        setPageName(!pageName)



        try {
            const deletePromises = selectedRowsBulkTemp?.map((item) => {
                return {
                    project: item.vendor,
                    vendor: item.vendornew,
                    // fromdate: item.fromdate,
                    // todate: item.todate,
                    selectedfromdate: item.selectedfromdate,
                    selectedtodate: item.selectedtodate,
                    filenameupdated: item.filenameupdated,
                    category: item.category,
                    count: item.matchcount,

                }
            });

            const bulkundo = await axios.post(`${SERVICE.PRODUCTON_SUMMMARY_TEMP_BULK_UNDO}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                rows: deletePromises

            });


            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            setIsHandleChange(false);
            handleCloseModcheckboxundo();
            setSelectedRowsBulkTemp([]);
            setSelectAllChecked(false);
            setPage(1);
            setFilteredRowData([])
            setFilteredChanges(null)
            await fetchBatchFilterold()
            setPopupContent("Undo Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    const initialColumnVisibilityview = {
        serialNumber: true,
        checkbox: true,
        unitrate: true,
        matched: true,
        project: true,
        vendornew: true,
        vendor: true,
        formatteddate: true,
        filenameupdated: true,
        category: true,
        orate: true,
        flagcount: true,
        oldtotal: true,
        fromdate: true,
        todate: true,

    };

    const [columnVisibilityview, setColumnVisibilityview] = useState(initialColumnVisibilityview);



    const [pageview, setPageview] = useState(1);
    const [pageSizeview, setPageSizeview] = useState(10);

    const [searchQueryview, setSearchQueryview] = useState('');
    const [searchQueryManageview, setSearchQueryManageview] = useState('');

    const [isFilterOpenView, setIsFilterOpenView] = useState(false);
    const [isPdfFilterOpenView, setIsPdfFilterOpenView] = useState(false);

    // page refersh reload
    const handleCloseFilterModView = () => {
        setIsFilterOpenView(false);
    };

    const handleClosePdfFilterModView = () => {
        setIsPdfFilterOpenView(false);
    };

    let exportColumnNamesView = ['From Date', 'To Date', 'Process Date', 'Project', "Category", 'Sub Category', 'Orate', 'Flag Count', 'Total'];

    let exportRowValuesView = ['fromdate', 'todate', 'formatteddate', 'vendor', 'filenameupdated', 'category', 'unitrate', 'flagcount', 'oldtotal'];


    //image view
    const handleCaptureImageview = () => {
        if (gridRefview.current) {
            html2canvas(gridRefview.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Production Temp Summary View .png');
                });
            });
        }
    };

    //print.view..
    const componentRefview = useRef();
    const handleprintview = useReactToPrint({
        content: () => componentRefview.current,
        documentTitle: 'Production Temp Summary View',
        pageStyle: 'print',
    });

    // view model
    const [openview, setOpenview] = useState(false);

    const handleClickOpenview = (e, reason) => {
        if (reason && reason === 'backdropClick') return;
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);

        setColumnVisibilityview(initialColumnVisibilityview);
    };


    // Manage Columns
    const [isManageColumnsOpenview, setManageColumnsOpenview] = useState(false);
    const [anchorElview, setAnchorElview] = useState(null);

    const handleOpenManageColumnsview = (event) => {
        setAnchorElview(event.currentTarget);
        setManageColumnsOpenview(true);
    };
    const handleCloseManageColumnsview = () => {
        setManageColumnsOpenview(false);
        setSearchQueryManageview('');
    };

    const openviewpop = Boolean(anchorElview);
    const idview = openviewpop ? 'simple-popover' : undefined;

    // view table codes
    const [itemsview, setItemsview] = useState([]);

    const addSerialNumberview = () => {
        const itemsWithSerialNumber = productionoriginalView?.map((item, index) => {

            return {
                ...item,
                serialNumber: index + 1,
                fromdate: moment(item.fromdate).format("DD/MM/YYYY"),
                todate: moment(item.fromdate).format("DD/MM/YYYY"),
                oldtotal: Number(item.unitrate) * Number(item.flagcount),
                formatteddate: moment(item.formatteddate).format("DD/MM/YYYY"),
            };
        });
        setItemsview(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumberview();
    }, [productionoriginalView]);

    //Datatable
    const handlePageChangeview = (newPage) => {
        setPageview(newPage);
    };

    const handlePageSizeChangeview = (event) => {

        setPageSize(Number(event.target.value));
        setSelectedRowsBulkTemp([]);
        setPageview(1);
    };

    //datatable....
    const handleSearchChangeview = (event) => {
        setSearchQueryview(event.target.value);
        setPageview(1);
    };
    // Split the search query into individual terms
    const searchTermsview = searchQueryview.toLowerCase().split(' ');
    // Modify the filtering logic to check each term
    const filteredDataviews = itemsview?.filter((item) => {
        return searchTermsview.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
    });

    const filteredDataview = filteredDataviews.slice((pageview - 1) * pageSizeview, pageview * pageSizeview);

    const totalPagesview = Math.ceil(filteredDataviews.length / pageSizeview);

    const visiblePagesview = Math.min(totalPagesview, 3);

    const firstVisiblePageview = Math.max(1, pageview - 1);
    const lastVisiblePageview = Math.min(firstVisiblePageview + visiblePagesview - 1, totalPagesview);

    const pageNumbersview = [];

    const indexOfLastItemview = pageview * pageSizeview;
    const indexOfFirstItemview = indexOfLastItemview - pageSizeview;

    for (let i = firstVisiblePageview; i <= lastVisiblePageview; i++) {
        pageNumbersview.push(i);
    }


    const columnDataTableview =
        [



            {
                field: "serialNumber",
                headerName: "SNo",
                flex: 0,
                width: 85,
                hide: !columnVisibilityview.serialNumber,
                headerClassName: "bold-header",
            },


            {
                field: "fromdate",
                headerName: "From Date",
                flex: 0,
                width: 160,
                hide: !columnVisibilityview.fromdate,
                headerClassName: "bold-header",
            },
            {
                field: "todate",
                headerName: "To Date",
                flex: 0,
                width: 160,
                hide: !columnVisibilityview.todate,
                headerClassName: "bold-header",
            },
            { field: "formatteddate", headerName: "Process Date", flex: 0, width: 200, hide: !columnVisibilityview.formatteddate, headerClassName: "bold-header" },

            { field: "vendor", headerName: "Project", flex: 0, width: 200, hide: !columnVisibilityview.vendor, headerClassName: "bold-header" },
            { field: "filenameupdated", headerName: "Category", flex: 0, width: 250, hide: !columnVisibilityview.filenameupdated, headerClassName: "bold-header" },
            { field: "category", headerName: "SubCategory", flex: 0, width: 250, hide: !columnVisibilityview.category, headerClassName: "bold-header" },
            { field: "unitrate", headerName: "Orate", flex: 0, width: 120, hide: !columnVisibilityview.unitrate, headerClassName: "bold-header" },
            { field: "flagcount", headerName: "Flag Count", flex: 0, width: 120, hide: !columnVisibilityview.flagcount, headerClassName: "bold-header" },
            { field: "oldtotal", headerName: "Total", flex: 0, width: 120, hide: !columnVisibilityview.oldtotal, headerClassName: "bold-header" },
        ];

    const rowDataTableview = filteredDataview.map((item, index) => {
        return {
            id: item.serialNumber,
            status: item.status,
            serialNumber: item.serialNumber,
            vendor: item.vendor,
            fromdate: item.fromdate,
            unitrate: item.unitrate,
            todate: item.todate,
            vendornew: item.vendornew,
            processdate: item.processdate,
            uploaddate: item.uploaddate,
            matchcount: item.matchcount,
            fromdate: item.fromdate,
            matched: item.matched,
            todate: item.todate,
            vendorold: item.vendorold,
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


    // Show All Columns functionality
    const handleShowAllColumnsview = () => {
        const updatedVisibility = { ...columnVisibilityview };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityview(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem('columnVisibilityview');
        if (savedVisibility) {
            setColumnVisibilityview(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem('columnVisibilityview', JSON.stringify(columnVisibilityview));
    }, [columnVisibilityview]);

    // // Function to filter columns based on search query
    const filteredColumnsview = columnDataTableview.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

    // Manage Columns functionality
    const toggleColumnVisibilityview = (field) => {
        setColumnVisibilityview((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentview = (
        <Box style={{ padding: '10px', minWidth: '325px', '& .MuiDialogContent-root': { padding: '10px 0' } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsview}
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageview} onChange={(e) => setSearchQueryManageview(e.target.value)} sx={{ marginBottom: 5, position: 'absolute' }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%' }}>
                    {filteredColumnsview.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: 'flex' }}
                                primary={<Switch sx={{ marginTop: '-5px' }} size="small" checked={columnVisibilityview[column.field]} onChange={() => toggleColumnVisibilityview(column.field)} />}
                                secondary={column.field === 'checkbox' ? 'Checkbox' : column.headerName}
                            // secondary={column.headerName }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: 'none' }} onClick={() => setColumnVisibilityview(initialColumnVisibilityview)}>
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
                                columnDataTableview.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityview(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );



    const getviewCode = async (data) => {
        try {
            handleClickOpenview();
            setProductionViewcheck(false);

            let res = await axios.post(SERVICE.PRODUCTION_TEMP_SUMMARY_REPORT_VIEW, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                filename: data.filenameupdated,
                category: data.category,
                projectvendor: data.vendor + "-" + data.vendornew,
                fromdate: data.selectedfromdate,
                todate: data.selectedtodate,
                // flagcount: data.flagcount

            });
            let vendorincludes = res?.data?.productionupload
            // .map((item) => ({ ...item, vendor: vendor, fromdate: from, todate: to }));
            setProductionoriginalView(vendorincludes);


        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        } finally {
            setProductionViewcheck(true);
            setPageview(1);
            setColumnVisibilityview(initialColumnVisibilityview);
        }
    };



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
                        <Button
                            onClick={handleClickOpenalert}
                            color="primary"
                            variant="contained"
                        >
                            {" "}
                            Bulk Update
                        </Button>
                        &ensp;
                        <Button
                            onClick={handleClickOpenalertundo}
                            color="error"
                            variant="contained"
                        >
                            {" "}
                            Bulk Undo
                        </Button>
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
                                    selectedRowsBulkTemp={selectedRowsBulkTemp}
                                    setSelectedRowsBulkTemp={setSelectedRowsBulkTemp}
                                    pagenamecheck={"Production Temp Bulk"}
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


            <Dialog
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                    <Typography variant="h5" sx={{ color: 'primary', textAlign: 'center' }}>Are You Want To Update?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Cancel</Button>
                    <Button autoFocus variant="contained" color='primary'
                        onClick={(e) => delGroupcheckbox(e)}
                    > Yes </Button>
                </DialogActions>
            </Dialog>

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


            <Dialog
                open={isDeleteOpencheckboxundo}
                onClose={handleCloseModcheckboxundo}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                    <Typography variant="h5" sx={{ color: 'primary', textAlign: 'center' }}>Are You Want To Undo?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModcheckboxundo} sx={userStyle.btncancel}>Cancel</Button>
                    <Button autoFocus variant="contained" color='error'
                        onClick={(e) => delGroupcheckboxundo(e)}
                    > Yes </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={isDeleteOpenalertundo}
                onClose={handleCloseModalertundo}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: 'orange' }} />
                    <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>Please Select any Row</Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus variant="contained" color='error'
                        onClick={handleCloseModalertundo}
                    > OK </Button>
                </DialogActions>
            </Dialog>


            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" fullWidth={true} maxWidth="lg"
                sx={{ marginTop: "95px" }}
            >
                <DialogContent>
                    <>
                        <Typography sx={userStyle.HeaderText}>Production Temp Summary View</Typography>
                        <br />
                        <Grid container style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizeview}
                                        size="small"
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangeview}
                                        sx={{ width: '77px' }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={productionoriginalView?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box>
                                    {isUserRoleCompare?.includes('excelproductionoriginalsummary') && (
                                        // <>
                                        //   <ExportXL
                                        //     csvData={filteredDataview?.map((t, index) => {
                                        //       return {
                                        //         Sno: index + 1,

                                        //         Date: t.createddate, // Update the Date field
                                        //         Filename: t.filenamelist,
                                        //         "Total Data": t.totaldata,
                                        //       };
                                        //     })}
                                        //     fileName={fileName}
                                        //   />
                                        // </>
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpenView(true);

                                                    setFormat('xl');
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileExcel />
                                                &ensp;Export to Excel&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes('csvproductionoriginalsummary') && (
                                        // <>
                                        //   <ExportCSV
                                        //     csvData={filteredDataview?.map((t, index) => {
                                        //       return {
                                        //         Sno: index + 1,

                                        //         Date: t.createddate, // Update the Date field
                                        //         Filename: t.filenamelist,
                                        //         "Total Data": t.totaldata,
                                        //       };
                                        //     })}
                                        //     fileName={fileName}
                                        //   />
                                        // </>
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpenView(true);
                                                    setFormat('csv');
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileCsv />
                                                &ensp;Export to CSV&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes('printproductionoriginalsummary') && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprintview}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes('pdfproductionoriginalsummary') && (
                                        // <>
                                        //   <Button sx={userStyle.buttongrp} onClick={() => downloadPdfview()}>
                                        //     <FaFilePdf />
                                        //     &ensp;Export to PDF&ensp;
                                        //   </Button>
                                        // </>
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpenView(true);
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes('imageproductionoriginalsummary') && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImageview}>
                                            {' '}
                                            <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTableview}
                                        setItems={setItemsview}
                                        addSerialNumber={addSerialNumberview}
                                        setPage={setPageview}
                                        maindatas={productionoriginalView}
                                        setSearchedString={setSearchedStringview}
                                        searchQuery={searchQueryview}
                                        setSearchQuery={setSearchQueryview}
                                        paginated={false}
                                        totalDatas={productionoriginalView}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsview}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsview}>
                            Manage Columns
                        </Button>
                        {/* Manage Column */}
                        <Popover
                            id={idview}
                            open={isManageColumnsOpenview}
                            anchorEl={anchorElview}
                            onClose={handleCloseManageColumnsview}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            {manageColumnsContentview}
                        </Popover>
                        <br />
                        <br />
                        {!productionViewCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>

                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>

                                <AggridTable
                                    rowDataTable={rowDataTableview}
                                    columnDataTable={columnDataTableview}
                                    columnVisibility={columnVisibilityview}
                                    page={pageview}
                                    setPage={setPageview}
                                    pageSize={pageSizeview}
                                    totalPages={totalPagesview}
                                    setColumnVisibility={setColumnVisibilityview}
                                    items={itemsview}
                                    selectedRowsBulkTemp={selectedRowsBulkTemp}
                                    setSelectedRowsBulkTemp={setSelectedRowsBulkTemp}
                                    selectedRows={selectedRows}
                                    setSelectedRows={setSelectedRows}
                                    gridRefTable={gridRefTableview}
                                    pagenamecheck={"Production Temp Bulk"}
                                    paginated={false}
                                    filteredDatas={filteredDataviews}
                                    searchQuery={searchedStringview}
                                    handleShowAllColumns={handleShowAllColumnsview}
                                    setFilteredRowData={setFilteredRowDataview}
                                    filteredRowData={filteredRowDataview}
                                    setFilteredChanges={setFilteredChangesview}
                                    filteredChanges={filteredChangesview}
                                    gridRefTableImg={gridRefTableImgview}
                                    itemsList={projmaster}
                                />
                                <ExportDataView
                                    isFilterOpen={isFilterOpenView}
                                    handleCloseFilterMod={handleCloseFilterModView}
                                    fileFormat={fileFormat}
                                    setIsFilterOpen={setIsFilterOpenView}
                                    isPdfFilterOpen={isPdfFilterOpenView}
                                    setIsPdfFilterOpen={setIsPdfFilterOpenView}
                                    handleClosePdfFilterMod={handleClosePdfFilterModView}
                                    filteredDataTwo={(filteredChangesview !== null ? filteredRowDataview : rowDataTableview) ?? []}
                                    itemsTwo={productionoriginalView ?? []}
                                    filename={'Production Temp Summary View'}
                                    exportColumnNames={exportColumnNamesView}
                                    exportRowValues={exportRowValuesView}
                                    componentRef={componentRefview}
                                />

                            </>
                        )}
                        <br />
                    </>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={handleCloseview}>
                        {' '}
                        Back{' '}
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}

export default ProductionTempSummary;