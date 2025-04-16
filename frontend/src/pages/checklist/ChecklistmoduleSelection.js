import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ImageIcon from '@mui/icons-material/Image';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl, Grid,
    IconButton,
    List, ListItem, ListItemText,
    MenuItem,
    OutlinedInput,
    Paper,
    Popover,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import axios from "axios";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import html2canvas from 'html2canvas';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from 'react-loader-spinner';
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { menuItems } from "../../components/menuItemsList";
import PageHeading from "../../components/PageHeading";
import Pagination from '../../components/Pagination';
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from '../../services/Baseservice';

const Loader = ({ loading, message }) => {
    return (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <div style={{ textAlign: 'center' }}>
                <CircularProgress sx={{ color: '#edf1f7' }} />
                <Typography variant="h6" sx={{ mt: 2, color: '#edf1f7' }}>
                    {message}
                </Typography>
            </div>
        </Backdrop>
    );
};

function CheckListModuleSelection() {

    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Please Wait...!');
    const [checklisttype, setChecklisttype] = useState({ checklist: "", type: "Please Select Type" });
    const [checklisttypeEdit, setChecklisttypeEdit] = useState({ checklist: "", type: "Please Select Type" })
    const [checklisttypes, setChecklisttypes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allChecklisttypeedit, setAllChecklisttypeedit] = useState([]);
    const [btnSubmit, setBtnSubmit] = useState(false);
    const [count, setCount] = useState();

    const [addRequired, setAddRequired] = useState({
        category: "Please Select Category",
        subcategory: "Please Select  SubCategory",
        details: "",
        options: "Please Select Check List",
        count: "",
        information: "HR",
        raiser: true,
        resolver: true,
    });

    const [addRequiredEdit, setAddRequiredEdit] = useState({
        category: "Please Select Category",
        subcategory: "Please Select Sub Category",
        details: "",
        options: "Please Select Check List",
        count: "",
        raiser: true,
        resolver: true,
    });

    const [categorys, setCategorys] = useState([]);

    const [subCategoryTodo, setSubcategoryTodo] = useState([]);


    const deleteTodo = (index) => {
        const updatedTodos = [...subCategoryTodo];
        updatedTodos.splice(index, 1);
        setSubcategoryTodo(updatedTodos);
    };


    const handleTodoEdit = (index, newValue) => {
        let respectData = subCategoryTodo[index];
        let finalData = { ...respectData, details: newValue };

        const updatedTodos = [...subCategoryTodo];
        updatedTodos[index] = finalData;
        setSubcategoryTodo(updatedTodos);
    };

    const handleInformationEdit = (index, newValue) => {
        let respectData = subCategoryTodo[index];
        let finalData = { ...respectData, information: newValue };

        const updatedTodos = [...subCategoryTodo];
        updatedTodos[index] = finalData;
        setSubcategoryTodo(updatedTodos);
    };

    const handleEstimationEdit = (index, newValue) => {
        let respectData = subCategoryTodo[index];
        let finalData = { ...respectData, estimation: newValue };

        const updatedTodos = [...subCategoryTodo];
        updatedTodos[index] = finalData;
        setSubcategoryTodo(updatedTodos);
    };

    const handleEstimationTimeEdit = (index, newValue) => {
        let respectData = subCategoryTodo[index];
        let finalData = { ...respectData, estimationtime: newValue };

        const updatedTodos = [...subCategoryTodo];
        updatedTodos[index] = finalData;
        setSubcategoryTodo(updatedTodos);
    };


    const addTodo = () => {
        let subs = selectedOptionsSubCat.map((item) => item.value);

        let mappedItems;

        if (addRequired.options == "Date Multi Random Time" || addRequired.options == "Date Multi Random") {

            let originalArray = {
                checklist: addRequired.options,
                information: "HR",
                estimation: "Immediate",
                estimationtime: "5"
            }

            function multiplyObjects(array, count) {
                return Array(count).fill(array);
            }
            const newArray = multiplyObjects(originalArray, Number(count));
            mappedItems = newArray;
        } else {
            mappedItems = {
                checklist: addRequired.options,
                information: "HR",
                estimation: "Immediate",
                estimationtime: "5"
            }
        }

        if (singleSelectValues.module === "" || singleSelectValues.module == "Please Select Module") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Module Name!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (singleSelectValues.submodule === "" || singleSelectValues.submodule == "Please Select Sub Module") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Sub Module Name!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else if (addRequired.category === "" || addRequired.category == "Please Select Category") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Category!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (subs.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Sub Category!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (addRequired.options == "Please Select Check List" || addRequired.options == "" || addRequired.options == undefined) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Check List!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if ((addRequired.options == "Date Multi Random Time" || addRequired.options == "Date Multi Random") && (count == "" || count == undefined)) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter the count!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            if (addRequired.options == "Date Multi Random Time" || addRequired.options == "Date Multi Random") {
                setSubcategoryTodo([...subCategoryTodo, ...mappedItems]);
            } else {
                setSubcategoryTodo([...subCategoryTodo, mappedItems]);
            }

            setAddRequired({
                ...addRequired
            })
            setCount("");
        }
    };

    const fetchCategory = async () => {
        setPageName(!pageName)
        try {
            let res_category = await axios.get(SERVICE.CHECKLISTCATEGORY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let category = res_category?.data?.checklistcategory;
            const categoryall = [
                ...category.map((d) => ({
                    ...d,
                    label: d.categoryname,
                    value: d.categoryname,
                })),
            ];

            setCategorys(categoryall);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchSubcategory = async (e) => {
        setPageName(!pageName)
        try {
            let res_category = await axios.get(SERVICE.CHECKLISTCATEGORY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let category = res_category?.data?.checklistcategory.filter((data) => {
                return data.categoryname == e.value;
            }).map((item) => item.subcategoryname).flat().map((itemNew) => ({
                label: itemNew,
                value: itemNew
            }));
            setFilteredSubCategoryOptions(category);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchSubcategoryEdit = async (e) => {
        setPageName(!pageName)
        try {
            let res_category = await axios.get(SERVICE.CHECKLISTCATEGORY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let category = res_category?.data?.checklistcategory.filter((data) => {
                return data.categoryname == e.value;
            }).map((item) => item.subcategoryname).flat().map((itemNew) => ({
                label: itemNew,
                value: itemNew
            }));
            setSubCategoryEditOptions(category);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    const handleSubCategoryChange = (options) => {
        setSelectedOptionsSubCat(options);
    };

    const customValueRendererSubCat = (valueSubCat, _categoryname) => {
        return valueSubCat?.length
            ? valueSubCat.map(({ label }) => label)?.join(", ")
            : "Please Select Sub Category";
    };

    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [checklisttypeCheck, setChecklisttypecheck] = useState(false);
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [rolesNewList, setRolesNewList] = useState([]);
    const [subModuleOptions, setSubModuleOptions] = useState([]);
    const [mainPageoptions, setMainPageoptions] = useState([]);
    const [subPageoptions, setSubPageoptions] = useState([]);
    const [subSubPageoptions, setsubSubPageoptions] = useState([]);
    const [singleSelectValues, setSingleSelectValues] = useState({
        module: "Please Select Module",
        submodule: "Please Select Sub Module",
        mainpage: "Please Select Main Page",
        subpage: "Please Select Sub Page",
        subsubpage: "Please Select Sub Sub Page",
        category: "Please Select Category",
        subcategory: "Please Select Sub Category",
    });

    const [subModuleOptionsEdit, setSubModuleOptionsEdit] = useState([]);
    const [mainPageoptionsEdit, setMainPageoptionsEdit] = useState([]);
    const [subPageoptionsEdit, setSubPageoptionsEdit] = useState([]);
    const [subSubPageoptionsEdit, setsubSubPageoptionsEdit] = useState([]);
    const [singleSelectValuesEdit, setSingleSelectValuesEdit] = useState({
        module: "Please Select Module",
        submodule: "Please Select Sub Module",
        mainpage: "Please Select Main Page",
        subpage: "Please Select Sub Page",
        subsubpage: "Please Select Sub Sub Page",
        category: "Please Select Category",
        subcategory: "Please Select Sub Category",
    });


    //single select fetch Submodule
    const handleModuleNameChange = (modulename) => {
        const filteredMenuitems = menuItems.filter(
            (item) => item.title === modulename
        );

        const submodulerole = rolesNewList[0]?.submodulename?.map((item) => item);

        const filteredSubModulename = filteredMenuitems[0]?.submenu
            ?.filter((item) => submodulerole.includes(item.title))
            ?.map((item) => {
                return {
                    label: item.title,
                    value: item.title,
                };
            });

        setSubModuleOptions(filteredSubModulename);
    };

    const handleSubPageNameChange = (
        modulename,
        submodulename,
        mainpage,
        subpage
    ) => {
        const filteredMenuitemsModuleName = menuItems.filter(
            (item) => item.title === modulename
        );

        const filteredMenuitemsSubModuleName =
            filteredMenuitemsModuleName[0]?.submenu?.filter(
                (item) => item.title === submodulename
            );

        const filteredMenuitemsMainPage =
            filteredMenuitemsSubModuleName[0]?.submenu?.filter(
                (item) => item.title === mainpage
            );

        const filteredMenuitemsSubPage =
            filteredMenuitemsMainPage[0]?.submenu?.filter(
                (item) => item.title === subpage
            );

        const subpagerole = rolesNewList[0]?.subsubpagename?.map((item) => item);

        const filteredSubSubModulename = filteredMenuitemsSubPage[0]?.submenu
            ?.filter((item) => subpagerole.includes(item.title))
            ?.map((item) => {
                return {
                    label: item.title,
                    value: item.title,
                };
            });

        setsubSubPageoptions(filteredSubSubModulename);
    };

    const handleSubModuleNameChange = (modulename, submodulename) => {
        const filteredMenuitemsModuleName = menuItems.filter(
            (item) => item.title === modulename
        );

        const filteredMenuitemsSubModuleName =
            filteredMenuitemsModuleName[0]?.submenu?.filter(
                (item) => item.title === submodulename
            );

        const mainpagerole = rolesNewList[0]?.mainpagename?.map((item) => item);

        const filteredSubModulename = filteredMenuitemsSubModuleName[0]?.submenu
            ?.filter((item) => mainpagerole.includes(item.title))
            ?.map((item) => {
                return {
                    label: item.title,
                    value: item.title,
                };
            });

        setMainPageoptions(filteredSubModulename);
    };

    const handleMainPageChange = (options) => {
        let mainpageAns = options.map((a, index) => {
            return a.value;
        });
        let dbNames =
            options.length > 0 &&
            options.map((a, index) => {
                return a.dbname;
            });
        let mainPageFilt = mainPageoptions.filter((data) =>
            mainpageAns.includes(data.title)
        );

        let mainPage =
            mainPageFilt.length > 0 &&
            mainPageFilt
                .map((data) => data.submenu)
                .filter(Boolean)
                .flat();
        //Removing Add in the list
        let filteredArray =
            mainPage.length > 0 &&
            mainPage.filter((innerArray) => {
                return !innerArray.title.startsWith("Add ");
            });
        //options fetching
        let subPageDropDown =
            filteredArray?.length > 0
                ? filteredArray?.map((data) => ({
                    ...data,
                    label: data.title,
                    value: data.title,
                }))
                : [];
        setSubPageoptions(subPageDropDown);
    };


    const handleMainPageNameChange = (modulename, submodulename, mainpage) => {
        const filteredMenuitemsModuleName = menuItems.filter(
            (item) => item.title === modulename
        );

        const filteredMenuitemsSubModuleName =
            filteredMenuitemsModuleName[0]?.submenu?.filter(
                (item) => item.title === submodulename
            );

        const filteredMenuitemsMainPage =
            filteredMenuitemsSubModuleName[0]?.submenu?.filter(
                (item) => item.title === mainpage
            );

        const subpagerole = rolesNewList[0]?.subpagename?.map((item) => item);

        const filteredSubModulename = filteredMenuitemsMainPage[0]?.submenu
            ?.filter((item) => subpagerole.includes(item.title))
            ?.map((item) => {
                return {
                    label: item.title,
                    value: item.title,
                };
            });

        setSubPageoptions(filteredSubModulename);
    };

    // get the current user role datas
    const fetchNewRoleList = async () => {
        setPageName(!pageName)
        try {
            let role_new = await axios.get(SERVICE.ROLE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const allRoles = role_new?.data?.roles.filter((item) =>
                isUserRoleAccess?.role?.includes(item?.name)
            );

            let mergedObject = {};
            allRoles.forEach((obj) => {
                const keysToInclude = [
                    "modulename",
                    "submodulename",
                    "mainpagename",
                    "subpagename",
                    "subsubpagename",
                ];

                keysToInclude.forEach((key) => {
                    if (!mergedObject[key]) {
                        mergedObject[key] = [];
                    }

                    if (Array.isArray(obj[key])) {
                        obj[key].forEach((item) => {
                            if (!mergedObject[key].includes(item)) {
                                mergedObject[key].push(item);
                            }
                        });
                    } else {
                        if (!mergedObject[key].includes(obj[key])) {
                            mergedObject[key].push(obj[key]);
                        }
                    }
                });
            });
            console.log(mergedObject)
            setRolesNewList([mergedObject]);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    useEffect(() => {
        fetchNewRoleList();
    }, [isUserRoleAccess]);

    /////for edit 

    const handleModuleNameChangeEdit = (modulename) => {
        const filteredMenuitems = menuItems.filter(
            (item) => item.title === modulename
        );

        const submodulerole = rolesNewList[0]?.submodulename?.map((item) => item);

        const filteredSubModulename = filteredMenuitems[0]?.submenu
            ?.filter((item) => submodulerole.includes(item.title))
            ?.map((item) => {
                return {
                    label: item.title,
                    value: item.title,
                };
            });

        setSubModuleOptionsEdit(filteredSubModulename);
    };

    const handleSubPageNameChangeEdit = (
        modulename,
        submodulename,
        mainpage,
        subpage
    ) => {
        if (modulename && submodulename && mainpage && subpage) {
            const filteredMenuitemsModuleName = menuItems.filter(
                (item) => item.title === modulename
            );

            const filteredMenuitemsSubModuleName =
                filteredMenuitemsModuleName[0]?.submenu?.filter(
                    (item) => item.title === submodulename
                );

            const filteredMenuitemsMainPage =
                filteredMenuitemsSubModuleName[0]?.submenu?.filter(
                    (item) => item.title === mainpage
                );

            const filteredMenuitemsSubPage =
                filteredMenuitemsMainPage[0]?.submenu?.filter(
                    (item) => item.title === subpage
                );

            const subpagerole = rolesNewList[0]?.subsubpagename?.map((item) => item);

            const filteredSubSubModulename = filteredMenuitemsSubPage[0]?.submenu
                ?.filter((item) => subpagerole.includes(item.title))
                ?.map((item) => {
                    return {
                        label: item.title,
                        value: item.title,
                    };
                });

            setsubSubPageoptionsEdit(filteredSubSubModulename);
        }

    };

    const handleSubModuleNameChangeEdit = (modulename, submodulename) => {
        const filteredMenuitemsModuleName = menuItems.filter(
            (item) => item.title === modulename
        );

        const filteredMenuitemsSubModuleName =
            filteredMenuitemsModuleName[0]?.submenu?.filter(
                (item) => item.title === submodulename
            );

        const mainpagerole = rolesNewList[0]?.mainpagename?.map((item) => item);

        const filteredSubModulename = filteredMenuitemsSubModuleName[0]?.submenu
            ?.filter((item) => mainpagerole.includes(item.title))
            ?.map((item) => {
                return {
                    label: item.title,
                    value: item.title,
                };
            });

        setMainPageoptionsEdit(filteredSubModulename);
    };

    const handleMainPageChangeEdit = (options) => {
        let mainpageAns = options.map((a, index) => {
            return a.value;
        });
        let dbNames =
            options.length > 0 &&
            options.map((a, index) => {
                return a.dbname;
            });
        let mainPageFilt = mainPageoptions.filter((data) =>
            mainpageAns.includes(data.title)
        );

        let mainPage =
            mainPageFilt.length > 0 &&
            mainPageFilt
                .map((data) => data.submenu)
                .filter(Boolean)
                .flat();
        //Removing Add in the list
        let filteredArray =
            mainPage.length > 0 &&
            mainPage.filter((innerArray) => {
                return !innerArray.title.startsWith("Add ");
            });
        //options fetching
        let subPageDropDown =
            filteredArray?.length > 0
                ? filteredArray?.map((data) => ({
                    ...data,
                    label: data.title,
                    value: data.title,
                }))
                : [];
        setSubPageoptionsEdit(subPageDropDown);
    };


    const handleMainPageNameChangeEdit = (modulename, submodulename, mainpage) => {

        if (modulename && submodulename && mainpage) {
            const filteredMenuitemsModuleName = menuItems?.filter(
                (item) => item?.title === modulename
            );

            const filteredMenuitemsSubModuleName =
                filteredMenuitemsModuleName[0]?.submenu?.filter(
                    (item) => item?.title === submodulename
                );

            const filteredMenuitemsMainPage =
                filteredMenuitemsSubModuleName[0]?.submenu?.filter(
                    (item) => item?.title === mainpage
                );

            const subpagerole = rolesNewList[0]?.subpagename?.map((item) => item);

            const filteredSubModulename = filteredMenuitemsMainPage[0]?.submenu
                ?.filter((item) => subpagerole?.includes(item?.title))
                ?.map((item) => {
                    return {
                        label: item?.title,
                        value: item?.title,
                    };
                });

            setSubPageoptionsEdit(filteredSubModulename);
        }
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Checklist Modules.png');
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

    const [filteredSubCategoryOptions, setFilteredSubCategoryOptions] = useState([]);
    const [subcategoryEditOptions, setSubCategoryEditOptions] = useState([]);
    const [selectedOptionsSubCat, setSelectedOptionsSubCat] = useState([]);

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

    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };


    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setBtnSubmit(false);
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
        category: true,
        subcategory: true,
        checklist: true,
        actions: true,
        details: true,

        module: true,
        submodule: true,
        mainpage: true,
        subpage: true,
        subsubpage: true,

        estimation: true,
        estimationtime: true,

        information: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };
    const [deleteChecklisttype, setDeleteChecklisttype] = useState("");
    const rowData = async (id, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.CHECKLISTMODULE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteChecklisttype(res?.data?.schecklisttype);
            handleClickOpen();

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    // Alert delete popup
    let Checklisttypesid = deleteChecklisttype?._id;
    const delChecklisttype = async (e) => {

        setPageName(!pageName)
        try {
            if (Checklisttypesid) {
                await axios.delete(`${SERVICE.CHECKLISTMODULE_SINGLE}/${e}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
                await fetchChecklisttype();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1)
                setShowAlert(
                    <>
                        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully👍"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const delRoundcheckbox = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.CHECKLISTMODULE_SINGLE}/${item}`, {
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

            await fetchChecklisttype();
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully👍"}</p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //add function 
    const sendRequest = async () => {

        let subs = selectedOptionsSubCat.map((item) => item.value);

        let mappedWithAll = subs.flatMap((data) => {
            return subCategoryTodo.map((item) => {
                return {
                    ...item, module: singleSelectValues.module, submodule: singleSelectValues.submodule, mainpage: singleSelectValues.mainpage, subpage: singleSelectValues.subpage, subsubpage: singleSelectValues.subsubpage, category: addRequired.category, subcategory: data,
                }
            })
        })

        setPageName(!pageName)
        try {

            let subprojectscreate = await axios.post(SERVICE.CHECKLISTMODULE_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                module: String(singleSelectValues.module),
                submodule: String(singleSelectValues.submodule),
                mainpage: singleSelectValues.mainpage != "Please Select Main Page" ? String(singleSelectValues.mainpage) : "",
                subpage: singleSelectValues.subpage != "Please Select Sub Page" ? String(singleSelectValues.subpage) : "",
                subsubpage: singleSelectValues.subsubpage != "Please Select Sub Sub Page" ? String(singleSelectValues.subsubpage) : "",
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            })


            await fetchChecklisttype();
            setSubcategoryTodo([]);
            setAddRequired({

                ...addRequired,
                options: "Please Select Check List",
                count: "",

            });
            setBtnSubmit(false);
            setChecklisttype({ ...checklisttype, checklist: "", type: "Please Select Type" })
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Added Successfully👍"}</p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { setBtnSubmit(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    //submit option for saving
    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetchChecklisttype();

        const isNameMatch = overallChecklist.some(item => {
            return (item.module == singleSelectValues.module && item.submodule == singleSelectValues.submodule && item.mainpage == singleSelectValues.mainpage && item.subpage == singleSelectValues.subpage && item.subsubpage == singleSelectValues.subsubpage)
        });






        if (singleSelectValues.module === "" || singleSelectValues.module == "Please Select Module") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Module Name!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (singleSelectValues.submodule === "" || singleSelectValues.submodule == "Please Select Sub Module") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Sub Module Name!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Data already exist!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else {
            sendRequest();
        }
    }

    const handleClear = (e) => {
        e.preventDefault();
        setAddRequired({
            category: "Please Select Category",
            subcategory: "Please Select  SubCategory",
            details: "",
            options: "Please Select Check List",
            count: "",
            information: "HR",
            raiser: true,
            resolver: true,
        });
        setSingleSelectValues({
            module: "Please Select Module",
            submodule: "Please Select Sub Module",
            mainpage: "Please Select Main Page",
            subpage: "Please Select Sub Page",
            subsubpage: "Please Select Sub Sub Page",
            category: "Please Select Category",
            subcategory: "Please Select Sub Category",
        });
        setCount("");
        setSubcategoryTodo([]);
        setSelectedOptionsSubCat([]);
        setFilteredSubCategoryOptions([]);
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Cleared Successfully👍"}</p>
            </>
        );
        handleClickOpenerr();
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
        setsubSubPageoptionsEdit([]);
        setSubPageoptionsEdit([]);

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
            let res = await axios.get(`${SERVICE.CHECKLISTMODULE_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setChecklisttypeEdit(res?.data?.schecklisttype);
            setAddRequiredEdit({ ...res?.data?.schecklisttype, options: res?.data?.schecklisttype?.checklist });
            fetchSubcategoryEdit({ label: res?.data?.schecklisttype?.category, value: res?.data?.schecklisttype?.category })
            setSingleSelectValuesEdit({
                module: res?.data?.schecklisttype?.module,
                submodule: res?.data?.schecklisttype?.submodule,
                mainpage:
                    res?.data?.schecklisttype?.mainpage === ""
                        ? "Please Select Main Page"
                        : res?.data?.schecklisttype?.mainpage,
                subpage:
                    res?.data?.schecklisttype?.subpage === ""
                        ? "Please Select Sub Page"
                        : res?.data?.schecklisttype?.subpage,
                subsubpage:
                    res?.data?.schecklisttype?.subsubpage === ""
                        ? "Please Select Sub Sub Page"
                        : res?.data?.schecklisttype?.subsubpage,
                category:
                    res?.data?.schecklisttype?.category === ""
                        ? "Please Select Category"
                        : res?.data?.schecklisttype?.category,
                subcategory:
                    res?.data?.schecklisttype?.subcategory === ""
                        ? "Please Select Sub Category"
                        : res?.data?.schecklisttype?.subcategory,
            });
            handleModuleNameChangeEdit(res?.data?.schecklisttype?.module, rolesNewList);
            handleSubModuleNameChangeEdit(
                res?.data?.schecklisttype?.module,
                res?.data?.schecklisttype?.submodule,
                rolesNewList
            );
            handleMainPageNameChangeEdit(
                res?.data?.schecklisttype?.module,
                res?.data?.schecklisttype?.submodule,
                res?.data?.schecklisttype?.mainpage,
                rolesNewList
            );
            handleSubPageNameChangeEdit(
                res?.data?.schecklisttype?.module,
                res?.data?.schecklisttype?.submodule,
                res?.data?.schecklisttype?.mainpage,
                res?.data?.schecklisttype?.subpage,
                rolesNewList
            );

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }


    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.CHECKLISTMODULE_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setChecklisttypeEdit(res?.data?.schecklisttype);
            setAddRequiredEdit({ ...res?.data?.schecklisttype, options: res?.data?.schecklisttype?.checklist });
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.CHECKLISTMODULE_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setChecklisttypeEdit(res?.data?.schecklisttype);
            setAddRequiredEdit({ ...res?.data?.schecklisttype, options: res?.data?.schecklisttype?.checklist });
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //Project updateby edit page...
    let updateby = checklisttypeEdit?.updatedby;
    let addedby = checklisttypeEdit?.addedby;
    let subprojectsid = checklisttypeEdit?._id;

    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.CHECKLISTMODULE_SINGLE}/${subprojectsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                module: String(singleSelectValuesEdit.module),
                submodule: String(singleSelectValuesEdit.submodule),
                mainpage: singleSelectValuesEdit.mainpage != "Please Select Main Page" ? String(singleSelectValuesEdit.mainpage) : "",
                subpage: singleSelectValuesEdit.subpage != "Please Select Sub Page" ? String(singleSelectValuesEdit.subpage) : "",
                subsubpage: singleSelectValuesEdit.subsubpage != "Please Select Sub Sub Page" ? String(singleSelectValuesEdit.subsubpage) : "",
                updatedby: [
                    ...updateby, {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchChecklisttype();
            await fetchChecklisttypeAll();
            handleCloseModEdit();
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Updated Successfully👍"}</p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    const editSubmit = (e) => {
        e.preventDefault();
        fetchChecklisttypeAll();
        const isNameMatch = allChecklisttypeedit.some(item => {
            return (item.module == singleSelectValuesEdit.module
                &&
                item.submodule == singleSelectValuesEdit.submodule
                &&
                item.mainpage == (singleSelectValuesEdit.mainpage == "Please Select Main Page" ? "" : singleSelectValuesEdit.mainpage)
                &&
                item.subpage == (singleSelectValuesEdit.subpage == "Please Select Sub Page" ? "" : singleSelectValuesEdit.subpage)
                &&
                item.subsubpage == (singleSelectValuesEdit.subsubpage == "Please Select Sub Sub Page" ? "" : singleSelectValuesEdit.subsubpage))
        }
        );


        if (singleSelectValuesEdit.module === "" || singleSelectValuesEdit.module == "Please Select Module") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Module Name!"} 
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (singleSelectValuesEdit.submodule === "" || singleSelectValuesEdit.submodule == "Please Select Sub Module") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Sub Module Name!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Data already exist!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else {
            sendEditRequest();
        }
    }

    const [totalPages, setTotalPages] = useState(0);
    const [totalDatas, setTotalDatas] = useState(0);


    //get all Sub vendormasters.
    const fetchChecklisttype = async () => {
        setPageName(!pageName)
        try {
            let res_status = await axios.post(SERVICE.GETALLCHECKLISTMODULEBYPAGINATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                page: Number(page),
                pageSize: Number(pageSize),
                searchQuery: searchQuery
            });


            const ans = res_status?.data?.checklisttypes?.length > 0 ? res_status?.data?.result : []

            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
            }));
            setTotalDatas(ans?.length > 0 ? res_status?.data?.totalDatas : 0);
            setTotalPages(ans?.length > 0 ? res_status?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            setChecklisttypes(itemsWithSerialNumber);
            setChecklisttypecheck(true)
        } catch (err) { setChecklisttypecheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    const [overallChecklist, setOverallChecklist] = useState([]);
    //get all Sub vendormasters.
    const fetchChecklisttypeAll = async () => {
        setPageName(!pageName)
        try {
            let res_meet = await axios.get(SERVICE.CHECKLISTMODULE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setOverallChecklist(res_meet?.data?.checklisttypes);
            setAllChecklisttypeedit(res_meet?.data?.checklisttypes.filter(item => item._id !== checklisttypeEdit._id));
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }


    //------------------------------------------------------

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
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

    const exportToExcel = (excelData, fileName) => {
        setPageName(!pageName)
        try {
            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

            // Check if the browser supports Blob and FileSaver
            if (!Blob || !FileSaver) {
                console.error('Blob or FileSaver not supported');
                return;
            }

            const data = new Blob([excelBuffer], { type: fileType });

            // Check if FileSaver.saveAs is available
            if (!FileSaver.saveAs) {
                console.error('FileSaver.saveAs is not available');
                return;
            }

            FileSaver.saveAs(data, fileName + fileExtension);
        } catch (error) {
            console.error('Error exporting to Excel', error);
        }
    };

    const formatData = (data) => {
        return data.map((item, index) => {
            return {
                Sno: index + 1,
                "Module Name": item.module || '',
                "Sub Module Name": item.submodule || '',

                "Main Page": item.mainpage || '',
                "Sub Page": item.subpage || '',
                "Sub Sub Page": item.subsubpage || '',


            };
        });
    };

    const handleExportXL = async (isfilter) => {
        setIsFilterOpen(false);
        setLoading(true);
        setLoadingMessage('Fetching data...');

        let overallDatas;

        if (isfilter !== "filtered") {
            setPageName(!pageName)
            try {
                const res = await axios.get(SERVICE.CHECKLISTMODULE, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

                overallDatas = res?.data?.checklisttypes?.map((item) => ({
                    ...item,

                }));
            } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
        }

        setLoadingMessage('Preparing data for export...');

        const dataToExport = isfilter === "filtered" ? filteredDatas : overallDatas;

        if (!dataToExport || dataToExport.length === 0) {
            console.error('No data available to export');
            setLoading(false);
            return;
        }

        exportToExcel(formatData(dataToExport), 'Checklist Modules');

        setLoading(false);
    };

    // pdf.....
    const columns = [
        { title: "Module Name", field: "module" },
        { title: "Sub Module Name", field: "submodule" },
        { title: "Main Page", field: "mainpage" },
        { title: "Sub Page", field: "subpage" },
        { title: "Sub Sub Page", field: "subsubpage" },



    ];

    const downloadPdf = async (isfilter) => {
        setLoading(true);
        setLoadingMessage('Fetching data...');

        let overallDatas;

        if (isfilter !== "filtered") {
            setPageName(!pageName)
            try {
                const res = await axios.get(SERVICE.CHECKLISTMODULE, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

                overallDatas = res?.data?.checklisttypes?.map((item) => ({
                    ...item,

                }));
            } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
        }

        const doc = new jsPDF();

        // Initialize serial number counter
        // Modify columns to include serial number column
        const columnsWithSerial = [
            { title: "S.No", dataKey: "serialNumber" }, // Serial number column
            ...columns.map((col) => ({ title: col.title, dataKey: col.field })),
        ];

        // Modify row data to include serial number
        const dataWithSerial =
            isfilter === "filtered"
                ? filteredDatas.map((t, index) => ({
                    ...t,
                    serialNumber: index + 1,

                }))
                : overallDatas?.map((item, index) => ({
                    ...item,
                    serialNumber: index + 1,


                }));

        setLoadingMessage('Preparing data for export...');

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            columns: columnsWithSerial,
            body: dataWithSerial,
            styles: { fontSize: 5 },
        });

        doc.save("Checklist Modules.pdf");
        setLoading(false);
    };
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Checklist Modules',
        pageStyle: 'print'
    });

    useEffect(() => {
        fetchCategory();
    }, [])

    useEffect(() => {
        fetchChecklisttype();
    }, [page, pageSize, searchQuery])

    useEffect(() => {
        fetchChecklisttypeAll();
    }, [isEditOpen, checklisttypeEdit])


    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

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
    const filteredDatas = checklisttypes?.filter((item) => {
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

        { field: "module", headerName: "Module Name", flex: 0, width: 200, hide: !columnVisibility.module, headerClassName: "bold-header" },
        { field: "submodule", headerName: "Sub Module Name", flex: 0, width: 200, hide: !columnVisibility.submodule, headerClassName: "bold-header" },
        { field: "mainpage", headerName: "Main Page", flex: 0, width: 200, hide: !columnVisibility.mainpage, headerClassName: "bold-header" },
        { field: "subpage", headerName: "Sub Page", flex: 0, width: 200, hide: !columnVisibility.subpage, headerClassName: "bold-header" },
        { field: "subsubpage", headerName: "Sub Sub Page", flex: 0, width: 200, hide: !columnVisibility.subsubpage, headerClassName: "bold-header" },
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
                    {isUserRoleCompare?.includes("echecklistmoduleselection") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {
                            handleClickOpenEdit();
                            getCode(params.row.id, params.row.name);
                        }}><EditOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                    )}
                    {isUserRoleCompare?.includes("dchecklistmoduleselection") && (
                        <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.row.id, params.row.name) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                    )}
                    {isUserRoleCompare?.includes("vchecklistmoduleselection") && (
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
                    {isUserRoleCompare?.includes("ichecklistmoduleselection") && (
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
            module: item.module,
            submodule: item.submodule,
            mainpage: item.mainpage,
            subpage: item.subpage,
            subsubpage: item.subsubpage,


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
            <Headtitle title={'Checklist Modules'} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Manage Checklist Modules"
                modulename="Checklist"
                submodulename="Checklist Module Selection"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("achecklistmoduleselection")
                && (
                    <>

                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>Add Checklist Modules</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Module Name <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={rolesNewList[0]?.modulename?.map((item) => {
                                                    return { label: item, value: item };
                                                })}
                                                styles={colourStyles}
                                                value={{
                                                    label: singleSelectValues.module,
                                                    value: singleSelectValues.module,
                                                }}
                                                onChange={(e) => {
                                                    setSingleSelectValues({
                                                        ...singleSelectValues,
                                                        module: e.value,
                                                        submodule: "Please Select Sub Module",
                                                        mainpage: "Please Select Main Page",
                                                        subpage: "Please Select Sub Page",
                                                        subsubpage: "Please Select Sub Sub Page",
                                                        category: "Please Select Category",
                                                        subcategory: "Please Select Sub Category",
                                                    });
                                                    handleModuleNameChange(e.value);
                                                    setMainPageoptions([]);
                                                    setSubPageoptions([]);
                                                    setsubSubPageoptions([]);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Sub Module Name<b style={{ color: "red" }}>*</b>
                                            </Typography>

                                            <Selects

                                                options={subModuleOptions}
                                                styles={colourStyles}
                                                value={{
                                                    label: singleSelectValues.submodule,
                                                    value: singleSelectValues.submodule,
                                                }}
                                                onChange={(e) => {
                                                    setSingleSelectValues({
                                                        ...singleSelectValues,
                                                        submodule: e.value,
                                                        mainpage: "Please Select Main Page",
                                                        subpage: "Please Select Sub Page",
                                                        subsubpage: "Please Select Sub Sub Page",
                                                        category: "Please Select Category",
                                                        subcategory: "Please Select Sub Category",
                                                    });
                                                    handleSubModuleNameChange(
                                                        singleSelectValues.module,
                                                        e.value
                                                    );
                                                    setSubPageoptions([]);
                                                    setsubSubPageoptions([]);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Main Page</Typography>

                                            <Selects
                                                options={mainPageoptions}
                                                styles={colourStyles}
                                                value={{
                                                    label: singleSelectValues.mainpage,
                                                    value: singleSelectValues.mainpage,
                                                }}
                                                onChange={(e) => {
                                                    setSingleSelectValues({
                                                        ...singleSelectValues,
                                                        mainpage: e.value,
                                                        subpage: "Please Select Sub Page",
                                                        subsubpage: "Please Select Sub Sub Page",
                                                        category: "Please Select Category",
                                                        subcategory: "Please Select Sub Category",
                                                    });
                                                    handleMainPageChange([e]);
                                                    handleMainPageNameChange(
                                                        singleSelectValues.module,
                                                        singleSelectValues.submodule,
                                                        e.value
                                                    );
                                                    setsubSubPageoptions([]);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Sub Page</Typography>
                                            <Selects
                                                options={subPageoptions}
                                                styles={colourStyles}
                                                value={{
                                                    label: singleSelectValues.subpage,
                                                    value: singleSelectValues.subpage,
                                                }}
                                                onChange={(e) => {
                                                    setSingleSelectValues({
                                                        ...singleSelectValues,
                                                        subpage: e.value,
                                                        subsubpage: "Please Select Sub Sub Page",
                                                        category: "Please Select Category",
                                                        subcategory: "Please Select Sub Category",
                                                    });
                                                    handleSubPageNameChange(
                                                        singleSelectValues.module,
                                                        singleSelectValues.submodule,
                                                        singleSelectValues.mainpage,
                                                        e.value
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Sub Sub-Page</Typography>
                                            <Selects
                                                options={subSubPageoptions}
                                                styles={colourStyles}
                                                value={{
                                                    label: singleSelectValues.subsubpage,
                                                    value: singleSelectValues.subsubpage,
                                                }}
                                                onChange={(e) => {
                                                    setSingleSelectValues({
                                                        ...singleSelectValues,
                                                        subsubpage: e.value,
                                                        category: "Please Select Category",
                                                        subcategory: "Please Select Sub Category",
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />  <br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <LoadingButton variant='contained' loading={btnSubmit} color='primary' onClick={handleSubmit}>Submit</LoadingButton>

                                    </Grid>
                                    <Grid item md={2.5} xs={12} sm={6}>
                                        <Button sx={userStyle.btncancel} onClick={handleClear}>Clear</Button>

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
                            overflow: 'auto',
                        },
                    }}
                >

                    <Box sx={{ padding: '20px' }}>
                        <>
                            <form onSubmit={editSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Edit Checklist Modules</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Module Name <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={rolesNewList[0]?.modulename?.map((item) => {
                                                    return { label: item, value: item };
                                                })}
                                                styles={colourStyles}
                                                value={{
                                                    label: singleSelectValuesEdit.module,
                                                    value: singleSelectValuesEdit.module,
                                                }}
                                                onChange={(e) => {
                                                    setSingleSelectValuesEdit({
                                                        ...singleSelectValuesEdit,
                                                        module: e.value,
                                                        submodule: "Please Select Sub Module",
                                                        mainpage: "Please Select Main Page",
                                                        subpage: "Please Select Sub Page",
                                                        subsubpage: "Please Select Sub Sub Page",
                                                        category: "Please Select Category",
                                                        subcategory: "Please Select Sub Category",
                                                    });
                                                    handleModuleNameChangeEdit(e.value);
                                                    setMainPageoptionsEdit([]);
                                                    setSubPageoptionsEdit([]);
                                                    setsubSubPageoptionsEdit([]);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Sub Module Name<b style={{ color: "red" }}>*</b>
                                            </Typography>

                                            <Selects

                                                options={subModuleOptionsEdit}
                                                styles={colourStyles}
                                                value={{
                                                    label: singleSelectValuesEdit.submodule,
                                                    value: singleSelectValuesEdit.submodule,
                                                }}
                                                onChange={(e) => {
                                                    setSingleSelectValuesEdit({
                                                        ...singleSelectValuesEdit,
                                                        submodule: e.value,
                                                        mainpage: "Please Select Main Page",
                                                        subpage: "Please Select Sub Page",
                                                        subsubpage: "Please Select Sub Sub Page",
                                                        category: "Please Select Category",
                                                        subcategory: "Please Select Sub Category",
                                                    });
                                                    handleSubModuleNameChangeEdit(
                                                        singleSelectValuesEdit.module,
                                                        e.value
                                                    );
                                                    setSubPageoptionsEdit([]);
                                                    setsubSubPageoptionsEdit([]);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Main Page</Typography>

                                            <Selects
                                                options={mainPageoptionsEdit}
                                                styles={colourStyles}
                                                value={{
                                                    label: singleSelectValuesEdit.mainpage,
                                                    value: singleSelectValuesEdit.mainpage,
                                                }}
                                                onChange={(e) => {
                                                    setSingleSelectValuesEdit({
                                                        ...singleSelectValuesEdit,
                                                        mainpage: e.value,
                                                        subpage: "Please Select Sub Page",
                                                        subsubpage: "Please Select Sub Sub Page",
                                                        category: "Please Select Category",
                                                        subcategory: "Please Select Sub Category",
                                                    });
                                                    handleMainPageChangeEdit([e]);
                                                    handleMainPageNameChangeEdit(
                                                        singleSelectValuesEdit.module,
                                                        singleSelectValuesEdit.submodule,
                                                        e.value
                                                    );
                                                    setsubSubPageoptionsEdit([]);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Sub Page</Typography>
                                            <Selects
                                                options={subPageoptionsEdit}
                                                styles={colourStyles}
                                                value={{
                                                    label: singleSelectValuesEdit.subpage,
                                                    value: singleSelectValuesEdit.subpage,
                                                }}
                                                onChange={(e) => {
                                                    setSingleSelectValuesEdit({
                                                        ...singleSelectValuesEdit,
                                                        subpage: e.value,
                                                        subsubpage: "Please Select Sub Sub Page",
                                                        category: "Please Select Category",
                                                        subcategory: "Please Select Sub Category",
                                                    });
                                                    handleSubPageNameChangeEdit(
                                                        singleSelectValuesEdit.module,
                                                        singleSelectValuesEdit.submodule,
                                                        singleSelectValuesEdit.mainpage,
                                                        e.value
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Sub Sub-Page</Typography>
                                            <Selects
                                                options={subSubPageoptionsEdit}
                                                styles={colourStyles}
                                                value={{
                                                    label: singleSelectValuesEdit.subsubpage,
                                                    value: singleSelectValuesEdit.subsubpage,
                                                }}
                                                onChange={(e) => {
                                                    setSingleSelectValuesEdit({
                                                        ...singleSelectValuesEdit,
                                                        subsubpage: e.value,
                                                        category: "Please Select Category",
                                                        subcategory: "Please Select Sub Category",
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
            {isUserRoleCompare?.includes("lchecklistmoduleselection") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Checklist Modules List</Typography>
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
                                    {isUserRoleCompare?.includes("excelchecklistmoduleselection") && (
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
                                    {isUserRoleCompare?.includes("csvchecklistmoduleselection") && (
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
                                    {isUserRoleCompare?.includes("printchecklistmoduleselection") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfchecklistmoduleselection") && (
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
                                    {isUserRoleCompare?.includes("imagechecklistmoduleselection") && (
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
                        <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button>


                        <br /><br />
                        {!checklisttypeCheck ?
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
                                    <Pagination page={page} pageSize={pageSize} totalPages={searchQuery !== "" ? 1 : totalPages} onPageChange={handlePageChange} pageItemLength={filteredDatas?.length} totalProjects={
                                        searchQuery !== "" ? filteredDatas?.length : totalDatas
                                    } />

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

            {/* Delete Modal */}
            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isDeleteOpen}
                    onClose={handleCloseMod}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseMod} sx={userStyle.btncancel}>Cancel</Button>
                        <Button autoFocus variant="contained" color='error'
                            onClick={(e) => delChecklisttype(Checklisttypesid)}
                        > OK </Button>
                    </DialogActions>
                </Dialog>


                {/* this is info view details */}

                <Dialog
                    open={openInfo}
                    onClose={handleCloseinfo}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <Box sx={{ width: '550px', padding: '20px 50px' }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>Checklist Modules Info</Typography>
                            <br /><br />
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">addedby</Typography>
                                        <br />
                                        <Table>
                                            <TableHead>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"SNO"}.</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"UserName"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Date"}</StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {addedby?.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.name}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {moment(item.date).format('DD-MM-YYYY hh:mm:ss a')}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </FormControl>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Updated by</Typography>
                                        <br />
                                        <Table>
                                            <TableHead>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"SNO"}.</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"UserName"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Date"}</StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {updateby?.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.name}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {moment(item.date).format('DD-MM-YYYY hh:mm:ss a')}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br /><br />
                            <Grid container spacing={2}>
                                <Button variant="contained" onClick={handleCloseinfo}> Back </Button>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
                {/* print layout */}

                <TableContainer component={Paper} sx={userStyle.printcls}>
                    <Table sx={{ minWidth: 700, }} aria-label="customized table" id="usertable" ref={componentRef}>
                        <TableHead>
                            <TableRow>
                                <TableCell>S.no</TableCell>
                                <TableCell>Module Name </TableCell>
                                <TableCell>Sub Module Name </TableCell>
                                <TableCell>Main Page </TableCell>
                                <TableCell>Sub Page </TableCell>
                                <TableCell>Sub Sub Page </TableCell>


                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {rowDataTable &&
                                (rowDataTable.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.module}</TableCell>
                                        <TableCell>{row.submodule}</TableCell>
                                        <TableCell>{row.mainpage}</TableCell>
                                        <TableCell>{row.subpage}</TableCell>
                                        <TableCell>{row.subsubpage}</TableCell>

                                    </TableRow>
                                )))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            // maxWidth="lg"
            >
                <Box sx={{ width: "550px", padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Checklist Modules</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Module Name</Typography>
                                    <Typography>{addRequiredEdit?.module}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub Module Name</Typography>
                                    <Typography>{addRequiredEdit?.submodule}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Main Page</Typography>
                                    <Typography>{addRequiredEdit?.mainpage}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub Page</Typography>
                                    <Typography>{addRequiredEdit?.subpage}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub Sub Page</Typography>
                                    <Typography>{addRequiredEdit?.subsubpage}</Typography>
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
                        <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Cancel</Button>
                        <Button autoFocus variant="contained" color='error'
                            onClick={(e) => delRoundcheckbox(e)}
                        > OK </Button>
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
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/*Export XL Data  */}
            <Dialog
                open={isFilterOpen}
                onClose={handleCloseFilterMod}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
                    {fileFormat === "xl" ? (
                        <>
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseFilterMod}
                                sx={{
                                    position: "absolute",
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon />
                            </IconButton>

                            <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
                            <Typography variant="h5" sx={{ textAlign: "center" }}>
                                Choose Export
                            </Typography>
                        </>
                    ) : (
                        <>
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseFilterMod}
                                sx={{
                                    position: "absolute",
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon />
                            </IconButton>

                            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
                            <Typography variant="h5" sx={{ textAlign: "center" }}>
                                Choose Export
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        variant="contained"
                        onClick={(e) => {
                            handleExportXL("filtered");
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button
                        autoFocus
                        variant="contained"
                        onClick={(e) => {
                            handleExportXL("overall");

                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog
                open={isPdfFilterOpen}
                onClose={handleClosePdfFilterMod}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterMod}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={(e) => {
                            downloadPdf("filtered");
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button
                        variant="contained"
                        onClick={(e) => {
                            downloadPdf("overall");
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            <Loader loading={loading} message={loadingMessage} />
        </Box>
    );
}


export default CheckListModuleSelection;