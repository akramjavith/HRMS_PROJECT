import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog,
    DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead,
    TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton
} from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaPlus, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import axios from "axios";
import { SERVICE } from '../../services/Baseservice';
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import moment from 'moment-timezone';
import { UserRoleAccessContext, AuthContext } from '../../context/Appcontext';
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import ExcelJS from 'exceljs';
import { saveAs } from "file-saver";
import Papa from "papaparse";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import { MultiSelect } from "react-multi-select-component";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LoadingButton from "@mui/lab/LoadingButton";
function SubSubComponent() {

    const [subsubcomponent, setSubsubcomponent] = useState({ categoryname: "", subcategoryname: "", subsubname: "" });

    const [subsubcomponentEdit, setSubsubcomponentEdit] = useState({ categoryname: "", subcategoryname: "", subsubname: "" })
    const [subsusbcomponents, setSubsubcomponents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allSubsubcomponentedit, setAllSubsubcomponentedit] = useState([]);
    const [selectedRowsCount, setSelectedRowsCount] = useState(0);
    const { isUserRoleCompare, allProjects, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [subsubcomponentCheck, setSubsubcomponentcheck] = useState(false);

    const username = isUserRoleAccess.username

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);
    const [isBtn, setIsBtn] = useState(false);


    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [copiedData, setCopiedData] = useState('');



    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const [fileFormat, setFormat] = useState('')
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const handleExportXL = (isfilter) => {
        if (isfilter === "filtered") {
            exportToCSV(
                filteredData?.map((t, index) => ({
                    "Sno": index + 1,
                    "Category": t.categoryname.join(", "),
                    "Subcategory": t.subcategoryname.join(","),
                    "Subsub Name": t.subsubname,
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                items.map((t, index) => ({
                    "Sno": index + 1,
                    "Category": t.categoryname.join(", "),
                    "Subcategory": t.subcategoryname.join(","),
                    "Subsub Name": t.subsubname,
                })),
                fileName,
            );

        }

        setIsFilterOpen(false)
    };



    const downloadPdf = (isfilter) => {
        const doc = new jsPDF();
        // Initialize serial number counter
        let serialNumberCounter = 1;

        // Modify columns to include serial number column
        const columnsWithSerial = [
            { title: "SNo", dataKey: "serialNumber" }, // Serial number column
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];

        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            filteredData.map(item => ({
                serialNumber: serialNumberCounter++,
                categoryname: item.categoryname.join(", "),
                subcategoryname: item.subcategoryname.join(","),
                subsubname: item.subsubname,
             
            })) :
            items?.map(item => ({
                serialNumber: serialNumberCounter++,
                categoryname: item.categoryname.join(", "),
                subcategoryname: item.subcategoryname.join(","),
                subsubname: item.subsubname,
            }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 4,
            },
            columns: columnsWithSerial,
            body: dataWithSerial,
        });

        doc.save("Subsubcomponent.pdf");
    };












    const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
    let [valueCate, setValueCate] = useState("");

    const handleCategoryChange = (options) => {
        setValueCate(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCate(options);
    };

    const customValueRendererCate = (valueCate, _categorys) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Category";
    };

    // Edit functionlity
    const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]);

    const handleCategoryChangeEdit = (options) => {
        // setValueCateEdit(options.map((a, index) => {
        //     return a.value
        // }))
        setSelectedOptionsCateEdit(options);
        fetchCategoryBasedEdit(options.map(item => item.value));
    };

    const customValueRendererCateEdit = (valueCateEdit, _categorys) => {
        return valueCateEdit.length ? valueCateEdit.map(({ label }) => label).join(", ") : "Please Select Category";
    };

    // multi select sub category

    // Subcategroy multi select
    const [selectedOptionsSubCate, setSelectedOptionsSubCate] = useState([]);
    let [valueSubCate, setValueSubCate] = useState("");

    const handleSubCategoryChange = (options) => {
        setValueSubCate(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsSubCate(options);
    };

    const customValueRendererSubCate = (valueSubCate, _subcategorys) => {
        return valueSubCate.length ? valueSubCate.map(({ label }) => label).join(", ") : "Please Select Subcategory";
    };

    // Edit functionlity
    const [selectedOptionsSubCateEdit, setSelectedOptionsSubCateEdit] = useState([]);
    let [valueSubCateEdit, setValueSubCateEdit] = useState("");

    const handleSubCategoryChangeEdit = (options) => {
        // setValueSubCateEdit(options.map((a, index) => {
        //     return a.value
        // }))
        setSelectedOptionsSubCateEdit(options);
    };

    const customValueRendererSubCateEdit = (valueSubCateEdit, _subcategorys) => {
        return valueSubCateEdit.length ? valueSubCateEdit.map(({ label }) => label).join(", ") : "Please Select Subcategory";
    };


    const [openviewalert, setOpenviewalert] = useState(false);
    // view model
    const handleClickOpenviewalert = () => {
        setOpenviewalert(true);
    };

    const handleCloseviewalert = () => {
        setOpenviewalert(false);
    };


    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Subsubcomponent.png');
                });
            });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    const [ovProj, setOvProj] = useState("");
    const [getOverAllCount, setGetOverallCount] = useState("");
    const [ovProjCount, setOvProjCount] = useState("");
    const [ovProjDelete, setOvProjDelete] = useState("");
    const [getOverAllCountDelete, setGetOverallCountDelete] = useState("");
    const [ovProjCountDelete, setOvProjCountDelete] = useState("");

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
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };


    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
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
            getOverallEditSectionOverallDelete(selectedRows)

        }

    };


    //overall edit section for all pages
    const getOverallEditSectionOverallDelete = async (ids) => {
        try {
  
            let res = await axios.post(SERVICE.OVERALL_BULK_SUBSUBCOMPONENT_TICKET_DELETE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                id: ids
            });
            setSelectedRows(res?.data?.result);
            setSelectedRowsCount(res?.data?.count)
            setSelectAllChecked(
                res?.data?.count === filteredData.length
              );
            setIsDeleteOpencheckbox(true);
  
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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
        subcategoryname: true,
        subsubname: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    const [deleteSubsub, setDeleteSubsub] = useState("");


    const rowData = async (id, name) => {
        try {
            let res = await axios.get(`${SERVICE.SUBSUBCOMPONENT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteSubsub(res?.data?.ssubsubcomponent);
            setOvProjDelete(res?.data?.ssubsubcomponent?.subsubname);
            getOverallEditSectionDelete(res?.data?.ssubsubcomponent?.subsubname);



       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }



    //overall edit section for all pages
    const getOverallEditSectionDelete = async (e) => {
        try {
            let res = await axios.post(SERVICE.OVERALL_SUBSUBCOMPONENT_TICKET_DELETE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                oldname: e,
            });
            setOvProjCountDelete(res?.data?.count);
            setGetOverallCountDelete(`The Sub SubCategory Data is linked in 
         ${res?.data?.reason?.length > 0 ? "Reason Master," : ""}
         ${res?.data?.resolverreason?.length > 0 ? "Resolver Reason Master," : ""}
         ${res?.data?.selfcheck?.length > 0 ? "Self CheckPoint Master," : ""}
         ${res?.data?.checkpoint?.length > 0 ? "CheckPoint Master Master," : ""}
         ${res?.data?.teamgroup?.length > 0 ? "TeamGrouping Master," : ""}
         ${res?.data?.priority?.length > 0 ? "Priority Master," : ""}
         ${res?.data?.duedate?.length > 0 ? "DueDate Master," : ""}
         ${res?.data?.requiredfield?.length > 0 ? "Required Field Master," : ""}
         ${res?.data?.typegroup?.length > 0 ? "Type Group Master," : ""}
         ${res?.data?.raisemaster?.length > 0 ? "Raise Ticket Master," : ""}`);

            if (res?.data?.count > 0) {
                handleClickOpenCheck();
            } else {
                handleClickOpen();
            }



        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };










    // Alert delete popup
    let Subsubsid = deleteSubsub?._id;
    const delSubsub = async (e) => {

        try {
            if (Subsubsid) {
                await axios.delete(`${SERVICE.SUBSUBCOMPONENT_SINGLE}/${e}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
                await fetchSubsubcomponent();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1)
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"Deleted Successfully"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }

        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };



    const delSubsubcheckbox = async () => {
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.SUBSUBCOMPONENT_SINGLE}/${item}`, {
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

            await fetchSubsubcomponent();
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Deleted Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();


       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const [categorys, setCategorys] = useState([]);
    const [subcategorys, setSubcategorys] = useState([])


    const [categorysEdit, setCategorysEdit] = useState([]);
    const [subcategorysEdit, setSubcategorysEdit] = useState([])

    const fetchCategoryTicket = async () => {
        try {
            let res_category = await axios.get(SERVICE.CATEGORYTICKET, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let data_set = res_category.data.ticketcategory.map((d) => d.categoryname);
            let filter_opt = [...new Set(data_set)];

            setCategorys(
                filter_opt.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );

            setCategorysEdit(
                filter_opt.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const fetchCategoryBased = async (e) => {
        let employ = e.map((item) => item.value);

        try {
            let res_category = await axios.get(SERVICE.CATEGORYTICKET, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            let data_set = res_category.data.ticketcategory
                .filter((data) => {
                    return employ.includes(data.categoryname);
                })
                .map((value) => value.subcategoryname);

            let ans = [].concat(...data_set);

            let filter_opt = [...new Set(ans)];

            setSubcategorys(
                filter_opt.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );


         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchCategoryBasedEdit = async (e) => {
        // let employ = e.map((item) => item.value);

        try {
            let res_category = await axios.get(SERVICE.CATEGORYTICKET, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            let data_set = res_category.data.ticketcategory
                .filter((data) => {
                    return e.includes(data.categoryname);
                })
                .map((value) => value.subcategoryname);

            let ans = [].concat(...data_set);

            let filter_opt = [...new Set(ans)];

            setSubcategorysEdit(
                filter_opt.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };



    //add function 
    const sendRequest = async () => {
        setIsBtn(true)
        try {
            let subprojectscreate = await axios.post(SERVICE.SUBSUBCOMPONENT_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                categoryname: [...valueCate],
                subcategoryname: [...valueSubCate],
                subsubname: String(subsubcomponent.subsubname),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            })
            await fetchSubsubcomponent();
            setSubsubcomponent({ ...subsubcomponent, subsubname: "" })
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Added Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();
            setIsBtn(false)
        } catch (err) {setIsBtn(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    //submit option for saving
    const handleSubmit = (e) => {
        let categorys = selectedOptionsCate.map((item) => item.value);
        let subcategorys = selectedOptionsSubCate.map((item) => item.value);
        e.preventDefault();
        const isNameMatch = subsusbcomponents.some(item =>
            item.subsubname.toLowerCase() === (subsubcomponent.subsubname).toLowerCase()
            && item.categoryname.some((data) => categorys.includes(data))
            && item.subcategoryname.some((data) => subcategorys.includes(data)));
        if (selectedOptionsCate.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Category"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedOptionsSubCate.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select  Subcategory"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (subsubcomponent.subsubname === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Subsub Name"}</p>
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
                        {"Data already exists!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else {
            sendRequest();
        }

    }

    const handleClear = (e) => {
        e.preventDefault();
        setSubsubcomponent({ categoryname: "", subcategoryname: "", subsubname: "" })
        setSelectedOptionsCate([]);
        setSubcategorys([]);
        setSelectedOptionsSubCate([]);

        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon
                    sx={{ fontSize: "100px", color: "orange" }}
                />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"Cleared Successfully"}
                </p>
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
    };

    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const handleClickOpenCheck = () => {
        setisCheckOpen(true);
    };
    const handleCloseCheck = () => {
        setisCheckOpen(false);
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
        try {
            let res = await axios.get(`${SERVICE.SUBSUBCOMPONENT_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSubsubcomponentEdit(res?.data?.ssubsubcomponent);
            setOvProj(res?.data?.ssubsubcomponent?.subsubname);
            getOverallEditSection(res?.data?.ssubsubcomponent?.subsubname);
            fetchCategoryBasedEdit(res?.data?.ssubsubcomponent.categoryname);
            setSelectedOptionsCateEdit(res?.data?.ssubsubcomponent.categoryname.map((item) => ({
                ...item,
                label: item,
                value: item,
            })))
            setSelectedOptionsSubCateEdit(res?.data?.ssubsubcomponent.subcategoryname.map((item) => ({
                ...item,
                label: item,
                value: item,
            })))
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }


    //overall edit section for all pages
    const getOverallEditSection = async (e) => {
        try {

            let res = await axios.post(SERVICE.OVERALL_SUBSUBCOMPONENT_TICKET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                oldname: e,
            });
            setOvProjCount(res?.data?.count);
            setGetOverallCount(`The ${e} is linked in 
         ${res?.data?.reason?.length > 0 ? "Reason Master," : ""}
         ${res?.data?.resolverreason?.length > 0 ? "Resolver Reason Master," : ""}
         ${res?.data?.selfcheck?.length > 0 ? "Self CheckPoint Master," : ""}
         ${res?.data?.checkpoint?.length > 0 ? "CheckPoint Master Master," : ""}
         ${res?.data?.teamgroup?.length > 0 ? "TeamGrouping Master," : ""}
         ${res?.data?.priority?.length > 0 ? "Priority Master," : ""}
         ${res?.data?.duedate?.length > 0 ? "DueDate Master," : ""}
         ${res?.data?.requiredfield?.length > 0 ? "Required Field Master," : ""}
         ${res?.data?.typegroup?.length > 0 ? "Type Group Master," : ""}
         ${res?.data?.raisemaster?.length > 0 ? "Raise Ticket Master," : ""}
          whether you want to do changes ..??`);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //overall edit section for all pages
    const getOverallEditSectionUpdate = async () => {
        try {
            let res = await axios.post(SERVICE.OVERALL_SUBSUBCOMPONENT_TICKET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                oldname: ovProj,
            });
            sendEditRequestOverall(res?.data?.reason,
                res?.data?.resolverreason,
                res?.data?.selfcheck,
                res?.data?.checkpoint,
                res?.data?.teamgroup,
                res?.data?.priority,
                res?.data?.duedate,
                res?.data?.requiredfield,
                res?.data?.raisemaster,
                res?.data?.typegroup
            );
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const sendEditRequestOverall = async (reason,
        resolverreason
        , selfcheck
        , checkpoint
        , teamgroup
        , priority
        , duedate
        , requiredfield
        , raisemaster, typegroup) => {
        try {
            if (reason?.length > 0) {
                let answ = reason.map((d, i) => {
                    const subsubcategory = d?.subsubcategoryreason?.filter(data => data !== ovProj)
                    let res = axios.put(`${SERVICE.REASONMASTER_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        subsubcategoryreason: [...subsubcategory, subsubcomponentEdit?.subsubname],
                    });
                });
            }
            if (resolverreason.length > 0) {
                let answ = resolverreason.map((d, i) => {
                    const subsubcategory = d?.subsubcategoryreason?.filter(data => data !== ovProj)
                    let res = axios.put(`${SERVICE.RESOLVERREASONMASTER_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        subsubcategoryreason: [...subsubcategory, subsubcomponentEdit?.subsubname],
                    });
                });
            }
            if (selfcheck.length > 0) {
                let answ = selfcheck.map((d, i) => {
                    const subsubcategory = d?.subsubcategory?.filter(data => data !== ovProj)
                    let res = axios.put(`${SERVICE.SELFCHECKPOINTTICKET_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        subsubcategory: [...subsubcategory, subsubcomponentEdit?.subsubname],
                    });
                });
            }
            if (checkpoint.length > 0) {
                let answ = checkpoint.map((d, i) => {
                    const subsubcategory = d?.subsubcategory?.filter(data => data !== ovProj)
                    let res = axios.put(`${SERVICE.CHECKPOINTTICKET_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        subsubcategory: [...subsubcategory, subsubcomponentEdit?.subsubname],
                    });
                });
            }
            if (teamgroup.length > 0) {
                let answ = teamgroup.map((d, i) => {
                    const subsubcategory = d?.subsubcategoryfrom?.filter(data => data !== ovProj)
                    let res = axios.put(`${SERVICE.TEAMGROUPING_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        subsubcategoryfrom: [...subsubcategory, subsubcomponentEdit?.subsubname],
                    });
                });
            }
            if (priority.length > 0) {
                let answ = priority.map((d, i) => {
                    const subsubcategory = d?.subsubcategory?.filter(data => data !== ovProj)
                    let res = axios.put(`${SERVICE.PRIORITYMASTER_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        subsubcategory: [...subsubcategory, subsubcomponentEdit?.subsubname],
                    });
                });
            }
            if (duedate.length > 0) {
                let answ = duedate.map((d, i) => {
                    const subsubcategory = d?.subsubcategory?.filter(data => data !== ovProj)
                    let res = axios.put(`${SERVICE.DUEDATE_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        subsubcategory: [...subsubcategory, subsubcomponentEdit?.subsubname],
                    });
                });
            }
            if (requiredfield.length > 0) {
                let answ = requiredfield.map((d, i) => {
                    const subsubcategory = d?.subsubcategory?.filter(data => data !== ovProj)
                    let res = axios.put(`${SERVICE.REQUIREFIELDS_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        subsubcategory: [...subsubcategory, subsubcomponentEdit?.subsubname],
                    });
                });
            }
            if (raisemaster.length > 0) {
                let answ = raisemaster.map((d, i) => {
                    let res = axios.put(`${SERVICE.RAISETICKET_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        subsubcategory: subsubcomponentEdit?.subsubname,
                    });
                });
            }
            if (typegroup.length > 0) {
                let answ = typegroup.map((d, i) => {
                    const subsubcategory = d?.subsubcategorytype?.filter(data => data !== ovProj)
                    let res = axios.put(`${SERVICE.TYPEMASTER_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        subsubcategorytype: [...subsubcategory, subsubcomponentEdit?.subsubname],
                    });
                });
            }
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // get single row to view....






    // get single row to view....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.SUBSUBCOMPONENT_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSubsubcomponentEdit(res?.data?.ssubsubcomponent);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.SUBSUBCOMPONENT_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSubsubcomponentEdit(res?.data?.ssubsubcomponent);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    useEffect(() => {
        fetchCategoryTicket();
    }, [])




    //Project updateby edit page...
    let updateby = subsubcomponentEdit?.updatedby;
    let addedby = subsubcomponentEdit?.addedby;


    let subprojectsid = subsubcomponentEdit?._id;

    //editing the single data...
    const sendEditRequest = async () => {
        let empCate = selectedOptionsCateEdit.map((item) => item.value);
        let empSubcate = selectedOptionsSubCateEdit.map((item) => item.value);
        try {
            let res = await axios.put(`${SERVICE.SUBSUBCOMPONENT_SINGLE}/${subprojectsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                // categoryname: String(subsubcomponentEdit.categoryname),
                categoryname: [...empCate],
                subcategoryname: [...empSubcate],
                subsubname: String(subsubcomponentEdit.subsubname),
                updatedby: [
                    ...updateby, {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await getOverallEditSectionUpdate();fetchSubsubcomponent();

            handleCloseModEdit();
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
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    const editSubmit = async(e) => {
        e.preventDefault();
        let resdata = await fetchSubsubcomponentAll();
        let categorysEditt = selectedOptionsCateEdit.map((item) => item.value);
        let subcategorysEditt = selectedOptionsSubCateEdit.map((item) => item.value);
        const isNameMatch = resdata.some(item => item.subsubname.toLowerCase() === (subsubcomponentEdit.subsubname).toLowerCase()
            && item.categoryname.some((data) => categorysEditt.includes(data))
            && item.subcategoryname.some((data) => subcategorysEditt.includes(data)));
        if (selectedOptionsCateEdit.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Category"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedOptionsSubCateEdit.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select  Subcategory"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (subsubcomponentEdit.subsubname === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Subsub Name"}</p>
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
                        {"Data already exists!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (subsubcomponentEdit.subsubname != ovProj && ovProjCount > 0) {
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
    }



    //get all Sub vendormasters.
    const fetchSubsubcomponent = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.SUBSUBCOMPONENT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setSubsubcomponentcheck(true)
            setSubsubcomponents(res_vendor?.data?.subsubcomponents);
        } catch (err) {setSubsubcomponentcheck(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }


    //get all Sub vendormasters.
    const fetchSubsubcomponentAll = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.SUBSUBCOMPONENT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            return res_vendor?.data?.subsubcomponents.filter(item => item._id !== subsubcomponentEdit._id)
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }



    // pdf.....
    const columns = [
        { title: "Category", field: "categoryname" },
        { title: "Subcategory", field: "subcategoryname" },
        { title: "Subsub Name", field: "subsubname" },
    ]



    // Excel
    const fileName = "Subsubcomponent";

    const [subsubData, setSubsubData] = useState([]);


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Subsubcomponent',
        pageStyle: 'print'
    });

    useEffect(() => {
        fetchSubsubcomponent();
    }, [])

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
        const itemsWithSerialNumber = subsusbcomponents?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [subsusbcomponents])


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
        { field: "categoryname", headerName: "Category", flex: 0, width: 250, hide: !columnVisibility.categoryname, headerClassName: "bold-header" },
        { field: "subcategoryname", headerName: "Subcategory", flex: 0, width: 250, hide: !columnVisibility.subcategoryname, headerClassName: "bold-header" },
        { field: "subsubname", headerName: "Subsub Name", flex: 0, width: 250, hide: !columnVisibility.subsubname, headerClassName: "bold-header" },

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
                    {isUserRoleCompare?.includes("esubsubcategory") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {
                            handleClickOpenEdit();
                            getCode(params.row.id, params.row.name);
                        }}><EditOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                    )}
                    {isUserRoleCompare?.includes("dsubsubcategory") && (
                        <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.row.id, params.row.name) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                    )}
                    {isUserRoleCompare?.includes("vsubsubcategory") && (
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
                    {isUserRoleCompare?.includes("isubsubcategory") && (
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
            // categoryname: item.categoryname,
            categoryname: item.categoryname.join(",").toString(),
            subcategoryname: item.subcategoryname.join(",").toString(),
            // subcategoryname: item.subcategoryname,
            subsubname: item.subsubname,

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
                            // secondary={column.headerName }
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
            <Headtitle title={'Subsub Category'} />
            {/* ****** Header Content ****** */}
            {isUserRoleCompare?.includes("asubsubcategory") && (
                <>
                    <Typography sx={userStyle.HeaderText}> Subsub Category</Typography>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}> Add Subsub Category</Typography>
                                </Grid>
                            </Grid><br />
                            <Grid container spacing={2}>
                                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Category <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={categorys}
                                            value={selectedOptionsCate}
                                            onChange={(e) => {
                                                handleCategoryChange(e);
                                                fetchCategoryBased(e);
                                                setSelectedOptionsSubCate([]);
                                            }}
                                            valueRenderer={customValueRendererCate}
                                            labelledBy="Please Select Category"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Sub Category <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={subcategorys}
                                            value={selectedOptionsSubCate}
                                            onChange={handleSubCategoryChange}
                                            valueRenderer={customValueRendererSubCate}
                                            labelledBy="Please Select Subcategory"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            SubSub Name <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter SubSub Name"
                                            value={subsubcomponent.subsubname}
                                            onChange={(e) => {
                                                setSubsubcomponent({
                                                    ...subsubcomponent,
                                                    subsubname: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />  <br />
                            <Grid container spacing={2}>
                                <Grid item md={2.5} xs={12} sm={6}>
                                    <LoadingButton variant='contained' color='primary' onClick={handleSubmit} loading={isBtn}>Submit</LoadingButton>

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
                                        <Typography sx={userStyle.HeaderText}>Edit Subsub Category</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Category <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect className="custom-multi-select"
                                                id="component-outlined"
                                                options={categorysEdit}
                                                value={selectedOptionsCateEdit}
                                                // onChange={handleCategoryChangeEdit}
                                                onChange={(e) => {
                                                    handleCategoryChangeEdit(e);
                                                    setSelectedOptionsSubCateEdit([]);
                                                }}
                                                valueRenderer={customValueRendererCateEdit}
                                                labelledBy="Please Select Category" />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Sub Category <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={subcategorysEdit}
                                                value={selectedOptionsSubCateEdit}
                                                onChange={handleSubCategoryChangeEdit}
                                                valueRenderer={customValueRendererSubCateEdit}
                                                labelledBy="Please Select Subcategory"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                SubSub Name <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter SubSub Name"
                                                value={subsubcomponentEdit.subsubname}
                                                onChange={(e) => {
                                                    setSubsubcomponentEdit({
                                                        ...subsubcomponentEdit,
                                                        subsubname: e.target.value,
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
            {isUserRoleCompare?.includes("lsubsubcategory") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Subsub Category List</Typography>
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
                                    {isUserRoleCompare?.includes("excelsubsubcategory") && (
                                        // <>
                                        //     <ExportXL csvData={filteredData?.map((t, index) => ({
                                        //         "Sno": index + 1,
                                        //         "Category": t.categoryname.join(", "),
                                        //         "Subcategory": t.subcategoryname.join(","),
                                        //         "Subsub Name": t.subsubname,
                                        //     }))} fileName={fileName} />
                                        // </>
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>

                                    )}
                                    {isUserRoleCompare?.includes("csvsubsubcategory") && (
                                        // <>
                                        //     <ExportCSV csvData={filteredData?.map((t, index) => ({
                                        //         "Sno": index + 1,
                                        //         "Category": t.categoryname.join(", "),
                                        //         "Subcategory": t.subcategoryname.join(","),
                                        //         "Subsub Name": t.subsubname,
                                        //     }))} fileName={fileName} />

                                        // </>
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printsubsubcategory") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfsubsubcategory") && (
                                        // <>
                                        //     <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()} ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        // </>

                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagesubsubcategory") && (
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
                        {isUserRoleCompare?.includes("bdsubsubcategory") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button>)}


                        <br /><br />
                        {!subsubcomponentCheck ?
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
                            onClick={(e) => delSubsub(Subsubsid)}
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
                            <Typography sx={userStyle.HeaderText}>Subsub Category Info</Typography>
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
                                <TableCell> SI.No</TableCell>
                                <TableCell> Category</TableCell>
                                <TableCell>Subcategory</TableCell>
                                <TableCell>Subsub Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {filteredData &&
                                (filteredData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.categoryname.join(", ")}</TableCell>
                                        <TableCell>{row.subcategoryname.join(", ")}</TableCell>
                                        <TableCell>{row.subsubname}</TableCell>
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
                maxWidth="lg"
            >
                <Box sx={{ width: "750px", padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Subsub Category</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Category</Typography>
                                    <Typography>{subsubcomponentEdit.categoryname + ","}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Subcategory</Typography>
                                    <Typography>{subsubcomponentEdit.subcategoryname + ","}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Subsub Name</Typography>
                                    <Typography>{subsubcomponentEdit.subsubname}</Typography>
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
            {/* Check delete Modal */}
            <Box>
                <>
                    <Box>
                        {/* ALERT DIALOG */}
                        <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                            <DialogContent
                                sx={{
                                    width: "350px",
                                    textAlign: "center",
                                    alignItems: "center",
                                }}
                            >
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                                <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                                    {getOverAllCountDelete}
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
{/* 
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
                            onClick={(e) => delSubsubcheckbox(e)}
                        > OK </Button>
                    </DialogActions>
                </Dialog>

            </Box> */}
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
                                <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Cancel</Button>
                                <Button variant="contained" color='error'
                                    onClick={(e) => delSubsubcheckbox(e)}
                                > OK </Button>
                            </>
                            :
                            <Button variant="contained" color='error' onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Ok</Button>
                        }
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

              {/*Export XL Data  */}
              <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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
            {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
              :
              <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
            }
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              Choose Export
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus variant="contained"
              onClick={(e) => {
                handleExportXL("filtered")
              }}
            >
              Export Filtered Data
            </Button>
            <Button autoFocus variant="contained"
              onClick={(e) => {
                handleExportXL("overall")
              }}
            >
              Export Over All Data
            </Button>
          </DialogActions>
        </Dialog>
        {/*Export pdf Data  */}
        <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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
                downloadPdf("filtered")
                setIsPdfFilterOpen(false);
              }}
            >
              Export Filtered Data
            </Button>
            <Button variant="contained"
              onClick={(e) => {
                downloadPdf("overall")
                setIsPdfFilterOpen(false);
              }}
            >
              Export Over All Data
            </Button>
          </DialogActions>
        </Dialog>


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
        </Box>
    );
}


export default SubSubComponent;