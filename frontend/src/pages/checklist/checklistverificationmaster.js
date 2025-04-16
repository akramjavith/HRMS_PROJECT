import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../pageStyle";
import StyledDataGrid from "../../components/TableStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import { handleApiError } from "../../components/Errorhandling";
import jsPDF from "jspdf";
import "jspdf-autotable";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import { LoadingButton } from "@mui/lab";
import PageHeading from "../../components/PageHeading";

function CheckListVerificationMaster() {

    const [checklistverification, setChecklistverification] = useState({
        categoryname: "Please Select Category",
        subcategoryname: "Please Select Subcategory",
        checklisttype: "Please Select Checklist Type",
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
        employee: "Please Select Responsible Person",
    })

    const [checklistverificationEdit, setChecklistverificationEdit] = useState({
        categoryname: "Please Select Category",
        subcategoryname: "Please Select Subcategory",
        checklisttype: "Please Select Checklist Type",
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
        employee: "Please Select Responsible Person",
    });

    const [isBtn, setIsBtn] = useState(false);
    const [checklistverificationmasters, setChecklistverificationmasters] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allChecklistverificationEdit, setAllChecklistverificationEdit] = useState([]);
    const [checklistverificationCheck, setChecklistverificationCheck] = useState(false);
    const [isClearOpenalert, setClearOpenalert] = useState(false);
    const [isAddOpenalert, setAddOpenalert] = useState(false);
    const [isDeletealert, setDeletealert] = useState(false);
    const [isBulkDelOpenalert, setBulkDelOpenalert] = useState(false);
    const [isUpdateOpenalert, setUpdateOpenalert] = useState(false);
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allTeam, allUsersData, pageName, setPageName } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState("");
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Assign Checklist.png");
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

    // view model
    const [openview, setOpenview] = useState(false);

    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
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

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };

    const [categorys, setCategorys] = useState([]);
    const [subcategorys, setSubcategorys] = useState([]);
    const [checklisttypesOpt, setChecklisttypesOpt] = useState([]);
    const [categorysEdit, setCategorysEdit] = useState([]);
    const [subcategorysEdit, setSubcategorysEdit] = useState([]);
    const [checklisttypesOptEdit, setChecklisttypesOptEdit] = useState([]);

    // This is create multi select
    // checklistType
    const [selectedOptionsChecklisttype, setSelectedOptionsChecklisttype] = useState([]);
    let [valueChecklisttype, setValueChecklisttype] = useState("");

    const handleChecklisttypeChange = (options) => {
        setValueChecklisttype(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsChecklisttype(options);
    };

    const customValueRendererChecklisttype = (valueChecklisttype, _checklisttypes) => {
        return valueChecklisttype.length
            ? valueChecklisttype.map(({ label }) => label).join(", ")
            : "Please Select Checklist Type";
    };


    // company
    const [selectedOptionsCom, setSelectedOptionsCom] = useState([]);
    let [valueComp, setValueComp] = useState("");

    const handleCompanyChange = (options) => {
        setValueComp(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCom(options);

    };

    const customValueRendererCom = (valueComp, _companys) => {
        return valueComp.length
            ? valueComp.map(({ label }) => label).join(", ")
            : "Please Select Company";
    };

    // branch
    const [selectedOptionsBran, setSelectedOptionsBran] = useState([]);
    let [valueBran, setValueBran] = useState("");

    const handleBranchChange = (options) => {
        setValueBran(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBran(options);
    };

    const customValueRendererBran = (valueBran, _branchs) => {
        return valueBran.length
            ? valueBran.map(({ label }) => label).join(", ")
            : "Please Select Branch";
    };


    // unit
    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
    let [valueUnit, setValueUnit] = useState("");

    const handleUnitChange = (options) => {
        setValueUnit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnit(options);
    };

    const customValueRendererUnit = (valueUnit, _units) => {
        return valueUnit.length
            ? valueUnit.map(({ label }) => label).join(", ")
            : "Please Select Unit";
    };


    // team
    const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
    let [valueTeam, setValueTeam] = useState("");

    const handleTeamChange = (options) => {
        setValueTeam(
            options.map((a, index) => {
                return a.value;
            })
        );
        let ans = options.map((a, index) => {
            return a.value;
        })
        setSelectedOptionsTeam(options);
    };

    const customValueRendererTeam = (valueTeam, _teams) => {
        return valueTeam.length
            ? valueTeam.map(({ label }) => label).join(", ")
            : "Please Select Team";
    };

    // Employee
    const [selectedOptionsEmp, setSelectedOptionsEmp] = useState([]);
    let [valueEmp, setValueEmp] = useState("");

    const handleEmployeeChange = (options) => {
        setValueEmp(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsEmp(options);

    };

    const customValueRendererEmp = (valueEmp, _employees) => {
        return valueEmp.length
            ? valueEmp.map(({ label }) => label).join(", ")
            : "Please Select Responsible Person";
    };


    // Edit details
    // checklistType
    const [selectedOptionsChecklisttypeEdit, setSelectedOptionsChecklisttypeEdit] = useState([]);

    const handleChecklisttypeChangeEdit = (options) => {
        setSelectedOptionsChecklisttypeEdit(options);
    };

    const customValueRendererChecklisttypeEdit = (valueChecklisttypeEdit, _checklisttypes) => {
        return valueChecklisttypeEdit.length
            ? valueChecklisttypeEdit.map(({ label }) => label).join(", ")
            : "Please Select Checklist Type";
    };


    // company
    const [selectedOptionsComEdit, setSelectedOptionsComEdit] = useState([]);
    const handleCompanyChangeEdit = (options) => {
        setSelectedOptionsComEdit(options);
    };

    const customValueRendererComEdit = (valueCompEdit, _companys) => {
        return valueCompEdit.length
            ? valueCompEdit.map(({ label }) => label).join(", ")
            : "Please Select Company";
    };

    // branch
    const [selectedOptionsBranEdit, setSelectedOptionsBranEdit] = useState([]);
    let [valueBranEdit, setValueBranEdit] = useState("");

    const handleBranchChangeEdit = (options) => {
        setValueBranEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranEdit(options);
    };

    const customValueRendererBranEdit = (valueBranEdit, _branchs) => {
        return valueBranEdit.length
            ? valueBranEdit.map(({ label }) => label).join(", ")
            : "Please Select Branch";
    };

    // unit
    const [selectedOptionsUnitEdit, setSelectedOptionsUnitEdit] = useState([]);
    let [valueUnitEdit, setValueUnitEdit] = useState("");

    const handleUnitChangeEdit = (options) => {
        setValueUnitEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        const ans = options.map((a, index) => {
            return a.value;
        })
        setSelectedOptionsUnitEdit(options);
    };

    const customValueRendererUnitEdit = (valueUnitEdit, _units) => {
        return valueUnitEdit.length
            ? valueUnitEdit.map(({ label }) => label).join(", ")
            : "Please Select Unit";
    };

    // Team
    const [selectedOptionsTeamEdit, setSelectedOptionsTeamEdit] = useState([]);

    const handleTeamChangeEdit = (options) => {
        const ans = options.map((a, index) => {
            return a.value;
        })
        setSelectedOptionsTeamEdit(options);
    };

    const customValueRendererTeamEdit = (valueTeamEdit, _teams) => {
        return valueTeamEdit.length
            ? valueTeamEdit.map(({ label }) => label).join(", ")
            : "Please Select Team";
    };

    // Employee
    const [selectedOptionsEmpEdit, setSelectedOptionsEmpEdit] = useState([]);
    const handleEmployeeChangeEdit = (options) => {
        setSelectedOptionsEmpEdit(options);

    };

    const customValueRendererEmpEdit = (valueEmpEdit, _employees) => {
        return valueEmpEdit.length
            ? valueEmpEdit.map(({ label }) => label).join(", ")
            : "Please Select Responsible Person";
    };

    // dropdown values showing data
    const fetchCategroyDropdowns = async () => {
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
            setCategorysEdit(categoryall);
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
            setSubcategorys(category);

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

            setSubcategorysEdit(category);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    const fetchChecklisttypeDropdowns = async (e) => {
        setPageName(!pageName)
        try {
            let res_category = await axios.get(SERVICE.CHECKLISTTYPE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });


            let result = res_category.data.checklisttypes.filter((d) => d.category === checklistverification.categoryname && d.subcategory === e.value);
            const uniqueChecklists = new Set(result.map(d => d.details));
            const all = Array.from(uniqueChecklists).map(details => ({
                label: details,
                value: details
            }));

            setChecklisttypesOpt(all);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchChecklisttypeDropdownsEdit = async (category, subcategory) => {
        setPageName(!pageName)
        try {
            let res_category = await axios.get(SERVICE.CHECKLISTTYPE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res_category.data.checklisttypes.filter((d) => d.category === category && d.subcategory === subcategory);

            const uniqueChecklists = new Set(result.map(d => d.details));

            const all = Array.from(uniqueChecklists).map(details => ({
                label: details,
                value: details
            }));

            setChecklisttypesOptEdit(all);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    useEffect(() => {
        fetchCategroyDropdowns();
    }, []);

    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

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

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        categoryname: true,
        subcategoryname: true,
        checklisttype: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        employee: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const [deleteGroup, setDeletegroup] = useState("");

    const rowData = async (id, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.CHECKLISTVERIFICATIONMASTER_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeletegroup(res?.data?.schecklistverificationmaster);
            handleClickOpen();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // Alert delete popup
    let groupEditt = deleteGroup._id;
    const deleGroup = async () => {
        setPageName(!pageName)
        try {
            await axios.delete(`${SERVICE.CHECKLISTVERIFICATIONMASTER_SINGLE}/${groupEditt}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchChecklistverification();
            handleCloseMod();
            setPage(1);
            setDeletealert(true);
            setTimeout(() => {
                setDeletealert(false);
            }, 1000)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const delGroupcheckbox = async () => {
        setPageName(!pageName)
        try {

            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.CHECKLISTVERIFICATIONMASTER_SINGLE}/${item}`, {
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

            await fetchChecklistverification();
            setBulkDelOpenalert(true);
            setTimeout(() => {
                setBulkDelOpenalert(false);
            }, 1000)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //add function
    const sendRequest = async () => {
        setIsBtn(true)
        setPageName(!pageName)
        try {
            let grpcreate = await axios.post(SERVICE.CHECKLISTVERIFICATIONMASTER_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                categoryname: String(checklistverification.categoryname),
                subcategoryname: String(checklistverification.subcategoryname),
                checklisttype: [...valueChecklisttype],
                company: [...valueComp],
                branch: [...valueBran],
                unit: [...valueUnit],
                team: [...valueTeam],
                employee: [...valueEmp],

                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setChecklistverification(grpcreate.data);
            await fetchChecklistverification();
            setChecklistverification({
                ...checklistverification,
            });
            setAddOpenalert(true);
            setTimeout(() => {
                setAddOpenalert(false);
            }, 1000)
            setIsBtn(false)
            setBtnSubmit(false);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const [btnSubmit, setBtnSubmit] = useState(false);
    //submit option for saving
    const handleSubmit = (e) => {
        setBtnSubmit(true);
        let companys = selectedOptionsCom.map((item) => item.value);
        let branchs = selectedOptionsBran.map((item) => item.value);
        let units = selectedOptionsUnit.map((item) => item.value);
        let teams = selectedOptionsTeam.map((item) => item.value);
        let employees = selectedOptionsEmp.map((item) => item.value);
        let checklisttypes = selectedOptionsChecklisttype.map((item) => item.value);
        e.preventDefault();
        const isNameMatch = checklistverificationmasters.some((item) =>
            item.categoryname === checklistverification.categoryname
            && item.subcategoryname === checklistverification.subcategoryname
            && item.checklisttype.some((data) => checklisttypes.includes(data))
            && item.company.some((data) => companys.includes(data))
            && item.branch.some((data) => branchs.includes(data))
            && item.unit.some((data) => units.includes(data))
            && item.team.some((data) => teams.includes(data))
            && item.employee.some((data) => employees.includes(data))


        );
        if (checklistverification.categoryname === "Please Select Category") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Category"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (checklistverification.subcategoryname === "Please Select Subcategory") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Subcategory"}</p>
                </>
            );
            handleClickOpenerr();
        }

        else if (selectedOptionsChecklisttype.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Checklist Type"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else if (selectedOptionsCom.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Company"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedOptionsBran.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Branch"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedOptionsUnit.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Unit"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedOptionsTeam.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Team"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedOptionsEmp.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Responsible Person"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Data already exits!"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            sendRequest();
        }
    };

    const handleClear = () => {
        setChecklistverification({
            categoryname: "Please Select Category",
            subcategoryname: "Please Select Subcategory",
            checklisttype: "Please Select Checklist Type",
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            team: "Please Select Team",
            employee: "Please Select Responsible Person",
        });
        setValueComp([]);
        setValueBran([]);
        setValueUnit([]);
        setValueTeam([]);
        setValueEmp([]);
        setValueChecklisttype([]);
        setSelectedOptionsCom([]);
        setSelectedOptionsBran([]);
        setSelectedOptionsUnit([]);
        setSelectedOptionsTeam([]);
        setSelectedOptionsEmp([]);
        setSelectedOptionsChecklisttype([]);
        setChecklisttypesOpt([]);
        setSubcategorys([]);
        setClearOpenalert(true);
        setTimeout(() => {
            setClearOpenalert(false);
        }, 1000)
    };

    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
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
            let res = await axios.get(`${SERVICE.CHECKLISTVERIFICATIONMASTER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            handleClickOpenEdit();
            setChecklistverificationEdit(res?.data?.schecklistverificationmaster)
            fetchSubcategoryEdit({ label: res?.data?.schecklistverificationmaster?.categoryname, value: res?.data?.schecklistverificationmaster?.categoryname })
            setSelectedOptionsChecklisttypeEdit(
                res?.data?.schecklistverificationmaster.checklisttype.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            setSelectedOptionsComEdit(
                res?.data?.schecklistverificationmaster.company.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            setSelectedOptionsBranEdit(
                res?.data?.schecklistverificationmaster.branch.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            setSelectedOptionsUnitEdit(
                res?.data?.schecklistverificationmaster.unit.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            setSelectedOptionsTeamEdit(
                res?.data?.schecklistverificationmaster.team.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            setSelectedOptionsEmpEdit(
                res?.data?.schecklistverificationmaster.employee.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            setValueBranEdit(res?.data?.schecklistverificationmaster.branch)
            setValueUnitEdit(res?.data?.schecklistverificationmaster.unit)
            fetchChecklisttypeDropdownsEdit(res?.data?.schecklistverificationmaster.categoryname, res?.data?.schecklistverificationmaster.subcategoryname)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.CHECKLISTVERIFICATIONMASTER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setChecklistverificationEdit(res?.data?.schecklistverificationmaster);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.CHECKLISTVERIFICATIONMASTER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setChecklistverificationEdit(res?.data?.schecklistverificationmaster);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    //Project updateby edit page...
    let updateby = checklistverificationEdit.updatedby;
    let addedby = checklistverificationEdit.addedby;

    let projectsid = checklistverificationEdit._id;

    //editing the single data...
    const sendEditRequest = async () => {
        let empComp = selectedOptionsComEdit.map((item) => item.value);
        let empBran = selectedOptionsBranEdit.map((item) => item.value);
        let empUnit = selectedOptionsUnitEdit.map((item) => item.value);
        let empTeam = selectedOptionsTeamEdit.map((item) => item.value);
        let empEmployee = selectedOptionsEmpEdit.map((item) => item.value);
        let empChecklist = selectedOptionsChecklisttypeEdit.map((item) => item.value);
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.CHECKLISTVERIFICATIONMASTER_SINGLE}/${projectsid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                categoryname: String(checklistverificationEdit.categoryname),
                subcategoryname: String(checklistverificationEdit.subcategoryname),
                checklisttype: [...empChecklist],
                company: [...empComp],
                branch: [...empBran],
                unit: [...empUnit],
                team: [...empTeam],
                employee: [...empEmployee],
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setChecklistverificationEdit(res.data);
            await fetchChecklistverification();
            await fetchChecklistverificationAll();
            handleCloseModEdit();
            setUpdateOpenalert(true);
            setTimeout(() => {
                setUpdateOpenalert(false);
            }, 1000)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const editSubmit = (e) => {
        e.preventDefault();
        fetchChecklistverificationAll();
        let companysEditt = selectedOptionsComEdit.map((item) => item.value);
        let branchsEditt = selectedOptionsBranEdit.map((item) => item.value);
        let unitsEditt = selectedOptionsUnitEdit.map((item) => item.value);
        let teamsEditt = selectedOptionsTeamEdit.map((item) => item.value);
        let employesssEditt = selectedOptionsEmpEdit.map((item) => item.value);
        let checklistEditt = selectedOptionsChecklisttypeEdit.map((item) => item.value);
        const isNameMatch = allChecklistverificationEdit.some((item) =>
            item.categoryname === checklistverificationEdit.categoryname
            && item.subcategoryname === checklistverificationEdit.subcategoryname
            && item.checklisttype.some((data) => checklistEditt.includes(data))
            && item.company.some((data) => companysEditt.includes(data))
            && item.branch.some((data) => branchsEditt.includes(data))
            && item.unit.some((data) => unitsEditt.includes(data))
            && item.team.some((data) => teamsEditt.includes(data))
            && item.employee.some((data) => employesssEditt.includes(data))
        );

        if (checklistverificationEdit.categoryname === "Please Select Category") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Type"}</p>
                </>
            );
            handleClickOpenerr();
        }

        else if (checklistverificationEdit.subcategoryname === "Please Select Subcategory") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Subcategory"}</p>
                </>
            );
            handleClickOpenerr();
        }

        else if (selectedOptionsChecklisttypeEdit.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Checklist Type"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else if (selectedOptionsComEdit.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Company"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedOptionsBranEdit.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Branch"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedOptionsUnitEdit.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Unit"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedOptionsTeamEdit.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Team"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedOptionsEmpEdit.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Responsible Person"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }


        else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Data already exits!"}</p>
                </>
            );
            handleClickOpenerr();
        }

        else {
            sendEditRequest();
        }
    };

    //get all project.
    const fetchChecklistverification = async () => {
        setPageName(!pageName)
        try {
            let res_grp = await axios.get(SERVICE.CHECKLISTVERIFICATIONMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setChecklistverificationCheck(true);
            setChecklistverificationmasters(res_grp?.data?.checklistverificationmasters);
        } catch (err) { setChecklistverificationCheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //get all project.
    const fetchChecklistverificationAll = async () => {
        setPageName(!pageName)
        try {
            let res_grp = await axios.get(SERVICE.CHECKLISTVERIFICATIONMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAllChecklistverificationEdit(res_grp?.data?.checklistverificationmasters.filter((item) => item._id !== checklistverificationEdit._id));
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

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
                "Category": item.categoryname || '',

                Subcategory: item.subcategoryname || '',

                ChecklistType: item.checklisttype || '',
                Company: item.company || '',
                Branch: item.branch || '',
                Unit: item.unit || '',
                Team: item.team || '',
                "Responsible Person": item.employee || '',

            };
        });
    };

    const handleExportXL = (isfilter) => {

        const dataToExport = isfilter === "filtered" ? filteredData : items;

        if (!dataToExport || dataToExport.length === 0) {
            console.error('No data available to export');
            return;
        }

        exportToExcel(formatData(dataToExport), 'Assign Checklist');
        setIsFilterOpen(false);
    };

    // pdf.....
    const columns = [
        { title: "Category", field: "categoryname" },
        { title: "Subcategory", field: "subcategoryname" },
        { title: "ChecklistType", field: "checklisttype" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Responsible Person", field: "employee" },

    ];

    const downloadPdf = (isfilter) => {
        const doc = new jsPDF();
        const columnsWithSerial = [
            { title: "S.No", dataKey: "serialNumber" }, // Serial number column
            ...columns.map((col) => ({ title: col.title, dataKey: col.field })),
        ];

        // Modify row data to include serial number
        const dataWithSerial =
            isfilter === "filtered"
                ? filteredData.map((t, index) => ({
                    ...t,
                    serialNumber: index + 1,

                }))
                : items?.map((item, index) => ({
                    ...item,
                    serialNumber: index + 1,


                }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            columns: columnsWithSerial,
            body: dataWithSerial,
            styles: { fontSize: 5 },
        });

        doc.save("Assign Checklist.pdf");
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Assign Checklist",
        pageStyle: "print",
    });


    useEffect(() => {
        fetchChecklistverification();
    }, []);

    useEffect(() => {
        fetchChecklistverificationAll();
    }, [isEditOpen, checklistverificationEdit]);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = checklistverificationmasters?.map((item, index) => ({
            ...item, serialNumber: index + 1,
            checklisttype: item.checklisttype.join(",").toString(),
            company: item.company.join(",").toString(),
            branch: item.branch.join(",").toString(),
            unit: item.unit.join(",").toString(),
            team: item.team.join(",").toString(),
            employee: item.employee.join(",").toString(),
        }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [checklistverificationmasters]);

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
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
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
        { field: "categoryname", headerName: "Category", flex: 0, width: 150, hide: !columnVisibility.categoryname, headerClassName: "bold-header" },
        { field: "subcategoryname", headerName: "Subcategory", flex: 0, width: 150, hide: !columnVisibility.subcategoryname, headerClassName: "bold-header" },
        { field: "checklisttype", headerName: "Checklist Type", flex: 0, width: 150, hide: !columnVisibility.checklisttype, headerClassName: "bold-header" },
        { field: "company", headerName: "Company", flex: 0, width: 150, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 150, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 150, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 150, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "employee", headerName: "Responsible Person", flex: 0, width: 150, hide: !columnVisibility.employee, headerClassName: "bold-header" },

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
                    {isUserRoleCompare?.includes("eassignchecklist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpenEdit();
                                getCode(params.row.id, params.row.name);
                            }}
                        >
                            <EditOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dassignchecklist") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id, params.row.name);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vassignchecklist") && (
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
                    {isUserRoleCompare?.includes("iassignchecklist") && (
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
            id: item._id,
            serialNumber: item.serialNumber,
            categoryname: item.categoryname,
            subcategoryname: item.subcategoryname,
            checklisttype: item.checklisttype,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            employee: item.employee,
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

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );
    return (
        <Box>
            <Headtitle title={"Assign Checklist"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Manage Assign Checklist"
                modulename="Checklist"
                submodulename="Assign Checklist"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("aassignchecklist") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Add Assign Checklist</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Category<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={categorys}
                                            value={{
                                                label: checklistverification.categoryname,
                                                value: checklistverification.categoryname,
                                            }}
                                            onChange={(e) => {
                                                setChecklistverification({ ...checklistverification, categoryname: e.value, subcategoryname: "Please Select Subcategory", checklisttype: "Please Select Checklist Type" });
                                                fetchSubcategory(e);
                                                setSelectedOptionsChecklisttype([]);
                                                setChecklisttypesOpt([]);

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Sub Category<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={subcategorys}
                                            value={{
                                                label: checklistverification.subcategoryname,
                                                value: checklistverification.subcategoryname,
                                            }}
                                            onChange={(e) => {
                                                setChecklistverification({ ...checklistverification, subcategoryname: e.value, checklisttype: "Please Select Checklist Type" });
                                                fetchChecklisttypeDropdowns(e);
                                                setSelectedOptionsChecklisttype([]);

                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Checklist Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={checklisttypesOpt}
                                            value={selectedOptionsChecklisttype}
                                            onChange={(e) => {
                                                handleChecklisttypeChange(e);
                                            }}
                                            valueRenderer={customValueRendererChecklisttype}
                                            labelledBy="Please Select Checklist Type"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={isAssignBranch?.map(data => ({
                                                label: data.company,
                                                value: data.company,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedOptionsCom}
                                            onChange={(e) => {
                                                handleCompanyChange(e);
                                                setSelectedOptionsBran([]);
                                                setSelectedOptionsUnit([]);
                                                setSelectedOptionsTeam([]);
                                                setSelectedOptionsEmp([]);
                                            }}
                                            valueRenderer={customValueRendererCom}
                                            labelledBy="Please Select Company"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={isAssignBranch?.filter(
                                                (comp) =>
                                                    selectedOptionsCom.map(data => data.value).includes(comp.company)
                                            )?.map(data => ({
                                                label: data.branch,
                                                value: data.branch,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedOptionsBran}
                                            onChange={(e) => {
                                                handleBranchChange(e);
                                                setSelectedOptionsUnit([]);
                                                setSelectedOptionsTeam([]);
                                                setSelectedOptionsEmp([]);
                                            }}
                                            valueRenderer={customValueRendererBran}
                                            labelledBy="Please Select Branch"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={isAssignBranch?.filter(
                                                (comp) =>
                                                    selectedOptionsCom.map(data => data.value).includes(comp.company) && selectedOptionsBran.map(data => data.value).includes(comp.branch)
                                            )?.map(data => ({
                                                label: data.unit,
                                                value: data.unit,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedOptionsUnit}
                                            onChange={(e) => {
                                                handleUnitChange(e);
                                                setSelectedOptionsTeam([]);
                                                setSelectedOptionsEmp([]);
                                            }}
                                            valueRenderer={customValueRendererUnit}
                                            labelledBy="Please Select Unit"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Team<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={allTeam?.filter(
                                                (comp) =>
                                                    selectedOptionsCom.map(data => data.value).includes(comp.company) && selectedOptionsBran.map(data => data.value).includes(comp.branch) && selectedOptionsUnit.map(data => data.value).includes(comp.unit)
                                            )?.map(data => ({
                                                label: data.teamname,
                                                value: data.teamname,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedOptionsTeam}
                                            onChange={(e) => {
                                                handleTeamChange(e);
                                                setSelectedOptionsEmp([]);
                                            }}
                                            valueRenderer={customValueRendererTeam}
                                            labelledBy="Please Select Team"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Responsible Person<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={allUsersData?.filter(
                                                (comp) =>
                                                    selectedOptionsCom.map(data => data.value).includes(comp.company) && selectedOptionsBran.map(data => data.value).includes(comp.branch) && selectedOptionsUnit.map(data => data.value).includes(comp.unit) && selectedOptionsTeam.map(data => data.value).includes(comp.team)
                                            )?.map(data => ({
                                                label: data.companyname,
                                                value: data.companyname,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedOptionsEmp}
                                            onChange={(e) => {
                                                handleEmployeeChange(e);
                                            }}
                                            valueRenderer={customValueRendererEmp}
                                            labelledBy="Please Select Responsible Person"
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
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
                                    <LoadingButton variant="contained"
                                        onClick={handleSubmit}
                                        disabled={isBtn}
                                        loading={btnSubmit}
                                    >
                                        SAVE
                                    </LoadingButton>
                                    <Button sx={userStyle.btncancel}
                                        onClick={handleClear}
                                    >
                                        CLEAR
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
                    fullWidth={true}
                    maxWidth="lg"
                    sx={{
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                    }}
                >
                    <Box sx={{ padding: "20px" }}>
                        <>
                            <form onSubmit={editSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Edit Assign Checklist</Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>

                                    <Grid item md={3} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Category<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={300}
                                                options={categorysEdit}
                                                value={{
                                                    label: checklistverificationEdit.categoryname,
                                                    value: checklistverificationEdit.categoryname,
                                                }}
                                                onChange={(e) => {
                                                    setChecklistverificationEdit({ ...checklistverificationEdit, categoryname: e.value, subcategoryname: "Please Select Subcategory", checklisttype: "Please Select Checklist Type" });
                                                    fetchSubcategoryEdit(e);
                                                    setSelectedOptionsChecklisttypeEdit([]);
                                                    setChecklisttypesOptEdit([]);

                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Subcategory<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={300}
                                                options={subcategorysEdit}
                                                value={{
                                                    label: checklistverificationEdit.subcategoryname,
                                                    value: checklistverificationEdit.subcategoryname,
                                                }}
                                                onChange={(e) => {
                                                    setChecklistverificationEdit({ ...checklistverificationEdit, subcategoryname: e.value, checklisttype: "Please Select Checklist Type" });
                                                    fetchChecklisttypeDropdownsEdit(checklistverificationEdit.categoryname, e.value);
                                                    setSelectedOptionsChecklisttypeEdit([]);

                                                }}
                                            />
                                        </FormControl>
                                    </Grid>


                                    <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Checklist Type<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={checklisttypesOptEdit}
                                                value={selectedOptionsChecklisttypeEdit}
                                                onChange={(e) => {
                                                    handleChecklisttypeChangeEdit(e);
                                                }}
                                                valueRenderer={customValueRendererChecklisttypeEdit}
                                                labelledBy="Please Select Checklist Type"
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Company<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={isAssignBranch?.map(data => ({
                                                    label: data.company,
                                                    value: data.company,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                value={selectedOptionsComEdit}
                                                onChange={(e) => {
                                                    handleCompanyChangeEdit(e);
                                                    setSelectedOptionsBranEdit([]);
                                                    setSelectedOptionsUnitEdit([]);
                                                    setSelectedOptionsTeamEdit([]);
                                                    setSelectedOptionsEmpEdit([]);
                                                }}
                                                valueRenderer={customValueRendererComEdit}
                                                labelledBy="Please Select Company"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Branch<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={isAssignBranch?.filter(
                                                    (comp) =>
                                                        selectedOptionsComEdit.map(data => data.value).includes(comp.company)
                                                )?.map(data => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                value={selectedOptionsBranEdit}
                                                onChange={(e) => {
                                                    handleBranchChangeEdit(e);
                                                    setSelectedOptionsUnitEdit([]);
                                                    setSelectedOptionsTeamEdit([]);
                                                    setSelectedOptionsEmpEdit([]);
                                                }}
                                                valueRenderer={customValueRendererBranEdit}
                                                labelledBy="Please Select Branch"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Unit<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={isAssignBranch?.filter(
                                                    (comp) =>
                                                        selectedOptionsComEdit.map(data => data.value).includes(comp.company) && selectedOptionsBranEdit.map(data => data.value).includes(comp.branch)
                                                )?.map(data => ({
                                                    label: data.unit,
                                                    value: data.unit,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                value={selectedOptionsUnitEdit}
                                                onChange={(e) => {
                                                    handleUnitChangeEdit(e);
                                                    setSelectedOptionsTeamEdit([]);
                                                    setSelectedOptionsEmpEdit([]);
                                                }}
                                                valueRenderer={customValueRendererUnitEdit}
                                                labelledBy="Please Select Unit"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Team<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={allTeam?.filter(
                                                    (comp) =>
                                                        selectedOptionsComEdit.map(data => data.value).includes(comp.company) && selectedOptionsBranEdit.map(data => data.value).includes(comp.branch) && selectedOptionsUnitEdit.map(data => data.value).includes(comp.unit)
                                                )?.map(data => ({
                                                    label: data.teamname,
                                                    value: data.teamname,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                value={selectedOptionsTeamEdit}
                                                onChange={(e) => {
                                                    handleTeamChangeEdit(e);
                                                    setSelectedOptionsEmpEdit([]);

                                                }}
                                                valueRenderer={customValueRendererTeamEdit}
                                                labelledBy="Please Select Team"
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Responsible Person<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={allUsersData?.filter(
                                                    (comp) =>
                                                        selectedOptionsComEdit.map(data => data.value).includes(comp.company) && selectedOptionsBranEdit.map(data => data.value).includes(comp.branch) && selectedOptionsUnitEdit.map(data => data.value).includes(comp.unit) && selectedOptionsTeamEdit.map(data => data.value).includes(comp.team)
                                                )?.map(data => ({
                                                    label: data.companyname,
                                                    value: data.companyname,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                value={selectedOptionsEmpEdit}
                                                onChange={(e) => {
                                                    handleEmployeeChangeEdit(e);

                                                }}
                                                valueRenderer={customValueRendererEmpEdit}
                                                labelledBy="Please Select Responsible Person"
                                            />
                                        </FormControl>
                                    </Grid>

                                </Grid>
                                <br />

                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <Button
                                            variant="contained"
                                            style={{
                                                padding: "7px 13px",
                                                color: "white",
                                                background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={editSubmit}
                                        >
                                            Update
                                        </Button>
                                    </Grid>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                                            Cancel
                                        </Button>
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
            {isUserRoleCompare?.includes("lassignchecklist") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Assign Checklist</Typography>
                        </Grid>
                        <br />
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
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelassignchecklist") && (
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
                                    {isUserRoleCompare?.includes("csvassignchecklist") && (
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
                                    {isUserRoleCompare?.includes("printassignchecklist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfassignchecklist") && (
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
                                    {isUserRoleCompare?.includes("imageassignchecklist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
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
                        {isUserRoleCompare?.includes("bdassignchecklist") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                                Bulk Delete
                            </Button>
                        )}
                        <br />
                        <br />
                        {!checklistverificationCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box
                                    style={{
                                        width: "100%",
                                        overflowY: "hidden", // Hide the y-axis scrollbar
                                    }}
                                >
                                    <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                                </Box>
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbers?.map((pageNumber) => (
                                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        {lastVisiblePage < totalPages && <span>...</span>}
                                        <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
                                </Box>
                            </>
                        )}
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
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                {manageColumnsContent}
            </Popover>

            {/* Delete Modal */}
            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseMod} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button autoFocus variant="contained" color="error" onClick={(e) => deleGroup(checklistverificationmasters)}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* this is info view details */}

                <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <Box sx={{ width: "550px", padding: "20px 50px" }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>Info Assign Checklist </Typography>
                            <br />
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">addedby</Typography>
                                        <br />
                                        <Table>
                                            <TableHead>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {addedby?.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {updateby?.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <br />
                            <Grid container spacing={2}>
                                <Button variant="contained" onClick={handleCloseinfo}>
                                    {" "}
                                    Back{" "}
                                </Button>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
                {/* print layout */}

                <TableContainer component={Paper} sx={userStyle.printcls}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                        <TableHead>
                            <TableRow>
                                <TableCell> SNo</TableCell>
                                <TableCell> Category</TableCell>
                                <TableCell> Subcategory</TableCell>
                                <TableCell> Checklist Type</TableCell>
                                <TableCell> Company</TableCell>
                                <TableCell>Branch</TableCell>
                                <TableCell> Unit</TableCell>
                                <TableCell>Team</TableCell>
                                <TableCell>Responsible Person</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {filteredData &&
                                filteredData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.categoryname}</TableCell>
                                        <TableCell>{row.subcategoryname}</TableCell>
                                        <TableCell>{row.checklisttype}</TableCell>
                                        <TableCell>{row.company}</TableCell>
                                        <TableCell>{row.branch}</TableCell>
                                        <TableCell>{row.unit}</TableCell>
                                        <TableCell>{row.team}</TableCell>
                                        <TableCell>{row.employee}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg">
                <Box sx={{ width: "1150px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Assign Checklist</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Category</Typography>
                                    <Typography>{checklistverificationEdit.categoryname}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Subcategory</Typography>
                                    <Typography>{checklistverificationEdit.subcategoryname}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> ChecklistType</Typography>
                                    <Typography>{checklistverificationEdit.checklisttype + ","}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>{checklistverificationEdit.company + ","}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Branch</Typography>
                                    <Typography>{checklistverificationEdit.branch + ","}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Unit</Typography>
                                    <Typography>{checklistverificationEdit.unit + ","}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Team</Typography>
                                    <Typography>{checklistverificationEdit.team + ","}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Responsible Person</Typography>
                                    <Typography>{checklistverificationEdit.employee + ","}</Typography>
                                </FormControl>
                            </Grid>


                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>


            {/* Clear DIALOG */}
            <Dialog open={isClearOpenalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <Typography variant="h6"><b>Cleared Successfully👍</b></Typography>
                </DialogContent>
            </Dialog>
            {/* Add DIALOG */}
            <Dialog open={isAddOpenalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <Typography variant="h6"><b>Added Successfully👍</b></Typography>
                </DialogContent>
            </Dialog>
            {/* Delete DIALOG */}
            <Dialog open={isDeletealert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <Typography variant="h6"><b>Deleted Successfully👍</b></Typography>
                </DialogContent>
            </Dialog>
            {/* BulkDelete DIALOG */}
            <Dialog open={isBulkDelOpenalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <Typography variant="h6"><b>Deleted Successfully👍</b></Typography>
                </DialogContent>
            </Dialog>
            {/* BulkDelete DIALOG */}
            <Dialog open={isUpdateOpenalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <Typography variant="h6"><b>Updated Successfully👍</b></Typography>
                </DialogContent>
            </Dialog>

            <Box>
                <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delGroupcheckbox(e)}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
                        <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                            Please Select any Row
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>



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
        </Box>
    );
}

export default CheckListVerificationMaster;