import CloseIcon from '@mui/icons-material/Close';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import ImageIcon from '@mui/icons-material/Image';
import LastPageIcon from '@mui/icons-material/LastPage';
import MenuIcon from "@mui/icons-material/Menu";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl, Grid,
    IconButton,
    List, ListItem, ListItemText,
    MenuItem,
    OutlinedInput,
    Popover,
    Select,
    TextField,
    Typography
} from "@mui/material";
import Switch from '@mui/material/Switch';
import { styled } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { Link } from "react-router-dom";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../../components/Alert";
import { handleApiError } from "../../../components/Errorhandling";
import ExportData from "../../../components/ExportData";
import Headtitle from "../../../components/Headtitle";
import MessageAlert from "../../../components/MessageAlert";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { colourStyles, userStyle } from "../../../pageStyle";
import { SERVICE } from '../../../services/Baseservice';
import PageHeading from "../../../components/PageHeading";
import { ThreeDots } from 'react-loader-spinner';


function Nonproductionunitallot() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [nonproductionArray, setNonProductionAllotArray] = useState([])
    const [fileFormat, setFormat] = useState("");
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
    const [assignedBy, setAssignedBy] = useState({
        assignedname: ""
    });
    const [nonproductionunitAllot, setNonproductionunitAllot] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch"
    });
    const [isAddOpenalert, setAddOpenalert] = useState(false);
    const [isActive, setIsActive] = useState(false)
    const [assignedByEdit, setAssignedByEdit] = useState({
        companyname: "",
    })
    const [assignedByAllotEdit, setAssignedByAllotEdit] = useState({
        category: "Please Select Category",
        subcategory: "Please Select Sub Category",
    })
    const [sources, setAssignedby] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [branchOpt, setBranches] = useState([])
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, buttonStyles, pageName, setPageName, } = useContext(UserRoleAccessContext);
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

                const remove = [window.location.pathname?.substring(1), window.location.pathname]
                return fetfinalurl?.some((item) => remove?.includes(item));
            })
            ?.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }));
    const { auth } = useContext(AuthContext);
    const username = isUserRoleAccess.companyname
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');
    const [catOpt, setCatOpt] = useState([])
    const [subCatOpt, setSubCatOpt] = useState([])
    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Non Production Unit Allot.png');
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
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
        setIsActive(false)
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
        company: true,
        branch: true,
        unit: true,
        team: true,
        employeename: true,
        actions: true,
        allot: true
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };
    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setIsEditOpen(false);
        setAssignedByAllotEdit({
            ...assignedByAllotEdit,
            category: "Please Select Category",
            subcategory: "Please Select Sub Category",
        })
    };
    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName)
        try {
            let subprojectscreate = await axios.post(SERVICE.NONPRODUCTIONUNITALLOT_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                category: String(assignedByAllotEdit.category),
                subcategory: String(assignedByAllotEdit.subcategory),
                company: String(assignedByEdit.company),
                branch: String(assignedByEdit.branch),
                unit: String(assignedByEdit.unit),
                team: String(assignedByEdit.team),
                employeename: String(assignedByEdit.companyname),
                employeecode: String(assignedByEdit.empcode),
                empid: String(assignedByEdit._id),
                addedby: [
                    {
                        name: String(username),
                        date: String(new Date()),
                    },
                ],
            });
            fetchNonProductionBy();
            handleCloseModEdit()
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    const editSubmit = (e) => {
        e.preventDefault();
        const filtDup = nonproductionArray
            ?.filter((item) => item?.empid === assignedByEdit?._id)
            ?.some((item) => {
                return (
                    item?.category === assignedByAllotEdit.category &&
                    item?.subcategory === assignedByAllotEdit.subcategory
                );
            });
        if (assignedByAllotEdit.category === "Please Select Category") {
            setPopupContentMalert("Please Select Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assignedByAllotEdit.subcategory === "Please Select Sub Category") {
            setPopupContentMalert("Please Select Sub Category");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (filtDup) {
            setPopupContentMalert("Category & Sub Category Already Alloted");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    }
    const exportColumnNames = ['Company', 'Branch', 'Unit', 'Team', 'Employee Name']
    const exportRowValues = ['company', 'branch', 'unit', 'team', 'employeename']
    // Excel
    const fileName = "Non Production Unit Allot";
    const [sourceData, setSourceData] = useState([]);
    // get particular columns for export excel 
    const getexcelDatas = () => {
        var data = rowDataTable?.map((t, index) => ({
            "Sno": index + 1,
            "Assigned Name": t.assignedname,
        }));
        setSourceData(data);
    }
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Non Production Unit Allot',
        pageStyle: 'print'
    });

    useEffect(() => {
        getapi();
        fetchNonProductionBy();
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Non Production Unit Allot"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.companyname),
                    date: String(new Date()),
                },
            ],
        });

    }

    useEffect(() => {
        getexcelDatas();
    }, [assignedByEdit, assignedBy, sources])
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
        const itemsWithSerialNumber = sources?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }
    useEffect(() => {
        addSerialNumber();
    }, [sources])
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
    const getCodeEmp = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAssignedByEdit(res?.data?.suser)
            getCategoryAndSubcategory()
            handleClickOpenEdit();
            // setPfesiForm(res?.data?.suser);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const getCategoryAndSubcategory = async () => {
        setPageName(!pageName)
        try {
            let NonProduction = await axios.get(`${SERVICE.NONPRODUCTIONUNITALLOT}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let response = await axios.get(`${SERVICE.CATEGORYANDSUBCATEGORYGETALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const CatOptall = [...response?.data?.categoryandsubcategory?.map((t) => ({
                ...t,
                label: t.categoryname,
                value: t.categoryname,
            }))]
            const filterAlloted = NonProduction?.data?.nonproductionunitallot?.filter((item) =>
                item?.employeename?.toLowerCase() === isUserRoleAccess?.companyname?.toLowerCase())
            const CatOpt = filterAlloted?.map((t) => ({
                ...t,
                label: t.category,
                value: t.category,
            }))
            const removeDup = CatOpt.filter((item, index, self) =>
                index === self.findIndex((t) => t.value === item.value)
            );

            if (!isUserRoleAccess.role.includes("Manager")) {
                setCatOpt(removeDup)
            } else {
                setCatOpt(CatOptall)
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const getCategoryAndSubcategoryEdit = async (e) => {
        setPageName(!pageName)
        try {
            let NonProduction = await axios.get(`${SERVICE.NONPRODUCTIONUNITALLOT}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let response = await axios.get(`${SERVICE.CATEGORYANDSUBCATEGORYGETALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // const CatOpt = [...response?.data?.categoryandsubcategory?.map((t) => ({
            //     ...t,
            //     label: t.categoryname,
            //     value: t.categoryname,
            // }))]
            // setCatOpt(CatOpt)
            // let result = response?.data?.categoryandsubcategory.find((d) => d.categoryname === e.categoryname);
            // const subcatealls = result?.subcategoryname?.map((d) => ({
            //     label: d,
            //     value: d,
            // }));

            let resultall = response?.data?.categoryandsubcategory.find((d) => d.categoryname === e.categoryname);
            const subcatealls = resultall?.subcategoryname?.map((d) => ({
                label: d,
                value: d,
            }));
            const filterAlloted =
                NonProduction?.data?.nonproductionunitallot?.filter((item) =>
                    item?.employeename?.toLowerCase() === isUserRoleAccess?.companyname?.toLowerCase()
                    &&
                    item?.category?.toLowerCase() ===
                    e?.value?.toLowerCase())
            const result = filterAlloted?.map((t) => ({
                ...t,
                label: t.subcategory,
                value: t.subcategory,
            }))
            const removeDup = result.filter((item, index, self) =>
                index === self.findIndex((t) => t.value === item.value)
            );
            if (!isUserRoleAccess.role.includes("Manager")) {
                setSubCatOpt(removeDup)
            } else {
                setSubCatOpt(subcatealls)
            }
            // setSubCatOpt(subcatealls)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const columnDataTable = [

        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 100, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
        },
        { field: "company", headerName: "Company", flex: 0, width: 150, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 150, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 130, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 130, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 170, hide: !columnVisibility.assignedname, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            // Assign Bank Detail
            renderCell: (params) => (
                <Grid container>
                    <Grid sx={{ display: 'flex' }}>
                        {isUserRoleCompare?.includes("enon-productionunitallot") && (
                            <Link to={`/production/nonproductionallot/${params.row.id}`} style={{ textDecoration: "none", color: "white", float: "right" }}>
                                <Button variant="contained" >
                                    <MenuIcon style={{ fontsize: "small" }} />
                                </Button>
                            </Link>
                        )}
                    </Grid>
                    <Grid sx={{ display: 'flex' }}>
                        {isUserRoleCompare?.includes("enon-productionunitallot") && (
                            <Button variant="contained" onClick={() => {
                                getCodeEmp(params.row.id);
                            }}>Allot
                            </Button>
                        )}
                    </Grid>
                </Grid>
            ),
        },
    ]
    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            employeename: item.companyname
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
    // get all branches
    const fetchBranch = (e) => {
        setPageName(!pageName)
        try {
            setBranches(accessbranch?.filter(
                (comp) =>
                    e.value === comp.company
            )?.map(data => ({
                label: data.branch,
                value: data.branch,
            })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            }));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const [assignedbyOverall, setAssignedbyOverall] = useState([])
    const fetchEmployeeOverall = async () => {
        setPageName(!pageName)
        try {
            let res_employee = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const filterusers = res_employee?.data?.users?.filter(t => t.company == nonproductionunitAllot.company && t.branch == nonproductionunitAllot.branch)
            setAssignedbyOverall(filterusers.map((item, index) => {
                return {
                    id: item._id,
                    serialNumber: item.serialNumber,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    team: item.team,
                    employeename: item.companyname
                }
            }));
            //   setEmployees(res_employee?.data?.users);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    useEffect(() => {
        fetchEmployeeOverall()
    }, [isFilterOpen, isPdfFilterOpen])
    //get all employees list details
    const [taskcategoryCheck, setTaskcategorycheck] = useState(true);

    const fetchEmployee = async () => {
        setTaskcategorycheck(false)
        setPageName(!pageName)
        try {
            let res_employee = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const filterusers = res_employee?.data?.users?.filter(t => t.company == nonproductionunitAllot.company && t.branch == nonproductionunitAllot.branch)
            setAssignedby(filterusers);
            setTaskcategorycheck(true)
        } catch (err) {
            setTaskcategorycheck(true)
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handleClear = () => {
        setNonproductionunitAllot({
            company: "Please Select Company",
            branch: "Please Select Branch"
        })
        setAssignedby([])
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    }
    const handleFilterClick = () => {
        if (nonproductionunitAllot.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (nonproductionunitAllot.branch === "Please Select Branch") {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            fetchEmployee();
        }
    };

    const fetchNonProductionBy = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.NONPRODUCTIONUNITALLOT}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setNonProductionAllotArray(res?.data?.nonproductionunitallot);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    return (
        <Box>
            <Headtitle title={'Non Production Unit Allot'} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Non Production Unit Allot"
                modulename="Production"
                submodulename="Non Production"
                mainpagename="Non-production Setup"
                subpagename="Non-production Unit Allot"
                subsubpagename=""
            />
            {/* ****** Header Content ****** */}

            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={true}
                    // maxWidth="sm"
                    sx={{
                        overflow: 'visible',
                        '& .MuiPaper-root': {
                            overflow: 'visible',
                        },
                    }}
                >
                    <Box sx={{ padding: '20px' }}>
                        <>
                            <form onSubmit={editSubmit}>
                                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Non Production Unit Allot </Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Employee Name <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Employee Name"
                                                value={assignedByEdit.companyname}
                                            // onChange={(e) => {
                                            //     setAssignedByEdit({ ...assignedByEdit, companyname: e.target.value });
                                            // }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth >
                                            <Typography>
                                                Category<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={catOpt}
                                                value={{ label: assignedByAllotEdit.category, value: assignedByAllotEdit.category }}
                                                onChange={(e) => {
                                                    setAssignedByAllotEdit({
                                                        ...assignedByAllotEdit,
                                                        category: e.value,
                                                        subcategory: "Please Select Sub Category"
                                                    });
                                                    getCategoryAndSubcategoryEdit(e);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth >
                                            <Typography>
                                                Sub Category<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={subCatOpt}
                                                value={{ label: assignedByAllotEdit.subcategory, value: assignedByAllotEdit.subcategory }}
                                                onChange={(e) => {
                                                    setAssignedByAllotEdit({
                                                        ...assignedByAllotEdit,
                                                        subcategory: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button sx={buttonStyles.buttonsubmit} type="submit" >Save</Button>
                                    </Grid>
                                    <Grid item md={6} xs={6} sm={6}>
                                        <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit} >Cancel</Button>
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
            {isUserRoleCompare?.includes("lnon-productionunitallot") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Non Production Unit Allot List</Typography>
                        </Grid>
                        <br />
                        <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Typography>&nbsp;</Typography>
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
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} >
                                <Typography>&nbsp;</Typography>

                                <Box >
                                    {isUserRoleCompare?.includes("excelnon-productionunitallot") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    fetchEmployeeOverall();
                                                    setFormat("xl");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileExcel />
                                                &ensp;Export to Excel&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvnon-productionunitallot") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    fetchEmployeeOverall();
                                                    setFormat("csv");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileCsv />
                                                &ensp;Export to CSV&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printnon-productionunitallot") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfnon-productionunitallot") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true);
                                                    fetchEmployeeOverall();
                                                }}>
                                                <FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagenon-productionunitallot") && (
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
                        <Grid container spacing={1} >
                            <Grid item md={3} xs={12} sm={12}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "left",
                                        flexWrap: "wrap",
                                        gap: "10px",
                                        marginTop: "24px"
                                    }}
                                >
                                    <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                                        Show All Columns
                                    </Button>
                                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                                        Manage Columns
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item md={2.5} xs={12} sm={12}>
                                <Typography>Company<b style={{ color: "red" }}>*</b></Typography>
                                <FormControl fullWidth size="small">
                                    <Selects
                                        maxMenuHeight={300}
                                        options={accessbranch?.map(data => ({
                                            label: data.company,
                                            value: data.company,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        styles={colourStyles}
                                        placeholder="Please Select Company"
                                        value={{ label: nonproductionunitAllot.company, value: nonproductionunitAllot.company }}
                                        onChange={(e) => {
                                            setNonproductionunitAllot({
                                                ...nonproductionunitAllot,
                                                company: e.value,
                                                branch: "Please Select Branch"
                                            });
                                            fetchBranch(e)
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={2.5} xs={12} sm={12}>
                                <Typography>Branch<b style={{ color: "red" }}>*</b></Typography>
                                <FormControl fullWidth size="small">
                                    <Selects
                                        maxMenuHeight={300}
                                        options={branchOpt}
                                        styles={colourStyles}
                                        placeholder="Please Select Branch"
                                        value={{ label: nonproductionunitAllot.branch, value: nonproductionunitAllot.branch }}
                                        onChange={(e) => {
                                            setNonproductionunitAllot({ ...nonproductionunitAllot, branch: e.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            &ensp;
                            <Grid item md={0.7} xs={12} sm={12} sx={{ marginTop: "24px" }}>
                                <Button sx={buttonStyles.buttonsubmit} onClick={handleFilterClick}>
                                    Filter
                                </Button>
                            </Grid>
                            &ensp;
                            <Grid item md={1} xs={12} sm={12} sx={{ marginTop: "24px" }}>
                                <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                                    Clear
                                </Button>
                            </Grid>
                        </Grid>
                        <br />
                        {!taskcategoryCheck ?
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
            {/* EXTERNAL COMPONENTS -------------- END */}
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={rowDataTable ?? []}
                itemsTwo={assignedbyOverall ?? []}
                filename={"Non Production Unit Allot"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
        </Box>
    );
}


export default Nonproductionunitallot;
