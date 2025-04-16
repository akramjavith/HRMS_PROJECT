import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import StyledDataGrid from "../../../components/TableStyle";
import { handleApiError } from "../../../components/Errorhandling";
import 'jspdf-autotable';
import axios from "axios";
import { SERVICE } from '../../../services/Baseservice';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { saveAs } from "file-saver";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { MultiSelect } from "react-multi-select-component";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import ExportData from "../../../components/ExportData";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import InfoPopup from "../../../components/InfoPopup.js";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import PageHeading from "../../../components/PageHeading";

function Componentsgrouping() {

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

    let exportColumnNames = ['Component Grouping Name', 'Components_Subcomponents'];
    let exportRowValues = ['name', 'compinedgroups'];

    const gridRef = useRef(null);
    const [componentGrp, setComponentGrp] = useState({
        name: "", componentsubname: ""
    });
    const [componentGrpEdit, setComponentGrpEdit] = useState({ name: '' })
    const [vendormaster, setVendormaster] = useState([]);
    const [isBtn, setIsBtn] = useState(false);
    const [compName, setCompname] = useState([]);
    const [selectedOptionsAddCate, setSelectedOptionsAddCate] = useState([]);
    const [selectedOptionsEditCate, setSelectedOptionsEditCate] = useState("");
    let [valueCateAdd, setValueCateAdd] = useState("")
    let [valueCateEdit, setValueCateEdit] = useState("")
    const [searchQuery, setSearchQuery] = useState("");
    const [allcomponentGrpedit, setAllcomponentGrpedit] = useState([]);
    const { isUserRoleCompare, allProjects, isUserRoleAccess, pageName, setPageName, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [vendorCheck, setVendorcheck] = useState(false);
    const username = isUserRoleAccess.username

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Components Grouping.png');
                });
            });
        }
    };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // view model
    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => { setOpenview(true); };
    const handleCloseview = () => { setOpenview(false); };

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleCloseMod = () => { setIsDeleteOpen(false); };

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    const [deletesubproject, setDeletesubproject] = useState("");

    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => { setIsEditOpen(true); };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setIsEditOpen(false);
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => { setOpeninfo(true); };
    const handleCloseinfo = () => { setOpeninfo(false); };

    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');
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
        name: true,
        componentgroups: true,
        compinedgroups: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    const rowData = async (id) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.COMPONENTSGROUPING_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeletesubproject(res?.data?.scompgrouping);
            setComponentGrpEdit(res?.data?.scompgrouping);
            handleClickOpen();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    // Alert delete popup
    let subprojectid = deletesubproject?._id;
    const delSubproject = async () => {
        setPageName(!pageName);
        try {
            if (subprojectid) {
                await axios.delete(`${SERVICE.COMPONENTSGROUPING_SINGLE}/${subprojectid}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
                await fetchCompGroup();
                handleCloseMod();
                setPage(1)
            }
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //fetching Project for Dropdowns
    const fetchSubComponentname = async () => {
        setPageName(!pageName);
        try {
            let res_project = await axios.get(SERVICE.SUBCOMPONENTMASTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const compandsubcomp = [...res_project?.data?.subcomponent.map((d) => (
                {
                    ...d,
                    label: d.componentname + "_" + d.subCompName,
                    value: d.componentname + "_" + d.subCompName
                }
            ))];
            // Sort the compandsubcomp array in ascending order
            compandsubcomp.sort((a, b) => a.label.localeCompare(b.label));
            setCompname(compandsubcomp);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // Add
    const handleCategoryChange = (options) => {
        const mergedComponent = options.reduce((accumulator, currentOption) => {
            const componentname = currentOption.value.split('_')[0];
            const subCompName = currentOption.value.split('_')[1];
            const existingComponent = accumulator.find(
                (component) => component.componentname === componentname
            );
            if (existingComponent) {
                existingComponent.subCompNames.push({ subCompName: subCompName });
            } else {
                accumulator.push({
                    componentname: componentname,
                    subCompNames: [{ subCompName: subCompName }],
                });
            }
            return accumulator;
        }, []);
        setValueCateAdd(mergedComponent);
        setSelectedOptionsAddCate(options);
    };

    const customValueRendererCate = (valueCateAdd, _compName) => {
        return valueCateAdd.length
            ? valueCateAdd.map(({ label }) => label).join(", ")
            : "Please Select Components_Subcomponents";
    };

    //add function 
    const sendRequest = async () => {
        setPageName(!pageName);
        setIsBtn(true);
        try {
            let componentgrpcreate = await axios.post(SERVICE.COMPONENTSGROUPING_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                name: String(componentGrp.name),
                componentgroups: [...valueCateAdd],
                addedby: [
                    {
                        name: String(username),
                        date: String(new Date()),
                    },
                ],
            })
            await fetchCompGroup();
            setComponentGrp(componentgrpcreate.data);
            setComponentGrp({ name: "", })
            setSelectedOptionsAddCate([]);
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsBtn(false);
        } catch (err) {
            setIsBtn(false);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    }

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = vendormaster.some(item => item.name.toLowerCase() === (componentGrp.name).toLowerCase());
        if (componentGrp.name === "") {
            setPopupContentMalert("Please Enter ComponentGroup Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsAddCate.length == "" || 0) {
            setPopupContentMalert("Please Select Components_Subcomponents");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Component Grouping already exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    }

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.COMPONENTSGROUPING_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let compandsubcomp = res?.data?.scompgrouping?.componentgroups?.flatMap((d) =>
                d?.subCompNames?.map((t) => (
                    {
                        ...t,
                        label: d.componentname + "_" + t.subCompName,
                        value: d.componentname + "_" + t.subCompName
                    }
                ))
            )
            setComponentGrpEdit({
                ...res?.data?.scompgrouping,
                compinedgroups: compandsubcomp.map((item) => item.label)?.join(","),
            });
            setValueCateAdd(res?.data?.scompgrouping?.componentgroups);
            setValueCateEdit(res?.data?.scompgrouping?.componentgroups);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.COMPONENTSGROUPING_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setComponentGrpEdit(res?.data?.scompgrouping);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //get single row to edit....
    const getrowcompsubcompgrp = (e) => {
        setSelectedOptionsEditCate(
            Array.isArray(e?.componentgroups)
                ? e?.componentgroups?.flatMap((x) =>
                    x?.subCompNames?.map((y) => ({
                        ...y,
                        label: x.componentname + "_" + y.subCompName,
                        value: x.componentname + "_" + y.subCompName,
                    }))
                )
                : []
        );
    };

    // edit
    const handleChangeCate = (selectedOptions) => {
        const mergedComponent = selectedOptions.reduce((accumulator, currentOption) => {
            const componentname = currentOption.value.split('_')[0];
            const subCompName = currentOption.value.split('_')[1];
            const existingComponent = accumulator.find(
                (component) => component.componentname === componentname
            );
            if (existingComponent) {
                existingComponent.subCompNames.push({ subCompName: subCompName });
            } else {
                accumulator.push({
                    componentname: componentname,
                    subCompNames: [{ subCompName: subCompName }],
                });
            }
            return accumulator;
        }, []);

        setValueCateEdit(mergedComponent);
        setSelectedOptionsEditCate(selectedOptions);
    };

    const customValueRendererCateEdit = (valueCateEdit, _compName) => {
        return valueCateEdit.length
            ? valueCateEdit.map(({ label }) => label).join(", ")
            : "Please Select Components_Subcomponents";
    };

    // clear
    const handleClearSelection = () => {
        setComponentGrp({ name: "" })
        setSelectedOptionsAddCate([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    //Project updateby edit page...
    let updateby = componentGrpEdit?.updatedby;
    let addedby = componentGrpEdit?.addedby;
    let subprojectsid = componentGrpEdit?._id;

    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.put(`${SERVICE.COMPONENTSGROUPING_SINGLE}/${subprojectsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                name: String(componentGrpEdit.name),
                componentgroups: [...valueCateEdit],
                updatedby: [
                    ...updateby, {
                        name: String(username),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchCompGroup();
            await fetchComponentGrpAll();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    const editSubmit = (e) => {
        e.preventDefault();
        fetchComponentGrpAll();
        const isNameMatch = allcomponentGrpedit.some(item => item.name.toLowerCase() === (componentGrpEdit.name).toLowerCase());
        if (componentGrpEdit.name === "") {
            setPopupContentMalert("Please Enter Component Groupingname");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsEditCate.length == "" || 0) {
            setPopupContentMalert("Please Select Components_Subcomponents");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Component Grouping already exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    }

    //get all Sub vendormasters.
    const fetchCompGroup = async () => {
        setPageName(!pageName);
        try {
            let res_vendor = await axios.get(SERVICE.COMPONENTSGROUPING, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setVendorcheck(true)
            setVendormaster(res_vendor?.data?.compgrouping);
        } catch (err) { setVendorcheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    // //get all Sub vendormasters.
    const fetchComponentGrpAll = async () => {
        setPageName(!pageName);
        try {
            let res_vendor = await axios.get(SERVICE.COMPONENTSGROUPING, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setAllcomponentGrpedit(res_vendor?.data?.compgrouping.filter(item => item._id !== componentGrpEdit._id));
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    //id for login...
    let loginid = localStorage.LoginUserId;
    let authToken = localStorage.APIToken;

    useEffect(() => {
        fetchCompGroup();
    }, [])

    useEffect(() => {
        fetchCompGroup();
        fetchComponentGrpAll();
        fetchSubComponentname();
    }, [])

    useEffect(() => {
        fetchComponentGrpAll();
    }, [isEditOpen, componentGrpEdit])

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
        const itemsWithSerialNumber = vendormaster?.map((item, index) => {
            let compandsubcomp = item.componentgroups?.flatMap((d) =>
                d?.subCompNames?.map((t) => (
                    {
                        ...t,
                        label: d.componentname + "_" + t.subCompName,
                        value: d.componentname + "_" + t.subCompName
                    }
                ))
            )
            return {
                ...item,
                serialNumber: index + 1,
                compinedgroups: compandsubcomp.map((item) => item.label)?.join(","),
            }
        });
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [vendormaster])

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
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
            width: 70,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header"
        },
        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 80, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
        },
        { field: "name", headerName: "Components Grouping Name", flex: 0, width: 250, hide: !columnVisibility.name, headerClassName: "bold-header" },
        { field: "compinedgroups", headerName: "Components_Subcomponents", flex: 0, width: 300, hide: !columnVisibility.compinedgroups, headerClassName: "bold-header" },
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
                    {isUserRoleCompare?.includes("ecomponentgroup") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {
                            handleClickOpenEdit();
                            getviewCode(params.row.id);
                            getrowcompsubcompgrp(params.row);
                        }}><EditOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                    )}
                    {isUserRoleCompare?.includes("dcomponentgroup") && (
                        <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.row.id) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                    )}
                    {isUserRoleCompare?.includes("vcomponentgroup") && (
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
                    {isUserRoleCompare?.includes("icomponentgroup") && (
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

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            name: item.name,
            componentgroups: item.componentgroups,
            compinedgroups: item.compinedgroups
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

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Component Grouping',
        pageStyle: 'print'
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState('')

    return (
        <Box>
            <Headtitle title={'Components Grouping'} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Components Grouping"
                modulename="Projects"
                submodulename="Components"
                mainpagename="Component Group"
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("acomponentgroup")
                && (
                    <>
                        {/* <Typography sx={userStyle.HeaderText} >Components Grouping </Typography> */}
                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>Add Components Grouping</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container sx={{ justifyContent: "left" }} spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <Typography>Components Grouping Name<b style={{ color: "red" }}>*</b></Typography>
                                        <FormControl size="small" fullWidth>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Grouping Name"
                                                value={componentGrp.name}
                                                onChange={(e) => { setComponentGrp({ ...componentGrp, name: e.target.value }) }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small" >
                                            <Typography>Components and Subcomponents <b style={{ color: "red" }}>*</b></Typography>
                                            <MultiSelect
                                                id="component-outlined"
                                                options={compName}
                                                value={selectedOptionsAddCate}
                                                onChange={(e) => { handleCategoryChange(e); }}
                                                valueRenderer={customValueRendererCate}
                                                name="componentsubname"
                                                placeholder="Please Select Components_Subcomponents"
                                                closeMenuOnSelect={false}
                                                hideSelectedOptions={false}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />
                                <br />
                                <Grid container sx={{ justifyContent: "left" }} spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <Button variant='contained' color='primary' onClick={handleSubmit} disabled={isBtn}>SUBMIT</Button>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <Button sx={userStyle.btncancel} onClick={handleClearSelection}>CLEAR</Button>

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
                >
                    <DialogContent dividers sx={userStyle.dialogbox}  >
                        <Box sx={{ overflow: 'auto', padding: '20px' }}>
                            <>
                                <form onSubmit={editSubmit}>
                                    {/* {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                    <Grid container spacing={2}>
                                        <Typography sx={userStyle.HeaderText}>Edit Components Grouping</Typography>
                                    </Grid><br />
                                    <Grid container spacing={2}>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small" >
                                                <Typography>Components Grouping Name<b style={{ color: "red" }}>*</b></Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="Please Enter Grouping Name"
                                                    value={componentGrpEdit.name}
                                                    onChange={(e) => { setComponentGrpEdit({ ...componentGrpEdit, name: e.target.value }) }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small" >
                                                <Typography>Components and Subcomponents<b style={{ color: "red" }}>*</b></Typography>
                                                <MultiSelect
                                                    id="component-outlined"
                                                    options={compName}
                                                    isMulti
                                                    value={selectedOptionsEditCate}
                                                    onChange={(e) => { handleChangeCate(e); }}
                                                    valueRenderer={customValueRendererCateEdit}
                                                    name="componentname"
                                                    placeholder="Please Select Components_Subcomponents"
                                                    closeMenuOnSelect={false}
                                                    hideSelectedOptions={false}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4}></Grid>
                                    </Grid><br />
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
                    </DialogContent>
                </Dialog>
            </Box>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lcomponentgroup") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>List Components Grouping</Typography>
                        </Grid>
                        <Grid container sx={{ justifyContent: "center" }} >
                            <Grid >
                                {isUserRoleCompare?.includes("excelcomponentgroup") && (
                                    <>
                                        <Button onClick={(e) => {
                                            setIsFilterOpen(true)
                                            fetchCompGroup()
                                            setFormat("xl")
                                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("csvcomponentgroup") && (
                                    <>
                                        <Button onClick={(e) => {
                                            setIsFilterOpen(true)
                                            fetchCompGroup()
                                            setFormat("csv")
                                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("printcomponentgroup") && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("pdfcomponentgroup") && (
                                    <>
                                        <Button sx={userStyle.buttongrp}
                                            onClick={() => {
                                                setIsPdfFilterOpen(true)
                                                fetchCompGroup()
                                            }}
                                        ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("imagecomponentgroup") && (
                                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                )}
                            </Grid>
                        </Grid><br />
                        {/* ****** Table Grid Container ****** */}

                        <Grid style={userStyle.dataTablestyle}>
                            <Box>
                                <label >Show entries:</label>
                                <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                    {/* <MenuItem value={(vendormaster.length)}>All</MenuItem> */}
                                </Select>
                            </Box>
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
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;

                        <br />
                        <br />
                        {!vendorCheck ?
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
                                {/* ****** Table start ****** */}
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
            {/* ****** Table End ****** */}
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
            >
                <Box sx={{ width: "550px", padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Components Grouping</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Components Grouping Name</Typography>
                                    <Typography>{componentGrpEdit.name}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Components and Subcomponents </Typography>
                                    <Typography>{componentGrpEdit.compinedgroups}</Typography>
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
                filename={"Component Grouping"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Component Grouping Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delSubproject}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/* EXTERNAL COMPONENTS -------------- END */}

        </Box>
    );
}


export default Componentsgrouping;