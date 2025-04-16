import ImageIcon from "@mui/icons-material/Image";
import {
    Box,
    Chip,
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
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../components/Alert";
import {
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import AggridTable from "../../components/AggridTable";
import Selects from "react-select";
import domtoimage from 'dom-to-image';

function FlagCountOthertaskList() {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [searchedString, setSearchedString] = useState("")
    const gridRefTable = useRef(null);
    const [isHandleChange, setIsHandleChange] = useState(false);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [isFilterOpenView, setIsFilterOpenView] = useState(false);
    const [isPdfFilterOpenView, setIsPdfFilterOpenView] = useState(false);

    // page refersh reload
    const handleCloseFilterModView = () => {
        setIsFilterOpenView(false);
    };

    const handleClosePdfFilterModView = () => {
        setIsPdfFilterOpenView(false);
    };


    const gridRefview = useRef(null);
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

    let [valueProjectAdd, setValueProjectAdd] = useState("");
    let [valueCategoryAdd, setValueCategoryAdd] = useState("");
    let [valueSubCategoryAdd, setValueSubCategoryAdd] = useState("");
    const [selectedProject, setselectedProject] = useState([]);
    const [selectedCategory, setselectedCategory] = useState([]);
    const [selectedSubCategory, setselectedSubCategory] = useState([]);

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

    const [fileFormat, setFormat] = useState("");
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    const currYear = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState("");
    //state to handle holiday values
    const currentDate = new Date();

    const [manageothertask, setManageothertask] = useState({
        datemonth: "Date",
        fromdate: moment(currentDate).format("YYYY-MM-DD"),
        todate: moment(currentDate).format("YYYY-MM-DD"),
    });

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currYear + 1; year >= currYear - 10; year--) {
        years.push({ value: year, label: year.toString() });
    }
    const [categoryOption, setCategoryOption] = useState([]);
    const [subcategoryOption, setSubcategoryOption] = useState([]);
    const [projectOpt, setProjectopt] = useState([]);
    const { isUserRoleCompare, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };



    useEffect(() => {
        fetchProjectDropdowns();
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
        status: true,
        assignedby: true,
        assignedmode: true,
        ticket: true,
        duedate: true,
        duetime: true,
        estimation: true,
        estimationtime: true,
        diffflagcount: true,
        manualflagcount: true,

        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    //view table
    const initialColumnVisibilityView = {
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

    const [selectAllChecked, setSelectAllChecked] = useState(false);
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
    const [sourceCheck, setSourcecheck] = useState(false);
    const [pageView, setPageView] = useState(1);
    const [pageSizeview, setPageSizeView] = useState(10);
    const [searchQueryView, setSearchQueryView] = useState("");
    const [selectedRowsView, setSelectedRowsView] = useState([]);

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleClickOpenalert = () => {
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            // setIsDeleteOpencheckbox(true);
        }
    };

    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };

    //Delete model
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

    const getRowClassNameView = (params) => {
        if (selectedRowsView.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };



    const [isBtn, setIsBtn] = useState(false)
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


    const [viewall, setViewall] = useState([]);
    const [viewallother, setViewallother] = useState({});
    const [overallFilterdata, setOverallFilterdata] = useState([]);

    // get single row to view....
    const getviewCode = async (data) => {
        setPageName(!pageName)
        try {

            let res = await axios.post(SERVICE.FLAG_COUNT_SORT_VIEW, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                project: data.project,
                category: data.category,
                subcategory: data.subcategory,
                fromdate: data.olddate,
            });
            setViewallother(data)
            setViewall(res.data.mergedData);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //serial no for listing items
    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(overallFilterdata);
    }, [overallFilterdata]);

    // page refersh reload code
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

    const [manageothertasksArray, setManageothertasksArray] = useState([])
    const fetchEmployee = async () => {
        setSourcecheck(true);
        setPageName(!pageName)
        try {
            let res_employee = await axios.post(SERVICE.FLAG_COUNT_SORT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                page: Number(page),
                pageSize: Number(pageSize),
                project: valueProjectAdd,
                category: valueCategoryAdd,
                subcategory: valueSubCategoryAdd,
                fromdate: valueProjectAdd?.length > 0 ? filterUser.fromdate : "",
                todate: valueProjectAdd?.length > 0 ? filterUser.todate : "",
            });

            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                olddate: item.date,
                date: moment(item.date).format("DD-MM-YYYY")
            }));

            setManageothertasksArray(itemsWithSerialNumber.map((item, index) => {
                return {
                    id: item._id,
                    serialNumber: item.serialNumber,
                    project: item.project,
                    category: item.category,
                    subcategory: item.subcategory,
                    total: item.total,
                    ids: item.ids,
                    status: item.status,
                    olddate: item.olddate,
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
                    diffflagcount: item.diffflagcount,
                    manualflagcount: item.manualflagcount,
                };
            }))
            setOverallFilterdata(itemsWithSerialNumber.map((item, index) => {
                return {
                    id: item._id,
                    serialNumber: item.serialNumber,
                    project: item.project,
                    category: item.category,
                    subcategory: item.subcategory,
                    total: item.total,
                    ids: item.ids,
                    status: item.status,
                    olddate: item.olddate,
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
                    diffflagcount: item.diffflagcount,
                    manualflagcount: item.manualflagcount,
                };
            }))
            setSourcecheck(false);
            setSearchQuery("")
        } catch (err) { setSourcecheck(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Flag Count Other Task.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleCaptureImageView = () => {
        if (gridRefview.current) {
            html2canvas(gridRefview.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "View Flag Count Other Task.png");
                });
            });
        }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Flag Count Other Task",
        pageStyle: "print",
    });

    const componentRefView = useRef();
    const handleprintFlag = useReactToPrint({
        content: () => componentRefView.current,
        documentTitle: "View Flag Count Other Task",
        pageStyle: "print",
    });

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
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
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
            width: 70,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left', lockPinned: true,
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 100,
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
            pinned: 'left',

        },
        {
            field: "project",
            headerName: "Project",
            flex: 0,
            width: 160,
            hide: !columnVisibility.project,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "category",
            headerName: "Category",
            flex: 0,
            width: 200,
            hide: !columnVisibility.category,
            headerClassName: "bold-header",
            pinned: 'left',

        },
        {
            field: "subcategory",
            headerName: "Subcategory",
            flex: 0,
            width: 200,
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
            field: "manualflagcount",
            headerName: "Manual Flag Count",
            flex: 0,
            width: 140,
            hide: !columnVisibility.manualflagcount,
            headerClassName: "bold-header",
        },
        {
            field: "diffflagcount",
            headerName: "Difference",
            flex: 0,
            width: 100,
            hide: !columnVisibility.diffflagcount,
            headerClassName: "bold-header",
        },

        {
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 110,
            hide: !columnVisibility.status,
            headerClassName: "bold-header",
            cellRenderer: (params) =>
                <Chip sx={{
                    fontSize: "10px", background: (params.data.status === "Reached") ? "#A3C9AA" : "#fdbb56"
                }}
                    size="small"
                    label={params.data.status}
                    variant="outlined"
                />
            ,
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
                    {isUserRoleCompare?.includes("vothertask&manualentryflagreport") && (
                        <Button sx={{ textTransform: "capitalize", padding: "4px" }}
                            onClick={() => {
                                getviewCode(params.data);
                            }}
                            variant="contained" >
                            View
                        </Button>
                    )}

                </Grid>
            ),
        },
    ];

    const handleclear = (e) => {
        e.preventDefault();
        setselectedCategory([])
        setselectedProject([])
        setCategoryOption([])
        setSubcategoryOption([])
        setselectedSubCategory([])
        setValueProjectAdd("")
        setValueCategoryAdd("")
        setValueSubCategoryAdd("")
        setFilteredChanges(null)
        setFilteredRowData([])
        setPage(1)
        setPageSize(10)
        setSearchQuery("")
        setOverallFilterdata([])
        setManageothertasksArray([])
        setManageothertask({
            datemonth: "Date",
            fromdate: "",
            todate: "",
        })
        setFilterUser({
            fromdate: today,
            todate: today,
            type: "Please Select Type",
            percentage: "",
            day: "Today"
        });
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            project: item.project,
            category: item.category,
            subcategory: item.subcategory,
            total: item.total,
            ids: item.ids,
            status: item.status,
            olddate: item.olddate,
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
            diffflagcount: item.diffflagcount,
            manualflagcount: item.manualflagcount,
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



    //view table
    //view table
    const [itemsView, setItemsView] = useState([]);

    const addSerialNumberView = () => {
        const itemsWithSerialNumberView = viewall?.map((item, index) => ({
            ...item, serialNumber: index + 1,
            createdAt: moment(item.createdAt).format("DD-MM-YYYY hh:mm:ss a")
        }));
        setItemsView(itemsWithSerialNumberView);
    };

    useEffect(() => {
        addSerialNumberView();
    }, [viewall]);

    //Datatable
    const handlePageChangeView = (newPage) => {
        setPageView(newPage);
        setSelectedRowsView([]);
    };

    const handlePageSizeChangeview = (event) => {
        setPageSizeView(Number(event.target.value));
        setPageView(1);
    };

    //datatable....
    const handleSearchChangeview = (event) => {
        setSearchQueryView(event.target.value);
    };
    // Split the search query into individual terms
    const searchTermsView = searchQueryView?.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasView = itemsView?.filter((item) => {
        return searchTermsView.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredDataView = filteredDatasView?.slice((pageView - 1) * pageSizeview, pageView * pageSizeview);

    const totalPagesView = Math.ceil(filteredDatasView?.length / pageSizeview);

    const visiblePagesview = Math.min(totalPagesView, 3);

    const firstVisiblePageview = Math.max(1, pageView - 1);
    const lastVisiblePageView = Math.min(firstVisiblePageview + visiblePagesview - 1, totalPagesView);

    const pageNumbersView = [];

    const indexOfLastItemview = pageView * pageSizeview;
    const indexOfFirstItemView = indexOfLastItemview - pageSizeview;

    for (let i = firstVisiblePageview; i <= lastVisiblePageView; i++) {
        pageNumbersView.push(i);
    }

    const columnDataTableview = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            headerClassName: "bold-header",
        },

        {
            field: "fromdate",
            headerName: "fromdate",
            flex: 0,
            width: 150,
            hide: !columnVisibility.fromdate,
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
            field: "vendor",
            headerName: "Project",
            flex: 0,
            width: 180,
            hide: !columnVisibility.vendor,
            headerClassName: "bold-header",
        },
        {
            field: "filename",
            headerName: "Category",
            flex: 0,
            width: 200,
            hide: !columnVisibility.filename,
            headerClassName: "bold-header",
        },
        {
            field: "category",
            headerName: "Subcategory",
            flex: 0,
            width: 150,
            hide: !columnVisibility.subcategory,
            headerClassName: "bold-header",
        },

        {
            field: "user",
            headerName: "Login Id",
            flex: 0,
            width: 100,
            hide: !columnVisibility.user,
            headerClassName: "bold-header",
        },
        { field: "company", headerName: "Company", flex: 0, width: 80, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 140, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 90, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 90, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 130, hide: !columnVisibility.empcode, headerClassName: "bold-header" },
        { field: "empname", headerName: "Emp Name", flex: 0, width: 260, hide: !columnVisibility.empname, headerClassName: "bold-header" },

        {
            field: "flagcount",
            headerName: "Flag Count",
            flex: 0,
            width: 100,
            hide: !columnVisibility.flagcount,
            headerClassName: "bold-header",
        },
        { field: "unitrate", headerName: "U-Unitrate", flex: 0, width: 100, hide: !columnVisibility.unitrate, headerClassName: "bold-header" },
        { field: "createdAt", headerName: "Alloted Date Time", flex: 0, width: 180, hide: !columnVisibility.createdAt, headerClassName: "bold-header" },
        { field: "points", headerName: "U-Points", flex: 0, width: 100, hide: !columnVisibility.points, headerClassName: "bold-header" },
        { field: "section", headerName: "U-Section", flex: 0, width: 100, hide: !columnVisibility.section, headerClassName: "bold-header" },
        { field: "approvalstatus", headerName: "Approval Status", flex: 0, width: 150, hide: !columnVisibility.approvalstatus, headerClassName: "bold-header" },
        { field: "lateentrystatus", headerName: "Entry Status", flex: 0, width: 150, hide: !columnVisibility.lateentrystatus, headerClassName: "bold-header" },
    ];

    const rowDataTableView = filteredDataView.map((item, index) => {
        return {
            id: item.serialNumber,
            serialNumber: item.serialNumber,
            // ids: item._id,
            vendor: item.vendor,
            category: item.category,
            filename: item.filename,
            fromdate: item.fromdate,
            // ids: item.ids,
            unitid: item.unitid,
            flagcount: item.flagcount,
            alllogin: item.alllogin,
            user: item.user,
            time: item.time,
            fromdate: moment(item.fromdate).format("DD/MM/YYYY"),
            section: item.section,
            lateentrystatus: item.lateentrystatus,
            approvalstatus: item.approvalstatus,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            empcode: item.empcode,
            empname: item.empname,
            unitrate: item.unitrate,
            points: item.points,
            createdAt: item.createdAt
        };
    });

    const rowsWithCheckboxesView = rowDataTableView.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRowsView.includes(row.id),
    }));

    let exportColumnNames = ["Date", "Project", "Category", " Sub Category", "Total", "Manual Flag Count", "Difference", "Status"];
    let exportRowValues = ["date", "project", "category", "subcategory", "total", "manualflagcount", "diffflagcount", "status"];


    let exportColumnNamesView = ["Date", "From Date", "Time", " Project", "Category", "Subcategory", "Login Id", "Company",
        "Branch", "Unit", "Team", "Emp Code", "Emp Name", "Flag Count", "U-Unitrate", "Alloted Date Time", "U-Points", "U-Section",
        "Approval Status", "Entry Status"


    ];
    let exportRowValuesView =
        ["fromdate", "time", "vendor", " filename", "category", "Subcategory", "user", "company",
            "branch", "unit", "team", "empcode", "empname", "flagcount", "unitrate", "createdAt", "points", "section",
            "approvalstatus", "lateentrystatus"
        ];

    const [filterUser, setFilterUser] = useState({
        fromdate: today,
        todate: today,
        percentage: "",
        day: "Today"
    });

    const daysoptions = [
        { label: "Yesterday", value: "Yesterday" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Today", value: "Today" },
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "Custom Fields", value: "Custom Fields" },
    ]

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
            <Headtitle title={"Flag Count Other Task"} />
            {/* ****** Header Content ****** */}
            {/* <Typography sx={userStyle.HeaderText}>Manage Other Task</Typography> */}
            <PageHeading
                title="Flag Count Other Task"
                modulename="Other Tasks"
                submodulename="Other Task & Manual Entry Flag Report"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />


            <>
                {isUserRoleCompare?.includes("aothertask&manualentryflagreport") && (
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Flag Count Other Task Filter
                                    </Typography>
                                </Grid>
                            </Grid>
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

                                <Grid item md={3} sm={12} xs={12}>
                                    <br></br>
                                    <Grid
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: "15px",
                                            marginTop: "8px"
                                        }}
                                    >
                                        <Button sx={buttonStyles.buttonsubmit} onClick={(e) => {
                                            handleSubmit(e)
                                        }} disabled={isBtn}>
                                            Filter
                                        </Button>
                                        <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                                            CLEAR
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </>
                    </Box>
                )}
                <br />
            </>
            {/* )} */}

            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lothertask&manualentryflagreport") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Flag Count Other Task
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
                                        <MenuItem value={manageothertasksArray?.length}>All</MenuItem>
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
                                    {isUserRoleCompare?.includes("excelothertask&manualentryflagreport") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvothertask&manualentryflagreport") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printothertask&manualentryflagreport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfothertask&manualentryflagreport") && (
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
                                    {isUserRoleCompare?.includes("imageothertask&manualentryflagreport") && (
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
                                    maindatas={overallFilterdata}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={manageothertasksArray}
                                />                            </Grid>
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

                        {sourceCheck ? (
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
                                    itemsList={manageothertasksArray}
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
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth={true} maxWidth="lg">
                <Box sx={{ padding: "20px" }}>
                    {/* ******************************************************EXPORT Buttons****************************************************** */}
                    <Grid item xs={8}>
                        <Typography sx={userStyle.HeaderText}>View Flag Count Other Task</Typography>
                    </Grid>

                    <br />
                    <Grid container spacing={2}>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Date</Typography>
                                <Typography>{viewallother.date}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Project</Typography>
                                <Typography>{viewallother.project}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Category</Typography>
                                <Typography>{viewallother.category}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Sub Category</Typography>
                                <Typography>{viewallother.subcategory}</Typography>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <br />
                    <Grid container style={userStyle.dataTablestyle}>
                        <Grid item md={2} xs={12} sm={12}>
                            <Box>
                                <label>Show entries:</label>
                                <Select
                                    id="pageSizeSelect"
                                    size="small"
                                    value={pageSizeview}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 180,
                                                width: 80,
                                            },
                                        },
                                    }}
                                    onChange={handlePageSizeChangeview}
                                    sx={{ width: "77px" }}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                    <MenuItem value={viewall?.length}>All</MenuItem>
                                </Select>
                            </Box>
                        </Grid>
                        {/* <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}></Grid> */}
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
                                {isUserRoleCompare?.includes("excelothertask&manualentryflagreport") && (
                                    <>
                                        <Button
                                            onClick={(e) => {
                                                setIsFilterOpenView(true);
                                                setFormat("xl");
                                            }}
                                            sx={userStyle.buttongrp}
                                        >
                                            <FaFileExcel />
                                            &ensp;Export to Excel&ensp;
                                        </Button>
                                    </>
                                )}

                                {isUserRoleCompare?.includes("csvothertask&manualentryflagreport") && (
                                    <>
                                        <Button
                                            onClick={(e) => {
                                                setIsFilterOpenView(true);
                                                setFormat("csv");
                                            }}
                                            sx={userStyle.buttongrp}
                                        >
                                            <FaFileCsv />
                                            &ensp;Export to CSV&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("printothertask&manualentryflagreport") && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleprintFlag}>
                                            &ensp;
                                            <FaPrint />
                                            &ensp;Print&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("pdfothertask&manualentryflagreport") && (
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
                                {isUserRoleCompare?.includes("imageothertask&manualentryflagreport") && (
                                    <Button
                                        sx={userStyle.buttongrp}
                                        onClick={handleCaptureImageView}
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
                            <Box>
                                <FormControl fullWidth size="small">
                                    <Typography>Search</Typography>
                                    <OutlinedInput id="component-outlined" type="text" value={searchQueryView} onChange={handleSearchChangeview} />
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                    <br />

                    {sourceCheck ? (
                        <>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                {/* <CircularProgress color="inherit" />  */}
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
                                <StyledDataGrid
                                    onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                    rows={rowsWithCheckboxesView}
                                    columns={columnDataTableview}
                                    selectionModel={selectedRowsView}
                                    autoHeight={true}
                                    ref={gridRefview}
                                    density="compact"
                                    hideFooter
                                    getRowClassName={getRowClassNameView}
                                    disableRowSelectionOnClick
                                />
                            </Box>
                            <Box style={userStyle.dataTablestyle}>
                                <Box>
                                    Showing {filteredDataView.length > 0 ? (pageView - 1) * pageSizeview + 1 : 0} to {Math.min(pageView * pageSizeview, filteredDatasView.length)} of {filteredDatasView.length} entries
                                </Box>
                                <Box>
                                    <Button onClick={() => setPageView(1)} disabled={pageView === 1} sx={userStyle.paginationbtn}>
                                        <FirstPageIcon />
                                    </Button>
                                    <Button onClick={() => handlePageChangeView(pageView - 1)} disabled={pageView === 1} sx={userStyle.paginationbtn}>
                                        <NavigateBeforeIcon />
                                    </Button>
                                    {pageNumbersView?.map((pageNumberView) => (
                                        <Button key={pageNumberView} sx={userStyle.paginationbtn} onClick={() => handlePageChangeView(pageNumberView)} className={pageView === pageNumberView ? "active" : ""} disabled={pageView === pageNumberView}>
                                            {pageNumberView}
                                        </Button>
                                    ))}
                                    {lastVisiblePageView < totalPagesView && <span>...</span>}
                                    <Button onClick={() => handlePageChangeView(pageView + 1)} disabled={pageView === totalPagesView} sx={userStyle.paginationbtn}>
                                        <NavigateNextIcon />
                                    </Button>
                                    <Button onClick={() => setPageView(totalPagesView)} disabled={pageView === totalPagesView} sx={userStyle.paginationbtn}>
                                        <LastPageIcon />
                                    </Button>
                                </Box>
                            </Box>
                        </>
                    )}
                    <br />
                    <Box sx={{ display: "flex", justifyContent: "end", width: "100%" }}>
                        <Button sx={buttonStyles.btncancel} onClick={handleCloseview}>
                            {" "}
                            Back{" "}
                        </Button>
                    </Box>
                </Box>
            </Dialog>




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
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={manageothertasksArray ?? []}
                filename={"Flag Count Other Task"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />


            <ExportData
                isFilterOpen={isFilterOpenView}
                handleCloseFilterMod={handleCloseFilterModView}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpenView}
                isPdfFilterOpen={isPdfFilterOpenView}
                setIsPdfFilterOpen={setIsPdfFilterOpenView}
                filteredDataTwo={rowDataTableView ?? []}
                itemsTwo={itemsView ?? []}
                filename={"View Flag Count Other Task"}
                exportColumnNames={exportColumnNamesView}
                exportRowValues={exportRowValuesView}
                componentRef={componentRefView}
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
export default FlagCountOthertaskList;