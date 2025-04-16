import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import {
    Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, InputAdornment,
    DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TextareaAutosize,
    TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton
} from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import Selects from "react-select";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import axios from "axios";
import { SERVICE } from '../../services/Baseservice';
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
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/system';
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import AlertDialog from "../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import { handleApiError } from "../../components/Errorhandling";
import PageHeading from "../../components/PageHeading";
import { MultiSelect } from "react-multi-select-component";
import { debounce } from 'lodash';
import { Space, TimePicker } from "antd";
import dayjs from "dayjs";

//new table
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AdvancedSearchBar from '../../components/Searchbar';
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
// import AggregatedSearchBar from "../../components/AggregatedSearchBarEbList.js";
import AggridTable from "../../components/AggridTable";
// import AggridTable from "../../components/AggridTableEbList.js";

function EBReadingDetailsList() {
    const [checkServicemasterBeforeDate, setcheckServicemasterBeforeDate] = useState(0);
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTableImg = useRef(null);
    const gridRefTable = useRef(null);
    const [ebreadingdetailCheck, setEbreadingdetailcheck] = useState(false);

    const [isFilterEb, setIsFilterEb] = useState([]);
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


    const [selectedCompanyFrom, setSelectedCompanyFrom] = useState([]);
    const [selectedBranchFrom, setSelectedBranchFrom] = useState([]);
    const [selectedServiceFrom, setSelectedServiceFrom] = useState([]);
    const [selectedFloorFrom, setSelectedFloorFrom] = useState([]);


    //branch multiselect dropdown changes
    const handleCompanyChangeFrom = (options) => {
        setSelectedCompanyFrom(options);
        setSelectedBranchFrom([]);
        setSelectedServiceFrom([])
        setSelectedFloorFrom([]);
        setserviceNumber([])
        setFloors([])
    };
    const customValueRendererCompanyFrom = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Company";
    };



    //branch multiselect dropdown changes
    const handleBranchChangeFrom = (options) => {
        setSelectedBranchFrom(options);
        setSelectedServiceFrom([])
        setSelectedFloorFrom([]);
        fetchServiceNumberFilter(options);
    };
    const customValueRendererBranchFrom = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Branch";
    };

    //branch multiselect dropdown changes
    const handleServiceChangeFrom = (options) => {
        setSelectedServiceFrom(options);
        setSelectedFloorFrom([]);
        fetchFloorFilter(options)
    };
    const customValueRendererServiceFrom = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Service Number";
    };

    //branch multiselect dropdown changes
    const handleFloorChangeFrom = (options) => {
        setSelectedFloorFrom(options);
    };
    const customValueRendererFloorFrom = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Floor";
    };



    let exportColumnNames = [
        "Company",
        "Branch",
        "Unit",
        "Floor",
        "Area",
        "Service",
        "Date",
        "Time",
        "Kwh",
        "kvah",
        "Kwhunit",
        "kvahunit",
        "PF",
        "MD",
        "Mode",
        "Description",
    ];
    let exportRowValues = [
        "company",
        "branch",
        "unit",
        "floor",
        "area",
        "servicenumber",
        "date",
        "time",
        "openkwh",
        "kvah",
        "kwhunit",
        "kvahunit",
        "pf",
        "md",
        "readingmode",
        "description",
    ];


    const pathname = window.location.pathname;

    //Access Module

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("EB Reading Details List"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });

    }

    useEffect(() => {
        getapi();
    }, []);

    const [loadingdeloverall, setloadingdeloverall] = useState(false);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);



    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = yyyy + "-" + mm + "-" + dd;
    const [ebservices, setEbServices] = useState([])
    const [ebservicesEdit, setEbServicesEdit] = useState("")
    const [readingFilter, setReadingFilter] = useState("")
    const [readingFilterEdit, setReadingFilterEdit] = useState("")
    const [readingFilterKvhEdit, setReadingFilterKVHEdit] = useState("")

    const [futureupdate, setFutureUpdate] = useState({ id: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "" })

    const [pfdifference, setPfdifference] = useState("")

    // Edit status'
    const fetchEbServiceMasterEdit = async (servicenumber, floor, area, e) => {
        try {
            let res_type = await axios.post(SERVICE.EBSERVICEMASTERLIVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                assignbranch: accessbranch,
            });

            let result = res_type.data.ebservicemasters.find((d) =>
                d.company === ebreadingdetailEdit.company &&
                d.branch === ebreadingdetailEdit.branch &&
                d.unit === ebreadingdetailEdit.unit &&
                d.floor === floor &&
                (d.area.includes(area)
                    &&
                    d.servicenumber === servicenumber

                )

            );


            let answer = e === "Daily Closing" ? result?.allowedunit : e === "Month Closing" ? result?.allowedunitmonth : 0

            setEbServicesEdit(answer)



        } catch (err) {

            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [ebreadingdetail, setEbreadingdetail] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        floor: "Please Select Floor",
        area: "Please Select Area",
        servicenumber: "Please Select Service", readingmode: "", description: "", date: formattedDate, time: "",
        openkwh: "", kvah: "", kwhunit: "", kvahunit: "", pf: "", md: "",
        pfrphase: "", pfyphase: "", pfbphase: "", pfcurrent: "", pfaverage: "", mdrphase: "", mdyphase: "", mdbphase: "", mdcurrent: "",
        mdaverage: "",
    });

    const [ebreadingdetailEdit, setEbreadingdetailEdit] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        floor: "Please Select Floor",
        area: "Please Select Area",
        fromtime: "00:00",
        servicenumber: "Please Select Service", readingmode: "", description: "", date: formattedDate, time: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "", pf: "", md: "",
        pfrphase: "", pfyphase: "", pfbphase: "", pfcurrent: "", pfaverage: "", mdrphase: "", mdyphase: "", mdbphase: "", mdcurrent: "",
        mdaverage: "",
    })
    const format = 'hh:mm A';

    const handleTimeChange = (time) => {
        if (time) {
            let timevalue = dayjs(time, "h:mm A").format("HH:mm")
            console.log(timevalue, time, "timevalue")
            //   setTime(time);
            setEbreadingdetailEdit({
                ...ebreadingdetailEdit,
                time: timevalue,
                // fromtime: dayjs(time, "h:mm A"),
                // fromtime24Hrs: dayjs(timeString, "h:mm:ss A").format("HH:mm:ss"),
            });
            fetchEbreadingdetailsFilterTimeEdit(timevalue)
            setTimeEditValue(dayjs(time, "h:mm A"))
        }
    };

    const handleChangekwhreading = (e) => {
        const regex = /^[0-9]+$/;
        const inputValue = e.target.value;
        if (regex.test(inputValue) || inputValue === "") {
            setEbreadingdetail({ ...ebreadingdetail, openkwh: inputValue });
        }
    };

    const handleChangekwhreadingEdit = (e) => {
        const regex = /^[0-9]+$/;
        const inputValue = e.target.value;
        if (regex.test(inputValue) || inputValue === "") {
            setEbreadingdetailEdit({ ...ebreadingdetailEdit, openkwh: inputValue });
        }
    };

    const handleChangekvhreading = (e) => {
        const regex = /^[0-9]+$/;
        const inputValue = e.target.value;
        if (regex.test(inputValue) || inputValue === "") {
            setEbreadingdetail({ ...ebreadingdetail, kvah: inputValue });
        }
    };

    const handleChangekvhreadingEdit = (e) => {
        const regex = /^[0-9]+$/;
        const inputValue = e.target.value;
        if (regex.test(inputValue) || inputValue === "") {
            setEbreadingdetailEdit({ ...ebreadingdetailEdit, kvah: inputValue });
        }
    };
    const [serviceNumber, setserviceNumber] = useState([]);
    const [serviceNumberEdit, setserviceNumberEdit] = useState("");
    const [ebreadingdetails, setEbreadingdetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allEbreadingdetailedit, setAllEbreadingdetailedit] = useState([]);
    const [readingmodeEdit, setReadingmodeEdit] = useState("");
    const [floors, setFloors] = useState([]);
    const [floorsEdit, setFloorEdit] = useState([]);
    const [areasEdit, setAreasEdit] = useState([])

    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const accessbranch = isAssignBranch
        ?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }))


    const username = isUserRoleAccess.username

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);


    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [copiedData, setCopiedData] = useState('');


    //image


    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, 'EB Reading Details List .png');
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
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
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
        setloadingdeloverall(false)
    };

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = (e, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setIsDeleteOpen(false);
        setolddate("")
        setDeleteEbreading({})
        setEbreadingdetailEdit({});
        setReadingmodeEdit("");
        setReadingFilterEdit("");
        setReadingFilterKVHEdit("");
        setPfdifference("");
        setFutureUpdatedelbefore({ id: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "" })
        setFutureUpdatedelafter({ id: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "" })
        setFutureUpdatedelafterarr([])
        setFutureUpdateBeforearr([])
        setFutureUpdatedelbeforearr([])

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
        if ((selectedRows).includes(params.data.id)) {
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
        company: true,
        branch: true,
        unit: true,
        floor: true,
        area: true,
        date: true,
        servicenumber: true,
        time: true,
        openkwh: true,
        kvah: true,
        kvahunit: true,
        kwhunit: true,
        pf: true,
        md: true,
        readingmode: true,
        description: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    const [servicemaster, setServicemaster] = useState([])


    const fetchServiceNumberall = async () => {
        try {
            let res_freq = await axios.post(SERVICE.EBSERVICEMASTERLIVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                assignbranch: accessbranch,
            });


            setServicemaster(res_freq?.data?.ebservicemasters)
        } catch (err) {

            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    const fetchServiceNumberFilter = async (e) => {
        try {
            let res_freq = await axios.post(SERVICE.EBSERVICEMASTERLIVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                assignbranch: accessbranch,
            });

            let data_set = res_freq?.data?.ebservicemasters.filter((data) => e.map(item => item.value).includes(data.branch));
            let final = [...new Set(data_set.map(item => item.servicenumber))]
            const branchall = [
                ...final.map((d) => ({
                    ...d,
                    label: d,
                    value: d,
                })),
            ];


            setserviceNumber(branchall);
        } catch (err) {

            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchServiceNumberEdit = async (e) => {
        try {
            let res_freq = await axios.post(SERVICE.EBSERVICEMASTERLIVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                assignbranch: accessbranch,
            });

            let data_set = res_freq?.data?.ebservicemasters.filter((data) => e === data.unit);
            const branchall = [
                ...data_set.map((d) => ({
                    ...d,
                    label: d.servicenumber,
                    value: d.servicenumber,
                })),
            ];
            setserviceNumberEdit(branchall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const fetchFloorFilter = async (e) => {
        try {
            let res_freq = await axios.post(SERVICE.EBSERVICEMASTERLIVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                assignbranch: accessbranch,
            });

            let data_set = res_freq?.data?.ebservicemasters.filter((data) => e.map(item => item.value).includes(data.servicenumber));

            let final = [...new Set(data_set.map(item => item.floor))]
            const branchall = [
                ...final.map((d) => ({
                    ...d,
                    label: d,
                    value: d,
                })),
            ];
            setSelectedFloorFrom(branchall)
            setFloors(branchall);
        } catch (err) {

            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };




    const fetchFloorEdit = async (e) => {
        try {
            let res_freq = await axios.post(SERVICE.EBSERVICEMASTERLIVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                assignbranch: accessbranch,
            });

            let data_set = res_freq?.data?.ebservicemasters.find((data) => e === data.servicenumber);
            let findarea = data_set && data_set.floor
            let findarea1 = data_set && data_set.area

            const branchall = [{ label: findarea, value: findarea }]
            const branchallarea = [

                ...findarea1.map((d) => ({
                    ...d,
                    label: d,
                    value: d,
                })),
            ];
            fetchEbServiceMasterEdit(ebreadingdetailEdit.servicenumber, branchall[0]?.value, branchallarea[0]?.value, readingmodeEdit)
            setEbreadingdetailEdit({
                ...ebreadingdetailEdit,
                servicenumber: e,
                floor: branchall[0]?.value,
                area: branchallarea[0]?.value,

            });
            setFloorEdit(branchall);
            setAreasEdit(branchallarea);
        } catch (err) {

            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchFloorEditGetCode = async (e) => {
        try {
            let res_freq = await axios.post(SERVICE.EBSERVICEMASTERLIVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                assignbranch: accessbranch,
            });

            let data_set = res_freq?.data?.ebservicemasters.find((data) => e === data.servicenumber);
            let findarea = data_set && data_set.floor
            let findarea1 = data_set && data_set.area

            const branchall = [{ label: findarea, value: findarea }]
            const branchallarea = [

                ...findarea1.map((d) => ({
                    ...d,
                    label: d,
                    value: d,
                })),
            ];
            fetchEbServiceMasterEdit(ebreadingdetailEdit.servicenumber, branchall[0]?.value, branchallarea[0]?.value, readingmodeEdit)

            setFloorEdit(branchall);
            setAreasEdit(branchallarea);
        } catch (err) {

            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };



    useEffect(() => {
        fetchServiceNumberall();
    }, []);

    const [deleteEbreading, setDeleteEbreading] = useState("");


    const [futureupdatedelbefore, setFutureUpdatedelbefore] = useState({ id: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "" })
    const [futureupdatedelafter, setFutureUpdatedelafter] = useState({ id: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "" })
    const [futureupdatedelafterarr, setFutureUpdatedelafterarr] = useState([])
    const [futureupdatebeforearr, setFutureUpdateBeforearr] = useState([])
    const [futureUpdatedelbeforearr, setFutureUpdatedelbeforearr] = useState([])
    const [olddatedelete, setolddateDelete] = useState("")

    const rowData = async (id, params) => {
        await fetchEbreadingdetails()
        setPageName(!pageName)
        setolddateDelete(params.data.olddate)
        let varfilter = []
        try {
            let res = await axios.get(`${SERVICE.EBREADINGDETAIL_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let res_read = await axios.post(SERVICE.EB_SERVICEFILTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                company: String(params.data.company),
                branch: String(params.data.branch),
                unit: String(params.data.unit),
                floor: String(params.data.floor),
                area: String(params.data.area),
                servicenumber: String(params.data.servicenumber),
                date: String(params.data.olddate),
                time: String(params.data.time),
                readingmode: String(params.data.readingmode),
                // id: id,

            });
            setolddateDelete(params.data.olddate)
            if (res_read?.data?.ebreadingfiltertimefuture.length > 0) {

                setFutureUpdatedelafter(res_read?.data?.ebreadingfiltertimefuture[0])
                setFutureUpdatedelafterarr(res_read?.data?.ebreadingfiltertimefuture)
            }
            if (res_read?.data?.ebreadingfiltertime.length > 0) {
                setFutureUpdatedelbefore(res_read?.data?.ebreadingfiltertime[0])
                setFutureUpdatedelbeforearr(res_read?.data?.ebreadingfiltertime)
            }

            if (res_read?.data?.ebreadingfiltertimefuture.length > 1) {

                setPopupContentMalert(
                    `More than two dates were Added Either Before or After the Date   ${params.data.date} Therefore, This Entry Cannot be Deleted.`
                );
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();

            } else {
                setDeleteEbreading(res?.data?.sebreadingdetail);
                handleClickOpen();
            }

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }

    // // Alert delete popup
    let Ebreadingsid = deleteEbreading?._id;
    const delEbreading = async () => {

        setPageName(!pageName)
        try {

            if (Ebreadingsid) {

                await axios.delete(`${SERVICE.EBREADINGDETAIL_SINGLE}/${Ebreadingsid}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
            }
            if (futureupdatedelafterarr.length >= 1 && futureUpdatedelbeforearr.length >= 1) {
                if (futureupdatedelafter && futureupdatedelafter?._id) {
                    let futureid = futureupdatedelafter?._id
                    let pfdiffkwh = Number(futureupdatedelafter.openkwh) - Number(futureupdatedelbefore.openkwh)
                    let pfdiffkvh = Number(futureupdatedelafter.kvah) - Number(futureupdatedelbefore.kvah)
                    let pfdiff = pfdiffkwh / pfdiffkvh

                    let res = await axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${futureid}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },

                        kwhunit: Number(futureupdatedelafter.openkwh) - Number(futureupdatedelbefore.openkwh),
                        kvahunit: Number(futureupdatedelafter.kvah) - Number(futureupdatedelbefore.kvah),
                        pf: pfdiff
                    });

                }
                await fetchEbreadingdetails();
                await fetchFilteredDatas();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1)

                setPopupContent("Deleted Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
            }
            else if (futureupdatedelafterarr.length > 1) {
                if (futureupdatedelafter && futureupdatedelafter?._id) {
                    let futureid = futureupdatedelafter?._id
                    let pfdiffkwh = Number(futureupdatedelafter.openkwh) - Number(futureupdatedelbefore.openkwh)
                    let pfdiffkvh = Number(futureupdatedelafter.kvah) - Number(futureupdatedelbefore.kvah)
                    let pfdiff = pfdiffkwh / pfdiffkvh
                    let res = await axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${futureid}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },

                        kwhunit: Number(futureupdatedelafter.openkwh) - Number(futureupdatedelbefore.openkwh),
                        kvahunit: Number(futureupdatedelafter.kvah) - Number(futureupdatedelbefore.kvah),
                        pf: pfdiff
                    });

                }
                await fetchEbreadingdetails();
                await fetchFilteredDatas();
                // await fetchEbSort();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1)

                setPopupContent("Deleted Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
            }
            else {
                if (futureupdatedelafter && futureupdatedelafter?._id) {
                    let futureid = futureupdatedelafter?._id
                    let pfdiffkwh = Number(futureupdatedelafter.openkwh) - Number(futureupdatedelbefore.openkwh)
                    let pfdiffkvh = Number(futureupdatedelafter.kvah) - Number(futureupdatedelbefore.kvah)
                    let pfdiff = pfdiffkwh / pfdiffkvh
                    let res = await axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${futureid}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },

                        kwhunit: Number(futureupdatedelafter.openkwh),
                        kvahunit: Number(futureupdatedelafter.kvah),
                        pf: pfdiff
                    });

                }
                await fetchEbreadingdetails();
                await fetchFilteredDatas();
                // await fetchEbSort();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1)

                setPopupContent("Deleted Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
            }
            // }
            const year = olddatedelete && olddatedelete?.split('-')[0];
            const month = olddatedelete && olddatedelete?.split('-')[1];
            const day = olddatedelete && olddatedelete?.split('-')[2];
            if (deleteEbreading.readingmode == "Daily Closing" && olddatedelete) {
                const isLastDayOfMonth = day === new Date(year, month, 0).getDate().toString();
                if (isLastDayOfMonth) {

                    // Filter the array to find the record with "Month Closing" for the previous month
                    const result = ebreadingdetails.find(item =>
                        item.readingmode === "Month Closing"
                        && item.company === deleteEbreading.company
                        && item.branch === deleteEbreading.branch
                        && item.unit === deleteEbreading.unit
                        && item.floor === deleteEbreading.floor
                        && item.area === deleteEbreading.area
                        && item.servicenumber === deleteEbreading.servicenumber
                        && item.date == olddatedelete
                    );
                    // let lastvalue = result ? result : servicemasterval
                    if (result) {
                        let resultid = result?._id
                        let res = await axios.delete(`${SERVICE.EBREADINGDETAIL_SINGLE}/${resultid}`, {
                            headers: {
                                'Authorization': `Bearer ${auth.APIToken}`
                            },

                        });
                    }
                }
                await fetchEbreadingdetails();
                await fetchFilteredDatas();
                // await fetchEbSort();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1)

                setPopupContent("Deleted Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
            }
            await fetchEbreadingdetails();
            await fetchFilteredDatas();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1)

            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        }
        catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };









    const delEbreadingcheckbox = async () => {
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.EBREADINGDETAIL_SINGLE}/${item}`, {
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

            await fetchEbreadingdetails();
            await fetchFilteredDatas();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    let allowedusageunit = Number(ebservices) - Number(readingFilter)
    let allowedusageunitEdit = Number(ebservicesEdit) - Number(readingFilterEdit)
    let status = allowedusageunit < 0 ? "Greater than Allowed Unit" : allowedusageunit > 0 ? "Below than Allowed Unit" : allowedusageunit === 0 ? "Normal Usage Unit" : ""
    let statusEdit = Number(ebservicesEdit) - Number(readingFilterEdit) < 0 ? "Greater than Allowed Unit" : Number(ebservicesEdit) - Number(readingFilterEdit) > 0 ? "Below than Allowed Unit" : Number(ebservicesEdit) - Number(readingFilterEdit) === 0 ? "Normal Usage Unit" : ""

    //submit option for saving
    const handleSubmitFilter = (e) => {
        e.preventDefault();

        if (selectedCompanyFrom.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedBranchFrom.length === 0) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            fetchFilteredDatas();
        }

    };
    const handleClearFilter = async (e) => {
        e.preventDefault();
        // setEbreadingdetailFilter({
        //     company: "Please Select Company",
        //     branch: "Please Select Branch",
        //     floor: "Please Select Floor",
        //     servicenumber: "Please Select Service",
        // })
        setSelectedCompanyFrom([])
        setSelectedBranchFrom([])
        setSelectedServiceFrom([])
        setSelectedFloorFrom([])
        setserviceNumber([]);
        setIsFilterEb([]);
        setFloors([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    }

    //add function 
    const fetchFilteredDatas = async () => {


        setEbreadingdetailcheck(true);
        try {
            let subprojectscreate = await axios.post(SERVICE.CHECK_EBREADINGDETAIL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                company: selectedCompanyFrom.map(item => item.value),
                branch: selectedBranchFrom.map(item => item.value),
                floor: selectedFloorFrom.map(item => item.value),
                servicenumber: selectedServiceFrom.map(item => item.value)
            })

            setIsFilterEb(subprojectscreate?.data?.resulted?.map((item, index) => ({
                ...item, serialNumber: index + 1,
                id: item._id,
                serialNumber: index + 1,
                date: moment(item?.date).format("DD-MM-YYYY"),
                olddate: (item?.date),
                company: item.company === "Please Select Company" ? "" : item.company,
                branch: item.branch === "Please Select Branch" ? "" : item.branch,
                unit: item.unit === "Please Select Unit" ? "" : item.unit,
                floor: item.floor === "Please Select Floor" ? "" : item.floor,
                area: item.area === "Please Select Area" ? "" : item.area,
                servicenumber: item.servicenumber,
                time: item.time,
                openkwh: item.openkwh,
                kvah: item.kvah,
                kvahunit: item.kvahunit,
                kwhunit: item.kwhunit,
                pf: item.pf,
                md: item.md,
                readingmode: item.readingmode,
                description: item.description,
            })))
            setPage(1)
            // setPopupContent("Filtered Successfully");
            // setPopupSeverity("success");

            // handleClickOpenPopup();
            setEbreadingdetailcheck(false);
        } catch (err) {
            setEbreadingdetailcheck(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }

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
        SetDateEdit("")
        setolddate("")
        setEbreadingdetailEdit({});
        setReadingmodeEdit("");
        setReadingFilterEdit("");
        setReadingFilterKVHEdit("");
        setPfdifference("");
        setFutureUpdatedelbefore({ id: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "" })
        setFutureUpdatedelafter({ id: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "" })
        setFutureUpdatedelafterarr([])
        setFutureUpdateBeforearr([])
        setFutureUpdatedelbeforearr([])
    };


    const format1 = 'hh:mm A';
    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };
    const [olddate, setolddate] = useState("")

    const [dateedit, SetDateEdit] = useState("")
    const [timeEditValue, setTimeEditValue] = useState("")
    console.log(dateedit, "dateedit")
    //get single row to edit....
    const getCode = async (e, name) => {
        SetDateEdit(e)
        try {
            let res = await axios.get(`${SERVICE.EBREADINGDETAIL_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            const time = res?.data?.sebreadingdetail?.time;

            SetDateEdit(e)
            setolddate(res?.data?.sebreadingdetail.date)
            setEbreadingdetailEdit({
                ...res?.data?.sebreadingdetail,
                // time: dayjs(time, "HH:mm").format("HH:mm"),
            });
            setTimeEditValue(time != "" ? dayjs(time, "HH:mm") : "")
            fetchServiceNumberEdit(res.data.sebreadingdetail.unit);
            setReadingmodeEdit(res.data.sebreadingdetail.readingmode);
            fetchFloorEditGetCode(res.data.sebreadingdetail.servicenumber);
            setReadingFilterEdit(res.data.sebreadingdetail.kwhunit);
            setReadingFilterKVHEdit(res.data.sebreadingdetail.kvahunit);
            setPfdifference(res.data.sebreadingdetail.pf);
            fetchEbServiceMasterEdit(res.data.sebreadingdetail.servicenumber, res.data.sebreadingdetail.floor, res.data.sebreadingdetail.area, res.data.sebreadingdetail.readingmode)
            handleClickOpenEdit();

        }
        catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.EBREADINGDETAIL_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setEbreadingdetailEdit(res?.data?.sebreadingdetail);
            handleClickOpenview();
        }
        catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.EBREADINGDETAIL_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setEbreadingdetailEdit(res?.data?.sebreadingdetail);
            handleClickOpeninfo();
        }
        catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };



    //Project updateby edit page...
    let updateby = ebreadingdetailEdit?.updatedby;
    let addedby = ebreadingdetailEdit?.addedby;


    let subprojectsid = dateedit;

    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName)
        try {

            if (futureupdatebeforearr.length > 1 && futureupdatedelafterarr.length > 0 || (futureupdatebeforearr.length >= 0 && futureupdatedelafterarr.length > 1)) {
                setPopupContentMalert(
                    `You have Already Added two more dates Before Or After  this Date  ${ebreadingdetailEdit.date}`
                );
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (futureupdatedelafterarr.length > 1 && ebreadingdetailEdit.date !== olddate) {

                setPopupContentMalert(
                    `You have Already Added two more dates after this Date02 ${ebreadingdetailEdit.date}`
                );
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
                SetDateEdit("")
                setolddate("")
                setEbreadingdetailEdit({});
                setReadingmodeEdit("");
                setReadingFilterEdit("");
                setReadingFilterKVHEdit("");
                setPfdifference("");
                setFutureUpdatedelbefore({ id: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "" })
                setFutureUpdatedelafter({ id: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "" })
                setFutureUpdatedelafterarr([])
                setFutureUpdateBeforearr([])
                setFutureUpdatedelbeforearr([])

            }


            else if (futureupdatedelafterarr.length === 1) {
                let res = await axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${subprojectsid}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    company: String(ebreadingdetailEdit.company),
                    branch: String(ebreadingdetailEdit.branch),
                    unit: String(ebreadingdetailEdit.unit),
                    floor: String(ebreadingdetailEdit.floor),
                    area: String(ebreadingdetailEdit.area),
                    servicenumber: String(ebreadingdetailEdit.servicenumber),
                    readingmode: String(readingmodeEdit),
                    description: String(readingmodeEdit === "Session Closing" ? ebreadingdetailEdit.description : ""),
                    date: String(ebreadingdetailEdit.date),
                    time: String(ebreadingdetailEdit.time),
                    openkwh: String(ebreadingdetailEdit.openkwh),
                    kvah: String(ebreadingdetailEdit.kvah),
                    kwhunit: readingFilterEdit,
                    kvahunit: readingFilterKvhEdit,
                    // pf: String(ebreadingdetailEdit.pf),
                    pf: pfdifference,
                    md: String(ebreadingdetailEdit.md),
                    pfrphase: String(ebreadingdetailEdit.pfrphase),
                    pfyphase: String(ebreadingdetailEdit.pfyphase),
                    pfbphase: String(ebreadingdetailEdit.pfbphase),
                    pfcurrent: String(ebreadingdetailEdit.pfcurrent),
                    pfaverage: String(ebreadingdetailEdit.pfaverage),
                    mdrphase: String(ebreadingdetailEdit.mdrphase),
                    mdbphase: String(ebreadingdetailEdit.mdbphase),
                    mdyphase: String(ebreadingdetailEdit.mdyphase),
                    mdcurrent: String(ebreadingdetailEdit.mdcurrent),
                    mdaverage: String(ebreadingdetailEdit.mdaverage),
                    usageunit: ebservicesEdit,
                    currentusageunit: Number(ebservicesEdit) - Number(readingFilterEdit),
                    currentstatus: statusEdit,
                    updatedby: [
                        ...updateby, {
                            name: String(username),
                            date: String(new Date()),
                        },
                    ],
                });

                if (futureupdatedelafter && futureupdatedelafter?._id) {
                    let futureid = futureupdatedelafter?._id
                    let pfdiffkwh = Number(futureupdatedelafter.openkwh) - Number(ebreadingdetailEdit.openkwh)
                    let pfdiffkvh = Number(futureupdatedelafter.kvah) - Number(ebreadingdetailEdit.kvah)
                    let pfdiff = pfdiffkwh / pfdiffkvh
                    let res = await axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${futureid}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },

                        kwhunit: Number(futureupdatedelafter.openkwh) - Number(ebreadingdetailEdit.openkwh),
                        kvahunit: Number(futureupdatedelafter.kvah) - Number(ebreadingdetailEdit.kvah),
                        pf: pfdiff
                    });

                }

                const [year, month, day] = ebreadingdetailEdit.date.split('-');
                if (readingmodeEdit == "Daily Closing") {
                    const isLastDayOfMonth = day === new Date(year, month, 0).getDate().toString();

                    if (isLastDayOfMonth) {

                        const previousMonth = month === 1 ? 12 : month - 1;
                        const previousYear = month === 1 ? year - 1 : year;

                        // Format the previous month and year as "YYYY-MM"
                        const formattedPreviousMonth = `${previousYear}-${String(previousMonth).padStart(2, '0')}`;
                        // Filter the array to find the record with "Month Closing" for the previous month

                        const servicemasterval = servicemaster.find(item =>
                            item.company === ebreadingdetailEdit.company
                            && item.branch === ebreadingdetailEdit.branch
                            && item.unit === ebreadingdetailEdit.unit
                            && item.floor === ebreadingdetailEdit.floor
                            && item.area.includes(ebreadingdetailEdit.area)
                            && item.servicenumber == ebreadingdetailEdit.servicenumber
                        );
                        const result = ebreadingdetails.find(item =>
                            item.readingmode === "Month Closing"
                            && item.company === ebreadingdetailEdit.company
                            && item.branch === ebreadingdetailEdit.branch
                            && item.unit === ebreadingdetailEdit.unit
                            && item.floor === ebreadingdetailEdit.floor
                            && item.area === ebreadingdetailEdit.area
                            && item.servicenumber === ebreadingdetailEdit.servicenumber
                            && item.date.includes(formattedPreviousMonth)
                        );
                        const resultcheck = ebreadingdetails.find(item =>
                            item.readingmode === "Month Closing"
                            && item.date == ebreadingdetailEdit.date
                        );


                        let lastvalue = result ? result : servicemasterval
                        if (lastvalue && resultcheck) {
                            let res = await axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${resultcheck._id}`, {
                                headers: {
                                    'Authorization': `Bearer ${auth.APIToken}`
                                },
                                company: String(ebreadingdetailEdit.company),
                                branch: String(ebreadingdetailEdit.branch),
                                unit: String(ebreadingdetailEdit.unit),
                                floor: String(ebreadingdetailEdit.floor),
                                area: String(ebreadingdetailEdit.area),
                                servicenumber: String(ebreadingdetailEdit.servicenumber),
                                date: String(ebreadingdetailEdit.date),
                                time: String(ebreadingdetailEdit.time),
                                openkwh: String(ebreadingdetailEdit.openkwh) - Number(lastvalue.openkwh),
                                kvah: String(ebreadingdetailEdit.kvah) - Number(lastvalue.kvah),
                                kwhunit: readingFilterEdit,
                                kvahunit: readingFilterKvhEdit,
                                pf: pfdifference,
                                md: String(ebreadingdetailEdit.md),
                                pfrphase: String(ebreadingdetailEdit.pfrphase),
                                pfyphase: String(ebreadingdetailEdit.pfyphase),
                                pfbphase: String(ebreadingdetailEdit.pfbphase),
                                pfcurrent: String(ebreadingdetailEdit.pfcurrent),
                                pfaverage: String(ebreadingdetailEdit.pfaverage),
                                mdrphase: String(ebreadingdetailEdit.mdrphase),
                                mdbphase: String(ebreadingdetailEdit.mdbphase),
                                mdyphase: String(ebreadingdetailEdit.mdyphase),
                                mdcurrent: String(ebreadingdetailEdit.mdcurrent),
                                mdaverage: String(ebreadingdetailEdit.mdaverage),
                                updatedby: [
                                    ...updateby, {
                                        name: String(username),
                                        date: String(new Date()),
                                    },
                                ],
                            });
                        }
                        else {
                            let diffpf = (Number(ebreadingdetailEdit.openkwh) - Number(lastvalue.openkwh)) / (Number(ebreadingdetailEdit.kvah) - Number(lastvalue.kvah))
                            let subprojectscreate = axios.post(SERVICE.EBREADINGDETAIL_CREATE, {
                                headers: {
                                    'Authorization': `Bearer ${auth.APIToken}`
                                },
                                company: String(ebreadingdetailEdit.company),
                                branch: String(ebreadingdetailEdit.branch),
                                unit: String(ebreadingdetailEdit.unit),
                                floor: String(ebreadingdetailEdit.floor),
                                area: String(ebreadingdetailEdit.area),
                                servicenumber: String(ebreadingdetailEdit.servicenumber),
                                readingmode: String("Month Closing"),
                                description: String(ebreadingdetailEdit.description),
                                date: String(ebreadingdetailEdit.date),
                                time: String(ebreadingdetailEdit.time),
                                openkwh: String(ebreadingdetailEdit.openkwh),
                                kvah: String(ebreadingdetailEdit.kvah),
                                kwhunit: Number(ebreadingdetailEdit.openkwh) - Number(lastvalue.openkwh),
                                kvahunit: Number(ebreadingdetailEdit.kvah) - Number(lastvalue.kvah),
                                pf: diffpf,
                                // pf: String(ebreadingdetail.pf),
                                md: String(ebreadingdetailEdit.md),
                                pfrphase: String(ebreadingdetailEdit.pfrphase),
                                pfyphase: String(ebreadingdetailEdit.pfyphase),
                                pfbphase: String(ebreadingdetailEdit.pfbphase),
                                pfcurrent: String(ebreadingdetailEdit.pfcurrent),
                                pfaverage: String(ebreadingdetailEdit.pfaverage),
                                mdrphase: String(ebreadingdetailEdit.mdrphase),
                                mdbphase: String(ebreadingdetailEdit.mdbphase),
                                mdyphase: String(ebreadingdetailEdit.mdyphase),
                                mdcurrent: String(ebreadingdetailEdit.mdcurrent),
                                mdaverage: String(ebreadingdetailEdit.mdaverage),
                                addedby: [
                                    {
                                        name: String(username),
                                        date: String(new Date()),
                                    },
                                ],
                            })
                        }
                    }
                }


                SetDateEdit("")
                setolddate("")
                setserviceNumberEdit([])
                setEbreadingdetailEdit({});
                setReadingmodeEdit("");
                setReadingFilterEdit("");
                setReadingFilterKVHEdit("");
                setPfdifference("");
                setFutureUpdatedelbefore({ id: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "" })
                setFutureUpdatedelafter({ id: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "" })
                setFutureUpdatedelafterarr([])
                setFutureUpdateBeforearr([])
                setFutureUpdatedelbeforearr([])
                await fetchEbreadingdetails(); fetchFilteredDatas();
                handleCloseModEdit();
                setPopupContent("Updated Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();

            }

            else if (futureupdatedelafterarr.length === 0 || (futureupdatedelafterarr.length > 1 && ebreadingdetailEdit.date == olddate)) {
                let res = await axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${subprojectsid}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    company: String(ebreadingdetailEdit.company),
                    branch: String(ebreadingdetailEdit.branch),
                    unit: String(ebreadingdetailEdit.unit),
                    floor: String(ebreadingdetailEdit.floor),
                    area: String(ebreadingdetailEdit.area),
                    servicenumber: String(ebreadingdetailEdit.servicenumber),
                    readingmode: String(readingmodeEdit),
                    description: String(readingmodeEdit === "Session Closing" ? ebreadingdetailEdit.description : ""),
                    date: String(ebreadingdetailEdit.date),
                    time: String(ebreadingdetailEdit.time),
                    openkwh: String(ebreadingdetailEdit.openkwh),
                    kvah: String(ebreadingdetailEdit.kvah),
                    kwhunit: readingFilterEdit,
                    kvahunit: readingFilterKvhEdit,
                    // pf: String(ebreadingdetailEdit.pf),
                    pf: pfdifference,
                    md: String(ebreadingdetailEdit.md),
                    pfrphase: String(ebreadingdetailEdit.pfrphase),
                    pfyphase: String(ebreadingdetailEdit.pfyphase),
                    pfbphase: String(ebreadingdetailEdit.pfbphase),
                    pfcurrent: String(ebreadingdetailEdit.pfcurrent),
                    pfaverage: String(ebreadingdetailEdit.pfaverage),
                    mdrphase: String(ebreadingdetailEdit.mdrphase),
                    mdbphase: String(ebreadingdetailEdit.mdbphase),
                    mdyphase: String(ebreadingdetailEdit.mdyphase),
                    mdcurrent: String(ebreadingdetailEdit.mdcurrent),
                    mdaverage: String(ebreadingdetailEdit.mdaverage),
                    usageunit: ebservicesEdit,
                    currentusageunit: Number(ebservicesEdit) - Number(readingFilterEdit),
                    currentstatus: statusEdit,
                    updatedby: [
                        ...updateby, {
                            name: String(username),
                            date: String(new Date()),
                        },
                    ],
                });

                if (futureupdatedelafter && futureupdatedelafter?._id) {
                    let futureid = futureupdatedelafter?._id
                    let pfdiffkwh = Number(futureupdatedelafter.openkwh) - Number(ebreadingdetailEdit.openkwh)
                    let pfdiffkvh = Number(futureupdatedelafter.kvah) - Number(ebreadingdetailEdit.kvah)
                    let pfdiff = pfdiffkwh / pfdiffkvh
                    let res = await axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${futureid}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },

                        kwhunit: Number(futureupdatedelafter.openkwh) - Number(ebreadingdetailEdit.openkwh),
                        kvahunit: Number(futureupdatedelafter.kvah) - Number(ebreadingdetailEdit.kvah),
                        pf: pfdiff
                    });

                }

                const [year, month, day] = ebreadingdetailEdit.date.split('-');
                if (readingmodeEdit == "Daily Closing") {
                    const isLastDayOfMonth = day === new Date(year, month, 0).getDate().toString();

                    if (isLastDayOfMonth) {

                        const previousMonth = month === 1 ? 12 : month - 1;
                        const previousYear = month === 1 ? year - 1 : year;

                        // Format the previous month and year as "YYYY-MM"
                        const formattedPreviousMonth = `${previousYear}-${String(previousMonth).padStart(2, '0')}`;
                        // Filter the array to find the record with "Month Closing" for the previous month

                        const servicemasterval = servicemaster.find(item =>
                            item.company === ebreadingdetailEdit.company
                            && item.branch === ebreadingdetailEdit.branch
                            && item.unit === ebreadingdetailEdit.unit
                            && item.floor === ebreadingdetailEdit.floor
                            && item.area.includes(ebreadingdetailEdit.area)
                            && item.servicenumber == ebreadingdetailEdit.servicenumber
                        );
                        const result = ebreadingdetails.find(item =>
                            item.readingmode === "Month Closing"
                            && item.company === ebreadingdetailEdit.company
                            && item.branch === ebreadingdetailEdit.branch
                            && item.unit === ebreadingdetailEdit.unit
                            && item.floor === ebreadingdetailEdit.floor
                            && item.area === ebreadingdetailEdit.area
                            && item.servicenumber === ebreadingdetailEdit.servicenumber
                            && item.date.includes(formattedPreviousMonth)
                        );
                        const resultcheck = ebreadingdetails.find(item =>
                            item.readingmode === "Month Closing"
                            && item.date == ebreadingdetailEdit.date
                        );


                        let lastvalue = result ? result : servicemasterval
                        if (lastvalue && resultcheck) {
                            let res = await axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${resultcheck._id}`, {
                                headers: {
                                    'Authorization': `Bearer ${auth.APIToken}`
                                },
                                company: String(ebreadingdetailEdit.company),
                                branch: String(ebreadingdetailEdit.branch),
                                unit: String(ebreadingdetailEdit.unit),
                                floor: String(ebreadingdetailEdit.floor),
                                area: String(ebreadingdetailEdit.area),
                                servicenumber: String(ebreadingdetailEdit.servicenumber),
                                date: String(ebreadingdetailEdit.date),
                                time: String(ebreadingdetailEdit.time),
                                openkwh: String(ebreadingdetailEdit.openkwh) - Number(lastvalue.openkwh),
                                kvah: String(ebreadingdetailEdit.kvah) - Number(lastvalue.kvah),
                                kwhunit: readingFilterEdit,
                                kvahunit: readingFilterKvhEdit,
                                pf: pfdifference,
                                md: String(ebreadingdetailEdit.md),
                                pfrphase: String(ebreadingdetailEdit.pfrphase),
                                pfyphase: String(ebreadingdetailEdit.pfyphase),
                                pfbphase: String(ebreadingdetailEdit.pfbphase),
                                pfcurrent: String(ebreadingdetailEdit.pfcurrent),
                                pfaverage: String(ebreadingdetailEdit.pfaverage),
                                mdrphase: String(ebreadingdetailEdit.mdrphase),
                                mdbphase: String(ebreadingdetailEdit.mdbphase),
                                mdyphase: String(ebreadingdetailEdit.mdyphase),
                                mdcurrent: String(ebreadingdetailEdit.mdcurrent),
                                mdaverage: String(ebreadingdetailEdit.mdaverage),
                                updatedby: [
                                    ...updateby, {
                                        name: String(username),
                                        date: String(new Date()),
                                    },
                                ],
                            });
                        }
                        else {
                            let diffpf = (Number(ebreadingdetailEdit.openkwh) - Number(lastvalue.openkwh)) / (Number(ebreadingdetailEdit.kvah) - Number(lastvalue.kvah))

                            let subprojectscreate = axios.post(SERVICE.EBREADINGDETAIL_CREATE, {
                                headers: {
                                    'Authorization': `Bearer ${auth.APIToken}`
                                },
                                company: String(ebreadingdetailEdit.company),
                                branch: String(ebreadingdetailEdit.branch),
                                unit: String(ebreadingdetailEdit.unit),
                                floor: String(ebreadingdetailEdit.floor),
                                area: String(ebreadingdetailEdit.area),
                                servicenumber: String(ebreadingdetailEdit.servicenumber),
                                readingmode: String("Month Closing"),
                                description: String(ebreadingdetailEdit.description),
                                date: String(ebreadingdetailEdit.date),
                                time: String(ebreadingdetailEdit.time),
                                openkwh: String(ebreadingdetailEdit.openkwh),
                                kvah: String(ebreadingdetailEdit.kvah),
                                kwhunit: Number(ebreadingdetailEdit.openkwh) - Number(lastvalue.openkwh),
                                kvahunit: Number(ebreadingdetailEdit.kvah) - Number(lastvalue.kvah),
                                pf: diffpf,
                                md: String(ebreadingdetailEdit.md),
                                pfrphase: String(ebreadingdetailEdit.pfrphase),
                                pfyphase: String(ebreadingdetailEdit.pfyphase),
                                pfbphase: String(ebreadingdetailEdit.pfbphase),
                                pfcurrent: String(ebreadingdetailEdit.pfcurrent),
                                pfaverage: String(ebreadingdetailEdit.pfaverage),
                                mdrphase: String(ebreadingdetailEdit.mdrphase),
                                mdbphase: String(ebreadingdetailEdit.mdbphase),
                                mdyphase: String(ebreadingdetailEdit.mdyphase),
                                mdcurrent: String(ebreadingdetailEdit.mdcurrent),
                                mdaverage: String(ebreadingdetailEdit.mdaverage),
                                addedby: [
                                    {
                                        name: String(username),
                                        date: String(new Date()),
                                    },
                                ],
                            })
                        }
                    }
                }



                SetDateEdit("")
                setolddate("")
                setserviceNumberEdit([])
                setEbreadingdetailEdit({});
                setReadingmodeEdit("");
                setReadingFilterEdit("");
                setReadingFilterKVHEdit("");
                setPfdifference("");
                setFutureUpdatedelbefore({ id: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "" })
                setFutureUpdatedelafter({ id: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "" })
                setFutureUpdatedelafterarr([])
                setFutureUpdateBeforearr([])
                setFutureUpdatedelbeforearr([])
                await fetchEbreadingdetails(); fetchFilteredDatas();
                handleCloseModEdit();
                setPopupContent("Updated Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
            }

        }


        catch (err) {

            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }

    const editSubmit = async (e) => {
        setPageName(!pageName)
        e.preventDefault();
        let res_read = await axios.post(SERVICE.EB_SERVICEFILTER, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`
            },
            company: String(ebreadingdetailEdit.company),
            branch: String(ebreadingdetailEdit.branch),
            unit: String(ebreadingdetailEdit.unit),
            floor: String(ebreadingdetailEdit.floor),
            area: String(ebreadingdetailEdit.area),
            id: dateedit,
            time: String(ebreadingdetailEdit.time),
            readingmode: String(readingmodeEdit),
            servicenumber: String(ebreadingdetailEdit.servicenumber),
            date: String(ebreadingdetailEdit.date),
        });

        let checkduplicateDaily;
        let checkduplicateMonth;
        let checkduplicateBill;
        let checkduplicateBillBefore;


        // const isNameMatchDaily = allEbreadingdetailedit.some(item => readingmodeEdit === "Daily Closing"
        //     && item._id != dateedit && item.company === String(ebreadingdetailEdit.company) &&
        //     item.branch === String(ebreadingdetailEdit.branch) &&
        //     item.unit === String(ebreadingdetailEdit.unit) &&
        //     item.servicenumber === String(ebreadingdetailEdit.servicenumber) &&
        //     item.floor === String(ebreadingdetailEdit.floor) &&
        //     item.area === String(ebreadingdetailEdit.area) &&
        //     item.readingmode === "Daily Closing" &&
        //     item.date === ebreadingdetailEdit.date
        // );

        // const isNameMatchMonth = allEbreadingdetailedit.some(item => {
        //     const [year, month, day] = ebreadingdetailEdit.date.split('-');
        //     const [oldyear, oldmonth, oldday] = item.date.split('-');

        //     return readingmodeEdit === "Month Closing" && item.readingmode === "Month Closing" &&
        //         item._id != dateedit &&
        //         item.company === String(ebreadingdetailEdit.company) &&
        //         item.branch === String(ebreadingdetailEdit.branch) &&
        //         item.unit === String(ebreadingdetailEdit.unit) &&
        //         item.servicenumber === String(ebreadingdetailEdit.servicenumber) &&
        //         item.floor === String(ebreadingdetailEdit.floor) &&
        //         item.area === String(ebreadingdetailEdit.area)
        //         && month === oldmonth && year === oldyear;
        // });

        // const isNameMatchBill = allEbreadingdetailedit.some(item => {
        //     const [year, month, day] = ebreadingdetailEdit.date.split('-');
        //     const [oldyear, oldmonth, oldday] = item.date.split('-');

        //     return readingmodeEdit === "Bill Closing" && item.readingmode === "Bill Closing"
        //         && item._id != dateedit
        //         && item.company === String(ebreadingdetailEdit.company) &&
        //         item.branch === String(ebreadingdetailEdit.branch) &&
        //         item.unit === String(ebreadingdetailEdit.unit) &&
        //         item.servicenumber === String(ebreadingdetailEdit.servicenumber) &&
        //         item.floor === String(ebreadingdetailEdit.floor) &&
        //         item.area === String(ebreadingdetailEdit.area)
        //         && month == oldmonth && year == oldyear;
        // });
        // const isNameMatchBillbefore = allEbreadingdetailedit.some(item => {

        //     return readingmodeEdit === "Bill Closing"
        //         && item.readingmode === "Bill Closing"
        //         && item._id != dateedit
        //         && item.company === String(ebreadingdetailEdit.company) &&
        //         item.branch === String(ebreadingdetailEdit.branch) &&
        //         item.unit === String(ebreadingdetailEdit.unit) &&
        //         item.servicenumber === String(ebreadingdetailEdit.servicenumber) &&
        //         item.floor === String(ebreadingdetailEdit.floor) &&
        //         item.area === String(ebreadingdetailEdit.area)
        //         &&
        //         item.date < ebreadingdetailEdit.date;


        // });





        if (readingmodeEdit == "Daily Closing") {
            try {
                checkduplicateDaily = await axios.post(SERVICE.CHECK_DUPE_DAILY_EB_EDIT, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    id: ebreadingdetailEdit._id,
                    readingmode: String(readingmodeEdit),
                    company: String(ebreadingdetailEdit.company),
                    branch: String(ebreadingdetailEdit.branch),
                    unit: String(ebreadingdetailEdit.unit),
                    servicenumber: String(ebreadingdetailEdit.servicenumber),
                    floor: String(ebreadingdetailEdit.floor),
                    area: String(ebreadingdetailEdit.area),
                    date: ebreadingdetailEdit.date
                })
            } catch (err) {
                console.log(err, "eroror")
            }
        }
        // console.log(checkduplicateDaily, "checkduplicateDaily")


        if (readingmodeEdit == "Month Closing") {
            try {
                checkduplicateMonth = await axios.post(SERVICE.CHECK_DUPE_MONTH_EB_EDIT, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    id: ebreadingdetailEdit._id,
                    readingmode: String(readingmodeEdit),
                    company: String(ebreadingdetailEdit.company),
                    branch: String(ebreadingdetailEdit.branch),
                    unit: String(ebreadingdetailEdit.unit),
                    servicenumber: String(ebreadingdetailEdit.servicenumber),
                    floor: String(ebreadingdetailEdit.floor),
                    area: String(ebreadingdetailEdit.area),
                    date: ebreadingdetailEdit.date
                })
            } catch (err) {
                console.log(err, "eroror")
            }
        }


        if (readingmodeEdit == "Bill Closing") {
            try {
                checkduplicateBill = await axios.post(SERVICE.CHECK_DUPE_BILL_EB_EDIT, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    id: ebreadingdetailEdit._id,
                    readingmode: String(readingmodeEdit),
                    company: String(ebreadingdetailEdit.company),
                    branch: String(ebreadingdetailEdit.branch),
                    unit: String(ebreadingdetailEdit.unit),
                    servicenumber: String(ebreadingdetailEdit.servicenumber),
                    floor: String(ebreadingdetailEdit.floor),
                    area: String(ebreadingdetailEdit.area),
                    date: ebreadingdetailEdit.date
                })

                checkduplicateBillBefore = await axios.post(SERVICE.CHECK_DUPE_BILL_BEFORE_EB_EDIT, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    id: ebreadingdetailEdit._id,
                    readingmode: String(readingmodeEdit),
                    company: String(ebreadingdetailEdit.company),
                    branch: String(ebreadingdetailEdit.branch),
                    unit: String(ebreadingdetailEdit.unit),
                    servicenumber: String(ebreadingdetailEdit.servicenumber),
                    floor: String(ebreadingdetailEdit.floor),
                    area: String(ebreadingdetailEdit.area),
                    date: ebreadingdetailEdit.date
                })
            } catch (err) {
                console.log(err, "eroror")
            }
        }



        const isNameMatchDaily = checkduplicateDaily ? checkduplicateDaily.data.ebreadingdetails : 0


        const isNameMatchMonth = checkduplicateMonth ? checkduplicateMonth.data.ebreadingdetails : 0
        const isNameMatchBill = checkduplicateBill ? checkduplicateBill.data.ebreadingdetails : 0
        const isNameMatchBillbefore = checkduplicateBillBefore ? checkduplicateBillBefore.data.ebreadingdetails : 0


        let resstatus = await axios.post(SERVICE.EBREADING_DETAILS_SERVICE_STATUS, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`
            },
            servicenumber: String(ebreadingdetailEdit.servicenumber),
            startdate: String(ebreadingdetailEdit.date),
            enddate: String(ebreadingdetailEdit.date),
        })
        let servicestatus = resstatus.data.ebreadingdetails



        if (ebreadingdetailEdit.company === "Please Select Company") {
            setPopupContentMalert(`Please Select Company`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (ebreadingdetailEdit.branch === "Please Select Branch") {
            setPopupContentMalert(`Please Select Branch`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (ebreadingdetailEdit.unit === "Please Select Unit") {
            setPopupContentMalert(`Please Select Unit`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (ebreadingdetailEdit.servicenumber === "Please Select Service") {
            setPopupContentMalert(`Please Select Service`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (ebreadingdetailEdit.floor === "Please Select Floor") {
            setPopupContentMalert(`Please Select Floor`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (servicestatus > 0) {
            setPopupContentMalert("This Service Number Not in Use!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (ebreadingdetailEdit.date === "") {
            setPopupContentMalert("Please Select Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (checkServicemasterBeforeDate == 0) {
            setPopupContentMalert(`Please Create Before ${ebreadingdetailEdit.date} of Service Master!`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (ebreadingdetailEdit.openkwh === "") {
            setPopupContentMalert(`Please Enter KWH Reading`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (ebreadingdetailEdit.kvah === "") {
            setPopupContentMalert(`Please Enter KVAH Reading`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (readingFilterEdit < 0) {
            setPopupContentMalert(`Please Enter Correct KWH Reading`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (readingFilterKvhEdit < 0) {
            setPopupContentMalert(`Please Enter Correct KVAH`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isNameMatchDaily > 0) {
            setPopupContentMalert(`Daily  Closing Already Added For This Date`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isNameMatchBill > 0) {
            setPopupContentMalert(`Bill  Closing Already Added For This Month`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatchBillbefore > 0) {
            setPopupContentMalert(`Bill Closing Should Add Only After Month`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatchMonth > 0) {
            setPopupContentMalert(`Month Closing Already Added For This Month`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        // else if (res_read?.data?.ebreadingfiltertimefuture.length > 1) {
        //     setPopupContentMalert(
        //         `You have Already Added two more dates after this Date12 ${ebreadingdetailEdit.date}`
        //     );
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }
        // else if (res_read?.data?.ebreadingfiltertimefuture.length > 1 && ebreadingdetailEdit.date !== olddate) {

        //     setPopupContentMalert(
        //         `You have Already Added two more dates after this Date ${ebreadingdetailEdit.date}`
        //     );
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();


        // }

        else if (res_read?.data?.ebreadingfiltertimefuture.length > 0 && Number(ebreadingdetailEdit.openkwh) > res_read?.data?.ebreadingfiltertimefuture[0]?.openkwh) {

            setPopupContentMalert(`Please Enter KWH Value Less Than This ${res_read?.data?.ebreadingfiltertimefuture[0]?.date} KWH Value (${res_read?.data?.ebreadingfiltertimefuture[0]?.openkwh})`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (res_read?.data?.ebreadingfiltertimefuture.length > 0 && Number(ebreadingdetailEdit.kvah) > res_read?.data?.ebreadingfiltertimefuture[0]?.kvah) {

            setPopupContentMalert(`Please Enter KVAH Value Less Than This ${res_read?.data?.ebreadingfiltertimefuture[0]?.date} KVAH Value (${res_read?.data?.ebreadingfiltertimefuture[0]?.kvah})`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else {
            sendEditRequest();
        }
    };


    //get all Sub vendormasters.
    const fetchEbreadingdetails = async () => {
        try {
            let res_vendor = await axios.post(SERVICE.EBREADINGDETAIL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignbranch: accessbranch,
            });
            setEbreadingdetails(res_vendor?.data?.ebreadingdetails.reverse());
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }

    const fetchEbreadingdetailsFilterDateEdit = async (date) => {
        let varfilter = []
        try {

            let res_read = await axios.post(SERVICE.EB_SERVICEFILTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                company: String(ebreadingdetailEdit.company),
                branch: String(ebreadingdetailEdit.branch),
                unit: String(ebreadingdetailEdit.unit),
                floor: String(ebreadingdetailEdit.floor),
                area: String(ebreadingdetailEdit.area),
                id: dateedit,
                time: String(ebreadingdetailEdit.time),
                readingmode: String(readingmodeEdit),
                servicenumber: String(ebreadingdetailEdit.servicenumber),
                date: String(date),

            });

            varfilter = res_read?.data?.ebreadingfiltertime
            const openEntries = varfilter.filter(item => item.readingmode === "Open Entry");
            const ReadingEntries = varfilter.filter(item => item.readingmode !== "Open Entry");
            let mostRecentDate = { openkwh: 0, kvah: 0 }
            let mostRecentDatereading = { openkwh: 0, kvah: 0 }
            setcheckServicemasterBeforeDate(varfilter.length)
            if (res_read?.data?.ebreadingfiltertime.length > 0) {

                let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
                console.log(logbeforecreated, "logbeforecreated")

                if (logbeforecreated) {
                    if (ReadingEntries.length > 0) {
                        mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                            current : prev));
                    }
                    if (openEntries.length > 0) {
                        mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                    }

                    if (ReadingEntries.length > 0 && openEntries.length > 0) {

                        if ((mostRecentDate.date) == (date)) {
                            mostRecentDate = mostRecentDate
                        } else if (new Date(mostRecentDate.date) < new Date(date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
                            mostRecentDate = mostRecentDate
                        }
                        else if (new Date(mostRecentDate.date) < new Date(date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
                            mostRecentDate = mostRecentDate
                        }
                        else {
                            mostRecentDate = mostRecentDatereading
                        }
                    }
                    else if (ReadingEntries.length > 0) {
                        mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                        if (mostRecentDatereading.date == date) {
                            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                current : prev));
                            mostRecentDate = mostRecentDatereading
                        } else {
                            mostRecentDate = mostRecentDatereading
                        }
                    } else {
                        mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                        mostRecentDate = mostRecentDate
                    }

                }
                else {
                    let serviceold = res_read?.data?.ebreadingfiltertimeold
                    let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
                    console.log(varfilter, serviceold, "varfilter")
                    if (serviceold?.length > 0) {
                        serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
                            current : prev));
                    }
                    if (ReadingEntries.length > 0) {
                        if (readingmodeEdit == "Session Closing") {
                            console.log("popo")
                            mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                current : prev));
                        } else {

                            mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                current : prev));

                            const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                                !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
                            )
                            console.log(withoutlogoldentry, "withoutlogoldentry")

                            if (withoutlogoldentry.length > 0) {
                                mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                    current : prev));
                            } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                                mostRecentDate = serviceoldRecentDate
                            } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                                mostRecentDate = serviceoldRecentDate
                            } else {
                                mostRecentDate = mostRecentDate
                            }

                        }
                    }



                    // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

                    // console.log(checkIslogoldentry, "checkIslogoldentry")

                    // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
                    //   mostRecentDate = serviceoldRecentDate
                    // }


                }



                let differecnce = Number(ebreadingdetailEdit.openkwh) - Number(mostRecentDate.openkwh)
                setReadingFilterEdit(differecnce)
                if (readingFilterKvhEdit > 0 && differecnce > 0) {
                    setPfdifference(differecnce / readingFilterKvhEdit)
                }
            }
            if (res_read?.data?.ebreadingfiltertime.length > 0) {
                let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
                console.log(logbeforecreated, "logbeforecreated")

                if (logbeforecreated) {
                    if (ReadingEntries.length > 0) {
                        mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                            current : prev));
                    }
                    if (openEntries.length > 0) {
                        mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                    }

                    if (ReadingEntries.length > 0 && openEntries.length > 0) {

                        if ((mostRecentDate.date) == (date)) {
                            mostRecentDate = mostRecentDate
                        } else if (new Date(mostRecentDate.date) < new Date(date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
                            mostRecentDate = mostRecentDate
                        }
                        else if (new Date(mostRecentDate.date) < new Date(date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
                            mostRecentDate = mostRecentDate
                        }
                        else {
                            mostRecentDate = mostRecentDatereading
                        }
                    }
                    else if (ReadingEntries.length > 0) {
                        mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                        if (mostRecentDatereading.date == date) {
                            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                current : prev));
                            mostRecentDate = mostRecentDatereading
                        } else {
                            mostRecentDate = mostRecentDatereading
                        }
                    } else {
                        mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                        mostRecentDate = mostRecentDate
                    }

                }
                else {
                    let serviceold = res_read?.data?.ebreadingfiltertimeold
                    let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
                    console.log(varfilter, serviceold, "varfilter")
                    if (serviceold?.length > 0) {
                        serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
                            current : prev));
                    }
                    if (ReadingEntries.length > 0) {
                        if (readingmodeEdit == "Session Closing") {
                            console.log("popo")
                            mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                current : prev));
                        } else {

                            mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                current : prev));

                            const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                                !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
                            )
                            console.log(withoutlogoldentry, "withoutlogoldentry")

                            if (withoutlogoldentry.length > 0) {
                                mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                    current : prev));
                            } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                                mostRecentDate = serviceoldRecentDate
                            } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                                mostRecentDate = serviceoldRecentDate
                            } else {
                                mostRecentDate = mostRecentDate
                            }

                        }
                    }



                    // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

                    // console.log(checkIslogoldentry, "checkIslogoldentry")

                    // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
                    //   mostRecentDate = serviceoldRecentDate
                    // }


                }



                if (ebreadingdetailEdit.kvah > 0 && mostRecentDate.kvah > 0) {

                    let differecnce = Number(ebreadingdetailEdit.kvah) - Number(mostRecentDate.kvah)
                    setReadingFilterKVHEdit(differecnce)
                }
            }
            if (res_read?.data?.ebreadingfiltertimefuture.length > 0) {
                setFutureUpdatedelafter(res_read?.data?.ebreadingfiltertimefuture[0])
                setFutureUpdatedelafterarr(res_read?.data?.ebreadingfiltertimefuture)
            }
            if (res_read?.data?.ebreadingfilterprevious) {
                setFutureUpdatedelbefore(res_read?.data?.ebreadingfilterprevious[0])
            }
            if (res_read?.data?.ebreadingfiltertime && res_read?.data?.ebreadingfiltertime.length > 0) {

                setFutureUpdateBeforearr(res_read?.data?.ebreadingfiltertime);
            }
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }

    const debounceeb = (func, delay) => {
        let timoutId;
        return (...args) => {
            clearTimeout(timoutId);
            timoutId = setTimeout(() => {
                func(...args);

            }, delay)
        };
    };

    // Debounced version of the fetch function
    const debouncedFetchEbreadingdetails = useCallback(
        debounceeb((date) => {
            fetchEbreadingdetailsFilterDateEdit(date);
        }, 500), // Adjust the delay as needed
        []
    );

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setEbreadingdetailEdit(prevState => ({
            ...prevState, // Retain the existing properties
            date: selectedDate // Update only the date property
        }));

        debouncedFetchEbreadingdetails(selectedDate);
    };


    const fetchEbreadingdetailsFilterTimeEdit = async (date) => {
        let varfilter = []
        try {
            let res_read = await axios.post(SERVICE.EB_SERVICEFILTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                company: String(ebreadingdetailEdit.company),
                branch: String(ebreadingdetailEdit.branch),
                unit: String(ebreadingdetailEdit.unit),
                floor: String(ebreadingdetailEdit.floor),
                area: String(ebreadingdetailEdit.area),
                id: dateedit,
                time: String(date),
                readingmode: String(readingmodeEdit),
                servicenumber: String(ebreadingdetailEdit.servicenumber),
                date: String(ebreadingdetailEdit.date),
            });
            varfilter = res_read?.data?.ebreadingfiltertime
            const openEntries = varfilter.filter(item => item.readingmode === "Open Entry");
            const ReadingEntries = varfilter.filter(item => item.readingmode !== "Open Entry");
            let mostRecentDate = { openkwh: 0, kvah: 0 }
            let mostRecentDatereading = { openkwh: 0, kvah: 0 }
            setcheckServicemasterBeforeDate(varfilter.length)
            if (res_read?.data?.ebreadingfiltertime.length > 0) {
                let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
                console.log(logbeforecreated, "logbeforecreated")

                if (logbeforecreated) {
                    if (ReadingEntries.length > 0) {
                        mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                            current : prev));
                    }
                    if (openEntries.length > 0) {
                        mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                    }

                    if (ReadingEntries.length > 0 && openEntries.length > 0) {

                        if ((mostRecentDate.date) == (date)) {
                            mostRecentDate = mostRecentDate
                        } else if (new Date(mostRecentDate.date) < new Date(ebreadingdetailEdit.date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
                            mostRecentDate = mostRecentDate
                        }
                        else if (new Date(mostRecentDate.date) < new Date(ebreadingdetailEdit.date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
                            mostRecentDate = mostRecentDate
                        }
                        else {
                            mostRecentDate = mostRecentDatereading
                        }
                    }
                    else if (ReadingEntries.length > 0) {
                        mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                        if (mostRecentDatereading.date == date) {
                            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                current : prev));
                            mostRecentDate = mostRecentDatereading
                        } else {
                            mostRecentDate = mostRecentDatereading
                        }
                    } else {
                        mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                        mostRecentDate = mostRecentDate
                    }

                }
                else {
                    let serviceold = res_read?.data?.ebreadingfiltertimeold
                    let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
                    console.log(varfilter, serviceold, "varfilter")
                    if (serviceold?.length > 0) {
                        serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
                            current : prev));
                    }
                    if (ReadingEntries.length > 0) {
                        if (readingmodeEdit == "Session Closing") {
                            console.log("popo")
                            mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                current : prev));
                        } else {

                            mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                current : prev));

                            const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                                !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
                            )
                            console.log(withoutlogoldentry, "withoutlogoldentry")

                            if (withoutlogoldentry.length > 0) {
                                mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                    current : prev));
                            } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                                mostRecentDate = serviceoldRecentDate
                            } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                                mostRecentDate = serviceoldRecentDate
                            } else {
                                mostRecentDate = mostRecentDate
                            }

                        }
                    }



                    // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

                    // console.log(checkIslogoldentry, "checkIslogoldentry")

                    // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
                    //   mostRecentDate = serviceoldRecentDate
                    // }


                }


                let differecnce = Number(ebreadingdetailEdit.openkwh) - Number(mostRecentDate.openkwh)
                setReadingFilterEdit(differecnce)
                if (readingFilterKvhEdit > 0 && differecnce > 0) {
                    setPfdifference(differecnce / readingFilterKvhEdit)
                }
            }
            if (res_read?.data?.ebreadingfiltertime.length > 0) {

                let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
                console.log(logbeforecreated, "logbeforecreated")

                if (logbeforecreated) {
                    if (ReadingEntries.length > 0) {
                        mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                            current : prev));
                    }
                    if (openEntries.length > 0) {
                        mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                    }

                    if (ReadingEntries.length > 0 && openEntries.length > 0) {

                        if ((mostRecentDate.date) == (date)) {
                            mostRecentDate = mostRecentDate
                        } else if (new Date(mostRecentDate.date) < new Date(ebreadingdetailEdit.date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
                            mostRecentDate = mostRecentDate
                        }
                        else if (new Date(mostRecentDate.date) < new Date(ebreadingdetailEdit.date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
                            mostRecentDate = mostRecentDate
                        }
                        else {
                            mostRecentDate = mostRecentDatereading
                        }
                    }
                    else if (ReadingEntries.length > 0) {
                        mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                        if (mostRecentDatereading.date == date) {
                            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                current : prev));
                            mostRecentDate = mostRecentDatereading
                        } else {
                            mostRecentDate = mostRecentDatereading
                        }
                    } else {
                        mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                        mostRecentDate = mostRecentDate
                    }

                }
                else {
                    let serviceold = res_read?.data?.ebreadingfiltertimeold
                    let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
                    console.log(varfilter, serviceold, "varfilter")
                    if (serviceold?.length > 0) {
                        serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
                            current : prev));
                    }
                    if (ReadingEntries.length > 0) {
                        if (readingmodeEdit == "Session Closing") {
                            console.log("popo")
                            mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                current : prev));
                        } else {

                            mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                current : prev));

                            const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                                !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
                            )
                            console.log(withoutlogoldentry, "withoutlogoldentry")

                            if (withoutlogoldentry.length > 0) {
                                mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                    current : prev));
                            } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                                mostRecentDate = serviceoldRecentDate
                            } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                                mostRecentDate = serviceoldRecentDate
                            } else {
                                mostRecentDate = mostRecentDate
                            }

                        }
                    }



                    // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

                    // console.log(checkIslogoldentry, "checkIslogoldentry")

                    // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
                    //   mostRecentDate = serviceoldRecentDate
                    // }


                }


                if (ebreadingdetailEdit.kvah > 0 && mostRecentDate.kvah > 0) {

                    let differecnce = Number(ebreadingdetailEdit.kvah) - Number(mostRecentDate.kvah)
                    setReadingFilterKVHEdit(differecnce)
                }
            }
            if (res_read?.data?.ebreadingfiltertimefuture.length > 0) {
                setFutureUpdatedelafter(res_read?.data?.ebreadingfiltertimefuture[0])
                setFutureUpdatedelafterarr(res_read?.data?.ebreadingfiltertimefuture)
            }

            if (res_read?.data?.ebreadingfilterprevious) {
                setFutureUpdatedelbefore(res_read?.data?.ebreadingfilterprevious[0])
                setFutureUpdateBeforearr(res_read?.data?.ebreadingfilterprevious)
            }


        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }




    const fetchEbreadingdetailsFilterReadingEdit = async (val) => {
        let varfilter = []
        try {
            let res_read = await axios.post(SERVICE.EB_SERVICEFILTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                company: String(ebreadingdetailEdit.company),
                branch: String(ebreadingdetailEdit.branch),
                unit: String(ebreadingdetailEdit.unit),
                floor: String(ebreadingdetailEdit.floor),
                area: String(ebreadingdetailEdit.area),
                id: dateedit,
                time: String(ebreadingdetailEdit.time),
                readingmode: String(val),
                servicenumber: String(ebreadingdetailEdit.servicenumber),
                date: String(ebreadingdetailEdit.date),
            });
            varfilter = res_read?.data?.ebreadingfiltertime
            const openEntries = varfilter.filter(item => item.readingmode === "Open Entry");
            const ReadingEntries = varfilter.filter(item => item.readingmode !== "Open Entry");

            // const mostRecentDate = varfilter.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ? current : prev));
            let mostRecentDate = { openkwh: 0, kvah: 0 }
            let mostRecentDatereading = { openkwh: 0, kvah: 0 }
            setcheckServicemasterBeforeDate(varfilter.length)
            if (res_read?.data?.ebreadingfiltertime.length > 0) {
                // const mostRecentDate = varfilter.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ? current : prev));

                let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
                console.log(logbeforecreated, "logbeforecreated")

                if (logbeforecreated) {
                    if (ReadingEntries.length > 0) {
                        mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                            current : prev));
                    }
                    if (openEntries.length > 0) {
                        mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                    }

                    if (ReadingEntries.length > 0 && openEntries.length > 0) {

                        if ((mostRecentDate.date) == (ebreadingdetailEdit.date)) {
                            mostRecentDate = mostRecentDate
                        } else if (new Date(mostRecentDate.date) < new Date(ebreadingdetailEdit.date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
                            mostRecentDate = mostRecentDate
                        }
                        else if (new Date(mostRecentDate.date) < new Date(ebreadingdetailEdit.date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
                            mostRecentDate = mostRecentDate
                        }
                        else {
                            mostRecentDate = mostRecentDatereading
                        }
                    }
                    else if (ReadingEntries.length > 0) {
                        mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                        if (mostRecentDatereading.date == ebreadingdetailEdit.date) {
                            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                current : prev));
                            mostRecentDate = mostRecentDatereading
                        } else {
                            mostRecentDate = mostRecentDatereading
                        }
                    } else {
                        mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                        mostRecentDate = mostRecentDate
                    }

                }
                else {
                    let serviceold = res_read?.data?.ebreadingfiltertimeold
                    let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
                    console.log(varfilter, serviceold, "varfilter")
                    if (serviceold?.length > 0) {
                        serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
                            current : prev));
                    }
                    if (ReadingEntries.length > 0) {
                        if (readingmodeEdit == "Session Closing") {
                            console.log("popo")
                            mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                current : prev));
                        } else {

                            mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                current : prev));

                            const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                                !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
                            )
                            console.log(withoutlogoldentry, "withoutlogoldentry")

                            if (withoutlogoldentry.length > 0) {
                                mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                    current : prev));
                            } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                                mostRecentDate = serviceoldRecentDate
                            } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                                mostRecentDate = serviceoldRecentDate
                            } else {
                                mostRecentDate = mostRecentDate
                            }

                        }
                    }



                    // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

                    // console.log(checkIslogoldentry, "checkIslogoldentry")

                    // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
                    //   mostRecentDate = serviceoldRecentDate
                    // }


                }

                let differecnce = Number(ebreadingdetailEdit.openkwh) - Number(mostRecentDate.openkwh)
                setReadingFilterEdit(differecnce)
                if (readingFilterKvhEdit > 0 && differecnce > 0) {
                    setPfdifference(differecnce / readingFilterKvhEdit)
                }
            }
            if (res_read?.data?.ebreadingfiltertime.length > 0) {
                let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
                console.log(logbeforecreated, "logbeforecreated")

                if (logbeforecreated) {
                    if (ReadingEntries.length > 0) {
                        mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                            current : prev));
                    }
                    if (openEntries.length > 0) {
                        mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                    }

                    if (ReadingEntries.length > 0 && openEntries.length > 0) {

                        if ((mostRecentDate.date) == (ebreadingdetailEdit.date)) {
                            mostRecentDate = mostRecentDate
                        } else if (new Date(mostRecentDate.date) < new Date(ebreadingdetailEdit.date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
                            mostRecentDate = mostRecentDate
                        }
                        else if (new Date(mostRecentDate.date) < new Date(ebreadingdetailEdit.date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
                            mostRecentDate = mostRecentDate
                        }
                        else {
                            mostRecentDate = mostRecentDatereading
                        }
                    }
                    else if (ReadingEntries.length > 0) {
                        mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                        if (mostRecentDatereading.date == ebreadingdetailEdit.date) {
                            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                current : prev));
                            mostRecentDate = mostRecentDatereading
                        } else {
                            mostRecentDate = mostRecentDatereading
                        }
                    } else {
                        mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                        mostRecentDate = mostRecentDate
                    }

                }
                else {
                    let serviceold = res_read?.data?.ebreadingfiltertimeold
                    let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
                    console.log(varfilter, serviceold, "varfilter")
                    if (serviceold?.length > 0) {
                        serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
                            current : prev));
                    }
                    if (ReadingEntries.length > 0) {
                        if (readingmodeEdit == "Session Closing") {
                            console.log("popo")
                            mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                current : prev));
                        } else {

                            mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                current : prev));

                            const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                                !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
                            )
                            console.log(withoutlogoldentry, "withoutlogoldentry")

                            if (withoutlogoldentry.length > 0) {
                                mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                    current : prev));
                            } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                                mostRecentDate = serviceoldRecentDate
                            } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                                mostRecentDate = serviceoldRecentDate
                            } else {
                                mostRecentDate = mostRecentDate
                            }

                        }
                    }



                    // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

                    // console.log(checkIslogoldentry, "checkIslogoldentry")

                    // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
                    //   mostRecentDate = serviceoldRecentDate
                    // }


                }
                if (ebreadingdetailEdit.kvah > 0 && mostRecentDate.kvah > 0) {

                    let differecnce = Number(ebreadingdetailEdit.kvah) - Number(mostRecentDate.kvah)
                    setReadingFilterKVHEdit(differecnce)
                }
            }
            if (res_read?.data?.ebreadingfiltertimefuture.length > 0) {
                setFutureUpdatedelafter(res_read?.data?.ebreadingfiltertimefuture[0])
                setFutureUpdatedelafterarr(res_read?.data?.ebreadingfiltertimefuture)
            }
            if (res_read?.data?.ebreadingfilterprevious) {
                setFutureUpdatedelbefore(res_read?.data?.ebreadingfilterprevious[0]);
            }
            if (res_read?.data?.ebreadingfiltertime && res_read?.data?.ebreadingfiltertime.length > 0) {
                setFutureUpdate(res_read?.data?.ebreadingfiltertime[0]);
                setFutureUpdateBeforearr(res_read?.data?.ebreadingfiltertime);
            }

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }





    const fetchEbreadingdetailsFilterEdit = async (kwhval) => {
        let varfilter = []
        try {
            let res_read = await axios.post(SERVICE.EB_SERVICEFILTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                company: String(ebreadingdetailEdit.company),
                branch: String(ebreadingdetailEdit.branch),
                unit: String(ebreadingdetailEdit.unit),
                floor: String(ebreadingdetailEdit.floor),
                area: String(ebreadingdetailEdit.area),
                servicenumber: String(ebreadingdetailEdit.servicenumber),
                date: String(ebreadingdetailEdit.date),
                time: String(ebreadingdetailEdit.time),
                readingmode: String(readingmodeEdit),
                id: dateedit

            });

            varfilter = res_read?.data?.ebreadingfiltertime
            setcheckServicemasterBeforeDate(varfilter.length)
            // const mostRecentDate = varfilter.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ? current : prev));
            const openEntries = varfilter.filter(item => item.readingmode === "Open Entry");
            const ReadingEntries = varfilter.filter(item => item.readingmode !== "Open Entry");

            // const mostRecentDate = varfilter.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ? current : prev));
            let mostRecentDate = { openkwh: 0, kvah: 0 }
            let mostRecentDatereading = { openkwh: 0, kvah: 0 }

            if (res_read?.data?.ebreadingfiltertimefuture.length > 0) {
                setFutureUpdatedelafter(res_read?.data?.ebreadingfiltertimefuture[0])
                setFutureUpdatedelafterarr(res_read?.data?.ebreadingfiltertimefuture);

                if (Number(kwhval) > res_read?.data?.ebreadingfiltertimefuture[0]?.openkwh) {
                    const mostRecentDate = varfilter.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ? current : prev));

                    let differecnce = Number(kwhval) - Number(mostRecentDate.openkwh)
                    setReadingFilterEdit(differecnce)
                    if (readingFilterKvhEdit > 0 && differecnce > 0) {
                        setPfdifference(differecnce / readingFilterKvhEdit)
                    }
                    // setPopupContentMalert(`Please Enter KWH Reading Less Than This ${res_read?.data?.ebreadingfiltertimefuture[0].date}`);
                    setPopupContentMalert(`Please Enter KWH Value Less Than This ${res_read?.data?.ebreadingfiltertimefuture[0]?.date} KWH Value (${res_read?.data?.ebreadingfiltertimefuture[0]?.openkwh})`);

                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                } else if (res_read?.data?.ebreadingfiltertime.length > 0) {


                    let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
                    console.log(logbeforecreated, "logbeforecreated")

                    if (logbeforecreated) {
                        if (ReadingEntries.length > 0) {
                            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                current : prev));
                        }
                        if (openEntries.length > 0) {
                            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                current : prev));
                        }

                        if (ReadingEntries.length > 0 && openEntries.length > 0) {

                            if ((mostRecentDate.date) == (ebreadingdetailEdit.date)) {
                                mostRecentDate = mostRecentDate
                            } else if (new Date(mostRecentDate.date) < new Date(ebreadingdetailEdit.date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
                                mostRecentDate = mostRecentDate
                            }
                            else if (new Date(mostRecentDate.date) < new Date(ebreadingdetailEdit.date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
                                mostRecentDate = mostRecentDate
                            }
                            else {
                                mostRecentDate = mostRecentDatereading
                            }
                        }
                        else if (ReadingEntries.length > 0) {
                            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                current : prev));
                            if (mostRecentDatereading.date == ebreadingdetailEdit.date) {
                                mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                    current : prev));
                                mostRecentDate = mostRecentDatereading
                            } else {
                                mostRecentDate = mostRecentDatereading
                            }
                        } else {
                            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                current : prev));
                            mostRecentDate = mostRecentDate
                        }

                    }
                    else {
                        let serviceold = res_read?.data?.ebreadingfiltertimeold
                        let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
                        console.log(varfilter, serviceold, "varfilter")
                        if (serviceold?.length > 0) {
                            serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
                                current : prev));
                        }
                        if (ReadingEntries.length > 0) {
                            if (readingmodeEdit == "Session Closing") {
                                console.log("popo")
                                mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                    current : prev));
                            } else {

                                mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                    current : prev));

                                const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                                    !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
                                )
                                console.log(withoutlogoldentry, "withoutlogoldentry")

                                if (withoutlogoldentry.length > 0) {
                                    mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                        current : prev));
                                } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                                    mostRecentDate = serviceoldRecentDate
                                } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                                    mostRecentDate = serviceoldRecentDate
                                } else {
                                    mostRecentDate = mostRecentDate
                                }

                            }
                        }



                        // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

                        // console.log(checkIslogoldentry, "checkIslogoldentry")

                        // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
                        //   mostRecentDate = serviceoldRecentDate
                        // }


                    }


                    let differecnce = Number(kwhval) - Number(mostRecentDate.openkwh)
                    setReadingFilterEdit(differecnce)
                    if (readingFilterKvhEdit > 0 && differecnce > 0) {
                        setPfdifference(differecnce / readingFilterKvhEdit)
                    }

                }

            } else if (res_read?.data?.ebreadingfiltertime.length > 0) {
                let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
                console.log(logbeforecreated, "logbeforecreated")

                if (logbeforecreated) {
                    if (ReadingEntries.length > 0) {
                        mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                            current : prev));
                    }
                    if (openEntries.length > 0) {
                        mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                    }

                    if (ReadingEntries.length > 0 && openEntries.length > 0) {

                        if ((mostRecentDate.date) == (ebreadingdetailEdit.date)) {
                            mostRecentDate = mostRecentDate
                        } else if (new Date(mostRecentDate.date) < new Date(ebreadingdetailEdit.date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
                            mostRecentDate = mostRecentDate
                        }
                        else if (new Date(mostRecentDate.date) < new Date(ebreadingdetailEdit.date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
                            mostRecentDate = mostRecentDate
                        }
                        else {
                            mostRecentDate = mostRecentDatereading
                        }
                    }
                    else if (ReadingEntries.length > 0) {
                        mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                        if (mostRecentDatereading.date == ebreadingdetailEdit.date) {
                            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                current : prev));
                            mostRecentDate = mostRecentDatereading
                        } else {
                            mostRecentDate = mostRecentDatereading
                        }
                    } else {
                        mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                        mostRecentDate = mostRecentDate
                    }

                }
                else {
                    let serviceold = res_read?.data?.ebreadingfiltertimeold
                    let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
                    console.log(varfilter, serviceold, "varfilter")
                    if (serviceold?.length > 0) {
                        serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
                            current : prev));
                    }
                    if (ReadingEntries.length > 0) {
                        if (readingmodeEdit == "Session Closing") {
                            console.log("popo")
                            mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                current : prev));
                        } else {

                            mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                current : prev));

                            const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                                !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
                            )
                            console.log(withoutlogoldentry, "withoutlogoldentry")

                            if (withoutlogoldentry.length > 0) {
                                mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                    current : prev));
                            } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                                mostRecentDate = serviceoldRecentDate
                            } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                                mostRecentDate = serviceoldRecentDate
                            } else {
                                mostRecentDate = mostRecentDate
                            }

                        }
                    }



                    // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

                    // console.log(checkIslogoldentry, "checkIslogoldentry")

                    // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
                    //   mostRecentDate = serviceoldRecentDate
                    // }


                }
                let differecnce = Number(kwhval) - Number(mostRecentDate.openkwh)
                setReadingFilterEdit(differecnce)
                if (readingFilterKvhEdit > 0 && differecnce > 0) {
                    setPfdifference(differecnce / readingFilterKvhEdit)
                }

            }


            //   if (res_read?.data?.ebreadingfiltertime.length > 0) {
            //     const mostRecentDate = varfilter.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ? current : prev));

            //     let differecnce = Number(kwhval) - Number(mostRecentDate.openkwh)
            //     setReadingFilterEdit(differecnce)
            //     if (readingFilterKvhEdit > 0 && differecnce > 0) {
            //         setPfdifference(differecnce / readingFilterKvhEdit)
            //     }
            // }
            // if (res_read?.data?.ebreadingfiltertimefuture.length > 0) {

            //     setFutureUpdatedelafter(res_read?.data?.ebreadingfiltertimefuture[0])
            //     setFutureUpdatedelafterarr(res_read?.data?.ebreadingfiltertimefuture)
            // }


            if (res_read?.data?.ebreadingfiltertime && res_read?.data?.ebreadingfiltertime.length > 0) {
                setFutureUpdateBeforearr(res_read?.data?.ebreadingfiltertime);
            }




        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }

    //get all Sub vendormasters.
    const fetchEbreadingdetailsFilterKVHEdit = async (kvahval) => {
        let varfilter = []
        try {
            let res_read = await axios.post(SERVICE.EB_SERVICEFILTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                company: String(ebreadingdetailEdit.company),
                branch: String(ebreadingdetailEdit.branch),
                unit: String(ebreadingdetailEdit.unit),
                floor: String(ebreadingdetailEdit.floor),
                area: String(ebreadingdetailEdit.area),
                servicenumber: String(ebreadingdetailEdit.servicenumber),
                date: String(ebreadingdetailEdit.date),
                time: String(ebreadingdetailEdit.time),
                readingmode: String(readingmodeEdit),
                id: dateedit
            });
            varfilter = res_read?.data?.ebreadingfiltertime
            const openEntries = varfilter.filter(item => item.readingmode === "Open Entry");
            const ReadingEntries = varfilter.filter(item => item.readingmode !== "Open Entry");

            // const mostRecentDate = varfilter.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ? current : prev));
            let mostRecentDate = { openkwh: 0, kvah: 0 }
            let mostRecentDatereading = { openkwh: 0, kvah: 0 }
            setcheckServicemasterBeforeDate(varfilter.length)
            // if (res_read?.data?.ebreadingfiltertime.length > 0) {
            //     const mostRecentDate = varfilter.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ? current : prev));
            //     let differecnce = Number(kvahval) - Number(mostRecentDate.kvah)
            //     setReadingFilterKVHEdit(differecnce)
            //     if (readingFilterEdit > 0 && differecnce > 0) {
            //         setPfdifference(readingFilterEdit / differecnce)
            //     }
            // }
            // if (res_read?.data?.ebreadingfiltertimefuture && res_read?.data?.ebreadingfiltertimefuture.length > 0) {

            //     setFutureUpdatedelafter(res_read?.data?.ebreadingfiltertimefuture[0])
            //     setFutureUpdatedelafterarr(res_read?.data?.ebreadingfiltertimefuture);
            // }

            if (res_read?.data?.ebreadingfiltertimefuture.length > 0) {
                setFutureUpdatedelafter(res_read?.data?.ebreadingfiltertimefuture[0])
                setFutureUpdatedelafterarr(res_read?.data?.ebreadingfiltertimefuture)
                if (Number(kvahval) > res_read?.data?.ebreadingfiltertimefuture[0]?.kvah) {

                    let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
                    console.log(logbeforecreated, "logbeforecreated")

                    if (logbeforecreated) {
                        if (ReadingEntries.length > 0) {
                            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                current : prev));
                        }
                        if (openEntries.length > 0) {
                            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                current : prev));
                        }

                        if (ReadingEntries.length > 0 && openEntries.length > 0) {

                            if ((mostRecentDate.date) == (ebreadingdetailEdit.date)) {
                                mostRecentDate = mostRecentDate
                            } else if (new Date(mostRecentDate.date) < new Date(ebreadingdetailEdit.date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
                                mostRecentDate = mostRecentDate
                            }
                            else if (new Date(mostRecentDate.date) < new Date(ebreadingdetailEdit.date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
                                mostRecentDate = mostRecentDate
                            }
                            else {
                                mostRecentDate = mostRecentDatereading
                            }
                        }
                        else if (ReadingEntries.length > 0) {
                            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                current : prev));
                            if (mostRecentDatereading.date == ebreadingdetailEdit.date) {
                                mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                    current : prev));
                                mostRecentDate = mostRecentDatereading
                            } else {
                                mostRecentDate = mostRecentDatereading
                            }
                        } else {
                            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                current : prev));
                            mostRecentDate = mostRecentDate
                        }

                    }
                    else {
                        let serviceold = res_read?.data?.ebreadingfiltertimeold
                        let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
                        console.log(varfilter, serviceold, "varfilter")
                        if (serviceold?.length > 0) {
                            serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
                                current : prev));
                        }
                        if (ReadingEntries.length > 0) {
                            if (readingmodeEdit == "Session Closing") {
                                console.log("popo")
                                mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                    current : prev));
                            } else {

                                mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                    current : prev));

                                const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                                    !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
                                )
                                console.log(withoutlogoldentry, "withoutlogoldentry")

                                if (withoutlogoldentry.length > 0) {
                                    mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                        current : prev));
                                } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                                    mostRecentDate = serviceoldRecentDate
                                } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                                    mostRecentDate = serviceoldRecentDate
                                } else {
                                    mostRecentDate = mostRecentDate
                                }

                            }
                        }



                        // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

                        // console.log(checkIslogoldentry, "checkIslogoldentry")

                        // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
                        //   mostRecentDate = serviceoldRecentDate
                        // }


                    }
                    let differecnce = Number(kvahval) - Number(mostRecentDate.kvah)
                    setReadingFilterKVHEdit(differecnce)

                    if (readingFilterEdit > 0 && differecnce > 0) {
                        setPfdifference(readingFilterEdit / differecnce)
                    }
                    // setPopupContentMalert(`Please Enter KVAH Reading Less Than This ${res_read?.data?.ebreadingfiltertimefuture[0].date}`);
                    setPopupContentMalert(`Please Enter KVAH Value Less Than This ${res_read?.data?.ebreadingfiltertimefuture[0]?.date} KVAH Value (${res_read?.data?.ebreadingfiltertimefuture[0]?.kvah})`);

                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                } else if (res_read?.data?.ebreadingfiltertime.length > 0) {
                    let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
                    console.log(logbeforecreated, "logbeforecreated")

                    if (logbeforecreated) {
                        if (ReadingEntries.length > 0) {
                            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                current : prev));
                        }
                        if (openEntries.length > 0) {
                            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                current : prev));
                        }

                        if (ReadingEntries.length > 0 && openEntries.length > 0) {

                            if ((mostRecentDate.date) == (ebreadingdetailEdit.date)) {
                                mostRecentDate = mostRecentDate
                            } else if (new Date(mostRecentDate.date) < new Date(ebreadingdetailEdit.date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
                                mostRecentDate = mostRecentDate
                            }
                            else if (new Date(mostRecentDate.date) < new Date(ebreadingdetailEdit.date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
                                mostRecentDate = mostRecentDate
                            }
                            else {
                                mostRecentDate = mostRecentDatereading
                            }
                        }
                        else if (ReadingEntries.length > 0) {
                            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                current : prev));
                            if (mostRecentDatereading.date == ebreadingdetailEdit.date) {
                                mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                    current : prev));
                                mostRecentDate = mostRecentDatereading
                            } else {
                                mostRecentDate = mostRecentDatereading
                            }
                        } else {
                            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                current : prev));
                            mostRecentDate = mostRecentDate
                        }

                    }
                    else {
                        let serviceold = res_read?.data?.ebreadingfiltertimeold
                        let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
                        console.log(varfilter, serviceold, "varfilter")
                        if (serviceold?.length > 0) {
                            serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
                                current : prev));
                        }
                        if (ReadingEntries.length > 0) {
                            if (readingmodeEdit == "Session Closing") {
                                console.log("popo")
                                mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                    current : prev));
                            } else {

                                mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                    current : prev));

                                const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                                    !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
                                )
                                console.log(withoutlogoldentry, "withoutlogoldentry")

                                if (withoutlogoldentry.length > 0) {
                                    mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                        current : prev));
                                } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                                    mostRecentDate = serviceoldRecentDate
                                } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                                    mostRecentDate = serviceoldRecentDate
                                } else {
                                    mostRecentDate = mostRecentDate
                                }

                            }
                        }



                        // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

                        // console.log(checkIslogoldentry, "checkIslogoldentry")

                        // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
                        //   mostRecentDate = serviceoldRecentDate
                        // }


                    }
                    let differecnce = Number(kvahval) - Number(mostRecentDate.kvah)
                    setReadingFilterKVHEdit(differecnce)

                    if (readingFilterEdit > 0 && differecnce > 0) {
                        setPfdifference(readingFilterEdit / differecnce)
                    }

                }

            } else if (res_read?.data?.ebreadingfiltertime.length > 0) {
                let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
                console.log(logbeforecreated, "logbeforecreated")

                if (logbeforecreated) {
                    if (ReadingEntries.length > 0) {
                        mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                            current : prev));
                    }
                    if (openEntries.length > 0) {
                        mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                    }

                    if (ReadingEntries.length > 0 && openEntries.length > 0) {

                        if ((mostRecentDate.date) == (ebreadingdetailEdit.date)) {
                            mostRecentDate = mostRecentDate
                        } else if (new Date(mostRecentDate.date) < new Date(ebreadingdetailEdit.date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
                            mostRecentDate = mostRecentDate
                        }
                        else if (new Date(mostRecentDate.date) < new Date(ebreadingdetailEdit.date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
                            mostRecentDate = mostRecentDate
                        }
                        else {
                            mostRecentDate = mostRecentDatereading
                        }
                    }
                    else if (ReadingEntries.length > 0) {
                        mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                        if (mostRecentDatereading.date == ebreadingdetailEdit.date) {
                            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                current : prev));
                            mostRecentDate = mostRecentDatereading
                        } else {
                            mostRecentDate = mostRecentDatereading
                        }
                    } else {
                        mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                            current : prev));
                        mostRecentDate = mostRecentDate
                    }

                }
                else {
                    let serviceold = res_read?.data?.ebreadingfiltertimeold
                    let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
                    console.log(varfilter, serviceold, "varfilter")
                    if (serviceold?.length > 0) {
                        serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
                            current : prev));
                    }
                    if (ReadingEntries.length > 0) {
                        if (readingmodeEdit == "Session Closing") {
                            console.log("popo")
                            mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                                current : prev));
                        } else {

                            mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                current : prev));

                            const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                                !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
                            )
                            console.log(withoutlogoldentry, "withoutlogoldentry")

                            if (withoutlogoldentry.length > 0) {
                                mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                                    current : prev));
                            } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                                mostRecentDate = serviceoldRecentDate
                            } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                                mostRecentDate = serviceoldRecentDate
                            } else {
                                mostRecentDate = mostRecentDate
                            }

                        }
                    }



                    // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

                    // console.log(checkIslogoldentry, "checkIslogoldentry")

                    // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
                    //   mostRecentDate = serviceoldRecentDate
                    // }


                }


                let differecnce = Number(kvahval) - Number(mostRecentDate.kvah)
                setReadingFilterKVHEdit(differecnce)
                if (readingFilterEdit > 0 && differecnce > 0) {
                    setPfdifference(readingFilterEdit / differecnce)
                }

            }


            if (res_read?.data?.ebreadingfiltertime && res_read?.data?.ebreadingfiltertime.length > 0) {
                setFutureUpdateBeforearr(res_read?.data?.ebreadingfiltertime);
            }
        } catch (err) {

            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }




    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'EB Reading Details',
        pageStyle: 'print'
    });

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {

        setItems(datas);
    }

    useEffect(() => {
        addSerialNumber(isFilterEb);
    }, [isFilterEb])


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
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredData = filteredDatas.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );

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
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 80, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
        },
        { field: "company", headerName: "Company", flex: 0, width: 100, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 100, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 100, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "floor", headerName: "Floor", flex: 0, width: 100, hide: !columnVisibility.floor, headerClassName: "bold-header" },
        { field: "area", headerName: "Area", flex: 0, width: 100, hide: !columnVisibility.area, headerClassName: "bold-header" },
        { field: "servicenumber", headerName: "Services", flex: 0, width: 100, hide: !columnVisibility.servicenumber, headerClassName: "bold-header" },
        { field: "date", headerName: "Date", flex: 0, width: 100, hide: !columnVisibility.date, headerClassName: "bold-header" },
        { field: "time", headerName: "Time", flex: 0, width: 100, hide: !columnVisibility.time, headerClassName: "bold-header" },
        { field: "openkwh", headerName: "KWH", flex: 0, width: 100, hide: !columnVisibility.openkwh, headerClassName: "bold-header" },
        { field: "kvah", headerName: "KVAH", flex: 0, width: 100, hide: !columnVisibility.kvah, headerClassName: "bold-header" },
        { field: "kwhunit", headerName: "KWHUNIT", flex: 0, width: 100, hide: !columnVisibility.kwhunit, headerClassName: "bold-header" },
        { field: "kvahunit", headerName: "KVAHUNIT", flex: 0, width: 100, hide: !columnVisibility.kvahunit, headerClassName: "bold-header" },
        { field: "pf", headerName: "PF", flex: 0, width: 100, hide: !columnVisibility.pf, headerClassName: "bold-header" },
        { field: "md", headerName: "MD", flex: 0, width: 100, hide: !columnVisibility.md, headerClassName: "bold-header" },
        { field: "readingmode", headerName: "Mode", flex: 0, width: 100, hide: !columnVisibility.readingmode, headerClassName: "bold-header" },
        { field: "description", headerName: "Description", flex: 0, width: 100, hide: !columnVisibility.description, headerClassName: "bold-header" },

        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 300,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    {isUserRoleCompare?.includes("eebreadingdetailslist") && (
                        <Button sx={userStyle.buttonedit} onClick={() => {

                            getCode(params.data.id, params.data.name);
                        }}><EditOutlinedIcon sx={buttonStyles.buttonedit} /></Button>
                    )}
                    {isUserRoleCompare?.includes("debreadingdetailslist") && (
                        <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.data.id, params) }}>
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} /></Button>
                    )}
                    {isUserRoleCompare?.includes("vebreadingdetailslist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {

                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iebreadingdetailslist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {

                                getinfoCode(params.data.id);
                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
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
            company: item.company === "Please Select Company" ? "" : item.company,
            branch: item.branch === "Please Select Branch" ? "" : item.branch,
            unit: item.unit === "Please Select Unit" ? "" : item.unit,
            floor: item.floor === "Please Select Floor" ? "" : item.floor,
            area: item.area === "Please Select Area" ? "" : item.area,
            servicenumber: item.servicenumber,
            date: item?.date,
            olddate: item.olddate,
            time: item.time,
            openkwh: item.openkwh,
            kvah: item.kvah,
            kvahunit: item.kvahunit,
            kwhunit: item.kwhunit,
            pf: item.pf,
            md: item.md,
            readingmode: item.readingmode,
            description: item.description,
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


    const [fileFormat, setFormat] = useState('')

    return (
        <Box>
            <Headtitle title={'EB Reading Details List'} />
            {/* ****** Header Content ****** */}
            {/* <Typography sx={userStyle.HeaderText}>Manage EB Reading Details</Typography> */}
            <PageHeading
                title="Manage EB Reading Details List"
                modulename="EB"
                submodulename="EB Reading Details List"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />

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
                        marginTop: "85px"
                    }}
                >

                    <Box sx={{ overflow: "auto", padding: '20px' }}>
                        <>

                            {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography sx={userStyle.HeaderText}>Edit EB Reading Details</Typography>
                                </Grid>
                            </Grid><br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={isAssignBranch?.map(data => ({
                                                label: data.company,
                                                value: data.company,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            styles={colourStyles}
                                            value={{ label: ebreadingdetailEdit.company, value: ebreadingdetailEdit.company }}
                                            // value={{ label: selectedcompanyedit, value: selectedcompanyedit }}
                                            onChange={(e) => {
                                                setEbreadingdetailEdit({
                                                    ...ebreadingdetailEdit, company: e.value, branch: "Please Select Branch", unit: "Please Select Unit", floor: "Please Select Floor", area: "Please Select Area",
                                                    servicenumber: "Please Select Service"
                                                });
                                                setserviceNumberEdit([])
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={isAssignBranch?.filter(
                                                (comp) =>
                                                    ebreadingdetailEdit.company === comp.company
                                            )?.map(data => ({
                                                label: data.branch,
                                                value: data.branch,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            styles={colourStyles}
                                            value={{ label: ebreadingdetailEdit.branch, value: ebreadingdetailEdit.branch }}
                                            onChange={(e) => {
                                                setEbreadingdetailEdit({
                                                    ...ebreadingdetailEdit, branch: e.value, unit: "Please Select Unit",
                                                    floor: "Please Select Floor", area: "Please Select Area", servicenumber: "Please Select Service"
                                                });
                                                setAreasEdit([]);
                                                setFloorEdit([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={isAssignBranch?.filter(
                                                (comp) =>
                                                    ebreadingdetailEdit.company === comp.company && ebreadingdetailEdit.branch === comp.branch
                                            )?.map(data => ({
                                                label: data.unit,
                                                value: data.unit,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            styles={colourStyles}
                                            value={{ label: ebreadingdetailEdit.unit, value: ebreadingdetailEdit.unit }}
                                            onChange={(e) => {
                                                setEbreadingdetailEdit({
                                                    ...ebreadingdetailEdit, unit: e.value, servicenumber: "Please Select Service", floor: "Please Select Floor",
                                                    area: "Please Select Area",
                                                });
                                                fetchServiceNumberEdit(e.value)
                                                setFloorEdit([])
                                                setAreasEdit([])
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Service Number<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={serviceNumberEdit}
                                            styles={colourStyles}
                                            value={{ label: ebreadingdetailEdit.servicenumber, value: ebreadingdetailEdit.servicenumber }}
                                            onChange={(e) => {
                                                // setEbreadingdetailEdit({
                                                //     ...ebreadingdetailEdit, servicenumber: e.value,
                                                //     floor: "Please Select Floor",
                                                //     area: "Please Select Area"
                                                // });
                                                fetchFloorEdit(e.value);
                                                // fetchAreaEdit(e.value)
                                            }}

                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Floor<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={floorsEdit}
                                            styles={colourStyles}
                                            value={{ label: ebreadingdetailEdit.floor, value: ebreadingdetailEdit.floor }}
                                            onChange={(e) => {
                                                setEbreadingdetailEdit({ ...ebreadingdetailEdit, floor: e.value });

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Area<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={areasEdit}
                                            styles={colourStyles}
                                            value={{ label: ebreadingdetailEdit.area, value: ebreadingdetailEdit.area }}
                                            onChange={(e) => {
                                                setEbreadingdetailEdit({ ...ebreadingdetailEdit, area: e.value });
                                                // fetchServiceNumberEdit(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Reading Mode</Typography>
                                        <Select
                                            fullWidth
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            value={readingmodeEdit}
                                            onChange={(e) => {
                                                setReadingmodeEdit(e.target.value);
                                                fetchEbreadingdetailsFilterReadingEdit(e.target.value)
                                                fetchEbServiceMasterEdit(ebreadingdetailEdit.servicenumber, ebreadingdetailEdit.floor, ebreadingdetailEdit.area, e.target.value)
                                            }}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value="Daily Closing" disabled>
                                                {" "}
                                                {"Daily Closing"}{" "}
                                            </MenuItem>
                                            <MenuItem value="Daily Closing"> {"Daily Closing"} </MenuItem>
                                            <MenuItem value="Bill Closing"> {"Bill Closing"} </MenuItem>
                                            <MenuItem value="Session Closing"> {"Session Closing"} </MenuItem>
                                            <MenuItem value="Month Closing"> {"Month Closing"} </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {readingmodeEdit === "Session Closing" &&

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Description</Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={5}
                                                value={ebreadingdetailEdit.description}
                                                onChange={(e) => {
                                                    setEbreadingdetailEdit({ ...ebreadingdetailEdit, description: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                }
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Date<b style={{ color: "red" }}>*</b> </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            value={ebreadingdetailEdit.date}
                                            // onChange={(e) => {
                                            //     setEbreadingdetailEdit({ ...ebreadingdetailEdit, date: e.target.value });
                                            //     fetchEbreadingdetailsFilterDateEdit(e.target.value)
                                            // }}
                                            onChange={handleDateChange}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Time </Typography>
                                        {/* <OutlinedInput
                                            id="component-outlined"
                                            type="time"
                                            placeholder="HH:MM"
                                            value={ebreadingdetailEdit.time}
                                            onChange={(e) => {
                                                setEbreadingdetailEdit({ ...ebreadingdetailEdit, time: e.target.value });
                                                fetchEbreadingdetailsFilterTimeEdit(e.target.value)
                                            }}
                                        /> */}

                                        <Space wrap>
                                            <TimePicker
                                                use12Hours
                                                format="hh:mm A" size="large"
                                                // value={timeEditValue}
                                                value={timeEditValue}
                                                onChange={handleTimeChange}
                                                getPopupContainer={(trigger) => trigger.parentNode}
                                            // allowClear={false} 
                                            />

                                        </Space>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Kwh Reading <b style={{ color: "red" }}>*</b></Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            value={ebreadingdetailEdit.openkwh}
                                            onChange={(e) => {
                                                // setEbreadingdetailEdit({ ...ebreadingdetailEdit, openkwh: e.target.value });
                                                handleChangekwhreadingEdit(e)
                                                fetchEbreadingdetailsFilterEdit(e.target.value)
                                            }}

                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>KVAH <b style={{ color: "red" }}>*</b> </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            value={ebreadingdetailEdit.kvah}
                                            onChange={(e) => {
                                                // setEbreadingdetailEdit({ ...ebreadingdetailEdit, kvah: e.target.value });
                                                handleChangekvhreadingEdit(e)
                                                fetchEbreadingdetailsFilterKVHEdit(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>KWH Unit </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            readOnly
                                            value={readingFilterEdit}
                                        // onChange={(e) => {
                                        //     setEbreadingdetailEdit({ ...ebreadingdetailEdit, kwhunit: e.target.value });
                                        // }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>KVAH Unit</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            readOnly
                                            value={readingFilterKvhEdit}
                                        // onChange={(e) => {
                                        //     setEbreadingdetailEdit({ ...ebreadingdetailEdit, kvahunit: e.target.value });
                                        // }}
                                        />
                                    </FormControl>
                                </Grid>
                                {serviceNumberEdit ?
                                    <>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>P.F R Phase </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={ebreadingdetailEdit.pfrphase}
                                                    onChange={(e) => {
                                                        setEbreadingdetailEdit({ ...ebreadingdetailEdit, pfrphase: e.target.value });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>P.F Y Phase </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={ebreadingdetailEdit.pfyphase}
                                                    onChange={(e) => {
                                                        setEbreadingdetailEdit({ ...ebreadingdetailEdit, pfyphase: e.target.value });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>P.f B Phase </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={ebreadingdetailEdit.pfbphase}
                                                    onChange={(e) => {
                                                        setEbreadingdetailEdit({ ...ebreadingdetailEdit, pfbphase: e.target.value });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>P.F Current </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={ebreadingdetailEdit.pfcurrent}
                                                    onChange={(e) => {
                                                        setEbreadingdetailEdit({ ...ebreadingdetailEdit, pfcurrent: e.target.value });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>P.F Average </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={ebreadingdetailEdit.pfaverage}
                                                    onChange={(e) => {
                                                        setEbreadingdetailEdit({ ...ebreadingdetailEdit, pfaverage: e.target.value });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>P.F </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    readOnly
                                                    value={pfdifference}
                                                // onChange={(e) => {
                                                //     setEbreadingdetailEdit({ ...ebreadingdetailEdit, pf: e.target.value });
                                                // }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </> : ""
                                }


                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>M.D R Phase </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={ebreadingdetailEdit.mdrphase}
                                            onChange={(e) => {
                                                setEbreadingdetailEdit({ ...ebreadingdetailEdit, mdrphase: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>M.D Y Phase </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={ebreadingdetailEdit.mdyphase}
                                            onChange={(e) => {
                                                setEbreadingdetailEdit({ ...ebreadingdetailEdit, mdyphase: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>M.D B Phase </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={ebreadingdetailEdit.mdbphase}
                                            onChange={(e) => {
                                                setEbreadingdetailEdit({ ...ebreadingdetailEdit, mdbphase: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>M.D Current </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={ebreadingdetailEdit.mdcurrent}
                                            onChange={(e) => {
                                                setEbreadingdetailEdit({ ...ebreadingdetailEdit, mdcurrent: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>M.D Average </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={ebreadingdetailEdit.mdaverage}
                                            onChange={(e) => {
                                                setEbreadingdetailEdit({ ...ebreadingdetailEdit, mdaverage: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>M.D </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={ebreadingdetailEdit.md}
                                            onChange={(e) => {
                                                setEbreadingdetailEdit({ ...ebreadingdetailEdit, md: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />

                            <br />

                            <Grid container spacing={2}>
                                <Grid item md={6} xs={6} sm={6}>
                                    <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>Update</Button>
                                </Grid>
                                <Grid item md={6} xs={6} sm={6}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit} >Cancel</Button>
                                </Grid>
                            </Grid>
                            {/* </DialogContent> */}

                        </>
                    </Box>

                </Dialog>
            </Box>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lebreadingdetailslist") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>EB Reading Details List</Typography>
                        </Grid>

                        <br />

                        <Grid container spacing={2}>
                            <Grid item md={2.4} xs={12} sm={12}>
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
                                        styles={colourStyles}
                                        value={selectedCompanyFrom}
                                        onChange={handleCompanyChangeFrom}
                                        valueRenderer={customValueRendererCompanyFrom}
                                        labelledBy="Please Select Company"
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item md={2.4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Branch
                                    </Typography>
                                    <MultiSelect
                                        options={isAssignBranch?.filter(
                                            (comp) =>
                                                // ebreadingdetailFilter.company === comp.company
                                                selectedCompanyFrom
                                                    .map((item) => item.value)
                                                    .includes(comp.company)
                                        )?.map(data => ({
                                            label: data.branch,
                                            value: data.branch,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        styles={colourStyles}
                                        value={selectedBranchFrom}
                                        onChange={handleBranchChangeFrom}
                                        valueRenderer={customValueRendererBranchFrom}
                                        labelledBy="Please Select Branch"
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item md={2.4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Service Number
                                    </Typography>
                                    <MultiSelect
                                        options={serviceNumber}
                                        styles={colourStyles}
                                        value={selectedServiceFrom}
                                        onChange={handleServiceChangeFrom}
                                        valueRenderer={customValueRendererServiceFrom}
                                        labelledBy="Please Select Service Number"
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item md={2.4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Floor
                                    </Typography>
                                    <MultiSelect
                                        options={floors}
                                        styles={colourStyles}
                                        value={selectedFloorFrom}
                                        onChange={handleFloorChangeFrom}
                                        valueRenderer={customValueRendererFloorFrom}
                                        labelledBy="Please Select Floor"
                                    />
                                </FormControl>
                            </Grid>


                            <Grid item md={1} xs={12} sm={12} marginTop={3}>
                                <Button variant="contained" sx={buttonStyles.buttonsubmit}
                                    onClick={handleSubmitFilter}
                                >
                                    Filter
                                </Button>
                            </Grid>
                            <Grid item md={0.5} xs={12} sm={12} marginTop={3}>
                                <Button onClick={handleClearFilter} sx={buttonStyles.btncancel}>
                                    Clear
                                </Button>
                            </Grid>

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
                                        <MenuItem value={(isFilterEb?.length)}>All</MenuItem>
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
                                    {isUserRoleCompare?.includes("excelmanagematerial") && (
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

                                    {isUserRoleCompare?.includes("csvmanagematerial") && (
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
                                    {isUserRoleCompare?.includes("printmanagematerial") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfmanagematerial") && (
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
                                    {isUserRoleCompare?.includes("imagemanagematerial") && (
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
                            <Grid item md={2} xs={6} sm={6}>
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTable}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={isFilterEb}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={isFilterEb}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        {/* {isUserRoleCompare?.includes("bdebreadingdetails") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button>
                        )} */}


                        <br /><br />
                        {ebreadingdetailCheck ?
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
                                <Box style={{ width: "100%", overflowY: "hidden" }}>
                                    <>
                                        <AggridTable
                                            rowDataTable={rowDataTable}
                                            columnDataTable={columnDataTable}
                                            columnVisibility={columnVisibility}
                                            page={page}
                                            setPage={setPage}
                                            pageSize={pageSize}
                                            totalPages={totalPages}
                                            setColumnVisibility={setColumnVisibility}
                                            isHandleChange={isHandleChange}
                                            items={items}
                                            selectedRows={selectedRows}
                                            setSelectedRows={setSelectedRows}
                                            gridRefTable={gridRefTable}
                                            paginated={false}
                                            filteredDatas={filteredDatas}
                                            // totalDatas={totalDatas}
                                            searchQuery={searchedString}
                                            handleShowAllColumns={handleShowAllColumns}
                                            setFilteredRowData={setFilteredRowData}
                                            filteredRowData={filteredRowData}
                                            setFilteredChanges={setFilteredChanges}
                                            filteredChanges={filteredChanges}
                                            gridRefTableImg={gridRefTableImg}
                                            itemsList={isFilterEb}
                                        />
                                    </>
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
                {/* <Dialog
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
                            onClick={(e) => delEbreading()}
                        > OK </Button>
                    </DialogActions>
                </Dialog> */}


                {/* this is info view details */}

                {/* <Dialog
                    open={openInfo}
                    onClose={handleCloseinfo}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <Box sx={{ width: '550px', padding: '20px 50px' }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>EB Reading Details Info</Typography>
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
                </Dialog> */}
                {/* print layout */}

                <TableContainer component={Paper} sx={userStyle.printcls}>
                    <Table sx={{ minWidth: 700, }} aria-label="customized table" id="usertable" ref={componentRef}>
                        <TableHead>
                            <TableRow>
                                <TableCell>S.no</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Branch</TableCell>
                                <TableCell>Unit</TableCell>
                                <TableCell>Floor</TableCell>
                                <TableCell>Area</TableCell>
                                <TableCell>Service</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Kwh</TableCell>
                                <TableCell>Kvah</TableCell>
                                <TableCell>Kwh Unit</TableCell>
                                <TableCell>Kvah Unit</TableCell>
                                <TableCell>PF</TableCell>
                                <TableCell>MD</TableCell>
                                <TableCell>Mode</TableCell>
                                <TableCell>Description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {rowDataTable &&
                                (rowDataTable.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.company}</TableCell>
                                        <TableCell>{row.branch}</TableCell>
                                        <TableCell>{row.unit}</TableCell>
                                        <TableCell>{row.floor}</TableCell>
                                        <TableCell>{row.area}</TableCell>
                                        <TableCell>{row.servicenumber}</TableCell>
                                        <TableCell>{moment(row.date).format("DD/MM/YYYY")}</TableCell>
                                        <TableCell>{row.openkwh}</TableCell>
                                        <TableCell>{row.kvah}</TableCell>
                                        <TableCell>{row.kwhunit}</TableCell>
                                        <TableCell>{row.kvahunit}</TableCell>
                                        <TableCell>{row.pf}</TableCell>
                                        <TableCell>{row.md}</TableCell>
                                        <TableCell>{row.readingmode}</TableCell>
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
                maxWidth="md"
                sx={{ marginTop: "95px" }}
            >
                <Box sx={{ padding: '20px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View EB Reading Details</Typography>
                        <br />
                        <Grid container spacing={2}>

                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{ebreadingdetailEdit.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{ebreadingdetailEdit.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{ebreadingdetailEdit.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Service Number</Typography>
                                    <Typography>{ebreadingdetailEdit.servicenumber}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Floor</Typography>
                                    <Typography>{ebreadingdetailEdit.floor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Area</Typography>
                                    <Typography>{ebreadingdetailEdit.area}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Service Number</Typography>
                                    <Typography>{ebreadingdetailEdit.servicenumber}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Reading Mode</Typography>
                                    <Typography>{ebreadingdetailEdit.readingmode}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Description</Typography>
                                    <Typography>{ebreadingdetailEdit.description}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Date</Typography>
                                    <Typography>{moment(ebreadingdetailEdit.date).format("DD/MM/YYYY")}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Time</Typography>
                                    <Typography>{ebreadingdetailEdit.time}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">KWH Reading</Typography>
                                    <Typography>{ebreadingdetailEdit.openkwh}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">KVAH</Typography>
                                    <Typography>{ebreadingdetailEdit.kvah}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">KWH Unit</Typography>
                                    <Typography>{ebreadingdetailEdit.kwhunit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">KVAH Unit</Typography>
                                    <Typography>{ebreadingdetailEdit.kvahunit}</Typography>
                                </FormControl>
                            </Grid>

                            {/* {serviceNumberEdit ?
                <> */}
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">P.F R Phase</Typography>
                                    <Typography>{ebreadingdetailEdit.pfrphase}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">P.F Y Phase</Typography>
                                    <Typography>{ebreadingdetailEdit.pfyphase}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">P.F B Phase</Typography>
                                    <Typography>{ebreadingdetailEdit.pfbphase}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">P.F Current</Typography>
                                    <Typography>{ebreadingdetailEdit.pfcurrent}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">P.F Average</Typography>
                                    <Typography>{ebreadingdetailEdit.pfaverage}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth >
                                    <Typography variant="h6" sx={{
                                        textWrap: "wrap",
                                        wordBreak: "break-all"
                                    }}>P.F</Typography>
                                    <Typography>{ebreadingdetailEdit.pf}</Typography>
                                </FormControl>
                            </Grid>
                            {/* </> : ""
              } */}


                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">M.D R Phase</Typography>
                                    <Typography>{ebreadingdetailEdit.mdbphase}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">M.D Y Phase</Typography>
                                    <Typography>{ebreadingdetailEdit.mdyphase}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">M.D B Phase</Typography>
                                    <Typography>{ebreadingdetailEdit.mdbphase}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">M.D Current</Typography>
                                    <Typography>{ebreadingdetailEdit.mdcurrent}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">M.D Average</Typography>
                                    <Typography>{ebreadingdetailEdit.mdaverage}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">M.D</Typography>
                                    <Typography>{ebreadingdetailEdit.md}</Typography>
                                </FormControl>
                            </Grid>


                        </Grid>
                        <br /> <br />  <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleCloseview}> Back </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>


            {/* ALERT DIALOG */}


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
                            onClick={(e) => delEbreadingcheckbox(e)}
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



            {/* EXPTERNAL COMPONENTS -------------- START */}
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
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={isFilterEb ?? []}
                filename={"EB Reading Details List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="EB Reading Details Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delEbreading}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delEbreadingcheckbox}
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
            {/* EXPTERNAL COMPONENTS -------------- END */}




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


export default EBReadingDetailsList;