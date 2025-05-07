import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, TextField, Typography } from "@mui/material";
import Switch from '@mui/material/Switch';
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
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

function AccuracyQueueGrouping() {
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
    }
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState("");    //state to handle holiday values
    const [accuracyqueuegrouping, setAccuracyqueuegrouping] = useState({
        project: "Please Select Project",
        category: "",
        queue: "Please Select Queue",
    });
    const [accuracyqueuegroupingEdit, setAccuracyqueuegroupingEdit] = useState({
        project: "Please Select Project",
        category: "",
        queue: "Please Select Queue",
    });

    const pathname = window.location.pathname;

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Accuracy Queue Grouping"),
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

    const [categoryOption, setCategoryOption] = useState([]);
    const [queueOption, setQueueOption] = useState([]);
    const [projectOpt, setProjectopt] = useState([]); const [categoryOptionEdit, setCategoryOptionEdit] = useState([]);
    const [queueOptionEdit, setQueueOptionEdit] = useState([]);
    const [projectOptEdit, setProjectoptEdit] = useState([]);
    const [accuracyqueuegroupings, setAccuracyqueuegroupings] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch,
        buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [statusCheck, setStatusCheck] = useState(true); const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false); let exportColumnNames = ["Project", "Queue", "Category"];
    let exportRowValues = ["project", "queue", "category"];
    const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
    let [valueCate, setValueCate] = useState(""); const handleCategoryChange = (options) => {
        setValueCate(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCate(options);
    }; const customValueRendererCate = (valueCate, _categorys) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Category";
    };    // Edit functionlity
    const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]); const handleCategoryChangeEdit = (options) => {
        // setValueCateEdit(options.map((a, index) => {
        //     return a.value
        // }))
        setSelectedOptionsCateEdit(options);
    }; const customValueRendererCateEdit = (valueCateEdit, _categorys) => {
        return valueCateEdit.length ? valueCateEdit.map(({ label }) => label).join(", ") : "Please Select Category";
    };
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteHoliday, setDeleteHoliday] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    }; const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    }; const fetchProjectDropdowns = async () => {
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
            ]; setProjectopt(companyall);
            setProjectoptEdit(companyall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const fetchQueueDropdowns = async (e) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.ACCURACYMASTERGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            }); let result = res_project.data.accuracymaster.filter((d) => d.projectvendor === e.value); const catall = result.map((d) => ({
                ...d,
                label: d.queue,
                value: d.queue,
            })); setQueueOption(catall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }; const fetchQueueDropdownsEdit = async (e) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.ACCURACYMASTERGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            }); let result = res_project.data.accuracymaster.filter((d) => d.projectvendor === e); const catall = result.map((d) => ({
                ...d,
                label: d.queue,
                value: d.queue,
            })); setQueueOptionEdit(catall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }; const fetchCategoryDropdowns = async (e) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.CATEGORYPROD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_project.data.categoryprod.filter((d) => d.project === e.value); const catall = result.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            })); setCategoryOption(catall);
            setCategoryOptionEdit(catall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const fetchCategoryDropdownsEdit = async (e) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.CATEGORYPROD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            }); let result = res_project.data.categoryprod.filter((d) => d.project === e); const catall = result.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            })); setCategoryOptionEdit(catall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }; useEffect(() => {
        fetchProjectDropdowns();
    }, []);    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        project: true,
        queue: true,
        category: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
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
    // info model
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };
    //Delete model
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false); const handleClickOpenalert = () => {
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    }; const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false); const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };    // page refersh reload code
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
    };    //set function to get particular row
    const rowData = async (id, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.ACCURACYQUEUEGROUPING_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteHoliday(res.data.saccuracyqueuegrouping);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };    // Alert delete popup

    const delHoliday = async () => {
        setPageName(!pageName)
        try {
            await axios.delete(`${SERVICE.ACCURACYQUEUEGROUPING_SINGLE}/${deleteHoliday._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchEmployee(); handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }; const [isBtn, setIsBtn] = useState(false)    //add function
    const sendRequest = async () => {
        setIsBtn(true)
        setPageName(!pageName)
        try {
            let statusCreate = await axios.post(SERVICE.ACCURACYQUEUEGROUPING_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                project: String(accuracyqueuegrouping.project),
                queue: String(accuracyqueuegrouping.queue),
                category: [...valueCate],
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchEmployee();
            setIsBtn(false)
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { setIsBtn(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();

        const isNameMatch = accuracyqueuegroupings?.some((item) =>
            item.project?.toLowerCase() === accuracyqueuegrouping.project?.toLowerCase() &&
            item.queue?.toLowerCase() === accuracyqueuegrouping.queue?.toLowerCase() &&
            item.category?.some((data) => valueCate?.includes(data)));

        if (accuracyqueuegrouping.project === 'Please Select Project') {
            setPopupContentMalert("Please Select Project");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (accuracyqueuegrouping.queue === "Please Select Queue") {
            setPopupContentMalert("Please Select Queue");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsCate.length == 0) {
            setPopupContentMalert("Please Select Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data already exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    };
    const handleclear = (e) => {
        e.preventDefault();
        setAccuracyqueuegrouping({
            project: "Please Select Project",
            category: "",
            queue: "Please Select Queue",
        });
        setSelectedOptionsCate([]);
        setQueueOption([]);
        setValueCate([]);
        setCategoryOption([]);
        setSelectedOptionsCate([]);
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
            let res = await axios.get(`${SERVICE.ACCURACYQUEUEGROUPING_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAccuracyqueuegroupingEdit(res?.data?.saccuracyqueuegrouping);
            fetchQueueDropdownsEdit(res?.data?.saccuracyqueuegrouping.project);
            fetchCategoryDropdownsEdit(res?.data?.saccuracyqueuegrouping.project);
            setSelectedOptionsCateEdit(res?.data?.saccuracyqueuegrouping.category.map((item) => ({
                ...item,
                label: item,
                value: item,
            })))
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.ACCURACYQUEUEGROUPING_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAccuracyqueuegroupingEdit(res?.data?.saccuracyqueuegrouping);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.ACCURACYQUEUEGROUPING_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAccuracyqueuegroupingEdit(res?.data?.saccuracyqueuegrouping);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // updateby edit page...
    let updateby = accuracyqueuegroupingEdit?.updatedby;
    let addedby = accuracyqueuegroupingEdit?.addedby;
    let holidayId = accuracyqueuegroupingEdit?._id;
    //editing the single data...
    const sendEditRequest = async () => {
        let employ = selectedOptionsCateEdit.map((item) => item.value);
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.ACCURACYQUEUEGROUPING_SINGLE}/${holidayId}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                project: String(accuracyqueuegroupingEdit.project),
                queue: String(accuracyqueuegroupingEdit.queue),
                category: [...employ],
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            await fetchEmployee();
            handleCloseModEdit();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }; 
    const editSubmit = async (e) => {
        e.preventDefault();
        let resdata = await fetchAccuracyqueuegroupingAll();
        let categoriessEditt = selectedOptionsCateEdit.map((item) => item.value);
        const isNameMatch = resdata.some((item) => item.project === accuracyqueuegroupingEdit.project && item.queue === accuracyqueuegroupingEdit.queue && item.category.some((data) => categoriessEditt.includes(data)));
        if (accuracyqueuegroupingEdit.project === 'Please Select Project') {
            setPopupContentMalert("Please Select Project");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (accuracyqueuegroupingEdit.queue === "Please Select Queue") {
            setPopupContentMalert("Please Select Queue");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsCateEdit.length == 0) {
            setPopupContentMalert("Please Select Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isNameMatch) {
            setPopupContentMalert("Data already exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    }
    const [overallFilterdata, setOverallFilterdata] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);

    const fetchEmployee = async () => {
        setPageName(!pageName)

        try {
            let res_employee = await axios.get(SERVICE.ACCURACYQUEUEGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const ans = res_employee?.data?.accuracyqueuegroupings
                ?.length > 0 ? res_employee?.data?.accuracyqueuegroupings
                : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
            }));

            setAccuracyqueuegroupings(itemsWithSerialNumber)
            setOverallFilterdata(itemsWithSerialNumber);

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    }; useEffect(() => {
        fetchEmployee();
    }, [page, pageSize, searchQuery]);    //get all data.
    const fetchAccuracyqueuegroupingAll = async () => {
        setPageName(!pageName)
        try {
            let res_status = await axios.get(SERVICE.ACCURACYQUEUEGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            return res_status?.data?.accuracyqueuegroupings.filter((item) => item._id !== accuracyqueuegroupingEdit._id)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Accuracy Queue Grouping.png");
                });
            });
        }
    };


    // Excel
    const fileName = "Accuracy Queue Grouping";    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Accuracy Queue Grouping",
        pageStyle: "print",
    });
    //serial no for listing items
    const addSerialNumber = () => {
        const itemsWithSerialNumber = accuracyqueuegroupings?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
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
        setPage(1);
    };
    // Split the search query into individual terms
    const searchOverAllTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = overallFilterdata?.filter((item) => {
        return searchOverAllTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });
    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];
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
                            updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                        } setSelectedRows(updatedSelectedRows);
                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(updatedSelectedRows.length === filteredDatas.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 90,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 90,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        { field: "project", headerName: "Project", flex: 0, width: 150, hide: !columnVisibility.project, headerClassName: "bold-header" },
        { field: "queue", headerName: "Queue", flex: 0, width: 150, hide: !columnVisibility.queue, headerClassName: "bold-header" },
        { field: "category", headerName: "Category", flex: 0, width: 250, hide: !columnVisibility.category, headerClassName: "bold-header" },
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
                    {isUserRoleCompare?.includes("eaccuracyqueuegrouping") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.row.id);
                            }}
                        >
                            <EditOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("daccuracyqueuegrouping") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vaccuracyqueuegrouping") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iaccuracyqueuegrouping") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getinfoCode(params.row.id);
                            }}
                        >
                            <InfoOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttoninfo} />
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
            project: item.project,
            queue: item.queue,
            category: item.category.toString(),
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
            <IconButton aria-label="close" onClick={handleCloseManageColumns} sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
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
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
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
                            {" "}
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    ); useEffect(() => {
        fetchEmployee();
    }, []); useEffect(() => {
        addSerialNumber();
    }, [accuracyqueuegroupings]);

    const delAccountcheckbox = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.ACCURACYQUEUEGROUPING_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });            // Wait for all delete requests to complete
            await Promise.all(deletePromises); handleCloseModcheckbox();
            setSelectAllChecked(false);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup(); await fetchEmployee();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }; 
    const [fileFormat, setFormat] = useState('')

    return (
        <Box>
            <Headtitle title={"Accuracy Queue Grouping"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Accuracy Queue Grouping"
                modulename="Quality"
                submodulename="Accuracy"
                mainpagename="Accuracy Queue Grouping"
                subpagename=""
                subsubpagename=""
            />
            {!statusCheck ? (
                <Box sx={userStyle.container}>
                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </Box>
            ) : (
                <>
                    {isUserRoleCompare?.includes("aaccuracyqueuegrouping") && (
                        <Box sx={userStyle.selectcontainer}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>Add Accuracy Queue Grouping</Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Project <b style={{ color: "red" }}>*</b>{" "}
                                            </Typography>
                                            <Selects
                                                options={projectOpt}
                                                styles={colourStyles}
                                                value={{
                                                    label: accuracyqueuegrouping.project,
                                                    value: accuracyqueuegrouping.project,
                                                }}
                                                onChange={(e) => {
                                                    setAccuracyqueuegrouping({
                                                        ...accuracyqueuegrouping,
                                                        project: e.value,
                                                        queue: "Please Select Queue",
                                                    });
                                                    setSelectedOptionsCate([]);
                                                    fetchQueueDropdowns(e);
                                                    fetchCategoryDropdowns(e);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Queue<b style={{ color: "red" }}>*</b>{" "}
                                            </Typography>
                                            <Selects
                                                options={queueOption}
                                                styles={colourStyles}
                                                value={{
                                                    label: accuracyqueuegrouping.queue,
                                                    value: accuracyqueuegrouping.queue,
                                                }}
                                                onChange={(e) => {
                                                    setAccuracyqueuegrouping({
                                                        ...accuracyqueuegrouping,
                                                        queue: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>                                    <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Category <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={categoryOption}
                                                value={selectedOptionsCate}
                                                onChange={handleCategoryChange}
                                                valueRenderer={customValueRendererCate}
                                                labelledBy="Please Select Category"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid item md={12} sm={12} xs={12}>

                                    <Grid
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: "15px",
                                        }}
                                    >
                                        <Button variant="contained"
                                            onClick={handleSubmit}
                                            disabled={isBtn}
                                            sx={buttonStyles.buttonsubmit}
                                        >
                                            SAVE
                                        </Button>
                                        <Button
                                            onClick={handleclear}
                                            sx={buttonStyles.btncancel}
                                        >
                                            CLEAR
                                        </Button>
                                    </Grid>
                                </Grid>                            </>
                        </Box>
                    )}
                    <br />
                </>
            )}            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("laccuracyqueuegrouping") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Accuracy Queue Grouping List</Typography>
                        </Grid>
                        <Grid container spacing={2} style={{...userStyle.dataTablestyle,display:'flex',alignItems:'center'}}>
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
                                        {/* <MenuItem value={accuracyqueuegroupings?.length}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelaccuracyqueuegrouping") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvaccuracyqueuegrouping") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printaccuracyqueuegrouping") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfaccuracyqueuegrouping") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageaccuracyqueuegrouping") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                                    </FormControl>
                                </Box>
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
                        {isUserRoleCompare?.includes("bdaccuracyqueuegrouping") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert} sx={buttonStyles.buttonbulkdelete}>
                                Bulk Delete
                            </Button>)}
                        <br />
                        <br />
                        <Box style={{ width: "100%", overflowY: "hidden" }}>
                            <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                        </Box>
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

            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                sx={{ marginTop: "80px" }}
            >
                <Box sx={{ padding: "30px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Accuracy Queue Grouping</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Project</Typography>
                                    <Typography>{accuracyqueuegroupingEdit.project}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Queue</Typography>
                                    <Typography>{accuracyqueuegroupingEdit.queue}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Category</Typography>
                                    <Typography>
                                        {Array.isArray(accuracyqueuegroupingEdit?.category) &&
                                            accuracyqueuegroupingEdit.category
                                                .map((message, index) => `${index + 1}. ${message}`)
                                                .join("\n")
                                        }
                                    </Typography>                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview} sx={buttonStyles.btncancel}>
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
                    maxWidth="md"
                    fullWidth={true}
                    sx={{
                        overflow: 'visible',
                        '& .MuiPaper-root': {
                            overflow: 'visible',
                        },
                    }}
                >
                    <Box sx={{ padding: '30px' }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}> Edit Accuracy Queue Grouping </Typography>
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
                                                label: accuracyqueuegroupingEdit.project,
                                                value: accuracyqueuegroupingEdit.project,
                                            }}
                                            onChange={(e) => {
                                                setAccuracyqueuegroupingEdit({
                                                    ...accuracyqueuegroupingEdit,
                                                    project: e.value,
                                                    queue: "Please Select Queue",
                                                });
                                                setSelectedOptionsCateEdit([]);
                                                fetchQueueDropdownsEdit(e.value);
                                                fetchCategoryDropdownsEdit(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Queue<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={queueOptionEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: accuracyqueuegroupingEdit.queue,
                                                value: accuracyqueuegroupingEdit.queue,
                                            }}
                                            onChange={(e) => {
                                                setAccuracyqueuegroupingEdit({
                                                    ...accuracyqueuegroupingEdit,
                                                    queue: e.value,
                                                });
                                                // fetchSubcategoryDropdownsEdit(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Category <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect className="custom-multi-select"
                                            id="component-outlined"
                                            options={categoryOptionEdit}
                                            value={selectedOptionsCateEdit}
                                            onChange={handleCategoryChangeEdit}
                                            valueRenderer={customValueRendererCateEdit}
                                            labelledBy="Please Select Category" />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained" onClick={editSubmit} sx={buttonStyles.buttonsubmit}>
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button onClick={handleCloseModEdit} sx={buttonStyles.btncancel}>
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
                itemsTwo={accuracyqueuegroupings ?? []}
                filename={"Accuracy Queue Grouping"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Accuracy Queue Grouping Info"
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
            />        </Box>
    );
}
export default AccuracyQueueGrouping;
