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
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl, Grid,
    IconButton,
    List, ListItem,
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
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../../components/Alert.js";
import { DeleteConfirmation, PleaseSelectRow, } from "../../../components/DeleteConfirmation.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import ExportData from "../../../components/ExportData.js";
import Headtitle from "../../../components/Headtitle.js";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert.js";
import PageHeading from "../../../components/PageHeading.js";
import StyledDataGrid from "../../../components/TableStyle.js";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext.js";
import { userStyle } from "../../../pageStyle.js";
import { SERVICE } from "../../../services/Baseservice.js";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';

function HardwareSpecification() {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);

    let newval = "HS0001";
    const [cateCode, setCatCode] = useState([]);
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

    let exportColumnNames = ["Type", "Name", "Code"];
    let exportRowValues = ["type", "name", "code"];

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Hardware Specification"),
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

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [applicationName, setApplicationName] = useState({
        name: "",
        type: "Please Select Type",
    });
    const [applicationNameEdit, setApplicationNameEdit] = useState({
        name: "",
        type: "Please Select Type",
    });
    const [loader, setLoader] = useState(false);
    const [applicationNameArray, setApplicationNameArray] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [isBtn, setIsBtn] = useState(false);
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteAssetCapacity, setDeleteApplicationName] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allApplicationNameEdit, setAllApplicationNameEdit] = useState([]);
    const [copiedData, setCopiedData] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        name: true,
        code: true,
        type: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    //useEffect
    useEffect(() => {
        addSerialNumber(applicationNameArray);
    }, [applicationNameArray]);

    useEffect(() => {
        fetchApplicationNameAll();
    }, [isEditOpen]);



    useEffect(() => {
        fetchApplicationName();
    }, []);
    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
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
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    // Manage Columns
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };
    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };
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
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    //set function to get particular row
    const rowData = async (id, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.SINGLE_HARDWARESPECIFICATION}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteApplicationName(res?.data?.shardwarespecification);
            handleClickOpen();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    // Alert delete popup
    let assetid = deleteAssetCapacity._id;
    const delAsset = async () => {
        setPageName(!pageName)
        try {
            await axios.delete(`${SERVICE.SINGLE_HARDWARESPECIFICATION}/${assetid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchApplicationName();
            setLoader(true);
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //add function
    const sendRequest = async () => {
        setPageName(!pageName)
        setIsBtn(true);
        try {
            let freqCreate = await axios.post(SERVICE.CREATE_HARDWARESPECIFICATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                name: String(applicationName.name),
                type: String(applicationName.type),
                code: String(applicationName.code),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setApplicationName(freqCreate.data);
            await fetchApplicationName();
            setApplicationName({
                name: "", type: "Please Select Type", code: ""

            });
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsBtn(false);
        } catch (err) {
            setIsBtn(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //submit option for saving
    const handleSubmit = (e) => {
        setPageName(!pageName)
        e.preventDefault();
        const isNameMatch = applicationNameArray?.some(
            (item) => item.name?.toLowerCase() === applicationName.name?.toLowerCase() &&
                item.type?.toLowerCase() === applicationName.type?.toLowerCase() &&
                item.code?.toLowerCase() === applicationName.code?.toLowerCase()
        );
        if (applicationName.type === "Please Select Type") {
            setPopupContentMalert("Please Select Type!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (applicationName.name === "") {
            setPopupContentMalert("Please Enter Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (applicationName.code === "") {
          setPopupContentMalert("Please Enter Code!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
      }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exist!!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendRequest();
        }
    };

    const handleclear = (e) => {
        setPageName(!pageName)
        e.preventDefault();
        setApplicationName({
            name: "", type: "Please Select Type", code: ""
        });
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
            let res = await axios.get(`${SERVICE.SINGLE_HARDWARESPECIFICATION}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setApplicationNameEdit(res?.data?.shardwarespecification);
            handleClickOpenEdit();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // get single row to view....
    const getviewCode = async (id) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.SINGLE_HARDWARESPECIFICATION}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setApplicationNameEdit(res?.data?.shardwarespecification);
            handleClickOpenview();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.SINGLE_HARDWARESPECIFICATION}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setApplicationNameEdit(res?.data?.shardwarespecification);
            handleClickOpeninfo();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    //frequency master name updateby edit page...
    let updateby = applicationNameEdit.updatedby;
    let addedby = applicationNameEdit.addedby;
    let frequencyId = applicationNameEdit._id;
    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.put(
                `${SERVICE.SINGLE_HARDWARESPECIFICATION}/${frequencyId}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    name: String(applicationNameEdit.name),
                    type: String(applicationNameEdit.type),
                    code: String(applicationNameEdit.code),
                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            await fetchApplicationName();
            await fetchApplicationNameAll();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const editSubmit = (e) => {
        setPageName(!pageName)
        e.preventDefault();
        fetchApplicationNameAll();
        const isNameMatch = allApplicationNameEdit?.some(
            (item) =>
                item.name?.toLowerCase() === applicationNameEdit.name?.toLowerCase() &&
                item.type?.toLowerCase() === applicationNameEdit.type?.toLowerCase() &&
                item.code?.toLowerCase() === applicationNameEdit.code?.toLowerCase() 
        );
        if (applicationNameEdit.type === "Please Select Type" || applicationNameEdit.type === "" || applicationNameEdit.type === undefined) {
            setPopupContentMalert("Please Select Type!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (applicationNameEdit.name === "") {
            setPopupContentMalert("Please Enter Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
          else if (applicationNameEdit.code === "") {
          setPopupContentMalert("Please Enter Code!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
      }
        else if (isNameMatch) {
            setPopupContentMalert("Data already exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendEditRequest();
        }
    };
    //get all frequency master name.
    const fetchApplicationName = async () => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.ALL_HARDWARESPECIFICATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLoader(true);
            setApplicationNameArray(res_freq?.data?.hardwarespecification.map((item, index) => ({
                ...item,
                id: item._id,
                serialNumber: index + 1,

            })));
            setCatCode(res_freq?.data?.hardwarespecification);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const bulkDeleteFunction = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.SINGLE_HARDWARESPECIFICATION}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });
            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);
            await fetchApplicationName()
            await fetchApplicationNameAll();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    //get all Hardware Specification Name.
    const fetchApplicationNameAll = async () => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.ALL_HARDWARESPECIFICATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLoader(true);
            setAllApplicationNameEdit(
                res_freq?.data?.hardwarespecification.filter(
                    (item) => item._id !== applicationNameEdit._id
                )
            );
            setCatCode(res_freq?.data?.hardwarespecification);

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //image

    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Hardware Specification.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Hardware Specification",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = (datas) => {
        // const itemsWithSerialNumber = datas?.map((item, index) => ({
        //   ...item,
        //   serialNumber: index + 1,
        // }));
        setItems(datas);
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
    // const handleSearchChange = (event) => {
    //   setSearchQuery(event.target.value);
    //   setPage(1);
    // };

    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredData = filteredDatas?.slice(
        (page - 1) * pageSize,
        page * pageSize
    );
    const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );
    const pageNumbers = [];
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

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
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },

        {
            field: "type",
            headerName: "Type",
            flex: 0,
            width: 250,
            hide: !columnVisibility.type,
            headerClassName: "bold-header",
        },
        {
            field: "name",
            headerName: "Name",
            flex: 0,
            width: 250,
            hide: !columnVisibility.name,
            headerClassName: "bold-header",
        },
        {
            field: "code",
            headerName: "Code",
            flex: 0,
            width: 250,
            hide: !columnVisibility.code,
            headerClassName: "bold-header",
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
                    {isUserRoleCompare?.includes("ehardwarespecification") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.data.id);
                            }}
                        >
                            <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dhardwarespecification") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.data.id, params.data.name);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vhardwarespecification") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ihardwarespecification") && (
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
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            ...item,
            id: item._id,
            serialNumber: item.serialNumber,
            name: item.name,
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
                            {" "}
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

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState("");

    const typeOpt = [
        { label: "Asset Specification Type", value: "Asset Specification Type" },
        { label: "Asset Model", value: "Asset Model" },
        { label: "Asset Size", value: "Asset Size" },
        { label: "Asset Variant", value: "Asset Variant" },
        { label: "Asset Capacity", value: "Asset Capacity" },
        { label: "Brand Master", value: "Brand Master" },
        { label: "Panel Type", value: "Panel Type" },
        { label: "Screen Resolution", value: "Screen Resolution" },
        { label: "Connectivity", value: "Connectivity" },
        { label: "Data Range", value: "Data Range" },
        { label: "Compatible Device", value: "Compatible Device" },
        { label: "Output Power", value: "Output Power" },
        { label: "Cooling Fan Count", value: "Cooling Fan Count" },
        { label: "Clock Speed", value: "Clock Speed" },
        { label: "Cores", value: "Cores" },
        { label: "Speed", value: "Speed" },
        { label: "Frequency", value: "Frequency" },
        { label: "Output", value: "Output" },
        { label: "Ethernet Ports", value: "Ethernet Ports" },
        { label: "Distance", value: "Distance" },
        { label: "Length", value: "Length" },
        { label: "Slot", value: "Slot" },
        { label: "Number Of Channels", value: "Number Of Channels" },
        { label: "Colours", value: "Colours" },
    ];



    return (
        <Box>
            <Headtitle title={"HARDWARE SPECIFICATION"} />
            <PageHeading
                title="Hardware Specification"
                modulename="Asset"
                submodulename="Asset Specifications"
                mainpagename="Hardware Specification"
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("ahardwarespecification") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Add Hardware Specification
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={typeOpt}
                                            value={{ label: applicationName.type, value: applicationName.type }}
                                            onChange={(e) => {
                                                setApplicationName({
                                                    ...applicationName,
                                                    type: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Name <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Name"
                                            value={applicationName.name}
                                            onChange={(e) => {
                                                setApplicationName({
                                                    ...applicationName,
                                                    name: e.target.value,
                                                    code: e.target.value.slice(0, 4)?.toUpperCase(),
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {/* <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  {cateCode &&
                    cateCode.map(() => {
                      let strings = "HS";
                      let refNo = cateCode[cateCode.length - 1].code;
                      let digits = (cateCode.length + 1).toString();
                      const stringLength = refNo.length;
                      let lastChar = refNo.charAt(stringLength - 1);
                      let getlastBeforeChar = refNo.charAt(stringLength - 2);
                      let getlastThreeChar = refNo.charAt(stringLength - 3);
                      let lastBeforeChar = refNo.slice(-2);
                      let lastThreeChar = refNo.slice(-3);
                      let lastDigit = refNo.slice(-4);
                      let refNOINC = parseInt(lastChar) + 1;
                      let refLstTwo = parseInt(lastBeforeChar) + 1;
                      let refLstThree = parseInt(lastThreeChar) + 1;
                      let refLstDigit = parseInt(lastDigit) + 1;
                      if (digits.length < 4 && getlastBeforeChar == 0 && getlastThreeChar == 0) {
                        refNOINC = ("000" + refNOINC).substr(-4);
                        newval = strings + refNOINC;
                      } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                        refNOINC = ("00" + refLstTwo).substr(-4);
                        newval = strings + refNOINC;
                      } else if (digits.length < 4 && getlastThreeChar > 0) {
                        refNOINC = ("0" + refLstThree).substr(-4);
                        newval = strings + refNOINC;
                      } else {
                        refNOINC = refLstDigit.substr(-4);
                        newval = strings + refNOINC;
                      }
                    })}
                  <Typography>
                    Code <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput id="component-outlined" placeholder="Please Enter Category  Code" value={newval} />
                </FormControl>
              </Grid> */}
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Code <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Code"
                                            value={applicationName.code}
                                            // onChange={(e) => {
                                            //     setApplicationName({
                                            //         ...applicationName,
                                            //         code: e.target.value.slice(0, 4).toUpperCase(),
                                            //     });
                                            // }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12} sx={{ marginTop: "25px" }}>
                                    <Grid container spacing={4}>
                                        <Grid item md={4} xs={12} sm={6}>
                                            <Button
                                                variant="contained"
                                                sx={buttonStyles.buttonsubmit}
                                                onClick={handleSubmit}
                                                disabled={isBtn}
                                            >
                                                Submit
                                            </Button>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={6}>
                                            <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                                                Clear
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </>
            )}
            <br />

            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lhardwarespecification") && (
                <Box sx={userStyle.container}>
                    {/* ******************************************************EXPORT Buttons****************************************************** */}
                    <Grid item xs={8}>
                        <Typography sx={userStyle.importheadtext}>
                            Hardware Specification List
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
                                    <MenuItem value={applicationNameArray?.length}>All</MenuItem>
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
                                {isUserRoleCompare?.includes("excelhardwarespecification") && (
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
                                {isUserRoleCompare?.includes("csvhardwarespecification") && (
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
                                {isUserRoleCompare?.includes("printhardwarespecification") && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                            &ensp;
                                            <FaPrint />
                                            &ensp;Print&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("pdfhardwarespecification") && (
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
                                <Button
                                    sx={userStyle.buttongrp}
                                    onClick={handleCaptureImage}
                                >
                                    {" "}
                                    <ImageIcon
                                        sx={{ fontSize: "15px" }}
                                    /> &ensp;Image&ensp;{" "}
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                            <Box>
                                {/* <FormControl fullWidth size="small">
                  <Typography>Search</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </FormControl> */}
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTable}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={applicationNameArray}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={applicationNameArray}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <br />
                    <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                        Show All Columns
                    </Button>
                    &ensp;
                    <Button
                        sx={userStyle.buttongrp}
                        onClick={handleOpenManageColumns}
                    >
                        Manage Columns
                    </Button>
                    &ensp;
                    {isUserRoleCompare?.includes("bdhardwarespecification") && (
                        <Button
                            variant="contained"
                            sx={buttonStyles.buttonbulkdelete}
                            onClick={handleClickOpenalert}
                        >
                            Bulk Delete
                        </Button>
                    )}
                    <br />
                    <br />
                    {/* {!loader ? (
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
          ) : (
            <>
              <Box
                style={{
                  width: "100%",
                  overflowY: "hidden", // Hide the y-axis scrollbar
                }}
              >
                <StyledDataGrid
                  onClipboardCopy={(copiedString) =>
                    setCopiedData(copiedString)
                  }
                  rows={rowsWithCheckboxes}
                  columns={columnDataTable.filter(
                    (column) => columnVisibility[column.field]
                  )}
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
                  Showing{" "}
                  {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                  {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                  {filteredDatas?.length} entries
                </Box>
                <Box>
                  <Button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    sx={userStyle.paginationbtn}
                  >
                    <FirstPageIcon />
                  </Button>
                  <Button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    sx={userStyle.paginationbtn}
                  >
                    <NavigateBeforeIcon />
                  </Button>
                  {pageNumbers?.map((pageNumber) => (
                    <Button
                      key={pageNumber}
                      sx={userStyle.paginationbtn}
                      onClick={() => handlePageChange(pageNumber)}
                      className={page === pageNumber ? "active" : ""}
                      disabled={page === pageNumber}
                    >
                      {pageNumber}
                    </Button>
                  ))}
                  {lastVisiblePage < totalPages && <span>...</span>}
                  <Button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    sx={userStyle.paginationbtn}
                  >
                    <NavigateNextIcon />
                  </Button>
                  <Button
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                    sx={userStyle.paginationbtn}
                  >
                    <LastPageIcon />
                  </Button>
                </Box>
              </Box>
            </>
          )} */}


                    {!loader ? (
                        <>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>

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
                                // totalDatas={totalDatas}
                                searchQuery={searchedString}
                                handleShowAllColumns={handleShowAllColumns}
                                setFilteredRowData={setFilteredRowData}
                                filteredRowData={filteredRowData}
                                setFilteredChanges={setFilteredChanges}
                                filteredChanges={filteredChanges}
                                gridRefTableImg={gridRefTableImg}
                                itemsList={applicationNameArray}
                            />
                        </>
                    )}


                    {/* ****** Table End ****** */}
                </Box>
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
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                fullWidth={true}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Hardware Specification
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>

                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Type</Typography>
                                    <Typography>{applicationNameEdit.type}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Name</Typography>
                                    <Typography>{applicationNameEdit.name}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Code</Typography>
                                    <Typography>{applicationNameEdit.code}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                variant="contained"
                                sx={buttonStyles.btncancel}
                                onClick={handleCloseview}
                            // sx={{ marginLeft: "15px" }}
                            >
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
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                    }}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Edit Hardware Specification
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={typeOpt}
                                            value={{ label: applicationNameEdit.type, value: applicationNameEdit.type }}
                                            onChange={(e) => {
                                                setApplicationNameEdit({
                                                    ...applicationNameEdit,
                                                    type: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Name <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Name"
                                            value={applicationNameEdit.name}
                                            onChange={(e) => {
                                                setApplicationNameEdit({
                                                    ...applicationNameEdit,
                                                    name: e.target.value,
                                                    code: e.target.value.slice(0, 4)?.toUpperCase(),

                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {/* <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Code <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      value={applicationNameEdit.code}
                                         />
                  </FormControl>
                </Grid> */}
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Code <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Code"
                                            value={applicationNameEdit.code}
                                            // onChange={(e) => {
                                            //     setApplicationNameEdit({
                                            //         ...applicationNameEdit,
                                            //         code: e.target.value.slice(0, 4).toUpperCase(),
                                            //     });
                                            // }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>
            <br />
            {/* EXPTERNAL COMPONENTS -------------- START */}
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
                itemsTwo={applicationNameArray ?? []}
                filename={"Hardware Specification"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Hardware Specification Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delAsset}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={bulkDeleteFunction}
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
            {/* EXPTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default HardwareSpecification;