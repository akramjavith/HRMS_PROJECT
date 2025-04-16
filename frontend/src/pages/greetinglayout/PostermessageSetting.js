import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
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
    Paper,
    Popover,
    Select,
    Switch,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TextareaAutosize,
    TextField,
    Typography
} from "@mui/material";
import axios from "axios";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPlus, FaPrint } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import PageHeading from "../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

function PosterMessageSetting() {
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
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";
    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    const handleExportXL = (isfilter) => {
        if (isfilter === "filtered") {
            exportToCSV(
                rowDataTable?.map((t, i) => ({
                    "S.no": index + 1,
                    "Category Template Name": t.categoryname,
                    "Sub Category Template Name": t.subcategoryname,
                    "Wishing Message": t.wishingmessage,
                })),
                fileName
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                categoryMasterList?.map((t, index) => ({
                    "S.no": index + 1,
                    "Category Template Name": t.categoryname,
                    "Sub Category Template Name": t.subcategoryname,
                    "Wishing Message": t.wishingmessage?.join(", "),
                })),
                fileName
            );
        }
        setIsFilterOpen(false);
    };

    const [footermessage, setfooterMessage] = useState("")

    const columns = [
        { title: "Category Template Name", field: "categoryname" },
        { title: "Sub Category Template Name", field: "subcategoryname" },
        { title: "Wishing Message", field: "wishingmessage" },
    ];

    const downloadPdf = (isfilter) => {
        const doc = new jsPDF();
        // Modify columns to include serial number column
        const columnsWithSerial = [
            { title: "SNo", dataKey: "serialNumber" }, // Serial number column
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];

        // Modify row data to include serial number
        const dataWithSerial =
            isfilter === "filtered"
                ? rowDataTable?.map((t, i) => ({
                    serialNumber: i + 1,
                    categoryname: t.categoryname,
                    subcategoryname: t.subcategoryname,
                    wishingmessage: t.wishingmessage,
                }))
                : categoryMasterList?.map((t, index) => ({
                    serialNumber: index + 1,
                    categoryname: t.categoryname,
                    subcategoryname: t.subcategoryname,
                    wishingmessage: t.wishingmessage,
                }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            columns: columnsWithSerial,
            body: dataWithSerial,
            //   styles: { fontSize: "5" },
        });

        doc.save("Poster Settings.pdf");
    };

    let newval = "PR0001";

    const [categoryOption, setCategoryOption] = useState([]);
    const [categoryOptionEdit, setCategoryOptionEdit] = useState([]);


    const [posterGenerate, setPosterGenerate] = useState({
        categoryname: "Please Select Category Template Name",
        subcategoryname: "Please Select Sub-category Template Name",
        themename: "Please Select Theme Name",
    });

    const [posterGenerateEdit, setPosterGenerateEdit] = useState({
        categoryname: "Please Select Category Template Name",
        subcategoryname: "Please Select Sub-category Template Name",
        themename: "Please Select Theme Name",
    });

    const [subcategoryOpt, setSubcategoryOption] = useState([]);
    const [subcategoryOptEdit, setSubcategoryOptionEdit] = useState([]);

    const [category, setCategory] = useState({ categoryname: "" });
    const [subCategoryTodo, setSubcategoryTodo] = useState([]);
    const [subcategory, setSubcategory] = useState("");
    const [isFirstSubCateView, setIsFirstSubCateView] = useState(false);

    const [btnSubmit, setBtnSubmit] = useState(false);
    const [btnSubmitEdit, setBtnSubmitEdit] = useState(false);

    const [categoryMasterList, setCategoryMasterList] = useState([]);

    const [raise, setRaise] = useState([]);

    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const { auth, setAuth } = useContext(AuthContext);
    const { isUserRoleAccess, pageName, setPageName } = useContext(UserRoleAccessContext);
    const username = isUserRoleAccess?.username;
    const [singleCategory, setSingleCategory] = useState({});
    const [editTodo, setEditTodo] = useState([]);
    const [subcategoryEdit, setSubCategoryEdit] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const gridRef = useRef(null);

    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);

    const handleCloseCheck = () => {
        setisCheckOpen(false);
    };

    const handleClickOpenCheck = () => {
        setisCheckOpen(true);
    };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [editDuplicate, setEditDuplicate] = useState([]);
    const [subDuplicate, setSubDuplicate] = useState([]);

    const { isUserRoleCompare } = useContext(UserRoleAccessContext);

    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };

    const [showAlert, setShowAlert] = useState();
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => {
        setBtnSubmit(false);
        setBtnSubmitEdit(false);
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const [ovProj, setOvProj] = useState("");
    const [ovProjCount, setOvProjCount] = useState("");
    const [getOverAllCount, setGetOverallCount] = useState("");

    const [ovProjsub, setOvProjsub] = useState("");

    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
    const filteredDatas = categoryMasterList?.filter((item) => {
        return searchOverTerms.every((term) =>
            Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
        );
    });

    const filteredData = filteredDatas.slice(
        (page - 1) * pageSize,
        page * pageSize
    );
    const rowDataTable = filteredData.map((item, index) => {

        return {
            id: item._id,
            serialNumber: index + 1,
            categoryname: item.categoryname,
            subcategoryname: item.subcategoryname,
            wishingmessage: item.wishingmessage,
            // subcategory: correctedArray.toString(),
        };
    });
    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));
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

    const [editOpen, setEditOpen] = useState(false);
    const handleEditOpen = () => {
        setEditOpen(true);
    };
    const handleEditClose = () => {
        setEditOpen(false);
    };
    const [openDelete, setOpenDelete] = useState(false);
    const handleClickOpen = () => {
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const [openView, setOpenView] = useState(false);
    const handleViewOpen = () => {
        setOpenView(true);
    };
    const handlViewClose = () => {
        setOpenView(false);
    };

    const [categorythemegrouping, setCategorythemegrouping] = useState([])



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
            // setSubcategorynameOptEdit(subcategoryname);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const fetchSubcategoryBasedEdit = async (e) => {
        setPageName(!pageName);
        try {
            let data_set = categorythemegrouping.filter((data) => {
                return e === data.categoryname;
            });
            let subcategoryname = data_set?.map((item) => {
                return {
                    label: item?.subcategoryname,
                    value: item?.subcategoryname,
                }
            })
            setSubcategoryOptionEdit(subcategoryname);
            // setSubcategorynameOptEdit(subcategoryname);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };


    useEffect(() => {
        fetchCategoryAll();
        fetchOverAllSettings();
    }, []);

    const [isBtn, setIsBtn] = useState(false);

    const sendRequest = async () => {
        setIsBtn(true);
        const subcategoryName =
            subCategoryTodo.length === 0 ? subcategory : [...subCategoryTodo];
        setPageName(!pageName)
        try {
            let res_queue = await axios.post(SERVICE.POSTERMESSAGESETTING_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                categoryname: String(posterGenerate.categoryname),
                subcategoryname: posterGenerate.subcategoryname,
                wishingmessage: subcategoryName,
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setSubcategoryTodo([]);
            setSubcategory("");
            setCategory({ ...category, categoryname: "" });
            setBtnSubmit(false);
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "#7AC767" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Added Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();
            await getCategoryMaster();
            setIsBtn(false);
        } catch (err) { setIsBtn(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const handleClear = () => {
        setSubcategoryTodo([]);
        setSubcategoryOption([])
        setSubcategory("");
        setPosterGenerate({
            ...posterGenerate,
            categoryname: "Please Select Category Template Name",
            subcategoryname: "Please Select Sub-category Template Name",
            wishingmessage: "",
        });
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"Cleared Successfully"}
                </p>
            </>
        );
        handleClickOpenerr();
    };

    const handleClearFooter = () => {
        setfooterMessage("");
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"Cleared Successfully"}
                </p>
            </>
        );
        handleClickOpenerr();
    };

    const [prevcatSubcat, setPrevCatSubcat] = useState([]);

    const getCode = async (id, categoryname, subcategory) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.POSTERMESSAGESETTING_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSingleCategory(res.data.spostermessage);
            setPrevCatSubcat(res.data.spostermessage);
            setEditTodo(res.data.spostermessage.wishingmessage);
            fetchSubcategoryBasedEdit(categoryname)
            setPosterGenerateEdit(res.data.spostermessage)
            setOvProj(categoryname);
            setOvProjsub(subcategory);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const [index, setIndex] = useState("");

    const sendRequestEdit = async () => {

        setPageName(!pageName)
        try {
            let res = await axios.put(
                `${SERVICE.POSTERMESSAGESETTING_SINGLE}/${singleCategory._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    categoryname: String(posterGenerateEdit.categoryname),
                    subcategoryname: String(posterGenerateEdit.subcategoryname),
                    wishingmessage: editTodo,
                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            await getCategoryMaster();
            //   await getOverallEditSectionUpdate();
            setSubCategoryEdit("");
            setBtnSubmitEdit(false);
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "#7ac767" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Updated Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();
            handleEditClose();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const [matchedData, setMatchedData] = useState([]);
    const [unmatchedData, setUnmatchedData] = useState([]);

    const getCategoryMaster = async () => {
        setPageName(!pageName)
        try {
            let response = await axios.get(`${SERVICE.POSTERMESSAGESETTINGALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setCategoryMasterList(response.data.postermessage?.map((item) => ({
                ...item,
                wishingmessage: item.wishingmessage?.map((item, index) => `${index + 1}. ${item}`)?.join(", "),

            })));
            // setEditDuplicate(response.data.doccategory.filter(data => data._id !== singleCategory._id));
            setSubDuplicate(
                response.data.postermessage.filter(
                    (data) => data._id !== singleCategory._id
                )
            );

            response.data.postermessage.forEach((row) => {
                let managerMatch = raise.some(
                    (manager) => manager.category == row.categoryname
                );

                if (managerMatch) {
                    setMatchedData((prevMatchedData) => [...prevMatchedData, row]);
                } else {
                    setUnmatchedData((prevUnmatchedData) => [...prevUnmatchedData, row]);
                }
            });
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    useEffect(() => {
        getCategoryMaster();
    }, []);

    useEffect(() => {
        getCategoryMaster();
    }, [editOpen, editTodo]);

    const getCategoryId = async () => {
        setPageName(!pageName)
        try {
            let response = await axios.get(`${SERVICE.CATEGORYMASTERGETALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setEditDuplicate(
                response.data.categorymaster.filter(
                    (data) => data._id !== singleCategory._id
                )
            );
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const EditTodoPopup = () => {
        if (subcategoryEdit === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {" Please Enter Wishing Message"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (
            editTodo.some(
                (item) => item?.toLowerCase() === subcategoryEdit?.toLowerCase()
            )
        ) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Already Added ! Please Enter Another Wishing Message"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else {
            setEditTodo([...editTodo, subcategoryEdit]);
            setSubCategoryEdit("");
        }
    };


    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };
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

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    const delVendorcheckbox = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.POSTERMESSAGESETTING_SINGLE}/${item}`, {
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
            await getCategoryMaster();
            setShowAlert(
                <>
                    <DeleteIcon sx={{ fontSize: "100px", color: "red" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Deleted Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //check delete model



    const [deletedocument, setDeletedocument] = useState({});
    const [checkdoc, setCheckdoc] = useState();

    const [checkUser, setCheckUser] = useState();

    const rowData = async (id, categoryname, subcategoryname) => {
        setPageName(!pageName)
        try {
            const [res, resuser] = await Promise.all([
                axios.get(`${SERVICE.POSTERMESSAGESETTING_SINGLE}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.post(SERVICE.OVERALL_POSTERMESSAGESETTINGOVERALL, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    catname: String(categoryname),
                    subcat: subcategoryname,
                })
            ])
  
            setDeletedocument(res?.data?.spostermessage);

            setCheckUser(resuser?.data?.count);
            if (resuser?.data?.count > 0) {
                handleClickOpenCheck();
            } else {
                handleClickOpen();
            }
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    let deleteId = deletedocument?._id;

    const deleteData = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.delete(
                `${SERVICE.POSTERMESSAGESETTING_SINGLE}/${deleteId}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            await getCategoryMaster();
            handleCloseDelete();
            setShowAlert(
                <>
                    <DeleteIcon sx={{ fontSize: "100px", color: "red" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Deleted Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const handlecheckIsSupportExist = (isWhat) => {
        const isNameMatch = raise.some(
            (item) =>
                item.category?.toLowerCase() ==
                deletedocument.categoryname?.toLowerCase()
        );

        const checkBulkdel = matchedData.some((item) =>
            selectedRows.includes(item._id)
        );

        if (checkBulkdel) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Interactor Type Already Linked"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else {
            if (isWhat == "del") {
                deleteData(deleteId);
            } else {
                delVendorcheckbox();
            }
        }
    };

    const addTodo = () => {
        getCategoryMaster();
        const isSubNameMatch = subCategoryTodo.some(
            (item) => item?.toLowerCase() === subcategory?.toLowerCase()
        );
        // const isSubNameMatch = categorySubcategoryList.some((item) => item.subcategoryname.includes(subcategory));

        if (subcategory === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Wishing Message"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (isSubNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Already Added ! Please Enter Another Wishing Message"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else {
            setSubcategoryTodo([...subCategoryTodo, subcategory]);
            setSubcategory("");
        }
    };

    const handleTodoEdit = (index, newValue) => {
        const updatedTodos = [...subCategoryTodo];
        updatedTodos[index] = newValue;
        setSubcategoryTodo(updatedTodos);
    };

    const handleTodoEditPop = (index, newValue) => {
        const onlSub = categoryMasterList.map((data) => data.subcategoryname);
        let concatenatedArray = [].concat(...onlSub);

        // If no duplicate is found, update the editTodo array
        const updatedTodos = [...editTodo];
        updatedTodos[index] = newValue;

        setEditTodo(updatedTodos);
    };

    const handleSubmit = () => {
        setBtnSubmit(true);
        const isNameMatch = categoryMasterList?.some(
            (item) =>
                item?.categoryname?.toLowerCase() ===
                posterGenerate?.categoryname.toLowerCase()
        );
        const isSubNameMatch = subDuplicate.some((item) =>
            subCategoryTodo.includes(item)
        );

        const hasDuplicates = (arr) =>
            new Set(arr.map((s) => s.toLowerCase())).size !== arr.length;

        if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Already Added ! Please Enter Another Category Template Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else
            if (isSubNameMatch) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"Already Added ! Please Enter Another subcategory2 "}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (posterGenerate.categoryname === "Please Select Category Template Name") {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"Please Select Category Template Name"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (posterGenerate.subcategoryname === "Please Select Sub-category Template Name") {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"Please Select Sub Category Template Name"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (subcategory !== "") {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"Please Add the Wishing Message Todo and Submit"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            } else if (subcategory.length > 0 && subCategoryTodo.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"Please Enter Wishing Message"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            } else if (subCategoryTodo.some((item) => item === "")) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"Please Enter Wishing Message"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            } else if (subCategoryTodo.some((item) => item === "")) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"Please Enter Wishing Message"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            } else if (subCategoryTodo.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"Please Enter Wishing Message"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            } else if (hasDuplicates(subCategoryTodo)) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"Sub Categories Can not be same"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            } else {
                sendRequest();
            }
    };

    const [overAllsettingsCount, setOverAllsettingsCount] = useState();
    const [overAllsettingsID, setOverAllsettingsID] = useState();


    const fetchOverAllSettings = async () => {
        try {
            let res = await axios.get(
                `${SERVICE.FOOTERMESSAGESETTINGALL}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );

            if (res?.data?.count === 0) {
                setOverAllsettingsCount(res?.data?.count);
            } else {
                const lastObject =
                    res?.data?.footermessage[res?.data?.footermessage.length - 1];
                const lastObjectId = lastObject._id;
                setOverAllsettingsID(lastObjectId);

                setfooterMessage(
                    res?.data?.footermessage[res?.data?.footermessage.length - 1]
                        ?.footermessage
                )


            }
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const sendEditRequest = async () => {
        try {
            let res = await axios.put(
                `${SERVICE.FOOTERMESSAGESETTING_SINGLE}/${overAllsettingsID}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    footermessage: String(footermessage),
                }
            );

            await fetchOverAllSettings();
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Updated Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();

        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };



    const sendFooterRequest = async () => {
        try {
            let res_queue = await axios.post(SERVICE.FOOTERMESSAGESETTING_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                footermessage: String(footermessage),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "#7AC767" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Added Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();

        } catch (err) { setIsBtn(false); handleApiError(err, setShowAlert, handleClickOpenerr); }

    }

    const handleUpdateFooter = () => {
        if (footermessage === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Footer"}
                    </p>
                </>
            );
            handleClickOpenerr();


        } else {
            if (overAllsettingsCount === 0) {
                sendFooterRequest()
            } else {
                sendEditRequest();
            }
        }

    }

    const handleSubmitEdit = () => {
        setBtnSubmitEdit(true);
        getCategoryMaster();
        const isNameMatch = subDuplicate?.some(
            (item) =>
                item?.categoryname?.toLowerCase() ===
                posterGenerateEdit?.categoryname.toLowerCase()
        );

        const hasDuplicates = (arr) =>
            new Set(arr.map((s) => s.toLowerCase())).size !== arr.length;


        if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Already Added ! Please Enter Another Category Template Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (posterGenerateEdit.subcategoryname === "Please Select Sub-category Template Name") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Sub-Category Template Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (subcategoryEdit !== "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Add the Wishing Message Todo and Submit"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (editTodo.some((item) => item === "")) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Wishing Message"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (subcategoryEdit === "" && editTodo.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Wishing Message"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (editTodo.length > 0 && editTodo.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Insert Sub Category"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (editTodo.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Insert Sub Category"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (hasDuplicates(editTodo)) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Sub Categories Can not be same"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else {
            sendRequestEdit();
        }
    };

    const deleteTodo = (index) => {
        const updatedTodos = [...subCategoryTodo];
        updatedTodos.splice(index, 1);
        setSubcategoryTodo(updatedTodos);
    };

    const deleteTodoEdit = (index) => {
        const updatedTodos = [...editTodo];
        updatedTodos.splice(index, 1);
        setEditTodo(updatedTodos);
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        actions: true,
        checkbox: true,
        serialNumber: true,
        categoryname: true,
        subcategoryname: true,
        wishingmessage: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

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

    // Modify the filtering logic to check each term

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        Math.abs(firstVisiblePage + visiblePages - 1),
        totalPages
    );

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    const [infoCategory, setInfoCategory] = useState([]);

    let updateby = singleCategory.updatedby;
    let addedby = infoCategory.addedby;

    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.POSTERMESSAGESETTING_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setInfoCategory(res?.data?.spostermessage);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

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
            headerName: "S.No",
            flex: 0,
            width: 100,
            minHeight: "40px",
            hide: !columnVisibility.serialNumber,
        },
        {
            field: "categoryname",
            headerName: "Category Template Name",
            flex: 0,
            width: 230,
            minHeight: "40px",
            hide: !columnVisibility.categoryname,
        },
        {
            field: "subcategoryname",
            headerName: "Sub Category Template Name",
            flex: 0,
            width: 230,
            minHeight: "40px",
            hide: !columnVisibility.subcategoryname,
        },
        {
            field: "wishingmessage",
            headerName: "Wishing Message",

            flex: 0,
            width: 230,
            minHeight: "40px",
            hide: !columnVisibility.wishingmessage,
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 230,
            hide: !columnVisibility.actions,
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("ecategorymaster") && (
                        <Button
                            onClick={() => {
                                getCode(
                                    params.row.id,
                                    params.row.categoryname,
                                    params.row.subcategoryname
                                );
                                handleEditOpen();
                                getCategoryId();
                            }}
                            sx={userStyle.buttonedit}
                            style={{ minWidth: "0px" }}
                        >
                            <EditOutlinedIcon style={{ fontSize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dcategorymaster") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id, params.row.categoryname, params.row.subcategoryname);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vcategorymaster") && (
                        <Button
                            sx={userStyle.buttonview}
                            onClick={(e) => {
                                getCode(params.row.id,
                                    params.row.categoryname,
                                    params.row.subcategoryname
                                );
                                handleViewOpen();
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontSize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iraiseproblemlist") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                getinfoCode(params.row.id);
                                handleClickOpeninfo();
                            }}
                        >
                            <InfoOutlinedIcon style={{ fontSize: "large" }} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );

    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <div style={{ padding: "10px", minWidth: "325px" }}>
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
                                        sx={{ marginTop: "-10px" }}
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={column.headerName}
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
                            onClick={() => setColumnVisibility({})}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </div>
    );

    // Excel
    const fileName = "Poster Settings";
    let excelno = 1;

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Poster Settings",
        pageStyle: "print",
    });
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Poster Settings.png");
                });
            });
        }
    };
    //  PDF

    return (
        <Box>
            <Headtitle title={"CATEGORY MASTER"} />
            <PageHeading
                title="Poster Settings"
                modulename="Support"
                submodulename="Category Master"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("acategorymaster") && (
                <>
                    <Box sx={userStyle.container}>



                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.HeaderText}>
                                    Add Poster Settings
                                </Typography>
                            </Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Category Template Name<b style={{ color: "red" }}>*</b>{" "}
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
                                                themename: "Please Select Theme Name"
                                            });
                                            fetchSubcategoryBased(e);
                                            // setThemeNames([])
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Sub-Category Template Name<b style={{ color: "red" }}>*</b>{" "}
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
                                                themename: "Please Select Theme Name"
                                            });
                                            // fetchThemeBased(e)
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        {" "}
                                        Wishing Message<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={5}
                                        value={subcategory}
                                        onChange={(e) => setSubcategory(e.target.value)}
                                    />
                                </FormControl>
                                &emsp;
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={addTodo}
                                    type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    <FaPlus />
                                </Button>
                                &nbsp;
                            </Grid>
                            <Grid item md={2} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Link to="/posterkeywordinstructions" target="_blank" style={{ textDecoration: 'none', marginTop: "28px", }}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            sx={{ width: '200px' }}
                                        >
                                            Check Wish Keywords
                                        </Button>
                                    </Link>
                                </FormControl>
                            </Grid>
                            <Grid item md={1} marginTop={3}></Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                {subCategoryTodo.length > 0 && (
                                    <ul type="none">
                                        {subCategoryTodo.map((item, index) => {
                                            return (
                                                <li key={index}>
                                                    <br />
                                                    <Grid sx={{ display: "flex" }}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography>
                                                                {" "}
                                                                Wishing Message{" "}
                                                                <b style={{ color: "red" }}>*</b>
                                                            </Typography>
                                                            <TextareaAutosize
                                                                aria-label="minimum height"
                                                                minRows={5}
                                                                value={item}
                                                                onChange={(e) =>
                                                                    handleTodoEdit(index, e.target.value)
                                                                }
                                                            />

                                                        </FormControl>
                                                        &nbsp; &emsp;
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            type="button"
                                                            onClick={(e) => deleteTodo(index)}
                                                            sx={{
                                                                height: "30px",
                                                                minWidth: "30px",
                                                                marginTop: "28px",
                                                                padding: "6px 10px",
                                                            }}
                                                        >
                                                            <AiOutlineClose />
                                                        </Button>
                                                    </Grid>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </Grid>
                            <Grid item md={1} marginTop={3}></Grid>
                            <Grid item md={5}></Grid>
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
                                        variant="contained"
                                        loading={btnSubmit}
                                        onClick={handleSubmit}
                                        disabled={isBtn}
                                    >
                                        SAVE
                                    </LoadingButton>
                                    <Button sx={userStyle.btncancel} onClick={handleClear}>
                                        CLEAR
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </>
            )}
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
                        <Typography
                            variant="h6"
                            style={{ fontSize: "20px", fontWeight: 900 }}
                        >
                            {showAlert}
                        </Typography>
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
            <Box>
                <Dialog
                    maxWidth="lg"
                    open={editOpen}
                    onClose={handleEditClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.HeaderText}>
                                    Edit Poster Settings
                                </Typography>
                            </Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} xs={12} sm={12}>
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
                                                subcategoryname:
                                                    "Please Select Sub-category Template Name",
                                                themename: "Please Select Theme Name"
                                            });
                                            fetchSubcategoryBasedEdit(e?.value);
                                            // setThemeNames([])
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Sub-Category Template Name<b style={{ color: "red" }}>*</b>{" "}
                                    </Typography>
                                    <Selects
                                        options={subcategoryOptEdit}
                                        styles={colourStyles}
                                        value={{
                                            label: posterGenerateEdit.subcategoryname,
                                            value: posterGenerateEdit.subcategoryname,
                                        }}
                                        onChange={(e) => {
                                            setPosterGenerateEdit({
                                                ...posterGenerateEdit,
                                                subcategoryname: e.value,
                                                themename: "Please Select Theme Name"
                                            });
                                            // fetchThemeBased(e)
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        {" "}
                                        Wishing Message<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={5}
                                        value={subcategoryEdit}
                                        onChange={(e) => setSubCategoryEdit(e.target.value)}
                                    />
                                </FormControl>
                                &emsp;
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={EditTodoPopup}
                                    type="button"
                                    sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                    }}
                                >
                                    <FaPlus />
                                </Button>
                                &nbsp;
                            </Grid>
                            <Grid item md={1} marginTop={3}></Grid>
                            <Grid item md={5}></Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                {editTodo.length > 0 && (
                                    <ul type="none">
                                        {editTodo.map((item, index) => {
                                            return (
                                                <li key={index}>
                                                    <br />
                                                    <Grid sx={{ display: "flex" }}>
                                                        <FormControl fullWidth size="small">
                                                            <TextareaAutosize
                                                                aria-label="minimum height"
                                                                minRows={5}
                                                                value={item}
                                                                onChange={(e) => {
                                                                    handleTodoEditPop(index, e.target.value);
                                                                    setIndex(index);
                                                                }} />
                                                        </FormControl>
                                                        &nbsp; &emsp;
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            type="button"
                                                            onClick={(e) => deleteTodoEdit(index)}
                                                            sx={{
                                                                height: "30px",
                                                                minWidth: "30px",
                                                                marginTop: "5px",
                                                                padding: "6px 10px",
                                                            }}
                                                        >
                                                            <AiOutlineClose />
                                                        </Button>
                                                    </Grid>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </Grid>
                            <Grid item md={1} marginTop={3}></Grid>
                            <Grid item md={5}></Grid>
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
                                        variant="contained"
                                        loading={btnSubmitEdit}
                                        onClick={handleSubmitEdit}
                                    >
                                        Update
                                    </LoadingButton>
                                    <Button
                                        sx={userStyle.btncancel}
                                        onClick={() => {
                                            handleEditClose();
                                            setSubCategoryEdit("");
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </Box>

            <Box>
                <Dialog
                    maxWidth="md"
                    open={openView}
                    onClose={handlViewClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.HeaderText}>
                                    View Poster Settings
                                </Typography>
                            </Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Category Template Name</Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Category Template Name"
                                        value={singleCategory.categoryname}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Sub-Category Template Name</Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        placeholder="Please Enter SubCategory Template Name"
                                        value={singleCategory.subcategoryname}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}></Grid>
                            <Grid item md={1} marginTop={3}></Grid>
                            <Grid item md={5}></Grid>
                            <Grid item md={2}></Grid>
                            <Grid item md={6} sm={12} xs={12}>
                                <Typography>Wishing Message</Typography>

                                {editTodo.length > 0 && (
                                    <ul type="none">
                                        {editTodo.map((item, index) => {
                                            return (
                                                <li key={index}>
                                                    <br />
                                                    <Grid sx={{ display: "flex" }}>
                                                        <FormControl fullWidth size="small">
                                                            <TextareaAutosize
                                                                aria-label="minimum height"
                                                                minRows={5}
                                                                value={item}
                                                                readOnly
                                                            />

                                                        </FormControl>
                                                        &emsp;
                                                        {/* <Button variant="contained" color="success" onClick={EditTodoPopup} type="button" sx={{ height: '30px', minWidth: '30px', marginTop: '5px', padding: '6px 10px' }}><FaPlus /></Button>&nbsp; */}
                                                        &emsp;
                                                        {/* <Button variant="contained" color="error" type="button" onClick={(e) => deleteTodo(index)} sx={{ height: '30px', minWidth: '30px', marginTop: '5px', padding: '6px 10px' }}><AiOutlineClose /></Button> */}
                                                    </Grid>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </Grid>
                            <Grid item md={1} marginTop={3}></Grid>
                            <Grid item md={5}></Grid>
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
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            handlViewClose();
                                        }}
                                    >
                                        Back
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </Box>
            <br />
            {isUserRoleCompare?.includes("acategorymaster") && (
                <>
                    <Box sx={userStyle.container}>



                        <Grid container spacing={2}>

                            <Grid item md={1}></Grid>
                            <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        {" "}
                                        Footer Message<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        placeholder="Please Enter Footer"
                                        value={footermessage}
                                        onChange={(e) => setfooterMessage(e.target.value)}
                                    />

                                </FormControl>

                            </Grid>

                            <Grid item md={1} marginTop={3}></Grid>
                            <Grid item md={5}></Grid>
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
                                        variant="contained"
                                        // loading={btnSubmit}
                                        onClick={handleUpdateFooter}
                                    // disabled={isBtn}
                                    >
                                        Update
                                    </LoadingButton>
                                    <Button sx={userStyle.btncancel} onClick={handleClearFooter}>
                                        CLEAR
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </>
            )}
            <br />
            <br />
            <br />
            <br />
            {isUserRoleCompare?.includes("lcategorymaster") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.HeaderText}>
                                    All Poster Settings List
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
                                        <label htmlFor="pageSizeSelect">&ensp;</label>
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
                                        {isUserRoleCompare?.includes("excelcategorymaster") && (
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
                                        {isUserRoleCompare?.includes("csvcategorymaster") && (
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
                                        {isUserRoleCompare?.includes("printcategorymaster") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfcategorymaster") && (
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
                                        {isUserRoleCompare?.includes("imagecategorymaster") && (
                                            <>
                                                <Button
                                                    sx={userStyle.buttongrp}
                                                    onClick={handleCaptureImage}
                                                >
                                                    {" "}
                                                    <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                    &ensp;Image&ensp;{" "}
                                                </Button>
                                            </>
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
                            <br />
                            <Button
                                sx={userStyle.buttongrp}
                                onClick={() => {
                                    handleShowAllColumns();
                                    setColumnVisibility(initialColumnVisibility);
                                }}
                            >
                                Show All Columns
                            </Button>
                            &emsp;
                            <Button
                                sx={userStyle.buttongrp}
                                onClick={handleOpenManageColumns}
                            >
                                Manage Columns
                            </Button>
                            &emsp;
                     
                            <br />
                            <br />
                            {/* ****** Table start ****** */}
                            <Box
                                style={{
                                    width: "100%",
                                    overflowY: "hidden", // Hide the y-axis scrollbar
                                }}
                            >
                                <br />
                                <StyledDataGrid
                                    rows={rowsWithCheckboxes}
                                    density="compact"
                                    columns={columnDataTable.filter(
                                        (column) => columnVisibility[column.field]
                                    )} // Only render visible columns
                                    onSelectionModelChange={handleSelectionChange}
                                    autoHeight={true}
                                    hideFooter
                                    ref={gridRef}
                                    getRowClassName={getRowClassName}
                                    selectionModel={selectedRows}
                                    disableRowSelectionOnClick
                                />
                            </Box>
                        </Grid>
                        <Box style={userStyle.dataTablestyle}>
                            <Box>
                                Showing{" "}
                                {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                                {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                                {filteredDatas.length} entries
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
                        <TableContainer component={Paper} sx={userStyle.printcls}>
                            <Table
                                sx={{ minWidth: 700 }}
                                aria-label="customized table"
                                id="jobopening"
                                ref={componentRef}
                            >
                                <TableHead sx={{ fontWeight: "600" }}>
                                    <StyledTableRow>
                                        <StyledTableCell>SNo</StyledTableCell>
                                        <StyledTableCell>Category Template Name</StyledTableCell>

                                        <StyledTableCell>Sub Category Template Name</StyledTableCell>
                                        <StyledTableCell>Wishing Message</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody align="left">
                                    {rowDataTable?.length > 0 ? (
                                        rowDataTable?.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                <StyledTableCell>{row.categoryname}</StyledTableCell>

                                                <StyledTableCell>
                                                    {row?.subcategoryname}
                                                </StyledTableCell>
                                                <StyledTableCell>{row.wishingmessage}</StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                    ) : (
                                        <StyledTableRow>
                                            {" "}
                                            <StyledTableCell colSpan={7} align="center">
                                                No Data Available
                                            </StyledTableCell>{" "}
                                        </StyledTableRow>
                                    )}
                                    <StyledTableRow></StyledTableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/* Manage Column */}
                    </Box>
                </>
            )}
            <br />
            <br />


            <Dialog
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                >
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "80px", color: "orange" }}
                    />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                        Are you sure?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            handlecheckIsSupportExist("del");
                        }}
                        autoFocus
                        variant="contained"
                        color="error"
                    >
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* overall edit */}
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
                        <Grid>
                            <Button
                                variant="contained"
                                style={{
                                    padding: "7px 13px",
                                    color: "white",
                                    background: "rgb(25, 118, 210)",
                                }}
                                onClick={() => {
                                    sendRequestEdit();
                                    handleCloseerrpop();
                                }}
                            >
                                ok
                            </Button>
                        </Grid>

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
                            }}
                            onClick={handleCloseerrpop}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* overall delete */}
            {/* Check Delete Modal */}
            <Box>
                <>
                    <Box>
                        {/* ALERT DIALOG */}
                        <Dialog
                            open={isCheckOpen}
                            onClose={handleCloseCheck}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogContent
                                sx={{
                                    width: "350px",
                                    textAlign: "center",
                                    alignItems: "center",
                                }}
                            >
                                <ErrorOutlineOutlinedIcon
                                    sx={{ fontSize: "80px", color: "orange" }}
                                />

                                <Typography
                                    variant="h6"
                                    sx={{ color: "black", textAlign: "center" }}
                                >
                                    {checkUser > 0 ? (
                                        <>
                                            <span
                                                style={{ fontWeight: "700", color: "#777" }}
                                            >{`Poster Settings`}</span>
                                            was linked

                                        </>
                                    ) : (
                                        ""
                                    )}
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={handleCloseCheck}
                                    autoFocus
                                    variant="contained"
                                    color="error"
                                >
                                    {" "}
                                    OK{" "}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </>
            </Box>
            {/* ALERT DIALOG */}
            <Dialog
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                >
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "70px", color: "orange" }}
                    />
                    <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                        Please Select any Row
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        variant="contained"
                        color="error"
                        onClick={handleCloseModalert}
                    >
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* this is info view details */}
            <Dialog
                open={openInfo}
                onClose={handleCloseinfo}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            Poster Settings Info
                        </Typography>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">addedby</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {"SNO"}.
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {"UserName"}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"Date"}
                                            </StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {addedby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {i + 1}.
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {item.name}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                                                    </StyledTableCell>
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
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {"SNO"}.
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"UserName"}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"Date"}
                                            </StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {updateby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {i + 1}.
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {item.name}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                                                    </StyledTableCell>
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
            <Box>
                <Dialog
                    open={isDeleteOpencheckbox}
                    onClose={handleCloseModcheckbox}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "80px", color: "orange" }}
                        />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={() => {
                                handlecheckIsSupportExist("bulkdel");
                            }}
                        >
                            {" "}
                            OK{" "}
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
                    {fileFormat === "csv" ? (
                        <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
                    ) : (
                        <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
                    )}

                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
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

export default PosterMessageSetting;
