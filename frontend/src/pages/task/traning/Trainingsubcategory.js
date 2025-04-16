import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, TextareaAutosize,
    DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead,
    TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { userStyle, colourStyles } from "../../../pageStyle";
import StyledDataGrid from "../../../components/TableStyle";
import { handleApiError } from "../../../components/Errorhandling";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import Selects from "react-select";
import 'jspdf-autotable';
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { SERVICE } from '../../../services/Baseservice';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import moment, { duration } from 'moment-timezone';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/system';
import Resizable from 'react-resizable';
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import LoadingButton from "@mui/lab/LoadingButton";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';


function TrainingSubcategory() {

    const [trainingsubcategory, setTrainingsubcategory] = useState({
        category: "Please Select Category",
        subcategoryname: "",
        description: "",
        module: "Please Select Module",
        customer: "Please Select Customer",
        queue: "Please Select Queue",
        process: "Please Select Process",
    });
    const [btnLoad, setBtnLoad] = useState(false)

    const [selectedRowsCount, setSelectedRowsCount] = useState(0);
    const [ovcategory, setOvcategory] = useState("");
    const [getOverAllCount, setGetOverallCount] = useState("");
    const [ovProjCount, setOvProjCount] = useState("");
    const [getOverAllCountDelete, setGetOverallCountDelete] = useState("");
    const [ovProjCountDelete, setOvProjCountDelete] = useState("");

    const [trainingsubcategoryEdit, setTrainingsubcategoryEdit] = useState({ category: "Please Select Category", subcategoryname: "", description: "" })
    const [trainingsubcategorys, setTrainingsubcategorys] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allTrainingsubcategoryedit, setAllTrainingsubcategoryedit] = useState([]);
    const [category, setCategory] = useState([]);
    const [categoryEdit, setCategoryEdit] = useState([]);

    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [hours, setHours] = useState("Hrs");
    const [hoursEdit, setHoursEdit] = useState("Hrs");
    const [minutes, setMinutes] = useState("Mins");
    const [minutesEdit, setMinutesEdit] = useState("Mins");
    const [DocumentsChosed, setDocumentsChosed] = useState([]);
    const [DocumentsChosedEdit, setDocumentsChosedEdit] = useState([]);
    const [DocumentsDisplay, setDocumentsDisplay] = useState("Please Select Documents");
    const [DocumentsDisplayEdit, setDocumentsDisplayEdit] = useState("Please Select Documents");
    const [hrsOption, setHrsOption] = useState([]);
    const [minsOption, setMinsOption] = useState([]);
    const [tasksubcategoryCheck, setTasksubcategorycheck] = useState(false);

    const username = isUserRoleAccess.username
    const [documentsList, setDocumentsList] = useState([]);
    const [documentsListEdit, setDocumentsListEdit] = useState([]);
    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);

    const [customeropt, setCustomerOptions] = useState([]);
    const [queueopt, setQueue] = useState([]);
    const [processOpt, setProcessOpt] = useState([]);
    const [customeroptEdit, setCustomerOptionsEdit] = useState([]);
    const [queueoptEdit, setQueueEdit] = useState([]);
    const [processOptEdit, setProcessOptEdit] = useState([]);
    const [moduleOpt, setModuleOpt] = useState([]);
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
                filteredData?.map((item, index) => ({
                    "Sno": index + 1,
                    Category: item.category,
                    Subcategory: item.subcategoryname,
                    Duration: item.duration,
                    Module: item.module,
                    Customer: item.customer,
                    Queue: item.queue,
                    Process: item.process,
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                items.map((item, index) => ({
                    "Sno": index + 1,
                    Category: item.category,
                    Subcategory: item.subcategoryname,
                    Duration: item.duration,
                    Module: item.module,
                    Customer: item.customer,
                    Queue: item.queue,
                    Process: item.process,
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
                category: item.category,
                subcategoryname: item.subcategoryname,
                duration: item.duration,
                module: item.module,
                customer: item.customer,
                queue: item.queue,
                process: item.process,
            })) :
            items?.map(item => ({
                serialNumber: serialNumberCounter++,
                category: item.category,
                subcategoryname: item.subcategoryname,
                duration: item.duration,
                module: item.module,
                customer: item.customer,
                queue: item.queue,
                process: item.process,
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

        doc.save("Training_Subcategory.pdf");
    };



    const [openviewalert, setOpenviewalert] = useState(false);
    // view model
    const handleClickOpenviewalert = () => {
        setOpenviewalert(true);
    };

    const handleCloseviewalert = () => {
        setOpenviewalert(false);
    };

    const [addDocTodo, setAddDocTodo] = useState([])
    const [addDocTodoEdit, setAddDocTodoEdit] = useState([])
    const addTodo = (e) => {
        const DuplicateData = addDocTodo?.some(data => data.name === DocumentsChosed?.value)
        if (DocumentsDisplay === "Please Select Documents") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Documents"}</p>
                </>
            );
            handleClickOpenerr();

        }
        else if (DuplicateData) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Different Document"}</p>
                </>
            );
            handleClickOpenerr();
        } else {
            const answer = {
                document: DocumentsChosed?.documentstext,
                name: DocumentsChosed?.value,
                files: DocumentsChosed?.document

            }
            setAddDocTodo([...addDocTodo, answer])
        }
        setDocumentsChosed([])
        setDocumentsDisplay("Please Select Documents")

    }


    const addTodoEdit = (e) => {
        const DuplicateData = addDocTodoEdit?.some(data => data.name === DocumentsChosedEdit?.value)
        if (DocumentsDisplayEdit === "Please Select Documents") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Documents"}</p>
                </>
            );
            handleClickOpenerr();

        }
        else if (DuplicateData) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Different Document"}</p>
                </>
            );
            handleClickOpenerr();
        } else {
            const answer = {
                document: DocumentsChosedEdit?.documentstext,
                name: DocumentsChosedEdit?.value,
                files: DocumentsChosedEdit?.document

            }
            setAddDocTodoEdit([...addDocTodoEdit, answer])
        }
        setDocumentsChosedEdit([])
        setDocumentsDisplayEdit("Please Select Documents")

    }


    const deleteTodo = (index) => {
        const updatedTodos = [...addDocTodo];
        updatedTodos.splice(index, 1);
        setAddDocTodo(updatedTodos)
    }
    const deleteTodoEdit = (index) => {
        const updatedTodos = [...addDocTodoEdit];
        updatedTodos.splice(index, 1);
        setAddDocTodoEdit(updatedTodos)
    }











    //function to generate hrs
    const generateHrsOptions = () => {
        const hrsOpt = [];
        for (let i = 0; i <= 23; i++) {
            if (i < 10) {
                i = "0" + i;
            }
            hrsOpt.push({ value: i.toString(), label: i.toString() });
        }
        setHrsOption(hrsOpt);
    };
    //function to generate mins
    const generateMinsOptions = () => {
        const minsOpt = [];
        for (let i = 0; i <= 59; i++) {
            if (i < 10) {
                i = "0" + i;
            }
            minsOpt.push({ value: i.toString(), label: i.toString() });
        }
        setMinsOption(minsOpt);
    };


    //get all project.
    const fetchAllApproveds = async () => {
        try {
            let res_queue = await axios.get(SERVICE.ALL_DOCUMENT_TRAINING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const answer = res_queue?.data.document?.filter(data => data.type === "Training Document")?.flatMap(item => item?.module)
            const removedDuplicate = [...new Set([...answer])]
            setModuleOpt(removedDuplicate.map((data) => ({
                ...data,
                label: data,
                value: data,
            })))
            // setDocumentsList(answer);


         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };



    const fetchCustomer = async (module) => {
        try {
            let res_queue = await axios.get(SERVICE.ALL_DOCUMENT_TRAINING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const answer = res_queue?.data.document?.filter(data => data.type === "Training Document" && data.module?.includes(module))?.flatMap(item => item?.customer)
            const removedDuplicate = [...new Set([...answer])]

            setCustomerOptions(
                removedDuplicate.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchQueue = async (module, customer) => {
        try {
            let res_queue = await axios.get(SERVICE.ALL_DOCUMENT_TRAINING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const answer = res_queue?.data.document?.filter(data => data.type === "Training Document" && data.customer?.includes(customer) && data.module?.includes(module))?.flatMap(item => item?.queue)
            const removedDuplicate = [...new Set([...answer])]
            setQueue(
                removedDuplicate.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchProcess = async (module, customer, queue) => {
        try {
            let res_queue = await axios.get(SERVICE.ALL_DOCUMENT_TRAINING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const answer = res_queue?.data.document?.filter(data => data.type === "Training Document" &&
                data.customer?.includes(customer) &&
                data.module?.includes(module) && data.queue?.includes(queue))?.flatMap(item => item?.process)
            const removedDuplicate = [...new Set([...answer])]
            setProcessOpt(
                removedDuplicate.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //get all project.
    const fetchAllDocumentsList = async (module, customer, queue, process) => {
        try {
            let res_queue = await axios.get(SERVICE.ALL_DOCUMENT_TRAINING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const answer = res_queue?.data.document?.filter(data => data.type === "Training Document" &&
                data.customer?.includes(customer) &&
                data.module?.includes(module) && data.queue?.includes(queue) && data.process?.includes(process)).map(datt => ({
                    ...datt,
                    label: datt?.form + "-" + moment(datt.createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    value: datt?.form + "-" + moment(datt.createdAt).format('DD-MM-YYYY hh:mm:ss a')

                }))


            setDocumentsList(answer);


         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };












    useEffect(() => {
        fetchAllApproveds();
        generateHrsOptions();
        generateMinsOptions();
    }, []);






    const fetchCustomerEdit = async (module) => {
        try {
            let res_queue = await axios.get(SERVICE.ALL_DOCUMENT_TRAINING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const answer = res_queue?.data.document?.filter(data => data.type === "Training Document" && data.module?.includes(module))?.flatMap(item => item?.customer)
            const removedDuplicate = [...new Set([...answer])]

            setCustomerOptionsEdit(
                removedDuplicate.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );


         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchQueueEdit = async (module, customer) => {
        try {
            let res_queue = await axios.get(SERVICE.ALL_DOCUMENT_TRAINING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const answer = res_queue?.data.document?.filter(data => data.type === "Training Document" && data.customer?.includes(customer) && data.module?.includes(module))?.flatMap(item => item?.queue)
            const removedDuplicate = [...new Set([...answer])]
            setQueueEdit(
                removedDuplicate.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchProcessEdit = async (module, customer, queue) => {
        try {
            let res_queue = await axios.get(SERVICE.ALL_DOCUMENT_TRAINING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const answer = res_queue?.data.document?.filter(data => data.type === "Training Document" &&
                data.customer?.includes(customer) &&
                data.module?.includes(module) && data.queue?.includes(queue))?.flatMap(item => item?.process)
            const removedDuplicate = [...new Set([...answer])]
            setProcessOptEdit(
                removedDuplicate.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );


         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //get all project.
    const fetchAllDocumentsListEdit = async (module, customer, queue, process) => {
        try {
            let res_queue = await axios.get(SERVICE.ALL_DOCUMENT_TRAINING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const answer = res_queue?.data.document?.filter(data => data.type === "Training Document" &&
                data.customer?.includes(customer) &&
                data.module?.includes(module) && data.queue?.includes(queue) && data.process?.includes(process)).map(datt => ({
                    ...datt,
                    label: datt?.form + "-" + moment(datt.createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    value: datt?.form + "-" + moment(datt.createdAt).format('DD-MM-YYYY hh:mm:ss a')

                }))

            setDocumentsListEdit(answer);


         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };















    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Training_Subcategory.png');
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
        setBtnLoad(false)
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


    // Styles for the resizable column
    const ResizableColumn = styled(Resizable)`
       .react-resizable-handle {
       width: 10px;
       height: 100%;
       position: absolute;
       right: 0;
       bottom: 0;
       cursor: col-resize;
       }
       `;

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
        subcategoryname: true,
        duration: true,
        customer: true,
        module: true,
        queue: true,
        process: true,
        description: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };


    const fetchTrainingcategory = async () => {
        try {
            let task = await axios.get(SERVICE.TRAININGCATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });


            const categoryall = [...task?.data?.trainingcategorys?.map((d) => (
                {
                    ...d,
                    label: d.categoryname,
                    value: d.categoryname
                }
            ))];
            setCategory(categoryall);
            setCategoryEdit(categoryall);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        fetchTrainingcategory()
    }, [])



    const [deleteSubcategroy, setDeleteSubcategory] = useState("");


    const rowData = async (id, name) => {
        try {
            let res = await axios.get(`${SERVICE.TRAININGSUBCATEGORY_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteSubcategory(res?.data?.strainingsubcategory);
            getOverallEditSectionDelete(res?.data?.strainingsubcategory?.subcategoryname)


         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    // Alert delete popup
    let trainingsubcategorysid = deleteSubcategroy?._id;
    const delTrainingSubcategory = async (e) => {

        try {
            if (trainingsubcategorysid) {
                await axios.delete(`${SERVICE.TRAININGSUBCATEGORY_SINGLE}/${e}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
                await fetchTrainingsubcategory();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1)
            }

            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Deleted Successfully"}</p>
                </>
            );
            handleClickOpenerr();

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };



    const delTrainingSubcheckbox = async () => {
        try {

            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.TRAININGSUBCATEGORY_SINGLE}/${item}`, {
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

            await fetchTrainingsubcategory();
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Deleted Successfully'}</p>
                </>
            );
            handleClickOpenerr();
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };



    //add function 
    const sendRequest = async () => {
        setBtnLoad(true)
        try {
            let subprojectscreate = await axios.post(SERVICE.TRAININGSUBCATEGORY_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                category: String(trainingsubcategory.category),
                subcategoryname: String(trainingsubcategory.subcategoryname),
                description: String(trainingsubcategory.description),
                duration: trainingsubcategory.duration,
                module: trainingsubcategory.module,
                customer: trainingsubcategory.customer,
                queue: trainingsubcategory.queue,
                process: trainingsubcategory.process,
                documentslist: addDocTodo,
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            })
            await fetchTrainingsubcategory();
            setTrainingsubcategory({ ...trainingsubcategory, subcategoryname: "", description: "" })
            setBtnLoad(false)
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Added Successfully"}</p>
                </>
            );
            handleClickOpenerr();
        } catch (err) {setBtnLoad(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = trainingsubcategorys.some(item => item.subcategoryname.toLowerCase() === (trainingsubcategory.subcategoryname).toLowerCase() && item.category === String(trainingsubcategory.category));
        if (trainingsubcategory.category === "" || trainingsubcategory.category === "Please Select Category") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select  Category"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (trainingsubcategory?.duration === undefined || trainingsubcategory?.duration === "00:00" || trainingsubcategory?.duration?.includes("Mins")) {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Duration"} </p>{" "}
                </>
            );
            handleClickOpenerr();
        }

        else if (trainingsubcategory.duration === undefined || minutes === "Mins") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Duration"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (trainingsubcategory.module === "Please Select Module") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Module"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (trainingsubcategory.customer === "Please Select Customer") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Customer"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (trainingsubcategory.queue === "Please Select Queue") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Queue"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (trainingsubcategory.process === "Please Select Process") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Process"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (addDocTodo?.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Documents"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (trainingsubcategory.subcategoryname === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Name"}</p>
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
                        {"Name already exists!"}
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
        setTrainingsubcategory({
            category: "Please Select Category",
            module: "Please Select Module",
            customer: "Please Select Customer",
            queue: "Please Select Queue",
            process: "Please Select Process",
            subcategoryname: "", description: ""
        })
        setHours("Hrs")
        setMinutes("Mins")
        setAddDocTodo([])
        setProcessOpt([])
        setDocumentsList([])
        setQueue([])
        setCustomerOptions([])
        setDocumentsDisplay("Please Select Documents")
        setDocumentsChosed([])
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Cleared Successfully"}</p>
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
            let res = await axios.get(`${SERVICE.TRAININGSUBCATEGORY_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTrainingsubcategoryEdit(res?.data?.strainingsubcategory);
            const [hourscal, minutescal] = res?.data?.strainingsubcategory?.duration.split(":");
            setHoursEdit(hourscal);
            setMinutesEdit(minutescal);
            setAddDocTodoEdit(res?.data?.strainingsubcategory?.documentslist)
            fetchCustomerEdit(res?.data?.strainingsubcategory?.module)
            fetchQueueEdit(res?.data?.strainingsubcategory?.module, res?.data?.strainingsubcategory?.customer)
            fetchProcessEdit(res?.data?.strainingsubcategory?.module,
                res?.data?.strainingsubcategory?.customer,
                res?.data?.strainingsubcategory?.queue)
            fetchAllDocumentsListEdit(res?.data?.strainingsubcategory?.module,
                res?.data?.strainingsubcategory?.customer,
                res?.data?.strainingsubcategory?.queue,
                res?.data?.strainingsubcategory?.process)
            getOverallEditSection(res?.data?.strainingsubcategory?.subcategoryname)
            setOvcategory(res?.data?.strainingsubcategory?.subcategoryname)
            handleClickOpenEdit();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }


    // get single row to view....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.TRAININGSUBCATEGORY_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTrainingsubcategoryEdit(res?.data?.strainingsubcategory);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.TRAININGSUBCATEGORY_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTrainingsubcategoryEdit(res?.data?.strainingsubcategory);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };



    //Project updateby edit page...
    let updateby = trainingsubcategoryEdit?.updatedby;
    let addedby = trainingsubcategoryEdit?.addedby;


    let subprojectsid = trainingsubcategoryEdit?._id;



    //overall edit section for all pages
    const getOverallEditSectionOverallDelete = async (ids) => {
        try {

            let res = await axios.post(SERVICE.OVERALL_TRAINING_SUBOVERALL_CATEGORY_TICKET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                id: ids
            });
            setSelectedRows(res?.data?.result);
            setSelectedRowsCount(res?.data?.count)

            setIsDeleteOpencheckbox(true);

        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };






    //overall edit section for all pages
    const getOverallEditSectionDelete = async (cat) => {
        try {

            let res = await axios.post(SERVICE.OVERALL_TRAINING_SUBCATEGORY_TICKET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                subcategory: cat
            });
            setOvProjCountDelete(res.data.count);
            setGetOverallCountDelete(`This data is linked in 
                ${res.data.trainingUsers.length > 0 ? "Training For Users ," : ""}
            ${res.data.trandetails.length > 0 ? "Training Details ," : ""}
            ${res.data.trandetailslog.length > 0 ? "Training Details Log," : ""}
                 `);

            if (res?.data?.count > 0) {
                handleClickOpenCheck();
            } else {
                handleClickOpen();
            }



        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };







    //overall edit section for all pages
    const getOverallEditSection = async (cat) => {
        try {
            let res = await axios.post(SERVICE.OVERALL_TRAINING_SUBCATEGORY_TICKET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                subcategory: cat,
            });
            setOvProjCount(res?.data?.count);
            setGetOverallCount(`This data is linked in 
         ${res?.data?.trainingUsers?.length > 0 ? "Training For Users ," : ""}
     ${res?.data?.trandetails?.length > 0 ? "Training Details ," : ""}
     ${res?.data?.trandetailslog?.length > 0 ? "Training Details Log," : ""}
         whether you want to do changes ..??`);


        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //overall edit section for all pages
    const getOverallEditSectionUpdate = async () => {
        try {
            let res = await axios.post(SERVICE.OVERALL_TRAINING_SUBCATEGORY_TICKET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                subcategory: ovcategory,
            });
            sendEditRequestOverall(
                res?.data?.trainingUsers,
                res?.data?.trandetails,
                res?.data?.trandetailslog

            );
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const sendEditRequestOverall = async (trainuser, traindetails, trandetailslog) => {
        try {
            if (trainuser?.length > 0) {
                let answ = trainuser.map((d, i) => {
                    const answer = d?.trainingdocuments?.filter(data => data?.subcategory !== ovcategory)
                    const answerCate = d?.trainingdocuments?.filter(data => data?.subcategory === ovcategory)?.map((item
                    ) => {
                        return { ...item, subcategory: trainingsubcategoryEdit.subcategoryname }
                    })
                    let res = axios.put(`${SERVICE.SINGLE_TRAINING_FOR_USER}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        trainingdocuments: [...answer, ...answerCate],
                    });
                });
            }

            if (traindetails?.length > 0) {
                let answ = traindetails.map((d, i) => {
                    const answer = d?.trainingdocuments?.filter(data => data?.subcategory !== ovcategory)
                    const answerCate = d?.trainingdocuments?.filter(data => data?.subcategory === ovcategory)?.map((item
                    ) => {
                        return { ...item, subcategory: trainingsubcategoryEdit.subcategoryname }
                    })

                    let res = axios.put(`${SERVICE.SINGLE_TRAININGDETAILS}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        trainingdocuments: [...answer, ...answerCate],
                    });
                });
            }
            if (trandetailslog?.length > 0) {
                let answ = trandetailslog.map((d, i) => {
                    const answer = d?.trainingdetailslog?.filter(data => data?.subcategory !== ovcategory)
                    const answerCate = d?.trainingdetailslog?.filter(data => data?.subcategory === ovcategory)?.map((item
                    ) => {
                        return { ...item, subcategory: trainingsubcategoryEdit.subcategoryname }
                    })

                    let res = axios.put(`${SERVICE.SINGLE_TRAININGDETAILS}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        trainingdetailslog: [...answer, ...answerCate],
                    });
                });
            }

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };













    //editing the single data...
    const sendEditRequest = async () => {
        try {
            let res = await axios.put(`${SERVICE.TRAININGSUBCATEGORY_SINGLE}/${subprojectsid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                category: String(trainingsubcategoryEdit.category),
                subcategoryname: String(trainingsubcategoryEdit.subcategoryname),
                description: String(trainingsubcategoryEdit.description),
                duration: trainingsubcategoryEdit.duration,
                module: trainingsubcategoryEdit.module,
                customer: trainingsubcategoryEdit.customer,
                queue: trainingsubcategoryEdit.queue,
                process: trainingsubcategoryEdit.process,
                documentslist: addDocTodoEdit,
                updatedby: [
                    ...updateby, {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchTrainingsubcategory();
            await fetchTrainingsubcategoryAll();
            await getOverallEditSectionUpdate();
            handleCloseModEdit();
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Updated Successfully"}</p>
                </>
            );
            handleClickOpenerr();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    const editSubmit = (e) => {
        e.preventDefault();
        fetchTrainingsubcategoryAll();
        const isNameMatch = allTrainingsubcategoryedit.some(item => item.subcategoryname.toLowerCase() === (trainingsubcategoryEdit.subcategoryname).toLowerCase() && item.category === String(trainingsubcategoryEdit.category));
        if (trainingsubcategoryEdit.category === "" || trainingsubcategoryEdit.category === "Please Select Category") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select  Category"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (trainingsubcategoryEdit.subcategoryname === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Name"}</p>
                </>
            );
            handleClickOpenerr();
        }



        else if (trainingsubcategoryEdit?.duration === undefined || trainingsubcategoryEdit?.duration === "00:00" || trainingsubcategoryEdit?.duration?.includes("Mins")) {
            setShowAlert(
                <>
                    {" "}
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Duration"} </p>{" "}
                </>
            );
            handleClickOpenerr();
        }

        else if (trainingsubcategoryEdit.duration === undefined || minutesEdit === "Mins") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Duration"}</p>
                </>
            );
            handleClickOpenerr();
        }








        else if (trainingsubcategoryEdit.module === "Please Select Module") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Module"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (trainingsubcategoryEdit.customer === "Please Select Customer") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Customer"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (trainingsubcategoryEdit.queue === "Please Select Queue") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Queue"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (trainingsubcategoryEdit.process === "Please Select Process") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Process"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (addDocTodoEdit?.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Documents"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (trainingsubcategoryEdit.subcategoryname != ovcategory && ovProjCount > 0) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
                </>
            );
            handleClickOpenerrpop();
        }



        else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Name already exists!"}
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
    const fetchTrainingsubcategory = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.TRAININGSUBCATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTasksubcategorycheck(true)
            setTrainingsubcategorys(res_vendor?.data?.trainingsubcategorys);
        } catch (err) {setTasksubcategorycheck(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }


    //get all Sub vendormasters.
    const fetchTrainingsubcategoryAll = async () => {
        try {
            let res_meet = await axios.get(SERVICE.TRAININGSUBCATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setAllTrainingsubcategoryedit(res_meet?.data?.trainingsubcategorys.filter(item => item._id !== trainingsubcategoryEdit._id));
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }



    // pdf.....
    const columns = [
        { title: "Sno", field: "serialNumber" },
        { title: "Category", field: "category" },
        { title: "Subcategory Name", field: "subcategoryname" },
        { title: "Duration", field: "duration" },
        { title: "Module", field: "module" },
        { title: "Customer", field: "customer" },
        { title: "Queue", field: "queue" },
        { title: "Process", field: "process" },
    ]


    // Excel
    const fileName = "Training_Subcategory";
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Training_Subcategory',
        pageStyle: 'print'
    });


    useEffect(() => {
        fetchTrainingsubcategory();
        fetchTrainingsubcategoryAll();
    }, [])

    useEffect(() => {
        fetchTrainingsubcategoryAll();
    }, [isEditOpen, trainingsubcategoryEdit])


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
        const itemsWithSerialNumber = trainingsubcategorys?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [trainingsubcategorys])


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
            flex: 0, width: 75, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
        },
        { field: "category", headerName: "Category", flex: 0, width: 150, hide: !columnVisibility.category, headerClassName: "bold-header" },
        { field: "subcategoryname", headerName: "Subcategory Name", flex: 0, width: 150, hide: !columnVisibility.subcategoryname, headerClassName: "bold-header" },
        { field: "duration", headerName: "Duration", flex: 0, width: 150, hide: !columnVisibility.subcategoryname, headerClassName: "bold-header" },
        { field: "module", headerName: "Module", flex: 0, width: 150, hide: !columnVisibility.module, headerClassName: "bold-header" },
        { field: "customer", headerName: "Customer", flex: 0, width: 150, hide: !columnVisibility.customer, headerClassName: "bold-header" },
        { field: "queue", headerName: "Queue", flex: 0, width: 150, hide: !columnVisibility.queue, headerClassName: "bold-header" },
        { field: "process", headerName: "Process", flex: 0, width: 150, hide: !columnVisibility.process, headerClassName: "bold-header" },
        { field: "description", headerName: "Description", flex: 0, width: 250, hide: !columnVisibility.description, headerClassName: "bold-header" },
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
                    {isUserRoleCompare?.includes("etrainingsubcategory") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {

                            getCode(params.row.id, params.row.name);
                        }}><EditOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                    )}
                    {isUserRoleCompare?.includes("dtrainingsubcategory") && (
                        <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.row.id, params.row.name) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                    )}
                    {isUserRoleCompare?.includes("vtrainingsubcategory") && (
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
                    {isUserRoleCompare?.includes("itrainingsubcategory") && (
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
            category: item.category,
            subcategoryname: item.subcategoryname,
            duration: item.duration,
            module: item.module,
            customer: item.customer,
            queue: item.queue,
            process: item.process,
            description: item.description,

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
            <Headtitle title={'Training Subcategory'} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Training Subcategory</Typography>
            {isUserRoleCompare?.includes("atrainingsubcategory")
                && (
                    <>

                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>Add Training Subcategory</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>

                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl size="small" fullWidth >
                                            <Typography>Category <b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={category}
                                                styles={colourStyles}
                                                value={{ label: trainingsubcategory.category, value: trainingsubcategory.category }}
                                                onChange={(e) => {
                                                    setTrainingsubcategory({ ...trainingsubcategory, category: e.value });
                                                }}

                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Duration<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Grid container spacing={1}>
                                            <Grid item md={6} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Selects
                                                        maxMenuHeight={300}
                                                        options={hrsOption}
                                                        placeholder="Hrs"
                                                        value={{ label: hours, value: hours }}
                                                        onChange={(e) => {
                                                            setHours(e.value);
                                                            setTrainingsubcategory({ ...trainingsubcategory, duration: `${e.value}:${minutes}` });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>

                                            <Grid item md={6} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Selects
                                                        maxMenuHeight={300}
                                                        options={minsOption}
                                                        placeholder="Mins"
                                                        value={{ label: minutes, value: minutes }}
                                                        onChange={(e) => {
                                                            setMinutes(e.value);
                                                            setTrainingsubcategory({ ...trainingsubcategory, duration: `${hours}:${e.value}` });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Module<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={moduleOpt}
                                                placeholder="Please Select Module"
                                                value={{ label: trainingsubcategory.module, value: trainingsubcategory.module }}
                                                onChange={(e) => {
                                                    setTrainingsubcategory({
                                                        ...trainingsubcategory, module: e.value,
                                                        customer: "Please Select Customer",
                                                        queue: "Please Select Queue",
                                                        process: "Please Select Process",


                                                    });
                                                    setDocumentsDisplay("Please Select Documents")
                                                    setDocumentsChosed([])
                                                    setQueue([])
                                                    setProcessOpt([])
                                                    fetchCustomer(e.value)
                                                    setDocumentsList([])
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Customer<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={customeropt}
                                                placeholder="Please Select Customer"
                                                value={{ label: trainingsubcategory.customer, value: trainingsubcategory.customer }}
                                                onChange={(e) => {
                                                    setTrainingsubcategory({
                                                        ...trainingsubcategory, customer: e.value,
                                                        queue: "Please Select Queue",
                                                        process: "Please Select Process",
                                                    });
                                                    setDocumentsDisplay("Please Select Documents")
                                                    setDocumentsChosed([])
                                                    setProcessOpt([])
                                                    setDocumentsList([])
                                                    fetchQueue(trainingsubcategory.module, e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Queue<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={queueopt}
                                                placeholder="Please Select Queue"
                                                value={{ label: trainingsubcategory.queue, value: trainingsubcategory.queue }}
                                                onChange={(e) => {
                                                    setTrainingsubcategory({
                                                        ...trainingsubcategory, queue: e.value,
                                                        process: "Please Select Process",
                                                    });
                                                    setDocumentsDisplay("Please Select Documents")
                                                    setDocumentsChosed([])
                                                    setDocumentsList([])
                                                    fetchProcess(trainingsubcategory.module, trainingsubcategory.customer, e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Process<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={processOpt}
                                                placeholder="Please Select Process"
                                                value={{ label: trainingsubcategory.process, value: trainingsubcategory.process }}
                                                onChange={(e) => {
                                                    setTrainingsubcategory({
                                                        ...trainingsubcategory, process: e.value
                                                    });
                                                    setDocumentsDisplay("Please Select Documents")
                                                    setDocumentsChosed([])
                                                    fetchAllDocumentsList(trainingsubcategory.module, trainingsubcategory.customer, trainingsubcategory.queue, e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Documents<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={documentsList}
                                                placeholder="Please Select Documents"
                                                value={{ label: DocumentsDisplay, value: DocumentsDisplay }}
                                                onChange={(e) => {
                                                    setDocumentsChosed(e)
                                                    setDocumentsDisplay(e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1} xs={12} sm={6}>
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
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Name <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Name"
                                                value={trainingsubcategory.subcategoryname}
                                                onChange={(e) => {
                                                    setTrainingsubcategory({ ...trainingsubcategory, subcategoryname: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Description</Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={5}
                                                value={trainingsubcategory.description}
                                                onChange={(e) => {
                                                    setTrainingsubcategory({ ...trainingsubcategory, description: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Documents List<b style={{ color: "red" }}>*</b>
                                        </Typography>  <br />
                                        {addDocTodo?.length > 0 &&
                                            addDocTodo?.map((data, index) => (
                                                <>
                                                    <Grid container spacing={2}>
                                                        <Grid item md={9} xs={12} sm={6}>
                                                            <Typography>{data.name}</Typography>
                                                        </Grid>
                                                        <Grid item md={2} xs={12} sm={6}>
                                                            <Button
                                                                variant="contained"
                                                                color="error"
                                                                type="button"
                                                                sx={{
                                                                    height: "25px",
                                                                    minWidth: "30px",
                                                                    padding: "6px 10px",
                                                                }}
                                                                onClick={() => {
                                                                    deleteTodo(index);
                                                                }}
                                                            >
                                                                <AiOutlineClose />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>


                                                </>))}
                                    </Grid>
                                </Grid>
                                <br />  <br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <LoadingButton loading={btnLoad} variant='contained' color='primary' onClick={handleSubmit}>Submit</LoadingButton>

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
                    maxWidth="lg"

                >

                    <Box sx={{ padding: '20px' }}>
                        <>
                            <form onSubmit={editSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Edit Training Subcategory</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl size="small" fullWidth >
                                            <Typography>Category<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                options={categoryEdit}
                                                styles={colourStyles}
                                                value={{ label: trainingsubcategoryEdit.category, value: trainingsubcategoryEdit.category }}
                                                onChange={(e) => {
                                                    setTrainingsubcategoryEdit({ ...trainingsubcategoryEdit, category: e.value });
                                                }}

                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Duration<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Grid container spacing={1}>
                                            <Grid item md={6} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Selects
                                                        maxMenuHeight={300}
                                                        options={hrsOption}
                                                        placeholder="Hrs"
                                                        value={{ label: hoursEdit, value: hoursEdit }}
                                                        onChange={(e) => {
                                                            setHoursEdit(e.value);
                                                            setTrainingsubcategoryEdit({ ...trainingsubcategoryEdit, duration: `${e.value}:${minutesEdit}` });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={6} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Selects
                                                        maxMenuHeight={300}
                                                        options={minsOption}
                                                        placeholder="Mins"
                                                        value={{ label: minutesEdit, value: minutesEdit }}
                                                        onChange={(e) => {
                                                            setMinutesEdit(e.value);
                                                            setTrainingsubcategoryEdit({ ...trainingsubcategoryEdit, duration: `${hoursEdit}:${e.value}` });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Module<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={moduleOpt}
                                                placeholder="Please Select Module"
                                                value={{ label: trainingsubcategoryEdit.module, value: trainingsubcategoryEdit.module }}
                                                onChange={(e) => {
                                                    setTrainingsubcategoryEdit({
                                                        ...trainingsubcategoryEdit, module: e.value,
                                                        customer: "Please Select Customer",
                                                        queue: "Please Select Queue",
                                                        process: "Please Select Process",


                                                    });
                                                    setDocumentsDisplayEdit("Please Select Documents")
                                                    setDocumentsChosedEdit([])
                                                    setDocumentsListEdit([])
                                                    setQueueEdit([])
                                                    setProcessOptEdit([])
                                                    fetchCustomerEdit(e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Customer<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={customeroptEdit}
                                                placeholder="Please Select Customer"
                                                value={{ label: trainingsubcategoryEdit.customer, value: trainingsubcategoryEdit.customer }}
                                                onChange={(e) => {
                                                    setTrainingsubcategoryEdit({
                                                        ...trainingsubcategoryEdit, customer: e.value,
                                                        queue: "Please Select Queue",
                                                        process: "Please Select Process",
                                                    });
                                                    setDocumentsDisplayEdit("Please Select Documents")
                                                    setDocumentsChosedEdit([])
                                                    setDocumentsListEdit([])
                                                    setProcessOptEdit([])
                                                    fetchQueueEdit(trainingsubcategoryEdit.module, e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Queue<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={queueoptEdit}
                                                placeholder="Please Select Queue"
                                                value={{ label: trainingsubcategoryEdit.queue, value: trainingsubcategory.queue }}
                                                onChange={(e) => {
                                                    setTrainingsubcategoryEdit({
                                                        ...trainingsubcategoryEdit, queue: e.value,
                                                        process: "Please Select Process",
                                                    });
                                                    setDocumentsDisplayEdit("Please Select Documents")
                                                    setDocumentsChosedEdit([])
                                                    setDocumentsListEdit([])
                                                    fetchProcessEdit(trainingsubcategoryEdit.module, trainingsubcategoryEdit.customer, e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Process<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={processOptEdit}
                                                placeholder="Please Select Process"
                                                value={{ label: trainingsubcategoryEdit.process, value: trainingsubcategoryEdit.process }}
                                                onChange={(e) => {
                                                    setTrainingsubcategoryEdit({
                                                        ...trainingsubcategoryEdit, process: e.value
                                                    });
                                                    setDocumentsDisplayEdit("Please Select Documents")
                                                    setDocumentsChosedEdit([])
                                                    fetchAllDocumentsListEdit(trainingsubcategoryEdit.module, trainingsubcategoryEdit.customer, trainingsubcategoryEdit.queue, e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Documents<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={documentsListEdit}
                                                placeholder="Please Select Documents"
                                                value={{ label: DocumentsDisplayEdit, value: DocumentsDisplayEdit }}
                                                onChange={(e) => {
                                                    setDocumentsChosedEdit(e)
                                                    setDocumentsDisplayEdit(e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1} xs={12} sm={6}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={addTodoEdit}
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
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Name <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Name"
                                                value={trainingsubcategoryEdit.subcategoryname}
                                                onChange={(e) => {
                                                    setTrainingsubcategoryEdit({ ...trainingsubcategoryEdit, subcategoryname: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Description</Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={5}
                                                value={trainingsubcategoryEdit.description}
                                                onChange={(e) => {
                                                    setTrainingsubcategoryEdit({ ...trainingsubcategoryEdit, description: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Typography>
                                            Documents List<b style={{ color: "red" }}>*</b>
                                        </Typography>  <br />
                                        {addDocTodoEdit?.length > 0 &&
                                            addDocTodoEdit?.map((data, index) => (
                                                <>
                                                    <Grid container spacing={2}>
                                                        <Grid item md={10} xs={12} sm={6}>
                                                            <Typography>{data.name}</Typography>
                                                        </Grid>
                                                        <Grid item md={2} xs={12} sm={6}>
                                                            <Button
                                                                variant="contained"
                                                                color="error"
                                                                type="button"
                                                                sx={{
                                                                    height: "25px",
                                                                    minWidth: "30px",
                                                                    padding: "6px 10px",
                                                                }}
                                                                onClick={() => {
                                                                    deleteTodoEdit(index);
                                                                }}
                                                            >
                                                                <AiOutlineClose />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>


                                                </>))}
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
            {isUserRoleCompare?.includes("ltrainingsubcategory") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Training Subcategory List</Typography>
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
                                        <MenuItem value={(trainingsubcategorys?.length)}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("exceltrainingsubcategory") && (
                                        // <>
                                        //     <ExportXL csvData={filteredData.map((item, index) => {
                                        //         return {
                                        //             Sno: item.serialNumber,
                                        //             Category: item.category,
                                        //             Subcategory: item.subcategoryname,
                                        //             Duration: item.duration,
                                        //             Module: item.module,
                                        //             Customer: item.customer,
                                        //             Queue: item.queue,
                                        //             Process: item.process,
                                        //             Description: item.description
                                        //         };
                                        //     })} fileName={fileName} />
                                        // </>
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvtrainingsubcategory") && (
                                        // <>
                                        //     <ExportCSV csvData={filteredData.map((item, index) => {
                                        //         return {
                                        //             Sno: item.serialNumber,
                                        //             Category: item.category,
                                        //             Subcategory: item.subcategoryname,
                                        //             Duration: item.duration,
                                        //             Module: item.module,
                                        //             Customer: item.customer,
                                        //             Queue: item.queue,
                                        //             Process: item.process,
                                        //             Description: item.description
                                        //         };
                                        //     })} fileName={fileName} />

                                        // </>
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printtrainingsubcategory") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdftrainingsubcategory") && (
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
                                    {isUserRoleCompare?.includes("imagetrainingsubcategory") && (
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
                        {isUserRoleCompare?.includes("bdtrainingsubcategory") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button>)}


                        <br /><br />
                        {!tasksubcategoryCheck ?
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
                            onClick={(e) => delTrainingSubcategory(trainingsubcategorysid)}
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
                            <Typography sx={userStyle.HeaderText}>Training Subcategory Info</Typography>
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
                                <TableCell>Category</TableCell>
                                <TableCell>SubCategory Name</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Module</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Queue</TableCell>
                                <TableCell>Process</TableCell>
                                <TableCell>Description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {rowDataTable &&
                                (rowDataTable.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.category}</TableCell>
                                        <TableCell>{row.subcategoryname}</TableCell>
                                        <TableCell>{row.duration}</TableCell>
                                        <TableCell>{row.module}</TableCell>
                                        <TableCell>{row.customer}</TableCell>
                                        <TableCell>{row.queue}</TableCell>
                                        <TableCell>{row.process}</TableCell>
                                        <TableCell>{row.description}</TableCell>
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
                fullWidth={true}
            >
                <Box sx={{ padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Training Subcategory</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Category</Typography>
                                    <Typography>{trainingsubcategoryEdit.category}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Name</Typography>
                                    <Typography>{trainingsubcategoryEdit.subcategoryname}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Duration</Typography>
                                    <Typography>{trainingsubcategoryEdit.duration}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Module</Typography>
                                    <Typography>{trainingsubcategoryEdit.module}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Customer</Typography>
                                    <Typography>{trainingsubcategoryEdit.customer}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Queue</Typography>
                                    <Typography>{trainingsubcategoryEdit.queue}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Process</Typography>
                                    <Typography>{trainingsubcategoryEdit.process}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={4} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Description</Typography>
                                    <Typography>{trainingsubcategoryEdit.description}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Documents</Typography>
                                    <Typography>{trainingsubcategoryEdit?.documentslist?.map((t, i) => `${i + 1 + ". "}` + t.name).toString()}</Typography>
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
                                    onClick={(e) => delTrainingSubcheckbox(e)}
                                > OK </Button>
                            </>
                            :
                            <Button variant="contained" color='error' onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Ok</Button>
                        }
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
        </Box>
    );
}


export default TrainingSubcategory;