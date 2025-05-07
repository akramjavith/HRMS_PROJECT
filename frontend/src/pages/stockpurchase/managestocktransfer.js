import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, TableBody, TableRow,
    TableCell, Select, Paper, MenuItem, Dialog, DialogContent,
    DialogActions, FormControl, Grid, Table, TableHead,
    TableContainer, Button, List, ListItem, ListItemText,
    Popover, Checkbox, TextField, IconButton
} from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { SERVICE } from "../../services/Baseservice";
import axios from "axios";
import Selects from "react-select";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from '../../context/Appcontext';
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from 'react-loader-spinner'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/system';
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import { saveAs } from 'file-saver';
import { AiOutlineClose } from "react-icons/ai";
import Stockmanagerequest from "./stockrequest";
import PageHeading from "../../components/PageHeading";

import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';



function ManageStockTransfer() {

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [stockTransferEdit, setStockTransferEdit] = useState({ name: "", });
    const [stockTransferArray, setStockTransferArray] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [statusCheck, setStatusCheck] = useState(true);


    const handleOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };


    const [stocktransfermaster, setStocktransfermaster] = useState({ branch: "", floor: "", area: "Please Select Area", location: "Please Select Location", producthead: "", productname: "" });

    const [tableData, setTableData] = useState([]);
    const productilputs = {
        productname: "", producthead: "", quantity: ""
    }

    const [branches, setBranches] = useState([]);
    const [floors, setFloors] = useState([]);
    const [area, setArea] = useState([]);
    const [location, setLocation] = useState([]);
    const [account, setAccount] = useState([]);
    const [assetmaster, setAssetmaster] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('Please Select Branch');
    const [selectedBranchedit, setSelectedBranchedit] = useState('Please Select Branch');
    const [selectedFloor, setSelectedFloor] = useState('Please Select Floor');
    const [selectedFlooredit, setSelectedFlooredit] = useState('Please Select Floor');


    const [selectedProducthead, setSelectedProducthead] = useState('Please Select Producthead');
    const [selectedProductheadedit, setSelectedProductheadedit] = useState('Please Select Producthead');
    const [selectedProductname, setSelectedProductname] = useState('Please Select Productname');
    const [selectedProductnameedit, setSelectedProductnameedit] = useState('Please Select Productname');

    const [filteredFloor, setFilteredFloor] = useState([]);
    const [filteredFloorEdit, setFilteredFloorEdit] = useState([]);
    const [filteredProductname, setFilteredProductname] = useState([]);
    const [filteredProductnameEdit, setFilteredProductnameEdit] = useState([]);


    //event for tabale data fetching
    // const fetchEvent = (e) => {
    //     let isAlreadyAdded = false;
    //     let addQuantity = tableData.map((item) => {
    //         if (e.productname == item.productname) {
    //             isAlreadyAdded = true
    //             setShowAlert("This product Name is already added!")
    //             handleOpen();
    //             return { ...item }
    //         } else {
    //             return item
    //         }
    //     })
    //     if (isAlreadyAdded) {
    //         setTableData(addQuantity)
    //     }
    //     else {
    //         setTableData((tableData) => {
    //             return [...tableData, {
    //                 ...productilputs,
    //                 productname: e.productname,
    //                 producthead: e.producthead,
    //                 quantity: e.quantity,
    //             }]
    //         });
    //     }
    // }
    const fetchEvent = async (e) => {
        try {
            let res_employee = await axios.post(SERVICE.STOCKTRANSFERFILTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                productname: String(e),
                branch: String(selectedBranch),
                producthead: String(selectedProducthead)
            });
            // setTableData((prevTableData) => [...prevTableData, ...res_employee.data.stocks]);
            // Check if the product name already exists in the tableData
            // Check if the product name already exists in the tableData
            const existingProductNames = tableData.map((row) => row.productname);
            const newData = res_employee.data.stocks.filter((row) => !existingProductNames.includes(row.productname));

            if (newData.length > 0) {
                // Append the new data to the existing data
                setTableData((prevTableData) => [...prevTableData, ...newData]);
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"Product Name Already Added"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }

    }

    // useEffect(() => {


    // }, [])



    const fetchbranches = async () => {
        try {
            let res_branchunit = await axios.get(
                SERVICE.BRANCH,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                }
            );
            const branchall = [...res_branchunit?.data?.branch.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            setBranches(branchall);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // get all units
    const fetchFloors = async () => {
        try {
            let res_unit = await axios.get(SERVICE.FLOOR, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            const floorall = [...res_unit?.data?.floors.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            setFloors(floorall);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    // get all units
    const fetchArea = async () => {
        try {
            let res_unit = await axios.get(SERVICE.AREAS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            const areaall = [...res_unit?.data?.areas.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            setArea(areaall);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    const fetchLocation = async () => {
        try {
            let res_unit = await axios.get(SERVICE.LOCATION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            const locationall = [...res_unit?.data?.locationdetails.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            setLocation(locationall);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }


    const fetchAccount = async () => {
        try {
            let teams = await axios.get(SERVICE.ACCOUNTHEAD, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            const deptall = [...teams?.data?.accounthead.map((d) => (
                {
                    ...d,
                    label: d.headname,
                    value: d.headname
                }
            ))];
            setAccount(deptall);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchAsset = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.ASSETS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const deptall = [...res_vendor?.data?.assetmaterial.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            setAssetmaster(deptall);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    useEffect(() => {
        fetchbranches();
        fetchFloors();
        fetchArea();
        fetchLocation();
        fetchAccount();
        fetchAsset();

    }, [])

    const handleBranchChange = (e) => {
        const selectedBranch = e.value;
        setSelectedBranch(selectedBranch);
        setSelectedFloor("Please Select Floor");
    };

    useEffect(() => {
        // Filter categories based on the selected project and vendors
        const filteredCategories = floors?.filter(u =>
            u.branch === selectedBranch).map(u => (
                {
                    ...u,
                    label: u.name,
                    value: u.name
                }
            ))

        setFilteredFloor(filteredCategories);
    }, [selectedBranch]);

    useEffect(() => {
        // Filter categories based on the selected project and vendors
        const filteredCategoriesedit = floors?.filter(ue =>
            ue.branch === selectedBranchedit
        ).map(ue => (
            {
                ...ue,
                label: ue.name,
                value: ue.name
            }
        ))

        setFilteredFloorEdit(filteredCategoriesedit);
    }, [selectedBranchedit]);


    const handleProductChange = (e) => {
        const selectedProducthead = e.value;
        setSelectedProducthead(selectedProducthead);
        setSelectedProductname("Please Select Productname");
    };



    useEffect(() => {
        // Filter categories based on the selected project and vendors
        const filteredCategoriesproductname = assetmaster?.filter(u =>
            u.assethead === selectedProducthead).map(u => (
                {
                    ...u,
                    label: u.name,
                    value: u.name
                }
            ))

        setFilteredProductname(filteredCategoriesproductname);
    }, [selectedProducthead]);

    useEffect(() => {
        // Filter categories based on the selected project and vendors
        const filteredCategoriesproductnameedit = assetmaster?.filter(ue =>
            ue.assethead === selectedProductheadedit
        ).map(ue => (
            {
                ...ue,
                label: ue.name,
                value: ue.name
            }
        ))

        setFilteredProductnameEdit(filteredCategoriesproductnameedit);
    }, [selectedProductheadedit]);



    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [roleName, setRoleName] = useState({})
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [stockTransferData, setStockTransferData] = useState([]);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedData, setCopiedData] = useState('');
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [todo, setTodo] = useState([])
    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null)
    // Show All Columns & Manage Columns 
    const initialColumnVisibility = { serialNumber: true, checkbox: true, date: true, fromlocation: true, producthead: true, productname: true, tolocation: true, qty: true, actions: true, };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


    //useEffects
    useEffect(() => { addSerialNumber(); }, [stockTransferArray])
    useEffect(() => { getexcelDatas(); }, [stockTransferArray])
    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
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
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };
    // view model
    const handleClickOpenview = () => { setOpenview(true); };
    const handleCloseview = () => { setOpenview(false); };
    // info model
    const handleClickOpeninfo = () => { setOpeninfo(true); };
    const handleCloseinfo = () => { setOpeninfo(false); };
    //Delete model
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleCloseMod = () => { setIsDeleteOpen(false); };
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };
    const username = isUserRoleAccess.username
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

    const handleclear = (e) => {
        e.preventDefault();
    }
    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };
    let updateby = roleName.updatedby;
    let addedby = roleName.addedby;
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'categoryAsset.png');
                });
            });
        }
    };
    // pdf.....
    const columns = [{ title: "Sno", field: "serialNumber" }, { title: "Date ", field: "date" }, { title: "From Location ", field: "fromlocation" }, { title: "Product Head ", field: "producthead" }, { title: "Product Name ", field: "productname" }, { title: "To Location ", field: "tolocation" }, { title: "Quantity ", field: "qty" },];
    // pdf download functionality 
    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.autoTable({ theme: "grid", columns: columns.map((col) => ({ ...col, dataKey: col.field })), body: items, });
        doc.save("ManageStockTransfer.pdf");
    };
    // Excel
    const fileName = "ManageStockTransfer";
    // get particular columns for export excel
    const getexcelDatas = () => {
        try {
            var data = stockTransferArray.map((t, index) => ({ "Sno": index + 1, "Date": t.date, "From Location": t.fromlocation, "Product Head": t.producthead, "Product Name": t.productname, "To Location ": t.tolocation, "Quantity": t.qty }));
            setStockTransferData(data);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({ content: () => componentRef.current, documentTitle: "Manage Stock Transfer", pageStyle: "print", });
    //serial no for listing items 
    const addSerialNumber = () => {
        const itemsWithSerialNumber = stockTransferArray?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }
    //Datatable
    const handlePageChange = (newPage) => { setPage(newPage); setSelectedRows([]); setSelectAllChecked(false) };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false);
        setPage(1);
    };
    //datatable....
    const handleSearchChange = (event) => { setSearchQuery(event.target.value); setPage(1); };
    // Split the search query into individual terms
    const searchOverAllTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchOverAllTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });
    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div><Checkbox checked={selectAllChecked} onChange={onSelectAll} /></div>
    );
    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold",
            },
            renderHeader: (params) => (
                <CheckboxHeader
                    selectAllChecked={selectAllChecked}
                    onSelectAll={() => {
                        if (rowDataTable.length === 0) { return; }
                        if (selectAllChecked) { setSelectedRows([]); } else {
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
        { field: "date", headerName: "Date", flex: 0, width: 100, hide: !columnVisibility.date, headerClassName: "bold-header" },
        { field: "fromlocation", headerName: "From Location", flex: 0, width: 150, hide: !columnVisibility.fromlocation, headerClassName: "bold-header" },
        { field: "producthead", headerName: "Product Head", flex: 0, width: 150, hide: !columnVisibility.producthead, headerClassName: "bold-header" },
        { field: "productname", headerName: "Product Name", flex: 0, width: 150, hide: !columnVisibility.productname, headerClassName: "bold-header" },
        { field: "tolocation", headerName: "To Location", flex: 0, width: 130, hide: !columnVisibility.tolocation, headerClassName: "bold-header" },
        { field: "qty", headerName: "Quantity", flex: 0, width: 100, hide: !columnVisibility.qty, headerClassName: "bold-header" },
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
                    <Button sx={userStyle.buttonedit} ><EditOutlinedIcon style={{ fontsize: "large" }} /> </Button>
                    <Button sx={userStyle.buttondelete}><DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />   </Button>
                    <Button sx={userStyle.buttonedit}  > <VisibilityOutlinedIcon style={{ fontsize: "large" }} /> </Button>
                    <Button sx={userStyle.buttonedit} >   <InfoOutlinedIcon style={{ fontsize: "large" }} />  </Button>
                </Grid>),
        },]
    const rowDataTable = filteredData.map((item, index) => {
        return { id: item._id, serialNumber: item.serialNumber, date: item.date, fromlocation: item.fromlocation, producthead: item.producthead, productname: item.productname, tolocation: item.tolocation, qty: item.qty, }
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
        setColumnVisibility((prevVisibility) => ({ ...prevVisibility, [field]: !prevVisibility[field], }));
    };
    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box style={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }} >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton aria-label="close" onClick={handleCloseManageColumns} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500], }}>
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: 'relative', margin: '10px' }}>
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: 'absolute', }} />
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
                        <Button variant="text" sx={{ textTransform: 'none', }} onClick={() => setColumnVisibility(initialColumnVisibility)} >Show All </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: 'none' }} onClick={() => {
                            const newColumnVisibility = {};
                            columnDataTable.forEach((column) => {
                                newColumnVisibility[column.field] = false; // Set hide property to true
                            });
                            setColumnVisibility(newColumnVisibility);
                        }} >Hide All </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    //function for delete columns
    const deleteRow = (i, e) => {
        setTableData(tableData.filter((e, item) => item !== i));
        tableData.splice(i, 1);
    }
    return (
        <Box>
            <Headtitle title={'MANAGE STOCK TRANSFER'} />
            {/* <Typography sx={userStyle.HeaderText}>Manage Stock Transfer</Typography> */}

            <PageHeading
                title="Manage Stock Transfer"
                modulename="Asset"
                submodulename="Stock"
                mainpagename="Stock Manage Transfer"
                subpagename=""
                subsubpagename=""
            />
            {!statusCheck ?
                <Box sx={userStyle.container}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} /> </Box>
                </Box>
                : <>
                    <Box sx={userStyle.selectcontainer}>
                        <><Grid container spacing={2}>
                            <Grid item xs={8}><Typography sx={userStyle.importheadtext}> Add Stock Transfer </Typography> </Grid>
                        </Grid><br />
                            <Grid item xs={8} sx={{ marginBottom: '10px' }}>
                                <Typography sx={userStyle.importheadtext}>From</Typography>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item md={4} sm={6} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Branch <b style={{ color: "red" }}>*</b></Typography>

                                        <Selects
                                            // options={branches}
                                            options={isAssignBranch?.map(data => ({
                                                label: data.branch,
                                                value: data.branch,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            styles={colourStyles}
                                            value={{ label: selectedBranch, value: selectedBranch }}
                                            onChange={handleBranchChange}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={6} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Floor<b style={{ color: "red" }}>*</b> </Typography>
                                        <Selects
                                            options={filteredFloor}
                                            styles={colourStyles}
                                            placeholder={"please select"}
                                            value={{ label: selectedFloor, value: selectedFloor }}
                                            onChange={(e) => setSelectedFloor(e.value)}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={6} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Area<b style={{ color: "red" }}>*</b> </Typography>
                                        <Selects
                                            options={area}
                                            styles={colourStyles}
                                            value={{ label: stocktransfermaster.area, value: stocktransfermaster.area }}
                                            onChange={(e) => {
                                                setStocktransfermaster({ ...stocktransfermaster, area: e.value });
                                            }}

                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={6} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Location<b style={{ color: "red" }}>*</b> </Typography>
                                        <Selects
                                            options={location}
                                            styles={colourStyles}
                                            value={{ label: stocktransfermaster.location, value: stocktransfermaster.location }}
                                            onChange={(e) => {
                                                setStocktransfermaster({ ...stocktransfermaster, location: e.value });
                                            }}

                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={6} xs={12}>
                                    <FormControl size="small" fullWidth>
                                        <Typography>Product Head <b style={{ color: "red" }}>*</b> </Typography>
                                        <Selects
                                            options={account}
                                            styles={colourStyles}
                                            value={{ label: selectedProducthead, value: selectedProducthead }}
                                            onChange={handleProductChange}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={6} xs={12}>
                                    <FormControl size="small" fullWidth >
                                        <Typography>Product Name <b style={{ color: "red" }}>*</b> </Typography>
                                        <Selects
                                            options={filteredProductname}
                                            styles={colourStyles}
                                            value={{ label: selectedProductname, value: selectedProductname }}
                                            onChange={(e) => { setSelectedProductname(e.value); fetchEvent(e.value) }}
                                        />
                                    </FormControl>
                                </Grid>

                            </Grid><br />
                            <Grid item xs={8} sx={{ marginBottom: '10px' }}>
                                <Typography sx={userStyle.importheadtext}>To</Typography>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Branch<b style={{ color: "red" }}>*</b> </Typography>
                                        <Selects placeholder='Please Select Branch' />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Floor<b style={{ color: "red" }}>*</b> </Typography>
                                        <Selects placeholder='Please Select Floor' />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Area <b style={{ color: "red" }}>*</b></Typography>
                                        <Selects placeholder='Please Select Area' />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Location <b style={{ color: "red" }}>*</b></Typography>
                                        <Selects placeholder='Please Select Location' />
                                    </FormControl>
                                </Grid>
                            </Grid><br /><br />
                            <Grid container direction="row-reverse">
                                <Grid item lg={1} md={2} xs={12} sm={6}>
                                    <Button variant="contained" color="primary"> Share  </Button>
                                </Grid>
                                <Grid item lg={1} md={2} sm={12} xs={12}>
                                    <Grid item lg={12} md={12} sm={12} xs={6}>
                                        <Button sx={userStyle.btncancel} onClick={handleclear}>Clear</Button>
                                    </Grid>
                                </Grid>
                            </Grid><br />
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" >
                                    <TableHead sx={{ fontWeight: "600" }}>
                                        <StyledTableRow>
                                            <StyledTableCell>SNo</StyledTableCell>
                                            <StyledTableCell>Product Head</StyledTableCell>
                                            <StyledTableCell>Product Name</StyledTableCell>
                                            <StyledTableCell>Current Stock</StyledTableCell>
                                            <StyledTableCell>Transfer Qty</StyledTableCell>
                                            <StyledTableCell>Cancelation</StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tableData.length > 0 ? tableData.map((row, index) => {
                                            return (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                                    <StyledTableCell>{row.producthead}</StyledTableCell>
                                                    <StyledTableCell>{row.productname}</StyledTableCell>
                                                    <StyledTableCell>{row.quantity}</StyledTableCell>
                                                    <StyledTableCell></StyledTableCell>
                                                    <StyledTableCell><AiOutlineClose onClick={(e) => { deleteRow(index, e); }} style={{ color: "red", cursor: "pointer" }} /></StyledTableCell>
                                                </StyledTableRow>
                                            )
                                        }) :
                                            <StyledTableRow>
                                                <StyledTableCell colSpan={8} align="center">No Data Available</StyledTableCell> </StyledTableRow>

                                        }

                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <br /> <br />
                        </>
                    </Box><br />
                </>}
            {/* ****** Table Start ****** */}
            <>
                <Box sx={userStyle.container}>
                    <Grid item xs={8}>
                        <Typography sx={userStyle.importheadtext}>Transfer List</Typography>
                    </Grid>
                    <Grid container spacing={2} style={userStyle.dataTablestyle}>
                        <Grid item md={2} xs={12} sm={12}>
                            <Box>
                                <label >Show entries:</label>
                                <Select id="pageSizeSelect" value={pageSize} MenuProps={{ PaperProps: { style: { maxHeight: 180, width: 80, }, }, }} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                    <MenuItem value={(stockTransferArray?.length)}>All</MenuItem>
                                </Select>
                            </Box>
                        </Grid>
                        <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Box >
                                <>
                                    <ExportXL csvData={stockTransferData} fileName={fileName} />
                                </>
                                <>
                                    <ExportCSV csvData={stockTransferData} fileName={fileName} />
                                </>
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                </>
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>  <FaFilePdf /> &ensp;Export to PDF&ensp; </Button>
                                </>
                                <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                            </Box >
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                            <Box>
                                <FormControl fullWidth size="small" >
                                    <Typography>Search</Typography>
                                    <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid> <br />
                    <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;<br /><br />
                    <Box style={{ width: '100%', overflowY: 'hidden' }}  >
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
                            Showing {filteredData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
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
                </Box>
            </>

            {/* ****** Table End ****** */}
            {/* Manage Column */}
            <Popover id={id} open={isManageColumnsOpen} anchorEl={anchorEl} onClose={handleCloseManageColumns} anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}>{manageColumnsContent}  </Popover>
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef} >
                    <TableHead>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>From Location</TableCell>
                            <TableCell>Product Head</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell>To Location</TableCell>
                            <TableCell>Quantity</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {stockTransferArray &&
                            stockTransferArray.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.fromlocation}</TableCell>
                                    <TableCell>{row.producthead}</TableCell>
                                    <TableCell>{row.productname}</TableCell>
                                    <TableCell>{row.tolocation}</TableCell>
                                    <TableCell>{row.qty}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* this is info view details */}
            <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
                <Box sx={{ width: '550px', padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>Stock Transfer Info</Typography>
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
            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
                <Box sx={{ width: "400px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Stock Transfer</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Date</Typography>
                                    <Typography>{stockTransferEdit.date}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> From Location</Typography>
                                    <Typography>{stockTransferEdit.fromlocation}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Product Head</Typography>
                                    <Typography>{stockTransferEdit.producthead}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Product name</Typography>
                                    <Typography>{stockTransferEdit.productname}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">To Location</Typography>
                                    <Typography>{stockTransferEdit.tolocation}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Quantity</Typography>
                                    <Typography>{stockTransferEdit.qty}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview} >Back </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* DELETE ALERT DIALOG */}
            <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }} >
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}> Are you sure? </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMod} style={{
                        backgroundColor: '#f4f4f4', color: '#444', boxShadow: 'none', borderRadius: '3px', border: '1px solid #0000006b', '&:hover': {
                            '& .css-bluauu-MuiButtonBase-root-MuiButton-root': { backgroundColor: '#f4f4f4', },
                        },
                    }}>Cancel</Button>
                    <Button autoFocus variant="contained" color="error"  >OK </Button>
                </DialogActions>
            </Dialog>
            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}  >
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" style={{ padding: '7px 13px', color: 'white', background: 'rgb(25, 118, 210)' }} onClick={handleCloseerr}>ok  </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* Edit DIALOG */}
            <Box>
                <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth={true}>
                    <Box sx={{ padding: '20px 50px' }}>
                        <> <Grid container spacing={2}> <Typography sx={userStyle.HeaderText}>   Edit Stock Transfer </Typography> </Grid> <br />
                            <Grid item xs={12} sx={{ marginBottom: '10px' }}>
                                <Typography sx={userStyle.importheadtext}>From</Typography>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item md={6} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Branch <b style={{ color: "red" }}>*</b></Typography>
                                        <Selects placeholder='Please Select Branch' />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Floor<b style={{ color: "red" }}>*</b> </Typography>
                                        <Selects placeholder='Please Select Floor' />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Area<b style={{ color: "red" }}>*</b> </Typography>
                                        <Selects placeholder='Please Select Area' />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Location<b style={{ color: "red" }}>*</b> </Typography>
                                        <Selects placeholder='Please Select Location' />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Product Head<b style={{ color: "red" }}>*</b> </Typography>
                                        <Selects placeholder='Please Select Product Head' />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Product Name<b style={{ color: "red" }}>*</b> </Typography>
                                        <Selects placeholder='Please Select Product Name' />
                                    </FormControl>
                                </Grid>
                            </Grid><br />
                            <Grid item xs={12} sx={{ marginBottom: '10px' }}>
                                <Typography sx={userStyle.importheadtext}>To</Typography>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item md={6} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Branch <b style={{ color: "red" }}>*</b></Typography>
                                        <Selects placeholder='Please Select Branch' />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Floor<b style={{ color: "red" }}>*</b> </Typography>
                                        <Selects placeholder='Please Select Floor' />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Area<b style={{ color: "red" }}>*</b> </Typography>
                                        <Selects placeholder='Please Select Area' />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Location<b style={{ color: "red" }}>*</b> </Typography>
                                        <Selects placeholder='Please Select Location' />
                                    </FormControl>
                                </Grid>
                            </Grid><br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}><Button variant="contained"> Update</Button> </Grid><br />
                                <Grid item md={6} xs={12} sm={12}><Button sx={userStyle.btncancel} > Cancel </Button></Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>
        </Box>
    );
}
export default ManageStockTransfer;
