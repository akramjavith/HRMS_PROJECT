import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid,
    Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton
} from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { handleApiError } from "../../components/Errorhandling";
import 'jspdf-autotable';
import axios from "axios";
import { SERVICE } from '../../services/Baseservice';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { UserRoleAccessContext, AuthContext } from '../../context/Appcontext';
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from 'react-loader-spinner';
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import { MultiSelect } from "react-multi-select-component";
import LoadingButton from "@mui/lab/LoadingButton";
import ExportData from "../../components/ExportData";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import InfoPopup from "../../components/InfoPopup.js";
import { DeleteConfirmation, PleaseSelectRow, } from "../../components/DeleteConfirmation.js";
import PageHeading from "../../components/PageHeading";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';

function AssetCatgoryGrouping() {
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

    let exportColumnNames = ['Category', 'Subcategory', 'Asset Options'];
    let exportRowValues = ['categoryname', 'subcategoryname', 'assetoptions']

    const [assetcategorygrp, setAssetcategorygrp] = useState({ categoryname: "", subcategoryname: "", assetoptions: "None", });
    const [assetcategorygrpEdit, setAssetcategorygrpEdit] = useState({ categoryname: "", subcategoryname: "", assetoptions: "None", })
    const [assetcategorygrps, setAssetcategorygrps] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [assetoptions, setAssetoptions] = useState("None");
    const [assetoptionsEdit, setAssetoptionsEdit] = useState("None");
    const [isBtn, setIsBtn] = useState(false);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [assetcategorygrpCheck, setAssetcategorygrpcheck] = useState(false);
    const gridRef = useRef(null);
    const gridRefTable = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');
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

    const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
    let [valueCate, setValueCate] = useState("");

    const handleCategoryChange = (options) => {
        setValueCate(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCate(options);
    };

    const customValueRendererCate = (valueCate, _categorys) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Category";
    };

    // Edit functionlity
    const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]);

    const handleCategoryChangeEdit = (options) => {
        setSelectedOptionsCateEdit(options);
        fetchCategoryBasedEdit(options.map(item => item.value));
    };

    const customValueRendererCateEdit = (valueCateEdit, _categorys) => {
        return valueCateEdit.length ? valueCateEdit.map(({ label }) => label).join(", ") : "Please Select Category";
    };

    // Subcategroy multi select
    const [selectedOptionsSubCate, setSelectedOptionsSubCate] = useState([]);
    let [valueSubCate, setValueSubCate] = useState("");

    const handleSubCategoryChange = (options) => {
        setValueSubCate(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsSubCate(options);
    };

    const customValueRendererSubCate = (valueSubCate, _subcategorys) => {
        return valueSubCate.length ? valueSubCate.map(({ label }) => label).join(", ") : "Please Select Subcategory";
    };

    // Edit functionlity
    const [selectedOptionsSubCateEdit, setSelectedOptionsSubCateEdit] = useState([]);

    const handleSubCategoryChangeEdit = (options) => {

        setSelectedOptionsSubCateEdit(options);
    };

    const customValueRendererSubCateEdit = (valueSubCateEdit, _subcategorys) => {
        return valueSubCateEdit.length ? valueSubCateEdit.map(({ label }) => label).join(", ") : "Please Select Subcategory";
    };

    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Material Category Grouping.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Material Category Grouping"),
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

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchedString, setSearchedString] = useState("");

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
        categoryname: true,
        subcategoryname: true,
        assetoptions: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };
    const [deleteAssetcategorygrp, setDeleteAssetcategorygrp] = useState("");

    const rowData = async (id, name) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.ASSETCATEGORYGROUPING_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteAssetcategorygrp(res?.data?.sassetcategorygrouping);
            handleClickOpen();

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    // Alert delete popup
    let Assetsid = deleteAssetcategorygrp?._id;
    const delAssetcategory = async (id) => {
        setPageName(!pageName)
        try {
            let res = await axios.delete(`${SERVICE.ASSETCATEGORYGROUPING_SINGLE}/${Assetsid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchAssetcatgorygrp();
            handleCloseMod();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const delAssetcategorycheckbox = async () => {
        setPageName(!pageName);
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.ASSETCATEGORYGROUPING_SINGLE}/${item}`, {
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
            await fetchAssetcatgorygrp();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const [categorys, setCategorys] = useState([]);
    const [subcategorys, setSubcategorys] = useState([])
    const [categorysEdit, setCategorysEdit] = useState([]);
    const [subcategorysEdit, setSubcategorysEdit] = useState([])

    const fetchCategoryTicket = async () => {
        setPageName(!pageName);
        try {
            let res_category = await axios.get(SERVICE.CATEGORYTICKET, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let data_set = res_category.data.ticketcategory.map((d) => d.categoryname);
            let filter_opt = [...new Set(data_set)];

            setCategorys(
                filter_opt.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );

            setCategorysEdit(
                filter_opt.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchCategoryBased = async (e) => {
        let employ = e.map((item) => item.value);

        try {
            let res_category = await axios.get(SERVICE.CATEGORYTICKET, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            let data_set = res_category.data.ticketcategory
                .filter((data) => {
                    return employ.includes(data.categoryname);
                })
                .map((value) => value.subcategoryname);

            let ans = [].concat(...data_set);

            let filter_opt = [...new Set(ans)];

            setSubcategorys(
                filter_opt.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchCategoryBasedEdit = async (e) => {
        try {
            let res_category = await axios.get(SERVICE.CATEGORYTICKET, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            let data_set = res_category.data.ticketcategory
                .filter((data) => {
                    return e.includes(data.categoryname);
                })
                .map((value) => value.subcategoryname);

            let ans = [].concat(...data_set);

            let filter_opt = [...new Set(ans)];

            setSubcategorysEdit(
                filter_opt.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //add function 
    const sendRequest = async () => {
        setPageName(!pageName);
        setIsBtn(true)
        try {
            let subprojectscreate = await axios.post(SERVICE.ASSETCATEGORYGROUPING_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                categoryname: [...valueCate],
                subcategoryname: [...valueSubCate],
                assetoptions: String(assetoptions),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            })
            await fetchAssetcatgorygrp();
            setAssetcategorygrp({ ...assetcategorygrp, })
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsBtn(false)
        } catch (err) { setIsBtn(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    //submit option for saving
    const handleSubmit = (e) => {
        let categorys = selectedOptionsCate.map((item) => item.value);
        let subcategorys = selectedOptionsSubCate.map((item) => item.value);
        e.preventDefault();
        const isNameMatch = assetcategorygrps.some(item => item.categoryname.some((data) => categorys.includes(data))
            && item.subcategoryname.some((data) => subcategorys.includes(data)));
        if (selectedOptionsCate.length == 0) {
            setPopupContentMalert("Please Select Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsSubCate.length == 0) {
            setPopupContentMalert("Please Select  Subcategory");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data already Exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    }

    const handleClear = (e) => {
        e.preventDefault();
        setAssetcategorygrp({ categoryname: "", subcategoryname: "", assetoptions: "None", })
        setSelectedOptionsCate([]);
        setSubcategorys([]);
        setAssetoptions("None")
        setSelectedOptionsSubCate([]);
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
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.ASSETCATEGORYGROUPING_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setAssetcategorygrpEdit(res?.data?.sassetcategorygrouping);
            fetchCategoryBasedEdit(res?.data?.sassetcategorygrouping.categoryname);
            setSelectedOptionsCateEdit(res?.data?.sassetcategorygrouping.categoryname.map((item) => ({
                ...item,
                label: item,
                value: item,
            })))
            setSelectedOptionsSubCateEdit(res?.data?.sassetcategorygrouping.subcategoryname.map((item) => ({
                ...item,
                label: item,
                value: item,
            })))
            setAssetoptionsEdit(res?.data?.sassetcategorygrouping.assetoptions);
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.ASSETCATEGORYGROUPING_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setAssetcategorygrpEdit(res?.data?.sassetcategorygrouping);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.ASSETCATEGORYGROUPING_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setAssetcategorygrpEdit(res?.data?.sassetcategorygrouping);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchCategoryTicket();
    }, [])

    //Project updateby edit page...
    let updateby = assetcategorygrpEdit?.updatedby;
    let addedby = assetcategorygrpEdit?.addedby;
    let subprojectsid = assetcategorygrpEdit?._id;

    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName);
        let empCate = selectedOptionsCateEdit.map((item) => item.value);
        let empSubcate = selectedOptionsSubCateEdit.map((item) => item.value);
        try {
            let res = await axios.put(`${SERVICE.ASSETCATEGORYGROUPING_SINGLE}/${subprojectsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                categoryname: [...empCate],
                subcategoryname: [...empSubcate],
                assetoptions: String(assetoptionsEdit),
                updatedby: [
                    ...updateby, {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchAssetcatgorygrp();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    const editSubmit = async (e) => {
        e.preventDefault();
        let resdata = await fetchAssetcategorygrpAll();
        let categorysEditt = selectedOptionsCateEdit.map((item) => item.value);
        let subcategorysEditt = selectedOptionsSubCateEdit.map((item) => item.value);
        const isNameMatch = resdata.some(item => item.categoryname.some((data) => categorysEditt.includes(data))
            && item.subcategoryname.some((data) => subcategorysEditt.includes(data)));
        if (selectedOptionsCateEdit.length == 0) {
            setPopupContentMalert("Please Select Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsSubCateEdit.length == 0) {
            setPopupContentMalert("Please Select  Subcategory");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data already Exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    }

    //get all Sub vendormasters.
    const fetchAssetcatgorygrp = async () => {
        setPageName(!pageName);
        try {
            let res_vendor = await axios.get(SERVICE.ASSETCATEGORYGROUPING, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setAssetcategorygrpcheck(true)
            setAssetcategorygrps(res_vendor?.data?.assetcategorygroupings.map((item, index) => ({ ...item, serialNumber: index + 1 })));
        } catch (err) { setAssetcategorygrpcheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    //get all Sub vendormasters.
    const fetchAssetcategorygrpAll = async () => {
        setPageName(!pageName);
        try {
            let res_vendor = await axios.get(SERVICE.ASSETCATEGORYGROUPING, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            return res_vendor?.data?.assetcategorygroupings.filter(item => item._id !== assetcategorygrpEdit._id)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Material Category Grouping',
        pageStyle: 'print'
    });

    useEffect(() => {
        fetchAssetcatgorygrp();
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
    const addSerialNumber = (datas) => {
        setItems(datas);
    }
    useEffect(() => {
        addSerialNumber(assetcategorygrps);
    }, [assetcategorygrps])

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
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(filteredDatas.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    const [selectAllChecked, setSelectAllChecked] = useState(false);

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
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 100, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
        },
        { field: "categoryname", headerName: "Category", flex: 0, width: 250, hide: !columnVisibility.categoryname, headerClassName: "bold-header" },
        { field: "subcategoryname", headerName: "Subcategory", flex: 0, width: 250, hide: !columnVisibility.subcategoryname, headerClassName: "bold-header" },
        { field: "assetoptions", headerName: "Asset Options", flex: 0, width: 250, hide: !columnVisibility.assetoptions, headerClassName: "bold-header" },

        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    {isUserRoleCompare?.includes("ematerialcategorygrouping") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {

                            getCode(params.data.id, params.data.name);
                        }}><EditOutlinedIcon sx={buttonStyles.buttonedit} /></Button>
                    )}
                    {isUserRoleCompare?.includes("dmaterialcategorygrouping") && (
                        <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.data.id, params.data.name) }}
                        ><DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} /></Button>
                    )}
                    {isUserRoleCompare?.includes("vmaterialcategorygrouping") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("imaterialcategorygrouping") && (
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
    ]

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            categoryname: item.categoryname.join(",").toString(),
            subcategoryname: item.subcategoryname.join(",").toString(),
            assetoptions: item.assetoptions,
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
    return (
        <Box>
            <Headtitle title={'Material Category Grouping'} />
            <PageHeading
                title="Material Category Grouping"
                modulename="Tickets"
                submodulename="Master"
                mainpagename="Material Category Grouping"
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("amaterialcategorygrouping") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}> Add Material Category Grouping</Typography>
                                </Grid>
                            </Grid><br />
                            <Grid container spacing={2}>
                                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Category <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={categorys}
                                            value={selectedOptionsCate}
                                            onChange={(e) => {
                                                handleCategoryChange(e);
                                                fetchCategoryBased(e);
                                                setSelectedOptionsSubCate([]);
                                            }}
                                            valueRenderer={customValueRendererCate}
                                            labelledBy="Please Select Category"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Sub Category <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={subcategorys}
                                            value={selectedOptionsSubCate}
                                            onChange={handleSubCategoryChange}
                                            valueRenderer={customValueRendererSubCate}
                                            labelledBy="Please Select Subcategory"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Asset Options </Typography>
                                        <Select
                                            fullWidth
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            value={assetoptions}
                                            onChange={(e) => {
                                                setAssetoptions(e.target.value);
                                            }}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value="None"> {"None"} </MenuItem>
                                            <MenuItem value="Work Station"> {"Work Station"} </MenuItem>
                                            <MenuItem value="Material Name"> {"Material Name"} </MenuItem>
                                            <MenuItem value="Both"> {"Both"} </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12} sx={{ marginTop: "25px" }}>
                                    <Grid container spacing={3}>
                                        <Grid item md={4} xs={12} sm={6}>
                                            <LoadingButton variant='contained' sx={buttonStyles.buttonsubmit} onClick={handleSubmit} loading={isBtn}>Submit</LoadingButton>

                                        </Grid>
                                        <Grid item md={4} xs={12} sm={6}>
                                            <Button sx={buttonStyles.btncancel} onClick={handleClear}>Clear</Button>

                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <br />
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
                    maxWidth="md"        >
                    <Box sx={{ width: "850px", padding: '20px' }}>
                        <>
                            <form onSubmit={editSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Edit Material Category Grouping</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Category <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect className="custom-multi-select"
                                                id="component-outlined"
                                                options={categorysEdit}
                                                value={selectedOptionsCateEdit}
                                                // onChange={handleCategoryChangeEdit}
                                                onChange={(e) => {
                                                    handleCategoryChangeEdit(e);
                                                    setSelectedOptionsSubCateEdit([]);
                                                }}
                                                valueRenderer={customValueRendererCateEdit}
                                                labelledBy="Please Select Category" />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Sub Category <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={subcategorysEdit}
                                                value={selectedOptionsSubCateEdit}
                                                onChange={handleSubCategoryChangeEdit}
                                                valueRenderer={customValueRendererSubCateEdit}
                                                labelledBy="Please Select Subcategory"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Asset Options </Typography>
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={assetoptionsEdit}
                                                onChange={(e) => {
                                                    setAssetoptionsEdit(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="None"> {"None"} </MenuItem>
                                                <MenuItem value="Work Station"> {"Work Station"} </MenuItem>
                                                <MenuItem value="Material Name"> {"Material Name"} </MenuItem>
                                                <MenuItem value="Both"> {"Both"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button variant="contained" sx={buttonStyles.buttonsubmit} type="submit">Update</Button>
                                    </Grid>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit} >Cancel</Button>
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
            {isUserRoleCompare?.includes("lmaterialcategorygrouping") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Material Category Grouping List</Typography>
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
                                        <MenuItem value={(assetcategorygrps?.length)}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelmaterialcategorygrouping") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvmaterialcategorygrouping") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printmaterialcategorygrouping") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfmaterialcategorygrouping") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}  ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagematerialcategorygrouping") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                    )}
                                </Box >
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTable}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={assetcategorygrps}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={assetcategorygrps}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        {isUserRoleCompare?.includes("bdmaterialcategorygrouping") && (
                            <Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert} >Bulk Delete</Button>)}

                        <br />
                        {!assetcategorygrpCheck ?
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
                                            itemsList={assetcategorygrps}
                                        />
                                    </>
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
                maxWidth="lg"            >
                <Box sx={{ width: "750px", padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Material Category Grouping</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Category</Typography>
                                    {Array.isArray(assetcategorygrpEdit.categoryname)
                                        ? assetcategorygrpEdit.categoryname.join(", ")
                                        : assetcategorygrpEdit.categoryname}
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Subcategory</Typography>
                                    {/* <Typography>{assetcategorygrpEdit.subcategoryname + ","}</Typography> */}
                                    <Typography>
                                        {Array.isArray(assetcategorygrpEdit.subcategoryname)
                                            ? assetcategorygrpEdit.subcategoryname.join(", ")
                                            : assetcategorygrpEdit.subcategoryname}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Asset Options</Typography>
                                    <Typography>{assetcategorygrpEdit.assetoptions}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />  <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" sx={buttonStyles.btncancel} onClick={handleCloseview}> Back </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

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
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={assetcategorygrps ?? []}
                filename={"Material Category Grouping"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Material Category Grouping Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delAssetcategory}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delAssetcategorycheckbox}
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


export default AssetCatgoryGrouping;