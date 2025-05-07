import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, Select, MenuItem, Dialog,
    DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton
} from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import 'jspdf-autotable';
import axios from "axios";
import { SERVICE } from '../../services/Baseservice';
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { UserRoleAccessContext, AuthContext } from '../../context/Appcontext';
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
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

function SubSubComponent() {
    const pathname = window.location.pathname;
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

    let exportColumnNames = ['Category', 'Subcategory', 'Subsub Name'];
    let exportRowValues = ['categoryname', 'subcategoryname', 'subsubname']

    const [subsubcomponent, setSubsubcomponent] = useState({ categoryname: "", subcategoryname: "", subsubname: "" });
    const [subsubcomponentEdit, setSubsubcomponentEdit] = useState({ categoryname: "", subcategoryname: "", subsubname: "" })
    const [subsusbcomponents, setSubsubcomponents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allSubsubcomponentedit, setAllSubsubcomponentedit] = useState([]);
    const [selectedRowsCount, setSelectedRowsCount] = useState(0);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [subsubcomponentCheck, setSubsubcomponentcheck] = useState(false);
    const username = isUserRoleAccess.username
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isBtn, setIsBtn] = useState(false);
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

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Subsub Category"),
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
        // setValueCateEdit(options.map((a, index) => {
        //     return a.value
        // }))
        setSelectedOptionsCateEdit(options);
        fetchCategoryBasedEdit(options.map(item => item.value));
    };

    const customValueRendererCateEdit = (valueCateEdit, _categorys) => {
        return valueCateEdit.length ? valueCateEdit.map(({ label }) => label).join(", ") : "Please Select Category";
    };

    // multi select sub category
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
    let [valueSubCateEdit, setValueSubCateEdit] = useState("");

    const handleSubCategoryChangeEdit = (options) => {
        // setValueSubCateEdit(options.map((a, index) => {
        //     return a.value
        // }))
        setSelectedOptionsSubCateEdit(options);
    };
    const customValueRendererSubCateEdit = (valueSubCateEdit, _subcategorys) => {
        return valueSubCateEdit.length ? valueSubCateEdit.map(({ label }) => label).join(", ") : "Please Select Subcategory";
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Subsub Category.png');
                });
            });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    const [ovProj, setOvProj] = useState("");
    const [getOverAllCount, setGetOverallCount] = useState("");
    const [ovProjCount, setOvProjCount] = useState("");
    const [ovProjDelete, setOvProjDelete] = useState("");
    const [getOverAllCountDelete, setGetOverallCountDelete] = useState("");
    const [ovProjCountDelete, setOvProjCountDelete] = useState("");
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
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
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
            getOverallEditSectionOverallDelete(selectedRows)
        }
    };

    //overall edit section for all pages
    const getOverallEditSectionOverallDelete = async (ids) => {
        setPageName(!pageName)
        try {

            let res = await axios.post(SERVICE.OVERALL_BULK_SUBSUBCOMPONENT_TICKET_DELETE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                id: ids
            });
            setSelectedRows(res?.data?.result);
            setSelectedRowsCount(res?.data?.count)
            setSelectAllChecked(
                res?.data?.count === filteredData.length
            );
            setIsDeleteOpencheckbox(true);

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        subsubname: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    const [deleteSubsub, setDeleteSubsub] = useState("");

    const rowData = async (id, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.SUBSUBCOMPONENT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteSubsub(res?.data?.ssubsubcomponent);
            setOvProjDelete(res?.data?.ssubsubcomponent?.subsubname);
            getOverallEditSectionDelete(res?.data?.ssubsubcomponent?.subsubname);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    //overall edit section for all pages
    const getOverallEditSectionDelete = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.post(SERVICE.OVERALL_SUBSUBCOMPONENT_TICKET_DELETE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                oldname: e,
            });
            setOvProjCountDelete(res?.data?.count);
            setGetOverallCountDelete(`The Sub SubCategory Data is linked in 
         ${res?.data?.reason?.length > 0 ? "Reason Master," : ""}
         ${res?.data?.resolverreason?.length > 0 ? "Resolver Reason Master," : ""}
         ${res?.data?.selfcheck?.length > 0 ? "Self CheckPoint Master," : ""}
         ${res?.data?.checkpoint?.length > 0 ? "CheckPoint Master Master," : ""}
         ${res?.data?.teamgroup?.length > 0 ? "TeamGrouping Master," : ""}
         ${res?.data?.priority?.length > 0 ? "Priority Master," : ""}
         ${res?.data?.duedate?.length > 0 ? "DueDate Master," : ""}
         ${res?.data?.requiredfield?.length > 0 ? "Required Field Master," : ""}
         ${res?.data?.typegroup?.length > 0 ? "Type Group Master," : ""}
         ${res?.data?.raisemaster?.length > 0 ? "Raise Ticket Master," : ""}`);

            if (res?.data?.count > 0) {
                handleClickOpenCheck();
            } else {
                handleClickOpen();
            }

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // Alert delete popup
    let Subsubsid = deleteSubsub?._id;
    const delSubsub = async (id) => {
        setPageName(!pageName)
        try {
            let res = await axios.delete(`${SERVICE.SUBSUBCOMPONENT_SINGLE}/${Subsubsid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchSubsubcomponent();
            handleCloseMod();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const delSubsubcheckbox = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.SUBSUBCOMPONENT_SINGLE}/${item}`, {
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
            await fetchSubsubcomponent();
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
        setPageName(!pageName)
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
        // let employ = e.map((item) => item.value);
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
        setPageName(!pageName)
        setIsBtn(true)
        try {
            let subprojectscreate = await axios.post(SERVICE.SUBSUBCOMPONENT_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                categoryname: [...valueCate],
                subcategoryname: [...valueSubCate],
                subsubname: String(subsubcomponent.subsubname),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            })
            await fetchSubsubcomponent();
            setSubsubcomponent({ ...subsubcomponent, subsubname: "" })
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
        const isNameMatch = subsusbcomponents.some(item =>
            item.subsubname.toLowerCase() === (subsubcomponent.subsubname).toLowerCase()
            && item.categoryname.some((data) => categorys.includes(data))
            && item.subcategoryname.some((data) => subcategorys.includes(data)));
        if (selectedOptionsCate.length == 0) {
            setPopupContentMalert("Please Select Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsSubCate.length == 0) {
            setPopupContentMalert("Please Select Subcategory");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (subsubcomponent.subsubname === "") {
            setPopupContentMalert("Please Enter Subsub Name");
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
        setSubsubcomponent({ categoryname: "", subcategoryname: "", subsubname: "" })
        setSelectedOptionsCate([]);
        setSubcategorys([]);
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

    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const handleClickOpenCheck = () => {
        setisCheckOpen(true);
    };
    const handleCloseCheck = () => {
        setisCheckOpen(false);
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
            let res = await axios.get(`${SERVICE.SUBSUBCOMPONENT_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSubsubcomponentEdit(res?.data?.ssubsubcomponent);
            setOvProj(res?.data?.ssubsubcomponent?.subsubname);
            getOverallEditSection(res?.data?.ssubsubcomponent?.subsubname);
            fetchCategoryBasedEdit(res?.data?.ssubsubcomponent.categoryname);
            setSelectedOptionsCateEdit(res?.data?.ssubsubcomponent.categoryname.map((item) => ({
                ...item,
                label: item,
                value: item,
            })))
            setSelectedOptionsSubCateEdit(res?.data?.ssubsubcomponent.subcategoryname.map((item) => ({
                ...item,
                label: item,
                value: item,
            })))
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    //overall edit section for all pages
    const getOverallEditSection = async (e) => {
        setPageName(!pageName)
        try {

            let res = await axios.post(SERVICE.OVERALL_SUBSUBCOMPONENT_TICKET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                oldname: e,
            });
            setOvProjCount(res?.data?.count);
            setGetOverallCount(`The ${e} is linked in 
         ${res?.data?.reason?.length > 0 ? "Reason Master," : ""}
         ${res?.data?.resolverreason?.length > 0 ? "Resolver Reason Master," : ""}
         ${res?.data?.selfcheck?.length > 0 ? "Self CheckPoint Master," : ""}
         ${res?.data?.checkpoint?.length > 0 ? "CheckPoint Master Master," : ""}
         ${res?.data?.teamgroup?.length > 0 ? "TeamGrouping Master," : ""}
         ${res?.data?.priority?.length > 0 ? "Priority Master," : ""}
         ${res?.data?.duedate?.length > 0 ? "DueDate Master," : ""}
         ${res?.data?.requiredfield?.length > 0 ? "Required Field Master," : ""}
         ${res?.data?.typegroup?.length > 0 ? "Type Group Master," : ""}
         ${res?.data?.raisemaster?.length > 0 ? "Raise Ticket Master," : ""}
          whether you want to do changes ..??`);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //overall edit section for all pages
    const getOverallEditSectionUpdate = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.post(SERVICE.OVERALL_SUBSUBCOMPONENT_TICKET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                oldname: ovProj,
            });
            sendEditRequestOverall(res?.data?.reason,
                res?.data?.resolverreason,
                res?.data?.selfcheck,
                res?.data?.checkpoint,
                res?.data?.teamgroup,
                res?.data?.priority,
                res?.data?.duedate,
                res?.data?.requiredfield,
                res?.data?.raisemaster,
                res?.data?.typegroup
            );
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const sendEditRequestOverall = async (reason,
        resolverreason
        , selfcheck
        , checkpoint
        , teamgroup
        , priority
        , duedate
        , requiredfield
        , raisemaster, typegroup) => {
        try {
            if (reason?.length > 0) {
                let answ = reason.map((d, i) => {
                    const subsubcategory = d?.subsubcategoryreason?.filter(data => data !== ovProj)
                    let res = axios.put(`${SERVICE.REASONMASTER_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        subsubcategoryreason: [...subsubcategory, subsubcomponentEdit?.subsubname],
                    });
                });
            }
            if (resolverreason.length > 0) {
                let answ = resolverreason.map((d, i) => {
                    const subsubcategory = d?.subsubcategoryreason?.filter(data => data !== ovProj)
                    let res = axios.put(`${SERVICE.RESOLVERREASONMASTER_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        subsubcategoryreason: [...subsubcategory, subsubcomponentEdit?.subsubname],
                    });
                });
            }
            if (selfcheck.length > 0) {
                let answ = selfcheck.map((d, i) => {
                    const subsubcategory = d?.subsubcategory?.filter(data => data !== ovProj)
                    let res = axios.put(`${SERVICE.SELFCHECKPOINTTICKET_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        subsubcategory: [...subsubcategory, subsubcomponentEdit?.subsubname],
                    });
                });
            }
            if (checkpoint.length > 0) {
                let answ = checkpoint.map((d, i) => {
                    const subsubcategory = d?.subsubcategory?.filter(data => data !== ovProj)
                    let res = axios.put(`${SERVICE.CHECKPOINTTICKET_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        subsubcategory: [...subsubcategory, subsubcomponentEdit?.subsubname],
                    });
                });
            }
            if (teamgroup.length > 0) {
                let answ = teamgroup.map((d, i) => {
                    const subsubcategory = d?.subsubcategoryfrom?.filter(data => data !== ovProj)
                    let res = axios.put(`${SERVICE.TEAMGROUPING_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        subsubcategoryfrom: [...subsubcategory, subsubcomponentEdit?.subsubname],
                    });
                });
            }
            if (priority.length > 0) {
                let answ = priority.map((d, i) => {
                    const subsubcategory = d?.subsubcategory?.filter(data => data !== ovProj)
                    let res = axios.put(`${SERVICE.PRIORITYMASTER_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        subsubcategory: [...subsubcategory, subsubcomponentEdit?.subsubname],
                    });
                });
            }
            if (duedate.length > 0) {
                let answ = duedate.map((d, i) => {
                    const subsubcategory = d?.subsubcategory?.filter(data => data !== ovProj)
                    let res = axios.put(`${SERVICE.DUEDATE_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        subsubcategory: [...subsubcategory, subsubcomponentEdit?.subsubname],
                    });
                });
            }
            if (requiredfield.length > 0) {
                let answ = requiredfield.map((d, i) => {
                    const subsubcategory = d?.subsubcategory?.filter(data => data !== ovProj)
                    let res = axios.put(`${SERVICE.REQUIREFIELDS_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        subsubcategory: [...subsubcategory, subsubcomponentEdit?.subsubname],
                    });
                });
            }
            if (raisemaster.length > 0) {
                let answ = raisemaster.map((d, i) => {
                    let res = axios.put(`${SERVICE.RAISETICKET_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        subsubcategory: subsubcomponentEdit?.subsubname,
                    });
                });
            }
            if (typegroup.length > 0) {
                let answ = typegroup.map((d, i) => {
                    const subsubcategory = d?.subsubcategorytype?.filter(data => data !== ovProj)
                    let res = axios.put(`${SERVICE.TYPEMASTER_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        subsubcategorytype: [...subsubcategory, subsubcomponentEdit?.subsubname],
                    });
                });
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.SUBSUBCOMPONENT_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSubsubcomponentEdit(res?.data?.ssubsubcomponent);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.SUBSUBCOMPONENT_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSubsubcomponentEdit(res?.data?.ssubsubcomponent);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchCategoryTicket();
    }, [])

    //Project updateby edit page...
    let updateby = subsubcomponentEdit?.updatedby;
    let addedby = subsubcomponentEdit?.addedby;
    let subprojectsid = subsubcomponentEdit?._id;

    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName)
        let empCate = selectedOptionsCateEdit.map((item) => item.value);
        let empSubcate = selectedOptionsSubCateEdit.map((item) => item.value);
        try {
            let res = await axios.put(`${SERVICE.SUBSUBCOMPONENT_SINGLE}/${subprojectsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                // categoryname: String(subsubcomponentEdit.categoryname),
                categoryname: [...empCate],
                subcategoryname: [...empSubcate],
                subsubname: String(subsubcomponentEdit.subsubname),
                updatedby: [
                    ...updateby, {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await getOverallEditSectionUpdate(); fetchSubsubcomponent();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    const editSubmit = async (e) => {
        e.preventDefault();
        let resdata = await fetchSubsubcomponentAll();
        let categorysEditt = selectedOptionsCateEdit.map((item) => item.value);
        let subcategorysEditt = selectedOptionsSubCateEdit.map((item) => item.value);
        const isNameMatch = resdata.some(item => item.subsubname.toLowerCase() === (subsubcomponentEdit.subsubname).toLowerCase()
            && item.categoryname.some((data) => categorysEditt.includes(data))
            && item.subcategoryname.some((data) => subcategorysEditt.includes(data)));
        if (selectedOptionsCateEdit.length == 0) {
            setPopupContentMalert("Please Select Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsSubCateEdit.length == 0) {
            setPopupContentMalert("Please Select Subcategory");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (subsubcomponentEdit.subsubname === "") {
            setPopupContentMalert("Please Enter Subsub Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data already Exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (subsubcomponentEdit.subsubname != ovProj && ovProjCount > 0) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
                </>
            );
            handleClickOpenerrpop();
        }
        else {
            sendEditRequest();
        }
    }

    //get all Sub vendormasters.
    const fetchSubsubcomponent = async () => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.SUBSUBCOMPONENT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSubsubcomponentcheck(true)
            setSubsubcomponents(res_vendor?.data?.subsubcomponents);
        } catch (err) { setSubsubcomponentcheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    //get all Sub vendormasters.
    const fetchSubsubcomponentAll = async () => {
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.SUBSUBCOMPONENT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            return res_vendor?.data?.subsubcomponents.filter(item => item._id !== subsubcomponentEdit._id)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Subsub Category',
        pageStyle: 'print'
    });

    useEffect(() => {
        fetchSubsubcomponent();
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
        const itemsWithSerialNumber = subsusbcomponents?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [subsusbcomponents])

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
    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }
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
                        setSelectAllChecked(updatedSelectedRows.length === filteredData.length);

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
        { field: "categoryname", headerName: "Category", flex: 0, width: 250, hide: !columnVisibility.categoryname, headerClassName: "bold-header" },
        { field: "subcategoryname", headerName: "Subcategory", flex: 0, width: 250, hide: !columnVisibility.subcategoryname, headerClassName: "bold-header" },
        { field: "subsubname", headerName: "Subsub Name", flex: 0, width: 250, hide: !columnVisibility.subsubname, headerClassName: "bold-header" },

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
                    {isUserRoleCompare?.includes("esubsubcategory") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {

                            getCode(params.row.id, params.row.name);
                        }}><EditOutlinedIcon sx={buttonStyles.buttonedit} /></Button>
                    )}
                    {isUserRoleCompare?.includes("dsubsubcategory") && (
                        <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.row.id, params.row.name) }}>
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} /></Button>
                    )}
                    {isUserRoleCompare?.includes("vsubsubcategory") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("isubsubcategory") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getinfoCode(params.row.id);
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
            // categoryname: item.categoryname,
            categoryname: item.categoryname.join(",").toString(),
            subcategoryname: item.subcategoryname.join(",").toString(),
            // subcategoryname: item.subcategoryname,
            subsubname: item.subsubname,

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
            <Headtitle title={'Subsub Category'} />
            <PageHeading
                title="Subsub Category"
                modulename="Tickets"
                submodulename="Master"
                mainpagename="Subsub Category"
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("asubsubcategory") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}> Add Subsub Category</Typography>
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
                                        <Typography>
                                            SubSub Name <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter SubSub Name"
                                            value={subsubcomponent.subsubname}
                                            onChange={(e) => {
                                                setSubsubcomponent({
                                                    ...subsubcomponent,
                                                    subsubname: e.target.value,
                                                });
                                            }}
                                        />
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
                                        <Typography sx={userStyle.HeaderText}>Edit Subsub Category</Typography>
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
                                            <Typography>
                                                SubSub Name <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter SubSub Name"
                                                value={subsubcomponentEdit.subsubname}
                                                onChange={(e) => {
                                                    setSubsubcomponentEdit({
                                                        ...subsubcomponentEdit,
                                                        subsubname: e.target.value,
                                                    });
                                                }}
                                            />
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
            {isUserRoleCompare?.includes("lsubsubcategory") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Subsub Category List</Typography>
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
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelsubsubcategory") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>

                                    )}
                                    {isUserRoleCompare?.includes("csvsubsubcategory") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printsubsubcategory") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfsubsubcategory") && (

                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}   ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagesubsubcategory") && (
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
                        {isUserRoleCompare?.includes("bdsubsubcategory") && (
                            <Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert} >Bulk Delete</Button>)}
                        <br />
                        {!subsubcomponentCheck ?
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
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {filteredData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbers?.map((pageNumber) => (
                                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={((page)) === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        {lastVisiblePage < totalPages && <span>...</span>}
                                        <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPage((totalPages))} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
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
                maxWidth="lg"
                sx={{ marginTop: "47px" }}
            >
                <Box sx={{ width: "750px", padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Subsub Category</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Category</Typography>
                                    <Typography>
                                        {Array.isArray(subsubcomponentEdit.categoryname)
                                            ? subsubcomponentEdit.categoryname.join(", ")
                                            : subsubcomponentEdit.categoryname}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Subcategory</Typography>
                                    <Typography>
                                        {Array.isArray(subsubcomponentEdit.subcategoryname)
                                            ? subsubcomponentEdit.subcategoryname.join(", ")
                                            : subsubcomponentEdit.subcategoryname}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Subsub Name</Typography>
                                    <Typography>{subsubcomponentEdit.subsubname}</Typography>
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
            {/* Check delete Modal */}
            <Box>
                <>
                    <Box>
                        {/* ALERT DIALOG */}
                        <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                            <DialogContent
                                sx={{
                                    width: "350px",
                                    textAlign: "center",
                                    alignItems: "center",
                                }}
                            >
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                                <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                                    {getOverAllCountDelete}
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

            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpenpop}
                    onClose={handleCloseerrpop}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlertpop}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" style={{ padding: '7px 13px', color: 'white', background: 'rgb(25, 118, 210)' }}
                            onClick={() => {
                                sendEditRequest();
                                handleCloseerrpop();
                            }}>
                            ok
                        </Button>
                        <Button
                            style={{
                                backgroundColor: '#f4f4f4',
                                color: '#444',
                                boxShadow: 'none',
                                borderRadius: '3px',
                                padding: '7px 13px',
                                border: '1px solid #0000006b',
                                '&:hover': {
                                    '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                                        backgroundColor: '#f4f4f4',
                                    },
                                },
                            }}
                            onClick={handleCloseerrpop}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <Box>
                <Dialog
                    open={isDeleteOpencheckbox}
                    onClose={handleCloseModcheckbox}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        {selectedRowsCount > 0 ?
                            <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Some of the Data's are Linked in other pages. Do You want to Delete the Remaining.?</Typography>
                            :
                            <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>This Data is Linked in Some pages</Typography>

                        }
                    </DialogContent>
                    <DialogActions>
                        {selectedRowsCount > 0 ?
                            <>
                                <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Cancel</Button>
                                <Button variant="contained" color='error'
                                    onClick={(e) => delSubsubcheckbox(e)}
                                > OK </Button>
                            </>
                            :
                            <Button variant="contained" color='error' onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Ok</Button>
                        }
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
                filteredDataTwo={rowDataTable ?? []}
                itemsTwo={items ?? []}
                filename={"Subsub Category"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Subsub Category Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delSubsub}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/* EXTERNAL COMPONENTS -------------- END */}
            <br />

        </Box>
    );
}


export default SubSubComponent;