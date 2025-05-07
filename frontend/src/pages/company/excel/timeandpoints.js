import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput,IconButton, Checkbox, Dialog, Select, TableRow, TableCell, MenuItem, TableBody, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { handleApiError } from "../../../components/Errorhandling";
import { SERVICE } from '../../../services/Baseservice';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import axios from "axios";
import { saveAs } from "file-saver";
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import ImageIcon from '@mui/icons-material/Image';
import { ThreeDots } from "react-loader-spinner";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import moment from 'moment-timezone';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import Headtitle from "../../../components/Headtitle";
import Decimal from 'decimal.js';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import Selects from "react-select";
import LoadingButton from "@mui/lab/LoadingButton";
import html2canvas from 'html2canvas';

function Timeandpointsexcel() {
    const [isBtn, setIsBtn] = useState(false);
    const defaultnum = new Decimal(8.333333333333333);
    const [timePointsCreate, setTimePointCreate] = useState({ project: "Please Select Project", category: "Please Select Category", subcategory: "Please Select Subcategory", time: "", flagcount: Number(1).toFixed(3), ratetopoints: Number(8.333333333333333).toFixed(15) });
    const [timePointsEdit, setTimePointsEdit] = useState({ project: "Please Select Project", category: "Please Select Category", subcategory: "Please Select Subcategory", time: "", flagcount: "" })
    const [rate, setRate] = useState(0)
    const [rateToPoints, setRateToPoints] = useState(defaultnum.toFixed(15))
    const [points, setPoints] = useState(0)
    const [items, setItems] = useState([]);
    const [timePointsList, setTimePointsList] = useState([])
    const [timePointsListedit, setTimePointsListedit] = useState([])
    const [projectsEdit, setProjectsEdit] = useState([])
    const [vendorsEditDef, setVendorsEditDef] = useState([])
    const [categoryEdit, setCategoryEdit] = useState([])
    const [subcategoryEdit, setSubCategoryEdit] = useState([])
    const [subcategoryDropEdit, setSubCategoryDropEdit] = useState([])
    const [rateEdit, setRateEdit] = useState(0)
    const [rateToPointsEdit, setRateToPointsEdit] = useState(8.333333333333333)
    const [pointsEdit, setPointsedit] = useState(0);
    const [isLoader, setIsLoader] = useState(false);
    //set function to get particular row
    const [deleteTimePoint, setDeleteTimePoint] = useState({});
    const [selectedRowsCount, setSelectedRowsCount] = useState(0);
    const [projects, setProjects] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedProject, setSelectedProject] = useState('Please Select Project');
    const [selectedCategory, setSelectedCategory] = useState('Please Select Category');
    const [selectedSubCategory, setSelectedSubCategory] = useState('Please Select Subcategory');
    const [selectedSubCategoryedit, setSelectedSubCategoryedit] = useState('Please Select Subcategory');
    const [selectAll, setSelectAll] = useState(false);
    const [selectedProjectedit, setSelectedProjectedit] = useState('Please Select Project');
    const [selectedCategoryedit, setSelectedCategoryedit] = useState('Please Select Category');
    const [selectedRows, setSelectedRows] = useState([]);
    const gridRef = useRef(null);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [filteredCategoriesEdit, setFilteredCategoriesEdit] = useState([]);

    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [filteredSubCategoriesEdit, setFilteredSubCategoriesEdit] = useState([]);

    const [vendorsfetch, setVendorsfetch] = useState([]);
    const [vendorsfetchedit, setVendorsfetchedit] = useState([]);

    const { isUserRoleAccess, isUserRoleCompare } = useContext(UserRoleAccessContext);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { auth } = useContext(AuthContext);
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRows([]);
            setSelectAll(false);
        } else {
            const allRowIds = filteredData.map((row) => row._id);
            setSelectedRows(allRowIds);
            setSelectAll(true);
        }
    };
    const handleCheckboxChange = (id) => {
        let updatedSelectedRows;
        if (selectedRows.includes(id)) {
            updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== id);
        } else {
            updatedSelectedRows = [...selectedRows, id];
        }

        setSelectedRows(updatedSelectedRows);
        // Update the "Select All" checkbox based on whether all rows are selected
        setSelectAll(updatedSelectedRows.length === filteredData?.length);
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
                    "Project Name": t.project,
                    "Category Name": t.category,
                    "Subcategory Name": t.subcategory,
                    "Time": t.time,
                    "Rate": t.rate,
                    "Conversion": t.ratetopoints,
                    "Points": t.points,
                    "Flag Count": t.flagcount


                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                items.map((t, index) => ({
                    "Sno": index + 1,
                    "Project Name": t.project,
                    "Category Name": t.category,
                    "Subcategory Name": t.subcategory,
                    "Time": t.time,
                    "Rate": t.rate,
                    "Conversion": t.ratetopoints,
                    "Points": t.points,
                    "Flag Count": t.flagcount
                })),
                fileName,
            );

        }

        setIsFilterOpen(false)
    };

 //image
 const handleCaptureImage = () => {
    if (gridRef.current) {
        html2canvas(gridRef.current).then((canvas) => {
            canvas.toBlob((blob) => {
                saveAs(blob, 'Time_And_Points.png');
            });
        });
    }
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
            filteredData?.map((t, index) => ({
                "serialNumber": index + 1,
                project: t.project,
                category: t.category,
                subcategory: t.subcategory,
                time: t.time,
                rate: t.rate,
                ratetopoints: t.ratetopoints,
                points: t.points,
                flagcount: t.flagcount

            })) :
            items.map((t, index) => ({
                "serialNumber": index + 1,
                project: t.project,
                category: t.category,
                subcategory: t.subcategory,
                time: t.time,
                rate: t.rate,
                ratetopoints: t.ratetopoints,
                points: t.points,
                flagcount: t.flagcount
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

        doc.save("Time_and_Points.pdf");
    };



    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpencheckbox = () => {

        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };



    //overall edit section for all pages
    const getOverallBulkDeleteSection = async (e) => {
        try {
            let res = await axios.post(SERVICE.OVERALL_TIMEPOINTS_BULK_DELETE, {
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

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setIsBtn(false)
    };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    // check edit
    const [overalldep, setOverAlDep] = useState("")
    const [getDepartment, setGetDepartment] = useState("")
    const [EditDepCount, setEditDepCount] = useState(0)

    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => { setIsErrorOpenpop(true); };
    const handleCloseerrpop = () => { setIsErrorOpenpop(false); };

    // view model
    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => { setOpenview(true); };
    const handleCloseview = () => { setOpenview(false); };

    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const handleClickOpenCheck = () => { setisCheckOpen(true); };
    const handleCloseCheck = () => { setisCheckOpen(false); };

    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => { setOpeninfo(true); };
    const handleCloseinfo = () => { setOpeninfo(false); };

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleCloseMod = () => { setIsDeleteOpen(false); };

    //get all Time Loints List.
    const fetchAllTimePoints = async () => {
        try {
            let res_queue = await axios.get(SERVICE.TIMEPOINTS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            
            setTimePointsList(res_queue?.data?.timepoints)
            setIsLoader(true);
         } catch (err) {setIsLoader(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    //get all Time Points List.
    const fetchAllTimePointsedit = async () => {
        try {
            let res = await axios.get(SERVICE.TIMEPOINTS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTimePointsListedit(res?.data?.timepoints.filter(item => item._id !== timePointsEdit._id));

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const getEditId = async (value) => {
        try {
            let res = await axios.post(SERVICE.TIMEPOINTS_CHECKEDIT_EXCELDATAS_CATSUBCATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                checkcategory: String(value.category),
                subcategory: String(value.subcategory)
            });
            setEditDepCount(res?.data?.count)
            setOverAlDep(`The ${value.category} & ${value.subcategory} is linked in ${res?.data?.excelmaptimepoints?.length > 0 ? "Allotted Queue List," : ""} ${res?.data?.excelmappeopletimepoints?.length > 0 ? "Allotted Responsible List " : ""} whether you want to do changes ..??`)
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const getOverAlldepUpdate = async () => {
        try {
            let res = await axios.post(SERVICE.TIMEPOINTS_CHECKEDIT_EXCELDATAS_CATSUBCATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                checkcategory: String(getDepartment.category),
                subcategory: String(getDepartment.subcategory)
            });
            editOveAllDepartment(res.data.excelmaptimepoints, res.data.excelmappeopletimepoints)
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const editOveAllDepartment = async (excelmaptimepoints, excelmappeopletimepoints) => {
        try {
            if (excelmaptimepoints?.length > 0) {
                let result = excelmaptimepoints.map((data, index) => {
                    let request = axios.put(`${SERVICE.EXCELMAPDATA_SINGLE}/${data._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        time: String(timePointsEdit.time),
                        points: Number(pointsEdit).toFixed(5),
                    });
                })
            }
            if (excelmappeopletimepoints?.length > 0) {
                let result = excelmappeopletimepoints.map((data, index) => {
                    let request = axios.put(`${SERVICE.EXCELMAPDATARESPERSON_SINGLE}/${data._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        time: String(timePointsEdit.time),
                        points: Number(pointsEdit).toFixed(5),
                    });
                })
            }
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    //get all project for create
    const fetchAllProjects = async () => {
        try {
            let res_queue = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const projall = [...res_queue?.data?.projmaster.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            setProjects(projall);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //get all category.
    const fetchVendors = async () => {
        try {
            let res = await axios.get(SERVICE.VENDORMASTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setVendors(res?.data?.vendormaster)

        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };



    const fetchCategoryDropdowns = async () => {
        try {
            let res_project = await axios.get(SERVICE.CATEGORYEXCEL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            const catall = [...res_project?.data?.categoryexcel.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            setCategories(catall);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchSubCategoryDropdowns = async () => {
        try {
            let res_project = await axios.get(SERVICE.SUBCATEGORYEXCEL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            const subcatall = [...res_project?.data?.subcategoryexcel.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            setSubcategories(subcatall);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const handleProjectChange = (e) => {
        const selectedProject = e.value;
        setSelectedProject(selectedProject);

        // Filter vendors based on the selected project
        const filteredVendors = vendors?.filter(vendor => vendor.projectname === selectedProject)?.map(vendor => ({ label: vendor.name, value: vendor.name }));

        setVendorsfetch(filteredVendors);
        setSelectedCategory("Please Select Category");
        setSelectedSubCategory('Please Select Subcategory')
    };

    const handleProjectChangeedit = () => {

        // Filter vendors based on the selected project
        const filteredVendors = vendors?.filter(vendor => vendor.projectname === selectedProjectedit)?.map(vendor => ({ label: vendor.name, value: vendor.name }));

        setVendorsfetchedit(filteredVendors);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = timePointsList?.some(item =>
            (selectedSubCategory === "ALL" || selectedSubCategory === "Please Select Subcategory") ?
                (item?.subcategory === "ALL" && item.project === selectedProject && item.category === selectedCategory)
                :
                (item?.subcategory === (selectedSubCategory) && item.project === selectedProject && item.category === selectedCategory)

        );

        if (selectedProject === "" || selectedProject == "Please Select Project") {
            NotificationManager.error('Please Choose Project Name 🙃', '', 2000);
        }

        else if (selectedCategory === "" || selectedCategory == "Please Select Category") {
            NotificationManager.error('Please Choose Category Name 🙃', '', 2000);

        }
        else if (timePointsCreate.time === "") {
            NotificationManager.error('Please Enter Time 🙃', '', 2000);

        }else if (rate === 0) {
            NotificationManager.error('Please Enter Rate Field 🙃', '', 2000);

        }
        else if (rateToPoints === 0) {
            NotificationManager.error('Please Enter Conversion Field 🙃', '', 2000);

        }
        else if (points === 0) {
            NotificationManager.error('Please Enter Points Field 🙃', '', 2000);

        } else if (timePointsCreate.flagcount === "") {
            NotificationManager.error('Please Enter Flag Count 🙃', '', 2000);
        } else if (isNameMatch) {
            NotificationManager.error('Data Already Exists 😉', '', 2000);

        }

        else {
            sendRequest();
        }

    };

    const [status, setStatus] = useState("")


    //add function...
    const sendRequest = async () => {
        setIsBtn(true)
        try {
            const num = new Decimal(rateToPoints);
            const defaultnum = new Decimal(8.333333333333333);
            let res = await axios.post(SERVICE.TIMEPOINTS_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                project: String(selectedProject),
                category: String(selectedCategory),
                subcategory: String((selectedSubCategory == "ALL" || selectedSubCategory === "Please Select Subcategory") ? "ALL" : selectedSubCategory),
                time: String(timePointsCreate.time),
                rate: Number(rate).toFixed(4),
                ratetopoints: num.toFixed(15),
                points: Number(points).toFixed(4),
                state: String(selectedSubCategory == "ALL" || "" ? "ALL" : "Individual"),
                flagcount: timePointsCreate.flagcount ? Number(timePointsCreate.flagcount).toFixed(3) : Number(1).toFixed(3),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Added Successfully"}</p>
                </>
            );
            handleClickOpenerr();
            await fetchAllTimePoints();
            setTimePointCreate({ ...timePointsCreate, time: "", flagcount: Number(1).toFixed(3) });
            setRate(0);
            setPoints(0);
            setRateToPoints(defaultnum.toFixed(15));
            setIsBtn(false)
        } catch (err) {setIsBtn(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //cancel for create section
    const handleCancel = () => {
        const defaultnum = new Decimal(8.333333333333333);
        setTimePointCreate({ time: "", flagcount: Number(1).toFixed(3) });
        setSelectedProject("Please Select Project");
        setSelectedCategory("Please Select Category");
        setSelectedSubCategory("Please Select Subcategory");
        setStatus("")
        setRate(0)
        setPoints(0)
        setRateToPoints(defaultnum.toFixed(15));
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Cleared Successfully"}</p>
            </>
        );
        handleClickOpenerr();

        NotificationManager.success('Cleared Successfully 👍', '', 2000);
    }


    //get single row to edit....
    const getCode = async (e) => {
        try {

            let res = await axios.get(`${SERVICE.TIMEPOINTS_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            handleClickOpenEdit();
            setTimePointsEdit(res?.data?.stimepoint);
            setRateEdit(res?.data?.stimepoint?.rate)
            setRateToPointsEdit(res?.data?.stimepoint?.ratetopoints)
            setPointsedit(res?.data?.stimepoint?.points)
            setSelectedProjectedit(res?.data?.stimepoint?.project);
            setSelectedCategoryedit(res?.data?.stimepoint?.category);
            setSelectedSubCategoryedit(res?.data?.stimepoint?.subcategory);
            getEditId(res?.data?.stimepoint);
            setGetDepartment(res?.data?.stimepoint)
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // get single row to view....
    const getviewCode = async (e) => {
        try {

            let res = await axios.get(`${SERVICE.TIMEPOINTS_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTimePointsEdit(res?.data?.stimepoint);

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const [checkQueue, setCheckQueue] = useState();


    //set function to get particular row
    const rowData = async (id, project, category, time, points) => {
        try {

            let res = await axios.get(`${SERVICE.TIMEPOINTS_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteTimePoint(res?.data?.stimepoint);
            let resdev = await axios.post(SERVICE.EXCELMAPDATAQUEUECHECK, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                checkqueuetime: String(time),
                checkqueuepoints: String(points),
                checkqueueproject: String(project),
                checkqueuecategory: String(category)
            })
            setCheckQueue(resdev?.data?.excelmapdatas)

            if ((resdev?.data?.excelmapdatas)?.length > 0) {
                handleClickOpenCheck();
            }
            else {
                handleClickOpen();
            }
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    const delProjectcheckbox = async () => {
        try {
            selectedRows?.map((item) => {
                let res = axios.delete(`${SERVICE.TIMEPOINTS_SINGLE}/${item}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
            })

            await fetchAllTimePoints();
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAll(false);
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


    // Alert delete popup
    let deleteId = deleteTimePoint._id;

    const delModule = async () => {
        try {
            await axios.delete(`${SERVICE.TIMEPOINTS_SINGLE}/${deleteId}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            await fetchAllTimePoints();
            handleCloseMod();
            handleCloseCheck();
            NotificationManager.success('Deleted Successfully 👍', '', 2000);
            setPage(1);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    // get single row to view....
    const getinfoCode = async (e) => {
        try {

            let res = await axios.get(`${SERVICE.TIMEPOINTS_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTimePointsEdit(res?.data?.stimepoint);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //get all project dropdwons for Edit
    const fetchAllProjectsEdit = async () => {
        try {
            let res_queue = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setProjectsEdit(res_queue?.data?.projmaster)
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    //get all Vendor dropdwons for edit.
    const VendorEditDef = async () => {
        try {
            let res = await axios.get(SERVICE.VENDORMASTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setVendorsEditDef(res?.data?.vendormaster)
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //get all Category dropdowns for edit.
    const fetchAllCategoryList = async () => {
        try {
            let res_queue = await axios.get(SERVICE.CATEGORYEXCEL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setCategoryEdit(res_queue?.data?.categoryexcel)
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //get all subCategory list for Edit.
    const fetchAllSubCategoryList = async () => {
        try {
            let res_queue = await axios.get(SERVICE.SUBCATEGORYEXCEL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            setSubCategoryEdit(res_queue?.data?.subcategoryexcel)
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    //Sub - category page edit filter dropdowns 
    const SubcategoryDropDown = () => {
        let cat = timePointsEdit.vendor !== undefined ? subcategoryEdit.filter(item => item.vendorname.some(val => timePointsEdit.vendor.includes(val)) && item.project === timePointsEdit.project && item.categoryname === timePointsEdit.category) : 0;
        setSubCategoryDropEdit(cat)
    }

    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };

    const handleCloseModEdit = (e, reason) => {
        const num = new Decimal(rateToPoints);
        if (reason && reason === "backdropClick")
            return;
        setTimePointsEdit({ project: "", category: "", subcategory: "", time: "", flagcount: "" })
        setRateEdit(0);
        setPointsedit(0);
        setRateToPointsEdit(num.toFixed(15));
        setIsEditOpen(false);
    };
    //Module updateby edit page...
    let updateby = timePointsEdit?.updatedby;
    let addedby = timePointsEdit?.addedby;

    let timepointId = timePointsEdit._id;
    //editing the single data...
    const sendEditRequest = async () => {
        try {
            const num = new Decimal(rateToPoints);
            const defaultnum = new Decimal(8.333333333333333);
            let res = await axios.put(`${SERVICE.TIMEPOINTS_SINGLE}/${timepointId}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                project: String(selectedProjectedit),
                category: String(selectedCategoryedit),
                subcategory: String((selectedSubCategoryedit == "ALL" || selectedSubCategoryedit === "Please Select Subcategory") ? "ALL" : selectedSubCategoryedit),
                time: String(timePointsEdit.time),
                state: String(selectedSubCategoryedit == "ALL" || "" ? "ALL" : "Individual"),
                rate: Number(rateEdit).toFixed(5),
                ratetopoints: num.toFixed(15),
                points: Number(pointsEdit).toFixed(5),
                flagcount: timePointsEdit.flagcount ? Number(timePointsEdit.flagcount).toFixed(3) : Number(1).toFixed(3),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });

            setTimePointsEdit(res.data);
            await getOverAlldepUpdate();
            handleCloseModEdit();
            setTimePointsEdit({ time: "", flagcount: Number(1).toFixed(3) })
            NotificationManager.success('Updated Successfully 👍', '', 2000);
            setRateEdit(0);
            setPointsedit(0);
            setRateToPointsEdit(num.toFixed(15));
            await fetchAllTimePoints();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        if (status) {
            const timeoutId = setTimeout(() => {
                setStatus('');
            }, 1500);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [status]);

    const editSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = timePointsListedit?.some(item =>
            (selectedSubCategoryedit === "ALL" || selectedSubCategoryedit === "Please Select Subcategory") ?
                (item?.subcategory === "ALL" && item.project === selectedProjectedit && item.category === selectedCategoryedit)
                :
                (item?.subcategory === (selectedSubCategoryedit) && item.project === selectedProjectedit && item.category === selectedCategoryedit)

        );

        if (selectedProjectedit === "" || selectedCategoryedit == "Please Select Project") {
            NotificationManager.error('Please Choose Project Name 🙃', '', 2000);
        }

        else if (selectedCategoryedit === "" || selectedCategoryedit == "Please Select Category") {
            NotificationManager.error('Please Choose Category Name 🙃', '', 2000);
        }

        else if (timePointsEdit.time === "") {
            NotificationManager.error('Please Enter Time 🙃', '', 2000);
        }

        else if (rateEdit === 0) {
            NotificationManager.error('Please Enter Rate 🙃', '', 2000);
        }
        else if (rateToPointsEdit === 0) {
            NotificationManager.error('Please Enter Conversion Field 🙃', '', 2000);

        }
        else if (pointsEdit === 0) {
            NotificationManager.error('Please Enter Points Field 🙃', '', 2000);

        }else if (timePointsEdit.flagcount === "") {
            NotificationManager.error('Please Enter Flag Count 🙃', '', 2000);

        } else if (isNameMatch) {
            NotificationManager.error('Already Added this Project, Category and Subcategory 😉', '', 2000);

        }
        else if (timePointsEdit.time != getDepartment.category && EditDepCount > 0) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {overalldep}
                    </p>
                </>
            )
            handleClickOpenerrpop();
        }

        else {
            sendEditRequest();
        }
    };


    let snos = 1;
    // this is the etimation concadination value
    const modifiedData = timePointsList?.map((person) => ({
        ...person, sino: snos++
    }));

    // pdf.....
    const columns = [
        { title: "Project Name", field: "project" },
        { title: "Category Name", field: "category" },
        { title: "Sub Category Name", field: "subcategory" },
        { title: "Time", field: "time" },
        { title: "Rate", field: "rate" },
        { title: "Conversion", field: "ratetopoints" },
        { title: "Points", field: "points" },
        { title: "Flag Count", field: "flagcount" },
    ];

    //create ratetopoints field onChange
    const handleRatetoPointsChange = (g) => {
        let ans1 = (g.target.value)
        setPoints(rate * ans1)
    }

    //create rate field change
    const handleRateChange = (g) => {
        let ans1 = (g.target.value)
        setPoints(ans1 * rateToPoints)
    }

    //create points field change
    const handlePointsChange = (e) => {
        let ans = e.target.value
        setRate(ans / rateToPoints)
    }


    const handleRateEdit = (e) => {
        let ans = (e.target.value)
        setPointsedit(ans * rateToPointsEdit)

    }
    const handleRateToPointsEdit = (e) => {
        let ans = (e.target.value)
        setPointsedit(ans * rateEdit)

    }
    const handlePointsChangeEdit = (e) => {
        let ans = e.target.value
        setRateEdit(ans / rateToPointsEdit)
    }

    const checkTimePointsData = timePointsList?.map((item, index) => ({
        ...item,
        sno: index + 1,
        project: item.project,
        category: item.category,
        subcategory: item.subcategory,
        time: item.time,
        rate: item.rate,
        ratetopoints: item.ratetopoints,
        points: item.points,
        flagcount: item.flagcount

    }));



    // Excel
    const fileName = "Time_and_Points";
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Time and point",
        pageStyle: "print",
    });

    const addSerialNumber = () => {
        const itemsWithSerialNumber = timePointsList?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    //table sorting
    const [sorting, setSorting] = useState({ column: '', direction: '' });

    const handleSorting = (column) => {
        const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
        setSorting({ column, direction });
    };

    const sortedData = items.sort((a, b) => {
        if (sorting.direction === 'asc') {
            return a[sorting.column] > b[sorting.column] ? 1 : -1;
        } else if (sorting.direction === 'desc') {
            return a[sorting.column] < b[sorting.column] ? 1 : -1;
        }
        return 0;
    });

    const renderSortingIcon = (column) => {
        if (sorting.column !== column) {
            return <>
                <Box sx={{ color: '#bbb6b6' }}>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropUpOutlinedIcon />
                    </Grid>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropDownOutlinedIcon />
                    </Grid>
                </Box>
            </>;
        } else if (sorting.direction === 'asc') {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        } else {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        }
    };
    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1);
    };



    //datatable....
    const [searchQuery, setSearchQuery] = useState("");
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
    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(Math.abs(firstVisiblePage + visiblePages - 1), totalPages);


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
        }, [])

    useEffect(() => {
        fetchAllTimePoints();
        fetchVendors();
        fetchCategoryDropdowns();
        fetchSubCategoryDropdowns();
        fetchAllTimePointsedit();
    }, [])

    useEffect(() => {
        fetchAllProjectsEdit();
        VendorEditDef();
        fetchAllTimePointsedit();
        SubcategoryDropDown();
    }, [isEditOpen, timePointsEdit])



    useEffect(() => {
        fetchAllProjects();
        fetchAllCategoryList();
        fetchAllSubCategoryList();
    }, [timePointsCreate, timePointsEdit])


    useEffect(() => {
        addSerialNumber();
    }, [modifiedData])

    useEffect(() => {
        handleProjectChangeedit();
    }, [isEditOpen, selectedProjectedit])



    useEffect(() => {
        // Filter categories based on the selected project asettd vendors
        const filteredCategories = categories?.filter(category =>
            category.project === selectedProject
        ).map(category => (
            {
                ...category,
                label: category.name,
                value: category.name
            }
        ))
        setFilteredCategories(filteredCategories);
    }, [selectedProject]);

    useEffect(() => {
        // Filter categories based on the selected project and vendors
        const filteredCategoriesedit = categories?.filter(category =>
            category.project === selectedProjectedit
        ).map(category => (
            {
                ...category,
                label: category.name,
                value: category.name
            }
        ))

        setFilteredCategoriesEdit(filteredCategoriesedit);
    }, [selectedProjectedit]);


    useEffect(() => {

        // Filter categories based on the selected project and vendors
        const filteredCategories = subcategories?.filter(category =>
            category.project === selectedProject &&
            category.categoryname === selectedCategory
        ).map(sub => (
            {
                ...sub,
                label: sub.name,
                value: sub.name
            }
        ))

        const addedsubcategories = [{ name: "ALL", label: "ALL", value: "ALL" }, ...filteredCategories];

        setFilteredSubCategories(selectedProject == "Please Select Project" || selectedCategory == "Please Select Category" ? filteredCategories : addedsubcategories);

    }, [selectedProject, selectedCategory]);

    useEffect(() => {
        // Filter categories based on the selected project and vendors
        const filteredCategoriesedit = subcategories?.filter(category =>
            category.project === selectedProjectedit &&
            category.categoryname === selectedCategoryedit)
            .map(sub => (
                {
                    ...sub,
                    label: sub.name,
                    value: sub.name
                }
            ))

        const addedsubcategories = [{ name: "ALL", label: "ALL", value: "ALL" }, ...filteredCategoriesedit];

        setFilteredSubCategoriesEdit(selectedProjectedit == "Please Select Project" || selectedCategoryedit == "Please Select Category" ? filteredCategoriesedit : addedsubcategories);

    }, [selectedProjectedit, selectedCategoryedit]);



    const validateInput = (value) => {
        const regex = /^[0-9:]*$/;
        return regex.test(value);
    };
    const handleChange = (e) => {
        const { value } = e.target;
        if (validateInput(value)) {
            setTimePointCreate({ ...timePointsCreate, time: value });
        }
    };
    const handleChangeEdit = (e) => {
        const { value } = e.target;
        if (validateInput(value)) {
            setTimePointsEdit({ ...timePointsEdit, time: value })
        }
    };
    return (
        <Box>
            <Headtitle title={'Time And Points'} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Time and Points</Typography>
            {isUserRoleCompare?.includes("atime&points") && (
                <Box sx={userStyle.container}>
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Typography sx={userStyle.importheadtext}>Add Time and Points</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    
                                    <NotificationContainer />
                                </Box>

                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <Typography>Project<b style={{ color: "red" }}>*</b></Typography>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={projects}
                                        styles={colourStyles}
                                        value={{ label: selectedProject, value: selectedProject }}
                                        onChange={handleProjectChange}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item md={4} xs={12} sm={12}>
                                <Typography>Category<b style={{ color: "red" }}>*</b></Typography>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={filteredCategories}
                                        styles={colourStyles}
                                        value={{ label: selectedCategory, value: selectedCategory }}
                                        onChange={(e) => {setSelectedCategory(e.value);
                                            setSelectedSubCategory('Please Select Subcategory')
                                        }}
                                    />

                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <Typography>SubCategory</Typography>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={filteredSubCategories}
                                        styles={colourStyles}
                                        value={{ label: selectedSubCategory, value: selectedSubCategory }}
                                        onChange={(e) => setSelectedSubCategory(e.value)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Time<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="hh:mm:ss"
                                        value={timePointsCreate.time}
                                        onChange={handleChange}

                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Rate<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        sx={userStyle.input}
                                        id="component-outlined"
                                        type="number"
                                        value={rate}
                                        placeholder="rate"
                                        onChange={(e) => {
                                            setRate((e.target.value));
                                            handleRateChange(e);
                                        }}


                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Conversion<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        sx={userStyle.input}
                                        type="number"
                                        value={rateToPoints}
                                        // placeholder="0.00000"
                                        onChange={(e) => {
                                            setRateToPoints((e.target.value));
                                            handleRatetoPointsChange(e);
                                        }}

                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Points<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        sx={userStyle.input}
                                        type="number"
                                        value={points}
                                        onChange={(e) => {
                                            setPoints(e.target.value);
                                            handlePointsChange(e);
                                        }}
                                        placeholder="0.00000"

                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Flag Count<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="number"
                                        sx={userStyle.input}
                                        value={timePointsCreate.flagcount}
                                        onChange={(e) => {
                                            setTimePointCreate({ ...timePointsCreate, flagcount: (e.target.value) })
                                        }}

                                    />
                                </FormControl>
                            </Grid>

                        </Grid>
                        <br /> <br /><br />
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={2.5} lg={2.5}>

                                <>
                                    <LoadingButton
                                        loading={isBtn}
                                        variant="contained"
                                        color="primary"
                                        sx={{ display: "flex" }}
                                        onClick={handleSubmit}
                                    >
                                        SUBMIT
                                    </LoadingButton>
                                </>

                            </Grid>
                            <Grid item xs={12} sm={12} md={2.5} lg={2.5}>
                                <>
                                    <Button sx={userStyle.btncancel} onClick={handleCancel}> Clear </Button>
                                </>

                            </Grid>
                        </Grid>
                    </>
                </Box>
            )}
            <Box>
                {/* edit model */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    fullWidth={true}
                    sx={{
                        overflow: 'visible',
                        '& .MuiPaper-root': {
                            overflowX: 'visible',
                        },
                    }}
                >


                    <Box sx={{ padding: '20px 30px', overFlow: 'auto' }}>
                        <Grid container spacing={2}>

                            <Typography sx={userStyle.HeaderText}>
                                Edit Time and Points
                            </Typography>

                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <Typography>Project<b style={{ color: "red" }}>*</b></Typography>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={projects}
                                        styles={colourStyles}
                                        value={{ label: selectedProjectedit, value: selectedProjectedit }}
                                        onChange={(e) => { setSelectedProjectedit(e.value); 
                                            setSelectedCategoryedit("Please Select Category"); 
                                            setSelectedSubCategoryedit("Please Select Subcategory") }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <Typography>Category<b style={{ color: "red" }}>*</b></Typography>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={filteredCategoriesEdit}
                                        styles={colourStyles}
                                        value={{ label: selectedCategoryedit, value: selectedCategoryedit }}
                                        onChange={(e) => { setSelectedCategoryedit(e.value);
                                             setSelectedSubCategoryedit("Please Select Subcategory") }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <Typography>SubCategory</Typography>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={filteredSubCategoriesEdit}
                                        styles={colourStyles}
                                        value={{ label: selectedSubCategoryedit, value: selectedSubCategoryedit }}
                                        onChange={(e) => setSelectedSubCategoryedit(e.value)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Time<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="hh:mm:ss"
                                        value={timePointsEdit.time}
                                        // onChange={(e) => {
                                        //     setTimePointsEdit({ ...timePointsEdit, time: e.target.value })
                                        // }}

                                        onChange={handleChangeEdit}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Rate<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        sx={userStyle.input}
                                        type="number"
                                        value={rateEdit}
                                        onChange={(e) => {
                                            setRateEdit(Number(e.target.value));
                                            handleRateEdit(e);
                                        }}

                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Conversion<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        sx={userStyle.input}
                                        type="number"
                                        value={rateToPointsEdit}
                                        onChange={(e) => {
                                            setRateToPointsEdit(Number(e.target.value));
                                            handleRateToPointsEdit(e);
                                        }}

                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Points<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        sx={userStyle.input}
                                        type="number"
                                        value={pointsEdit}
                                        onChange={(e) => {
                                            setPointsedit(Number(e.target.value));
                                            handlePointsChangeEdit(e);
                                        }}
                                        placeholder="0.00000"

                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Flag Count<b style={{ color: "red" }}>*</b></Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="number"
                                        sx={userStyle.input}
                                        placeholder="0.00000"
                                        value={timePointsEdit.flagcount}
                                        onChange={(e) => {
                                            setTimePointsEdit({ ...timePointsEdit, flagcount: e.target.value })
                                        }}
                                    />
                                </FormControl>
                                <br />
                                <br />
                                <br />
                                <br />
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item md={6} xs={6} sm={6}>
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
                                <Grid item md={6} xs={6} sm={6}>
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
                        </Grid>
                    </Box>


                </Dialog>
            </Box>
            <br />
            {isUserRoleCompare?.includes("ltime&points") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Time And Point List</Typography>
                        </Grid>
                        <Grid container sx={{ justifyContent: "center" }}>
                            <Grid>
                                {isUserRoleCompare?.includes("exceltime&points") && (
                                    
                                    <>
                                        <Button onClick={(e) => {
                                            setIsFilterOpen(true)
                                            setFormat("xl")
                                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("csvtime&points") && (
                                   
                                    <>
                                        <Button onClick={(e) => {
                                            setIsFilterOpen(true)
                                            setFormat("csv")
                                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                    </>
                                )}
                                {isUserRoleCompare?.includes("printtime&points") && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                            &ensp;
                                            <FaPrint />
                                            &ensp;Print&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("pdftime&points") && (
                                    
                                    <>
                                        <Button sx={userStyle.buttongrp}
                                            onClick={() => {
                                                setIsPdfFilterOpen(true)

                                            }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                    </>
                                )}
                                 {isUserRoleCompare?.includes("imagetime&points") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                        </>
                                    )}
                            </Grid>
                        </Grid>
                        <br />
                        {/* ****** Table Grid Container ****** */}
                        <>
                            <Grid style={userStyle.dataTablestyle}>
                                <Box>
                                    <label >Show entries:</label>
                                    <Select id="pageSizeSelect" defaultValue="" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        {/* <MenuItem value={(timePointsList.length)}>All</MenuItem> */}
                                    </Select>&ensp;  &ensp;
                                    {isUserRoleCompare?.includes("bdtime&points") && (
                                        <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button>
                                    )}
                                </Box>
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
                          </>: 
                            <>
                                    {/* ****** Table Grid Container ****** */}

                            {/* ****** Table start ****** */}
                            <TableContainer component={Paper}>
                                <Table
                                    sx={{ minWidth: 700 }}
                                    aria-label="customized table"
                                    id="usertable"
                                    ref={gridRef}

                                >
                                    <TableHead sx={{ fontWeight: "600" }}>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <Checkbox checked={selectAll} onChange={handleSelectAll} />
                                            </StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('project')}><Box sx={userStyle.tableheadstyle}><Box>Project </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('project')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('category')}><Box sx={userStyle.tableheadstyle}><Box>Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('category')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('subcategory')}><Box sx={userStyle.tableheadstyle}><Box>SubCategory</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subcategory')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('time')}><Box sx={userStyle.tableheadstyle}><Box>Time</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('time')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('rate')}><Box sx={userStyle.tableheadstyle}><Box>Rate</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('rate')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('conversion')}><Box sx={userStyle.tableheadstyle}><Box>Conversion</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('conversion')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('point')}><Box sx={userStyle.tableheadstyle}><Box>Points</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('point')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('flagcount')}><Box sx={userStyle.tableheadstyle}><Box>Flag count</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('flagcount')}</Box></Box></StyledTableCell>
                                            <StyledTableCell>Action</StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody align="left">
                                        {filteredData.length > 0 ? (
                                            filteredData?.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell>
                                                        <Checkbox checked={selectedRows.includes(row._id)} onChange={() => handleCheckboxChange(row._id)} />
                                                    </StyledTableCell>
                                                    <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                    <StyledTableCell>{row.project}</StyledTableCell>
                                                    <StyledTableCell>{row.category}</StyledTableCell>
                                                    <StyledTableCell>{row.subcategory}</StyledTableCell>
                                                    <StyledTableCell>{row.time}</StyledTableCell>
                                                    <StyledTableCell>{row.rate}</StyledTableCell>
                                                    <StyledTableCell>{row.ratetopoints}</StyledTableCell>
                                                    <StyledTableCell>{row.points}</StyledTableCell>
                                                    <StyledTableCell>{row.flagcount}</StyledTableCell>
                                                    <StyledTableCell component="th" scope="row" colSpan={1}>
                                                        <Grid sx={{ display: "flex" }}>
                                                            {isUserRoleCompare?.includes("etime&points") && (
                                                                <>
                                                                    <Button
                                                                        sx={userStyle.buttonedit}
                                                                        onClick={() => {
                                                                            handleClickOpenEdit();
                                                                            getCode(row._id);
                                                                        }}

                                                                    >
                                                                        <EditOutlinedIcon style={{ fontsize: "large" }} />
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {isUserRoleCompare?.includes("dtime&points") && (
                                                                <>
                                                                    <Button
                                                                        sx={userStyle.buttondelete}
                                                                        onClick={(e) => {
                                                                            rowData(row._id, row.project, row.category, row.time, row.points);
                                                                        }}

                                                                    >
                                                                        <DeleteOutlineOutlinedIcon
                                                                            style={{ fontsize: "large" }}
                                                                        />
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {isUserRoleCompare?.includes("vtime&points") && (
                                                                <>
                                                                    <Button
                                                                        sx={userStyle.buttonedit}
                                                                        onClick={() => {
                                                                            handleClickOpenview();
                                                                            getviewCode(row._id);
                                                                        }}
                                                                    >
                                                                        <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {isUserRoleCompare?.includes("itime&points") && (
                                                                <>
                                                                    <Button
                                                                        sx={userStyle.buttonedit}
                                                                        onClick={() => {
                                                                            handleClickOpeninfo();
                                                                            getinfoCode(row._id);
                                                                        }}
                                                                    >
                                                                        <InfoOutlinedIcon style={{ fontsize: "large" }} />
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </Grid>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            )))
                                            : <StyledTableRow> <StyledTableCell colSpan={9} align="center">No Data Available</StyledTableCell> </StyledTableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
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
                            {/* ****** Table End ****** */}
                            </>
                            }
                        </>
                        {/* ****** Table End ****** */}
                    </Box>
                </>
            )
            }


            {/* ****** Table End ****** */}

            {/* Delete Modal */}
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
                        <Button onClick={handleCloseMod} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={(e) => delModule(deleteId)}
                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>


                {/* print layout */}
                <TableContainer component={Paper} sx={userStyle.printcls}>
                    <Table
                        sx={{ minWidth: 700 }}
                        aria-label="customized table"
                        id="usertable"
                        ref={componentRef}
                    >
                        <TableHead sx={{ fontWeight: "600" }}>
                            <TableRow>
                                <TableCell> SI.No</TableCell>
                                <TableCell> Project Name</TableCell>
                                <TableCell>Category Name</TableCell>
                                <TableCell>SubCategory Name</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Rate</TableCell>
                                <TableCell>Conversion</TableCell>
                                <TableCell>Points</TableCell>
                                <TableCell>Flag count</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            {filteredData.length > 0 &&
                                filteredData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.project}</TableCell>
                                        <TableCell>{row.category}</TableCell>
                                        <TableCell>{row.subcategory}</TableCell>
                                        <TableCell>{row.time}</TableCell>
                                        <TableCell>{row.rate}</TableCell>
                                        <TableCell>{row.ratetopoints}</TableCell>
                                        <TableCell>{row.points}</TableCell>
                                        <TableCell>{row.flagcount}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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
                        <Typography sx={userStyle.HeaderText}> View Time And Points</Typography>
                        <br /><br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Project Name</Typography>
                                    <Typography>{timePointsEdit.project}</Typography>
                                </FormControl>
                            </Grid><br />
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Category Name</Typography>
                                    <Typography>{timePointsEdit.category}</Typography>
                                </FormControl>
                            </Grid><br />
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">SubCategory Name</Typography>
                                    <Typography>{timePointsEdit.subcategory}</Typography>
                                </FormControl>
                            </Grid><br />
                            <Grid item md={6} xs={12} sm={12}>
                                <Typography variant="h6">Time</Typography>
                                <FormControl fullWidth size="small">
                                    <Typography>{timePointsEdit.time}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <Typography variant="h6">Rate</Typography>
                                <FormControl fullWidth size="small">
                                    <Typography>{timePointsEdit.rate}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <Typography variant="h6">Conversion</Typography>
                                <FormControl fullWidth size="small">
                                    <Typography>{timePointsEdit.ratetopoints}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <Typography variant="h6">points</Typography>
                                <FormControl fullWidth size="small">
                                    <Typography>{timePointsEdit.points}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <Typography variant="h6">Flag Count</Typography>
                                <FormControl fullWidth size="small">
                                    <Typography>{timePointsEdit.flagcount}</Typography>
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

            {/* Check delete Modal */}
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
                                    {checkQueue?.length > 0 ? (
                                        <>
                                            <span style={{ fontWeight: '700', color: '#777' }}>
                                                {`${deleteTimePoint.points, deleteTimePoint.time, deleteTimePoint.project, deleteTimePoint.category} `}
                                            </span>was linked in <span style={{ fontWeight: '700' }}>Alloted Queue List</span> </>
                                    ) : (
                                        ''
                                    )}
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseCheck} autoFocus variant="contained" color='error'> OK </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </>
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

            {/* this is info view details */}

            <Dialog
                open={openInfo}
                onClose={handleCloseinfo}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box sx={{ width: '550px', padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>Time and Points Info </Typography>
                        <br /><br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">addedby</Typography>
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
                            <br />
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Updated by</Typography>
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
            {/* check edit modal */}
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
                            sx={userStyle.btncancel}
                            onClick={handleCloseerrpop}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

export default Timeandpointsexcel;