import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import {
    Box,
    Typography, InputAdornment,
    OutlinedInput,
    TableBody,
    TableRow,
    TableCell,
    Select,
    MenuItem,
    Dialog,
    DialogContent,
    DialogActions,
    FormControl,
    Grid,
    Paper,
    Table,
    TableHead,
    TableContainer,
    Button,
    List,
    ListItem,
    ListItemText,
    Popover,
    Checkbox,
    TextField,
    IconButton,
} from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import { handleApiError } from "../../components/Errorhandling";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import StyledDataGrid from "../../components/TableStyle";
import Selects from "react-select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PageHeading from "../../components/PageHeading";
import ExportData from "../../components/ExportData";
//new table
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AdvancedSearchBar from '../../components/Searchbar.js';
import AggregatedSearchBar from "../../components/AggregatedSearchBar.js";
import AggridTable from "../../components/AggridTable.js";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";


function AssignedIPList() {
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);


    const [ipmasters, setIpmasters] = useState([]);

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

    let exportColumnNames = [
        'IP Address',
        'Company',
        'Branch',
        'Unit',
        'Floor',
        'Location',
        'Area',
        'Asset Material',
        'Asset Material Code',
    ];
    let exportRowValues = [
        'ipaddress',
        'company',
        'branch',
        'unit',
        'floor',
        'location',
        'area',
        'assetmaterial',
        'assetmaterialcode'
    ];



    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    const [searchQuery, setSearchQuery] = useState("");

    const [materialOpt, setMaterialopt] = useState([]);
    const [materialOptcode, setMaterialoptCode] = useState([]);

    const { isUserRoleCompare, buttonStyles, isUserRoleAccess, isAssignBranch, allfloor, allareagrouping, alllocationgrouping, pageName, setPageName } = useContext(
        UserRoleAccessContext
    );


    const { auth } = useContext(AuthContext);

    const [reasonmasterCheck, setReasonmastercheck] = useState(false);

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);

    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [copiedData, setCopiedData] = useState("");

    const [floors, setFloors] = useState([]);
    const [areas, setAreas] = useState([]);
    // const [locations, setLocations] = useState([]);
    const [locations, setLocations] = useState([]);


    const delReasoncheckbox = async () => {
        setPageName(!pageName)
        try {

            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.IPMASTER_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);

            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);

            await fetchIpMaster();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [getid, setGetid] = useState({
        ipaddress: "Please Select IP",
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        floor: "Please Select Floor",
        area: "Please Select Area",
        location: "Please Select Location",
        assetmaterial: "Please Select AssetMaterial",
        assetmaterialcode: "Please Select Asset Material Code",
    });
    const [getidView, setGetidView] = useState([]);

    const getCode = async (
        id,
        ipaddress,
        company,
        branch,
        unit,
        team,
        employeename,
        assignedthrough,
        floor,
        location,
        area,
        assetmaterial,
        assetmaterialcode,
        updatedby
    ) => {


        setPageName(!pageName)
        try {
            setGetid({
                ...getid,
                id: id,
                ipaddress: ipaddress,
                company: company,
                branch: branch,
                unit: unit,
                team: team,
                employeename: employeename,
                assignedthrough: assignedthrough,
                floor: floor,
                location: location,
                area: area,
                assetmaterial: assetmaterial,
                assetmaterialcode: assetmaterialcode,
                updatedby: updatedby,
            });

            await fetchFloor(branch);
            await fetchArea(floor);
            await fetchMaterial();
            await fetchMaterialCode();

            handleClickOpenEdit();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    const getViewCode = async (
        id,
        ipaddress,
        company,
        branch,
        unit,
        team,
        employeename,
        assignedthrough,
        floor,
        location,
        area,
        assetmaterial,
        assetmaterialcode,
        updatedby
    ) => {
        setPageName(!pageName)
        try {

            setGetidView({
                ...getidView,
                id: id,
                ipaddress: ipaddress,
                company: company,
                branch: branch,
                updatedby: updatedby,
                unit: unit,
                team: team,
                employeename: employeename,
                assignedthrough: assignedthrough,
                floor: floor,
                area: area,
                location: location,
                assetmaterialcode: assetmaterialcode,
                assetmaterial: assetmaterial,
            });
            await fetchFloor(branch);
            await fetchArea(floor);
            handleClickOpenview();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const [infoupdate, setInfoupdate] = useState([]);
    const [infoadd, setInfoadd] = useState([]);

    const getCodeinfo = async (updatedby, addedby) => {
        setInfoupdate(updatedby);
        setInfoadd(addedby);

        handleClickOpeninfo();
    };

    //image


    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Assingned IP.png");
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
    const [anchorEl, setAnchorEl] = useState(null);

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


    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        ipaddress: true,
        company: true,
        branch: true,
        unit: true,
        floor: true,
        location: true,
        area: true,
        assetmaterial: true,
        assetmaterialcode: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    //get all Sub vendormasters.
    const fetchIpMaster = async () => {
        setPageName(!pageName)


        try {
            let res_vendor = await axios.get(SERVICE.IPMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setReasonmastercheck(true);
            // let arrval = (res_vendor?
            const mergedArray = (res_vendor?.data?.ipmaster || [])
                .map((item) => ({
                    ...item,
                    ipconfig: item.ipconfig?.filter(
                        (ipItem) =>
                            ipItem.status === "assigned"

                    ),
                }))
                .flatMap((item) => item.ipconfig || []);
            let finaldata = mergedArray.filter(ipItem =>

                accessbranch.some(
                    (d) =>
                        d.company.includes(ipItem.company) &&
                        d.branch.includes(ipItem.branch) &&
                        d.unit.includes(ipItem.unit)

                )
            )
            setIpmasters(finaldata?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                id: item._id
            })));
        } catch (err) {
            setReasonmastercheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }


    }



    // Excel
    const fileName = "Assigned IP";

    useEffect(() => {
        fetchIpMaster();
    }, []);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {

        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(ipmasters);
    }, [ipmasters]);

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

    const columnDataTable = [

        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },

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
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "ipaddress",
            headerName: "IP Address",
            flex: 0,
            width: 140,
            hide: !columnVisibility.ipaddress,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 140,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 140,
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
            field: "location",
            headerName: "Location ",
            flex: 0,
            width: 140,
            hide: !columnVisibility.location,
            headerClassName: "bold-header",
        },
        {
            field: "area",
            headerName: "Area ",
            flex: 0,
            width: 140,
            hide: !columnVisibility.area,
            headerClassName: "bold-header",
        },
        {
            field: "assetmaterial",
            headerName: "Asset Material ",
            flex: 0,
            width: 140,
            hide: !columnVisibility.assetmaterial,
            headerClassName: "bold-header",
        },
        {
            field: "assetmaterialcode",
            headerName: "Asset Material Code",
            flex: 0,
            width: 140,
            hide: !columnVisibility.assetmaterialcode,
            headerClassName: "bold-header",
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 300,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("eassignedip") && (
                        <>
                            {params.data.assignedthrough === "Password" ? (
                                <Button sx={userStyle.buttonedit}></Button>
                            ) : (
                                <Button
                                    sx={userStyle.buttonedit}
                                    onClick={() => {
                                        // handleClickOpenEdit();
                                        getCode(
                                            params.data.id,
                                            params.data.ipaddress,
                                            params.data.company,
                                            params.data.branch,
                                            params.data.unit,
                                            params.data.team,
                                            params.data.employeename,
                                            params.data.assignedthrough,
                                            params.data.floor,
                                            params.data.location,
                                            params.data.area,
                                            params.data.assetmaterial,
                                            params.data.assetmaterialcode,
                                            params.data.updatedby
                                        );
                                    }}
                                >
                                    <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                                </Button>
                            )}
                        </>
                    )}
                    {isUserRoleCompare?.includes("dassignedip") && (
                        <>
                            {params.data.assignedthrough === "Password" ? (
                                <Button sx={userStyle.buttondelete}></Button>
                            ) : (
                                <Button
                                    sx={userStyle.buttondelete}
                                    onClick={(e) => {
                                        getCodedelete(params.data.id);
                                    }}
                                >
                                    <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                                </Button>
                            )}
                        </>
                    )}
                    {isUserRoleCompare?.includes("vassignedip") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                // handleClickOpenview();
                                getViewCode(
                                    params.data.id,
                                    params.data.ipaddress,
                                    params.data.company,
                                    params.data.branch,
                                    params.data.unit,
                                    params.data.team,
                                    params.data.employeename,
                                    params.data.assignedthrough,
                                    params.data.floor,
                                    params.data.location,
                                    params.data.area,
                                    params.data.assetmaterial,
                                    params.data.assetmaterialcode
                                );
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iassignedip") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCodeinfo(params.data.updatedby, params.data.addedby);
                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            ipaddress: item.ipaddress,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item?.team,
            employeename: item?.employeename,
            assignedthrough: item?.assignedthrough,
            floor: item.floor,
            assetmaterialcode: item.assetmaterialcode,
            area: item.area,
            location: item.location,
            assetmaterial: item.assetmaterial,
            updatedby: item.updatedby,
            addedby: item.addedby,
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


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Assigned IP",
        pageStyle: "print",
    });


    const fetchFloor = async (e) => {

        let result = allfloor.filter((d) => d.branch.includes(e));

        const floorall = result.map((d) => ({
            ...d,
            label: d.name,
            value: d.name,
        }));

        setFloors(floorall);
    };

    const fetchArea = async (e) => {

        setAreas(allareagrouping);
    };

    const fetchAllLocation = async () => {
        setLocations(alllocationgrouping);
    };
    // const fetchAllLocation = async () => {
    //   // Assuming alllocationgrouping is an array of location objects
    //   const allLocations = [{ label: "ALL", value: "ALL" }, ...alllocationgrouping];
    //   setLocations(allLocations);
    // };

    const fetchMaterial = async () => {
        setPageName(!pageName)
        try {
            // let res = await axios.get(SERVICE.ASSETS, {
            //   headers: {
            //     Authorization: `Bearer ${auth.APIToken}`,
            //   },
            // });

            // const result = [
            //   ...res?.data?.assetmaterial.map((d) => ({
            //     ...d,
            //     label: d.name,
            //     value: d.name,
            //   })),
            // ];



            let res = await axios.get(SERVICE.ASSETMATERIALIP, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });



            const result = res?.data?.assetmaterialip



            setMaterialopt(result);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    console.log(getid, "getid")

    const fetchMaterialCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.ASSETMATERIALIP, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });



            const result = res?.data?.assetmaterialip




            setMaterialoptCode(result);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            ;
        }
    };

    useEffect(() => {
        fetchAllLocation();
        // fetchMaterial();

    }, []);

    const [deleteid, setDeleteId] = useState("");

    const getCodedelete = async (id) => {
        try {
            setDeleteId(id);

            handleClickOpen();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const rowData = async () => {
        setPageName(!pageName)
        try {
            let subprojectscreate = await axios.post(SERVICE.IPMASTER_DELETE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                updatevalue: deleteid,
            });

            await fetchIpMaster();
            handleCloseMod();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    let updateby = getid?.updatedby ? getid?.updatedby : [];

    const sendRequest = async () => {
        setPageName(!pageName)
        try {
            let subprojectscreate = await axios.post(
                SERVICE.IPMASTER_UPDATE_UPDATEBY,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    updatevalue: getid.id,
                    ipaddress: String(getid.ipaddress),
                    company: String(getid.company),
                    branch: String(getid.branch),
                    unit: String(getid.unit),
                    floor: String(getid.floor),
                    location: String(getid.location),
                    area: String(getid.area),
                    assetmaterial: String(getid.assetmaterial),
                    assetmaterialcode: String(getid.assetmaterialcode),
                    status: "assigned",
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );

            await fetchIpMaster();
            setGetid({
                ipaddress: "",
                company: "Please Select Company",
                branch: "Please Select Branch",
                unit: "Please Select Unit",
                floor: "Please Select Floor",
                area: "Please Select Area",
                location: "Please Select Location",
                assetmaterial: "Please Select Asset Material",
            });
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //submit option for saving
    const handleSubmit = (e) => {
        setPageName(!pageName)
        e.preventDefault();
        if (getid?.ipaddress === "Please Select IP") {

            setPopupContent("Please Select IP");
            setPopupSeverity("warning");
            handleClickOpenPopup();
        } else if (getid?.company === "Please Select Company") {

            setPopupContent("Please Select Company");
            setPopupSeverity("warning");
            handleClickOpenPopup();
        } else if (getid?.branch === "Please Select Branch") {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (getid?.unit === "Please Select Unit") {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (getid?.floor === "Please Select Floor") {
            setPopupContentMalert("Please Select Floor");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (getid?.location === "Please Select Location") {
            setPopupContentMalert("Please Select Location");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (getid?.area === "Please Select Area") {
            setPopupContentMalert("Please Select Area");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (getid?.assetmaterial === "Please Select AssetMaterial") {
            setPopupContentMalert("Please Select AssetMaterial");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (getid?.assetmaterialcode === "Please Select Asset Material Code" || getid?.assetmaterialcode === "") {

            setPopupContentMalert("Please Select AssetMaterial Code");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    };

    //Access Module

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Assigned IP"),
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
    const pathname = window.location.pathname;

    const accessbranch = isAssignBranch
        ?.filter((data) => {
            let fetfinalurl = [];
            // Check if user is a Manager, in which case return all branches
            if (isUserRoleAccess?.role?.includes("Manager")) {
                return true; // Skip filtering, return all data for Manager
            }
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

    return (
        <Box>
            <Headtitle title={"Assigned IP"} />

            <PageHeading
                title=" Assigned IP"
                modulename="Network Administration"
                submodulename="IP"
                mainpagename="Assigned IP "
                subpagename=""
                subsubpagename=""
            />
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lassignedip") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Assigned IP List
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
                                        <MenuItem value={ipmasters?.length}>All</MenuItem>
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
                                    {isUserRoleCompare?.includes("excelassignedip") && (
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
                                    {isUserRoleCompare?.includes("csvassignedip") && (
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
                                    {isUserRoleCompare?.includes("printassignedip") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfassignedip") && (
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
                                    {isUserRoleCompare?.includes("imageassignedip") && (
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
                                    maindatas={ipmasters}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={ipmasters}
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
                        {!reasonmasterCheck ? (
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
                                            // totalDatas={totalDatas}
                                            searchQuery={searchedString}
                                            handleShowAllColumns={handleShowAllColumns}
                                            setFilteredRowData={setFilteredRowData}
                                            filteredRowData={filteredRowData}
                                            setFilteredChanges={setFilteredChanges}
                                            filteredChanges={filteredChanges}
                                            gridRefTableImg={gridRefTableImg}
                                            itemsList={ipmasters}
                                        />
                                    </>
                                </Box>
                            </>
                        )}
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
                            <TableCell> IP Address</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Floor</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Area</TableCell>
                            <TableCell>Asset Material</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTable &&
                            rowDataTable.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.ipaddress}</TableCell>
                                    <TableCell>{row.company}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.floor}</TableCell>
                                    <TableCell>{row.location}</TableCell>
                                    <TableCell>{row.area}</TableCell>
                                    <TableCell>{row.assetmaterial}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ALERT DIALOG */}
            <Dialog
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                >
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "70px", color: "orange" }}
                    />
                    <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                        Please Select any Row
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        variant="contained"
                        color="error"
                        onClick={handleCloseModalert}
                    >
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>

            <Box>
                <Dialog
                    open={isDeleteOpencheckbox}
                    onClose={handleCloseModcheckbox}
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
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={(e) => delReasoncheckbox(e)}
                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

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
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                    }}
                >
                    <Box sx={{ padding: "20px" }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>
                                {" "}
                                Assigned IP Edit
                            </Typography>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            IP Address<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={getid.ipaddress}
                                        // onChange={(e) => {
                                        //   setGetid({
                                        //     ...getid,
                                        //     ipaddress: e.target.value,
                                        //   });
                                        // }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={accessbranch?.map(data => ({
                                                label: data.company,
                                                value: data.company,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            styles={colourStyles}
                                            value={{ label: getid.company, value: getid.company }}
                                            onChange={(e) => {
                                                setGetid({
                                                    ...getid,
                                                    company: [e.value],
                                                    branch: "Please Select Branch",
                                                    unit: "Please Select Unit",
                                                    floor: "Please Select Floor",
                                                    location: "Please Select Location",
                                                    area: "Please Select Area",
                                                    assetmaterialcode: "Please Select Asset Material Code",
                                                    assetmaterial: "Please Select AssetMaterial"
                                                });
                                                setFloors([])
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
                                            options={accessbranch?.filter(
                                                (comp) =>
                                                    getid.company.includes(comp.company)
                                            )?.map(data => ({
                                                label: data.branch,
                                                value: data.branch,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            styles={colourStyles}
                                            value={{ label: getid.branch, value: getid.branch }}
                                            onChange={(e) => {
                                                setGetid({
                                                    ...getid,
                                                    branch: [e.value],
                                                    unit: "Please Select Unit",
                                                    floor: "Please Select Floor",
                                                    area: "Please Select Area",
                                                    location: "Please Select Location",
                                                    assetmaterialcode: "Please Select Asset Material Code",
                                                    assetmaterial: "Please Select AssetMaterial",
                                                });
                                                fetchFloor(e.value);
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
                                            options={accessbranch?.filter(
                                                (comp) =>
                                                    getid.company.includes(comp.company) &&
                                                    getid.branch.includes(comp.branch)
                                            )?.map(data => ({
                                                label: data.unit,
                                                value: data.unit,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            styles={colourStyles}
                                            value={{ label: getid.unit, value: getid.unit }}
                                            onChange={(e) => {
                                                setGetid({
                                                    ...getid,
                                                    unit: [e.value],
                                                    floor: "Please Select Floor",
                                                    assetmaterialcode: "Please Select Asset Material Code",
                                                    assetmaterial: "Please Select AssetMaterial"
                                                });
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
                                            options={floors}
                                            styles={colourStyles}
                                            value={{ label: getid.floor, value: getid.floor }}
                                            onChange={(e) => {
                                                setGetid({
                                                    ...getid,
                                                    floor: e.value,
                                                    area: "Please Select Area",
                                                    location: "Please Select Location",
                                                    assetmaterialcode: "Please Select Asset Material Code",
                                                    assetmaterial: "Please Select AssetMaterial"
                                                });
                                                fetchArea(e.value);
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
                                            options={areas
                                                ?.find(
                                                    (subpro) =>
                                                        getid.company.includes(subpro.company) &&
                                                        getid.branch.includes(subpro.branch) &&
                                                        getid.unit.includes(subpro.unit) &&
                                                        subpro.floor === getid.floor
                                                )
                                                ?.area?.map((subpro) => ({
                                                    ...subpro,
                                                    label: subpro,
                                                    value: subpro,
                                                }))}
                                            styles={colourStyles}
                                            value={{ label: getid.area, value: getid.area }}
                                            onChange={(e) => {
                                                setGetid({ ...getid, area: e.value, assetmaterialcode: "Please Select Asset Material Code", assetmaterial: "Please Select AssetMaterial" });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Location<b style={{ color: "red" }}>*</b>
                                        </Typography>

                                        <Selects
                                            options={[
                                                ...new Set([
                                                    "ALL",
                                                    ...(locations
                                                        ?.find(
                                                            (subpro) =>
                                                                getid.company.includes(subpro.company) &&
                                                                getid.branch.includes(subpro.branch) &&
                                                                getid.unit.includes(subpro.unit) &&
                                                                subpro.floor === getid.floor
                                                        )
                                                        ?.location.flat() || [])  // Provide an empty array if find returns undefined
                                                ])
                                            ].map((subpro) => ({
                                                label: subpro,
                                                value: subpro,
                                            }))}
                                            styles={colourStyles}
                                            value={{ label: getid.location, value: getid.location }}
                                            onChange={(e) => {
                                                setGetid({ ...getid, location: e.value, assetmaterialcode: "Please Select Asset Material Code", assetmaterial: "Please Select AssetMaterial" });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Asset Material<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            // options={materialOpt}
                                            options={
                                                Array.from(
                                                    new Set(
                                                        materialOpt
                                                            .filter(
                                                                (subpro) =>
                                                                    subpro.ip === true &&
                                                                    getid.company.includes(subpro.company) &&
                                                                    getid.branch.includes(subpro.branch) &&
                                                                    getid.unit.includes(subpro.unit) &&
                                                                    subpro.floor === getid.floor &&
                                                                    subpro.area === getid.area &&
                                                                    subpro.location === getid.location
                                                            )
                                                            .map((t) => ({
                                                                ...t,
                                                                label: t.assetmaterial,
                                                                value: t.assetmaterial,
                                                            }))

                                                    )
                                                )
                                            }


                                            styles={colourStyles}
                                            value={{
                                                label: getid.assetmaterial,
                                                value: getid.assetmaterial,
                                            }}
                                            onChange={(e) => {
                                                setGetid({ ...getid, assetmaterial: e.value, assetmaterialcode: "Please Select Asset Material Code" });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Asset Material Code<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={
                                                Array.from(
                                                    new Set(
                                                        materialOptcode
                                                            .filter(
                                                                (subpro) =>
                                                                    getid.company.includes(subpro.company) &&
                                                                    getid.branch.includes(subpro.branch) &&
                                                                    getid.unit.includes(subpro.unit) &&
                                                                    subpro.floor === getid.floor &&
                                                                    subpro.area === getid.area &&
                                                                    subpro.location === getid.location &&
                                                                    subpro.assetmaterial === getid.assetmaterial
                                                            )
                                                            .map((t) => ({
                                                                ...t,
                                                                label: t.component,
                                                                value: t.component,
                                                            }))

                                                    )
                                                )
                                            }


                                            styles={colourStyles}
                                            value={{
                                                label: getid.assetmaterialcode,
                                                value: getid.assetmaterialcode,
                                            }}
                                            onChange={(e) => {
                                                setGetid({ ...getid, assetmaterialcode: e.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            <br />
                            <Grid container>
                                <Grid item md={3} xs={12} sm={6}>
                                    <Button
                                        variant="contained"
                                        sx={buttonStyles.buttonsubmit}
                                        onClick={handleSubmit}
                                    >
                                        Update
                                    </Button>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>

            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{ marginTop: "95px" }}
                maxWidth="md"
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Assigned IP</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> IP Address</Typography>
                                    <Typography>{getidView.ipaddress}</Typography>
                                </FormControl>
                            </Grid>
                            {getidView?.assignedthrough === "Password" && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Company</Typography>
                                        <Typography>
                                            {getidView.company
                                                ?.map((t, i) => `${i + 1 + ". "}` + t)
                                                .toString()}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                            )}
                            {getidView?.assignedthrough !== "Password" && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Company</Typography>
                                        <Typography>{getidView.company}</Typography>
                                    </FormControl>
                                </Grid>
                            )}
                            {getidView?.assignedthrough === "Password" && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Branch</Typography>
                                        <Typography>
                                            {getidView.branch
                                                ?.map((t, i) => `${i + 1 + ". "}` + t)
                                                .toString()}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                            )}
                            {getidView?.assignedthrough !== "Password" && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Branch</Typography>
                                        <Typography>{getidView.branch}</Typography>
                                    </FormControl>
                                </Grid>
                            )}
                            {getidView?.assignedthrough === "Password" && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Unit</Typography>
                                        <Typography>
                                            {getidView.unit
                                                ?.map((t, i) => `${i + 1 + ". "}` + t)
                                                .toString()}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                            )}
                            {getidView?.assignedthrough !== "Password" && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Unit</Typography>
                                        <Typography>{getidView.unit}</Typography>
                                    </FormControl>
                                </Grid>
                            )}
                            {getidView?.assignedthrough === "Password" && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Team</Typography>
                                        <Typography>
                                            {getidView?.team
                                                ?.map((t, i) => `${i + 1 + ". "}` + t)
                                                .toString()}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                            )}
                            {getidView?.assignedthrough === "Password" && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Employee Name</Typography>
                                        <Typography>{getidView?.employeename}</Typography>
                                    </FormControl>
                                </Grid>
                            )}
                            {getidView?.assignedthrough !== "Password" && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Floor</Typography>
                                        <Typography>{getidView.floor}</Typography>
                                    </FormControl>
                                </Grid>
                            )}
                            {getidView?.assignedthrough !== "Password" && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Location</Typography>
                                        <Typography>{getidView.location}</Typography>
                                    </FormControl>
                                </Grid>
                            )}
                            {getidView?.assignedthrough !== "Password" && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Area</Typography>
                                        <Typography>{getidView.area}</Typography>
                                    </FormControl>
                                </Grid>
                            )}
                            {getidView?.assignedthrough !== "Password" && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Asset Material</Typography>
                                        <Typography>{getidView.assetmaterial}</Typography>
                                    </FormControl>
                                </Grid>

                            )}
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Asset Material Code</Typography>
                                    <Typography>{getidView.assetmaterialcode}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                variant="contained"
                                sx={buttonStyles.buttonsubmit}
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
                        onClick={(e) => rowData()}
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
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>Assigned IP Info</Typography>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">addedby</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {"SNO"}.
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"UserName"}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"Date"}
                                            </StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {infoadd?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {i + 1}.
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {item.name}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                                                    </StyledTableCell>
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
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {"SNO"}.
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"UserName"}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"Date"}
                                            </StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {infoupdate?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {i + 1}.
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {item.name}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                                                    </StyledTableCell>
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
                filteredDataTwo={(filteredRowData.length > 0 ? filteredRowData : filteredData) ?? []}
                itemsTwo={ipmasters ?? []}
                filename={"Assinged IP"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

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
        </Box>
    );
}

export default AssignedIPList;