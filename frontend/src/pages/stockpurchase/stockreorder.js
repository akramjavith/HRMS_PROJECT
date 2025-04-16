import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PageHeading from "../../components/PageHeading";
import {
    Box, InputAdornment,
    Button,
    DialogTitle,
    TextareaAutosize,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Popover,
    Select,
    Table,
    TableBody,
    TableHead,
    TextField,
    Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaPlus, FaEdit } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import AssetDetails from "./assetmaterialpopup";
import Stockmaster from "./stockmaterialpopup";
import ManualEntry from "./manualentrypopup.js";
import AlertDialog from "../../components/Alert";
import { PleaseSelectRow } from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import MessageAlert from "../../components/MessageAlert";

//new table
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AdvancedSearchBar from '../../components/Searchbar';
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { makeStyles } from "@material-ui/core";
// import { Pageview } from "@material-ui/icons";

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

function StockReorder() {
    const [stock, setStock] = useState([]);
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [searchedString, setSearchedString] = useState("");


    const [isHandleChange, setIsHandleChange] = useState(false);


    const gridRefTableImg = useRef(null);

    const gridRefTable = useRef(null);

    const {
        isUserRoleCompare, pageName, setPageName,
        isUserRoleAccess,
    } = useContext(UserRoleAccessContext);

    // console.log(isUserRoleAccess, "isUserRoleAccess")


    const { auth } = useContext(AuthContext);

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

        "Company",
        "Branch",
        "Unit",
        "Floor",
        "Area",
        "Location",
        "Material",
        "Quantity(Balanced Count)",
    ];
    let exportRowValues = [
        "company",
        "branch",
        "unit",
        "floor",
        "area",
        "location",
        "productname",
        "balancedcount",
    ];




    const statusOpt = [
        { label: "Employee", value: "Employee" },
        { label: "Location", value: "Location" },

    ];






    //Access Module
    const pathname = window.location.pathname;
    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Stock Reorder"),
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


    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");




    const [openView, setOpenView] = useState(false);


    const handleViewOpen = () => {
        setOpenView(true);
    };
    const handlViewClose = () => {
        setOpenView(false);
    };





    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const [projectCheck, setProjectCheck] = useState(false);

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        status: true,
        unit: true,
        floor: true,
        area: true,
        location: true,
        productname: true,
        quantity: true,
        material: true,
        materialnew: true,

        employeenameto: true,
        purchasecount: true,
        purchasecountstock: true,
        requestmode: true,
        usedcount: true,
        usedcountstock: true,
        balancedcount: true,
        actions: true,
        viewactions: true,
        assetviewactions: true,
        handovercount: true,
        returncount: true,

        handovercountbtn: true,
        returncountbtn: true,
        usagecountbtn: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );


    //useEffect
    useEffect(() => {
        addSerialNumber(stock);
    }, [stock]);

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

    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    // page refersh reload code
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


    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };



    //get single row to edit....

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "StockManagement.png");
                });
            });
        }
    };

    // get particular columns for export excel

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "StockManagement",
        pageStyle: "print",
    });

    //print...
    const componentRefviewusage = useRef();
    const handleprintviewusage = useReactToPrint({
        content: () => componentRefviewusage.current,
        documentTitle: "Usage Count",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = (datas) => {
        const itemsWithSerialNumber = datas?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            item: item._id,
            // status: item.status === "Manual" ? "Manual Stock" : "Stock Purchase"
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
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );

    const columnDatatable = [

        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },

        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 130,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 150,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 140,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "floor",
            headerName: "Floor",
            flex: 0,
            width: 140,
            hide: !columnVisibility.floor,
            headerClassName: "bold-header",
        },
        {
            field: "area",
            headerName: "Area",
            flex: 0,
            width: 140,
            hide: !columnVisibility.area,
            headerClassName: "bold-header",
        },
        {
            field: "location",
            headerName: "Location",
            flex: 0,
            width: 140,
            hide: !columnVisibility.location,
            headerClassName: "bold-header",
        },
        {
            field: "productname",
            headerName: "Material",
            flex: 0,
            width: 240,
            hide: !columnVisibility.productname,
            headerClassName: "bold-header",
        },
        // {
        //     field: "requestmode",
        //     headerName: "Mode",
        //     flex: 0,
        //     width: 120,
        //     hide: !columnVisibility.requestmode,
        //     headerClassName: "bold-header",
        // },

        // {
        //     field: "purchasecount",
        //     headerName: "Quantity",
        //     flex: 0,
        //     width: 140,
        //     hide: !columnVisibility.purchasecount,
        //     headerClassName: "bold-header",
        // },

        // {
        //     field: "usedcount",
        //     headerName: "Used Count",
        //     flex: 0,
        //     width: 140,
        //     hide: !columnVisibility.usedcount,
        //     headerClassName: "bold-header",
        // },
        {
            field: "balancedcount",
            headerName: "Quanity (Balanced Count)",
            flex: 0,
            width: 180,
            hide: !columnVisibility.balancedcount,
            headerClassName: "bold-header",
        },



    ];



    const rowDataTable = filteredData.map((item, index) => {
        return {
            ...item,
            id: item.serialNumber,
            serialNumber: item.serialNumber,
            status: item.status,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            location: item.location,
            quantity: item.quantity,
            material: item.material,
            assettype: item.assettype,
            asset: item.asset,
            employeenameto: item.employeenameto,
            component: item.component,
            productname: item.productname,
            requestmode: item.requestmode,
            purchasecount: Number(item.purchasecount),
            purchasecountstock: Number(item.purchasecountstock),

            // purchasecountstock: item.uomnew,
            usedcount: item.usedcount,
            balancedcount: item.balancedcount,
            returncount: item.returncount,
            handovercount: item.handovercount,
            returncountbtn: item.returncountbtn,
            handovercountbtn: item.handovercountbtn,
            usagecount: item.usagecount,
            uomnew: item.uomnew,
            materialnew: item.materialnew,
        };
    });

    // console.log(rowDataTable, "rowdata")


    // let columnsnew = columnDatatable
    const [columnsnew, setColumnsnew] = useState(columnDatatable)
    //get all project.
    const fetchStock = async () => {
        setPageName(!pageName)
        let columnsnew1 = columnDatatable;
        setColumnsnew(columnsnew1)
        try {
            setProjectCheck(true);


            let res_project = await axios.post(SERVICE.STOCK_PURCHASE_LIMITED_REORDER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                assetmat: "Stock Material",
            });



            let single = res_project?.data?.stock;

            let singlehand = res_project.data?.stockhand;
            let singlereturn = res_project.data?.stockreturn;
            let singleusagecount = res_project.data?.stockusage;


            let singlehandtotal = singlehand.reduce((acc, current) => {

                const existingItemIndex = acc.findIndex(
                    (item) =>
                        item.company === current.company &&
                        item.branch === current.branch &&
                        item.unit === current.unit &&
                        item.floor === current.floor &&
                        item.area === current.area &&
                        item.location === current.location &&
                        item.productname === current.productname
                );

                if (existingItemIndex !== -1) {
                    // Update existing item
                    const existingItem = acc[existingItemIndex];

                    existingItem.countquantity += Number(current.countquantity);
                    existingItem._id = current._id;
                    existingItem.status = current.status;

                } else {
                    // Add new item
                    acc.push({
                        company: current.company,
                        _id: current._id,
                        branch: current.branch,
                        unit: current.unit,
                        floor: current.floor,
                        area: current.area,
                        location: current.location,
                        productname: current.productname,
                        countquantity: Number(current.countquantity),
                    });
                }
                return acc;
            }, []);


            let singlereturntotal = singlereturn.reduce((acc, current) => {
                const existingItemIndex = acc.findIndex(
                    (item) =>
                        item.company === current.company &&
                        item.branch === current.branch &&
                        item.unit === current.unit &&
                        item.floor === current.floor &&
                        item.area === current.area &&
                        item.location === current.location &&
                        item.productname === current.productname
                );

                if (existingItemIndex !== -1) {
                    // Update existing item
                    const existingItem = acc[existingItemIndex];

                    existingItem.countquantity += Number(current.countquantity);
                    existingItem._id = current._id;
                } else {
                    // Add new item
                    acc.push({
                        company: current.company,
                        _id: current._id,
                        branch: current.branch,
                        unit: current.unit,
                        floor: current.floor,
                        status: current.status,
                        area: current.area,
                        location: current.location,
                        productname: current.productname,
                        countquantity: Number(current.countquantity),
                    });
                }
                return acc;
            }, []);

            let singleusagecounttotal = singleusagecount.reduce((acc, current) => {
                const existingItemIndex = acc.findIndex(
                    (item) =>
                        item.company === current.company &&
                        item.branch === current.branch &&
                        item.unit === current.unit &&
                        item.floor === current.floor &&
                        item.area === current.area &&
                        item.location === current.location &&
                        item.productname === current.productname
                );

                if (existingItemIndex !== -1) {
                    // Update existing item
                    const existingItem = acc[existingItemIndex];

                    existingItem.countquantity += Number(current.countquantity);
                    existingItem._id = current._id;
                } else {
                    // Add new item
                    acc.push({
                        company: current.company,
                        _id: current._id,
                        branch: current.branch,
                        unit: current.unit,
                        floor: current.floor,
                        status: current.status,
                        area: current.area,
                        location: current.location,
                        productname: current.productname,
                        countquantity: Number(current.countquantity),
                    });
                }
                return acc;
            }, []);






            let result = single.flatMap((item) => {


                return item.stockmaterialarray.map((subItem) => ({
                    _id: subItem._id,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    floor: item.floor,
                    status: item.status,
                    area: item.area,
                    location: item.location,
                    requestmode: item.requestmode,
                    materialnew: subItem.materialnew,
                    quantitynew: subItem.quantitynew,

                    uomcodenew: subItem.uomcodenew,
                }));
            });

            let getfilter = result.reduce((acc, current) => {
                const existingItemIndex = acc.findIndex(
                    (item) =>
                        item.company === current.company &&
                        item.branch === current.branch &&
                        item.unit === current.unit &&
                        item.floor === current.floor &&
                        item.area === current.area &&
                        item.location === current.location &&
                        item.materialnew === current.materialnew
                );

                if (existingItemIndex !== -1) {
                    // Update existing item
                    const existingItem = acc[existingItemIndex];

                    existingItem.purchasecountstock += Number(current.quantitynew);
                    existingItem._id = current._id;
                    existingItem.requestmode = current.requestmode;
                    existingItem.productname = current.materialnew;
                    existingItem.materialnew = current.materialnew;
                    existingItem.uomcodenew = current.uomcodenew;

                } else {
                    // Add new item
                    acc.push({
                        company: current.company,
                        _id: current._id,
                        branch: current.branch,
                        unit: current.unit,
                        floor: current.floor,
                        status: current.status,
                        area: current.area,
                        location: current.location,
                        productname: current.materialnew,
                        materialnew: current.materialnew,
                        requestmode: current.requestmode,
                        uomcodenew: current.uomcodenew,
                        purchasecount: Number(current.quantitynew),
                        purchasecountstock: Number(current.quantitynew),
                    });
                }
                return acc;
            }, []);

            let merge = getfilter.map((item) => {


                let findquantity = singlehandtotal.find(
                    (d) =>
                        item.company === d.company &&
                        item.branch === d.branch &&
                        item.unit === d.unit &&
                        item.floor === d.floor &&
                        item.area === d.area &&
                        item.location === d.location &&
                        item.productname === d.productname
                );

                let findreturnquantity = singlereturntotal.find(
                    (d) =>
                        item.company === d.company &&
                        item.branch === d.branch &&
                        item.unit === d.unit &&
                        item.floor === d.floor &&
                        item.area === d.area &&
                        item.location === d.location &&
                        item.productname === d.productname
                );

                let findusagecount = singleusagecounttotal.find(
                    (d) =>
                        item.company === d.company &&
                        item.branch === d.branch &&
                        item.unit === d.unit &&
                        item.floor === d.floor &&
                        item.area === d.area &&
                        item.location === d.location &&
                        item.productname === d.productname
                );

                let matchHandItems =
                    singlehandtotal.length > 0
                        ? findquantity
                            ? findquantity.countquantity
                            : 0
                        : 0;
                let matchReturnItems =
                    singlereturntotal.length > 0
                        ? findreturnquantity
                            ? findreturnquantity.countquantity
                            : 0
                        : 0;

                // console.log(matchReturnItems, "return")

                let matchUsageCountItems =
                    singleusagecounttotal.length > 0
                        ? findusagecount
                            ? findusagecount.countquantity
                            : 0
                        : 0;
                // console.log(matchItems, "matchItems")

                if (matchHandItems || matchReturnItems || matchUsageCountItems) {
                    let matchqty = matchHandItems ? Number(matchHandItems) : 0;
                    let allused = Number(matchHandItems) - Number(matchReturnItems)

                    // let allused = usedcountqty + Number(matchUsageCountItems)
                    // console.log(matchqty, "matchqty")
                    return {
                        ...item,
                        purchasecountstock: Number(item.purchasecountstock),
                        usedcount: allused,
                        balancedcount:
                            Number(item.purchasecountstock) -
                            Number(allused),

                        handovercount: Number(matchHandItems),
                        returncount: Number(matchReturnItems),
                        usagecount: Number(matchUsageCountItems),
                    };
                } else {
                    return {
                        ...item,
                        usedcount: 0,
                        handovercount: 0,
                        returncount: 0,
                        usagecount: 0,
                        balancedcount: Number(item.purchasecountstock) - 0,
                    };
                }
            });

            // console.log(merge, "mergestock")
            let quantityAndUom = merge.filter((data, newindex) => {
                let matchedsotck = res_project.data.managestockitems.find(item => item.itemname == data.productname)
                let lessmin = matchedsotck ? data.balancedcount <= matchedsotck.minimumquantity : false

                if (lessmin) {
                    return {
                        ...data,

                    }
                }
            });




            setStock(quantityAndUom);



            setProjectCheck(false);
        } catch (err) {
            setProjectCheck(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchStock()
    }, [])

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
    const filteredColumns = columnsnew.filter((column) =>
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
                                columnsnew.forEach((column) => {
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






    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };




    const [fileFormat, setFormat] = useState("");




    return (
        <Box>
            <Headtitle title={"STOCK REORDER"} />
            {/* ****** Header Content ****** */}
            {/* <Typography sx={userStyle.HeaderText}>Manage Stock Reorder</Typography> */}
            <PageHeading
                title="Manage Stock Reorder"
                modulename="Asset"
                submodulename="Stock"
                mainpagename="Stock Reorder"
                subpagename=""
                subsubpagename=""
            />


            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lstockreorder") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Stock Reorder List
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
                                        <MenuItem value={stock?.length}>All</MenuItem>
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
                                    {isUserRoleCompare?.includes("excelstockreorder") && (
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
                                    {isUserRoleCompare?.includes("csvstockreorder") && (
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
                                    {isUserRoleCompare?.includes("printstockreorder") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfstockreorder") && (
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
                                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                        {" "}
                                        <ImageIcon
                                            sx={{ fontSize: "15px" }}
                                        /> &ensp;Image&ensp;{" "}
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <AggregatedSearchBar
                                    columnDataTable={columnsnew}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={stock}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={stock}
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
                        &ensp;

                        <br />
                        <br />
                        {projectCheck ? (
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
                                            columnDataTable={columnsnew}
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
                                            itemsList={stock}
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










            {/* EXTERNAL COMPONENTS -------------- START */}
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
                itemsTwo={stock ?? []}
                filename={"Stock Reorder"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />




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
            {/* EXTERNAL COMPONENTS -------------- END */}








        </Box>
    );
}

export default StockReorder;
