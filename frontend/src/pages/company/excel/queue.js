import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem,
    Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer,
    Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import StyledDataGrid from "../../../components/TableStyle";
import { handleApiError } from "../../../components/Errorhandling";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { makeStyles } from "@material-ui/core";
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from "../../../components/Headtitle";
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
import LoadingButton from "@mui/lab/LoadingButton";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
const useStyles = makeStyles((theme) => ({
    inputs: {
        display: "none",
    },
    preview: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: theme.spacing(2),
        "& > *": {
            margin: theme.spacing(1),
        },
    },
}));



function Queue() {

    const gridRef = useRef(null);
    const [isBtn, setIsBtn] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [getOverAllCountDelete, setGetOverallCountDelete] = useState("");
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');
    const [queue, setQueue] = useState({
        name: "",
    });
    const [isLoader, setIsLoader] = useState(false);
    const [queueId, setQueueId] = useState({
        name: "",
    });

    const [queues, setQueues] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletequeue, setDeleteQueue] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [queueData, setQueueData] = useState([]);
    const [items, setItems] = useState([]);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRowsCount, setSelectedRowsCount] = useState(0);
    const [allQueueEdit, setAllQueueEdit] = useState([]);


    //OVERALL EDIT FUNCTIONALITY
    const [ovProj, setOvProj] = useState("");
    const [getOverAllCount, setGetOverallCount] = useState("");
    const [ovProjcount, setOvProjcount] = useState()


    //image

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
                rowDataTable?.map((item, index) => ({
                    "Sno": index + 1,
                    "Queue Name": item.name,


                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                items.map((item, index) => ({
                    "Sno": index + 1,
                    "Queue Name": item.name,
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
            rowDataTable?.map((item, index) => ({
                "serialNumber": index + 1,
                name: item.name,

            })) :
            items.map((item, index) => ({
                "serialNumber": index + 1,
                name: item.name,
            }))
            ;

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 5,
                cellWidth: 'auto'
            },
            columns: columnsWithSerial,
            body: dataWithSerial,
        });

        doc.save("Queue.pdf");
    };




    // Error Popup model

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setIsBtn(false)
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
        setIsBtn(false)
    };

    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
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
        if (selectedRows.length == 0) {
            setIsDeleteOpenalert(true);
        } else {
            getOverallBulkDeleteSection(selectedRows)

        }


    };



        //overall edit section for all pages
        const getOverallBulkDeleteSection = async (e) => {
            try {
                let res = await axios.post(SERVICE.OVERALLQUEUE_BULK_DELETE, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    id: e,
                });
                setSelectedRows(res?.data?.result);
                setSelectedRowsCount(res?.data?.count)
    
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



    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Queue.png');
                });
            });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    let printsno = 1;

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
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


    //set function to get particular row
    const rowData = async (id, name) => {
        try {
            let res = await axios.get(`${SERVICE.QUEUE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteQueue(res?.data?.squeue);
            getOverallDeleteSection(res?.data?.squeue?.name)
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // Alert delete popup
    let queueid = deletequeue._id;
    const deleQueue = async () => {
        try {
            await axios.delete(`${SERVICE.QUEUE_SINGLE}/${queueid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            await fetchAllQueue();
            handleCloseMod();
            handleCloseCheck();
            setPage(1);
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

    const delProjectcheckbox = async () => {
        try {
            selectedRows?.map((item) => {
                let res = axios.delete(`${SERVICE.QUEUE_SINGLE}/${item}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
            })

            await fetchAllQueue();
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);
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


    //add function
    const sendRequest = async () => {
        setIsBtn(true)
        try {
            let queuecreate = await axios.post(SERVICE.QUEUE_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                name: String(queue.name),
                addedby: [

                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setQueue(queuecreate.data);
            await fetchAllQueue();
            setQueue({ name: "" });
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
    };

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = queues.some(item => item.name.toLowerCase() === (queue.name).toLowerCase());
        if (queue.name === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Queue Name"}
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
                        {"Queue Name already Exists!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            sendRequest();
        }
    };

    const handleCancel = () => {
        setQueue({ name: "" });
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
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    //get single row to edit....
    const getCode = async (e, name) => {
        try {

            let res = await axios.get(`${SERVICE.QUEUE_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            handleClickOpenEdit();
            setQueueId(res?.data?.squeue);
            setOvProj(name);
            getOverallEditSection(name);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    // get single row to view....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.QUEUE_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setQueueId(res?.data?.squeue);
            handleClickOpenview();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.QUEUE_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setQueueId(res?.data?.squeue);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //overall edit section for all pages 
    const getOverallEditSection = async (e) => {
        try {
            let res = await axios.post(SERVICE.OVERALLQUEUE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                oldname: e,
            });
            setOvProjcount(res?.data?.count)

            setGetOverallCount(`The ${e} is linked in 
           ${res?.data?.queuegrouping?.length > 0 ? "Queue Grouping ," : ""}
           ${res?.data?.excelmapdata?.length > 0 ? "Allotted Queue ," : ""}
           ${res?.data?.excelmapresperson?.length > 0 ? "Allotted Resperson" : ""} whether you want to do changes ..??`)

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    //overall edit section for all pages 
    const getOverallDeleteSection = async (e) => {
        try {
            let res = await axios.post(SERVICE.OVERALLQUEUE_DELETE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                oldname: e,
            });
            setGetOverallCountDelete(`This data is linked in 
 ${res?.data?.queuegrouping?.length > 0 ? "Queue Grouping ," : ""}
           ${res?.data?.excelmapdata?.length > 0 ? "Allotted Queue ," : ""}
           ${res?.data?.excelmapresperson?.length > 0 ? "Allotted Resperson" : ""} whether you want to do changes ..??`);

            if (res?.data?.count > 0) {
                handleClickOpenCheck();
            } else {
                handleClickOpen();
            }


            setGetOverallCount(`The ${e} is linked in 
           ${res?.data?.queuegrouping?.length > 0 ? "Queue Grouping ," : ""}
           ${res?.data?.excelmapdata?.length > 0 ? "Allotted Queue ," : ""}
           ${res?.data?.excelmapresperson?.length > 0 ? "Allotted Resperson" : ""} whether you want to do changes ..??`)

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //overall edit section for all pages 
    const getOverallEditSectionUpdate = async () => {
        try {
            let res = await axios.post(SERVICE.OVERALLQUEUE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                oldname: ovProj,
            });
            sendEditRequestOverall(res?.data?.queuegrouping, res?.data?.excelmapdata, res?.data?.excelmapresperson)

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };



    const sendEditRequestOverall = async (queuegrouping, excelmapdata, excelmapresperson) => {
        try {

            if (queuegrouping.length > 0) {
                let answ = queuegrouping.map((d, i) => {
                    let res = axios.put(`${SERVICE.QUEUEGROUP_SINGLE}/${d._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        queuename: String(queueId.name),

                    });

                })

            }


            // if (excelmapdata.length > 0) {
            //     let answ = excelmapdata.map((d, i) => {
            //         let res = axios.put(`${SERVICE.EXCELMAPDATA_SINGLE}/${d._id}`, {
            //             headers: {
            //                 'Authorization': `Bearer ${auth.APIToken}`
            //             },
            //             queue: String(queueId.name),

            //         });

            //     })

            // }
            // if (excelmapresperson.length > 0) {
            //     let answ = excelmapresperson.map((d, i) => {
            //         let res = axios.put(`${SERVICE.EXCELMAPDATARESPERSON_SINGLE}/${d._id}`, {
            //             headers: {
            //                 'Authorization': `Bearer ${auth.APIToken}`
            //             },
            //             queue: String(queueId.name),

            //         });

            //     })

            // }


         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    //Project updateby edit page...
    let updateby = queueId.updatedby;
    let addedby = queueId.addedby;

    let projectsid = queueId._id;

    //editing the single data...
    const sendEditRequest = async () => {
        try {
            let res = await axios.put(`${SERVICE.QUEUE_SINGLE}/${projectsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                name: String(queueId.name),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setQueueId(res.data);
            await fetchAllQueue();
            await fetchQueueAll();
            await getOverallEditSectionUpdate();
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
    };

    const editSubmit = (e) => {
        e.preventDefault();
        fetchQueueAll();
        const isNameMatch = allQueueEdit.some(item => item.name.toLowerCase() === (queueId.name).toLowerCase());
        if ((queueId.name) === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Queue Name"}
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
                        {"Queue Name already Exists!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        // else if (queueId.name != ovProj && ovProjcount > 0) {
        //     setShowAlertpop(
        //         <>
        //             <ErrorOutlineOutlinedIcon
        //                 sx={{ fontSize: "100px", color: "orange" }}
        //             />
        //             <p style={{ fontSize: "20px", fontWeight: 900 }}>
        //                 {getOverAllCount}
        //             </p>
        //         </>
        //     );
        //     handleClickOpenerrpop()
        // }
        else {
            sendEditRequest();
        }
    };






    //get all project.
    const fetchAllQueue = async () => {
        try {
            let res_queue = await axios.get(SERVICE.QUEUE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            
            setQueues(res_queue?.data?.queues);
            setIsLoader(true);
         } catch (err) {setIsLoader(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //get all project.
    const fetchQueueAll = async () => {
        try {
            let res_queue = await axios.get(SERVICE.QUEUE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setAllQueueEdit(res_queue?.data?.queues.filter(item => item._id !== queueId._id));
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    let snos = 1;
    // this is the etimation concadination value
    const modifiedData = queues?.map((person) => ({
        ...person, sino: snos++
    }));
    // pdf.....
    const columns = [
        { title: "Queue Name", field: "name" },
    ];


    // Excel
    const fileName = "Queue";
    let excelno = 1;
    // get particular columns for export excel
    const getexcelDatas = async () => {
            var data = modifiedData.map((t, i) => ({
                "Sno": i + 1,
                "Queue Name": t.name,
            }));
            setQueueData(data);
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Queue",
        pageStyle: "print",
    });


    //serial no for listing items 
    const addSerialNumber = () => {
        const itemsWithSerialNumber = modifiedData?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false)
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
    const searchTerms = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas?.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);
    useEffect(() => {

        fetchAllQueue();
    }, [])

    useEffect(() => {
        fetchQueueAll();
    }, [isEditOpen, queueId])

    useEffect(() => {
        getexcelDatas();
    }, [queues])

    useEffect(() => {
        addSerialNumber();
    }, [queues])

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
            flex: 0, width: 100, hide: !columnVisibility.serialNumber
        },
        { field: "name", headerName: "Queue Name", flex: 0, width: 250, hide: !columnVisibility.name, headerClassName: "bold-header" },

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
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("equeuemaster") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.row.id, params.row.name);
                            }}
                        >
                            <EditOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {/* <Link to={`/location/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonedit} style={{ minWidth: '0px' }}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link> */}
                    {isUserRoleCompare?.includes("dqueuemaster") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id, params.row.name);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon
                                style={{ fontsize: "large" }}
                            />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vqueuemaster") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon
                                style={{ fontsize: "large" }}
                            />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iqueuemaster") && (
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
            <Headtitle title={'QUEUE'} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Queue </Typography>
            {isUserRoleCompare?.includes("aqueuemaster") && (
                <>
                    <Box sx={userStyle.selectcontainer}>

                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>
                                    Add Queue
                                </Typography>
                            </Grid>
                        </Grid>
                        <br />

                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Name <b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Queue name"
                                        value={queue.name}
                                        onChange={(e) => {
                                            setQueue({ ...queue, name: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={2.5} sm={6} xs={12}>

                                <Grid item md={2} sm={6} xs={6}>
                                    <LoadingButton loading={isBtn} sx={userStyle.buttonadd} variant="contained" onClick={handleSubmit}>SAVE</LoadingButton>
                                </Grid>

                            </Grid>
                            <Grid item md={2.5} sm={6} xs={12}>
                                <Button sx={userStyle.btncancel} onClick={handleCancel}>Clear</Button>
                            </Grid>

                        </Grid>

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
                    maxWidth="sm"
                    fullWidth={true}
                >

                    <DialogContent sx={{ padding: "20px 25px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography sx={userStyle.HeaderText}>Edit Queue </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Name <b style={{ color: "red" }}>*</b></Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Queue name"
                                            value={queueId.name}
                                            onChange={(e) => {
                                                setQueueId({ ...queueId, name: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <br />
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button
                                        variant="contained"
                                        style={{
                                            padding: '7px 13px',
                                            color: 'white',
                                            background: 'rgb(25, 118, 210)'
                                        }}
                                        onClick={editSubmit}
                                    >
                                        Update
                                    </Button>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12}>
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
                                        onClick={handleCloseModEdit}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </DialogContent>

                </Dialog>
            </Box>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lqueuemaster") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Queue List</Typography>
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
                                        {/* <MenuItem value={(queues?.length)}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelqueuemaster") && (
               <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvqueuemaster") && (
                                   <>
                                        <Button onClick={(e) => {
                                            setIsFilterOpen(true)
                                            setFormat("csv")
                                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                    </>
                                    )}
                                    {isUserRoleCompare?.includes("printqueuemaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfqueuemaster") && (
                                       <>
                                        <Button sx={userStyle.buttongrp}
                                            onClick={() => {
                                                setIsPdfFilterOpen(true)

                                            }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                    </>
                                    )}
                                    {isUserRoleCompare?.includes("imagequeuemaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                        </>
                                    )}
                                </Box >
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
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
                        {isUserRoleCompare?.includes("bdqueuemaster") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button>
                        )}

                        <br />
                        <br />
                        {!isLoader ? 
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
                        </Box></>}
                        
                        {/* ****** Table End ****** */}
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
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {manageColumnsContent}
            </Popover>

            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isDeleteOpen}
                    onClose={handleCloseMod}
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
                        <Button onClick={handleCloseMod} style={{
                            backgroundColor: '#f4f4f4',
                            color: '#444',
                            boxShadow: 'none',
                            borderRadius: '3px',
                            border: '1px solid #0000006b',
                            '&:hover': {
                                '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                                    backgroundColor: '#f4f4f4',
                                },
                            },
                        }}>
                            Cancel
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={(e) => deleQueue(queueid)}
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
                    <Box sx={{ width: '550px', padding: '20px 50px' }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>Queue Info</Typography>
                            <br /><br />
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Added by</Typography>
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
                    <Table
                        sx={{ minWidth: 700 }}
                        aria-label="customized table"
                        id="usertable"
                        ref={componentRef}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell> SI.No</TableCell>
                                <TableCell>Queue Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {filteredData?.length > 0 &&
                                filteredData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{printsno++}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                    </TableRow>
                                ))}
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
            >
                <Box sx={{ width: "350px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Queue</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Name</Typography>
                                    <Typography>{queueId.name}</Typography>
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
                                {" "}
                                Back{" "}
                            </Button>
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
                        <Button variant="contained" style={{
                            padding: '7px 13px',
                            color: 'white',
                            background: 'rgb(25, 118, 210)'
                        }} onClick={() => {
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
                                    onClick={(e) => delProjectcheckbox(e)}
                                > OK </Button>
                            </>
                            :
                            <Button variant="contained" color='error' onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Ok</Button>
                        }
                    </DialogActions>
                </Dialog>

            </Box>
            {/* <Box>
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
                            onClick={delProjectcheckbox}
                        > OK </Button>
                    </DialogActions>
                </Dialog>

            </Box> */}
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
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" style={{
                            padding: '7px 13px',
                            color: 'white',
                            background: 'rgb(25, 118, 210)'
                        }} onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

export default Queue;