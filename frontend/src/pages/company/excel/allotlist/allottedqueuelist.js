import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, Dialog, Select, InputLabel, TableCell, Checkbox, TableRow, MenuItem,
    TableBody, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer,
    Button, List, ListItem, ListItemText, Popover, TextField, IconButton
} from "@mui/material";
import { userStyle, colourStyles } from "../../../../pageStyle";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import { AuthContext } from '../../../../context/Appcontext';
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../../components/Errorhandling";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { styled } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import 'jspdf-autotable';
import jsPDF from "jspdf";
import axios from "axios";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import 'react-notifications/lib/notifications.css';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { SERVICE } from "../../../../services/Baseservice";
import moment from 'moment-timezone';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Headtitle from "../../../../components/Headtitle";
import Selects from "react-select";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { UserRoleAccessContext } from '../../../../context/Appcontext';
import 'handsontable/dist/handsontable.full.min.css';
import CircularProgress, { circularProgressClasses, } from '@mui/material/CircularProgress';
import ExcelJS from 'exceljs';
import { saveAs } from "file-saver";
import Papa from "papaparse";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import Pagination from '../../../../components/Pagination';
import LoadingButton from "@mui/lab/LoadingButton";
function FacebookCircularProgress(props) {
    return (
        <Box style={{ position: 'relative' }}>
            <CircularProgress
                variant="determinate"
                style={{
                    color: (theme) =>
                        theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                }}
                size={40}
                thickness={4}
                {...props}
                value={100}
            />
            <CircularProgress
                variant="indeterminate"
                disableShrink
                style={{
                    color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                    animationDuration: '550ms',
                    position: 'absolute',
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: 'round',
                    },
                }}
                size={40}
                thickness={4}
                {...props}
            />
        </Box>
    );
}

