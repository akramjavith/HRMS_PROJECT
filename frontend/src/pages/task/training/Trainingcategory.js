import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, Select, MenuItem, Dialog, TextareaAutosize,
    DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import StyledDataGrid from "../../../components/TableStyle";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import 'jspdf-autotable';
import axios from "axios";
import { SERVICE } from '../../../services/Baseservice';
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import Headtitle from "../../../components/Headtitle";
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
import LoadingButton from "@mui/lab/LoadingButton";
import ExportData from "../../../components/ExportData";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import InfoPopup from "../../../components/InfoPopup.js";
import { DeleteConfirmation, PleaseSelectRow, } from "../../../components/DeleteConfirmation.js";
import PageHeading from "../../../components/PageHeading";

function Trainingcategory() {
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

    let exportColumnNames = ['Category Name', 'Description'];
    let exportRowValues = ['categoryname', 'description']

    const [trainingcategory, setTrainingcategory] = useState({ categoryname: "", description: "" });
    const [trainingcategoryEdit, setTrainingcategoryEdit] = useState({ categoryname: "", description: "" })
    const [trainingcategorys, setTrainingcategorys] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allTrainingcategoryedit, setAllTrainingcategoryedit] = useState([]);
    const [btnLoad, setBtnLoad] = useState(false)
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [trainingcategoryCheck, setTrainingcategorycheck] = useState(false);
    const username = isUserRoleAccess.username
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');
    const [selectedRowsCount, setSelectedRowsCount] = useState(0);
    const [ovcategory, setOvcategory] = useState("");
    const [getOverAllCount, setGetOverallCount] = useState("");
    const [ovProjCount, setOvProjCount] = useState("");
    const [getOverAllCountDelete, setGetOverallCountDelete] = useState("");
    const [ovProjCountDelete, setOvProjCountDelete] = useState("");
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

    //image 
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Training Category.png');
                });
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
            pagename: String("Training Category"),
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
        setBtnLoad(false)
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
        description: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    const [deleteCategroy, setDeleteCategory] = useState("");

    const rowData = async (id, name) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.TRAININGCATEGORY_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteCategory(res?.data?.strainingcategory);
            getOverallEditSectionDelete(res?.data?.strainingcategory?.categoryname)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    // Alert delete popup
    let trainingcategorysid = deleteCategroy?._id;
    const delTrainingCategory = async (e) => {
        setPageName(!pageName);
        try {
            await axios.delete(`${SERVICE.TRAININGCATEGORY_SINGLE}/${trainingcategorysid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            await fetchTrainingcategory();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1)
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const delTraningcatecheckbox = async () => {
        setPageName(!pageName);
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.TRAININGCATEGORY_SINGLE}/${item}`, {
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
            await fetchTrainingcategory();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //add function 
    const sendRequest = async () => {
        setPageName(!pageName);
        setBtnLoad(true)
        try {
            let subprojectscreate = await axios.post(SERVICE.TRAININGCATEGORY_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                categoryname: String(trainingcategory.categoryname),
                description: String(trainingcategory.description),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            })
            await fetchTrainingcategory();
            setBtnLoad(false)
            setTrainingcategory({ ...trainingcategory, categoryname: "", description: "" })
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { setBtnLoad(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = trainingcategorys.some(item => item.categoryname.toLowerCase()?.replaceAll(" ", "") === (trainingcategory.categoryname).toLowerCase()?.replaceAll(" ", ""));
        if (trainingcategory.categoryname === "") {
            setPopupContentMalert("Please Enter Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Name already Exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    }

    const handleClear = (e) => {
        e.preventDefault();
        setTrainingcategory({ categoryname: "", description: "" })
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
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.TRAININGCATEGORY_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTrainingcategoryEdit(res?.data?.strainingcategory);
            getOverallEditSection(res?.data?.strainingcategory?.categoryname)
            setOvcategory(res?.data?.strainingcategory?.categoryname)
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.TRAININGCATEGORY_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTrainingcategoryEdit(res?.data?.strainingcategory);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.TRAININGCATEGORY_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTrainingcategoryEdit(res?.data?.strainingcategory);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //Project updateby edit page...
    let updateby = trainingcategoryEdit?.updatedby;
    let addedby = trainingcategoryEdit?.addedby;
    let subprojectsid = trainingcategoryEdit?._id;

    //overall edit section for all pages
    const getOverallEditSectionOverallDelete = async (ids) => {
        setPageName(!pageName);
        try {

            let res = await axios.post(SERVICE.OVERALL_TRAINING_OVERALL_CATEGORY_TICKET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                id: ids
            });
            setSelectedRows(res?.data?.result);
            setSelectedRowsCount(res?.data?.count)
            setIsDeleteOpencheckbox(true);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //overall edit section for all pages
    const getOverallEditSectionDelete = async (cat) => {
        setPageName(!pageName);
        try {

            let res = await axios.post(SERVICE.OVERALL_TRAINING_CATEGORY_TICKET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                category: cat
            });
            setOvProjCountDelete(res.data.count);
            setGetOverallCountDelete(`This data is linked in 
                ${res.data.trainingsubcate.length > 0 ? "Training SubCategory," : ""}
                ${res.data.trainingUsers.length > 0 ? "Training For Users ," : ""}
            ${res.data.trandetails.length > 0 ? "Training Details ," : ""}
            ${res.data.trandetailslog.length > 0 ? "Training Details Log," : ""}
                 `);

            if (res?.data?.count > 0) {
                handleClickOpenCheck();
            } else {
                handleClickOpen();
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //overall edit section for all pages
    const getOverallEditSection = async (cat) => {
        setPageName(!pageName);
        try {
            let res = await axios.post(SERVICE.OVERALL_TRAINING_CATEGORY_TICKET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                category: cat,
            });
            setOvProjCount(res?.data?.count);
            setGetOverallCount(`This data is linked in 
       ${res?.data?.trainingsubcate?.length > 0 ? "Training SubCategory," : ""}
         ${res?.data?.trainingUsers?.length > 0 ? "Training For Users ," : ""}
     ${res?.data?.trandetails?.length > 0 ? "Training Details ," : ""}
     ${res?.data?.trandetailslog?.length > 0 ? "Training Details Log ," : ""}
         whether you want to do changes ..??`);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //overall edit section for all pages
    const getOverallEditSectionUpdate = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.post(SERVICE.OVERALL_TRAINING_CATEGORY_TICKET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                category: ovcategory,
            });
            sendEditRequestOverall(res?.data?.trainingsubcate,
                res?.data?.trainingUsers,
                res?.data?.trandetailslog,
                res?.data?.trandetails);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const sendEditRequestOverall = async (trainsubcate, trainuser, trandetailslog, traindetails) => {
        try {
            if (trainsubcate?.length > 0) {
                let answ = trainsubcate.map((d, i) => {
                    let res = axios.put(`${SERVICE.TRAININGSUBCATEGORY_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        category: trainingcategoryEdit.categoryname,
                    });
                });
            }
            if (trainuser?.length > 0) {
                let answ = trainuser.map((d, i) => {
                    const answer = d?.trainingdocuments?.filter(data => data?.category !== ovcategory)
                    const answerCate = d?.trainingdocuments?.filter(data => data?.category === ovcategory)?.map((item
                    ) => {
                        return { ...item, category: trainingcategoryEdit.categoryname }
                    })
                    let res = axios.put(`${SERVICE.SINGLE_TRAINING_FOR_USER}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        trainingdocuments: [...answer, ...answerCate],
                    });
                });
            }

            if (trandetailslog?.length > 0) {
                let answ = trandetailslog.map((d, i) => {
                    const answer = d?.trainingdetailslog?.filter(data => data?.category !== ovcategory)
                    const answerCate = d?.trainingdetailslog?.filter(data => data?.category === ovcategory)?.map((item
                    ) => {
                        return { ...item, category: trainingcategoryEdit.categoryname }
                    })
                    let res = axios.put(`${SERVICE.SINGLE_TRAININGDETAILS}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        trainingdetailslog: [...answer, ...answerCate],
                    });
                });
            }
            if (traindetails?.length > 0) {
                let answ = traindetails.map((d, i) => {
                    const answer = d?.trainingdocuments?.filter(data => data?.category !== ovcategory)
                    const answerCate = d?.trainingdocuments?.filter(data => data?.category === ovcategory)?.map((item
                    ) => {
                        return { ...item, category: trainingcategoryEdit.categoryname }
                    })
                    let res = axios.put(`${SERVICE.SINGLE_TRAININGDETAILS}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        trainingdocuments: [...answer, ...answerCate],
                    });
                });
            }

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.put(`${SERVICE.TRAININGCATEGORY_SINGLE}/${subprojectsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                categoryname: String(trainingcategoryEdit.categoryname),
                description: String(trainingcategoryEdit.description),
                updatedby: [
                    ...updateby, {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchTrainingcategory(); getOverallEditSectionUpdate();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    const editSubmit = (e) => {
        e.preventDefault();
        fetchTrainingcategoryAll();
        const isNameMatch = allTrainingcategoryedit.some(item => item.categoryname.toLowerCase()?.replaceAll(" ", "") === (trainingcategoryEdit.categoryname).toLowerCase()?.replaceAll(" ", ""));
        if (trainingcategoryEdit.categoryname === "") {
            setPopupContentMalert("Please Enter Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Name already Exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (trainingcategoryEdit?.categoryname != ovcategory && ovProjCount > 0) {
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
            //  getOverallEditSectionUpdate();
        }
    }

    //get all Sub vendormasters.
    const fetchTrainingcategory = async () => {
        setPageName(!pageName);
        try {
            let res_vendor = await axios.get(SERVICE.TRAININGCATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTrainingcategorycheck(true)
            setTrainingcategorys(res_vendor?.data?.trainingcategorys);
        } catch (err) { setTrainingcategorycheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }


    //get all Sub vendormasters.
    const fetchTrainingcategoryAll = async () => {
        setPageName(!pageName);
        try {
            let res_meet = await axios.get(SERVICE.TRAININGCATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setAllTrainingcategoryedit(res_meet?.data?.trainingcategorys.filter(item => item._id !== trainingcategoryEdit._id));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Training Category',
        pageStyle: 'print'
    });

    //id for login...
    let loginid = localStorage.LoginUserId;
    let authToken = localStorage.APIToken;

    useEffect(() => {
        fetchTrainingcategory();
        fetchTrainingcategoryAll();
    }, [])

    useEffect(() => {
        fetchTrainingcategoryAll();
    }, [isEditOpen, trainingcategoryEdit])

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
        const itemsWithSerialNumber = trainingcategorys?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }
    useEffect(() => {
        addSerialNumber();
    }, [trainingcategorys])

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
        { field: "categoryname", headerName: "Category Name", flex: 0, width: 250, hide: !columnVisibility.categoryname, headerClassName: "bold-header" },
        { field: "description", headerName: "Description", flex: 0, width: 250, hide: !columnVisibility.description, headerClassName: "bold-header" },

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
                    {isUserRoleCompare?.includes("etrainingcategory") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {

                            getCode(params.row.id, params.row.name);
                        }}><EditOutlinedIcon sx={buttonStyles.buttonedit} /></Button>
                    )}
                    {isUserRoleCompare?.includes("dtrainingcategory") && (
                        <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.row.id, params.row.name) }}>
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} /></Button>
                    )}
                    {isUserRoleCompare?.includes("vtrainingcategory") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("itrainingcategory") && (
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
            categoryname: item.categoryname,
            description: item.description,

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
            <Headtitle title={'Training Category'} />
            <PageHeading
                title="Training Category"
                modulename="Training"
                submodulename="Training Category"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("atrainingcategory")
                && (
                    <>
                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>Add Training Category</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>

                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Name <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Name"
                                                value={trainingcategory.categoryname}
                                                onChange={(e) => {
                                                    setTrainingcategory({ ...trainingcategory, categoryname: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Description</Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={5}
                                                value={trainingcategory.description}
                                                onChange={(e) => {
                                                    setTrainingcategory({ ...trainingcategory, description: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12} marginTop={5}>
                                        <Grid container spacing={2}>
                                            <Grid item md={4} xs={12} sm={6}>
                                                <LoadingButton loading={btnLoad} variant='contained' sx={buttonStyles.buttonsubmit} onClick={handleSubmit}>Submit</LoadingButton>

                                            </Grid>
                                            <Grid item md={4} xs={12} sm={6}>
                                                <Button sx={buttonStyles.btncancel} onClick={handleClear}>Clear</Button>

                                            </Grid>
                                        </Grid>
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
                    // fullWidth={true}
                    maxWidth="md"
                    sx={{ marginTop: "47px" }}
                >

                    <Box sx={{ width: "550px", padding: '20px' }}>
                        <>
                            <form onSubmit={editSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Edit Training Category</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>

                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Name <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Name"
                                                value={trainingcategoryEdit.categoryname}
                                                onChange={(e) => {
                                                    setTrainingcategoryEdit({ ...trainingcategoryEdit, categoryname: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Description</Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={5}
                                                value={trainingcategoryEdit.description}
                                                onChange={(e) => {
                                                    setTrainingcategoryEdit({ ...trainingcategoryEdit, description: e.target.value });
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
            {isUserRoleCompare?.includes("ltrainingcategory") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Training Category List</Typography>
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
                                        {/* <MenuItem value={(trainingcategorys?.length)}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("exceltrainingcategory") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvtrainingcategory") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printtrainingcategory") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdftrainingcategory") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}  ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagetrainingcategory") && (
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
                        {isUserRoleCompare?.includes("bdtrainingcategory") && (
                            <Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert} >Bulk Delete</Button>)}

                        <br />
                        {!trainingcategoryCheck ?
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
                maxWidth="md"
                sx={{ marginTop: "47px" }}
            >
                <Box sx={{ width: "550px", padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Training Category</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>

                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Name</Typography>
                                    <Typography>{trainingcategoryEdit.categoryname}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Description</Typography>
                                    <Typography>{trainingcategoryEdit.description}</Typography>
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
                            sx={buttonStyles.buttonsubmit}
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
                            sx={buttonStyles.btncancel}
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
                                <Button onClick={handleCloseModcheckbox} sx={buttonStyles.btncancel}>Cancel</Button>
                                <Button variant="contained" sx={buttonStyles.buttonsubmit}
                                    onClick={(e) => delTraningcatecheckbox(e)}
                                > OK </Button>
                            </>
                            :
                            <Button variant="contained" onClick={handleCloseModcheckbox} sx={buttonStyles.btncancel}>Ok</Button>
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
                        <Button autoFocus variant="contained" sx={buttonStyles.buttonsubmit}
                            onClick={handleCloseModalert}
                        > OK </Button>
                    </DialogActions>
                </Dialog>
            </Box>

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
                                <Button onClick={handleCloseCheck} autoFocus variant="contained" sx={buttonStyles.buttonsubmit}>
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
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleCloseerr}>ok</Button>
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
                filename={"Training Category"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Training Category Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delTrainingCategory}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/* EXTERNAL COMPONENTS -------------- END */}
            <br />

        </Box>
    );
}

export default Trainingcategory;