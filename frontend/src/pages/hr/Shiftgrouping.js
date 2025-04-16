import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Dialog, Select, MenuItem, TableBody, TableCell, TableRow, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../pageStyle";
import Selects from "react-select";
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { MultiSelect } from "react-multi-select-component";
import Headtitle from "../../components/Headtitle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import 'jspdf-autotable'
import { useReactToPrint } from "react-to-print";
import { SERVICE } from '../../services/Baseservice';
import { handleApiError } from "../../components/Errorhandling";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import moment from 'moment-timezone';
import { UserRoleAccessContext } from '../../context/Appcontext';
import { AuthContext } from '../../context/Appcontext';
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import StyledDataGrid from "../../components/TableStyle";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/system';
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import { Description } from "@material-ui/icons";

function ShiftGrouping() {

    const [shiftDetails, setShiftDetails] = useState({
        shiftDay: "Please Select Shiftday",
        shifthours: "Please Select Working Hours",
    });

    const [shiftEditDetails, setShiftEditDetails] = useState({
        shiftDay: "", shifthours: ""
    });
    const [isBtn, setIsBtn] = useState(false);

    const shiftDayOptions = [
        { label: "Day", value: "Day" },
        { label: "Night", value: "Night" },
        { label: "General", value: "General" },
        { label: "1st Shift", value: "1st Shift" },
        { label: "2nd Shift", value: "2nd Shift" },
        { label: "3rd Shift", value: "3rd Shift" }
    ]

    const [workinghoursDayOptions, setWorkinghoursDayOptions] = useState([]);

    const [isCheckOpenNew, setisCheckOpenNew] = useState(false);
    const handleClickOpenCheckNew = () => {
        setisCheckOpenNew(true);
    };
    const handleCloseCheckNew = () => {
        setisCheckOpenNew(false);
        handleCloseModcheckbox();
    };

    const [shifts, setShifts] = useState([]);
    const [selectedOptionsShiftAdd, setSelectedOptionsShiftAdd] = useState([]);
    const [employeesList, setEmployeesList] = useState([]);
    const [shiftList, setShiftList] = useState([]);
    const [shiftListEdit, setShiftListEdit] = useState([]);

    const [valueShiftAdd, setValueShiftAdd] = useState([]);
    // for edit assign shift
    const [selectedOptionsShiftEditAdd, setSelectedOptionsShiftEditAdd] = useState([]);
    const [employeesEditList, setEmployeesEditList] = useState([]);
    const [valueShiftEditAdd, setValueShiftEditAdd] = useState([]);

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedNames, setSelectedNames] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedShifts, setSelectedShifts] = useState([]);

    const [shiftsid, setShiftsid] = useState({
        shift: []
    });


    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Shiftgrouping.png');
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

    const { isUserRoleCompare } = useContext(UserRoleAccessContext);

    const { isUserRoleAccess } = useContext(UserRoleAccessContext);

    const username = isUserRoleAccess.username;

    const [isShifts, setIsshifts] = useState(false);
    const { auth } = useContext(AuthContext);

    let printsno = 1;

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

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
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
        shiftday: true,
        shift: true,
        actions: true,
    };


    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


    const [deleteshift, setDeleteshift] = useState("");
    // set function to get particular row....
    const [checkUser, setCheckUser] = useState();


    //multiselect form
    const handleShiftChangeAdd = (options) => {
        setValueShiftAdd(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsShiftAdd(options);
    };

    const customValueRendererShiftAdd = (valueShiftAdd, _shifts) => {
        return valueShiftAdd.length ? valueShiftAdd.map(({ label }) => label).join(", ") : <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Shift</span>;
    };

    // edit mulitiselect 

    const handleShiftChangeEditAdd = (options) => {
        setValueShiftEditAdd(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsShiftEditAdd(options);
    };

    const customValueRendererShiftEditAdd = (valueShiftEditAdd, _shifts) => {
        return valueShiftEditAdd.length ? valueShiftEditAdd.map(({ label }) => label).join(", ") : <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Shift</span>;
    };

    const rowData = async (id, name) => {
        try {
            const [res, resuser] = await Promise.all([
                axios.get(`${SERVICE.GETSINGLESHIFTGROUP}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                }),
                axios.post(SERVICE.USERSHIFTCHECKBULK, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    checkshifttouser: name
                }),
            ])
            setDeleteshift(res?.data?.shiftGrouping);
            setCheckUser(resuser?.data?.users)

            if ((resuser?.data?.users).length > 0) {
                handleClickOpenCheck();
            }
            else {
                handleClickOpen();
            }
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // Alert delete popup
    let shiftGroupId = deleteshift._id;
    const delShift = async () => {
        try {
            await axios.delete(
                `${SERVICE.GETSINGLESHIFTGROUP}/${shiftGroupId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                }
            );
            await fetchShift();
            setPage(1);
            setSelectedRows([]);
            handleCloseMod();
            setShowAlert(
                <>
                    <DeleteIcon
                        sx={{ fontSize: "100px", color: "#d32f2f" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Deleted Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const delShiftcheckbox = async () => {


        try {

            const [resuser] = await Promise.all([
                axios.post(SERVICE.USERSHIFTCHECKBULK, { checkshifttouser: selectedNames }, {
                    headers: { Authorization: `Bearer ${auth.APIToken}` },
                }),
             
            ]);
            const usersExist = resuser?.data?.users?.length > 0;
            

            if (usersExist) {
                handleClickOpenCheckNew();
            }
            else {
                const deletePromises = selectedRows?.map((item) => {
                    return axios.delete(`${SERVICE.GETSINGLESHIFTGROUP}/${item}`, {
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

                await fetchShift();

                setShowAlert(
                    <>
                        <DeleteSweepIcon sx={{ fontSize: "100px", color: '#d32f2f' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>Deleted successfully</p>
                    </>
                );
                handleClickOpenerr();
            }

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    //add function....
    const sendRequest = async () => {
        setIsBtn(true)
        const shiftGrouping = selectedOptionsShiftAdd.map((options) => options.value)
        try {
            let shiftcreate = await axios.post(
                SERVICE.CREATESINGLESHIFTGROUP,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    shiftday: shiftDetails.shiftDay,
                    shifthours: shiftDetails.shifthours,
                    shift: [...shiftGrouping],
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            await fetchShift();
            setSelectedOptionsShiftAdd([]);
            // setShiftList([]);
            setShowAlert(
                <>
                    <CheckCircleIcon
                        sx={{ fontSize: "100px", color: "green" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Added Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();
            setIsBtn(false)
        } catch (err) { setIsBtn(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        let shiftvalue = selectedOptionsShiftAdd.map((item) => item.value);
        const isNameMatch = shifts.some(item => item.shiftday.toLowerCase() === shiftDetails.shiftDay.toLowerCase() && item.shifthours.toLowerCase() === shiftDetails.shifthours.toLowerCase() && item.shift.some((data) => shiftvalue.includes(data)));

        if (shiftDetails.shiftDay === undefined || shiftDetails.shiftDay === "" || shiftDetails.shiftDay === "Please Select Shiftday") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please select Shift Day"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (shiftDetails.shifthours === undefined || shiftDetails.shifthours === "" || shiftDetails.shifthours === "Please Select Working Hours") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Working Hours"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedOptionsShiftAdd.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Shift"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Data Already Exist!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            sendRequest();
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setSelectedOptionsShiftAdd([]);
        setShiftDetails({ shiftDay: "Please Select Shiftday", shifthours: "Please Select Working Hours" })
        setShiftList([]);
        setShowAlert(
            <>
                <ClearAllIcon
                    sx={{ fontSize: "100px", color: "#1976d2" }}
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

    //get single row to edit....
    const getCode = async (e, name) => {
        try {
            let res = await axios.get(`${SERVICE.GETSINGLESHIFTGROUP}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setShiftsid(res?.data?.shiftGrouping);
            setShiftEditDetails({
                shiftDay: res?.data?.shiftGrouping.shiftday,
                shifthours: res?.data?.shiftGrouping.shifthours
            })
            fetchShiftNewEdit({ value: res?.data?.shiftGrouping.shifthours })
            setSelectedShifts(shifts.filter((item) => item._id !== e))
            setSelectedOptionsShiftEditAdd(
                res?.data?.shiftGrouping?.shift.map((option) => ({
                    label: option,
                    value: option
                }))
            )
            let res_shift = await axios.get(SERVICE.SHIFT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            const shiftall = [...res_shift?.data?.shifts.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            const uniqueArray = shiftall.filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            });

            setEmployeesEditList(uniqueArray)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.GETSINGLESHIFTGROUP}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setShiftsid(res?.data?.shiftGrouping);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //shift updateby edit page...
    let updateby = shiftsid.updatedby;
    let addedby = shiftsid.addedby;

    let shiftedid = shiftsid._id;
    //editing the single data....
    const sendEditRequest = async () => {
        const shiftGrouping = selectedOptionsShiftEditAdd.map((options) => options.value)
        try {
            let res = await axios.put(
                `${SERVICE.GETSINGLESHIFTGROUP}/${shiftedid}`,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    shiftday: shiftEditDetails.shiftDay,
                    shifthours: shiftEditDetails.shifthours,
                    shift: [...shiftGrouping],
                    updatedby: [
                        ...updateby, {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),

                        },
                    ],
                }
            );
            await fetchShift();
            handleCloseModEdit();
            setShowAlert(
                <>
                    <CheckCircleIcon
                        sx={{ fontSize: "100px", color: "green" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Updated Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const editSubmit = (e) => {
        e.preventDefault();
        let shiftvalue = selectedOptionsShiftEditAdd.map((item) => item.value);
        const isNameMatch = selectedShifts.some(item => item.shiftday.toLowerCase() === shiftEditDetails.shiftDay.toLowerCase() && item.shifthours.toLowerCase() === shiftEditDetails.shifthours.toLowerCase() && item.shift.some((data) => shiftvalue.includes(data)));

        if (shiftEditDetails.shiftDay === "" || shiftEditDetails.shiftDay === undefined) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Shiftday"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (shiftEditDetails.shiftDay === "" || shiftEditDetails.shiftDay === undefined) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Shiftday"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (selectedOptionsShiftEditAdd.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Shift"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Data Already Exist!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            sendEditRequest();
        }
    };

    // get all shifts
    const fetchShift = async () => {
        try {
            let res_shift = await axios.get(SERVICE.SHIFT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            let workinghours = [...new Set(res_shift?.data?.shifts.map((data) => {
                return data.workinghours.split(":")[0]
            }))].sort((a, b) => a - b).map((dataNew) => {
                return { label: dataNew, value: dataNew }
            });

            setWorkinghoursDayOptions(workinghours);
            const shiftall = [...res_shift?.data?.shifts.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            const uniqueArray = shiftall.filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            });

            setEmployeesList(uniqueArray)
            setIsshifts(true);
            let res_shiftGroupings = await axios.get(SERVICE.GETALLSHIFTGROUPSBYCONDITION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setShifts(res_shiftGroupings?.data?.shiftgroupings);

        } catch (err) { setIsshifts(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchShiftNew = async (e) => {
        let shiftDropdown = employeesList.filter((data) => {
            return data.workinghours.split(":")[0] == e.value;
        }).map((item) => {
            return { label: item.name, value: item.name }
        })

        setShiftList(shiftDropdown);

    }

    const fetchShiftNewEdit = async (e) => {
        let shiftDropdown = employeesList.filter((data) => {
            return data.workinghours.split(":")[0] == e.value;
        }).map((item) => {
            return { label: item.name, value: item.name }
        })

        setShiftListEdit(shiftDropdown);

    }


    const modifiedData = shifts.map(obj => ({
        ...obj,
    }));

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
                "Shift Day": item.shiftday || '',
                Shift: item.shift || '',

            };
        });
    };

    const handleExportXL = (isfilter) => {

        const dataToExport = isfilter === "filtered" ? filteredData : items;

        if (!dataToExport || dataToExport.length === 0) {
            console.error('No data available to export');
            return;
        }

        exportToExcel(formatData(dataToExport), 'Shiftgrouping');
        setIsFilterOpen(false);
    };

    // pdf.....
    const columns = [
        { title: "Shift Day", field: "shiftday" },
        { title: "Shift", field: "shift" },

    ];

    const downloadPdf = (isfilter) => {
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

        doc.save("Shiftgrouping.pdf");
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Shiftgrouping",
        pageStyle: "print",
    });



    useEffect(() => {
        fetchShift();
    }, []);

    //table entries ..,.
    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = modifiedData?.map((item, index) => ({
            ...item, serialNumber: index + 1,
            shiftday: item.shiftday + '_' + item.shifthours,
            shift: item.shift?.map((t, i) => ` ${i + 1 + "."}` + t).toString(),
        }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [shifts])


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
                            const allRowNames = rowDataTable
                                .map(row => row?.shift?.includes(",") ? row.shift.split(",") : [row.shift])
                                .flat()
                                .map((item) => item.replace(' ', ""))
                                .map(item => item.slice(2));
                            setSelectedRows(allRowIds);
                            setSelectedNames(allRowNames);
                        }
                        setSelectAllChecked(!selectAllChecked);

                    }}
                />
            ),

            renderCell: (params) => (
                <Checkbox
                    checked={selectedRows.includes(params.row.id)}
                    onChange={(e) => {

                        let data = (params.row?.shift || "")
                            .split(",")              // Split the string by commas
                            .map(item => item.trim()) // Remove leading/trailing whitespace from each item
                            .map(item => item.slice(2)) // Remove the first two characters from each item
                            .filter(item => item.length > 0); // Filter out any empty strings

                        if (e.target.checked) {
                            setSelectedNames([...selectedNames, ...data])
                        } else {
                            setSelectedNames([...selectedNames])
                        }
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
            width: 75,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header"
        },
        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 80, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
        },
        { field: "shiftday", headerName: "Shift Day", flex: 0, width: 200, hide: !columnVisibility.shiftday, headerClassName: "bold-header" },
        { field: "shift", headerName: "Shift", flex: 0, width: 350, hide: !columnVisibility.shift, headerClassName: "bold-header" },

        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 450,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    {(isUserRoleCompare?.includes("eshiftgrouping") && !params.row.hasresults) && (
                        <Button sx={userStyle.buttonedit} onClick={() => {
                            handleClickOpenEdit();
                            getCode(params.row.id, params.row.name);
                        }}><EditOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                    )}
                    {isUserRoleCompare?.includes("dshiftgrouping") && (
                        <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.row.id, params.row.shiftArray) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                    )}
                    {isUserRoleCompare?.includes("vshiftgrouping") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpenview();
                                getCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ishiftgrouping") && (
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
            shiftday: item.shiftday,
            shift: item.shift,
            hasresults: item.hasResults,
            shiftArray: (item.shift.includes(",") ? item.shift.split(",") : [item.shift])
                .map(item => item.replace(' ', ""))
                .map(item => item.slice(2))
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

    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
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


    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);


    return (
        <Box>
            {/* ****** Header Content ****** */}
            <Headtitle title={"SHIFT GROUPING"} />
            <Typography sx={userStyle.HeaderText}>Shift Grouping</Typography>
            {isUserRoleCompare?.includes("ashiftgrouping") && (
                <Box sx={userStyle.selectcontainer}>
                    <>
                        <Grid container spacing={2}>
                            <Grid item sm={12} md={12} xs={12}>
                                <Typography sx={userStyle.importheadtext}>Add Shift Grouping</Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <Typography>Shift Day<b style={{ color: "red" }}>*</b></Typography>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={shiftDayOptions}
                                        placeholder="Please Select Shiftday"
                                        value={{ label: shiftDetails.shiftDay, value: shiftDetails.shiftDay }}
                                        onChange={(e) => {
                                            setShiftDetails((prev) => ({
                                                ...prev, shiftDay: e.value
                                            }))
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <Typography>Working Hours<b style={{ color: "red" }}>*</b></Typography>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={workinghoursDayOptions}
                                        placeholder="Please Select Working Hours"
                                        value={{ label: shiftDetails.shifthours, value: shiftDetails.shifthours }}
                                        onChange={(e) => {
                                            setShiftDetails((prev) => ({
                                                ...prev, shifthours: e.value
                                            }))
                                            fetchShiftNew(e);
                                            setSelectedOptionsShiftAdd([]);

                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} lg={3}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        {" "}
                                        Shift <b style={{ color: "red" }}>*</b>{" "}
                                    </Typography>
                                    <MultiSelect size="small" options={shiftList} value={selectedOptionsShiftAdd} onChange={handleShiftChangeAdd} valueRenderer={customValueRendererShiftAdd} />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={2.5} xs={12} sm={6}>
                                <>
                                    <Button variant="contained"
                                        color="primary"
                                        sx={{ display: "flex" }}
                                        onClick={handleSubmit}
                                        disabled={isBtn}
                                    >Submit</Button>
                                </>
                            </Grid>
                            <Grid item md={2.5} xs={12} sm={6}>
                                <>
                                    <Button sx={userStyle.btncancel} onClick={handleClear}>Clear</Button>

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
                    fullWidth={true}
                    sx={{
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                    }}
                    maxWidth="md"
                >
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.HeaderText}>Edit Shift Grouping</Typography>
                                </Grid>
                                <br />
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item md={6} sm={6} xs={12}>
                                    <Typography>Shift Day<b style={{ color: "red" }}>*</b></Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={shiftDayOptions}
                                            placeholder="Please Select Shiftday"
                                            value={{ label: shiftEditDetails.shiftDay, value: shiftEditDetails.shiftDay }}
                                            onChange={(e) => {
                                                setShiftEditDetails((prev) => ({
                                                    ...prev, shiftDay: e.value
                                                }))
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} sm={6} xs={12}>
                                    <Typography>Working Hours<b style={{ color: "red" }}>*</b></Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            maxMenuHeight={300}
                                            options={workinghoursDayOptions}
                                            placeholder="Please Select Working Hours"
                                            value={{ label: shiftEditDetails.shifthours, value: shiftEditDetails.shifthours }}
                                            onChange={(e) => {
                                                setShiftEditDetails((prev) => ({
                                                    ...prev, shifthours: e.value
                                                }))
                                                fetchShiftNewEdit(e);
                                                setSelectedOptionsShiftEditAdd([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            Shift <b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <MultiSelect size="small" options={shiftListEdit} value={selectedOptionsShiftEditAdd} onChange={(e) => handleShiftChangeEditAdd(e)} valueRenderer={customValueRendererShiftEditAdd} />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={4} sm={4}>
                                    <Button variant="contained" onClick={editSubmit}> Update</Button>
                                </Grid>
                                <Grid item md={4} xs={4} sm={4}>
                                    <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}> Cancel </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lshiftgrouping") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Shift Grouping List</Typography>
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
                                        <MenuItem value={(shifts?.length)}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelshiftgrouping") && (
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
                                    {isUserRoleCompare?.includes("csvshiftgrouping") && (
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
                                    {isUserRoleCompare?.includes("printshiftgrouping") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfshiftgrouping") && (
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
                                    {isUserRoleCompare?.includes("imageshiftgrouping") && (
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
                        {isUserRoleCompare?.includes("bdshiftgrouping") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button>)}


                        <br /><br />
                        {!isShifts ?
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
                            onClick={(e) => delShift(shiftsid)}
                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Check delete  Modal */}
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
                                        {checkUser?.length > 0 ? (
                                            <>
                                                <span style={{ fontWeight: '700', color: '#777' }}>
                                                    {`Some of the Shifts in the grouping `}
                                                </span>were linked in <span style={{ fontWeight: '700' }}>User</span> </>
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
                                <TableCell>SI.No</TableCell>
                                <TableCell>Shift Day</TableCell>
                                <TableCell>Shift</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rowDataTable &&
                                rowDataTable.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{printsno++}</TableCell>
                                        <TableCell>{row.shiftday}</TableCell>
                                        <TableCell>{row.shift}</TableCell>
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
                <Box sx={{ width: "550px", padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>View Shift Grouping</Typography>
                        <br /><br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Shift Day</Typography>
                                    <Typography>{shiftsid.shiftday}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small" >
                                    <Typography variant="h6">Working Hours</Typography>
                                    <Typography>{shiftsid.shifthours}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl size="small" fullWidth>
                                    <Typography variant="h6"> Shift</Typography>
                                    <Typography>{shiftsid.shift.map((t, i) => ` ${i + 1 + "."}` + t).toString()}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview}> Back </Button>
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
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Cancel</Button>
                        <Button autoFocus variant="contained" color='error'
                            onClick={(e) => delShiftcheckbox(e)}
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



            {/* this is info view details */}

            <Dialog
                open={openInfo}
                onClose={handleCloseinfo}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            Shift Grouping info
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

            {/* ALERT DIALOG  for the Overall delete*/}
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
                <>
                    <Box>
                        {/* ALERT DIALOG */}
                        <Dialog
                            open={isCheckOpenNew}
                            onClose={handleCloseCheckNew}
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

                                    <>
                                        <span style={{ fontWeight: "700", color: "#777" }}>
                                            {`Some of the Shifts `}
                                        </span>
                                        were linked to{" "}
                                        <span style={{ fontWeight: "700" }}>Users</span>{" "}
                                    </>

                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={handleCloseCheckNew}
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

export default ShiftGrouping;