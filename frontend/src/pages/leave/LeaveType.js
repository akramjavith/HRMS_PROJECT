import React, { useState, useEffect, useRef, useContext } from "react";
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, Popover, Checkbox, TextareaAutosize } from "@mui/material";
import { userStyle } from "../../pageStyle";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import axios from "axios";
import { SERVICE } from '../../services/Baseservice';
import { handleApiError } from "../../components/Errorhandling";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import StyledDataGrid from "../../components/TableStyle";
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
import { styled } from '@mui/system';
import Resizable from 'react-resizable';
import { saveAs } from "file-saver";
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import LoadingButton from "@mui/lab/LoadingButton";
import ExportData from "../../components/ExportData";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import AlertDialog from "../../components/Alert";
import InfoPopup from "../../components/InfoPopup.js";
import { DeleteConfirmation, PleaseSelectRow, } from "../../components/DeleteConfirmation.js";
import ManageColumnsContent from "../../components/ManageColumn";

function Leavetype() {

    const [leaveTypeState, setLeavetypeState] = useState({
        leavetype: "",
        code: "",
        description: ""
    });

    const [LeaveTypeEdit, setLeaveTypeEdit] = useState({
        leavetype: "",
        code: "",
        description: ""
    })

    const [leaveTypeData, setLeaveTypeData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allSourceedit, setAllSourceedit] = useState([]);

    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [sourceCheck, setSourcecheck] = useState(false);
    const [isBtn, setIsBtn] = useState(false);
    const username = isUserRoleAccess.username

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');
    const [openviewalert, setOpenviewalert] = useState(false);

    // view model
    const handleClickOpenviewalert = () => { setOpenviewalert(true); };
    const handleCloseviewalert = () => { setOpenviewalert(false); };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => { setIsFilterOpen(false); };
    const handleClosePdfFilterMod = () => { setIsPdfFilterOpen(false); };

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => { setOpenPopupMalert(true); };
    const handleClosePopupMalert = () => { setOpenPopupMalert(false); };

    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => { setOpenPopup(true); };
    const handleClosePopup = () => { setOpenPopup(false); }

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // view model
    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => { setOpenview(true); };
    const handleCloseview = () => { setOpenview(false); };

    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => { setIsErrorOpenpop(true); };
    const handleCloseerrpop = () => { setIsErrorOpenpop(false); };

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
        setIsBtn(false);
    };

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleCloseMod = () => { setIsDeleteOpen(false); };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleClickOpenalert = () => {
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => { setIsDeleteOpenalert(false); };

    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const handleClickOpencheckbox = () => { setIsDeleteOpencheckbox(true); };
    const handleCloseModcheckbox = () => { setIsDeleteOpencheckbox(false); };

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

    // Styles for the resizable column
    const ResizableColumn = styled(Resizable)`
       .react-resizable-handle {
       width: 10px;
       height: 100%;
       position: absolute;
       right: 0;
       bottom: 0;
       cursor: col-resize;
       }
       `;

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
        leavetype: true,
        code: true,
        description: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };


    useEffect(() => {
        getapi();
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Leave Type"),
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

    const [deleteSource, setDeleteSource] = useState("");

    const rowData = async (id, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.LEAVETYPE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteSource(res?.data?.sleavetype);
            handleClickOpen();

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    // Alert delete popup
    let Sourcesid = deleteSource?._id;
    const delSource = async () => {

        try {
            if (Sourcesid) {
                await axios.delete(`${SERVICE.LEAVETYPE_SINGLE}/${Sourcesid}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
                await fetchSource();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1)
            }
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const delSourcecheckbox = async () => {
        try {

            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.LEAVETYPE_SINGLE}/${item}`, {
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

            await fetchSource();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //add function 
    const sendRequest = async () => {
        setPageName(!pageName)
        try {
            let subprojectscreate = await axios.post(SERVICE.LEAVETYPE_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                leavetype: String(leaveTypeState.leavetype),
                code: String(leaveTypeState.code),
                description: String(leaveTypeState.description),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            })
            await fetchSource();
            setLeavetypeState({
                ...leaveTypeState,
                leavetype: "",
                code: "",
                description: ""
            })
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsBtn(false);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = leaveTypeData.some(item =>
            item?.leavetype?.toLowerCase() === (leaveTypeState?.leavetype)?.toLowerCase() &&
            item?.code?.toLowerCase() === (leaveTypeState?.code)?.toLowerCase()
        );

        const codeDup = leaveTypeData.some((item) => item?.code?.toLowerCase() == (leaveTypeState?.code)?.toLowerCase())

        const nameDup = leaveTypeData.some((item) => item?.leavetype?.toLowerCase() == (leaveTypeState?.leavetype)?.toLowerCase())

        if (leaveTypeState.leavetype === "") {
            setPopupContentMalert("Please Enter Name");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (leaveTypeState.code === "") {
            setPopupContentMalert("Please Enter Code");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exists!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (nameDup) {
            setPopupContentMalert("Name Already Exists!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (codeDup) {
            setPopupContentMalert("Code Already Exists!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            setIsBtn(true);
            sendRequest();
        }
    }

    const handleClear = (e) => {
        e.preventDefault();
        setIsBtn(false);
        setLeavetypeState({
            leavetype: "",
            code: "",
            description: ""

        })
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    }

    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => { setIsEditOpen(true); };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setIsEditOpen(false);
    };

    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const handleClickOpenCheck = () => { setisCheckOpen(true); };
    const handleCloseCheck = () => { setisCheckOpen(false); };

    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => { setOpeninfo(true); };
    const handleCloseinfo = () => { setOpeninfo(false); };

    //get single row to edit....
    const getCode = async (e, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.LEAVETYPE_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setLeaveTypeEdit(res?.data?.sleavetype);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }


    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.LEAVETYPE_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setLeaveTypeEdit(res?.data?.sleavetype);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.LEAVETYPE_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setLeaveTypeEdit(res?.data?.sleavetype);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //Project updateby edit page...
    let updateby = LeaveTypeEdit?.updatedby;
    let addedby = LeaveTypeEdit?.addedby;

    let subprojectsid = LeaveTypeEdit?._id;

    //editing the single data...
    const sendEditRequest = async () => {
        try {
            let res = await axios.put(`${SERVICE.LEAVETYPE_SINGLE}/${subprojectsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                leavetype: String(LeaveTypeEdit.leavetype),
                code: String(LeaveTypeEdit.code),
                description: String(LeaveTypeEdit.description),
                updatedby: [
                    ...updateby, {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchSource();
            await fetchSourceAll();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    const editSubmit = (e) => {
        e.preventDefault();
        fetchSourceAll();
        const isNameMatch = allSourceedit.some(item =>
            item?.leavetype?.toLowerCase() === (LeaveTypeEdit?.leavetype)?.toLowerCase() &&
            item?.code?.toLowerCase() === (LeaveTypeEdit?.code)?.toLowerCase()
        );

        const CodeExist = allSourceedit.some((item) => item?.code?.toLowerCase() === (LeaveTypeEdit?.code)?.toLowerCase())

        const NameExist = allSourceedit.some((item) => item?.leavetype?.toLowerCase() === (LeaveTypeEdit?.leavetype)?.toLowerCase())

        if (LeaveTypeEdit.leavetype === "") {
            setPopupContentMalert("Please Enter Name");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (LeaveTypeEdit.code === "") {
            setPopupContentMalert("Please Enter Code");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exists!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (NameExist) {
            setPopupContentMalert("Name Already Exists!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (CodeExist) {
            setPopupContentMalert("Code Already Exists!");
            setPopupSeverityMalert("warning");
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
            let res_vendor = await axios.get(SERVICE.LEAVETYPE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            setLeaveTypeData(res_vendor?.data?.leavetype);
            setSourcecheck(true)
        } catch (err) { setSourcecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }


    //get all Sub vendormasters.
    const fetchSourceAll = async () => {
        setPageName(!pageName)
        try {
            let res_meet = await axios.get(SERVICE.LEAVETYPE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setAllSourceedit(res_meet?.data?.leavetype.filter(item => item._id !== LeaveTypeEdit._id));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    //id for login...
    let loginid = localStorage.LoginUserId;
    let authToken = localStorage.APIToken;

    useEffect(() => {
        // getexcelDatas();
    }, [LeaveTypeEdit, leaveTypeState, leaveTypeData])

    useEffect(() => {
        fetchSource();
        fetchSourceAll();
    }, [])

    useEffect(() => {
        fetchSourceAll();
    }, [isEditOpen, LeaveTypeEdit])


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
        const itemsWithSerialNumber = leaveTypeData?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [leaveTypeData])


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
        { field: "leavetype", headerName: "Leave Type", flex: 0, width: 250, hide: !columnVisibility.leavetype, headerClassName: "bold-header" },
        { field: "code", headerName: "Code", flex: 0, width: 250, hide: !columnVisibility.code, headerClassName: "bold-header" },
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
                    {isUserRoleCompare?.includes("eleavetype") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {
                            handleClickOpenEdit();
                            getCode(params.row.id, params.row.name);
                        }}><EditOutlinedIcon sx={buttonStyles.buttonedit} /></Button>
                    )}
                    {isUserRoleCompare?.includes("dleavetype") && (
                        <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.row.id, params.row.name) }}><DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} /></Button>
                    )}
                    {isUserRoleCompare?.includes("vleavetype") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ileavetype") && (
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
            leavetype: item.leavetype,
            code: item.code,
            description: item.description
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

    // Excel
    const [fileFormat, setFormat] = useState('');
    let exportColumnNamescrt = ["Leave Type", "Code", "Description",]
    let exportRowValuescrt = ["leavetype", "code", "description",]

    // print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Leave Type',
        pageStyle: 'print'
    });

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Leave Type.png');
                });
            });
        }
    };

    return (
        <Box>
            <Headtitle title={'LEAVE TYPE'} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Manage Leave Type"
                modulename="Leave&Permission"
                submodulename="Leave"
                mainpagename="Leave Type"
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("aleavetype")
                && (
                    <>
                        <Box sx={userStyle.dialogbox}>
                            <Grid container spacing={2}>
                                <Grid item md={12} sm={12} xs={12}>
                                    <Typography sx={userStyle.importheadtext}>Add Leave Type</Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Name<b style={{ color: "red" }}>*</b></Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Leave Type"
                                            value={leaveTypeState.leavetype}
                                            onChange={(e) => {
                                                setLeavetypeState({
                                                    ...leaveTypeState,
                                                    leavetype: e.target.value,
                                                    code: e.target.value.slice(0, 4)?.toUpperCase()
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> CODE<b style={{ color: "red" }}>*</b></Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Code"
                                            value={leaveTypeState.code}
                                            onChange={(e) => {
                                                setLeavetypeState({
                                                    ...leaveTypeState,
                                                    code: e.target.value.slice(0, 4)?.toUpperCase(),
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Description</Typography>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={5}
                                            value={leaveTypeState.description}
                                            onChange={(e) => {
                                                setLeavetypeState({ ...leaveTypeState, description: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={1} md={2} sm={2} xs={6} >
                                    <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    </Box>
                                    <LoadingButton
                                        onClick={handleSubmit}
                                        loading={isBtn}
                                        color="primary"
                                        loadingPosition="end"
                                        sx={buttonStyles.buttonsubmit}
                                        variant="contained"
                                    >Save</LoadingButton>
                                </Grid>
                                <Grid item lg={1} md={2} sm={2} xs={6} >
                                    <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                        <Button sx={buttonStyles.btncancel} onClick={handleClear}>Clear</Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </>
                )}<br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lleavetype") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.importheadtext}>Leave Type List</Typography>
                            </Grid>
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
                                        {/* <MenuItem value={(leaveTypeData?.length)}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelleavetype") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvleavetype") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printleavetype") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfleavetype") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageleavetype") && (
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
                        </Grid>  <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        {isUserRoleCompare?.includes("bdleavetype") && (
                            <Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert} >Bulk Delete</Button>)}  <br /><br />
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
                                    style={{ width: '100%', overflowY: 'hidden', }}  >
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
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumns}
                    searchQuery={searchQueryManage}
                    setSearchQuery={setSearchQueryManage}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibility}
                    toggleColumnVisibility={toggleColumnVisibility}
                    setColumnVisibility={setColumnVisibility}
                    initialColumnVisibility={initialColumnVisibility}
                    columnDataTable={columnDataTable}
                />
            </Popover>

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
                filteredDataTwo={filteredData ?? []}
                itemsTwo={items ?? []}
                filename={"Leave Type"}
                exportColumnNames={exportColumnNamescrt}
                exportRowValues={exportRowValuescrt}
                componentRef={componentRef}
            />
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Leave Type Info"
                addedby={addedby}
                updateby={updateby}
            />
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delSource}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delSourcecheckbox}
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
            />

            {/* Edit DIALOG */}
            <Dialog
                open={isEditOpen}
                onClose={handleCloseModEdit}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                // maxWidth="sm"
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
                                    <Typography sx={userStyle.HeaderText}>Edit Leave Type</Typography>
                                </Grid>
                            </Grid><br />
                            <Grid container spacing={2}>

                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Name<b style={{ color: "red" }}>*</b></Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Leave Type"
                                            value={LeaveTypeEdit.leavetype}
                                            onChange={(e) => {
                                                setLeaveTypeEdit({
                                                    ...LeaveTypeEdit,
                                                    leavetype: e.target.value,
                                                    code: e.target.value.slice(0, 4)?.toUpperCase()
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> CODE<b style={{ color: "red" }}>*</b></Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Code"
                                            value={LeaveTypeEdit.code}
                                            onChange={(e) => {
                                                setLeaveTypeEdit({
                                                    ...LeaveTypeEdit,
                                                    code: e.target.value.slice(0, 4)?.toUpperCase(),
                                                });
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
                                            value={LeaveTypeEdit.description}
                                            onChange={(e) => {
                                                setLeaveTypeEdit({ ...LeaveTypeEdit, description: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid> <br />
                            <Grid container spacing={1}>
                                <Grid item lg={3} md={3} sm={12} xs={12} >
                                    <Button variant="contained" sx={buttonStyles.buttonsubmit} type="submit">Update</Button>
                                </Grid>
                                <Grid item lg={3} md={3} sm={12} xs={12} >
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit} >Cancel</Button>
                                </Grid>
                            </Grid>
                            {/* </DialogContent> */}
                        </form>
                    </>
                </Box>
            </Dialog>

            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            // maxWidth="lg"
            >
                <Box sx={{ width: "450px", padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Leave Type</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>

                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Name</Typography>
                                    <Typography>{LeaveTypeEdit.leavetype}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Code</Typography>
                                    <Typography>{LeaveTypeEdit.code}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Description</Typography>
                                    <Typography>{LeaveTypeEdit.description}</Typography>
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
    );
}


export default Leavetype;