import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, Grid, IconButton, List, ListItem, ListItemText, MenuItem, Paper, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import * as FileSaver from 'file-saver';
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import * as XLSX from 'xlsx';
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from "../../../components/AggridTable";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import domtoimage from 'dom-to-image';
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";


function ManagePenaltyMonthView() {
    let exportColumnNames = [
        'Company', 'Branch', 'Unit',
        'Team', 'Process Code', 'Name',
        'Emp Code', 'Date', 'Vendor Name',
        'Process', 'Total Field', 'Auto Error',
        'Manual Error', 'Upload Error', 'Moved',
        'Not Upload', 'Penalty', 'Non Penalty',
        'Bulk Upload', 'Bulk Keying', 'Edited1',
        'Edited2', 'Edited3', 'Edited4',
        'Reject1', 'Reject2', 'Reject3',
        'Reject4', 'Not Validate', 'Validate Error',
        'Waiver% Error', 'Net Error', 'Per%',
        'Percentage', 'Amount'
    ];
    let exportRowValues = [
        'company', 'branch', 'unit',
        'team', 'processcode', 'name',
        'empcode', 'date', 'vendorname',
        'process', 'totalfield', 'autoerror',
        'manualerror', 'uploaderror', 'moved',
        'notupload', 'penalty', 'nonpenalty',
        'bulkupload', 'bulkkeying', 'edited1',
        'edited2', 'edited3', 'edited4',
        'reject1', 'reject2', 'reject3',
        'reject4', 'notvalidate', 'validateerror',
        'waivererror', 'neterror', 'per',
        'percentage', 'amount'
    ];
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [overallItems, setOverallItems] = useState([]);
    const gridRef = useRef(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("")
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [clientUserIDArray, setClientUserIDArray] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch } = useContext(
        UserRoleAccessContext
    );
    const { auth } = useContext(AuthContext);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordEdit, setShowPasswordEdit] = useState(false);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        processcode: true,
        name: true,
        empcode: true,
        date: true,
        vendorname: true,
        process: true,
        totalfield: true,
        autoerror: true,
        manualerror: true,
        uploaderror: true,
        moved: true,
        notupload: true,
        penalty: true,
        nonpenalty: true,
        bulkupload: true,
        bulkkeying: true,
        edited1: true,
        edited2: true,
        edited3: true,
        edited4: true,
        reject1: true,
        reject1: true,
        reject2: true,
        reject3: true,
        reject4: true,
        notvalidate: true,
        validateerror: true,
        waivererror: true,
        neterror: true,
        per: true,
        percentage: true,
        amount: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );


    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    //useEffect
    useEffect(() => {
        addSerialNumber(clientUserIDArray);
    }, [clientUserIDArray]);

    useEffect(() => {
        fetchProductionLists();
    }, []);
    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);
    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
    }, [columnVisibility]);
    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibility");
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
        }
    }, []);


    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleClickShowPasswordEdit = () => setShowPasswordEdit((show) => !show);
    const handleMouseDownPasswordEdit = (event) => {
        event.preventDefault();
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
    // page refersh reload password
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    const username = isUserRoleAccess.username;
    // Manage Columns
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };
    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };
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
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    const ids = useParams().id;
    //get all client user id.
    const [loading, setLoading] = useState(false);
    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
        ? isAssignBranch?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }))
        : isAssignBranch
            ?.filter((data) => {
                let fetfinalurl = [];

                if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.length !== 0
                ) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0
                ) {
                    fetfinalurl = data.submodulenameurl;
                } else if (data?.modulenameurl?.length !== 0) {
                    fetfinalurl = data.modulenameurl;
                } else {
                    fetfinalurl = [];
                }

                // Check if the pathname exists in the URL
                return fetfinalurl?.includes(window.location.pathname);
            })
            ?.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }));
    const fetchProductionLists = async () => {


        setPageName(!pageName)
        try {
            // const [res_freq, res] = await Promise.all([
            //     axios.get(`${SERVICE.SINGLE_MANAGEPENALTYMONTH}/${ids}`, {
            //         headers: {
            //             Authorization: `Bearer ${auth.APIToken}`,
            //         },
            //     }),
            //     axios.post(`${SERVICE.GET_PENALTYDAYUPLOAD}`, {
            //         assignbranch: accessbranch
            //     }, {
            //         headers: {
            //             Authorization: `Bearer ${auth.APIToken}`,
            //         },
            //     })
            // ])


            const res_freq = await axios.get(`${SERVICE.SINGLE_MANAGEPENALTYMONTH}/${ids}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            })
            // console.log(res_freq.data.smanagepenaltymonth, "form")

            const res = await axios.post(`${SERVICE.GET_PENALTYDAYUPLOAD_BY_DATE}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                fromdate: res_freq.data.smanagepenaltymonth.fromdate,
                todate: res_freq.data.smanagepenaltymonth.todate
            })
            const ans = res.data.penaltydayupload

            // const answer = res_freq?.data?.smanagepenaltymonth;
            // const ans = res?.data?.penaltydayuploadoverall?.map((data) => data.uploaddata).flat()
            // const final = ans.filter(data => data.date >= answer.fromdate && data.date <= answer.todate)?.map((item) => ({ ...item, date: moment(item.date).format('DD-MM-YYYY'), }))

            setClientUserIDArray(ans)
            setLoading(true)
        } catch (err) { setLoading(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const [clientUserIDFilterArray, setClientUserIDFilterArray] = useState([])

    const fetchProductionListsArray = async () => {

        setPageName(!pageName)
        try {
            const [res_freq, res] = await Promise.all([
                axios.get(`${SERVICE.SINGLE_MANAGEPENALTYMONTH}/${ids}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.post(`${SERVICE.GET_PENALTYDAYUPLOAD}`, {
                    assignbranch: accessbranch
                }, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                })
            ])

            const answer = res_freq.data.smanagepenaltymonth;
            const ans = res.data.penaltydayupload.map((data) => data.uploaddata).flat()
            const final = ans.filter(data => data.date >= answer.fromdate && data.date <= answer.todate)

            setClientUserIDFilterArray(final)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchProductionListsArray();
    }, [isFilterOpen])


    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Penalty Month View.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };
    // pdf.....
    const columns = [
        // { title: "Sno", field: "serialNumber" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Process Code", field: "processcode" },
        { title: "Name", field: "name" },
        { title: "Emp Code", field: "empcode" },
        { title: "Date", field: "date" },
        { title: "Vendor Name", field: "vendorname" },
        { title: "Process", field: "process" },
        { title: "Total Field", field: "totalfield" },
        { title: "Auto Error", field: "autoerror" },
        { title: "Manual Error", field: "manualerror" },
        { title: "Upload Error", field: "uploaderror" },
        { title: "Moved", field: "moved" },
        { title: "Not Upload", field: "notupload" },
        { title: "Penalty", field: "penalty" },
        { title: "Non Penalty", field: "nonpenalty" },
        { title: "Bulk Upload", field: "bulkupload" },
        { title: "Bulk Keying", field: "bulkkeying" },
        { title: "Edited1", field: "edited1" },
        { title: "Edited2", field: "edited2" },
        { title: "Edited3", field: "edited3" },
        { title: "Edited4", field: "edited4" },
        { title: "Reject1", field: "reject1" },
        { title: "Reject2", field: "reject2" },
        { title: "Reject3", field: "reject3" },
        { title: "Reject4", field: "reject4" },
        { title: "Not Validate", field: "notvalidate" },
        { title: "Validate Error", field: "validateerror" },
        { title: "Waiver% Error", field: "waivererror" },
        { title: "Net Error", field: "neterror" },
        { title: "Per%", field: "per" },
        { title: "Percentage", field: "percentage" },
        { title: "Amount", field: "amount" },
    ];
    //  pdf download functionality
    // const downloadPdf = () => {
    //     const doc = new jsPDF({
    //         orientation: "landscape"
    //     });

    //     doc.autoTable({
    //         theme: "grid",
    //         styles: {
    //             fontSize: 6,
    //             cellWidth: 'auto'
    //         },
    //         columns: columns.map((col) => ({ ...col, dataKey: col.field })),
    //         body: filteredData,
    //     });
    //     doc.save("Manage Penalty Month View.pdf");
    // };
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
            rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
            clientUserIDFilterArray.map(row => ({
                ...row,
                serialNumber: serialNumberCounter++,
                date: moment(row.date).format("DD-MM-YYYY")
            }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 4,
                cellWidth: "auto"
            },
            columns: columnsWithSerial,
            body: dataWithSerial,
        });

        doc.save("Penalty Month View.pdf");
    };
    // Excel
    const fileName = "Penalty Month View";


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Penalty Month View",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = (datas) => {
        const itemsWithSerialNumber = datas?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,

        }));
        setItems(itemsWithSerialNumber);
        setOverallItems(itemsWithSerialNumber);
    };
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
        setPage(1);
    };


    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredData = filteredDatas?.slice(
        (page - 1) * pageSize,
        page * pageSize
    );
    const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );
    const pageNumbers = [];
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
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 100,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 120,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 120,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 120,
            hide: !columnVisibility.team,
            headerClassName: "bold-header",
        },
        {
            field: "processcode",
            headerName: "Process Code",
            flex: 0,
            width: 150,
            hide: !columnVisibility.processcode,
            headerClassName: "bold-header",
        },
        {
            field: "name",
            headerName: "Name",
            flex: 0,
            width: 200,
            hide: !columnVisibility.name,
            headerClassName: "bold-header",
        },
        {
            field: "empcode",
            headerName: "Emp Code",
            flex: 0,
            width: 120,
            hide: !columnVisibility.empcode,
            headerClassName: "bold-header",
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 200,
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
        },
        {
            field: "vendorname",
            headerName: "Vendor Name",
            flex: 0,
            width: 200,
            hide: !columnVisibility.vendorname,
            headerClassName: "bold-header",
        },
        {
            field: "process",
            headerName: "Process",
            flex: 0,
            width: 200,
            hide: !columnVisibility.process,
            headerClassName: "bold-header",
        },
        {
            field: "totalfield",
            headerName: "Total Field",
            flex: 0,
            width: 100,
            hide: !columnVisibility.totalfield,
            headerClassName: "bold-header",
        },
        {
            field: "autoerror",
            headerName: "Auto Error",
            flex: 0,
            width: 100,
            hide: !columnVisibility.autoerror,
            headerClassName: "bold-header",
        },
        {
            field: "manualerror",
            headerName: "Manual Error",
            flex: 0,
            width: 100,
            hide: !columnVisibility.manualerror,
            headerClassName: "bold-header",
        },
        {
            field: "uploaderror",
            headerName: "Upload Error",
            flex: 0,
            width: 100,
            hide: !columnVisibility.uploaderror,
            headerClassName: "bold-header",
        },
        {
            field: "moved",
            headerName: "Moved",
            flex: 0,
            width: 100,
            hide: !columnVisibility.moved,
            headerClassName: "bold-header",
        },
        {
            field: "notupload",
            headerName: "Not Upload",
            flex: 0,
            width: 100,
            hide: !columnVisibility.notupload,
            headerClassName: "bold-header",
        },
        {
            field: "penalty",
            headerName: "Penalty",
            flex: 0,
            width: 100,
            hide: !columnVisibility.penalty,
            headerClassName: "bold-header",
        },
        {
            field: "nonpenalty",
            headerName: "Non Penalty",
            flex: 0,
            width: 100,
            hide: !columnVisibility.nonpenalty,
            headerClassName: "bold-header",
        },
        {
            field: "bulkupload",
            headerName: "Bulk Upload",
            flex: 0,
            width: 100,
            hide: !columnVisibility.bulkupload,
            headerClassName: "bold-header",
        },
        {
            field: "bulkkeying",
            headerName: "Bulk Keying",
            flex: 0,
            width: 100,
            hide: !columnVisibility.bulkkeying,
            headerClassName: "bold-header",
        },
        {
            field: "edited1",
            headerName: "Edited1",
            flex: 0,
            width: 100,
            hide: !columnVisibility.edited1,
            headerClassName: "bold-header",
        },
        {
            field: "edited2",
            headerName: "Edited2",
            flex: 0,
            width: 100,
            hide: !columnVisibility.edited2,
            headerClassName: "bold-header",
        },
        {
            field: "edited3",
            headerName: "Edited3",
            flex: 0,
            width: 100,
            hide: !columnVisibility.edited3,
            headerClassName: "bold-header",
        },
        {
            field: "edited4",
            headerName: "Edited4",
            flex: 0,
            width: 100,
            hide: !columnVisibility.edited4,
            headerClassName: "bold-header",
        },
        {
            field: "reject1",
            headerName: "Reject1",
            flex: 0,
            width: 100,
            hide: !columnVisibility.reject1,
            headerClassName: "bold-header",
        },
        {
            field: "reject2",
            headerName: "Reject2",
            flex: 0,
            width: 100,
            hide: !columnVisibility.reject2,
            headerClassName: "bold-header",
        },
        {
            field: "reject3",
            headerName: "Reject3",
            flex: 0,
            width: 100,
            hide: !columnVisibility.reject3,
            headerClassName: "bold-header",
        },
        {
            field: "reject4",
            headerName: "Reject4",
            flex: 0,
            width: 100,
            hide: !columnVisibility.reject4,
            headerClassName: "bold-header",
        },
        {
            field: "notvalidate",
            headerName: "Not Validate",
            flex: 0,
            width: 100,
            hide: !columnVisibility.notvalidate,
            headerClassName: "bold-header",
        },
        {
            field: "validateerror",
            headerName: "Validate Error",
            flex: 0,
            width: 100,
            hide: !columnVisibility.validateerror,
            headerClassName: "bold-header",
        },
        {
            field: "waivererror",
            headerName: "Waiver% Error",
            flex: 0,
            width: 100,
            hide: !columnVisibility.waivererror,
            headerClassName: "bold-header",
        },
        {
            field: "neterror",
            headerName: "Net Error",
            flex: 0,
            width: 100,
            hide: !columnVisibility.neterror,
            headerClassName: "bold-header",
        },
        {
            field: "per",
            headerName: "Per%",
            flex: 0,
            width: 100,
            hide: !columnVisibility.per,
            headerClassName: "bold-header",
        },
        {
            field: "percentage",
            headerName: "Percentage",
            flex: 0,
            width: 100,
            hide: !columnVisibility.percentage,
            headerClassName: "bold-header",
        },
        {
            field: "amount",
            headerName: "Amount",
            flex: 0,
            width: 100,
            hide: !columnVisibility.amount,
            headerClassName: "bold-header",
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            processcode: item.processcode,
            name: item.name,
            empcode: item.empcode,
            date: item.date,
            vendorname: item.vendorname,
            process: item.process,
            totalfield: item.totalfield,
            autoerror: item.autoerror,
            manualerror: item.manualerror,
            uploaderror: item.uploaderror,
            moved: item.moved,
            notupload: item.notupload,
            penalty: item.penalty,
            nonpenalty: item.nonpenalty,
            bulkupload: item.bulkupload,
            bulkkeying: item.bulkkeying,
            edited1: item.edited1,
            edited2: item.edited2,
            edited3: item.edited3,
            edited4: item.edited4,
            reject1: item.reject1,
            reject2: item.reject2,
            reject3: item.reject3,
            reject4: item.reject4,
            notvalidate: item.notvalidate,
            validateerror: item.validateerror,
            waivererror: item.waivererror,
            neterror: item.neterror,
            per: item.per,
            percentage: item.percentage,
            amount: item.amount,
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
                            {" "}
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
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }


    const handleExportXL = (isfilter) => {
        if (isfilter === "filtered") {
            exportToCSV(
                rowDataTable?.map((t, index) => ({
                    Sno: index + 1,
                    company: t.company,
                    branch: t.branch,
                    unit: t.unit,
                    team: t.team,
                    processcode: t.processcode,
                    empcode: t.empcode,
                    date: t.date,
                    vendorname: t.vendorname,
                    process: t.process,
                    totalfield: t.totalfield,
                    autoerror: t.autoerror,
                    manualerror: t.manualerror,
                    uploaderror: t.uploaderror,
                    moved: t.moved,
                    notupload: t.notupload,
                    penalty: t.penalty,
                    nonpenalty: t.nonpenalty,
                    bulkupload: t.bulkupload,
                    bulkkeying: t.bulkkeying,
                    edited1: t.edited1,
                    edited2: t.edited2,
                    edited3: t.edited3,
                    edited4: t.edited4,
                    reject1: t.reject1,
                    reject2: t.reject2,
                    reject3: t.reject3,
                    reject4: t.reject4,
                    notvalidate: t.notvalidate,
                    validateerror: t.validateerror,
                    waivererror: t.waivererror,
                    neterror: t.neterror,
                    per: t.per,
                    percentage: t.percentage,
                    amount: t.amount,
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                clientUserIDFilterArray.map((t, index) => ({
                    Sno: index + 1,
                    company: t.company,
                    branch: t.branch,
                    unit: t.unit,
                    team: t.team,
                    processcode: t.processcode,
                    empcode: t.empcode,
                    date: moment(t.date).format("DD-MM-YYYY"),
                    vendorname: t.vendorname,
                    process: t.process,
                    totalfield: t.totalfield,
                    autoerror: t.autoerror,
                    manualerror: t.manualerror,
                    uploaderror: t.uploaderror,
                    moved: t.moved,
                    notupload: t.notupload,
                    penalty: t.penalty,
                    nonpenalty: t.nonpenalty,
                    bulkupload: t.bulkupload,
                    bulkkeying: t.bulkkeying,
                    edited1: t.edited1,
                    edited2: t.edited2,
                    edited3: t.edited3,
                    edited4: t.edited4,
                    reject1: t.reject1,
                    reject2: t.reject2,
                    reject3: t.reject3,
                    reject4: t.reject4,
                    notvalidate: t.notvalidate,
                    validateerror: t.validateerror,
                    waivererror: t.waivererror,
                    neterror: t.neterror,
                    per: t.per,
                    percentage: t.percentage,
                    amount: t.amount,
                })),
                fileName,
            );

        }

        setIsFilterOpen(false)
    };


    return (
        <Box>
            <Headtitle title={"MANAGE PENALTY MONTH VIEW"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Manage Penalty Month View</Typography>
            <br />   <br />
            {/* ****** Table Start ****** */}

            {!clientUserIDArray ? (
                <>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>

                        <ThreeDots
                            height="80"
                            width="80"
                            radius="9"
                            color="#1976d2"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClassName=""
                            visible={true} />
                    </Box>
                </>
            ) : (
                <>
                    {isUserRoleCompare?.includes("lproductionconsolidatedlist") && (
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Penalty Month View List
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
                                                <MenuItem value={clientUserIDArray?.length}>
                                                    All
                                                </MenuItem>
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
                                            {isUserRoleCompare?.includes("excelproductionconsolidatedlist") && (
                                                <>
                                                    <Button onClick={(e) => {
                                                        setIsFilterOpen(true)
                                                        fetchProductionListsArray()
                                                        setFormat("xl")
                                                    }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("csvproductionconsolidatedlist") && (
                                                <>
                                                    <Button onClick={(e) => {
                                                        setIsFilterOpen(true)
                                                        fetchProductionListsArray()
                                                        setFormat("csv")
                                                    }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("printproductionconsolidatedlist") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                        &ensp;
                                                        <FaPrint />
                                                        &ensp;Print&ensp;
                                                    </Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfproductionconsolidatedlist") && (
                                                <>
                                                    <Button
                                                        sx={userStyle.buttongrp}
                                                        onClick={() => {
                                                            setIsPdfFilterOpen(true)
                                                            fetchProductionListsArray()
                                                        }}
                                                    >
                                                        <FaFilePdf />
                                                        &ensp;Export to PDF&ensp;
                                                    </Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("imageproductionconsolidatedlist") && (
                                                <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                    {" "}
                                                    <ImageIcon
                                                        sx={{ fontSize: "15px" }}
                                                    /> &ensp;Image&ensp;{" "}
                                                </Button>
                                            )}
                                        </Box>
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={12}>
                                        <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItems} addSerialNumber={addSerialNumber} setPage={setPage} maindatas={clientUserIDArray} setSearchedString={setSearchedString}
                                            searchQuery={searchQuery}
                                            setSearchQuery={setSearchQuery}
                                            paginated={false}
                                            totalDatas={overallItems}
                                        />
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
                                <br />
                                <br />
                                {!loading ?
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
                                            gridRefTable={gridRef}
                                            paginated={false}
                                            filteredDatas={filteredDatas}
                                            handleShowAllColumns={handleShowAllColumns}
                                            setFilteredRowData={setFilteredRowData}
                                            filteredRowData={filteredRowData}
                                            setFilteredChanges={setFilteredChanges}
                                            filteredChanges={filteredChanges}
                                            gridRefTableImg={gridRefTableImg}
                                            itemsList={overallItems}
                                        />
                                    </>
                                }

                            </Box>
                        </>
                    )}
                    {/* ****** Table End ****** */}
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

                </>
            )}
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
                            <TableCell>Company</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Process Code</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Emp Code</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Total Field</TableCell>
                            <TableCell>Auto Error</TableCell>
                            <TableCell>Manual Error</TableCell>
                            <TableCell>Upload Error</TableCell>
                            <TableCell>Moved</TableCell>
                            <TableCell>Not Upload</TableCell>
                            <TableCell>Penalty</TableCell>
                            <TableCell>Non Penalty</TableCell>
                            <TableCell>Bulk Upload</TableCell>
                            <TableCell>Bulk Keying</TableCell>
                            <TableCell>Edited1</TableCell>
                            <TableCell>Edited2</TableCell>
                            <TableCell>Edited3</TableCell>
                            <TableCell>Edited4</TableCell>
                            <TableCell>Reject1</TableCell>
                            <TableCell>Reject2</TableCell>
                            <TableCell>Reject3</TableCell>
                            <TableCell>Reject4</TableCell>
                            <TableCell>Not Validate</TableCell>
                            <TableCell>Validate Error</TableCell>
                            <TableCell>Waiver% Error</TableCell>
                            <TableCell>Net Error</TableCell>
                            <TableCell>Per%</TableCell>
                            <TableCell>Percentage</TableCell>
                            <TableCell>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {filteredData &&
                            filteredData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.company}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.processcode}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.empcode}</TableCell>
                                    <TableCell>{moment(row.date).format('DD-MM-YYYY')}</TableCell>
                                    <TableCell>{row.vendorname}</TableCell>
                                    <TableCell>{row.process}</TableCell>
                                    <TableCell>{row.totalfield}</TableCell>
                                    <TableCell>{row.autoerror}</TableCell>
                                    <TableCell>{row.manualerror}</TableCell>
                                    <TableCell>{row.uploaderror}</TableCell>
                                    <TableCell>{row.moved}</TableCell>
                                    <TableCell>{row.penalty}</TableCell>
                                    <TableCell>{row.nonpenalty}</TableCell>
                                    <TableCell>{row.bulkupload}</TableCell>
                                    <TableCell>{row.bulkkeying}</TableCell>
                                    <TableCell>{row.edited1}</TableCell>
                                    <TableCell>{row.edited2}</TableCell>
                                    <TableCell>{row.edited3}</TableCell>
                                    <TableCell>{row.edited4}</TableCell>
                                    <TableCell>{row.reject1}</TableCell>
                                    <TableCell>{row.reject2}</TableCell>
                                    <TableCell>{row.reject3}</TableCell>
                                    <TableCell>{row.reject4}</TableCell>
                                    <TableCell>{row.notvalidate}</TableCell>
                                    <TableCell>{row.validateerror}</TableCell>
                                    <TableCell>{row.waivererror}</TableCell>
                                    <TableCell>{row.neterror}</TableCell>
                                    <TableCell>{row.per}</TableCell>
                                    <TableCell>{row.percentage}</TableCell>
                                    <TableCell>{row.amount}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>


            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={clientUserIDArray ?? []}
                filename={"Penalty Month View"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

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
            <MessageAlert
                openPopup={openPopupMalert}
                handleClosePopup={handleClosePopupMalert}
                popupContent={popupContentMalert}
                popupSeverity={popupSeverityMalert}
            />
            {/* Bulk delete ALERT DIALOG */}
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
            <Box>
            </Box>
            <br />
        </Box>
    );
}

export default ManagePenaltyMonthView;