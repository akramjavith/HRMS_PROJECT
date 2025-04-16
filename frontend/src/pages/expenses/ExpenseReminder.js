import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog,
    DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead,
    TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton
} from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { handleApiError } from "../../components/Errorhandling";
import { FaPrint, FaFilePdf, FaPlus } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {daysOptions,frequencyOptions} from "../../components/Componentkeyword";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import axios from "axios";
import { SERVICE } from '../../services/Baseservice';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import StyledDataGrid from "../../components/TableStyle";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import moment from 'moment-timezone';
import { UserRoleAccessContext, AuthContext } from '../../context/Appcontext';
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from 'react-loader-spinner';
import Selects from "react-select";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';

function ExpenseReminder() {

    const [remainder, setRemainder] = useState({categoryexpense: "Please Select Category", subcategoryexpense: "Please Select Subcategory", frequency: "Please Select Frequency",date:"Please Select Date",day:"Please Select Day",month:"Please Select Month" });

    const [remainderEdit, setRemainderEdit] = useState({ categoryexpense: "Please Select Category", subcategoryexpense: "Please Select Subcategory", frequency: "Please Select Frequency",date:"Please Select Date",day:"Please Select Day",month:"Please Select Month" })
    const [remainders, setRemainders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [remainderCheck, setRemaindercheck] = useState(false);
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'ExpenseReminder.png');
                });
            });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    const [dateOptions,setDateOptions] = useState()
    const [monthsOptions,setMonthsOptions] = useState()

      //function to generate Days
  const generateDaysOptions = () => {
    const daysOpt = [];
    for (let i = 1; i <= 31; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      daysOpt.push({ value: i.toString(), label: i.toString() });
    }
    setDateOptions(daysOpt);
  };

  const generateMonthsOptions = () => {
    const mnthsOpt = [];
    for (let i = 1; i <= 12; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      mnthsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setMonthsOptions(mnthsOpt);
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
        categoryexpense: true,
        subcategoryexpense: true,
        frequency: true,
        date: true,
        day: true,
        month: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    const [deleteRemainder, setDeleteRemainder] = useState("");


    const rowData = async (id, name) => {
        try {
            let res = await axios.get(`${SERVICE.EXPENSEREMINDER_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteRemainder(res?.data?.sexpensereminder);
            handleClickOpen();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    // Alert delete popup
    let Remaindersid = deleteRemainder?._id;
    const delRemainder = async (e) => {

        try {
            if (Remaindersid) {
                await axios.delete(`${SERVICE.EXPENSEREMINDER_SINGLE}/${e}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
                await fetchRemainder();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1)
                setShowAlert(
                    <>
                      {" "}
                      <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Deleted Successfully👍"} </p>{" "}
                    </>
                  );
                  handleClickOpenerr();
            }
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const delRemaindercheckbox = async () => {
        try {
            
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.EXPENSEREMINDER_SINGLE}/${item}`, {
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

            await fetchRemainder();
            setShowAlert(
                <>
                  {" "}
                  <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Deleted Successfully👍"} </p>{" "}
                </>
              );
              handleClickOpenerr();
            } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const [categorys, setCategorys] = useState([]);
    const [subcategorys, setSubcategorys] = useState([])


    const [categorysEdit, setCategorysEdit] = useState([]);
    const [subcategorysEdit, setSubcategorysEdit] = useState([])

    const fetchCategoryExpense = async () => {
        try {
            let res_category = await axios.get(SERVICE.EXPENSECATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const categoryall = [...res_category?.data?.expensecategory.map((d) => (
                {
                    ...d,
                    label: d.categoryname,
                    value: d.categoryname
                }
            ))];

            setCategorys(categoryall);
            setCategorysEdit(categoryall);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const fetchCategoryBased = async (e) => {

        try {
            let res_category = await axios.get(SERVICE.EXPENSECATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });


            let data_set = res_category?.data?.expensecategory.filter((data) => {
                return e.value === data.categoryname
            }).map((data) => data.subcategoryname)
            let ans = [].concat(...data_set)
  
            setSubcategorys(
                ans.map((d) => ({
                    ...d,
                    label: d,
                    value: d,

                }))
            )
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const fetchCategoryBasedEdit = async (e) => {

        try {
            let res_category = await axios.get(SERVICE.EXPENSECATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            let data_set = res_category?.data?.expensecategory.filter((data) => {
                return e === data.categoryname
            }).map((data) => data.subcategoryname)
            let ans = [].concat(...data_set)

            setSubcategorysEdit(
                ans.map((d) => ({
                    ...d,
                    label: d,
                    value: d,

                }))
            )
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //add function 
    const sendRequest = async () => {
        try {
            let subprojectscreate = await axios.post(SERVICE.EXPENSEREMINDER_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                categoryexpense: String(remainder.categoryexpense),
                subcategoryexpense: String(remainder.subcategoryexpense),
                frequency: String(remainder.frequency),
                date: String((remainder.frequency === "One Month" || remainder.frequency === "Two Months" || remainder.frequency === "Three Months" || remainder.frequency === "Four Months" || remainder.frequency === "Five Months" || remainder.frequency === "Six Months" || remainder.frequency === "Yearly") ?  remainder.date : ""),
                day: String(remainder.frequency === "Weekly" ? remainder.day : ""),
                month: String(remainder.frequency === "Yearly" ? remainder.month : ""),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            })
            await fetchRemainder();
            setRemainder({ ...remainder });
            setShowAlert(
                <>
                  {" "}
                  <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Added Successfully👍"} </p>{" "}
                </>
              );
              handleClickOpenerr();
            } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = remainders.some(item =>
            item.categoryexpense === remainder.categoryexpense &&
            item.subcategoryexpense === remainder.subcategoryexpense
            && item.frequency === remainder.frequency);

        if (remainder.categoryexpense === "Please Select Category") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Category"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (remainder.subcategoryexpense === "Please Select Subcategory") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Subcategory"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (remainder.frequency === "Please Select Frequency") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Frequency"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (remainder.frequency === "Yearly" && remainder.month === "Please Select Month") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Month"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (remainder.frequency === "Weekly" && remainder.day === "Please Select Day") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Day"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if ((remainder.frequency === "One Month" || remainder.frequency === "Two Months" || remainder.frequency === "Three Months" || remainder.frequency === "Four Months" || remainder.frequency === "Five Months" || remainder.frequency === "Six Months" || remainder.frequency === "Yearly") && remainder.date === "Please Select Date") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Date"}</p>
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
                        {"Expense Reminder already exits!"}
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
        setRemainder({ categoryexpense: "Please Select Category", subcategoryexpense: "Please Select Subcategory", frequency: "Please Select Frequency",date:"Please Select Date",day:"Please Select Day",month:"Please Select Month"});
        setSubcategorys([]);
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
            let res = await axios.get(`${SERVICE.EXPENSEREMINDER_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setRemainderEdit(res?.data?.sexpensereminder);
            fetchCategoryBasedEdit(res?.data?.sexpensereminder?.categoryexpense);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }


    // get single row to view....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.EXPENSEREMINDER_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setRemainderEdit(res?.data?.sexpensereminder);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.EXPENSEREMINDER_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setRemainderEdit(res?.data?.sexpensereminder);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    useEffect(() => {
        fetchCategoryExpense();
        generateDaysOptions();
        generateMonthsOptions();
    }, [])




    //Project updateby edit page...
    let updateby = remainderEdit?.updatedby;
    let addedby = remainderEdit?.addedby;


    let subprojectsid = remainderEdit?._id;

    //editing the single data...
    const sendEditRequest = async () => {
        try {
            let res = await axios.put(`${SERVICE.EXPENSEREMINDER_SINGLE}/${subprojectsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                categoryexpense: String(remainderEdit.categoryexpense),
                subcategoryexpense: String(remainderEdit.subcategoryexpense),
                frequency: String(remainderEdit.frequency),
                date: String((remainderEdit.frequency === "One Month" || remainderEdit.frequency === "Two Months" || remainderEdit.frequency === "Three Months" || remainderEdit.frequency === "Four Months" || remainderEdit.frequency === "Five Months" || remainderEdit.frequency === "Six Months" || remainderEdit.frequency === "Yearly") ?  remainderEdit.date : ""),
                day: String(remainderEdit.frequency === "Weekly" ? remainderEdit.day : ""),
                month: String(remainderEdit.frequency === "Yearly" ? remainderEdit.month : ""),
                updatedby: [
                    ...updateby, {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchRemainder();
            handleCloseModEdit();
            setShowAlert(
                <>
                  {" "}
                  <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Updated Successfully👍"} </p>{" "}
                </>
              );
              handleClickOpenerr();
            } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    const editSubmit = async (e) => {
        e.preventDefault();
        let resdata = await fetchRemainderAll();
        const isNameMatch = resdata.some(item => item.categoryexpense === remainderEdit.categoryexpense && item.subcategoryexpense === remainderEdit.subcategoryexpense
            && item.frequency === remainderEdit.frequency);

        if (remainderEdit.categoryexpense === "Please Select Category") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Category"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (remainderEdit.subcategoryexpense === "Please Select Subcategory") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Subcategory"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (remainderEdit.frequency === "Please Select Frequency") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Frequency"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (remainderEdit.frequency === "Yearly" && (remainderEdit.month === "Please Select Month" || remainderEdit.month === "")) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Month"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (remainderEdit.frequency === "Weekly" && (remainderEdit.day === "Please Select Day" || remainderEdit.day === "")) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Day"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if ((remainderEdit.frequency === "One Month" || remainderEdit.frequency === "Two Months" || remainderEdit.frequency === "Three Months" || remainderEdit.frequency === "Four Months" || remainderEdit.frequency === "Five Months" || remainderEdit.frequency === "Six Months" || remainderEdit.frequency === "Yearly") && (remainderEdit.date === "Please Select Date" || remainderEdit.date === "")) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Date"}</p>
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
                        {"Expense Reminder already exits!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }


        else {
            sendEditRequest();
        }
    }



    //get all Sub vendormasters.
    const fetchRemainder = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.EXPENSEREMINDER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setRemaindercheck(true)
            setRemainders(res_vendor?.data?.expensereminders);
        } catch (err) {setRemaindercheck(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }


    //get all Sub vendormasters.
    const fetchRemainderAll = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.EXPENSEREMINDER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            return res_vendor?.data?.expensereminders.filter(item => item._id !== remainderEdit._id)
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }
    // pdf.....
    const columns = [
        { title: "Sno", field: "serialNumber" },
        { title: "Expense Category", field: "categoryexpense" },
        { title: "Expense Subcategory", field: "subcategoryexpense" },
        { title: "Frequency", field: "frequency" },
        { title: "Date", field: "date" },
        { title: "Day", field: "day" },
        { title: "Month", field: "month" },
    ]

    const downloadPdf = () => {

        const doc = new jsPDF()
        doc.autoTable({
            theme: "grid",
            columns: columns.map(col => ({ ...col, dataKey: col.field })),
            body: items
        })
        doc.save('ExpenseReminder.pdf')
    }

    // Excel
    const fileName = "ExpenseReminder";

    const [typeData, setTypeData] = useState([]);

    // get particular columns for export excel 
    const getexcelDatas = () => {

        var data = remainders?.map((t, index) => ({
            "Sno": index + 1,
            "Expense Category": t.categoryexpense,
            "Expense Subcategory": t.subcategoryexpense,
            "Frequency": t.frequency,
            "Date": t.date,
            "Day": t.day,
            "Month": t.month,
        }));
        setTypeData(data);

    }

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'ExpenseReminder',
        pageStyle: 'print'
    });

    useEffect(() => {
        getexcelDatas();
    }, [remainderEdit, remainder, remainders])

    useEffect(() => {
        fetchRemainder();
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
        const itemsWithSerialNumber = remainders?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [remainders])


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
        { field: "categoryexpense", headerName: "Expense Category", flex: 0, width: 150, hide: !columnVisibility.categoryexpense, headerClassName: "bold-header" },
        { field: "subcategoryexpense", headerName: "Expense Subcategory", flex: 0, width: 180, hide: !columnVisibility.subcategoryexpense, headerClassName: "bold-header" },
        { field: "frequency", headerName: "Frequency", flex: 0, width: 150, hide: !columnVisibility.frequency, headerClassName: "bold-header" },
        { field: "date", headerName: "Date", flex: 0, width: 100, hide: !columnVisibility.date, headerClassName: "bold-header" },
        { field: "day", headerName: "Day", flex: 0, width: 100, hide: !columnVisibility.day, headerClassName: "bold-header" },
        { field: "month", headerName: "Month", flex: 0, width: 100, hide: !columnVisibility.month, headerClassName: "bold-header" },

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
                    {isUserRoleCompare?.includes("eexpensereminder") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {
                            handleClickOpenEdit();
                            getCode(params.row.id, params.row.name);
                        }}><EditOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                    )}
                    {isUserRoleCompare?.includes("dexpensereminder") && (
                        <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.row.id, params.row.name) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                    )}
                    {isUserRoleCompare?.includes("vexpensereminder") && (
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
                    {isUserRoleCompare?.includes("iexpensereminder") && (
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
            categoryexpense: item.categoryexpense,
            subcategoryexpense: item.subcategoryexpense,
            frequency: item.frequency,
            date: item.date,
            day: item.day,
            month: item.month,

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
            <Headtitle title={'EXPENSE REMINDER'} />
            {/* ****** Header Content ****** */}
            {isUserRoleCompare?.includes("aexpensereminder") && (
                <>
                    <Typography sx={userStyle.HeaderText}>Manage Expense Reminder</Typography>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Add Expense Reminder</Typography>
                                </Grid>
                            </Grid><br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Expense Category<b style={{ color: "red" }}>*</b></Typography>
                                        <Selects
                                            options={categorys}
                                            styles={colourStyles}
                                            value={{ label: remainder.categoryexpense, value: remainder.categoryexpense }}
                                            onChange={(e) => { setRemainder({ ...remainder, categoryexpense: e.value, subcategoryexpense: "Please Select Subcategory" }); fetchCategoryBased(e); }}

                                        />
                                    </FormControl> 
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Expense Subcategory<b style={{ color: "red" }}>*</b></Typography>
                                        <Selects
                                            options={subcategorys}
                                            styles={colourStyles}
                                            value={{ label: remainder.subcategoryexpense, value: remainder.subcategoryexpense }}
                                            onChange={(e) => { setRemainder({ ...remainder, subcategoryexpense: e.value }) }}

                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Frequency<b style={{ color: "red" }}>*</b></Typography>

                                        <Selects
                                            options={frequencyOptions}
                                            styles={colourStyles}
                                            value={{ label: remainder.frequency, value: remainder.frequency }}
                                            onChange={(e) => {
                                                setRemainder({ ...remainder, frequency: e.value });
                                            }}

                                        />

                                    </FormControl>
                                </Grid>
                                {( remainder.frequency === "Yearly" ) && 
                                <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Month<b style={{ color: "red" }}>*</b></Typography>
                                    <Selects
                                        options={monthsOptions}
                                        styles={colourStyles}
                                        value={{ label: remainder.month, value: remainder.month }}
                                        onChange={(e) => {
                                            setRemainder({ ...remainder, month: e.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid> }
                                {( remainder.frequency === "One Month" || remainder.frequency === "Two Months" || remainder.frequency === "Three Months" || remainder.frequency === "Four Months" || remainder.frequency === "Five Months" || remainder.frequency === "Six Months" || remainder.frequency === "Yearly") && 
                                <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Date<b style={{ color: "red" }}>*</b></Typography>

                                    <Selects
                                        options={dateOptions}
                                        styles={colourStyles}
                                        value={{ label: remainder.date, value: remainder.date }}
                                        onChange={(e) => {
                                            setRemainder({ ...remainder, date: e.value });
                                        }}

                                    />

                                </FormControl>
                            </Grid> }
                                {( remainder.frequency === "Weekly" ) && 
                                <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Day<b style={{ color: "red" }}>*</b></Typography>
                                    <Selects
                                        options={daysOptions}
                                        styles={colourStyles}
                                        value={{ label: remainder.day, value: remainder.day }}
                                        onChange={(e) => {
                                            setRemainder({ ...remainder, day: e.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid> }

                                
                                
                            </Grid>
                            <br />  <br />
                            <Grid container spacing={2}>
                                <Grid item md={2.5} xs={12} sm={6}>
                                    <Button variant='contained' color='primary' onClick={handleSubmit}>Submit</Button>

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
                    maxWidth="sm"
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
                                        <Typography sx={userStyle.HeaderText}>Edit Expense Reminder</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Expense Category<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={categorysEdit}
                                                styles={colourStyles}
                                                value={{ label: remainderEdit.categoryexpense, value: remainderEdit.categoryexpense }}
                                                onChange={(e) => { setRemainderEdit({ ...remainderEdit, categoryexpense: e.value, subcategoryexpense: "Please Select Subcategory", }); fetchCategoryBasedEdit(e.value); }}

                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Expense Subcategory<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={subcategorysEdit}
                                                styles={colourStyles}
                                                value={{ label: remainderEdit.subcategoryexpense, value: remainderEdit.subcategoryexpense }}
                                                onChange={(e) => { setRemainderEdit({ ...remainderEdit, subcategoryexpense: e.value }) }}

                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Frequency <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={frequencyOptions}
                                                styles={colourStyles}
                                                value={{ label: remainderEdit.frequency, value: remainderEdit.frequency }}
                                                onChange={(e) => {
                                                    setRemainderEdit({ ...remainderEdit, frequency: e.value });
                                                }}

                                            />
                                        </FormControl>
                                    </Grid>
                                    {( remainderEdit.frequency === "Yearly" ) && 
                                <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Month<b style={{ color: "red" }}>*</b></Typography>
                                    <Selects
                                        options={monthsOptions}
                                        styles={colourStyles}
                                        value={{ label: remainderEdit.month === "" ? "Please Select Month" : remainderEdit.month, value: remainderEdit.month === "" ? "Please Select Month" : remainderEdit.month }}
                                        onChange={(e) => {
                                            setRemainderEdit({ ...remainderEdit, month: e.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid> }
                                {( remainderEdit.frequency === "One Month" || remainderEdit.frequency === "Two Months" || remainderEdit.frequency === "Three Months" || remainderEdit.frequency === "Four Months" || remainderEdit.frequency === "Five Months" || remainderEdit.frequency === "Six Months" || remainderEdit.frequency === "Yearly") && 
                                <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Date<b style={{ color: "red" }}>*</b></Typography>

                                    <Selects
                                        options={dateOptions}
                                        styles={colourStyles}
                                        value={{ label: remainderEdit.date === "" ? "Please Select Date" : remainderEdit.date, value: remainderEdit.date === "" ? "Please Select Date" : remainderEdit.date }}
                                        onChange={(e) => {
                                            setRemainderEdit({ ...remainderEdit, date: e.value });
                                        }}

                                    />

                                </FormControl>
                            </Grid> }
                                {( remainderEdit.frequency === "Weekly" ) && 
                                <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Day<b style={{ color: "red" }}>*</b></Typography>
                                    <Selects
                                        options={daysOptions}
                                        styles={colourStyles}
                                        value={{ label: remainderEdit.day === "" ? "Please Select Day" : remainderEdit.day, value: remainderEdit.day === "" ? "Please Select Day" : remainderEdit.day }}
                                        onChange={(e) => {
                                            setRemainderEdit({ ...remainderEdit, day: e.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid> }
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
                            </form>
                        </>
                    </Box>

                </Dialog>
            </Box>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lexpensereminder") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Expense Reminder List</Typography>
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
                                        <MenuItem value={(remainders?.length)}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelexpensereminder") && (
                                        <>
                                            <ExportXL csvData={typeData} fileName={fileName} />
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvexpensereminder") && (
                                        <>
                                            <ExportCSV csvData={typeData} fileName={fileName} />

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printexpensereminder") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfexpensereminder") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()} ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageexpensereminder") && (
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
                        {isUserRoleCompare?.includes("bdexpensereminder") && (
                        <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button>
                        )}


                        <br /><br />
                        {!remainderCheck ?
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
                            onClick={(e) => delRemainder(Remaindersid)}
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
                            <Typography sx={userStyle.HeaderText}>Expense Reminder Info</Typography>
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
                                <TableCell>Expense Category</TableCell>
                                <TableCell>Expense Subcategory</TableCell>
                                <TableCell>Frequency</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Day</TableCell>
                                <TableCell>Month</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {remainders &&
                                (remainders.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.categoryexpense}</TableCell>
                                        <TableCell>{row.subcategoryexpense}</TableCell>
                                        <TableCell>{row.frequency}</TableCell>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.day}</TableCell>
                                        <TableCell>{row.month}</TableCell>
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
                maxWidth="md"
            >
                <Box sx={{ width: "750px", padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Expense Reminder</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Expense Category</Typography>
                                    <Typography>{remainderEdit.categoryexpense}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Expense Subcategory</Typography>
                                    <Typography>{remainderEdit.subcategoryexpense}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Frequency</Typography>
                                    <Typography>{remainderEdit.frequency}</Typography>
                                </FormControl>
                            </Grid>
                            {( remainderEdit.frequency === "Yearly" ) && <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Month</Typography>
                                    <Typography>{remainderEdit.month}</Typography>
                                </FormControl>
                            </Grid>}
                            {( remainderEdit.frequency === "One Month" || remainderEdit.frequency === "Two Months" || remainderEdit.frequency === "Three Months" || remainderEdit.frequency === "Four Months" || remainderEdit.frequency === "Five Months" || remainderEdit.frequency === "Six Months" || remainderEdit.frequency === "Yearly") && <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Date</Typography>
                                    <Typography>{remainderEdit.date}</Typography>
                                </FormControl>
                            </Grid>}
                            {( remainderEdit.frequency === "Weekly" ) && <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Day</Typography>
                                    <Typography>{remainderEdit.day}</Typography>
                                </FormControl>
                            </Grid>}
                            

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
                            onClick={(e) => delRemaindercheckbox(e)}
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


export default ExpenseReminder;