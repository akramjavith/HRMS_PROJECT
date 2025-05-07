import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import ImageIcon from '@mui/icons-material/Image';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
    Backdrop,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl, Grid,
    IconButton,
    List, ListItem, ListItemText,
    MenuItem,
    OutlinedInput,
    Popover,
    Select,
    TextField,
    Typography
} from "@mui/material";
import Switch from '@mui/material/Switch';
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from 'html2canvas';
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../components/Alert.js";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import { handleApiError } from "../../components/Errorhandling.js";
import ExportData from "../../components/ExportData.js";
import Headtitle from "../../components/Headtitle.js";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert.js";
import PageHeading from "../../components/PageHeading.js";
import StyledDataGrid from "../../components/TableStyle.js";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext.js";
import { userStyle } from "../../pageStyle.js";
import { SERVICE } from "../../services/Baseservice.js";
import { ThreeDots } from "react-loader-spinner";

function CategoryMaster() {
    const [isLoading, setIsLoading] = useState(false);

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

    let exportColumnNames = ["Category Template"];
    let exportRowValues = ["categoryname"];

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const maxLength = 2;
    const [categorymaster, setCategorymaster] = useState({ categoryname: "", });
    const [isBtn, setIsBtn] = useState(false);
    const [categorymasterEdit, setCategorymasterEdit] = useState({ categoryname: "", });

    const [categorymasters, setCategorymasters] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();

    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteproject, setDeleteproject] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allCategoryedit, setAllCategoryedit] = useState([]);
    const [copiedData, setCopiedData] = useState('');

    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Category Template.png");
                });
            });
        }
    };

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
    };

    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const handleClickOpenCheck = () => {
        setisCheckOpen(true);
    };
    const handleCloseCheck = () => {
        setisCheckOpen(false);
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleClickOpenalert = () => {
        if (selectedRows.length == 0) {
            setIsDeleteOpenalert(true);
        } else {
            overallBulkdelete(selectedRows);
        }
    };

    const [selectedRowsCount, setSelectedRowsCount] = useState(0);

    const overallBulkdelete = async (ids) => {
        setPageName(!pageName);
        try {
            let overallcheck = await axios.post(
                `${SERVICE.OVERALL_POSTERCATEGORY_BULKDELETE}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    id: ids,
                }
            );

            setSelectedRows(overallcheck?.data?.result);
            setSelectedRowsCount(overallcheck?.data?.count)
            handleClickOpencheckbox(true);
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

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
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
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const [checkUser, setCheckUser] = useState();

    //set function to get particular row
    const rowData = async (id, name) => {
        setPageName(!pageName);
        try {

            const [res, resuser] = await Promise.all([
                axios.get(`${SERVICE.CATEGORYMASTERS_SINGLE}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                }),
                axios.post(SERVICE.OVERALL_CATEGORYMASTER, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    oldname: String(name),
                })
            ])

            setDeleteproject(res?.data?.scategorymaster);
            setCheckUser(resuser?.data?.count);

            if (resuser?.data?.count > 0) {
                setPopupContentMalert(
                    <span style={{ fontWeight: "700", color: "#777" }}>
                        {`${res?.data?.scategorymaster?.categoryname}`} &nbsp;
                        <span style={{ fontWeight: "bold", color: "black" }}>was linked</span>
                    </span>
                );
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                handleClickOpen();
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // Alert delete popup
    let projectid = deleteproject._id;
    const delCategory = async () => {
        setPageName(!pageName);
        try {
            await axios.delete(`${SERVICE.CATEGORYMASTERS_SINGLE}/${projectid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            await fetchCategorymaster();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const delCategorycheckbox = async () => {
        setPageName(!pageName);
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.CATEGORYMASTERS_SINGLE}/${item}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);


            await fetchCategorymaster();
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //add function
    const sendRequest = async () => {
        setPageName(!pageName);
        setIsBtn(true)
        try {
            let projectscreate = await axios.post(SERVICE.CATEGORYMASTERS_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                categoryname: String(categorymaster.categoryname),
                addedby: [

                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setCategorymaster(projectscreate.data);
            await fetchCategorymaster();
            setCategorymaster({ categoryname: "" });
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsBtn(false)
        } catch (err) { setIsBtn(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = categorymasters?.some(item => item.categoryname?.toLowerCase() === (categorymaster.categoryname)?.toLowerCase());
        if (categorymaster.categoryname === "") {
            setPopupContentMalert("Please Enter Category Template!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    };

    const handleclear = (e) => {
        e.preventDefault();
        setCategorymaster({ categoryname: "" })
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    }

    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    const [ovProj, setOvProj] = useState("");

    //get single row to edit....
    const getCode = async (e, name) => {
        setPageName(!pageName);
        try {

            let res = await axios.get(`${SERVICE.CATEGORYMASTERS_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setCategorymasterEdit(res?.data?.scategorymaster);
            setOvProj(name);
            getOverallEditSection(name);
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const [ovProjcount, setOvProjcount] = useState(0);
    const [getOverAllCount, setGetOverallCount] = useState("");

    const getOverallEditSection = async (e) => {
        try {
            let res = await axios.post(SERVICE.OVERALL_CATEGORYMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                oldname: e,
            });
            setOvProjcount(res?.data?.count);
            setGetOverallCount(`The ${e} is linked in ${res?.data?.categorythemegrouping?.length > 0 ? "Category theme Grouping ," : ""}
        ${res?.data?.subcategorymaster?.length > 0 ? "Sub Category Master" : ""} 
        ${res?.data?.postergenerate?.length > 0 ? "Poster Generate" : ""} 
        ${res?.data?.postermessage?.length > 0 ? "Poster Message Setting" : ""} 
        whether you want to do changes ..??`);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };



    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.CATEGORYMASTERS_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setCategorymasterEdit(res?.data?.scategorymaster);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.CATEGORYMASTERS_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setCategorymasterEdit(res?.data?.scategorymaster);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    //ControlName updateby edit page...
    let updateby = categorymasterEdit.updatedby;
    let addedby = categorymasterEdit.addedby;

    let projectsid = categorymasterEdit._id;

    //overall edit section for all pages
    const getOverallEditSectionUpdate = async () => {
        try {
            let res = await axios.post(SERVICE.OVERALL_CATEGORYMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                oldname: ovProj,
            });
            sendEditRequestOverall(res?.data?.categorythemegrouping, res?.data?.subcategorymaster, res?.data?.postergenerate, res?.data?.postermessage);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const sendEditRequestOverall = async (categorythemegrouping, subcategorymaster, postergenerate, postermessage) => {
        try {
            if (categorythemegrouping?.length > 0) {
                let answ = categorythemegrouping.map((d, i) => {
                    let res = axios.put(`${SERVICE.CATEGROYTHEMEGROUPING_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        categoryname: String(categorymasterEdit.categoryname),
                    });
                });
            }
            if (subcategorymaster?.length > 0) {
                let answ = subcategorymaster.map((d, i) => {
                    let res = axios.put(`${SERVICE.SUBCATEGORYMASTER_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        categoryname: String(categorymasterEdit.categoryname),
                    });
                });
            }
            if (postergenerate?.length > 0) {
                let answ = postergenerate.map((d, i) => {
                    let res = axios.put(`${SERVICE.POSTERGENERATE_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        categoryname: String(categorymasterEdit.categoryname),
                    });
                });
            }
            if (postermessage?.length > 0) {
                let answ = postermessage.map((d, i) => {
                    let res = axios.put(`${SERVICE.POSTERMESSAGESETTING_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        categoryname: String(categorymasterEdit.categoryname),
                    });
                });
            }
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //editing the single data...
    const sendEditRequest = async () => {
        setIsLoading(true);
        setPageName(!pageName);
        try {
            let res = await axios.put(`${SERVICE.CATEGORYMASTERS_SINGLE}/${projectsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                categoryname: String(categorymasterEdit.categoryname),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchCategorymaster();
            await fetchCategorymasterAll();
            handleCloseModEdit();
            getOverallEditSectionUpdate();

            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsLoading(false);

        } catch (err) {
            setIsLoading(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const editSubmit = (e) => {
        e.preventDefault();
        fetchCategorymasterAll();
        const isNameMatch = allCategoryedit?.some(item => item.categoryname?.toLowerCase() === (categorymasterEdit.categoryname)?.toLowerCase());
        if (categorymasterEdit.categoryname === "") {
            setPopupContentMalert("Please Enter Category Template!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (categorymasterEdit.categoryname != ovProj && ovProjcount > 0) {
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
    };

    const [loader, setLoader] = useState(true)
    //get all control name.
    const fetchCategorymaster = async () => {
        setLoader(false)
        setPageName(!pageName);
        try {
            let res_project = await axios.get(SERVICE.CATEGORYMASTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setCategorymasters(res_project?.data?.categorymasters);
            setLoader(true)

        } catch (err) {
            setLoader(true)

            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    //get all controlname.
    const fetchCategorymasterAll = async () => {
        setPageName(!pageName);
        try {
            let res_project = await axios.get(SERVICE.CATEGORYMASTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setCategorymasters(res_project?.data?.categorymasters);
            setAllCategoryedit(res_project?.data?.categorymasters.filter(item => item._id !== categorymasterEdit._id));
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState("xl");

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Category Template Master",
        pageStyle: "print",
    });


    //serial no for listing items 
    const addSerialNumber = () => {
        const itemsWithSerialNumber = categorymasters?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [categorymasters])

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
        setPage(1);
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
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
        // fetchCategorymaster();
        fetchCategorymasterAll();
    }, [isEditOpen])

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Category Template"),
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
        fetchCategorymaster();
        getapi();
    }, [])

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

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
        { field: "categoryname", headerName: "Catgory Template", flex: 0, width: 250, hide: !columnVisibility.categoryname, headerClassName: "bold-header" },

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
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("epostercategorymaster") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {

                                getCode(params.row.id, params.row.categoryname);
                            }}
                        >
                            <EditOutlinedIcon sx={buttonStyles.buttonedit} />                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dpostercategorymaster") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id, params.row.categoryname);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vpostercategorymaster") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {

                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ipostercategorymaster") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getinfoCode(params.row.id);
                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />                        </Button>
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
        }
    });

    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
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
            <Headtitle title={'CATEGORY TEMPLATE'} />
            {/* ****** Header Content ****** */}
            {/* <Typography sx={userStyle.HeaderText}>Manage Category Template</Typography> */}
            <PageHeading
                title="Category Template"
                modulename="Poster"
                submodulename="Poster Master"
                mainpagename="Poster Category Master"
                subpagename=""
                subsubpagename=""
            />

            {isUserRoleCompare?.includes("apostercategorymaster") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Add Category Template
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Name <b style={{ color: "red" }}>*</b></Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Category Template"
                                            value={categorymaster.categoryname}
                                            onChange={(e) => {
                                                setCategorymaster({ ...categorymaster, categoryname: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <Typography>&nbsp;</Typography>
                                    <Button
                                        sx={buttonStyles.buttonsubmit}
                                        onClick={handleSubmit}
                                        disabled={isBtn}
                                    >
                                        Submit
                                    </Button>
                                    &nbsp;
                                    &nbsp;
                                    <Button sx={buttonStyles.btncancel} onClick={handleclear} >
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
                    maxWidth="sm"
                    fullWidth={true}
                >

                    <Box sx={{ padding: '20px 50px' }}>
                        <>
                            <Grid container spacing={2}>

                                <Typography sx={userStyle.HeaderText}>
                                    Edit Category Template
                                </Typography>

                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Name <b style={{ color: "red" }}>*</b></Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Category Template"
                                            value={categorymasterEdit.categoryname}
                                            onChange={(e) => {
                                                setCategorymasterEdit({ ...categorymasterEdit, categoryname: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={buttonStyles.buttonsubmit} onClick={editSubmit}>  Update</Button>
                                </Grid><br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}> Cancel </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lpostercategorymaster") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Category Template List</Typography>
                        </Grid>

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
                                    {isUserRoleCompare?.includes("excelpostercategorymaster") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    setFormat("xl");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileExcel />
                                                &ensp;Export to Excel&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvpostercategorymaster") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    setFormat("csv");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileCsv />
                                                &ensp;Export to CSV&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printpostercategorymaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfpostercategorymaster") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true);
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagepostercategorymaster") && (

                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                    )}
                                </Box >
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
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
                        {isUserRoleCompare?.includes("bdpostercategorymaster") && (
                            <Button sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert} >Bulk Delete</Button>
                        )}

                        <br />
                        <br />
                        {!loader ? (
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

                        )}


                        <Box style={userStyle.dataTablestyle}>
                            <Box>
                                Showing {filteredData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
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
                        {/* ****** Table End ****** */}
                    </Box>
                </>
            )}


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
                maxWidth="xs"
                fullWidth={true}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Category Template</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Category Template</Typography>
                                    <Typography>{categorymasterEdit.categoryname}</Typography>
                                </FormControl>
                            </Grid>

                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                sx={buttonStyles.buttonsubmit}
                                color="primary"
                                onClick={handleCloseview}
                            >
                                {" "}
                                Back{" "}
                            </Button>
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
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" style={{
                            padding: '7px 13px',
                            color: 'white',
                            background: 'rgb(25, 118, 210)'
                        }} onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* ALERT DIALOG  for the Overall delete*/}
            <Box>
                <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlertpop}</Typography>
                    </DialogContent>
                    <DialogActions>
                        {isLoading ? (
                            <>
                                <Backdrop sx={{ color: "blue", zIndex: (theme) => theme.zIndex.drawer + 2 }} open={isLoading}>
                                    <CircularProgress color="inherit" />
                                </Backdrop>
                            </>
                        ) : (
                            <>
                                <Grid>
                                    <Button
                                        variant="contained"
                                        style={{
                                            padding: "7px 13px",
                                            color: "white",
                                            background: "rgb(25, 118, 210)",
                                            ...buttonStyles.buttonsubmit
                                        }}
                                        onClick={() => {
                                            sendEditRequest();
                                            handleCloseerrpop();
                                        }}
                                    >
                                        ok
                                    </Button>
                                </Grid>
                            </>
                        )}
                        &nbsp;
                        &nbsp;
                        <Button
                            style={{
                                backgroundColor: "#f4f4f4",
                                color: "#444",
                                boxShadow: "none",
                                borderRadius: "3px",
                                padding: "7px 13px",
                                border: "1px solid #0000006b",
                                "&:hover": {
                                    "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                        backgroundColor: "#f4f4f4",
                                    },
                                },
                                ...buttonStyles.btncancel
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
                                <Button onClick={handleCloseModcheckbox} sx={buttonStyles.btncancel}>Cancel</Button>
                                <Button sx={buttonStyles.buttonsubmit}
                                    onClick={(e) => delCategorycheckbox(e)}
                                > OK </Button>
                            </>
                            :
                            <Button sx={buttonStyles.buttonsubmit} onClick={handleCloseModcheckbox} >Ok</Button>
                        }
                    </DialogActions>
                </Dialog>

            </Box>

            {/* Check delete Modal */}
            <Box>
                <>
                    <Box>
                        {/* ALERT DIALOG */}
                        <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                            <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />

                                <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                                    {checkUser > 0 ? (
                                        <>
                                            <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteproject?.categoryname} `}</span>was linked
                                        </>
                                    ) : (
                                        ""
                                    )}
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

            <br />
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
                filteredDataTwo={filteredData ?? []}
                itemsTwo={items ?? []}
                filename={"Category Template"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Category Template Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delCategory}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            {/* <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delCategorycheckbox}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            /> */}
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

export default CategoryMaster;