function Allotqueuelist() {

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);
    const [isBtn, setIsBtn] = useState(false);
    const [loadingOverall, setLoadingOverall] = useState(false);
    const [excelmapdata, setExcelmapdata] = useState([]);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [timePointsList, setTimePointsList] = useState([])
    const [openview, setOpenview] = useState(false);
    const [isLoader, setIsLoader] = useState(false);

    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [exceleditupdateby, setExceleditupdateby] = useState([]);
    const [copiedData, setCopiedData] = useState('');
    const [exceledit, setExceledit] = useState({
        customer: "", process: "", category: "", subcategory: "", queue: "", time: "", points: "", updateby: ""
    });
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
    const handleExportXL = async (isfilter) => {
        if (isfilter === "filtered") {
            exportToCSV(
                filteredDatas?.map((row, index) => ({
                    'S.No': index + 1,
                    'Customer': row.customer,
                    "Process": row.process,
                    'Project Name': row.project,
                    'Vendor Name': row.vendor,
                    "Category Name": row.category,
                    "Subcategory Name": row.subcategory,
                    "Queue Name": row.queue,
                    "Time": row.time,
                    "Points": parseFloat(row.points),
                })),
                fileNameAllot,
            );
        } else if (isfilter === "overall") {
            setLoadingOverall(true)
            let res_task = await axios.get(SERVICE.EXCELMAPDATA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            exportToCSV(
                res_task?.data?.excelmapdatas?.map((row, index) => ({
                    'S.No': index + 1,
                    'Customer': row.customer,
                    "Process": row.process,
                    'Project Name': row.project,
                    'Vendor Name': row.vendor,
                    "Category Name": row.category,
                    "Subcategory Name": row.subcategory,
                    "Queue Name": row.queue,
                    "Time": row.time,
                    "Points": parseFloat(row.points),
                })),
                fileNameAllot,
            );
            setLoadingOverall(false)
        }

        setIsFilterOpen(false)
    };



    const downloadPdf = async (isfilter) => {
        const doc = new jsPDF();
        // Initialize serial number counter
        let serialNumberCounter = 1;

        // Modify columns to include serial number column
        const columnsWithSerial = [
            { title: "SNo", dataKey: "serialNumber" }, // Serial number column
            ...allotcolumns.map((col) => ({ ...col, dataKey: col.field })),
        ];
        let overall;
        if (isfilter === "overall") {
            let res_task = await axios.get(SERVICE.EXCELMAPDATA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            overall = res_task?.data?.excelmapdatas?.map((row, index) => ({
                serialNumber: index + 1,
                customer: row.customer,
                process: row.process,
                project: row.project,
                vendor: row.vendor,
                category: row.category,
                subcategory: row.subcategory,
                queue: row.queue,
                time: row.time,
                points: row.points,
            }));

        }





        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            filteredDatas.map((row, index) => ({
                serialNumber: index + 1,
                customer: row.customer,
                process: row.process,
                project: row.project,
                vendor: row.vendor,
                category: row.category,
                subcategory: row.subcategory,
                queue: row.queue,
                time: row.time,
                points: row.points,
            })) :
            overall

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 4,
            },
            columns: columnsWithSerial,
            body: dataWithSerial,
        });

        doc.save("AllottedQueueList.pdf");
    };

    const [getrowid, setRowGetid] = useState("");
    const { auth } = useContext(AuthContext);

    //OVERALL EDIT FUNCTIONALITY
    const [ovProj, setOvProj] = useState("");
    const [getOverAllCount, setGetOverallCount] = useState("");
    const [ovProjcount, setOvProjcount] = useState()

    //OVERALL EDIT FUNCTIONALITY
    const [ovProjsub, setOvProjsub] = useState("");
    const [ovProjcountsub, setOvProjcountsub] = useState()

    //OVERALL EDIT FUNCTIONALITY
    const [ovProjqueue, setOvProjqueue] = useState("");
    const [ovProjcountqueue, setOvProjcountqueue] = useState()

    const [ovProjcustomer, setOvProjcustomer] = useState("");
    const [ovProjprocess, setOvProjprocess] = useState("");
    const [ovProjproject, setOvProjproject] = useState("");
    const [ovProjvendor, setOvProjvendor] = useState("");

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    //filter fields
    const [allFilters, setAllFilters] = useState({
        project: "Please Select Project",
        vendor: "Please Select Vendor",
        category: "Please Select Category",
        subcategory: "Please Select Subcategory",
        queue: "Please Select Queue",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
        responsibleperson: "Please Select ResponsiblePerson",
        sector: "Please Select Sector"
    })
    const [vendors, setVendors] = useState([]);
    const [projects, setProjects] = useState([]);
    const [categorys, setCategorys] = useState([]);
    const [subcategorys, setSubCategorys] = useState([]);
    const [queues, setQueues] = useState([]);
    const [units, setUnits] = useState([]);
    const [canvasState, setCanvasState] = useState(false)
    //image
    const handleCaptureImage = () => {
        // Find the table by its ID
        const table = document.getElementById("excelcanvastable");

        // Clone the table element
        const clonedTable = table.cloneNode(true);

        // Append the cloned table to the document body (it won't be visible)
        clonedTable.style.position = "absolute";
        clonedTable.style.top = "-9999px";
        document.body.appendChild(clonedTable);

        // Use html2canvas to capture the cloned table
        html2canvas(clonedTable).then((canvas) => {
            // Remove the cloned table from the document body
            document.body.removeChild(clonedTable);

            // Convert the canvas to a data URL and create a download link
            const dataURL = canvas.toDataURL("image/jpeg", 0.8);
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "Allotted_Queue.png";
            link.click();
        });
    };


    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const handleClickOpenCheck = () => {
        setisCheckOpen(true);
    };
    const handleCloseCheck = () => {
        setisCheckOpen(false);
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

    const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
        '& .MuiDataGrid-virtualScroller': {
            overflowY: 'hidden',
        },
        '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: " bold !important ",

        },
        '& .custom-id-row': {
            backgroundColor: '#1976d22b !important',
        },

        '& .MuiDataGrid-row.Mui-selected': {
            '& .custom-ago-row, & .custom-in-row, & .custom-others-row': {
                backgroundColor: 'unset !important', // Clear the background color for selected rows
            },
        },
        '&:hover': {
            '& .custom-ago-row:hover': {
                backgroundColor: '#ff00004a !important',
            },
            '& .custom-in-row:hover': {
                backgroundColor: '#ffff0061 !important',
            },
            '& .custom-others-row:hover': {
                backgroundColor: '#0080005e !important',
            },
        },
    }));


    // Show All Columns & Manage Columns 
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        project: true,
        vendor: true,
        customer: true,
        process: true,
        hyperlink: true,
        category: true,
        subcategory: true,
        queue: true,
        time: true,
        points: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // Edit model
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setIsEditOpen(false);
    };

    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
        setExceledit([])
    };
    // overall edit Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };


    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };

    //bulk Delete model
    const [isDeleteOpenbulk, setIsDeleteOpenbulk] = useState(false);

    const handleClickOpenbulk = () => {
        setIsDeleteOpenbulk(true);
    };
    const handleCloseModbulk = () => {
        setIsDeleteOpenbulk(false);
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };
    //Delete model
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [isEditOpenalert, setIsEditOpenalert] = useState(false);
    const [isEditAnsCheckalert, setIsEditAnsCheckalert] = useState(false);
    const [isEditOpencheckbox, setIsEditOpencheckbox] = useState(false);
    const [bulkEditProjectName, setBulkEditProjectName] = useState("Select Branch");
    const [excelOveralledit, setExcelOveralledit] = useState({
        category: "Please Select Category", subcategory: "Please Select Sub-Category", queue: "Please Select Queue", time: "", points: "", updateby: ""
    });
    const [bulkOverallEdit, setbulkOverallEdit] = useState([])
    const [bulkEditOverallCount, setbulkEditOverallCount] = useState(0)


    const [bulkOverallDelete, setbulkOverallDelete] = useState([])
    const [bulkOverallDeletecheck, setbulkOverallDeletecheck] = useState([])


    const handleClickOpenalertEdit = () => {
        let ans = excelmapdata?.filter((data) => selectedRows.includes(data._id)).map((data) => data.project)

        let uniqueArray = Array.from(new Set(ans));
        setBulkEditProjectName(uniqueArray[0])

        if (selectedRows.length == 0) {
            setIsEditOpenalert(true);
        }
        else if (selectedRows.length > 0 && uniqueArray?.length > 1) {
            setIsEditAnsCheckalert(true)
        }
        else {
            fetchOverallBulkEdit();
            setIsEditOpencheckbox(true);

        }
    };

    const handleCloseModalertEdit = () => {
        setIsEditOpenalert(false);
    };
    const handleCloseAnsCheckEdit = () => {
        setIsEditAnsCheckalert(false);
    };
    const handleCloseBulEdit = () => {
        setIsEditOpencheckbox(false);
        setExcelOveralledit({ ategory: "", subcategory: "", queue: "", time: "", points: "", updateby: "" });
    };


    //get all Time Loints List.
    const fetchOverallBulkEdit = async () => {
        try {
            let res = await axios.post(SERVICE.BULKOVERALL_ALOTTEDQUEUE_LIST, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                selectedId: selectedRows
            });

            setbulkOverallEdit(res?.data?.resultData)
            setbulkEditOverallCount(res?.data?.count)

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    //get all Time Loints List.
    const fetchOverallBulkDelete = async () => {
        try {
            let res = await axios.post(SERVICE.BULKOVERALLDELETE_ALOTTEDQUEUE_LIST, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                selectedId: selectedRows
            });

            if (selectedRows.length == 0) {
                setIsDeleteOpenalert(true);
            } else if ((res?.data?.resultDataDelete).length > 0) {
                setbulkOverallDelete(res?.data?.notmatcheddata)
                setbulkOverallDeletecheck(res?.data?.resultDataDelete)
                setIsDeleteOpenbulk(true);
            }else {
                setIsDeleteOpencheckbox(true);
            }
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //Delete model
    const [isBulkOverallEditOpen, setIsBulkOverallEditOpen] = useState(false);

    const handleClickOpenBulkOverallEdit = () => {
        setIsBulkOverallEditOpen(true);
    };
    const handleCloseModBulkOverallEdit = () => {
        setIsBulkOverallEditOpen(false);
    };


    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpencheckbox = () => {

        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };
    //get all Time Loints List.
    const fetchAllTimePoints = async () => {
        try {
            let res_queue = await axios.get(SERVICE.TIMEPOINTS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTimePointsList(res_queue?.data?.timepoints)
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const getTimeandPoints = (project, category, subcategory) => {
        const matchingTeams = timePointsList.filter(team => team.project === project && team.category === category && team.subcategory === subcategory);
        if (matchingTeams.length > 0) {
            return matchingTeams[0].time;

        }
    }

    const getPoints = (project, category, subcategory) => {

        const matchingTeams = timePointsList.filter(team => team.project === project && team.category === category && team.subcategory === subcategory);
        if (matchingTeams.length > 0) {
            return matchingTeams[0].points;

        }
    }


    const getOverallEditTimeandPoints = (project, category, subcategory) => {

        const matchingTeams = timePointsList.filter(team => team.project === project && team.category === category && team.subcategory === subcategory);
        if (matchingTeams.length > 0) {
            return matchingTeams[0].time;

        }
    }

    const getOverallPoints = (project, category, subcategory) => {
        const matchingTeams = timePointsList.filter(team => team.project === project && team.category === category && team.subcategory === subcategory);
        if (matchingTeams.length > 0) {
            return matchingTeams[0].points;

        }
    }

    const fetchCategoryDropdowns = async () => {
        try {
            let res_project = await axios.get(SERVICE.CATEGORYEXCEL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setCategories(res_project?.data?.categoryexcel);

        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


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
        }, [])


    //overall edit section for all pages 
    const getOverallEditSection = async (category, subcategory, queue, customer, process, project, vendor) => {
        try {
            let res = await axios.post(SERVICE.GETOVERALL_EXCELMAPDATA, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                oldnamecate: category,
                oldnamesub: subcategory,
                oldnamequeue: queue,
                oldnamecustomer: customer,
                oldnameprocess: process,
                oldnameproject: project,
                oldnamevendor: vendor

            });
            setOvProjcount(res?.data?.categorycount);
            setOvProjcountsub(res?.data?.subcategorycount);
            setOvProjcountqueue(res?.data?.queuecount);

            setGetOverallCount(`The ${res?.data?.category?.length > 0 ? customer : ""} ${res?.data?.subcategory?.length > 0 ? process : ""}  is linked in 
       ${res?.data?.category?.length > 0 || res?.data?.subcategory?.length > 0 || res?.data?.queue?.length > 0 ? "Allotted Responsible person ," : ""}
     whether you want to do changes ..??`)
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //overall edit section for all pages 
    const getOverallEditSectionUpdate = async () => {
        try {
            let res = await axios.post(SERVICE.GETOVERALL_EXCELMAPDATA, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                oldnamecate: ovProj,
                oldnamesub: ovProjsub,
                oldnamequeue: ovProjqueue,
                oldnamecustomer: ovProjcustomer,
                oldnameprocess: ovProjprocess,
                oldnameproject: ovProjproject,
                oldnamevendor: ovProjvendor

            });
            sendEditRequestOverall(res?.data?.category, res?.data?.subcategory, res?.data?.queue);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const sendEditRequestOverall = async (category, subcategory, queue) => {
        try {

            if (category.length > 0) {
                let answ = category.map((d, i) => {
                    let res = axios.put(`${SERVICE.EXCELMAPDATARESPERSON_SINGLE}/${d._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        category: String(exceledit.category)

                    });

                })

            }
            if (subcategory.length > 0) {
                let answ = subcategory.map((d, i) => {
                    let res = axios.put(`${SERVICE.EXCELMAPDATARESPERSON_SINGLE}/${d._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        subcategory: String(exceledit.subcategory === "Please Select Subcategory" ? "ALL" : exceledit.subcategory),

                    });

                })

            }
            if (queue.length > 0) {
                let answ = queue.map((d, i) => {
                    let res = axios.put(`${SERVICE.EXCELMAPDATARESPERSON_SINGLE}/${d._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        queue: String(exceledit.queue)

                    });

                })

            }
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // get single row to edit....
    const getCode = async (e, category, subcategory, queue, customer, process, project, vendor) => {
        try {
            let res = await axios.get(`${SERVICE.EXCELMAPDATA_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            setExceledit(res?.data?.sexcelmapdata);
            setExceleditupdateby(res?.data?.sexcelmapdata.updatedby);
            setRowGetid(res?.data?.sexcelmapdata);
            setOvProj(category);
            setOvProjsub(subcategory);
            setOvProjqueue(queue);
            setOvProjcustomer(customer);
            setOvProjprocess(process);
            setOvProjproject(project);
            setOvProjvendor(vendor);
            handleClickOpenEdit();
            getOverallEditSection(category, subcategory, queue, customer, process, project, vendor);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.EXCELMAPDATA_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            setExceledit(res?.data?.sexcelmapdata);
            handleClickOpenview();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}

    };

    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.EXCELMAPDATA_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setExceledit(res?.data?.sexcelmapdata);
            setExceleditupdateby(res?.data?.sexcelmapdata?.updatedby);
            handleClickOpeninfo();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const [excelMapDelCheck, setExcelMapDelCheck] = useState([])
    const [deleteAlloted, setDeleteAllotted] = useState([])
    //set function to get particular row
    const rowData = async (id, name, customer, process) => {
        try {
            let res = await axios.get(`${SERVICE.EXCELMAPDATA_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            setDeleteAllotted(res?.data?.sexcelmapdata);
            let excelDeleteExcelperson = await axios.post(`${SERVICE.EXCELMAP_MAPPERSON_DELETE}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                customer: customer,
                process: process,
            });
            setExcelMapDelCheck(excelDeleteExcelperson.data.excelmapdatas)
            if (excelDeleteExcelperson.data.excelmapdatas.length > 0) {
                handleClickOpenCheck();
            } else {
                handleClickOpen();
            }
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    // Alert delete popup
    let projectid = deleteAlloted._id;
    const delProject = async () => {
        try {
            let res = await axios.delete(`${SERVICE.EXCELMAPDATA_SINGLE}/${projectid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            let newdata = [{
                customer: deleteAlloted.customer,
                priority: deleteAlloted.priority,
                process: deleteAlloted.process,
                hyperlink: deleteAlloted.hyperlink,
                project: deleteAlloted.project,
                vendor: deleteAlloted.vendor,
                date: deleteAlloted.date,
                time: deleteAlloted.time,
                count: deleteAlloted.count,
                tat: deleteAlloted.tat,
                created: deleteAlloted.created,
            }];

            await OnFilterSubmit("false");
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Deleted Successfully"}</p>
                </>
            );
            handleClickOpenerr();
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };



    const delProjectcheckbox = async (customer, process) => {
        try {
           
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.EXCELMAPDATA_SINGLE}/${item}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);

            await OnFilterSubmit("false")
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectedProjects([]);
            setSelectAllChecked(false);
            setPage(1);
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Deleted Successfully"}</p>
                </>
            );
            handleClickOpenerr();
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const delProjectcheckboxbulk = async (selectedId) => {
        try {

            const deletePromises = selectedId?.map((item) => {
                return axios.delete(`${SERVICE.EXCELMAPDATA_SINGLE}/${item}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);

            await OnFilterSubmit("false");
            handleCloseModcheckbox();
            handleCloseModbulk();
            setSelectedRows([]);
            setSelectedProjects([]);
            setSelectAllChecked(false);
            setPage(1);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const fetchAllQueueGrp = async () => {
        try {
            let res_queue = await axios.get(SERVICE.QUEUEGROUP, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const subcatall = [...res_queue?.data?.queuegroups.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            setQueues(subcatall)
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const [excelmaplength, setExcelmaplength] = useState();


    //filter options
    const fetchProjectDropdowns = async () => {
        try {
            let res_project = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const projall = [...res_project?.data?.projmaster.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            setProjects(projall);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //project change vendor filter
    const handleProjectChange = async (e) => {
        try {
            const [
                res_vendor,
                res_category
            ] = await Promise.all([
                axios.post(SERVICE.PROJECTVENDOR, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    project: String(e.value)
                }),
                axios.post(SERVICE.PROJECTCATEGORY, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    project: String(e.value)
                })
            ]);
            const vendorall = [...res_vendor?.data?.projectvendor.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            const categoryall = [...res_category?.data?.projectcategory.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            setCategorys(categoryall)
            setVendors(vendorall);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    //category change subcategory filter
    const handleCategorychange = async (e) => {
        try {
            const [
                res_subcategory,
            ] = await Promise.all([
                axios.post(SERVICE.CATEGORYSUBCATEGORY, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    category: String(e.value),
                    project: String(allFilters.project)
                }),
            ]);
            const subcatall = [...res_subcategory?.data?.catsubtime.map((d) => (
                {
                    ...d,
                    label: d.subcategory,
                    value: d.subcategory
                }
            ))];
            const queueall = [...res_subcategory?.data?.queueCheck.map((d) => (
                {
                    ...d,
                    label: d.queuename,
                    value: d.queuename
                }
            ))];
            setSubCategorys(subcatall)
            setQueues(queueall);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    //branch change unit filter
    const handleChangeBranch = async (e) => {
        if (e.value == "NOT FOR US" || e.value == "OTHER-NFU" || e.value == "OTHER" || e.value == "WEB-NFU") {
            setUnits([...dropdowndata])
        } else {
            try {
                let res_unit = await axios.post(SERVICE.BRANCHUNIT, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    branch: String(e.value)
                });
                const unitsall = [...dropdowndata, ...res_unit?.data?.branchunits.map((d) => (
                    {
                        ...d,
                        label: d.name,
                        value: d.name
                    }
                ))];
                setUnits(unitsall)
             } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
        };
    }
    const dropdowndata = [{ label: 'NOT FOR US', value: 'NOT FOR US' }, { label: 'OTHER-NFU', value: 'OTHER-NFU' }, { label: 'OTHER', value: 'OTHER' }, { label: 'WEB-NFU', value: 'WEB-NFU' }]

    // EXCEL_WORK_ORDER_OTHERallFilter
    //On Submit Filtering Data of Excel Datas
    const OnFilterSubmit = async (e) => {
        setIsLoader(false)
        try {
            let res_employee = await axios.post(SERVICE.ALLOTTED_QUEUE_LIST_FILTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                project: allFilters.project === "Please Select Project" ? "" : allFilters.project,
                vendor: allFilters.vendor === "Please Select Vendor" ? "" : allFilters.vendor,
                category: allFilters.category === "Please Select Category" ? "" : allFilters.category,
                subcategory: allFilters.subcategory === "Please Select Subcategory" ? "" : allFilters.subcategory,
                queue: allFilters.queue === "Please Select Queue" ? "" : allFilters.queue,
                page: page,
                pageSize: pageSize,
                value: e
            });

            setExcelmapdata(res_employee?.data?.result);


            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                // serialNumber: index + 1,
            }));
            setExcelmapdata(itemsWithSerialNumber);
            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            setIsLoader(true)
            setIsBtn(false)
        } catch (err) {setIsLoader(true); setIsBtn(false);handleApiError(err, setShowAlert, handleClickOpenerr);}

    }

    const handleSubmit = (e) => {

        e.preventDefault();
        if (allFilters.project === "Please Select Project" && allFilters.vendor === "Please Select Vendor" &&
            allFilters.category === "Please Select Category" && allFilters.subcategory === "Please Select Subcategory" &&
            allFilters.queue === "Please Select Queue") {

            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Atleast One Field"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            setIsBtn(true)
            OnFilterSubmit("true");
        }
    }

    useEffect(() => {
        OnFilterSubmit("false")
    }, [page, pageSize])

    const handleClear = () => {
        setAllFilters({
            project: "Please Select Project",
            vendor: "Please Select Vendor",
            category: "Please Select Category",
            subcategory: "Please Select Subcategory",
            queue: "Please Select Queue",
        });
        setVendors([])
        setCategorys([])
        setSubCategorys([])
        setQueues([])

        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Cleared Successfully"}</p>
            </>
        );
        handleClickOpenerr();
        OnFilterSubmit("cleared")

    }

    useEffect(
        () => {
            fetchProjectDropdowns();
        }, []);

    let newdate = new Date();

    //edit post call
    let excelmap_id = getrowid._id
    const sendRequestEdit = async () => {
        try {
            let excelmap = await axios.put(`${SERVICE.EXCELMAPDATA_SINGLE}/${excelmap_id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                project: String(exceledit.project),
                vendor: String(exceledit.vendor),
                customer: String(exceledit.customer),
                process: String(exceledit.process),
                category: String(exceledit.category),
                subcategory: String(exceledit.subcategory === "Please Select Subcategory" ? "ALL" : exceledit.subcategory),
                queue: String(exceledit.queue),
                time: getTimeandPoints(exceledit.project, exceledit.category, exceledit.subcategory === "Please Select Subcategory" ? "ALL" : exceledit.subcategory) ? getTimeandPoints(exceledit.project, exceledit.category, exceledit.subcategory === "Please Select Subcategory" ? "ALL" : exceledit.subcategory) : "",
                points: getPoints(exceledit.project, exceledit.category, exceledit.subcategory === "Please Select Subcategory" ? "ALL" : exceledit.subcategory) ? getPoints(exceledit.project, exceledit.category, exceledit.subcategory === "Please Select Subcategory" ? "ALL" : exceledit.subcategory) : "",
                username: String(isUserRoleAccess.companyname),
                updatedate: String(moment(newdate).format('DD-MM-YYYY hh:mm:ss a')),
                updatedby: [
                    ...exceleditupdateby, {
                        name: String(isUserRoleAccess.companyname),
                        category: String(exceledit.category),
                        subcategory: String(exceledit.subcategory),
                        queue: String(exceledit.queue),
                        date: String(new Date()),
                    },
                ],
            })
            setExceledit(excelmap.data);
            handleCloseModEdit();
            await OnFilterSubmit("false");
            await getOverallEditSectionUpdate();
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
        if (exceledit.category === "" || exceledit.category === "Please Select Category") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Category Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else if (exceledit.queue === "" || exceledit.queue === "Please Select Queue") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Queue Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if ((exceledit.category != ovProj && ovProjcount > 0) || (exceledit.subcategory != ovProjsub && ovProjcountsub > 0) || (exceledit.queue != ovProjqueue && ovProjcountqueue > 0)) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {getOverAllCount}
                    </p>
                </>
            );
            handleClickOpenerrpop()
        }
        else if (exceledit.subcategory != ovProjsub && ovProjcountsub > 0) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {getOverAllCount}
                    </p>
                </>
            );
            handleClickOpenerrpop()
        }
        else if (exceledit.queue != ovProjqueue && ovProjcountqueue > 0) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {getOverAllCount}
                    </p>
                </>
            );
            handleClickOpenerrpop()
        }
        else {
            sendRequestEdit();
        }
    };

    const sendRequestOverallEdit = async () => {
        try {
            let ans = excelmapdata?.filter((data) => selectedRows.includes(data._id)).map((data) => {
                let update = data.updatedby
                let excelmap = axios.put(`${SERVICE.EXCELMAPDATA_SINGLE}/${data._id}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    category: String(excelOveralledit.category),
                    subcategory: String(excelOveralledit.subcategory === "Please Select Subcategory" ? "ALL" : excelOveralledit.subcategory),
                    queue: String(excelOveralledit.queue),
                    time: getOverallEditTimeandPoints(bulkEditProjectName, excelOveralledit.category, excelOveralledit.subcategory === "Please Select Subcategory" ? "ALL" : excelOveralledit.subcategory) ? getTimeandPoints(bulkEditProjectName, excelOveralledit.category, excelOveralledit.subcategory === "Please Select Subcategory" ? "ALL" : excelOveralledit.subcategory) : "",
                    points: getOverallPoints(bulkEditProjectName, excelOveralledit.category, excelOveralledit.subcategory === "Please Select Subcategory" ? "ALL" : excelOveralledit.subcategory) ? getOverallPoints(bulkEditProjectName, excelOveralledit.category, excelOveralledit.subcategory === "Please Select Subcategory" ? "ALL" : excelOveralledit.subcategory) : "",
                    username: String(isUserRoleAccess.companyname),
                    updatedate: String(moment(newdate).format('DD-MM-YYYY hh:mm:ss a')),
                    updatedby: [
                        ...update, {
                            name: String(isUserRoleAccess.companyname),
                            category: String(excelOveralledit.category),
                            subcategory: String(excelOveralledit.subcategory),
                            queue: String(excelOveralledit.queue),
                            date: String(new Date()),
                        },
                    ],
                })
            })
            let answer = bulkEditOverallCount > 0 && bulkOverallEdit.map((item) => {
                let excelmap = axios.put(`${SERVICE.EXCELMAPDATARESPERSON_SINGLE}/${item._id}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    category: String(excelOveralledit.category),
                    subcategory: String(excelOveralledit.subcategory === "Please Select Subcategory" ? "ALL" : excelOveralledit.subcategory),
                    queue: String(excelOveralledit.queue),
                    time: getOverallEditTimeandPoints(bulkEditProjectName, excelOveralledit.category, excelOveralledit.subcategory === "Please Select Subcategory" ? "ALL" : excelOveralledit.subcategory) ? getTimeandPoints(bulkEditProjectName, excelOveralledit.category, excelOveralledit.subcategory === "Please Select Subcategory" ? "ALL" : excelOveralledit.subcategory) : "",
                    points: getOverallPoints(bulkEditProjectName, excelOveralledit.category, excelOveralledit.subcategory === "Please Select Subcategory" ? "ALL" : excelOveralledit.subcategory) ? getOverallPoints(bulkEditProjectName, excelOveralledit.category, excelOveralledit.subcategory === "Please Select Subcategory" ? "ALL" : excelOveralledit.subcategory) : "",
                    username: String(isUserRoleAccess.companyname),

                })

            })

            handleCloseModBulkOverallEdit();
            handleCloseBulEdit();
            await OnFilterSubmit("false")
            setSelectedRows([]);
            setExcelOveralledit({ ategory: "", subcategory: "", queue: "", time: "", points: "", updateby: "" });
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Updated Successfully"}</p>
                </>
            );
            handleClickOpenerr();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    const editOverallSubmit = (e) => {
        e.preventDefault();
        if (excelOveralledit.category === "" || excelOveralledit.category === "Please Select Category") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Category"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (excelOveralledit.subcategory === "" || excelOveralledit.subcategory === "Please Select Sub-Category") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Sub-Category"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (excelOveralledit.queue === "" || excelOveralledit.queue === "Please Select Queue") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Queue Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (bulkEditOverallCount > 0) {
            handleClickOpenBulkOverallEdit();
        }
        else {
            sendRequestOverallEdit();
        }
    };


    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setIsBtn(false)
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
        setIsBtn(false)
    };

    useEffect(() => {
        fetchCategoryDropdowns();
        fetchAllQueueGrp();
        fetchAllTimePoints();
    }, [])

    useEffect(() => {
        fetchCategoryDropdowns();
        fetchAllQueueGrp();
        fetchAllTimePoints();
    }, [exceledit])

    //Alloted Queue list
    const checkallotqueue = excelmapdata?.map((item, index) => ({
        ...item,
        sno: index + 1,
        project: item.project,
        vendor: item.vendor,
        customer: item.customer,
        process: item.process,
        category: item.category,
        subcategory: item.subcategory,
        queue: item.queue,
        time: item.time,
        points: item.points

    }));

    const allotcolumns = [
        { title: "Project Name", field: "project" },
        { title: "Vendor Name", field: "vendor" },
        { title: "Customer", field: "customer" },
        { title: "Process", field: "process" },
        { title: "Category Name", field: "category" },
        { title: "Subcategory Name", field: "subcategory" },
        { title: "Queue Name", field: "queue" },
        { title: "Time", field: "time" },
        { title: "Points", field: "points" },

    ];

    const downloadPdfAllot = () => {
        const doc = new jsPDF();
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 6, // Set the font size to 10
            },
            columns: allotcolumns.map((col) => ({ ...col, dataKey: col.field })),
            body: checkallotqueue,
        });
        doc.save("Alloted Queue List.pdf");
    }

    const [excelDataAllot, setExceldataAllot] = useState("");


    const fileNameAllot = "Allotted Queue List";

    const getexcelDatasAllot = async () => {
            var data = checkallotqueue?.map((t, index) => ({
                "Sno": index + 1,
                "project Name": t.project,
                "Vendor Name": t.vendor,
                "Customer": t.customer,
                "Process": t.process,
                "Category Name": t.category,
                "Subcategory Name": t.subcategory,
                "Queue Name": t.queue,
                "Time": t.time,
                "Points": t.points,
            }));
            setExceldataAllot(data);
    };

    //print...
    const componentRefAllot = useRef();
    const handleprintAllot = useReactToPrint({
        content: () => componentRefAllot.current,
        documentTitle: "Alloted Queue List ",
        pageStyle: "print",
    })
    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false)
        setSelectedProjects([]);

    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false)
        setSelectedProjects([]);
        setPage(1);

    };


    //datatable....filteredData
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };


    // Split the search query into individual terms
    const searchOverTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = excelmapdata?.filter((item) => {
        return searchOverTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });
    useEffect(() => {
        getexcelDatasAllot()
    }, [excelmapdata, exceledit])

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
                            setSelectedProjects([]);
                        } else {
                            const allRowIds = rowDataTable.map((row) => row.id);
                            const allRowProjects = rowDataTable.map((row) => row.project);
                            setSelectedRows(allRowIds);
                            setSelectedProjects(allRowProjects)

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
                        let updatedSelectedRowsProjects;
                        if (selectedRows.includes(params.row.id)) {
                            updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
                            updatedSelectedRowsProjects = selectedRows.filter((selectedId) => selectedId !== params.row.id);
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                            updatedSelectedRowsProjects = [...selectedProjects, params.row.project];
                        }

                        setSelectedRows(updatedSelectedRows);
                        setSelectedProjects(updatedSelectedRowsProjects)

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
        { field: "project", headerName: "Project", flex: 0, width: 150, hide: !columnVisibility.project, headerClassName: "bold-header" },
        { field: "vendor", headerName: "Vendor", flex: 0, width: 130, hide: !columnVisibility.vendor, headerClassName: "bold-header" },
        { field: "customer", headerName: "Customer", flex: 0, width: 130, hide: !columnVisibility.customer, headerClassName: "bold-header" },
        {
            field: "process", headerName: "Process", flex: 0, width: 340, hide: !columnVisibility.process,
        },
        { field: "category", headerName: "Category", flex: 0, width: 200, hide: !columnVisibility.category, headerClassName: "bold-header" },
        { field: "subcategory", headerName: "Subcategory", flex: 0, width: 150, hide: !columnVisibility.subcategory, headerClassName: "bold-header" },
        { field: "queue", headerName: "Queue", flex: 0, width: 200, hide: !columnVisibility.queue, headerClassName: "bold-header" },
        { field: "points", headerName: "Points", flex: 0, width: 130, hide: !columnVisibility.points, headerClassName: "bold-header" },
        { field: "time", headerName: "Time", flex: 0, width: 130, hide: !columnVisibility.time, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 300,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("eallotedqueuelist") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {
                          
                            getCode(params.row.id, params.row.category, params.row.subcategory, params.row.queue,
                                params.row.customer, params.row.process, params.row.project, params.row.vendor)
                        }}>
                            <EditOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vallotedqueuelist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                           
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iallotedqueuelist") && (

                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                               
                                getinfoCode(params.row.id);
                            }}
                        >
                            <InfoOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dallotedqueuelist") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id, params.row.name, params.row.customer, params.row.process);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon
                                style={{ fontsize: "large" }}
                            />
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
            project: item.project,
            vendor: item.vendor,
            customer: item.customer,
            process: item.process,
            hyperlink: item?.hyperlink,
            category: item.category,
            subcategory: item.subcategory,
            queue: item.queue,
            time: item.time,
            points: item.points === 'Unallotted' ? 'Unallotted' : Number(item.points),
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
            <Headtitle title={'Allotted Queue List'} />
            {isUserRoleCompare?.includes("lallotedqueuelist")
                && (
                    <>
                        <Box sx={userStyle.container}>
                            <Typography sx={userStyle.SubHeaderText}>Allotted Queue List</Typography>
                            <br></br>
                            <br></br>
                            <Grid container spacing={2}>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Project</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={projects}
                                            styles={colourStyles}
                                            value={{ label: allFilters.project, value: allFilters.project }}
                                            onChange={(e) => { handleProjectChange(e); setAllFilters({ ...allFilters, project: e.value, vendor: "Please Select Vendor", category: "Please Select Category", subcategory: "Please Select Subcategory", queue: "Please Select Queue" }) }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Vendor</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={vendors}
                                            styles={colourStyles}
                                            value={{ label: allFilters.vendor, value: allFilters.vendor }}
                                            onChange={(e) => setAllFilters({ ...allFilters, vendor: e.value })}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Category</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={categorys}
                                            styles={colourStyles}
                                            value={{ label: allFilters.category, value: allFilters.category }}
                                            onChange={(e) => { setAllFilters({ ...allFilters, category: e.value }); handleCategorychange(e); }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Subcategory</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={subcategorys}
                                            styles={colourStyles}
                                            value={{ label: allFilters.subcategory, value: allFilters.subcategory }}
                                            onChange={(e) => { setAllFilters({ ...allFilters, subcategory: e.value }); }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Queue</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={queues}
                                            styles={colourStyles}
                                            value={{ label: allFilters.queue, value: allFilters.queue }}
                                            onChange={(e) => { setAllFilters({ ...allFilters, queue: e.value }); }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={9} md={3} xs={12} sm={6}>
                                </Grid>

                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <LoadingButton loading={isBtn} variant="contained" onClick={(e) => handleSubmit(e)} >FILTER</LoadingButton>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Button sx={userStyle.btncancel} onClick={handleClear}>CLEAR</Button>
                                </Grid>
                            </Grid><br></br>
                            <br></br>
                            <br></br>


                            <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Box>
                                        <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={25}>25</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>
                                        </Select>
                                        <label htmlFor="pageSizeSelect">&ensp;entries</label>
                                    </Box>
                                </Grid>
                                <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Box >

                                        {isUserRoleCompare?.includes("excelallotedqueuelist")
                                            && (
                                                <>
                                                    <Button onClick={(e) => {
                                                        setIsFilterOpen(true)
                                                        setFormat("xl")
                                                    }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                        {isUserRoleCompare?.includes("csvallotedqueuelist")
                                            && (
                                                <>
                                                    <Button onClick={(e) => {
                                                        setIsFilterOpen(true)
                                                        setFormat("csv")
                                                    }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                                </>
                                            )}
                                        {isUserRoleCompare?.includes("printallotedqueuelist")
                                            && (
                                                <>
                                                    <Button sx={userStyle.buttongrp}
                                                        onClick={handleprintAllot}
                                                    >
                                                        &ensp;
                                                        <FaPrint />
                                                        &ensp;Print&ensp;
                                                    </Button>
                                                </>
                                            )}
                                        {isUserRoleCompare?.includes("pdfallotedqueuelist")
                                            && (
                                                <>
                                                    <Button sx={userStyle.buttongrp}
                                                        onClick={() => {
                                                            setIsPdfFilterOpen(true)
                                                        }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                </>
                                            )}
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>

                                    </Box>
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
                            {isUserRoleCompare?.includes("bdallotedqueuelist") && (
                                <Button variant="contained" color="error" onClick={(e) => fetchOverallBulkDelete(e)} >Bulk Delete</Button>
                            )}&ensp;
                            {isUserRoleCompare?.includes("beallotedqueuelist") && (
                                <Button variant="contained" color="success" onClick={handleClickOpenalertEdit} >Bulk Edit</Button>

                            )}<br />
                            <br />

                            {!isLoader ?

                                <>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FacebookCircularProgress />
                                    </Box>
                                </> :
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
                                    <Box>
                                        <Pagination
                                            page={ searchQuery !== "" ? 1 : page}
                                            pageSize={pageSize}
                                            totalPages={searchQuery !== "" ? 1 : totalPages}
                                            onPageChange={handlePageChange}
                                            pageItemLength={filteredDatas?.length}
                                            totalProjects={
                                                searchQuery !== "" ? filteredDatas?.length : totalProjects
                                            }
                                        />                                    
                                    </Box>
                                </>
                            }

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
            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
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
                            <Typography sx={userStyle.SubHeaderText}>Edit Alloted List</Typography>
                            <br /><br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12} >
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontSize: '18px', fontWight: '900' }}> Customer</Typography>
                                        <Typography>{exceledit.customer}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12} >
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontSize: '18px', fontWight: '900' }}> Process</Typography>
                                        <Typography>{exceledit.process}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12} >
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontSize: '18px', fontWight: '900' }}> Project</Typography>
                                        <Typography>{exceledit.project}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12} >
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontSize: '18px', fontWight: '900' }}> Vendor</Typography>
                                        <Typography>{exceledit.vendor}</Typography>
                                    </FormControl>
                                </Grid>
                                <br />
                                <br />
                                <br />
                                <Grid item md={4} xs={12} sm={12} >
                                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                    <FormControl fullWidth>
                                        <Selects
                                            options={
                                                categories
                                                    .filter(category => category?.project === exceledit?.project)
                                                    .map(sub => ({
                                                        ...sub,
                                                        label: sub.name,
                                                        value: sub.name
                                                    }))
                                            }

                                            styles={colourStyles}
                                            value={{ label: exceledit.category, value: exceledit?.category }}
                                            onChange={(e) => {
                                                setExceledit({
                                                    ...exceledit,
                                                    category: e.value, subcategory: "Please Select Subcategory", queue: 'Please Select Queue'
                                                });

                                            }}
                                        />

                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <InputLabel id="demo-simple-select-label">Subcategory</InputLabel>
                                    <FormControl fullWidth>
                                        <Selects

                                            options={Array.from(new Set(
                                                [...(timePointsList
                                                    .filter(time => time.category === exceledit?.category)
                                                    .map(sub => sub.subcategory)
                                                ), ("ALL")]
                                            ))
                                                .map(timevalue => ({
                                                    label: timevalue,
                                                    value: timevalue
                                                }))

                                            }
                                            styles={colourStyles}
                                            value={{ label: exceledit?.subcategory, value: exceledit?.subcategory }}

                                            onChange={(e) => {
                                                setExceledit({
                                                    ...exceledit,
                                                    subcategory: e.value,
                                                });
                                            }}
                                        />


                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <InputLabel id="demo-simple-select-label">Queue</InputLabel>
                                    <FormControl fullWidth>
                                        <Selects
                                            options={Array.from(new Set(queues
                                                .filter(queue => queue.categories?.includes(exceledit.category))
                                                .map(sub => sub.queuename)
                                            ))
                                                .map(queuename => ({
                                                    label: queuename,
                                                    value: queuename
                                                }))}

                                            styles={colourStyles}
                                            value={{ label: exceledit.queue, value: exceledit.queue }}

                                            onChange={(e) => {
                                                setExceledit({
                                                    ...exceledit,
                                                    queue: e.value,
                                                });
                                            }}
                                        />

                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <Typography>Time</Typography>
                                    <FormControl fullWidth>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            size="small"
                                            readOnly
                                            value={getTimeandPoints(exceledit.project, exceledit.category, exceledit.subcategory === "Please Select Subcategory" ? "ALL" : exceledit.subcategory) ? getTimeandPoints(exceledit.project, exceledit.category, exceledit.subcategory === "Please Select Subcategory" ? "ALL" : exceledit.subcategory) : 0}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <Typography>Points</Typography>
                                    <FormControl fullWidth>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            size="small"
                                            readOnly
                                            value={getPoints(exceledit.project, exceledit.category, exceledit.subcategory === "Please Select Subcategory" ? "ALL" : exceledit.subcategory) ? getPoints(exceledit.project, exceledit.category, exceledit.subcategory === "Please Select Subcategory" ? "ALL" : exceledit.subcategory) : 0}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            <br />
                            <br />
                            <Grid container>
                                <br />
                                <Grid item md={1}></Grid>
                                <Button variant="contained" onClick={editSubmit}>Update</Button>
                                <Grid item md={1}></Grid>
                                <Button sx={userStyle.btncancel} onClick={handleCloseModEdit} >Cancel</Button>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
                {/* this is info view details */}

                <Dialog
                    open={openInfo}
                    onClose={handleCloseinfo}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                >
                    <Box sx={{ width: "850px", padding: "20px 30px" }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>
                                {" "}
                                Teams Activity log
                            </Typography>
                            <br />
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Updated by</Typography>
                                        <br />
                                        <Table>
                                            <TableHead>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"SNO"}.</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"UserName"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Category Name"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Subcategory Name"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Queue Name"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Date"}</StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {exceleditupdateby?.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.name}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.category}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.subcategory}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.queue}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {moment(item.date).format('DD-MM-YYYY hh:mm:ss a')}</StyledTableCell>
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
            </Box>
            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleCloseview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box sx={{ width: '550px', padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Alloted Queue List</Typography>
                        <br /><br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Project</Typography>
                                    <Typography>{exceledit.project}</Typography>
                                </FormControl>
                            </Grid><br />
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Vendor</Typography>
                                    <Typography>{exceledit.vendor}</Typography>
                                </FormControl>
                            </Grid><br />
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Customer</Typography>
                                    <Typography>{exceledit.customer}</Typography>
                                </FormControl>
                            </Grid><br />
                            <Grid item md={6} xs={12} sm={12}>
                                <Typography variant="h6">Process</Typography>
                                <FormControl fullWidth size="small">
                                    <Typography>{exceledit.process}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <Typography variant="h6">Category</Typography>
                                <FormControl fullWidth size="small">
                                    <Typography>{exceledit.category}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <Typography variant="h6">Subcategory</Typography>
                                <FormControl fullWidth size="small">
                                    <Typography>{exceledit.subcategory}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <Typography variant="h6">Queue</Typography>
                                <FormControl fullWidth size="small">
                                    <Typography>{exceledit.queue}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <Typography variant="h6">Time</Typography>
                                <FormControl fullWidth size="small">
                                    <Typography>{exceledit.time}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <Typography variant="h6">Points</Typography>
                                <FormControl fullWidth size="small">
                                    <Typography>{exceledit.points}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /><br />
                        <Grid container spacing={2}>
                            <Button variant="contained" onClick={handleCloseview}> Back </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            {/* print layout for Alloted*/}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table
                    sx={{ minWidth: 700 }}
                    aria-label="customized table"
                    id="usertable"
                    ref={componentRefAllot}
                >
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell> Project Name</TableCell>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Process</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Subcategory Name</TableCell>
                            <TableCell>Queue Name</TableCell>
                            <TableCell>Time </TableCell>
                            <TableCell>Points</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {excelmapdata.length > 0 &&
                            excelmapdata.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.project}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.customer}</TableCell>
                                    <TableCell>{row.process}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.subcategory}</TableCell>
                                    <TableCell>{row.queue}</TableCell>
                                    <TableCell>{row.time}</TableCell>
                                    <TableCell>{row.points}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TableContainer component={Paper} style={{
                display: canvasState === false ? 'none' : 'block',
            }} >
                <Table
                    sx={{ minWidth: 700 }}
                    aria-label="customized table"
                    id="excelcanvastable"
                    ref={gridRef}
                >
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell> Project Name</TableCell>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Process</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Subcategory Name</TableCell>
                            <TableCell>Queue Name</TableCell>
                            <TableCell>Time </TableCell>
                            <TableCell>Points</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {filteredDatas.length > 0 &&
                            filteredDatas.map((row, index) => (
                                <TableRow key={index} >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.project}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.customer}</TableCell>
                                    <TableCell>{row.process}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.subcategory}</TableCell>
                                    <TableCell>{row.queue}</TableCell>
                                    <TableCell>{row.time}</TableCell>
                                    <TableCell>{row.points}</TableCell>
                                </TableRow>
                            )
                            )}
                    </TableBody>
                </Table>
            </TableContainer>

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
                            sendRequestEdit();
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
                            <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />


                                <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>
                                    {"This Data is Linked in Allotted Responsible List"}
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseCheck} autoFocus variant="contained" color='error'> OK </Button>
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
                        <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Cancel</Button>
                        <Button autoFocus variant="contained" color='error'
                            onClick={delProjectcheckbox}
                        > OK </Button>
                    </DialogActions>
                </Dialog>

            </Box>


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
                            onClick={(e) => delProject(projectid)}
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

            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isDeleteOpenbulk}
                    onClose={handleCloseModbulk}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth={"md"}
                    fullWidth={true}
                >
                    <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: 'orange' }} />
                        <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>
                            These Datas are linked in  Allotted Responsible List

                            <Table>
                                <TableHead>
                                    <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"SNO"}.</StyledTableCell>
                                    <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Customer"}</StyledTableCell>
                                    <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Process"}</StyledTableCell>
                                </TableHead>
                                <TableBody>
                                    {bulkOverallDeletecheck?.map((item, i) => (
                                        <StyledTableRow>
                                            <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                                            <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.customer}</StyledTableCell>
                                            <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.process}</StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>

                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained"
                            disabled={bulkOverallDelete.length == 0}
                            onClick={(e) => delProjectcheckboxbulk(bulkOverallDelete)}
                        > Delete Without linked Data </Button>
                        <Button autoFocus variant="contained" color='error'
                            onClick={handleCloseModbulk}
                        > Cancel </Button>
                    </DialogActions>
                </Dialog>
            </Box>


            {/* Bulk Edit Options (alert Boxes and Edit Field)  */}
            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isEditOpenalert}
                    onClose={handleCloseModalertEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: 'orange' }} />
                        <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>Please Select any Row</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color='error'
                            onClick={handleCloseModalertEdit}
                        > OK </Button>
                    </DialogActions>
                </Dialog>
            </Box>


            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isEditAnsCheckalert}
                    onClose={handleCloseAnsCheckEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: 'orange' }} />
                        <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>Please Select Same Project for all Row</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color='error'
                            onClick={handleCloseAnsCheckEdit}
                        > OK </Button>
                    </DialogActions>
                </Dialog>
            </Box>


            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isEditOpencheckbox}
                    onClose={handleCloseBulEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                >
                    <Box sx={{ padding: '20px' }}>
                        <>
                            <Typography sx={userStyle.SubHeaderText}>Bulk Edit Alloted List</Typography>
                            <br /><br />
                            <Grid container spacing={2}>
                                <br />
                                <Grid item md={4} xs={12} sm={12} >
                                    <Typography>Category<b style={{ color: "red" }}>*</b></Typography>
                                    <FormControl fullWidth>
                                        <Selects
                                            options={
                                                categories
                                                    .filter(category => category?.project === bulkEditProjectName)
                                                    .map(sub => ({
                                                        ...sub,
                                                        label: sub.name,
                                                        value: sub.name
                                                    }))
                                            }

                                            styles={colourStyles}
                                            value={{ label: excelOveralledit.category, value: excelOveralledit?.category }}
                                            onChange={(e) => {
                                                setExcelOveralledit({
                                                    ...excelOveralledit,
                                                    category: e.value, subcategory: "Please Select Subcategory", queue: 'Please Select Queue'
                                                });

                                            }}
                                        />

                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <Typography>Subcategory<b style={{ color: "red" }}>*</b></Typography>
                                    <FormControl fullWidth>
                                        <Selects

                                            options={Array.from(new Set(
                                                [...(timePointsList
                                                    .filter(time => time.category === excelOveralledit?.category)
                                                    .map(sub => sub.subcategory)
                                                ), ("ALL")]
                                            ))
                                                .map(timevalue => ({
                                                    label: timevalue,
                                                    value: timevalue
                                                }))

                                            }
                                            styles={colourStyles}
                                            value={{ label: excelOveralledit?.subcategory, value: excelOveralledit?.subcategory }}

                                            onChange={(e) => {
                                                setExcelOveralledit({
                                                    ...excelOveralledit,
                                                    subcategory: e.value,
                                                });
                                            }}
                                        />


                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <Typography>Queue<b style={{ color: "red" }}>*</b></Typography>
                                    <FormControl fullWidth>
                                        <Selects
                                            options={Array.from(new Set(queues
                                                .filter(queue => queue.categories?.includes(excelOveralledit.category))
                                                .map(sub => sub.queuename)
                                            ))
                                                .map(queuename => ({
                                                    label: queuename,
                                                    value: queuename
                                                }))}

                                            styles={colourStyles}
                                            value={{ label: excelOveralledit.queue, value: excelOveralledit.queue }}

                                            onChange={(e) => {
                                                setExcelOveralledit({
                                                    ...excelOveralledit,
                                                    queue: e.value,
                                                });
                                            }}
                                        />

                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <Typography>Time</Typography>
                                    <FormControl fullWidth>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            size="small"
                                            readOnly
                                            value={getOverallEditTimeandPoints(bulkEditProjectName, excelOveralledit.category, excelOveralledit.subcategory === "Please Select Subcategory" ? "ALL" : excelOveralledit.subcategory) ? getOverallEditTimeandPoints(bulkEditProjectName, excelOveralledit.category, excelOveralledit.subcategory === "Please Select Subcategory" ? "ALL" : excelOveralledit.subcategory) : 0}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <Typography>Points</Typography>
                                    <FormControl fullWidth>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            size="small"
                                            readOnly
                                            value={getOverallPoints(bulkEditProjectName, excelOveralledit.category, excelOveralledit.subcategory === "Please Select Subcategory" ? "ALL" : excelOveralledit.subcategory) ? getOverallPoints(bulkEditProjectName, excelOveralledit.category, excelOveralledit.subcategory === "Please Select Subcategory" ? "ALL" : excelOveralledit.subcategory) : 0}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            <br />
                            <br />

                        </>
                    </Box>

                    <DialogActions>
                        <Grid container>
                            <br />
                            <Grid item md={1}></Grid>
                            <Button variant="contained" onClick={editOverallSubmit}>Update</Button>
                            <Grid item md={1}></Grid>
                            <Button sx={userStyle.btncancel} onClick={handleCloseBulEdit} >Cancel</Button>
                        </Grid>
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
                    <LoadingButton loading={loadingOverall} variant="contained"
                        onClick={(e) => {
                            handleExportXL("overall")
                        }}
                    >
                        Export Over All Data
                    </LoadingButton>
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
                    open={isBulkOverallEditOpen}
                    onClose={handleCloseModBulkOverallEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: 'orange' }} />
                        <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>These Datas are linked in  Allotted Responsible List.
                            Whether do you want changes..??</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color='primary'
                            onClick={() => sendRequestOverallEdit()}
                        > OK </Button>
                        <Button autoFocus variant="contained" color='error'
                            onClick={handleCloseModBulkOverallEdit}
                        >cancel</Button>
                    </DialogActions>
                </Dialog>
            </Box>




        </Box>

    );
}

export default Allotqueuelist;