import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle.js";
import StyledDataGrid from "../../../components/TableStyle.js";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import 'jspdf-autotable';
import axios from "axios";
import { SERVICE } from '../../../services/Baseservice.js';
import { handleApiError } from "../../../components/Errorhandling.js";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext.js';
import Headtitle from "../../../components/Headtitle.js";
import { ThreeDots } from 'react-loader-spinner';
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import Pagination from '../../../components/Pagination.js';
import ExportData from "../../../components/ExportData.js";
import AlertDialog from "../../../components/Alert.js";
import MessageAlert from "../../../components/MessageAlert.js";
import InfoPopup from "../../../components/InfoPopup.js";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import PageHeading from "../../../components/PageHeading.js";

function CategoryDateChange() {

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

    let exportColumnNames = ['Project', 'Category', 'Sub Category'];
    let exportRowValues = ['project', 'category', 'subcategory'];

    const [categoryDateChange, setCategoryDateChange] = useState({
        project: "Please Select Project",
        category: "Please Select Category",
    });
    const [selectedOptionsSubCat, setSelectedSubCategory] = useState([])
    let [valueSubCategoryCat, setValueSubCategoryCat] = useState([]);
    const [teamOption, setProjOption] = useState([]);
    const [categoryDateChangeEdit, setCategoryDateChangeEdit] = useState({
        project: "Please Select Project",
        category: "Please Select Category",
    })
    const [selectedOptionsSubCatEdit, setSelectedSubCategoryEdit] = useState([])
    let [valueSubCategoryCatEdit, setValueSubCategoryCatEdit] = useState([]);
    const [categoryDateChangeData, setCategoryDateChangeData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [sourceCheck, setSourcecheck] = useState(false);
    const username = isUserRoleAccess.username
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Category Date Change.png');
                });
            });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
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
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
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
    const [anchorEl, setAnchorEl] = useState(null)

    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("")
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const getRowClassName = (params) => {
        if ((selectedRows).includes(params.row.id)) {
            return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns 
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        project: true,
        category: true,
        subcategory: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const customValueRendererSubCategory = (valueSubCategoryCat, _categoryname) => {
        return valueSubCategoryCat?.length
            ? valueSubCategoryCat.map(({ label }) => label)?.join(", ")
            : "Please Select Sub Category";
    };

    const handleSubCategoryChange = (options) => {
        setValueSubCategoryCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedSubCategory(options);
    };

    const customValueRendererSubCategoryEdit = (valueSubCategoryCatEdit, _categoryname) => {
        return valueSubCategoryCatEdit?.length
            ? valueSubCategoryCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Sub Category";
    };

    const handleSubCategoryChangeEdit = (options) => {
        setValueSubCategoryCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedSubCategoryEdit(options);
    };

    //get all project.
    const fetchProjMaster = async () => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const projOption = [...res_project?.data?.projmaster.map((item) => ({
                ...item,
                label: item.name,
                value: item.name
            }))]
            setProjOption(projOption);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const [catOption, setCatOption] = useState([])
    //get all category.
    const fetchAllCategory = async (proj) => {
        setPageName(!pageName)
        try {
            let res_module = await axios.get(SERVICE.CATEGORYPROD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const filterCate = res_module?.data?.categoryprod.filter((item) => item.project === proj);

            setCatOption([...filterCate.map((item) => ({
                ...item,
                label: item.name,
                value: item.name
            }))])
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const [subCatOpt, setSubCatOption] = useState([])

    //get all category.
    const fetchAllSubCategory = async (cat) => {

        setPageName(!pageName)
        try {
            let res_module = await axios.get(SERVICE.SUBCATEGORYPROD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const filterSubCat = res_module?.data?.subcategoryprod.filter((item) => item.project === categoryDateChange.project && item.categoryname === cat)
            setSubCatOption([...filterSubCat.map((item) => ({
                ...item,
                label: item.name,
                value: item.name,
            }))])
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const [subCatOptionEdit, setSubCatOptionEdit] = useState([])
    const fetchAllSubCategoryEdit = async (cat, proj) => {
        setPageName(!pageName)
        try {
            let res_module = await axios.get(SERVICE.SUBCATEGORYPROD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const filterSubCat = res_module?.data?.subcategoryprod.filter((item) => item.project === proj && item.categoryname === cat)
            setSubCatOptionEdit(filterSubCat.map((item) => ({
                ...item,
                label: item.name,
                value: item.name,
            })))
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    const [deleteSource, setDeleteSource] = useState("");

    const rowData = async (id, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.CATEGORYDATECHANGE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteSource(res?.data?.categorydatechange);
            handleClickOpen();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    // Alert delete popup
    let Sourcesid = deleteSource?._id;
    const delSource = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = await axios.delete(`${SERVICE.CATEGORYDATECHANGE_SINGLE}/${Sourcesid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchEmployee();
            await fetchSource();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1)
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const delSourcecheckbox = async () => {
        setPageName(!pageName)
        try {

            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.CATEGORYDATECHANGE_SINGLE}/${item}`, {
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
            await fetchEmployee();
            await fetchSource();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //add function 
    const sendRequest = async () => {
        setPageName(!pageName)
        try {
            let subprojectscreate = await axios.post(SERVICE.CATEGORYDATECHANGE_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                project: String(categoryDateChange.project),
                category: String(categoryDateChange.category),
                subcategory: valueSubCategoryCat,
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            })
            await fetchEmployee();
            await fetchSource();
            setCategoryDateChange({
                ...categoryDateChange,
                project: "Please Select Project",
                category: "Please Select Category"
            })
            setSelectedSubCategory([]);
            setCatOption([]);
            setSubCatOption([]);
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = categoryDateChangeData.some(item =>
            item.project === categoryDateChange.project &&
            item.category === categoryDateChange.category &&
            item.subcategory.some((item) => valueSubCategoryCat.includes(item))
        );
        if (categoryDateChange.project === "Please Select Project") {
            setPopupContentMalert("Please Select Project");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (categoryDateChange.category === "Please Select Category") {
            setPopupContentMalert("Please Select Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsSubCat.length === 0) {
            setPopupContentMalert("Please Select Sub Category");
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
    }

    const handleClear = (e) => {
        e.preventDefault();
        setCategoryDateChange({
            ...categoryDateChange,
            project: "Please Select Project",
            category: "Please Select Category"
        })
        setSelectedSubCategory([]);
        setCatOption([]);
        setSubCatOption([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    }

    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick")
            return;
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
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.CATEGORYDATECHANGE_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setCategoryDateChangeEdit(res?.data?.categorydatechange);
            fetchAllCategory(res?.data?.categorydatechange?.project)
            setSelectedSubCategoryEdit(res?.data?.categorydatechange?.subcategory.map((t) => ({ ...t, label: t, value: t })))
            setValueSubCategoryCatEdit(res?.data?.categorydatechange?.subcategory.map((a, index) => {
                return a;
            }))
            fetchAllSubCategoryEdit(res?.data?.categorydatechange?.category, res?.data?.categorydatechange?.project)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.CATEGORYDATECHANGE_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setCategoryDateChangeEdit(res?.data?.categorydatechange);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.CATEGORYDATECHANGE_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setCategoryDateChangeEdit(res?.data?.categorydatechange);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //Project updateby edit page...
    let updateby = categoryDateChangeEdit?.updatedby;
    let addedby = categoryDateChangeEdit?.addedby;
    let subprojectsid = categoryDateChangeEdit?._id;

    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.CATEGORYDATECHANGE_SINGLE}/${subprojectsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                project: String(categoryDateChangeEdit.project),
                category: String(categoryDateChangeEdit.category),
                subcategory: valueSubCategoryCatEdit,
                updatedby: [
                    ...updateby, {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchEmployee(); fetchSource();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    const editSubmit = async (e) => {
        e.preventDefault();
        let resdata = await fetchSourceAll();
        const isNameMatch = resdata.some(item =>
            item.project === categoryDateChangeEdit.project &&
            item.category === categoryDateChangeEdit.category &&
            item.subcategory.some((item) => valueSubCategoryCatEdit.includes(item))
        );
        if (categoryDateChangeEdit.project === "Please Select Project") {
            setPopupContentMalert("Please Select Project");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (categoryDateChangeEdit.category === "Please Select Category") {
            setPopupContentMalert("Please Select Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsSubCatEdit.length === 0) {
            setPopupContentMalert("Please Select Sub Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data already exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    }

    //get all Sub vendormasters.
    const fetchSource = async () => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.CATEGORYDATECHANGE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSourcecheck(true)
            setCategoryDateChangeData(res_vendor?.data?.categorydatechange);
        } catch (err) { setSourcecheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    const [overallFilterdata, setOverallFilterdata] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchEmployee = async () => {
        setPageName(!pageName)
        try {
            let res_employee = await axios.post(SERVICE.CATEGORYDATECHANGE_SORT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                page: Number(page),
                pageSize: Number(pageSize),
                searchQuery: searchQuery
            });
            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
            }));
            setOverallFilterdata(itemsWithSerialNumber);
            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            setSourcecheck(true);
        } catch (err) { setSourcecheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchEmployee();
    }, [page, pageSize, searchQuery]);

    const [categoryDateChangeDataArray, setCategoryDateChangeDataArray] = useState([])

    const fetchSourceArray = async () => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.CATEGORYDATECHANGE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSourcecheck(true)
            setCategoryDateChangeDataArray(res_vendor?.data?.categorydatechange);
        } catch (err) { setSourcecheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    useEffect(() => {
        fetchSourceArray()
    }, [isFilterOpen])

    //get all Sub vendormasters.
    const fetchSourceAll = async () => {
        setPageName(!pageName)
        try {
            let res_meet = await axios.get(SERVICE.CATEGORYDATECHANGE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            return res_meet?.data?.categorydatechange.filter(item => item._id !== categoryDateChangeEdit._id)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Category Date Change',
        pageStyle: 'print'
    });

    useEffect(() => {
        fetchEmployee();
        fetchSource();
        fetchProjMaster()
    }, [])
    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = categoryDateChangeData?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [categoryDateChangeData])

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false)
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false)
        setPage(1);
    };

    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = overallFilterdata?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox
                checked={selectAllChecked}
                onChange={onSelectAll}
            />
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
                        setSelectAllChecked(updatedSelectedRows.length === filteredDatas.length);

                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 90,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header"
        },
        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 100, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
        },
        { field: "project", headerName: "Project", flex: 0, width: 250, hide: !columnVisibility.project, headerClassName: "bold-header" },
        { field: "category", headerName: "Category", flex: 0, width: 250, hide: !columnVisibility.category, headerClassName: "bold-header" },
        { field: "subcategory", headerName: "Sub Category", flex: 0, width: 250, hide: !columnVisibility.subcategory, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    {isUserRoleCompare?.includes("ecategorydatechange") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {
                            handleClickOpenEdit();
                            getCode(params.row.id, params.row.name);
                        }}><EditOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                    )}
                    {isUserRoleCompare?.includes("dcategorydatechange") && (
                        <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.row.id, params.row.name) }}>
                            <DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vcategorydatechange") && (
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
                    {isUserRoleCompare?.includes("icategorydatechange") && (
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
                </Grid>
            ),
        },
    ]

    const rowDataTable = filteredDatas.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            project: item.project,
            category: item.category,
            subcategory: item.subcategory?.toString()

        }
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

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibility");
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
    }, [columnVisibility]);

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
        <Box style={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }} >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumns}
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
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManage}
                    onChange={(e) => setSearchQueryManage(e.target.value)}
                    sx={{ marginBottom: 5, position: 'absolute', }}
                />
            </Box><br /><br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%', }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: 'flex' }}
                                primary={
                                    <Switch sx={{ marginTop: "-5px" }} size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={(column.field === "checkbox") ? "Checkbox" : column.headerName}
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
                            sx={{ textTransform: 'none', }}
                            onClick={() => setColumnVisibility(initialColumnVisibility)}
                        >
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

    const [fileFormat, setFormat] = useState('')

    return (
        <Box>
            <Headtitle title={'CATEGORY DATE CHANGE'} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Category Date Change"
                modulename="Production"
                submodulename="SetUp"
                mainpagename="Category Date Change"
                subpagename=""
                subsubpagename=""
            />

            {isUserRoleCompare?.includes("acategorydatechange")
                && (
                    <>

                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>Add Category Date Change</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Project<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                id="component-outlined"
                                                type="date"
                                                options={teamOption}
                                                value={{ label: categoryDateChange.project, value: categoryDateChange.project }}
                                                onChange={(e) => {
                                                    setCategoryDateChange({
                                                        ...categoryDateChange,
                                                        project: e.value,
                                                        category: "Please Select Category"
                                                    });
                                                    fetchAllCategory(e.value)
                                                    setSelectedSubCategory([])
                                                    setSubCatOption([])
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Category<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                id="component-outlined"
                                                type="date"
                                                options={catOption}
                                                value={{ label: categoryDateChange.category, value: categoryDateChange.category }}
                                                onChange={(e) => {
                                                    setCategoryDateChange({
                                                        ...categoryDateChange,
                                                        category: e.value,
                                                    });
                                                    fetchAllSubCategory(e.value)
                                                    setSelectedSubCategory([])
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Sub Category <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={subCatOpt}
                                                value={selectedOptionsSubCat}
                                                onChange={(e) => {
                                                    handleSubCategoryChange(e);
                                                }}
                                                valueRenderer={customValueRendererSubCategory}
                                                labelledBy="Please Select Sub Category"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />  <br />
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
                                        >
                                            Save
                                        </Button>
                                        <Button sx={userStyle.btncancel}
                                            onClick={handleClear}
                                        >
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
                        overflow: 'visible',
                        '& .MuiPaper-root': {
                            overflow: 'visible',
                        },
                    }}
                >
                    <Box sx={{ padding: '20px' }}>
                        <>
                            <form onSubmit={editSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Category Date Change Edit</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>

                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Project<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                id="component-outlined"
                                                type="date"
                                                options={teamOption}
                                                value={{ label: categoryDateChangeEdit.project, value: categoryDateChangeEdit.project }}
                                                onChange={(e) => {
                                                    setCategoryDateChangeEdit({
                                                        ...categoryDateChangeEdit,
                                                        project: e.value,
                                                        category: "Please Select Category"
                                                    });
                                                    fetchAllCategory(e.value)
                                                    setSelectedSubCategoryEdit([])
                                                    setSubCatOptionEdit([])
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Category<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                id="component-outlined"
                                                type="date"
                                                options={catOption}
                                                value={{ label: categoryDateChangeEdit.category, value: categoryDateChangeEdit.category }}
                                                onChange={(e) => {
                                                    setCategoryDateChangeEdit({
                                                        ...categoryDateChangeEdit,
                                                        category: e.value,
                                                    });
                                                    fetchAllSubCategoryEdit(e.value, categoryDateChangeEdit.project)
                                                    setSelectedSubCategoryEdit([])
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Sub Category <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={subCatOptionEdit}
                                                value={selectedOptionsSubCatEdit}
                                                onChange={(e) => {
                                                    handleSubCategoryChangeEdit(e);
                                                }}
                                                valueRenderer={customValueRendererSubCategoryEdit}
                                                labelledBy="Please Select Sub Category"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button variant="contained" type="submit">Update</Button>
                                    </Grid>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button sx={userStyle.btncancel} onClick={handleCloseModEdit} >Cancel</Button>
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
            {isUserRoleCompare?.includes("lcategorydatechange") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Category Date Change List</Typography>
                        </Grid>

                        <br />

                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label >Show entries:</label>
                                    <Select id="pageSizeSelect" value={pageSize}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        {/* <MenuItem value={(categoryDateChangeData?.length)}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelcategorydatechange") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchSourceArray()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvcategorydatechange") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchSourceArray()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printcategorydatechange") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfcategorydatechange") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                    fetchSourceArray()
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagecategorydatechange") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                    )}
                                </Box >
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small" >
                                        <Typography>Search</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        {isUserRoleCompare?.includes("bdcategorydatechange") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button>)}
                        <br /><br />
                        {!sourceCheck ?
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
                            :
                            <>
                                <Box
                                    style={{
                                        width: '100%',
                                        overflowY: 'hidden', // Hide the y-axis scrollbar
                                    }}
                                >
                                    <StyledDataGrid
                                        onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                        rows={rowsWithCheckboxes}
                                        columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                                        onSelectionModelChange={handleSelectionChange}
                                        selectionModel={selectedRows}
                                        autoHeight={true}
                                        ref={gridRef}
                                        density="compact"
                                        hideFooter
                                        getRowClassName={getRowClassName}
                                        disableRowSelectionOnClick
                                    />
                                </Box>
                                <Box>
                                    <Pagination
                                        page={searchQuery !== "" ? 1 : page}
                                        pageSize={pageSize}
                                        totalPages={searchQuery !== "" ? 1 : totalPages}
                                        onPageChange={handlePageChange}
                                        pageItemLength={filteredDatas?.length}
                                        totalProjects={
                                            searchQuery !== "" ? filteredDatas?.length : totalProjects
                                        }
                                    />
                                </Box>

                            </>}
                    </Box>
                </>
            )
            }
            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
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
                maxWidth="sm"
                fullWidth={true}
            >
                <Box sx={{ padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>Category Date Change View </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>

                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Project</Typography>
                                    <Typography>{categoryDateChangeEdit.project}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Category</Typography>
                                    <Typography>{categoryDateChangeEdit.category}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub Category</Typography>
                                    <Typography>{categoryDateChangeEdit.subcategory?.toString()}</Typography>
                                </FormControl>
                            </Grid>

                        </Grid>
                        <br /> <br />  <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview}> Back </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            <br />
            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
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
                filteredDataTwo={filteredDatas ?? []}
                itemsTwo={categoryDateChangeDataArray ?? []}
                filename={"Category Date Change"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Category Date Change Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delSource}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delSourcecheckbox}
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


export default CategoryDateChange;