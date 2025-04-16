import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, InputAdornment, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import jsPDF from "jspdf";
import * as XLSX from 'xlsx';
import "jspdf-autotable";
import axios from "axios";
import StyledDataGrid from "../../components/TableStyle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import AggridTable from "../../components/AggridTable";
import Selects from "react-select";
import domtoimage from 'dom-to-image';
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import AlertDialog from "../../components/Alert";


function ClientUseridTemp() {

    const [loading, setLoading] = useState(false)
    const [fileFormat, setFormat] = useState("");
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTableImg = useRef(null);
    const gridRefTable = useRef(null);


    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");


    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };


    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    let exportColumnNames = [

        "From Date",
        "To Date",
        "Name",
        "User Name",
        "Created Date",
    ];
    let exportRowValues = [
        "fromdate",
        "todate",
        "name",
        "username",
        "date",
    ];
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);


    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };


    const gridRef = useRef(null);
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = yyyy + "-" + mm + "-" + dd;
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [productionConsolidate, setProductionConsolidate] = useState({ fromdate: formattedDate, todate: formattedDate, name: "" });
    const [clientUserIDArray, setClientUserIDArray] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess } = useContext(
        UserRoleAccessContext
    );
    const { auth } = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isRowDelete, setIsRowDelete] = useState({});

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [clientUserIDData, setClientUserIDData] = useState([]);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        fromdate: true,
        todate: true,
        name: true,
        username: true,
        date: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    //useEffect
    useEffect(() => {
        addSerialNumber();
    }, [clientUserIDArray]);

    useEffect(() => {
        getexcelDatas();
    }, [clientUserIDArray]);

    useEffect(() => {
        fetchClientUserID();
    }, []);
    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);
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
        if (selectedRows.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    //add function
    const sendRequest = async () => {
        try {
            let brandCreate = await axios.post(SERVICE.ADD_PRODUCTION_TEMP_CONSOLIDATED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                fromdate: String(productionConsolidate.fromdate),
                todate: String(productionConsolidate.todate),
                name: String(productionConsolidate.name),
                username: String(isUserRoleAccess.companyname),
                date: formattedDate,
                addedby: [
                    {
                        name: String(username),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchClientUserID();
            setProductionConsolidate({ ...productionConsolidate, fromdate: formattedDate, todate: formattedDate, name: '' });
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = clientUserIDArray?.some(
            (item) =>
                item.fromdate === productionConsolidate.fromdate &&
                item.todate === productionConsolidate.todate
        );
        if (productionConsolidate.fromdate === "") {

            setPopupContentMalert("Please Select From Date!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (productionConsolidate.todate === "") {
            setPopupContentMalert("Please Select To Date!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (productionConsolidate.name === "") {
            setPopupContentMalert("Please Enter Name!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Same From Date and To Date already exits!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    };

    const handleclear = (e) => {
        e.preventDefault();
        setProductionConsolidate({ fromdate: formattedDate, todate: formattedDate, name: "" });
    };
    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };






    //get all client user id.
    const fetchClientUserID = async () => {
        setLoading(true)
        try {
            let res_freq = await axios.get(SERVICE.GET_PRODUCTION_TEMP_CONSOLIDATED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLoading(false);
            setClientUserIDArray(res_freq?.data?.productiontempConsolidated?.map((item, index) => ({
                ...item,
                id: item._id,
                serialNumber: index + 1,
                fromdate: moment(item.fromdate).format('DD-MM-YYYY'),
                todate: moment(item.todate).format('DD-MM-YYYY'),

                oldfromdate: item.fromdate,
                oldtodate: item.todate,
                date: moment(item.date).format('DD-MM-YYYY'),

            })));

        } catch (err) { setLoading(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };



    //image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "ProductionConsolidated Temp.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };
    // pdf.....
    const columns = [
        { title: "Sno", field: "serialNumber" },
        { title: "From Date", field: "fromdate" },
        { title: "To Date", field: "todate" },
        { title: "Name", field: "name" },
        { title: "User Name", field: "username" },
        { title: "Created Date", field: "date" },
    ];
    //  pdf download functionality
    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.autoTable({
            theme: "grid",
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: items,
        });
        doc.save("ProductionTempConsolidated.pdf");
    };
    // Excel
    const fileName = "ProductionTempConsolidated";
    // get particular columns for export excel
    const getexcelDatas = () => {
        var data = clientUserIDArray.map((t, index) => ({
            Sno: index + 1,
            Fromdate: moment(t.fromdate).format('DD-MM-YYYY'),
            Todate: moment(t.todate).format('DD-MM-YYYY'),
            Name: t.name,
            UserName: t.username,
            CreatedDate: moment(t.date).format('DD-MM-YYYY'),
        }));
        setClientUserIDData(data);
    };
    // Excel
    const fileNameFilter = "Production_Temp__Consolidated_Filtered_Data";
    // get particular columns for export excel
    const getExcelFilterDatas = (answer) => {
        try {
            var data = answer?.map((item, index) => ({
                Sno: index + 1,
                EmployeeCode: item.empcode,
                EmployeeName: item.name,
                Company: item.companyname,
                Branch: item.branch,
                Unit: item.unit,
                Team: item.team,
                // Date: moment(item.date).format('DD-MM-YYYY'),
                Exper: item.exper,
                Target: item.target,
                Weekoff: item.weekoff,
                Production: item.production,
                Manual: item.manual,
                NonProduction: item.nonproduction,
                Point: item.point,
                AllowancePoint: item.allowancepoint,
                NonAllowancePoint: item.noallowancepoint,
                AvgPoint: item.avgpoint,
            }));
            // Convert data to worksheet
            const ws = XLSX.utils.json_to_sheet(data);

            // Create a workbook with a single worksheet
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            // Save the workbook as an Excel file
            XLSX.writeFile(wb, `${fileNameFilter}.xlsx`);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "ProductionTempConsolidated",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = () => {
        const itemsWithSerialNumber = clientUserIDArray?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        setItems(itemsWithSerialNumber);
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
    const rowData = async (id, from, to) => {
        try {

            let res_data = await axios.post(SERVICE.PAY_RUN_LIST_CONSOLIDATED_DATE_TEMP, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                from: from,
                to: to,
            });
            const checkpayrun = res_data.data.count > 0
            if (checkpayrun) {
                const message =
                    res_data.data.payrunlists > 0 &&
                        res_data.data.productionday > 0 &&
                        res_data.data.daypoints > 0
                        ? "payrun, daypointstemp, productiondaytemp already generated"
                        : res_data.data.payrunlists > 0 &&
                            res_data.data.productionday > 0
                            ? "payrun, productiondaytemp already generated"
                            : res_data.data.payrunlists > 0 &&
                                res_data.data.daypoints > 0
                                ? "payrun, daypointstemp already generated"
                                : res_data.data.productionday > 0 &&
                                    res_data.data.daypoints > 0
                                    ? "daypoints, productiondaytemp already generated"
                                    : res_data.data.payrunlists > 0
                                        ? "payrun already generated"
                                        : res_data.data.productionday > 0
                                            ? "productiondaytemp  already generated"
                                            : res_data.data.daypoints > 0
                                                ? "daypointstemp already generated"
                                                : "";
                setPopupContentMalert(message)
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();

            }

            else {



                let res = await axios.get(`${SERVICE.SINGLE_PRODUCTION_TEMP_CONSOLIDATED}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
                setIsRowDelete(res?.data?.sproductiontempConsolidated);
                handleClickOpen();
            }

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    const delReportcheckbox = async () => {
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.SINGLE_PRODUCTION_TEMP_CONSOLIDATED}/${item}`, {
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

            await fetchClientUserID();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    const delReport = async (e) => {

        try {
            if (isRowDelete?._id) {
                await axios.delete(`${SERVICE.SINGLE_PRODUCTION_TEMP_CONSOLIDATED}/${e}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
                await fetchClientUserID();
                handleCloseMod();
                setSelectedRows([]);
                setPage(1);
                setPopupContent("Deleted Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
            }


        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    //get single row to edit....
    const getCode = async (e) => {
        try {
            let res = await axios.post(`${SERVICE.FILTER_PRODUCTION_TEMP_CONSOLIDATED}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                id: e,
            });
            handleClickOpenEdit();
            await getExcelFilterDatas(res.data.ans);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            // headerComponent: (params) => (
            //   <CheckboxHeader
            //     selectAllChecked={selectAllChecked}
            //     onSelectAll={() => {
            //       if (rowDataTable.length === 0) {
            //         return;
            //       }
            //       if (selectAllChecked) {
            //         setSelectedRows([]);
            //         setSelectedRowsCat([]);

            //       } else {
            //         const allRowIds = rowDataTable.map((row) => row.id);
            //         const allRowIdsCat = rowDataTable.map((row) => row.servicenumber);
            //         setSelectedRows(allRowIds);
            //         setSelectedRowsCat(allRowIdsCat);
            //       }
            //       setSelectAllChecked(!selectAllChecked);
            //     }}
            //   />
            // ),
            // cellRenderer: (params) => (
            //   <Checkbox
            //     checked={selectedRows.includes(params.data.id)}
            //     onChange={() => {
            //       let updatedSelectedRows;
            //       let updatedSelectedRowsCat;

            //       if (selectedRows.includes(params.data.id)) {
            //         updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.data._id);
            //         updatedSelectedRowsCat = selectedRowsCat.filter((selectedId) => selectedId !== params.data.servicenumber);

            //       } else {
            //         updatedSelectedRows = [...selectedRows, params.data.id];
            //         updatedSelectedRowsCat = [...selectedRowsCat, params.data.servicenumber];

            //       }
            //       setSelectedRows(updatedSelectedRows);
            //       setSelectedRowsCat(updatedSelectedRowsCat);


            //       setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
            //     }}
            //   />
            // ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 90,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 80,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "fromdate",
            headerName: "From Date",
            flex: 0,
            width: 150,
            hide: !columnVisibility.fromdate,
            headerClassName: "bold-header",
        },
        {
            field: "todate",
            headerName: "To Date",
            flex: 0,
            width: 150,
            hide: !columnVisibility.todate,
            headerClassName: "bold-header",
        },
        {
            field: "name",
            headerName: "Name",
            flex: 0,
            width: 250,
            hide: !columnVisibility.name,
            headerClassName: "bold-header",
        },
        {
            field: "username",
            headerName: "User Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.username,
            headerClassName: "bold-header",
        },
        {
            field: "date",
            headerName: "Created Date",
            flex: 0,
            width: 150,
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("eproductiontempconsolidatedlist") && (
                        <Button
                            variant="contained"
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.data.id)
                            }}
                        >
                            <DownloadOutlinedIcon />
                        </Button>
                    )}&ensp;
                    {isUserRoleCompare?.includes("vproductiontempconsolidatedlist") && (
                        <>
                            <Link to={`/productiontemp/reportsconsolidated/${params.data.id}`}>
                                <Button variant="contained" style={userStyle.buttonedit}>
                                    <VisibilityOutlinedIcon />
                                </Button>
                            </Link>
                        </>
                    )}
                    {isUserRoleCompare?.includes("dproductiontempconsolidatedlist") && (
                        <>
                            <Button variant="contained" sx={userStyle.buttondelete} onClick={(e) => {
                                rowData(params.data.id, params.data.oldfromdate, params.data.oldtodate
                                )
                            }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                        </>
                    )}
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            fromdate: item.fromdate,
            todate: item.todate,
            name: item.name,
            oldfromdate: item.oldfromdate,
            oldtodate: item.oldtodate,
            username: item.username,
            date: item.date,
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
    return (
        <Box>
            <Headtitle title={"CONSOLIDATED LIST"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Manage Production Consolidate Creation</Typography>
            {!clientUserIDArray ?
                <Box sx={userStyle.container}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </Box> :
                <>
                    {isUserRoleCompare?.includes("aproductiontempconsolidatedlist") && (
                        <Box sx={userStyle.selectcontainer}>
                            <>
                                <Typography sx={userStyle.HeaderText}>Add Production Temp Consolidated Creation</Typography>
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                From Date <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                placeholder="Please Enter Name"
                                                value={productionConsolidate.fromdate}
                                                onChange={(e) => {
                                                    setProductionConsolidate({
                                                        ...productionConsolidate,
                                                        fromdate: e.target.value,
                                                        todate: ""
                                                    });
                                                }}
                                            />
                                        </FormControl>

                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                To Date <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                value={productionConsolidate.todate}
                                                onChange={(e) => {
                                                    setProductionConsolidate({
                                                        ...productionConsolidate,
                                                        todate: (new Date(e.target.value) >= new Date(productionConsolidate.fromdate) ? e.target.value : ''),
                                                    });
                                                }}
                                            />
                                        </FormControl>

                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Name <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Name"
                                                value={productionConsolidate.name}
                                                onChange={(e) => {
                                                    setProductionConsolidate({
                                                        ...productionConsolidate,
                                                        name: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>

                                    </Grid>
                                </Grid>
                                <br />
                                <br />
                                <br />
                                <Grid container>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSubmit}
                                        >
                                            Submit
                                        </Button>

                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <Button sx={userStyle.btncancel} onClick={handleclear}>
                                            Clear
                                        </Button>

                                    </Grid>
                                </Grid>
                            </>
                        </Box>
                    )}
                </>}
            <br />   <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lproductiontempconsolidatedlist") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.HeaderText}>
                                List Production Temp Consolidated Creation
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
                                    {isUserRoleCompare?.includes("excelproductiontempconsolidatedlist") && (
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
                                            </Button>                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvproductiontempconsolidatedlist") && (
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
                                            </Button>                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printproductiontempconsolidatedlist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfproductiontempconsolidatedlist") && (
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
                                    {isUserRoleCompare?.includes("imageproductiontempconsolidatedlist") && (
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
                                    maindatas={clientUserIDArray}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={clientUserIDArray}
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
                        </Button>&ensp;
                        {/* {isUserRoleCompare?.includes("bdproductiontempconsolidatedlist") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button>
                        )} */}
                        <br />
                        <br />
                        {loading ? (
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
                                        visible={true}
                                    />
                                </Box>
                            </>
                        ) : (
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
                                            pagenamecheck={"Production Consolidated "}
                                            // totalDatas={totalDatas}
                                            searchQuery={searchedString}
                                            handleShowAllColumns={handleShowAllColumns}
                                            setFilteredRowData={setFilteredRowData}
                                            filteredRowData={filteredRowData}
                                            setFilteredChanges={setFilteredChanges}
                                            filteredChanges={filteredChanges}
                                            gridRefTableImg={gridRefTableImg}
                                            itemsList={clientUserIDArray}
                                        />
                                    </>
                                </Box>

                            </>
                        )}
                        {/* ****** Table End ****** */}
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
                            <TableCell>From Date</TableCell>
                            <TableCell>To Date</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>Created Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {clientUserIDArray &&
                            clientUserIDArray.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{moment(row.fromdate).format('DD-MM-YYYY')}</TableCell>
                                    <TableCell>{moment(row.todate).format('DD-MM-YYYY')}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.username}</TableCell>
                                    <TableCell>{moment(row.date).format('DD-MM-YYYY')}</TableCell>
                                </TableRow>
                            ))}
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
                {/* delete popup  */}

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
                                onClick={(e) => delReportcheckbox(e)}
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
                                onClick={(e) => delReport(isRowDelete?._id)}
                            > OK </Button>
                        </DialogActions>
                    </Dialog>
                </Box>

            </Box>
            <br />


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
                // filteredDataTwo={filteredData ?? []}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={clientUserIDArray ?? []}
                filename={"Report Consolidated Temp"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
        </Box>
    );
}

export default ClientUseridTemp;
