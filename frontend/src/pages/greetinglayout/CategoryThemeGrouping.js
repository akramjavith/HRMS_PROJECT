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
import LoadingButton from "@mui/lab/LoadingButton";
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
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import AlertDialog from "../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { menuItems } from "../../components/menuItemsList";

function CategoryThemeGrouping() {
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
        "Category Template Name",
        "Sub Category Template Name",
        "Theme Name",
    ];
    let exportRowValues = [
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


    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const handleClickOpenCheck = () => {
        setisCheckOpen(true);
    };
    const handleCloseCheck = () => {
        setisCheckOpen(false);
    };

    //state to handle holiday values
    const [categoryThemeGroup, setCategoryThemeGroup] = useState({
        categoryname: "Please Select Category Template Name",
        subcategoryname: "Please Select Sub-category Template Name",
        themename: "Please Select Theme Name",
    });
    const [themeNames, setThemeNames] = useState([]);
    const [selectedThemeNames, setSelectedThemeNames] = useState([]);
    let [valueCat, setValueCat] = useState([]);
    const handleThemeNameChange = (options) => {
        setValueCat(options?.map(a => {
            return a.value
        }));
        setSelectedThemeNames(options);
    };
    const customValueRendererCat = (valueCat, _categoryname) => {
        return valueCat?.length
            ? valueCat?.map(({ label }) => label)?.join(", ")
            : "Please Select Theme Name";
    };
    const [themeNamesEdit, setThemeNamesEdit] = useState([]);
    const [selectedThemeNamesEdit, setSelectedThemeNamesEdit] = useState([]);
    let [valueCatEdit, setValueCatEdit] = useState([]);
    const handleThemeNameChangeEdit = (options) => {
        setValueCatEdit(options?.map(a => {
            return a.value;
        }));

        setSelectedThemeNamesEdit(options);
    };
    const customValueRendererCatEdit = (valueCat, _categoryname) => {
        return valueCat?.length
            ? valueCat?.map(({ label }) => label)?.join(", ")
            : "Please Select Theme Name";
    };



    const [categoryThemeGroupingEdit, setCategoryThemeGroupingEdit] = useState({
        categoryname: "Please Select Category Template Name",
        subcategoryname: "Please Select Sub-category Template Name",
        themename: "Please Select Theme Name",
    });


    const [categoryOption, setCategoryOption] = useState([]);
    const [categoryTheme, setCategoryTheme] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName } = useContext(
        UserRoleAccessContext
    );
    const { auth } = useContext(AuthContext);
    const [statusCheck, setStatusCheck] = useState(true);

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
        categoryname: true,
        subcategoryname: true,
        themename: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    //get all branches.
    const fetchCategoryAll = async () => {
        setPageName(!pageName);
        try {
            let res_location = await axios.get(SERVICE.CATEGORYMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setCategoryOption([
                ...res_location?.data?.categorymasters?.map((t) => ({
                    ...t,
                    label: t?.categoryname,
                    value: t?.categoryname,
                })),
            ]);
            setCategoryOptionEdit([
                ...res_location?.data?.categorymasters?.map((t) => ({
                    ...t,
                    label: t?.categoryname,
                    value: t?.categoryname,
                })),
            ]);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };



    const fetchSubcategoryBased = async (e) => {
        setPageName(!pageName);
        try {
            let res_category = await axios.get(SERVICE.SUBCATEGORYMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let data_set = res_category.data.subcategorymaster?.filter((data) => {
                return e.value === data.categoryname;
            });
            let subcatOpt = data_set
                ?.map((item) => {
                    return item.subcategoryname?.map((subcategory) => {
                        return {
                            label: subcategory,
                            value: subcategory,
                        };
                    });
                })
                .flat();
            setSubcategoryOption(subcatOpt);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const fetchSubcategoryBasedEdit = async (e) => {
        setPageName(!pageName);
        try {
            let res_category = await axios.get(SERVICE.SUBCATEGORYMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let data_set = res_category.data.subcategorymaster?.filter((data) => {
                return e === data.categoryname;
            });
            let subcatOpt = data_set
                ?.map((item) => {
                    return item.subcategoryname?.map((subcategory) => {
                        return {
                            label: subcategory,
                            value: subcategory,
                        };
                    });
                })
                .flat();
            setSubcategorynameOptEdit(subcatOpt);
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
        if (selectedRows?.length === 0) {
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

    const [checkUser, setCheckUser] = useState();


    //set function to get particular row
    const rowData = async (id, categoryname, subcategoryname) => {
        setPageName(!pageName);
        try {

            const [res, resuser] = await Promise.all([
                axios.get(`${SERVICE.CATEGROYTHEMEGROUPING_SINGLE}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.post(SERVICE.OVERALL_CATEGORYTHEMEGROUPING, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    catname: String(categoryname),
                    subcat: subcategoryname,
                })
            ])
            setDeleteHoliday(res.data.scategorythemegrouping);
            setCheckUser(resuser?.data?.count);
            if (resuser?.data?.count > 0) {
                handleClickOpenCheck();
            } else {
                handleClickOpen();
            }
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    // Alert delete popup
    let holidayid = deleteHoliday._id;
    const delHoliday = async () => {
        setPageName(!pageName);
        try {
            await axios.delete(`${SERVICE.CATEGROYTHEMEGROUPING_SINGLE}/${holidayid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchCategoryTheme(); fetchHolidayAll();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    //add function
    const sendRequest = async () => {
        setPageName(!pageName);
        try {
            let statusCreate = await axios.post(SERVICE.CATEGROYTHEMEGROUPING_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                categoryname: String(categoryThemeGroup.categoryname),
                subcategoryname: String(categoryThemeGroup.subcategoryname),
                themename: valueCat,
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchCategoryTheme();
            await fetchHolidayAll();
            setCategoryThemeGroup({
                categoryname: "Please Select Category Template Name",
                subcategoryname: "Please Select Sub-category Template Name",
            });
            setSelectedThemeNames([]);
            setValueCat([]);
            setSubcategoryOption([])
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            setloadingdeloverall(false);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    //submit option for saving
    const handleSubmit = (e) => {
        setloadingdeloverall(true);
        e.preventDefault();
        const isNameMatch = categoryTheme?.some(
            (item) =>
                item.categoryname?.toLowerCase() === categoryThemeGroup.categoryname?.toLowerCase() &&
                item.subcategoryname?.toLowerCase() === categoryThemeGroup.subcategoryname?.toLowerCase()
            // && item.themename?.some(data => valueCat?.includes(data))
        );
        if (categoryThemeGroup.categoryname === "Please Select Category Template Name") {
            setPopupContentMalert("Please Select Category Template Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            categoryThemeGroup.subcategoryname ===
            "Please Select Sub-category Template Name"
        ) {
            setPopupContentMalert("Please Select Sub-category Template Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            selectedThemeNames?.length === 0
        ) {
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
            sendRequest();
        }
    };
    const handleclear = (e) => {
        e.preventDefault();
        setCategoryThemeGroup({
            categoryname: "Please Select Category Template Name",
            subcategoryname: "Please Select Sub-category Template Name",
        });
        setSubcategoryOption([]);
        setSelectedThemeNames([]);
        setValueCat([]);
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
        setPageName(!pageName);
        setUserID(e);
        try {
            let res = await axios.get(`${SERVICE.CATEGROYTHEMEGROUPING_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setCategoryThemeGroupingEdit(res?.data?.scategorythemegrouping);
            setSelectedThemeNamesEdit(res?.data?.scategorythemegrouping?.themename?.map(data => {
                return {
                    label: data,
                    value: data,
                }
            }))
            fetchSubcategoryBasedEdit(res?.data?.scategorythemegrouping?.categoryname);
            setValueCatEdit(res?.data?.scategorythemegrouping?.themename)
            fetchCategoryAll();
            fetchHolidayAll();
            handleClickOpenEdit();

        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.CATEGROYTHEMEGROUPING_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setCategoryThemeGroupingEdit(res?.data?.scategorythemegrouping);
            handleClickOpenview();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.CATEGROYTHEMEGROUPING_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setCategoryThemeGroupingEdit(res?.data?.scategorythemegrouping);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    // updateby edit page...
    let updateby = categoryThemeGroupingEdit?.updatedby;

    let addedby = categoryThemeGroupingEdit?.addedby;
    let holidayId = categoryThemeGroupingEdit?._id;
    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.put(
                `${SERVICE.CATEGROYTHEMEGROUPING_SINGLE}/${holidayId}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    categoryname: String(categoryThemeGroupingEdit.categoryname),
                    subcategoryname: String(categoryThemeGroupingEdit.subcategoryname),
                    themename: valueCatEdit,
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
            await fetchCategoryTheme();
            await fetchHolidayAll();
            handleCloseModEdit();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const editSubmit = (e) => {
        e.preventDefault();
        fetchHolidayAll();
        const isNameMatch = allStatusEdit?.some(
            (item) =>
                item.categoryname?.toLowerCase() == categoryThemeGroupingEdit.categoryname?.toLowerCase() &&
                item.subcategoryname?.toLowerCase() == categoryThemeGroupingEdit.subcategoryname?.toLowerCase()
            // &&
            // item.themename?.some(data => valueCatEdit?.includes(data))
        );
        if (categoryThemeGroupingEdit.categoryname === "Please Select Category Template Name") {
            setPopupContentMalert("Please Select Category Template Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            categoryThemeGroupingEdit.subcategoryname ===
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
    //get all data.
    const fetchCategoryTheme = async () => {
        setPageName(!pageName);
        setStatusCheck(true)
        try {
            const allTemplates = menuItems?.filter(item => item?.title === "All-Template-Cards")?.find(item => item?.submenu)?.submenu?.map(item => {
                return {
                    label: item.title,
                    value: item.title,
                }
            });
            setThemeNames(allTemplates)
            setThemeNamesEdit(allTemplates)
            setStatusCheck(false)
        } catch (err) {
            setStatusCheck(false)
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    //get all data.
    const fetchHolidayAll = async () => {
        setPageName(!pageName);
        try {
            let res_status = await axios.get(SERVICE.CATEGROYTHEMEGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setCategoryTheme(res_status?.data?.categorythemegroupings?.map((item) => ({
                ...item,
                themename: item?.themename?.map((item, index) => `${index + 1}. ${item}, `)
            })));
            setAllStatusEdit(
                res_status?.data?.categorythemegroupings?.filter((item) => item?._id !== userId)
            );
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "CategoryThemeGrouping.png");
                });
            });
        }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "CategoryThemeGrouping",
        pageStyle: "print",
    });
    //serial no for listing items
    const addSerialNumber = () => {
        const itemsWithSerialNumber = categoryTheme?.map((item, index) => ({
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
    const searchOverAllTerms = searchQuery?.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchOverAllTerms.every((term) =>
            Object.values(item).join(" ")?.toLowerCase().includes(term)
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
                        if (rowDataTable?.length === 0) {
                            return;
                        }
                        if (selectAllChecked) {
                            setSelectedRows([]);
                        } else {
                            const allRowIds = rowDataTable?.map((row) => row.id);
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
                            updatedSelectedRows = selectedRows?.filter(
                                (selectedId) => selectedId !== params.row.id
                            );
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                        }

                        setSelectedRows(updatedSelectedRows);
                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(
                            updatedSelectedRows?.length === filteredData?.length
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
            width: 170,
            hide: !columnVisibility.subcategoryname,
            headerClassName: "bold-header",
        },
        {
            field: "themename",
            headerName: "Theme Name",
            flex: 0,
            width: 200,
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
                    {isUserRoleCompare?.includes("ecategorythemegrouping") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.row.id);
                                fetchCategoryTheme();
                            }}
                        >
                            <EditOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dcategorythemegrouping") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id, params.row.categoryname, params.row.subcategoryname);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vcategorythemegrouping") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("icategorythemegrouping") && (
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

    const rowDataTable = filteredData?.map((item, index) => {

        return {
            id: item._id,
            serialNumber: item.serialNumber,
            categoryname: item.categoryname,
            subcategoryname: item.subcategoryname,
            themename: item.themename,
        };
    });

    const rowsWithCheckboxes = rowDataTable?.map((row) => ({
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
    const filteredColumns = columnDataTable?.filter((column) =>
        column.headerName?.toLowerCase().includes(searchQueryManage?.toLowerCase())
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
                    {filteredColumns?.map((column) => (
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
        fetchCategoryTheme();
    }, []);

    useEffect(() => {
        addSerialNumber();
    }, [categoryTheme]);

    useEffect(() => {
        fetchHolidayAll();
    }, [isEditOpen]);
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
                return axios.delete(`${SERVICE.CATEGROYTHEMEGROUPING_SINGLE}/${item}`, {
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
            await fetchHolidayAll(); fetchCategoryTheme();
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

    const [fileFormat, setFormat] = useState("");

    return (
        <Box>
            <Headtitle title={"Category Theme Grouping"} />
            <PageHeading
                title="Category Theme Grouping"
                modulename="Poster"
                submodulename="Master"
                mainpagename="Category Theme Grouping"
                subpagename=""
                subsubpagename=""
            />
            {/* ****** Header Content ****** */}
            {/* <Typography sx={userStyle.HeaderText}>Category Theme Grouping</Typography> */}

            <>
                {isUserRoleCompare?.includes("acategorythemegrouping") && (
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Add Category Theme Grouping
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Category Template Name<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={categoryOption}
                                            styles={colourStyles}
                                            value={{
                                                label: categoryThemeGroup.categoryname,
                                                value: categoryThemeGroup.categoryname,
                                            }}
                                            onChange={(e) => {
                                                setCategoryThemeGroup({
                                                    ...categoryThemeGroup,
                                                    categoryname: e.value,
                                                    subcategoryname:
                                                        "Please Select Sub-category Template Name",
                                                });
                                                fetchSubcategoryBased(e);
                                                setSelectedThemeNames([])
                                                // setThemeNames([])
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Sub-category Template Name<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={subcategoryOpt}
                                            styles={colourStyles}
                                            value={{
                                                label: categoryThemeGroup.subcategoryname,
                                                value: categoryThemeGroup.subcategoryname,
                                            }}
                                            onChange={(e) => {
                                                setCategoryThemeGroup({
                                                    ...categoryThemeGroup,
                                                    subcategoryname: e.value,
                                                });
                                                setSelectedThemeNames([])
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Theme Name<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <MultiSelect
                                            options={themeNames}
                                            value={selectedThemeNames}
                                            onChange={handleThemeNameChange}
                                            valueRenderer={customValueRendererCat}
                                            labelledBy="Please Select Theme Name"
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <br />
                            <br />
                            <Grid item md={12} sm={12} xs={12}>
                                <br />
                                <br />
                                <Grid
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: "15px",
                                    }}
                                >
                                    <LoadingButton
                                        onClick={handleSubmit}
                                        loading={loadingdeloverall}
                                        color="primary"
                                        loadingPosition="end"
                                        variant="contained"
                                    >
                                        Submit
                                    </LoadingButton>
                                    <Button sx={userStyle.btncancel} onClick={handleclear}>
                                        CLEAR
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                )}
            </>

            <br /><br />


            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lcategorythemegrouping") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                List Category Theme Grouping
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
                                    {isUserRoleCompare?.includes("excelcategorythemegrouping") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    fetchCategoryTheme();
                                                    setFormat("xl");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileExcel />
                                                &ensp;Export to Excel&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvcategorythemegrouping") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    fetchCategoryTheme();
                                                    setFormat("csv");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileCsv />
                                                &ensp;Export to CSV&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printcategorythemegrouping") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfcategorythemegrouping") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true);
                                                    fetchCategoryTheme();
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}

                                    {isUserRoleCompare?.includes("imagecategorythemegrouping") && (
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

                        {statusCheck ? (
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
                                        columns={columnDataTable?.filter(
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
                                        {filteredData?.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
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
                            View Category Theme Grouping
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Category Template Name</Typography>
                                    <Typography>{categoryThemeGroupingEdit.categoryname}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub-category Template Name</Typography>
                                    <Typography>
                                        {categoryThemeGroupingEdit.subcategoryname}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Theme Name</Typography>
                                    <Typography>
                                        {Array.isArray(categoryThemeGroupingEdit?.themename)
                                            ? categoryThemeGroupingEdit.themename.map((name, index) => `${index + 1}. ${name}, `)
                                            : "No themes available"}
                                    </Typography>
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
                                <Typography sx={userStyle.HeaderText}>
                                    Edit Category Theme Grouping
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Category Template Name<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={categoryOptionEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: categoryThemeGroupingEdit.categoryname,
                                                value: categoryThemeGroupingEdit.categoryname,
                                            }}
                                            onChange={(e) => {
                                                setCategoryThemeGroupingEdit({
                                                    ...categoryThemeGroupingEdit,
                                                    categoryname: e.value,

                                                    subcategoryname: "Please Select Sub-category Template Name",
                                                });
                                                fetchSubcategoryBasedEdit(e.value);
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
                                                label: categoryThemeGroupingEdit.subcategoryname,
                                                value: categoryThemeGroupingEdit.subcategoryname,
                                            }}
                                            onChange={(e) => {
                                                setCategoryThemeGroupingEdit({
                                                    ...categoryThemeGroupingEdit,
                                                    subcategoryname: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Theme Name<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <MultiSelect
                                            options={themeNamesEdit}
                                            value={selectedThemeNamesEdit}
                                            onChange={handleThemeNameChangeEdit}
                                            valueRenderer={customValueRendererCatEdit}
                                            labelledBy="Please Select Theme Name"
                                            styles={{
                                                menu: (provided) => ({
                                                    ...provided,
                                                    maxHeight: 150, // Adjust the max height to show 4 items
                                                    overflowY: 'auto', // Enables scrolling if there are more than 4 items
                                                }),
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
                itemsTwo={categoryTheme ?? []}
                filename={"Category Theme Grouping"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Category Theme Grouping Info"
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
                                            <span style={{ fontWeight: "700", color: "#777" }}>{`Category Theme Grouping`} </span>was linked
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
export default CategoryThemeGrouping;