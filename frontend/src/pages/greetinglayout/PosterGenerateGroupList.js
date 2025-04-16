import CloseIcon from "@mui/icons-material/Close";
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
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
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import StyledDataGrid from "../../components/TableStyle";
import { menuItems } from "../../components/menuItemsList";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

function PosterGenerateGroupList({ childGroupAll, statusCheckchild, onAction }) {
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
        setloadingdeloverall(false);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
        setloadingdeloverall(false);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    let exportColumnNames = [
        "Company Name",
        "Branch",
        "Unit",
        "Team",
        "Employee Name",
        "Category Template Name",
        "Sub Category Template Name",
        "Theme Name",
    ];
    let exportRowValues = [
        "company",
        "branch",
        "unit",
        "team",
        "employeename",
        "categoryname",
        "subcategoryname",
        "themename",
    ];

    const [loadingdeloverall, setloadingdeloverall] = useState(false);
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [subcategoryOpt, setSubcategoryOption] = useState([]);
    const [categoryOptionEdit, setCategoryOptionEdit] = useState([]);
    const [subcategorynameOptEdit, setSubcategorynameOptEdit] = useState([]);
    const [userId, setUserID] = useState("");
    const [copiedData, setCopiedData] = useState("");

    //state to handle holiday values
    const [posterGenerate, setPosterGenerate] = useState({
        categoryname: "Please Select Category Template Name",
        subcategoryname: "Please Select Sub-category Template Name",
        themename: "Please Select Theme Name",
    });
    const [themeNames, setThemeNames] = useState([]);


    const [themeNamesEdit, setThemeNamesEdit] = useState([]);
    const [selectedThemeNamesEdit, setSelectedThemeNamesEdit] = useState([]);
    let [valueCatEdit, setValueCatEdit] = useState([]);




    const [posterGenerateEdit, setPosterGenerateEdit] = useState({
        categoryname: "Please Select Category Template Name",
        subcategoryname: "Please Select Sub-category Template Name",
        themename: "Please Select Theme Name",
    });


    const [categoryOption, setCategoryOption] = useState([]);
    // const [childGroupAll, setPosterGenerates] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch } = useContext(
        UserRoleAccessContext
    );
    const { auth } = useContext(AuthContext);


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
    const [searchQuery, setSearchQuery] = useState("");
    const [allStatusEdit, setAllStatusEdit] = useState([]);

    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        employeename: true,
        categoryname: true,
        subcategoryname: true,
        themename: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    //useEffect
    const [categorythemegrouping, setCategorythemegrouping] = useState([])
    //get all branches.
    const fetchCategoryAll = async () => {
        setPageName(!pageName);
        try {
            let res_location = await axios.get(SERVICE.CATEGROYTHEMEGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let all_datas = res_location?.data?.categorythemegroupings
            setCategorythemegrouping(all_datas)



            setCategoryOption([
                ...all_datas?.map((t) => ({
                    ...t,
                    label: t.categoryname,
                    value: t.categoryname,
                })).filter(
                    (data, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.value === data.value
                        )
                ),
            ]);
            setCategoryOptionEdit([
                ...all_datas?.map((t) => ({
                    ...t,
                    label: t.categoryname,
                    value: t.categoryname,
                })).filter(
                    (data, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.value === data.value
                        )
                ),
            ]);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };



    const fetchSubcategoryBased = async (e) => {
        setPageName(!pageName);
        try {
            let data_set = categorythemegrouping.filter((data) => {
                return e.value === data.categoryname;
            });
            let subcategoryname = data_set?.map((item) => {
                return {
                    label: item?.subcategoryname,
                    value: item?.subcategoryname,
                }
            })
            setSubcategoryOption(subcategoryname);
            setSubcategorynameOptEdit(subcategoryname);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    const fetchThemeBased = async (e) => {
        setPageName(!pageName);
        try {
            let data_set = categorythemegrouping.filter((data) => {
                return e.value === data.subcategoryname;
            });
            let themeName = data_set
                ?.map((item) => {
                    return item.themename.map((themename) => {
                        return {
                            label: themename,
                            value: themename,
                        };
                    });
                }).filter(
                    (data, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.value === data.value
                        )
                )
                .flat();
            setThemeNames(themeName)
            setThemeNamesEdit(themeName)
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

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

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    const username = isUserRoleAccess.username;
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



    // Alert delete popup
    let holidayid = deleteHoliday._id;
    const [groupdelete, setGroupDelete] = useState([])
    const delHoliday = async () => {
        setPageName(!pageName);
        try {
            const deletePromises = groupdelete?.map((item) => {
                return axios.delete(`${SERVICE.POSTERGENERATE_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            // await fetchHolidayAll();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            onAction();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };


    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.POSTERGENERATE_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setPosterGenerateEdit(res?.data?.spostergenerate);
            handleClickOpenview();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.POSTERGENERATE_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setPosterGenerateEdit(res?.data?.spostergenerate);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    // updateby edit page...
    let updateby = posterGenerateEdit?.updatedby;

    let addedby = posterGenerateEdit?.addedby;
    let holidayId = posterGenerateEdit?._id;
    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.put(
                `${SERVICE.POSTERGENERATE_SINGLE}/${holidayId}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    categoryname: String(posterGenerateEdit.categoryname),
                    subcategoryname: String(posterGenerateEdit.subcategoryname),
                    themename: String(posterGenerateEdit.themename),
                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            // await fetchHolidayAll();
            onAction();
            handleCloseModEdit();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const editSubmit = (e) => {
        e.preventDefault();
        // fetchHolidayAll();
        const isNameMatch = allStatusEdit?.some(
            (item) =>
                item.categoryname?.toLowerCase() == posterGenerateEdit.categoryname?.toLowerCase() &&
                item.subcategoryname?.toLowerCase() == posterGenerateEdit.subcategoryname?.toLowerCase()
                &&
                item.themename?.some(data => valueCatEdit?.includes(data))
        );
        if (posterGenerateEdit.categoryname === "Please Select Category Template Name") {
            setPopupContentMalert("Please Select Category Template Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            posterGenerateEdit.subcategoryname ===
            "Please Select Sub-category Template Name"
        ) {
            setPopupContentMalert("Please Select Sub-category Template Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedThemeNamesEdit?.length === 0) {
            setPopupContentMalert("Please Select Theme Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exist!!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "PosterGenerateGroupList.png");
                });
            });
        }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "PosterGenerateGroupList",
        pageStyle: "print",
    });
    //serial no for listing items
    const addSerialNumber = () => {
        const itemsWithSerialNumber = childGroupAll?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
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
    const filteredDatas = items?.filter((item) => {
        return searchOverAllTerms.every((term) =>
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
                            updatedSelectedRows = selectedRows.filter(
                                (selectedId) => selectedId !== params.row.id
                            );
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                        }

                        setSelectedRows(updatedSelectedRows);
                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(
                            updatedSelectedRows.length === filteredData.length
                        );
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
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 150,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 150,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 150,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 150,
            hide: !columnVisibility.team,
            headerClassName: "bold-header",
        },
        {
            field: "employeename",
            headerName: "Employee Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.employeename,
            headerClassName: "bold-header",
        },
        {
            field: "categoryname",
            headerName: "Category Template Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.categoryname,
            headerClassName: "bold-header",
        },
        {
            field: "subcategoryname",
            headerName: "Sub-Category Template Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.subcategoryname,
            headerClassName: "bold-header",
        },
        {
            field: "themename",
            headerName: "Theme Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.themename,
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
            renderCell: (params) => (

                <Grid sx={{ display: "flex" }}>
                    <Button
                        sx={userStyle.buttondelete}
                        onClick={(e) => {
                            handleDownloadClick(params.row);
                        }}
                    >

                        <CloudDownloadOutlinedIcon style={{ fontsize: "large" }} />
                    </Button>
                    {isUserRoleCompare?.includes("dpostergenerate") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                setGroupDelete(params.row.objid)
                                handleClickOpen();
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vpostergenerate") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ipostergenerate") && (
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
    ];

    const rowDataTable = filteredData.map((item, index) => {

        return {
            ...item,
            id: item._id,
            serialNumber: item.serialNumber,
            categoryname: item.categoryname,
            subcategoryname: item.subcategoryname,
            themename: item.themename,
            employeename: item.alldatas,
            groupid: item.alldatasid,
            objid: item.objid,
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

    useEffect(() => {
        fetchCategoryAll();
        getwishingmessage();
        getfootermessage();
    }, []);

    useEffect(() => {
        addSerialNumber();
    }, [childGroupAll]);


    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const delAccountcheckbox = async () => {
        setPageName(!pageName);
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.POSTERGENERATE_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);

            handleCloseModcheckbox();
            setSelectAllChecked(false);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            // await fetchHolidayAll();
            onAction();

        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
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



    const [loader, setLoader] = useState(false);





    // MultiSelects Add
    const [companyOption, setCompanyOption] = useState([]);


    // Fetching Companies
    const fetchCompanies = async () => {
        try {
            let result = await axios.get(SERVICE.COMPANY, {
                headers: {
                    Autorization: `Bearer ${auth.APIToken}`,
                },
            });
            //Remove Duplicates From Companies
            let uniqueCompanies = Array.from(new Set(result?.data?.companies.map((t) => t.name)));
            setCompanyOption(
                uniqueCompanies.map((t) => ({
                    label: t,
                    value: t
                }))
            )
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            } else {
                setPopupContentMalert("something went wrong!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            }
        }
    }
    useEffect(() => {
        fetchCompanies();
    }, [])



    // MultiSelect Edit
    const [companyOptionEdit, setCompanyOptionEdit] = useState([]);
    const [companyValueAddEdit, setCompanyValueAddEdit] = useState([]);
    let [valueCompanyAddEdit, setValueCompanyAddEdit] = useState("");
    const customValueRendererCompanyAddEdit = (valueCompanyAdd, _companies) => {
        return valueCompanyAdd.length ? valueCompanyAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Company</span>
    }
    // Company MultiSelect
    const handleCompanyChangeAddEdit = (options) => {
        setValueCompanyAddEdit(
            options.map(a => {
                return a.value;
            })
        )
        setCompanyValueAddEdit(options);
        fetchBranchEdit(options);
        setBranchOptionEdit([]);
        setBranchValueAddEdit([]);
        setUnitOptionEdit([]);
        setUnitValueAddEdit([]);
        setTeamOptionEdit([]);
        setEmployeeOptionEdit([]);
        setTeamValueAddEdit([]);
        setEmployeeValueAddEdit([]);
    }
    // Fetching CompaniesEdit
    const fetchCompaniesEdit = async () => {
        try {
            let result = await axios.get(SERVICE.COMPANY, {
                headers: {
                    Autorization: `Bearer ${auth.APIToken}`,
                },
            });
            //Remove Duplicates From Companies
            let uniqueCompanies = Array.from(new Set(result?.data?.companies.map((t) => t.name)));
            setCompanyOptionEdit(
                uniqueCompanies.map((t) => ({
                    label: t,
                    value: t
                }))
            )
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            } else {
                setPopupContentMalert("something went wrong!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            }
        }
    }
    useEffect(() => {
        fetchCompaniesEdit();
    }, [])
    const [branchOptionEdit, setBranchOptionEdit] = useState([]);
    const [branchValueAddEdit, setBranchValueAddEdit] = useState([]);
    let [valueBranchAddEdit, setValueBranchAddEdit] = useState("");
    const customValueRendererBranchAddEdit = (valueBranchAdd, _branches) => {
        return valueBranchAdd.length ? valueBranchAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Branch</span>
    }
    // Branch Multi-Select
    const handleBranchChangeAddEdit = (options) => {
        setValueBranchAddEdit(
            options.map((a) => {
                return a.value;
            })
        );
        setBranchValueAddEdit(options);
        fetchUnitsEdit(options);
        setUnitOptionEdit([]);
        setUnitValueAddEdit([]);
        setTeamOptionEdit([]);
        setTeamValueAddEdit([]);
        setEmployeeOptionEdit([]);
        setEmployeeValueAddEdit([]);
    };
    //Fetching Branches Edit
    const fetchBranchEdit = async (company) => {
        try {
            let res_branch = await axios.get(SERVICE.BRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let arr = [];
            res_branch?.data?.branch.map((t) => {
                company.forEach((d) => {
                    if (d.value == t.company) {
                        arr.push(t.name);
                    }
                });
            });
            setBranchOptionEdit(
                arr.map((t) => ({
                    label: t,
                    value: t,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            } else {
                setPopupContentMalert("something went wrong!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            }
        }
    };
    const [unitOptionEdit, setUnitOptionEdit] = useState([]);
    const [unitValueAddEdit, setUnitValueAddEdit] = useState([]);
    let [valueUnitAddEdit, setValueUnitAddEdit] = useState("");
    const customValueRendererUnitAddEdit = (valueUnitAdd, _units) => {
        return valueUnitAdd.length ? valueUnitAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Unit</span>
    }
    //Unit MultiSelect Edit
    const handleUnitChangeAddEdit = (options) => {
        setValueUnitAddEdit(
            options.map((a) => {
                return a.value;
            })
        );
        setUnitValueAddEdit(options);
        fetchTeamsEdit(options);
    }
    //Fetching Units Edit
    const fetchUnitsEdit = async (branch) => {
        try {
            let res_branchunit = await axios.get(SERVICE.UNIT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let arr = [];
            res_branchunit?.data?.units.map((t) => {
                branch.forEach((d) => {
                    if (d.value == t.branch) {
                        arr.push(t.name);
                    }
                });
            });
            setUnitOptionEdit(
                arr.map((t) => ({
                    label: t,
                    value: t,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            } else {
                setPopupContentMalert("something went wrong!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            }
        }
    }
    const [teamOptionEdit, setTeamOptionEdit] = useState([]);
    const [teamValueAddEdit, setTeamValueAddEdit] = useState([]);
    let [valueTeamAddEdit, setValueTeamAddEdit] = useState("");
    const customValueRendererTeamAddEdit = (valueTeamAdd, _teams) => {
        return valueTeamAdd.length ? valueTeamAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Team</span>
    }
    //Team MultiSelect Edit
    const handleTeamChangeAddEdit = (options) => {
        setValueTeamAddEdit(
            options.map((a) => {
                return a.value;
            })
        );
        setTeamValueAddEdit(options);
        fetchEmployeeEdit(options)
    }
    //Fetching Teams Edit
    const fetchTeamsEdit = async (unit) => {
        try {
            let res_team = await axios.get(SERVICE.TEAMS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let arr = [];
            res_team?.data?.teamsdetails?.map((t) => {
                unit.forEach((d) => {
                    if (d.value == t.unit) {
                        arr.push(t.teamname);
                    }
                });
            });
            setTeamOptionEdit(
                arr.map((t) => ({
                    label: t,
                    value: t,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            } else {
                setPopupContentMalert("something went wrong!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            }
        }
    }
    // const [empcodeValueAdd, setEmpcodeValueAdd] = useState([]);
    const [employeeOptionEdit, setEmployeeOptionEdit] = useState([]);
    const [employeeValueAddEdit, setEmployeeValueAddEdit] = useState([]);
    let [valueEmployeeAddEdit, setValueEmployeeAddEdit] = useState("");
    const customValueRendererEmployeeAddEdit = (valueEmployeeAdd, _employees) => {
        return valueEmployeeAdd.length ? valueEmployeeAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Employee</span>
    }
    //Employee MultiSelect
    const handleEmployeeChangeAddEdit = (options) => {
        setValueEmployeeAddEdit(
            options.map((a) => {
                return a.value;
            })
        );
        setEmployeeValueAddEdit(options);
    }
    //Fetching Employee Edit
    const fetchEmployeeEdit = async (team) => {
        let teamsnew = team.map((item) => item.value);
        try {
            let res_employee = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let arr = res_employee?.data?.users.filter((t) => {
                return teamsnew.includes(t.team)
            });
            setEmployeeOptionEdit(
                arr.map((t) => ({
                    label: t.companyname,
                    value: t.companyname,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            } else {
                setPopupContentMalert("something went wrong!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            }
        }
    }

    const [wishingMessage, setWishingMessage] = useState([])


    const getwishingmessage = async (e) => {
        try {
            let response = await axios.get(`${SERVICE.POSTERMESSAGESETTINGALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setWishingMessage(response?.data?.postermessage)

        } catch (err) {
            console.log(err)
        }
    };

    const [footerMessage, setfooterMessage] = useState('')

    const getfootermessage = async (e) => {
        try {
            let response = await axios.get(`${SERVICE.FOOTERMESSAGESETTINGALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setfooterMessage(response?.data?.footermessage[0]?.footermessage)

        } catch (err) {
            console.log(err)
        }
    };


    const handleDownloadClick = (row) => {
        const allTemplates = menuItems?.filter(item => item?.title === "All-Template-Cards")?.find(item => item?.submenu)
            ?.submenu?.filter(item => item?.title === row?.themename
            );
        // const template = allTemplates?.[0]?.url;
        console.log(row)
        const template = row?.subcategoryname
        console.log(template) // Single route from templates
        let employee = row?.alldatas?.map(data => data);
        let employeeid = row?.alldatasid?.map(data => data);
        let employeename = row?.posterdownload;
        let employeenamesingle = row?.employeename;
        let employeedbid = row?.employeedbid;

        const getWishes = wishingMessage.filter((item) =>
            item?.categoryname === row?.categoryname &&
            item?.subcategoryname === row?.subcategoryname
        )[0]?.wishingmessage;

        if (
            row?.themename === "3-person template"
        ) {
            if (employeename.length % 3 === 0) {
                for (let i = 0; i < employeename.length; i += 3) {
                    setTimeout(() => {
                        const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];

                        let combinedEmployeeData = '';

                        if (employeename[i]) {
                            combinedEmployeeData += `${employeename[i]?.value}-${employeename[i]?._id}`;
                        }

                        if (employeename[i + 1]) {
                            combinedEmployeeData += `_${employeename[i + 1]?.value}-${employeename[i + 1]?._id}`;
                        }

                        if (employeename[i + 2]) {
                            combinedEmployeeData += `_${employeename[i + 2]?.value}-${employeename[i + 2]?._id}`;
                        }

                        const url = `${template === "Birthday Event" ? "/birthdaycardtwo3nos" : "/weddingcard3nos"  }/?combinedData=${combinedEmployeeData}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}&status=${true}`;

                        window.open(url, '_blank');
                    }, i * 500);
                }
            } else {
                setPopupContentMalert("Please Select Birthday 3NOS!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }


        }
        else if (
            row?.themename === "2-person template"
        ) {
            if (employeename.length % 2 === 0) {
                for (let i = 0; i < employeename.length; i += 2) {
                    setTimeout(() => {
                        let combinedEmployeeData = '';

                        const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];

                        if (employeename[i]) {
                            combinedEmployeeData += `${employeename[i]?.value}-${employeename[i]?._id}`;
                        }

                        if (employeename[i + 1]) {
                            combinedEmployeeData += `_${employeename[i + 1]?.value}-${employeename[i + 1]?._id}`;
                        }

                        const url = `${template === "Birthday Event" ? "/birthdaycardtwo2nos" : "/weddingcard2nos" }/?combinedData=${combinedEmployeeData}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}&status=${true}`;

                        window.open(url, '_blank');
                    }, i * 500);
                }
            } else {
                setPopupContentMalert("Please Select Birthday 2NOS!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }

        }
        else if (
            row?.themename === "1-person template"
        ) {

            console.log(template, "1per")


            const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];

            // const template = allTemplates?.[0]?.url;
            const url = `${template === "Birthday Event" ? "/birthdaycardtwo" : "/weddingcard"}/?name=${employeenamesingle}&id=${employeedbid}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}&status=${true}`;

            // const url = `${template}/?name=${employeename}&id=${employeedbid}&status=${true}`;
            window.open(url, '_blank');

        }
        else {

            const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];

            // const template = allTemplates?.[0]?.url;
            const url = `${template === "Birthday Event" ? "/birthdaycardtwo" : "/weddingcard"}/?name=${employeenamesingle}&id=${employeedbid}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}&status=${true}`;

            // const url = `${template}/?name=${employeenamesingle}&id=${employeedbid}&status=${true}`;
            window.open(url, '_blank');
        }

        // if (
        //     template ===
        //     "/birthdaycardtwo3nos" ||
        //     template ===
        //     "/weddingcard3nos"
        // ) {
        //     if (employeename.length % 3 === 0) {
        //         for (let i = 0; i < employeename.length; i += 3) {
        //             setTimeout(() => {
        //                 const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];

        //                 let combinedEmployeeData = '';

        //                 if (employeename[i]) {
        //                     combinedEmployeeData += `${employeename[i]?.value}-${employeename[i]?._id}`;
        //                 }

        //                 if (employeename[i + 1]) {
        //                     combinedEmployeeData += `_${employeename[i + 1]?.value}-${employeename[i + 1]?._id}`;
        //                 }

        //                 if (employeename[i + 2]) {
        //                     combinedEmployeeData += `_${employeename[i + 2]?.value}-${employeename[i + 2]?._id}`;
        //                 }

        //                 const url = `${template}/?combinedData=${combinedEmployeeData}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}&status=${true}`;

        //                 window.open(url, '_blank');
        //             }, i * 500);
        //         }
        //     } else {
        //         setPopupContentMalert("Please Select Birthday 3NOS!");
        //         setPopupSeverityMalert("info");
        //         handleClickOpenPopupMalert();
        //     }


        // }
        // else if (
        //     template ===
        //     "/birthdaycardtwo2nos" ||
        //     template ===
        //     "/weddingcard2nos"
        // ) {
        //     if (employeename.length % 2 === 0) {
        //         for (let i = 0; i < employeename.length; i += 2) {
        //             setTimeout(() => {
        //                 let combinedEmployeeData = '';

        //                 const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];

        //                 if (employeename[i]) {
        //                     combinedEmployeeData += `${employeename[i]?.value}-${employeename[i]?._id}`;
        //                 }

        //                 if (employeename[i + 1]) {
        //                     combinedEmployeeData += `_${employeename[i + 1]?.value}-${employeename[i + 1]?._id}`;
        //                 }

        //                 const url = `${template}/?combinedData=${combinedEmployeeData}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}&status=${true}`;

        //                 window.open(url, '_blank');
        //             }, i * 500);
        //         }
        //     } else {
        //         setPopupContentMalert("Please Select Birthday 2NOS!");
        //         setPopupSeverityMalert("info");
        //         handleClickOpenPopupMalert();
        //     }

        // }
        // else if (
        //     template ===
        //     "/weddingcard" ||
        //     template ===
        //     "/birthdaycardtwo"
        // ) {
        //     console.log(employeename)

        //     // employeename.forEach((employee, index) => {
        //     //     // Adding a slight delay between each tab opening
        //     //     setTimeout(() => {
        //     //         // Select a random wish from the getWishes array
        //     //         const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];

        //     //         // Construct the URL with the employee details and the random wish
        //     //         const url = `${template}/?name=${employee?.value}&id=${employee?._id}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}&status=${true}`;

        //     //         // Open a new tab with the constructed URL
        //     //         window.open(url, '_blank');
        //     //     }, index * 500); // Delay of 500ms per tab
        //     // });
        //     const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];

        //     const template = allTemplates?.[0]?.url;
        //     const url = `${template}/?name=${employeenamesingle}&id=${employeedbid}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}&status=${true}`;

        //     // const url = `${template}/?name=${employeename}&id=${employeedbid}&status=${true}`;
        //     window.open(url, '_blank');

        // }
        // else {
        //     employeename.forEach((employee, index) => {
        //         // Adding a slight delay between each tab opening
        //         setTimeout(() => {
        //             const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];

        //             const url = `${template}/?name=${employee?.value}&id=${employee?._id}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}&status=${true}`;
        //             window.open(url, '_blank'); // Open a new tab with the constructed URL
        //         }, index * 500); // Delay of 500ms per tab
        //     });
        //     // const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];

        //     // const template = allTemplates?.[0]?.url;
        //     // const url = `${template}/?name=${employeenamesingle}&id=${employeedbid}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}&status=${true}`;

        //     // // const url = `${template}/?name=${employeenamesingle}&id=${employeedbid}&status=${true}`;
        //     // window.open(url, '_blank');
        // }




        // employee.forEach((emp, index) => {
        //     setTimeout(() => {
        //         // Access the corresponding id from the employeeid array using the same index
        //         const id = employeeid[index];

        //         // Construct the URL with the name and id
        //         const url = `${template}/?name=${emp}&id=${id}&status=${true}`;

        //         // Open a new tab with the constructed URL
        //         window.open(url, '_blank');
        //     }, index * 500); // Delay of 500ms per tab
        // });

    };



    const [fileFormat, setFormat] = useState("");

    return (
        <Box>
            {/* <Headtitle title={"Poster Generate Group List"} /> */}
            {/* <PageHeading
                title="Poster Generate Group List"
                modulename="Poster"
                submodulename=""
                mainpagename=""
                subpagename=""
                subsubpagename=""
            /> */}



            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lpostergenerate") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                List Poster Generate Group
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
                                    {isUserRoleCompare?.includes("excelpostergenerate") && (
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
                                    {isUserRoleCompare?.includes("csvpostergenerate") && (
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
                                    {isUserRoleCompare?.includes("printpostergenerate") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfpostergenerate") && (
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

                                    {isUserRoleCompare?.includes("imagepostergenerate") && (
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
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <FormControl fullWidth size="small">
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

                        {statusCheckchild ? (
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
                                <Box style={{ width: "100%", overflowY: "hidden" }}>
                                    <StyledDataGrid
                                        onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
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
                        )}
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
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
            >
                <Box sx={{ padding: "30px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Poster Generate
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{posterGenerateEdit.company?.toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{posterGenerateEdit.branch?.toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{posterGenerateEdit.unit?.toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Team</Typography>
                                    <Typography sx={{wordWrap: "break-word", overflow: 'break-word'}}>{posterGenerateEdit.team?.toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Employee Name</Typography>
                                    <Typography sx={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{posterGenerateEdit.employeename?.toString()}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Category Template Name</Typography>
                                    <Typography>{posterGenerateEdit.categoryname}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub-category Template Name</Typography>
                                    <Typography>
                                        {posterGenerateEdit.subcategoryname}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Theme Name</Typography>
                                    <Typography>{posterGenerateEdit.themename}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCloseview}
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
                    sx={{
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                    }}
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    fullWidth={true}
                >
                    <Box sx={{ padding: "30px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                {/* <Grid > */}
                                <Typography sx={userStyle.HeaderText}>
                                    Edit Poster Generate{" "}
                                </Typography>
                                {/* </Grid> */}
                                <Grid item lg={3} md={3} sm={3} xs={3}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontWeight: "500" }}>
                                            Company <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect size="small"
                                            options={companyOptionEdit}
                                            value={companyValueAddEdit}
                                            valueRenderer={customValueRendererCompanyAddEdit}
                                            onChange={handleCompanyChangeAddEdit}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} sm={3} xs={3}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontWeight: "500" }}>
                                            Branch <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect size="small"
                                            options={branchOptionEdit}
                                            value={branchValueAddEdit}
                                            valueRenderer={customValueRendererBranchAddEdit}
                                            onChange={handleBranchChangeAddEdit}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} sm={3} xs={3}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontWeight: "500" }}>
                                            Unit <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect size="small"
                                            options={unitOptionEdit}
                                            value={unitValueAddEdit}
                                            valueRenderer={customValueRendererUnitAddEdit}
                                            onChange={handleUnitChangeAddEdit}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} sm={3} xs={3}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontWeight: "500" }}>
                                            Team <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect size="small"
                                            options={teamOptionEdit}
                                            value={teamValueAddEdit}
                                            valueRenderer={customValueRendererTeamAddEdit}
                                            onChange={handleTeamChangeAddEdit}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} sm={3} xs={3}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontWeight: "500" }}>
                                            Employee Name <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect size="small"
                                            options={employeeOptionEdit}
                                            value={employeeValueAddEdit}
                                            valueRenderer={customValueRendererEmployeeAddEdit}
                                            onChange={handleEmployeeChangeAddEdit}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />

                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography >
                                        Poster Theme
                                    </Typography>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Category Template Name<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={categoryOptionEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: posterGenerateEdit.categoryname,
                                                value: posterGenerateEdit.categoryname,
                                            }}
                                            onChange={(e) => {
                                                setPosterGenerateEdit({
                                                    ...posterGenerateEdit,
                                                    categoryname: e.value,

                                                    subcategoryname: "Please Select Sub-category Template Name",
                                                });
                                                fetchSubcategoryBased(e);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Sub-category Template Name<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={subcategorynameOptEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: posterGenerateEdit.subcategoryname,
                                                value: posterGenerateEdit.subcategoryname,
                                            }}
                                            onChange={(e) => {
                                                setPosterGenerateEdit({
                                                    ...posterGenerateEdit,
                                                    subcategoryname: e.value,
                                                });
                                                fetchThemeBased(e)
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Theme Name<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={themeNamesEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: posterGenerateEdit.themename,
                                                value: posterGenerateEdit.themename,
                                            }}
                                            onChange={(e) => {
                                                setPosterGenerate({
                                                    ...posterGenerateEdit,
                                                    themename: e.value,
                                                });
                                            }}
                                        />

                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained" onClick={editSubmit}>
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
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
                filteredDataTwo={filteredData ?? []}
                itemsTwo={childGroupAll ?? []}
                filename={"Poster Generate"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Poster Generate Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delHoliday}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delAccountcheckbox}
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
            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}
export default PosterGenerateGroupList;
