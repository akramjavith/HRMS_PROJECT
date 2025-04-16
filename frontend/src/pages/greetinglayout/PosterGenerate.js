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
import { v4 as uuidv4 } from "uuid";
import AlertDialog from "../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import StyledDataGrid from "../../components/TableStyle";
import { menuItems } from "../../components/menuItemsList";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import PosterGenerateGroupList from "./PosterGenerateGroupList";
import moment from "moment-timezone";

function PosterGenerate() {
    const currentDate = new Date();

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
    const [themenameOpt, setUomOpt] = useState([]);
    const [themenameOptEdit, setUomOptEdit] = useState([]);
    const [subcategorynameOptEdit, setSubcategorynameOptEdit] = useState([]);
    const [userId, setUserID] = useState("");
    const [copiedData, setCopiedData] = useState("");

    //state to handle holiday values
    const [posterGenerate, setPosterGenerate] = useState({
        categoryname: "Please Select Category Template Name",
        subcategoryname: "Please Select Sub-category Template Name",
        themename: "Please Select Theme Name",
        days: "Please Select Days",
        todate: "",
        fromdate: ""
    });
    const [themeNames, setThemeNames] = useState([]);
    const [selectedThemeNames, setSelectedThemeNames] = useState([]);
    let [valueCat, setValueCat] = useState([]);
    const handleThemeNameChange = (options) => {
        setValueCat(options.map(a => {
            return a.value;
        }));
        setSelectedThemeNames(options);
    };
    const customValueRendererCat = (valueCat, _categoryname) => {
        return valueCat?.length
            ? valueCat.map(({ label }) => label)?.join(", ")
            : "Please Select Theme Name";
    };
    const [themeNamesEdit, setThemeNamesEdit] = useState([]);
    const [selectedThemeNamesEdit, setSelectedThemeNamesEdit] = useState([]);
    let [valueCatEdit, setValueCatEdit] = useState([]);
    const handleThemeNameChangeEdit = (options) => {
        setValueCatEdit(options.map(a => {
            return a.value;
        }));
        setSelectedThemeNamesEdit(options);
    };
    const customValueRendererCatEdit = (valueCat, _categoryname) => {
        return valueCat?.length
            ? valueCat.map(({ label }) => label)?.join(", ")
            : "Please Select Theme Name";
    };



    const [posterGenerateEdit, setPosterGenerateEdit] = useState({
        categoryname: "Please Select Category Template Name",
        subcategoryname: "Please Select Sub-category Template Name",
        themename: "Please Select Theme Name",
    });


    const [categoryOption, setCategoryOption] = useState([]);
    const [posterGenerates, setPosterGenerates] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch } = useContext(
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

            let response = await axios.get(`${SERVICE.POSTERMESSAGESETTINGALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let all_datas = response.data.postermessage
            // let all_datas = res_location?.data?.categorythemegroupings
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
                })
                // .filter(
                //     (data, index, self) =>
                //         index ===
                //         self.findIndex(
                //             (t) =>
                //                 t.value === data.value
                //         )
                // )
                // .flat();
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

    //set function to get particular row
    const rowData = async (id, name) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.POSTERGENERATE_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteHoliday(res.data.spostergenerate);
            handleClickOpen();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    // Alert delete popup
    let holidayid = deleteHoliday._id;
    const delHoliday = async () => {
        setPageName(!pageName);
        try {
            await axios.delete(`${SERVICE.POSTERGENERATE_SINGLE}/${holidayid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchHolidayAll();
            await fetchHolidayAllGroup();
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
    // const sendRequest = async () => {
    //     setPageName(!pageName);
    //     setPosterGroup("abc")
    //     try {
    //         if (
    //             posterGenerate.themename ===
    //             "Birthday 3NOS Template 2" ||
    //             posterGenerate.themename ===
    //             "Wedding 3NOS Template"
    //         ) {

    //             const employee = employeeValueAdd?.map((item) => item?.value)
    //             // await Promise.all(
    //             //     // employeeValueAdd?.map(async (data) => {
    //             await axios.post(SERVICE.POSTERGENERATE_CREATE, {
    //                 headers: {
    //                     Authorization: `Bearer ${auth.APIToken}`,
    //                 },
    //                 company: [...valueCompanyAdd],
    //                 branch: [...valueBranchAdd],
    //                 unit: [...valueUnitAdd],
    //                 team: [...valueTeamAdd],
    //                 employeename: employee,
    //                 posterdownload: employeeValueAdd,
    //                 // employeedbid: data?._id,
    //                 // employeegroupid: data?.groupId,
    //                 categoryname: String(posterGenerate.categoryname),
    //                 subcategoryname: String(posterGenerate.subcategoryname),
    //                 themename: String(posterGenerate.themename),

    //                 addedby: [
    //                     {
    //                         name: String(isUserRoleAccess.companyname),
    //                         date: String(new Date()),
    //                     },
    //                 ],
    //             })
    //             // })
    //             // );
    //         }
    //         else if (
    //             posterGenerate.themename ===
    //             "Birthday 2NOS Template 2" ||
    //             posterGenerate.themename ===
    //             "Wedding 2NOS Template"
    //         ) {
    //             const employee = employeeValueAdd?.map((item) => item?.value)

    //             await axios.post(SERVICE.POSTERGENERATE_CREATE, {
    //                 headers: {
    //                     Authorization: `Bearer ${auth.APIToken}`,
    //                 },
    //                 company: [...valueCompanyAdd],
    //                 branch: [...valueBranchAdd],
    //                 unit: [...valueUnitAdd],
    //                 team: [...valueTeamAdd],
    //                 employeename: employee,
    //                 posterdownload: employeeValueAdd,
    //                 categoryname: String(posterGenerate.categoryname),
    //                 subcategoryname: String(posterGenerate.subcategoryname),
    //                 themename: String(posterGenerate.themename),

    //                 addedby: [
    //                     {
    //                         name: String(isUserRoleAccess.companyname),
    //                         date: String(new Date()),
    //                     },
    //                 ],
    //             });

    //         }
    //         else {
    //             await Promise.all(
    //                 employeeValueAdd?.map(async (data) => {
    //                     await axios.post(SERVICE.POSTERGENERATE_CREATE, {
    //                         headers: {
    //                             Authorization: `Bearer ${auth.APIToken}`,
    //                         },
    //                         company: [...valueCompanyAdd],
    //                         branch: [...valueBranchAdd],
    //                         unit: [...valueUnitAdd],
    //                         team: [...valueTeamAdd],
    //                         employeename: data?.value,
    //                         employeedbid: data?._id,
    //                         employeegroupid: data?.groupId,
    //                         posterdownload: employeeValueAdd,
    //                         categoryname: String(posterGenerate.categoryname),
    //                         subcategoryname: String(posterGenerate.subcategoryname),
    //                         themename: String(posterGenerate.themename),

    //                         addedby: [
    //                             {
    //                                 name: String(isUserRoleAccess.companyname),
    //                                 date: String(new Date()),
    //                             },
    //                         ],
    //                     });
    //                 })
    //             );
    //         }
    //         await fetchHolidayAll();
    //         await fetchHolidayAllGroup();
    //         setPosterGenerate({
    //             categoryname: "Please Select Category Name",
    //             subcategoryname: "Please Select Sub-category Name",
    //         });
    //         setSelectedThemeNames([]);
    //         setValueCat([]);
    //         setPopupContent("Added Successfully");
    //         setPopupSeverity("success");
    //         handleClickOpenPopup();
    //         setPosterGroup("efg")
    //     } catch (err) {
    //         setloadingdeloverall(false);
    //         handleApiError(err, setShowAlert, handleClickOpenerr);
    //     }
    // };
    const sendRequest = async () => {
        setPageName(!pageName);
        setPosterGroup("abc");

        try {
            const employeeCount = employeeValueAdd.length;

            if (employeeCount > 0) {
                let remainingEmployees = employeeCount;

                // Generate 3-person templates for every set of 3 employees
                const numberOfThreePersonTemplates = Math.floor(remainingEmployees / 3);
                let processedEmployees = 0;

                for (let i = 0; i < numberOfThreePersonTemplates; i++) {
                    const employeesForTemplate = employeeValueAdd.slice(processedEmployees, processedEmployees + 3);
                    processedEmployees += 3;
                    remainingEmployees -= 3;

                    const employee = employeesForTemplate.map((item) => item?.value);

                    await axios.post(SERVICE.POSTERGENERATE_CREATE, {
                        headers: { Authorization: `Bearer ${auth.APIToken}` },
                        company: [...valueCompanyAdd],
                        branch: [...valueBranchAdd],
                        unit: [...valueUnitAdd],
                        team: [...valueTeamAdd],
                        employeename: employee,
                        posterdownload: employeesForTemplate,
                        categoryname: String(posterGenerate.categoryname),
                        subcategoryname: String(posterGenerate.subcategoryname),
                        themename: "3-person template",
                        addedby: [
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),
                            },
                        ],
                    });

                    setPosterGenerate({
                        categoryname: "Please Select Category Template Name",
                        subcategoryname: "Please Select Sub-category Template Name",
                        themename: "Please Select Theme Name",
                        days: "Please Select Days",
                    });
                }

                // If 2 employees remain, send them to the 2-person template
                if (remainingEmployees === 2) {
                    const employeesForTemplate = employeeValueAdd.slice(processedEmployees, processedEmployees + 2);

                    const employee = employeesForTemplate.map((item) => item?.value);

                    await axios.post(SERVICE.POSTERGENERATE_CREATE, {
                        headers: { Authorization: `Bearer ${auth.APIToken}` },
                        company: [...valueCompanyAdd],
                        branch: [...valueBranchAdd],
                        unit: [...valueUnitAdd],
                        team: [...valueTeamAdd],
                        employeename: employee,
                        posterdownload: employeesForTemplate,
                        categoryname: String(posterGenerate.categoryname),
                        subcategoryname: String(posterGenerate.subcategoryname),
                        themename: "2-person template",
                        addedby: [
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),
                            },
                        ],
                    });
                    processedEmployees += 2;
                    remainingEmployees -= 2;

                    setPosterGenerate({
                        categoryname: "Please Select Category Template Name",
                        subcategoryname: "Please Select Sub-category Template Name",
                        themename: "Please Select Theme Name",
                        days: "Please Select Days",
                    });
                }

                // If 1 employee remains, send them to the 1-person template
                if (remainingEmployees === 1) {
                    const employeesForTemplate = employeeValueAdd.slice(processedEmployees, processedEmployees + 1);

                    await axios.post(SERVICE.POSTERGENERATE_CREATE, {
                        headers: { Authorization: `Bearer ${auth.APIToken}` },
                        company: [...valueCompanyAdd],
                        branch: [...valueBranchAdd],
                        unit: [...valueUnitAdd],
                        team: [...valueTeamAdd],
                        employeename: employeesForTemplate[0]?.value,
                        posterdownload: employeesForTemplate,
                        categoryname: String(posterGenerate.categoryname),
                        subcategoryname: String(posterGenerate.subcategoryname),
                        themename: "1-person template",
                        addedby: [
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),
                            },
                        ],
                    });

                    setPosterGenerate({
                        categoryname: "Please Select Category Template Name",
                        subcategoryname: "Please Select Sub-category Template Name",
                        themename: "Please Select Theme Name",
                        days: "Please Select Days",
                    });

                }
            }

            // Finalize by fetching holiday data and resetting form fields
            await fetchHolidayAll();
            await fetchHolidayAllGroup();
            setPosterGenerate({
                categoryname: "Please Select Category Template Name",
                subcategoryname: "Please Select Sub-category Template Name",
                themename: "Please Select Theme Name",
                days: "Please Select Days",
            });
            setSelectedThemeNames([]);
            setValueCat([]);
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setPosterGroup("efg");

            //company
            setCompanyValueAdd([])
            setValueCompanyAdd([])
            setBranchOption([])
            setBranchValueAdd([])
            setValueBranchAdd([])
            setUnitOption([])
            setUnitValueAdd([])
            setValueUnitAdd([])
            setTeamOption([])
            setTeamValueAdd([])
            setValueTeamAdd([])
            setEmployeeOptionDaysWise([])
            setEmployeeValueAddEdit([])
            setEmployeeValueAdd([])
        } catch (err) {
            setloadingdeloverall(false);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };


    //submit option for saving
    const handleSubmit = (e) => {
        setloadingdeloverall(true);
        e.preventDefault();
        const isNameMatch = posterGenerates?.some(
            (item) =>
                item.categoryname?.toLowerCase() === posterGenerate.categoryname?.toLowerCase() &&
                item.subcategoryname?.toLowerCase() === posterGenerate.subcategoryname?.toLowerCase() &&
                item.themename?.toLowerCase() === posterGenerate.themename?.toLowerCase());
        let employees = employeeValueAdd?.map(data => data);

        if (posterGenerate.categoryname === "Please Select Category Template Name") {
            setPopupContentMalert("Please Select Category Template Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            posterGenerate.subcategoryname ===
            "Please Select Sub-category Template Name"
        ) {
            setPopupContentMalert("Please Select Sub-category Template Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (companyValueAdd?.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (branchValueAdd?.length === 0) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (unitValueAdd?.length === 0) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (teamValueAdd?.length === 0) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (posterGenerate?.days === "Please Select Days") {
            setPopupContentMalert("Please Select Days");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (posterGenerate?.days === "Custom Fields" && posterGenerate.fromdate === "") {
            setPopupContentMalert("Please Select From Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (employeeValueAdd?.length === 0) {
            setPopupContentMalert("Please Select Employee!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        // else if (
        //     posterGenerate.themename ===
        //     "Please Select Theme Name"
        // ) {
        //     setPopupContentMalert("Please Select Theme Name!");
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }
        // else if (
        //     (posterGenerate.themename ===
        //         "Birthday 2NOS Template 2" ||
        //         posterGenerate.themename ===
        //         "Wedding 2NOS Template") && (employees.length % 2 !== 0)
        // ) {
        //     setPopupContentMalert("Please Select Employee 2NOS!");
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }
        // else if (
        //     (posterGenerate.themename ===
        //         "Birthday 3NOS Template 2" ||
        //         posterGenerate.themename ===
        //         "Wedding 3NOS Template") && (employees.length % 3 !== 0)
        // ) {
        //     setPopupContentMalert("Please Select Employee 3NOS!");
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }
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
        setPosterGenerate({
            categoryname: "Please Select Category Template Name",
            subcategoryname: "Please Select Sub-category Template Name",
            themename: "Please Select Theme Name",
            days: "Please Select Days",
        });
        setSubcategoryOption([]);
        setSelectedThemeNames([]);
        setThemeNames([])
        setValueCat([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setEmployeeValueAdd([])
        setEmployeeOptionDaysWise([])

        setCompanyValueAdd([])
        setValueCompanyAdd([])
        setBranchOption([])
        setBranchValueAdd([])
        setValueBranchAdd([])
        setUnitOption([])
        setUnitValueAdd([])
        setValueUnitAdd([])
        setTeamOption([])
        setTeamValueAdd([])
        setValueTeamAdd([])
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
            let res = await axios.get(`${SERVICE.POSTERGENERATE_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setPosterGenerateEdit(res?.data?.spostergenerate);
            setSelectedThemeNamesEdit(res?.data?.spostergenerate?.themename?.map(data => {
                return {
                    label: data,
                    value: data,
                }
            }))
            fetchCategoryAll();
            fetchHolidayAll();
            handleClickOpenEdit();
            await fetchHolidayAllGroup();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
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
            await fetchHolidayAll();
            await fetchHolidayAllGroup();
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
    //get all data.
    const fetchHolidayAll = async () => {
        setPageName(!pageName);
        try {
            const accessbranch = isAssignBranch
                ?.map((data) => ({
                    branch: data.branch,
                    company: data.company,
                    unit: data.unit,
                }))

            let res_status = await axios.post(SERVICE.POSTERGENERATE, {
                assignbranch: accessbranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setPosterGenerates(res_status?.data?.postergenerates);
            setAllStatusEdit(
                res_status?.data?.postergenerates.filter((item) => item._id !== userId)
            );
            setStatusCheck(false)
            await fetchHolidayAllGroup();
        } catch (err) {
            setStatusCheck(false)
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "PosterGenerate.png");
                });
            });
        }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "PosterGenerate",
        pageStyle: "print",
    });
    //get all data.
    const [statusCheckchild, setStatusCheckchild] = useState(true);
    const [childGroupAll, setChildGroupAll] = useState([])
    const fetchHolidayAllGroup = async () => {
        setPageName(!pageName);
        setStatusCheckchild(true)
        try {
            const accessbranch = isAssignBranch
                ?.map((data) => ({
                    branch: data.branch,
                    company: data.company,
                    unit: data.unit,
                }))

            let res_status = await axios.post(SERVICE.POSTERGENERATEGROUP, {
                assignbranch: accessbranch
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setChildGroupAll(res_status?.data?.postergenerates);

            setStatusCheckchild(false)
        } catch (err) {
            setStatusCheckchild(false)
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    //serial no for listing items
    const addSerialNumber = () => {
        const itemsWithSerialNumber = posterGenerates?.map((item, index) => ({
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
                                rowData(params.row.id);
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
            company: item?.company.toString(),
            branch: item?.branch.toString(),
            unit: item?.unit.toString(),
            team: item?.team.toString(),
            posterdownload: item?.posterdownload
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


    useEffect(() => {
        fetchCategoryAll();
        getwishingmessage();
        getfootermessage();
    }, []);

    useEffect(() => {
        addSerialNumber();
    }, [posterGenerates]);

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
        setPosterGroup("1")
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
            await fetchHolidayAll();
            await fetchHolidayAllGroup();
            setPosterGroup("2")
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
    //get all Asset Variant name.
    const fetchThemeLayouts = async () => {
        setPageName(!pageName);
        try {
            let employees = employeeValueAdd?.map(data => data?._id)
            let templates = themeNames?.map(data => data?.url)

        }
        catch (err) {
            setLoader(false);
            let error = err.response?.data?.message;
            if (error) {
                setPopupContentMalert(error);
                setPopupSeverityMalert("error");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(err, setShowAlert, handleClickOpenerr);
            }
        }
    };




    // MultiSelects Add
    const [companyOption, setCompanyOption] = useState([]);
    const [companyValueAdd, setCompanyValueAdd] = useState([]);
    let [valueCompanyAdd, setValueCompanyAdd] = useState("");
    const customValueRendererCompanyAdd = (valueCompanyAdd, _companies) => {
        return valueCompanyAdd.length ? valueCompanyAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Company</span>
    }
    // Company MultiSelect
    const handleCompanyChangeAdd = (options) => {
        setValueCompanyAdd(
            options.map(a => {
                return a.value;
            })
        )
        setCompanyValueAdd(options);
        fetchBranch(options);
        setBranchOption([]);
        setBranchValueAdd([]);
        setUnitOption([]);
        setUnitValueAdd([]);
        setTeamOption([]);
        setEmployeeOptionDaysWise([])
        setTeamValueAdd([]);
        setEmployeeOption([]);
        setEmployeeValueAdd([]);
        setPosterGenerate({
            ...posterGenerate,
            days: "Please Select Days",
        });

    }
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
    const [branchOption, setBranchOption] = useState([]);
    const [branchValueAdd, setBranchValueAdd] = useState([]);
    let [valueBranchAdd, setValueBranchAdd] = useState("");
    const customValueRendererBranchAdd = (valueBranchAdd, _branches) => {
        return valueBranchAdd.length ? valueBranchAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Branch</span>
    }
    // Branch Multi-Select
    const handleBranchChangeAdd = (options) => {
        setValueBranchAdd(
            options.map((a) => {
                return a.value;
            })
        );
        setBranchValueAdd(options);
        fetchUnits(options);
        setUnitOption([]);
        setUnitValueAdd([]);
        setTeamOption([]);
        setTeamValueAdd([]);
        setEmployeeOption([]);
        setEmployeeOptionDaysWise([])
        setEmployeeValueAdd([]);
        setPosterGenerate({
            ...posterGenerate,
            days: "Please Select Days",
        });

    };
    //Fetching Branches
    const fetchBranch = async (company) => {
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
            setBranchOption(
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
    const [unitOption, setUnitOption] = useState([]);
    const [unitValueAdd, setUnitValueAdd] = useState([]);
    let [valueUnitAdd, setValueUnitAdd] = useState("");
    const customValueRendererUnitAdd = (valueUnitAdd, _units) => {
        return valueUnitAdd.length ? valueUnitAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Unit</span>
    }
    //Unit MultiSelect
    const handleUnitChangeAdd = (options) => {
        setValueUnitAdd(
            options.map((a) => {
                return a.value;
            })
        );
        setUnitValueAdd(options);
        fetchTeams(options);
        setTeamValueAdd([]);
        setEmployeeOption([]);
        setEmployeeOptionDaysWise([])
        setEmployeeValueAdd([]);
        setPosterGenerate({
            ...posterGenerate,
            days: "Please Select Days",
        });
    }
    //Fetching Units
    const fetchUnits = async (branch) => {
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
            setUnitOption(
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
    const [teamOption, setTeamOption] = useState([]);
    const [teamValueAdd, setTeamValueAdd] = useState([]);
    let [valueTeamAdd, setValueTeamAdd] = useState("");
    const customValueRendererTeamAdd = (valueTeamAdd, _teams) => {
        return valueTeamAdd.length ? valueTeamAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Team</span>
    }
    //Team MultiSelect
    const handleTeamChangeAdd = (options) => {
        setValueTeamAdd(
            options.map((a) => {
                return a.value;
            })
        );
        setTeamValueAdd(options);
        fetchEmployee(options)
        setEmployeeOptionDaysWise([])
        setEmployeeValueAdd([]);
        setPosterGenerate({
            ...posterGenerate,
            days: "Please Select Days",
        });
    }
    //Fetching Teams
    const fetchTeams = async (unit) => {
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
            setTeamOption(
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
    const [employeeOption, setEmployeeOption] = useState([]);
    const [employeeOptionDaysWise, setEmployeeOptionDaysWise] = useState([]);
    const [employeeValueAdd, setEmployeeValueAdd] = useState([]);
    let [valueEmployeeAdd, setValueEmployeeAdd] = useState("");
    const customValueRendererEmployeeAdd = (valueEmployeeAdd, _employees) => {
        return valueEmployeeAdd.length ? valueEmployeeAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Employee</span>
    }
    //Employee MultiSelect
    const handleEmployeeChangeAdd = (options) => {
        setValueEmployeeAdd(
            options.map((a) => {
                return a.value;
            })
        );
        setEmployeeValueAdd(options);
    }

    const [thisweekBirthday, setthisweekBirthday] = useState();
    const [thismonthBirthday, setthismonthBirthday] = useState();
    const [lastweekBirthday, setlastweekBirthday] = useState();
    const [lastmonthBirthday, setlastmonthBirthday] = useState();
    const [overallBirthday, setoverallBirthday] = useState();


    const [thisweekWedding, setthisweekWedding] = useState()
    const [lastmonthwedding, setlastmonthwedding] = useState()
    const [lastweekWedding, setlastweekWedding] = useState()
    const [thismonthwedding, setthismonthwedding] = useState()
    const [overallWedding, setoverallWedding] = useState()



    const fetchBirthday = async () => {
        try {
            let response = await axios.get(`${SERVICE.POSTERGENERATEGROUP_GETBIRTHDAY}`, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });
            let sortedthisweek = response?.data?.userbirthdaythisweek.sort(
                (a, b) => new Date(a.dob) - new Date(b.dob)
            );
            let sortedlastmonth = response?.data?.userslastmonthdob.sort(
                (a, b) => new Date(a.doj) - new Date(b.doj)
            );
            let sortedlastweek = response?.data?.usersLastWeekdob.sort(
                (a, b) => new Date(a.dom) - new Date(b.dom)
            );
            let sortedthismonth = response?.data?.usersthismonthbod.sort(
                (a, b) => new Date(a.dom) - new Date(b.dom)
            );
            let sortedoverall = response?.data?.usersallbod.sort(
                (a, b) => new Date(a.dom) - new Date(b.dom)
            );

            //birthdaythisweek
            if (response?.data?.userbirthdaythisweek.length != 0) {
                const displayDates = sortedthisweek?.map((item) => {
                    const itemDate = new Date(item.dob);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            dob: "Today",
                            _id: item._id,
                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            dob: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                        };
                    }
                });
                setthisweekBirthday(displayDates);
            } else {
                setthisweekBirthday([]);
            }

            //birthdaylastmonth
            if (response?.data?.userslastmonthdob?.length != 0) {
                const displayDates = sortedlastmonth?.map((item) => {
                    const itemDate = new Date(item.dob);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            dob: "Today",
                            _id: item._id,
                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            dob: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                        };
                    }
                });
                setlastmonthBirthday(displayDates);
            } else {
                setlastmonthBirthday([]);
            }

            //birthdaylastweek
            if (response?.data?.usersLastWeekdob.length != 0) {
                const displayDates = sortedlastweek?.map((item) => {
                    const itemDate = new Date(item.dob);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            dob: "Today",
                            _id: item._id,
                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            dob: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                        };
                    }
                });
                setlastweekBirthday(displayDates);
            } else {
                setlastweekBirthday([]);
            }


            //birthdaythismonth
            if (response?.data?.usersthismonthbod.length != 0) {
                const displayDates = sortedthismonth?.map((item) => {
                    const itemDate = new Date(item.dob);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            dob: "Today",
                            _id: item._id,
                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            dob: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                        };
                    }
                });
                setthismonthBirthday(displayDates);
            } else {
                setthismonthBirthday([]);
            }

            //birthdayoverall
            if (response?.data?.usersallbod.length != 0) {
                const displayDates = sortedoverall?.map((item) => {
                    const itemDate = new Date(item.dob);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            dob: "Today",
                            _id: item._id,
                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            dob: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                        };
                    }
                });
                setoverallBirthday(displayDates);
            } else {
                setoverallBirthday([]);
            }

            //marriage anniversary
            // if (response?.data?.userdateofmarriage.length != 0) {
            //     const domDates = sortedDom?.map((item) => {
            //         const itemdomDate = new Date(item.dom);
            //         const isTodaydom =
            //             itemdomDate.getDate() === currentDate.getDate() &&
            //             itemdomDate.getMonth() === currentDate.getMonth() &&
            //             itemdomDate.getFullYear() === currentDate.getFullYear();
            //         if (isTodaydom) {
            //             return { companyname: item.companyname, dom: "Today" };
            //         } else {
            //             const domdate = itemdomDate.getDate();
            //             const domMonth = itemdomDate.getMonth() + 1;
            //             const domYear = itemdomDate.getFullYear();
            //             return {
            //                 companyname: item.companyname,
            //                 dom: `${domdate}-${domMonth}-${domYear}`,
            //             };
            //         }
            //     });
            //     setNoMarriageAnniversary(false);
            //     setMarriageAnniversary(domDates);
            // } else {
            //     setMarriageAnniversary([]);
            //     setNoMarriageAnniversary(true);
            // }
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const fetchWeddingAnnivesary = async () => {
        try {
            let response = await axios.get(`${SERVICE.POSTERGENERATEGROUP_GETWEDDINGANNIVERSARY}`, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });

            let sortedthisweek = response?.data?.userweddingthisweek.sort(
                (a, b) => new Date(a.dom) - new Date(b.dom)
            );
            let sortedlastmonth = response?.data?.userslastmonthdom.sort(
                (a, b) => new Date(a.doj) - new Date(b.doj)
            );
            let sortedlastweek = response?.data?.usersLastWeekdom.sort(
                (a, b) => new Date(a.dom) - new Date(b.dom)
            );
            let sortedthismonth = response?.data?.usersthismonthdom.sort(
                (a, b) => new Date(a.dom) - new Date(b.dom)
            );
            let sortedoverall = response?.data?.usersalldom.sort(
                (a, b) => new Date(a.dom) - new Date(b.dom)
            );



            //weddingthisweek
            if (response?.data?.userweddingthisweek.length != 0) {
                const displayDates = sortedthisweek?.map((item) => {
                    const itemDate = new Date(item.dom);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            dom: "Today",
                            _id: item._id,
                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            dom: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                        };
                    }
                });
                setthisweekWedding(displayDates);
            } else {
                setthisweekWedding([]);
            }

            //lastmonth
            if (response?.data?.userslastmonthdom?.length != 0) {
                const displayDates = sortedlastmonth?.map((item) => {
                    const itemDate = new Date(item.dom);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            dom: "Today",
                            _id: item._id,
                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            dom: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                        };
                    }
                });
                setlastmonthwedding(displayDates);
            } else {
                setlastmonthwedding([]);
            }

            //lastweek
            if (response?.data?.usersLastWeekdom.length != 0) {
                const displayDates = sortedlastweek?.map((item) => {
                    const itemDate = new Date(item.dom);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            dom: "Today",
                            _id: item._id,
                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            dom: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                        };
                    }
                });
                setlastweekWedding(displayDates);
            } else {
                setlastweekWedding([]);
            }


            //thismonth
            if (response?.data?.usersthismonthdom.length != 0) {
                const displayDates = sortedthismonth?.map((item) => {
                    const itemDate = new Date(item.dom);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            dom: "Today",
                            _id: item._id,
                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            dom: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                        };
                    }
                });
                setthismonthwedding(displayDates);
            } else {
                setthismonthwedding([]);
            }

            //overall
            if (response?.data?.usersalldom.length != 0) {
                const displayDates = sortedoverall?.map((item) => {
                    const itemDate = new Date(item.dom);
                    const isToday =
                        itemDate.getDate() === currentDate.getDate() &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear();
                    if (isToday) {
                        return {
                            companyname: item.companyname,
                            dom: "Today",
                            _id: item._id,
                        };
                    } else {
                        const birthdate = itemDate.getDate();
                        const birthMonth = itemDate.getMonth() + 1;
                        const birthYear = itemDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            dom: `${birthdate}-${birthMonth}-${birthYear}`,
                            _id: item._id,
                        };
                    }
                });
                setoverallWedding(displayDates);
            } else {
                setoverallWedding([]);
            }


        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const [employeeOptiondob, setEmployeeOptiondob] = useState([])


    //Fetching Employee
    const fetchEmployee = async (team) => {
        let teamsnew = team.map((item) => item.value);
        try {
            let res_employee = await axios.get(SERVICE.USER_POSTERGENERATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const uniqueId = uuidv4();


            let arr = res_employee?.data?.users
                .filter((t) => team.some((item) => item.value === t.team))
                .map((t) => ({
                    _id: t._id,
                    label: t.companyname,
                    value: t.companyname,
                    groupId: uniqueId
                }));


            setEmployeeOption(arr)
            setEmployeeOptiondob(arr)

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
        fetchBirthday();
        fetchWeddingAnnivesary();
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



    const handlePreviewClick = () => {
        const allTemplates = menuItems?.filter(item => item?.title === "All-Template-Cards")?.find(item => item?.submenu)
            ?.submenu?.filter(item => item?.title === posterGenerate.themename
            );
        let employees = employeeValueAdd?.map(data => data);

        const employeesPerThreePersonTemplate = 3;
        const employeesPerTwoPersonTemplate = 2;
        const employeeCount = employeeValueAdd?.length;

        const template = allTemplates?.[0]?.url; // Single route from templates

        const getWishes = wishingMessage.filter((item) =>
            item?.categoryname === posterGenerate?.categoryname &&
            item?.subcategoryname === posterGenerate?.subcategoryname
        )[0]?.wishingmessage;

        if (posterGenerate.categoryname === "Please Select Category Template Name") {
            setPopupContentMalert("Please Select Category Template Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            posterGenerate.subcategoryname ===
            "Please Select Sub-category Template Name"
        ) {
            setPopupContentMalert("Please Select Sub-category Template Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (companyValueAdd?.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (branchValueAdd?.length === 0) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (unitValueAdd?.length === 0) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (teamValueAdd?.length === 0) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (posterGenerate?.days === "Please Select Days") {
            setPopupContentMalert("Please Select Days");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (posterGenerate?.days === "Custom Fields" && posterGenerate.fromdate === "") {
            setPopupContentMalert("Please Select From Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (employeeValueAdd?.length === 0) {
            setPopupContentMalert("Please Select Employee!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        // else if (
        //     posterGenerate.themename ===
        //     "Please Select Theme Name"
        // ) {
        //     setPopupContentMalert("Please Select Theme Name!");
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }
        else if (posterGenerate.categoryname?.toLowerCase()?.includes("birthday") || posterGenerate.subcategoryname?.toLowerCase()?.includes("birthday")  ) {
            if (employeeCount > 0) {
                let remainingEmployees = employeeCount;
                const numberOfThreePersonTemplates = Math.floor(remainingEmployees / employeesPerThreePersonTemplate);

                // Handling 3-person templates
                for (let i = 0; i < numberOfThreePersonTemplates; i++) {
                    const threePersonGroup = employeeValueAdd.slice(i * 3, (i + 1) * 3);

                    setTimeout(() => {
                        const randomWish = getWishes[Math.floor(Math.random() * getWishes?.length)];
                        let combinedEmployeeData = '';

                        threePersonGroup.forEach((employee, index) => {
                            if (index > 0) combinedEmployeeData += '_';  // Add a separator between employee details
                            combinedEmployeeData += `${employee?.value}-${employee?._id}`;
                        });

                        const url = `/birthdaycardtwo3nos/?combinedData=${combinedEmployeeData}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}`;
                        window.open(url, '_blank');
                    }, i * 500);
                }

                // Handle remaining employees after 3-person templates
                remainingEmployees = employeeCount % 3;  // This gives us the number of remaining employees after the 3-person groups
                const startIdx = numberOfThreePersonTemplates * 3;
                const remainingEmployeeSlice = employeeValueAdd.slice(startIdx);

                // Handle 2-person template
                if (remainingEmployees === 2) {
                    const twoPersonGroup = remainingEmployeeSlice.slice(0, 2);  // Select remaining 2 employees

                    setTimeout(() => {
                        const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];
                        let combinedEmployeeData = '';

                        twoPersonGroup.forEach((employee, index) => {
                            if (index > 0) combinedEmployeeData += '_';
                            combinedEmployeeData += `${employee?.value}-${employee?._id}`;
                        });

                        const url = `/birthdaycardtwo2nos/?combinedData=${combinedEmployeeData}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}`;
                        window.open(url, '_blank');
                    }, 500);  // Delay of 500ms for opening the tab
                }

                // Handle 1-person template
                if (remainingEmployees === 1) {
                    const onePersonGroup = remainingEmployeeSlice.slice(0, 1);  // Select the remaining single employee

                    setTimeout(() => {
                        const randomWish = getWishes[Math.floor(Math.random() * getWishes?.length)];
                        const employee = onePersonGroup[0];

                        const url = `/birthdaycardtwo/?name=${employee?.value}&id=${employee?._id}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}`;
                        window.open(url, '_blank');
                    }, 500);
                }
            } else {
                // No employees to process
                console.log("No employees to process.");
            }
        } else if (posterGenerate.categoryname?.toLowerCase()?.includes("wedding") || posterGenerate.subcategoryname?.toLowerCase()?.includes("wedding")) {
            if (employeeCount > 0) {
                let remainingEmployees = employeeCount;
                const numberOfThreePersonTemplates = Math.floor(remainingEmployees / employeesPerThreePersonTemplate);

                // Handling 3-person templates
                for (let i = 0; i < numberOfThreePersonTemplates; i++) {
                    const threePersonGroup = employeeValueAdd.slice(i * 3, (i + 1) * 3);

                    setTimeout(() => {
                        const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];
                        let combinedEmployeeData = '';

                        threePersonGroup.forEach((employee, index) => {
                            if (index > 0) combinedEmployeeData += '_';  // Add a separator between employee details
                            combinedEmployeeData += `${employee?.value}-${employee?._id}`;
                        });

                        const url = `/weddingcard3nos/?combinedData=${combinedEmployeeData}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}`;
                        window.open(url, '_blank');
                    }, i * 500);
                }

                // Handle remaining employees after 3-person templates
                remainingEmployees = employeeCount % 3;  // This gives us the number of remaining employees after the 3-person groups
                const startIdx = numberOfThreePersonTemplates * 3;
                const remainingEmployeeSlice = employeeValueAdd.slice(startIdx);

                // Handle 2-person template
                if (remainingEmployees === 2) {
                    const twoPersonGroup = remainingEmployeeSlice.slice(0, 2);  // Select remaining 2 employees

                    setTimeout(() => {
                        const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];
                        let combinedEmployeeData = '';

                        twoPersonGroup.forEach((employee, index) => {
                            if (index > 0) combinedEmployeeData += '_';
                            combinedEmployeeData += `${employee?.value}-${employee?._id}`;
                        });

                        const url = `/weddingcard2nos/?combinedData=${combinedEmployeeData}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}`;
                        window.open(url, '_blank');
                    }, 500);  // Delay of 500ms for opening the tab
                }

                // Handle 1-person template
                if (remainingEmployees === 1) {
                    const onePersonGroup = remainingEmployeeSlice.slice(0, 1);  // Select the remaining single employee

                    setTimeout(() => {
                        const randomWish = getWishes[Math.floor(Math.random() * getWishes?.length)];
                        const employee = onePersonGroup[0];

                        const url = `/weddingcard/?name=${employee?.value}&id=${employee?._id}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}`;
                        window.open(url, '_blank');
                    }, 500);
                }
            } else {
                // No employees to process
                console.log("No employees to process.");
            }
        }

    };

    const handleDownloadClick = (row) => {
        const allTemplates = menuItems?.filter(item => item?.title === "All-Template-Cards")?.find(item => item?.submenu)
            ?.submenu?.filter(item => item?.title === row?.themename
            );
        let employeename = row?.posterdownload;
        let employeenamesingle = row?.employeename;
        let employeenamesingleid = row?.id;
        let employeedbid = row?.employeedbid;
        // const template = allTemplates?.[0]?.url;
        const templatesubcat = row?.subcategoryname
        const templatecat = row?.categoryname
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

                        const url = `${templatecat?.toLowerCase()?.includes("birthday") || templatesubcat?.toLowerCase()?.includes("birthday")  ? "/birthdaycardtwo3nos" : "/weddingcard3nos"}/?combinedData=${combinedEmployeeData}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}&status=${true}`;

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

                        const url = `${templatecat?.toLowerCase()?.includes("birthday") || templatesubcat?.toLowerCase()?.includes("birthday")  ? "/birthdaycardtwo2nos" : "/weddingcard2nos"}/?combinedData=${combinedEmployeeData}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}&status=${true}`;

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

            const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];

            // const template = allTemplates?.[0]?.url;
            const url = `${templatecat?.toLowerCase()?.includes("birthday") || templatesubcat?.toLowerCase()?.includes("birthday")  ? "/birthdaycardtwo" : "/weddingcard"}/?name=${employeenamesingle}&id=${employeename[0]?._id}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}&status=${true}`;

            // const url = `${template}/?name=${employeename}&id=${employeedbid}&status=${true}`;
            window.open(url, '_blank');

        }
        else {

            const randomWish = getWishes[Math.floor(Math.random() * getWishes.length)];

            // const template = allTemplates?.[0]?.url;
            const url = `${templatecat?.toLowerCase()?.includes("birthday") || templatesubcat?.toLowerCase()?.includes("birthday")  ? "/birthdaycardtwo" : "/weddingcard"}/?name=${employeenamesingle}&id=${employeename[0]?._id}&wish=${encodeURIComponent(randomWish)}&footer=${footerMessage}&status=${true}`;

            // const url = `${template}/?name=${employeenamesingle}&id=${employeedbid}&status=${true}`;
            window.open(url, '_blank');
        }

        setPosterGenerate({
            categoryname: "Please Select Category Template Name",
            subcategoryname: "Please Select Sub-category Template Name",
            themename: "Please Select Theme Name",
            days: "Please Select Days",
            todate: "",
            fromdate: ""
        });

    };



    const [fileFormat, setFormat] = useState("");
    const [posterGroup, setPosterGroup] = useState("");

    const daysoptions = [
        { label: "Yesterday", value: "Yesterday" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Today", value: "Today" },
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "Custom Fields", value: "Custom Fields" },
    ]

    return (
        <Box>
            <Headtitle title={"Poster Generate"} />
            <PageHeading
                title="Poster Generate"
                modulename="Poster"
                submodulename="Poster Generate"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            {/* ****** Header Content ****** */}
            {/* <Typography sx={userStyle.HeaderText}>Poster Generate</Typography> */}

            <>
                {isUserRoleCompare?.includes("apostergenerate") && (
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Add Poster Generate
                                    </Typography>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Poster Category Template Name<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={categoryOption}
                                            styles={colourStyles}
                                            value={{
                                                label: posterGenerate.categoryname,
                                                value: posterGenerate.categoryname,
                                            }}
                                            onChange={(e) => {
                                                setPosterGenerate({
                                                    ...posterGenerate,
                                                    categoryname: e.value,
                                                    subcategoryname:
                                                        "Please Select Sub-category Template Name",
                                                    themename: "Please Select Theme Name",
                                                    days: "Please Select Days",

                                                });
                                                fetchSubcategoryBased(e);
                                                setThemeNames([])
                                                // setEmployeeOption([]);
                                                setEmployeeValueAdd([]);

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Poster Sub-category Template Name<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={subcategoryOpt}
                                            styles={colourStyles}
                                            value={{
                                                label: posterGenerate.subcategoryname,
                                                value: posterGenerate.subcategoryname,
                                            }}
                                            onChange={(e) => {
                                                setPosterGenerate({
                                                    ...posterGenerate,
                                                    subcategoryname: e.value,
                                                    themename: "Please Select Theme Name",

                                                });
                                                // fetchThemeBased(e)
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={4} md={4} sm={3} xs={3}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontWeight: "500" }}>
                                            Company <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect size="small"
                                            options={companyOption}
                                            value={companyValueAdd}
                                            valueRenderer={customValueRendererCompanyAdd}
                                            onChange={handleCompanyChangeAdd}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={4} md={4} sm={3} xs={3}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontWeight: "500" }}>
                                            Branch <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect size="small"
                                            options={branchOption}
                                            value={branchValueAdd}
                                            valueRenderer={customValueRendererBranchAdd}
                                            onChange={handleBranchChangeAdd}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={4} md={4} sm={3} xs={3}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontWeight: "500" }}>
                                            Unit <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect size="small"
                                            options={unitOption}
                                            value={unitValueAdd}
                                            valueRenderer={customValueRendererUnitAdd}
                                            onChange={handleUnitChangeAdd}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={4} md={4} sm={3} xs={3}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontWeight: "500" }}>
                                            Team <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect size="small"
                                            options={teamOption}
                                            value={teamValueAdd}
                                            valueRenderer={customValueRendererTeamAdd}
                                            onChange={handleTeamChangeAdd}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={4} md={4} sm={3} xs={3}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontWeight: "500" }}>
                                            Days <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={daysoptions}
                                            styles={colourStyles}
                                            value={{
                                                label: posterGenerate.days,
                                                value: posterGenerate.days,
                                            }}
                                            onChange={(e) => {
                                                setPosterGenerate({
                                                    ...posterGenerate,
                                                    days: e.value,
                                                    fromdate: "",
                                                    todate: ""
                                                });
                                                if (posterGenerate.categoryname?.toLowerCase()?.includes("birthday") || posterGenerate.subcategoryname?.toLowerCase()?.includes("birthday")) {
                                                    if (employeeOption?.length > 0 && e?.value === "Yesterday") {
                                                        const yesterday = moment().subtract(1, 'days').format('MM-DD');  // Get yesterday's date in MM-DD format
                                                        const empOpt = employeeOption?.filter((item) =>
                                                            thisweekBirthday?.some((val) => {
                                                                // Ensure `val.dob` is properly parsed (assuming it's in DD-MM-YYYY format)
                                                                const formattedDOB = moment(val?.dob, ['DD-MM-YYYY', 'YYYY-MM-DD', 'MM-DD-YYYY']).isValid()
                                                                    ? moment(val?.dob, ['DD-MM-YYYY', 'YYYY-MM-DD', 'MM-DD-YYYY']).format('MM-DD')
                                                                    : 'Invalid date';

                                                                return item?._id === val?._id && formattedDOB === yesterday;
                                                            })
                                                        );

                                                        setEmployeeOptionDaysWise(empOpt)
                                                    }
                                                    else if (employeeOption?.length > 0 && e?.value === "Last Week") {
                                                        const empOpt = employeeOption?.filter((item) =>
                                                            lastweekBirthday?.some((val) => item?._id === val?._id)
                                                        );
                                                        setEmployeeOptionDaysWise(empOpt)
                                                    }
                                                    else if (employeeOption?.length > 0 && e?.value === "Last Month") {
                                                        const empOpt = employeeOption?.filter((item) =>
                                                            lastmonthBirthday?.some((val) => item?._id === val?._id)
                                                        );
                                                        setEmployeeOptionDaysWise(empOpt)
                                                    }
                                                    else if (employeeOption?.length > 0 && e?.value === "Today") {
                                                        const empOpt = employeeOption?.filter((item) => thisweekBirthday?.some((val) => item?._id === val?._id && val?.dob === "Today"))
                                                        setEmployeeOptionDaysWise(empOpt)
                                                    }
                                                    else if (employeeOption?.length > 0 && e?.value === "This Week") {
                                                        const empOpt = employeeOption?.filter((item) => thisweekBirthday?.some((val) => item?._id === val?._id))
                                                        setEmployeeOptionDaysWise(empOpt)
                                                    }
                                                    else if (employeeOption?.length > 0 && e?.value === "This Month") {
                                                        const empOpt = employeeOption?.filter((item) => thismonthBirthday?.some((val) => item?._id === val?._id))
                                                        setEmployeeOptionDaysWise(empOpt)
                                                    }
                                                    
                                                } else if (posterGenerate.categoryname?.toLowerCase()?.includes("wedding") || posterGenerate.subcategoryname?.toLowerCase()?.includes("wedding")) {
                                                    if (employeeOption?.length > 0 && e?.value === "Yesterday") {
                                                        const yesterday = moment().subtract(1, 'days').format('MM-DD');  // Get yesterday's date in MM-DD format
                                                        const empOpt = employeeOption?.filter((item) =>
                                                            thisweekWedding?.some((val) => {
                                                                // Ensure `val.dob` is properly parsed (assuming it's in DD-MM-YYYY format)
                                                                const formattedDOB = moment(val?.dom, ['DD-MM-YYYY', 'YYYY-MM-DD', 'MM-DD-YYYY']).isValid()
                                                                    ? moment(val?.dom, ['DD-MM-YYYY', 'YYYY-MM-DD', 'MM-DD-YYYY']).format('MM-DD')
                                                                    : 'Invalid date';

                                                                return item?._id === val?._id && formattedDOB === yesterday;
                                                            })
                                                        );

                                                        setEmployeeOptionDaysWise(empOpt)
                                                    }
                                                    else if (employeeOption?.length > 0 && e?.value === "Last Week") {
                                                        const empOpt = employeeOption?.filter((item) =>
                                                            lastweekWedding?.some((val) => item?._id === val?._id)
                                                        );
                                                        setEmployeeOptionDaysWise(empOpt)
                                                    }
                                                    else if (employeeOption?.length > 0 && e?.value === "Last Month") {
                                                        const empOpt = employeeOption?.filter((item) =>
                                                            lastmonthwedding?.some((val) => item?._id === val?._id)
                                                        );
                                                        setEmployeeOptionDaysWise(empOpt)
                                                    }
                                                    else if (employeeOption?.length > 0 && e?.value === "Today") {
                                                        const empOpt = employeeOption?.filter((item) => thisweekWedding?.some((val) => item?._id === val?._id && val?.dob === "Today"))
                                                        setEmployeeOptionDaysWise(empOpt)
                                                    }
                                                    else if (employeeOption?.length > 0 && e?.value === "This Week") {
                                                        const empOpt = employeeOption?.filter((item) => thisweekWedding?.some((val) => item?._id === val?._id))
                                                        setEmployeeOptionDaysWise(empOpt)
                                                    }
                                                    else if (employeeOption?.length > 0 && e?.value === "This Month") {
                                                        const empOpt = employeeOption?.filter((item) => thismonthwedding?.some((val) => item?._id === val?._id))
                                                        setEmployeeOptionDaysWise(empOpt)
                                                    }
                                                }
                                                setEmployeeValueAdd([])
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {posterGenerate.days === "Custom Fields" &&
                                    <>
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    From Date<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="date"
                                                    value={posterGenerate.fromdate}
                                                    onChange={(e) => {
                                                        const newFromDate = e.target.value;
                                                        setPosterGenerate((prevState) => ({
                                                            ...prevState,
                                                            fromdate: newFromDate,
                                                            // todate: prevState.todate && new Date(prevState.todate) > new Date(newFromDate) ? prevState.todate : ""
                                                            todate: ""
                                                        }));
                                                        if (posterGenerate.categoryname?.toLowerCase()?.includes("birthday")) {

                                                            const empOpt = overallBirthday?.filter((item) => {
                                                                const itemDob = moment(item?.dob, 'D-M-YYYY', true);
                                                                const fromDate = moment(newFromDate, 'YYYY-MM-DD', true);
                                                                return itemDob.isValid() && itemDob.isSameOrAfter(fromDate);
                                                            });
                                                            const uniqueId = uuidv4();

                                                            setEmployeeOptionDaysWise(empOpt?.map((item) => ({
                                                                label: item?.companyname,
                                                                value: item?.companyname,
                                                                _id: item?._id,
                                                                groupId: uniqueId
                                                            })))
                                                        } else if (posterGenerate.categoryname?.toLowerCase()?.includes("wedding")) {
                                                            const empOpt = overallWedding?.filter((item) => {
                                                                const itemDob = moment(item?.dom, 'D-M-YYYY', true);
                                                                const fromDate = moment(newFromDate, 'YYYY-MM-DD', true);
                                                                return itemDob.isValid() && itemDob.isSameOrAfter(fromDate);
                                                            });
                                                            const uniqueId = uuidv4();

                                                            setEmployeeOptionDaysWise(empOpt?.map((item) => ({
                                                                label: item?.companyname,
                                                                value: item?.companyname,
                                                                _id: item?._id,
                                                                groupId: uniqueId
                                                            })))

                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    To Date
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="date"
                                                    value={posterGenerate.todate}
                                                    onChange={(e) => {
                                                        const selectedToDate = new Date(e.target.value);
                                                        const selectedFromDate = new Date(posterGenerate.fromdate);
                                                        const formattedDatePresent = new Date() // Assuming you have a function to format the current date
                                                        if (selectedToDate >= selectedFromDate && selectedToDate >= new Date(selectedFromDate)) {
                                                            setPosterGenerate({
                                                                ...posterGenerate,
                                                                todate: e.target.value
                                                            });

                                                            if (posterGenerate.categoryname?.toLowerCase()?.includes("birthday")) {

                                                                const empOpt = overallBirthday?.filter((item) => {
                                                                    const itemDob = moment(item?.dob, 'D-M-YYYY', true);
                                                                    const fromDate = moment(posterGenerate.fromdate, 'YYYY-MM-DD', true);
                                                                    const toDate = moment(e.target.value, 'YYYY-MM-DD', true);
                                                                    return itemDob.isValid() && itemDob.isBetween(fromDate, toDate, null, '[]');
                                                                });

                                                                const uniqueId = uuidv4();

                                                                setEmployeeOptionDaysWise(empOpt?.map((item) => ({
                                                                    label: item?.companyname,
                                                                    value: item?.companyname,
                                                                    _id: item?._id,
                                                                    groupId: uniqueId
                                                                })))

                                                            } else if (posterGenerate.categoryname?.toLowerCase()?.includes("wedding")) {
                                                                const empOpt = overallWedding?.filter((item) => {
                                                                    const itemDob = moment(item?.dom, 'D-M-YYYY', true);
                                                                    const fromDate = moment(posterGenerate.fromdate, 'YYYY-MM-DD', true);
                                                                    const toDate = moment(e.target.value, 'YYYY-MM-DD', true);
                                                                    return itemDob.isValid() && itemDob.isBetween(fromDate, toDate, null, '[]');
                                                                });

                                                                const uniqueId = uuidv4();

                                                                setEmployeeOptionDaysWise(empOpt?.map((item) => ({
                                                                    label: item?.companyname,
                                                                    value: item?.companyname,
                                                                    _id: item?._id,
                                                                    groupId: uniqueId
                                                                })))


                                                            }
                                                        } else {
                                                            setPosterGenerate({
                                                                ...posterGenerate,
                                                                todate: "" // Reset to empty string if the condition fails
                                                            });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>}
                                <Grid item lg={4} md={4} sm={3} xs={3}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontWeight: "500" }}>
                                            Employee Name <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect size="small"
                                            options={employeeOptionDaysWise}
                                            value={employeeValueAdd}
                                            valueRenderer={customValueRendererEmployeeAdd}
                                            onChange={handleEmployeeChangeAdd}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />

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
                                    <Button variant="contained"
                                        onClick={handlePreviewClick}>
                                        Preview
                                    </Button>
                                    <LoadingButton
                                        onClick={handleSubmit}
                                        loading={loadingdeloverall}
                                        color="primary"
                                        loadingPosition="end"
                                        variant="contained"
                                    >
                                        Generate
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

            <br />
            <br />


            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lpostergenerate") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                List Poster Generate
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
                        {isUserRoleCompare?.includes("bdpostergenerate") && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleClickOpenalert}
                            >
                                Bulk Delete
                            </Button>
                        )}
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
            <br />
            <br />
            {/* {isUserRoleCompare?.includes("lpostergenerate") && ( */}
            <PosterGenerateGroupList childGroupAll={childGroupAll} statusCheckchild={statusCheckchild}
                onAction={
                    () => {
                        fetchHolidayAllGroup()
                        fetchHolidayAll()
                    }
                }
            />
            {/* )} */}
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
                                    <Typography sx={{wordWrap: 'break-word', overflow: "break-word"}}>{posterGenerateEdit.team?.toString()}</Typography>
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
                                                // fetchThemeBased(e)
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
                itemsTwo={posterGenerates ?? []}
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
export default PosterGenerate;