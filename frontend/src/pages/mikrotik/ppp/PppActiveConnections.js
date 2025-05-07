import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { MultiSelect } from "react-multi-select-component";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Tooltip from '@mui/material/Tooltip';
import {
    Box,
    Button,
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
    TextField,
    Typography
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../../components/Alert.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import ExportData from "../../../components/ExportData.js";
import { DeleteConfirmation } from "../../../components/DeleteConfirmation.js";
import Headtitle from "../../../components/Headtitle.js";
import MessageAlert from "../../../components/MessageAlert.js";
import PageHeading from "../../../components/PageHeading.js";
import StyledDataGrid from "../../../components/TableStyle.js";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext.js";
import { userStyle } from "../../../pageStyle.js";
import { SERVICE } from "../../../services/Baseservice.js";

function PppActiveConnections() {
    const cuurentDate = new Date();
    const today = moment(cuurentDate).format("YYYY-MM-DD");
    const oneMonthBefore = moment(cuurentDate).subtract(1, 'months').format("YYYY-MM-DD");
    //FILTER START
    const [interval, setInterval] = useState(1000);
    const [filterApplied, setFilterApplied] = useState(false);
    const [mikrotikMaster, setMikrotikMaster] = useState([])
    const [filterDatas, setFilterDatas] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        name: "Please Select Name",
        url: "",
        username: "",
        password: "",
        fromdate: "",
        todate: "",
        fromtime: "",
        totime: "",
    })
    const [filterFinal, setFilterFinal] = useState({
        url: "",
        username: "",
        password: "",
        company: "",
        branch: "",
        unit: "",
        name: "",
    })

    //submit option for saving
    const handleFilter = (e) => {
        e.preventDefault();

        if (selectedOptionsCompany?.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsBranch?.length === 0) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsUnit?.length === 0) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsName?.length === 0) {
            setPopupContentMalert("Please Select Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else {
            setFilterApplied(true);
            setFilterFinal(filterDatas)
            fetchMikroTikLogs(loginCredentials)

        }
    };


    //MULTISELECT ONCHANGE START

    //company multiselect
    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);

    const handleCompanyChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompany(options);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueNameCat([]);
        setSelectedOptionsName([]);
    };

    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branch multiselect
    const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
    let [valueBranchCat, setValueBranchCat] = useState([]);

    const handleBranchChange = (options) => {
        setValueBranchCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranch(options);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueNameCat([]);
        setSelectedOptionsName([]);
    };

    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };

    //unit multiselect
    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
    let [valueUnitCat, setValueUnitCat] = useState([]);

    const handleUnitChange = (options) => {
        setValueUnitCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnit(options);
        setValueNameCat([]);
        setSelectedOptionsName([]);
    };

    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };

    //name multiselect
    const [selectedOptionsName, setSelectedOptionsName] = useState([]);
    const [loginCredentials, setLoginCredentials] = useState([]);
    let [valueNameCat, setValueNameCat] = useState([]);

    const handleNameChange = (options) => {
        setValueNameCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsName(options);
        setLoginCredentials(options);
    };

    const customValueRendererName = (valueNameCat, _categoryname) => {
        return valueNameCat?.length
            ? valueNameCat.map(({ label }) => label)?.join(", ")
            : "Please Select Name";
    };

    const handleClearFilter = (e) => {
        e.preventDefault();
        setFilterDatas({
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            name: "Please Select Name",
            url: "",
            username: "",
            password: "",
            fromdate: "",
            todate: "",
            fromtime: "",
            totime: "",
        });
        setFilterFinal({
            url: "",
            username: "",
            password: "",
            company: "",
            branch: "",
            unit: "",
            name: "",
        })
        setLoginCredentials([])
        setFilterApplied(false);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setTeamsArray([]);


        setValueCompanyCat([]);
        setSelectedOptionsCompany([]);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueNameCat([]);
        setSelectedOptionsName([]);
    };

    //get all Asset Variant name.
    const fetchMikroRikMaster = async () => {
        setPageName(!pageName);
        try {
            let response = await axios.get(SERVICE.ALL_MIKROTIKMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let datas =
                response?.data?.mikrotikmaster?.filter((item) =>
                    isAssignBranch.some(
                        (branch) =>
                            branch.company === item.company &&
                            branch.branch === item.branch &&
                            branch.unit === item.unit
                    )
                );
            setMikrotikMaster(datas);
        } catch (err) {
            console.log(err);
            let error = err.response?.data?.message;
            if (error) {
                setPopupContentMalert(error);
                setPopupSeverityMalert("error");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(
                    err,
                    setPopupContentMalert,
                    setPopupSeverityMalert,
                    handleClickOpenPopupMalert
                );
            }
        }
    };
    useEffect(() => {
        fetchMikroRikMaster();
    }, []);




    //FILTER END





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
        "Mikrotik Name",
        "Name",
        "Service",
        "CallerID",
        "Encoding",
        "Address",
        "Uptime",

    ];
    let exportRowValues = [
        "source",
        "name",
        "service",
        "callerid",
        "encoding",
        "address",
        "uptime",
    ];



    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    function isValidURL(url) {
        setPageName(!pageName);
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }
    const ipRegex = /^$|^[0-9.]+$/;
    const [assetVariant, setAssetVariant] = useState({
        name: "",
        password: "",
        service: "any",
        profile: "",
        localaddress: "",
        remoteaddress: "",
        showpassword: false
    });
    const [assetVariantEdit, setAssetVariantEdit] = useState({
        name: "",
        password: "",
        service: "any",
        profile: "",
        localaddress: "",
        remoteaddress: "",
        showpassword: false
    });
    let serviceOptions = [
        { label: "any", value: "any" },
        { label: "async", value: "async" },
        { label: "l2tp", value: "l2tp" },
        { label: "ovpn", value: "ovpn" },
        { label: "pppoe", value: "pppoe" },
        { label: "pptp", value: "pptp" },
        { label: "sstp", value: "sstp" },
    ]
    const [teamsArray, setTeamsArray] = useState([]);
    const {
        isUserRoleCompare,
        isUserRoleAccess,
        pageName,
        setPageName,
        buttonStyles,
        isAssignBranch,
    } = useContext(UserRoleAccessContext);

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

                const remove = [
                    window.location.pathname?.substring(1),
                    window.location.pathname,
                ];
                return fetfinalurl?.some((item) => remove?.includes(item));
            })
            ?.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }));

    useEffect(() => {
        getapi();
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Mikrotik Active Connections"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });
    };

    const { auth } = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        name: true,
        service: true,
        callerid: true,
        encoding: true,
        address: true,
        uptime: true,
        source: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    //useEffect
    useEffect(() => {
        addSerialNumber(teamsArray);
    }, [teamsArray]);


    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };

    const [singleRow, setSingleRow] = useState({});
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

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
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


    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    const [deleteTeamId, setDeleteTeamId] = useState("");

    const deleteTeam = async () => {
        setPageName(!pageName);
        try {
            await axios.post(
                `${SERVICE.REMOVE_MIKROTIK_ACTIVE_CONNECTION}`, {

                url: deleteTeamId?.mikrotikurl,
                username: deleteTeamId?.adminusername,
                password: deleteTeamId?.adminpassword,
                connectionId: deleteTeamId?.mikrotikid,

            },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            await fetchMikroTikLogs(loginCredentials)
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setPopupContent("Removed Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            console.log(err);
            let error = err.response?.data?.message;
            if (error) {
                setPopupContentMalert(error);
                setPopupSeverityMalert("error");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(
                    err,
                    setPopupContentMalert,
                    setPopupSeverityMalert,
                    handleClickOpenPopupMalert
                );
            }
        }
    };

    //get all Asset Variant name.
    const fetchMikroTikLogs = async (logindetails) => {
        setPageName(!pageName);
        try {
            setLoader(true);
            let response = await axios.post(SERVICE.GET_MIKROTIK_ACTIVE_CONNECTIONS, {
                logindetails
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let datas =
                response?.data?.activeconnections;
            setTeamsArray(datas);
            setLoader(false);
        } catch (err) {
            setLoader(false);
            console.log(err);
            let error = err.response?.data?.message;
            if (error) {
                setPopupContentMalert(error);
                setPopupSeverityMalert("error");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(
                    err,
                    setPopupContentMalert,
                    setPopupSeverityMalert,
                    handleClickOpenPopupMalert
                );
            }
        }
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Mikrotik Active Connections.png");
                });
            });
        }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Mikrotik Active Connections",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = (profiledatas) => {
        const itemsWithSerialNumber = profiledatas?.map((item, index) => {


            return {
                ...item, // Original data
                serialNumber: index + 1, // Serial number
                id: item?._id,
                name: item?.name,
                service: item?.service,
                callerid: item["caller-id"],
                encoding: item?.encoding,
                address: item?.address,
                uptime: item?.uptime,
                source: item?.source,
                mikrotikid: item[".id"],
                sessionid: item["session-id"],
                mikrotikurl: item?.mikrotikurl,
                adminusername: item?.adminusername,
                adminpassword: item?.adminpassword,
            };
        });
        // Update the state with the new items
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
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
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
        },

        {
            field: "source",
            headerName: "Mikrotik Name",
            flex: 0,
            width: 200,
            hide: !columnVisibility.source,
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
            field: "service",
            headerName: "Service",
            flex: 0,
            width: 200,
            hide: !columnVisibility.service,
            headerClassName: "bold-header",
        },
        {
            field: "callerid",
            headerName: "Caller ID",
            flex: 0,
            width: 200,
            hide: !columnVisibility.callerid,
            headerClassName: "bold-header",
        },
        {
            field: "encoding",
            headerName: "Encoding",
            flex: 0,
            width: 200,
            hide: !columnVisibility.encoding,
            headerClassName: "bold-header",
        },
        {
            field: "address",
            headerName: "Address",
            flex: 0,
            width: 200,
            hide: !columnVisibility.address,
            headerClassName: "bold-header",
        },
        {
            field: "uptime",
            headerName: "Up Time",
            flex: 0,
            width: 200,
            hide: !columnVisibility.uptime,
            headerClassName: "bold-header",
        },


        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 200,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>

                    {isUserRoleCompare?.includes("vactiveconnections") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                // getviewCode(params.row.id);
                                setSingleRow(params?.row);
                                handleClickOpenview();
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}

                    {isUserRoleCompare?.includes("dactiveconnections") && (
                        // <Button
                        //     sx={userStyle.buttonedit}
                        //     onClick={() => {
                        //         // getviewCode(params.row.id);
                        //         setSingleRow(params?.row);
                        //         handleClickOpenview();
                        //     }}
                        // >
                        //     <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        // </Button>
                        <Tooltip title="Remove">
                            <IconButton >
                                <RemoveCircleOutlineIcon sx={buttonStyles?.buttondelete}
                                    onClick={(e) => {
                                        setDeleteTeamId(params.row);
                                        handleClickOpen();
                                    }} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Grid>
            ),
        },
    ];


    const rowDataTable = filteredData?.map((item, index) => {
        return {
            serialNumber: item?.serialNumber,
            id: item?.id,
            name: item?.name,
            service: item?.service,
            callerid: item?.callerid,
            encoding: item?.encoding,
            address: item?.address,
            uptime: item?.uptime,
            source: item?.source,
            mikrotikid: item?.mikrotikid,
            sessionid: item?.sessionid,
            mikrotikurl: item?.mikrotikurl,
            adminusername: item?.adminusername,
            adminpassword: item?.adminpassword,
        };
    });

    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));
    // Show All Columns functionality
    const handleShowAllColumns = () => {
        setColumnVisibility(initialColumnVisibility);
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
            <Headtitle title={"MIKROTIK ACTIVE CONNECTIONS"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Mikrotik Active Connections"
                modulename="Mikrotik"
                submodulename="PPP"
                mainpagename="Active Connections"
                subpagename=""
                subsubpagename=""
            />
            <>
                {isUserRoleCompare?.includes("lactiveconnections") && (
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Filter Mikrotik Active Connections
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company <b style={{ color: "red" }}>*</b>
                                        </Typography>

                                        <MultiSelect
                                            options={mikrotikMaster
                                                ?.map((data) => ({
                                                    label: data.company,
                                                    value: data.company,
                                                })).filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label && i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={selectedOptionsCompany}
                                            onChange={(e) => {
                                                handleCompanyChange(e);
                                            }}
                                            valueRenderer={customValueRendererCompany}
                                            labelledBy="Please Select Company"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch <b style={{ color: "red" }}>*</b>
                                        </Typography>


                                        <MultiSelect
                                            options={mikrotikMaster
                                                ?.filter((comp) =>
                                                    valueCompanyCat?.includes(comp.company)
                                                )
                                                ?.map((data) => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                }))
                                                .filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={selectedOptionsBranch}
                                            onChange={(e) => {
                                                handleBranchChange(e);
                                            }}
                                            valueRenderer={customValueRendererBranch}
                                            labelledBy="Please Select Branch"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit <b style={{ color: "red" }}>*</b>
                                        </Typography>


                                        <MultiSelect
                                            options={mikrotikMaster
                                                ?.filter(
                                                    (comp) =>
                                                        valueCompanyCat?.includes(comp.company) &&
                                                        valueBranchCat?.includes(comp.branch)
                                                )
                                                ?.map((data) => ({
                                                    label: data.unit,
                                                    value: data.unit,
                                                }))
                                                .filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={selectedOptionsUnit}
                                            onChange={(e) => {
                                                handleUnitChange(e);
                                            }}
                                            valueRenderer={customValueRendererUnit}
                                            labelledBy="Please Select Unit"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Name <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={mikrotikMaster
                                                ?.filter(
                                                    (u) =>
                                                        valueCompanyCat?.includes(u.company) &&
                                                        valueBranchCat?.includes(u.branch) &&
                                                        valueUnitCat?.includes(u.unit)
                                                )
                                                ?.map((data) => ({
                                                    label: data.name,
                                                    value: data.name,
                                                    name: data.name,
                                                    url: data.url,
                                                    username: data.username,
                                                    password: data.password,
                                                }))
                                                .filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={selectedOptionsName}
                                            onChange={(e) => {
                                                handleNameChange(e);
                                            }}
                                            valueRenderer={customValueRendererName}
                                            labelledBy="Please Select Name"
                                        />

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6} mt={3}>
                                    <div style={{ display: "flex", gap: "20px" }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleFilter}
                                            sx={buttonStyles.buttonsubmit}
                                        >
                                            Filter
                                        </Button>

                                        <Button
                                            sx={buttonStyles.btncancel}
                                            onClick={handleClearFilter}
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                </Grid>
                            </Grid>

                        </>
                    </Box>
                )}
            </>
            <br /> <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lactiveconnections") && (
                <>
                    {loader ? (
                        <Box sx={userStyle.container}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    minHeight: "350px",
                                }}
                            >
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
                        </Box>
                    ) : (
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography sx={userStyle.importheadtext}>
                                        List Mikrotik Active Connections
                                    </Typography>
                                </Grid>

                            </Grid>
                            <br />
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
                                            {/* <MenuItem value={teamsArray?.length}>
                                                All
                                            </MenuItem> */}
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
                                        {isUserRoleCompare?.includes("excelactiveconnections") && (
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
                                        {isUserRoleCompare?.includes("csvactiveconnections") && (
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
                                        {isUserRoleCompare?.includes("printactiveconnections") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfactiveconnectionss") && (
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
                                        {isUserRoleCompare?.includes("imageactiveconnections") && (
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleCaptureImage}
                                            >
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                &ensp;Image&ensp;{" "}
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Box>
                                        <FormControl fullWidth size="small">
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
                            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                                Show All Columns
                            </Button>
                            &ensp;
                            <Button
                                sx={userStyle.buttongrp}
                                onClick={handleOpenManageColumns}
                            >
                                Manage Columns
                            </Button>

                            <br />
                            <br />
                            <Box
                                style={{
                                    width: "100%",
                                    overflowY: "hidden", // Hide the y-axis scrollbar
                                }}
                            >
                                <StyledDataGrid
                                    // onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                    rows={rowsWithCheckboxes}
                                    columns={columnDataTable.filter(
                                        (column) => columnVisibility[column.field]
                                    )}
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
                                    Showing{" "}
                                    {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                                    {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                                    {filteredDatas?.length} entries
                                </Box>
                                <Box>
                                    <Button
                                        onClick={() => setPage(1)}
                                        disabled={page === 1}
                                        sx={userStyle.paginationbtn}
                                    >
                                        <FirstPageIcon />
                                    </Button>
                                    <Button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        sx={userStyle.paginationbtn}
                                    >
                                        <NavigateBeforeIcon />
                                    </Button>
                                    {pageNumbers?.map((pageNumber) => (
                                        <Button
                                            key={pageNumber}
                                            sx={userStyle.paginationbtn}
                                            onClick={() => handlePageChange(pageNumber)}
                                            className={page === pageNumber ? "active" : ""}
                                            disabled={page === pageNumber}
                                        >
                                            {pageNumber}
                                        </Button>
                                    ))}
                                    {lastVisiblePage < totalPages && <span>...</span>}
                                    <Button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === totalPages}
                                        sx={userStyle.paginationbtn}
                                    >
                                        <NavigateNextIcon />
                                    </Button>
                                    <Button
                                        onClick={() => setPage(totalPages)}
                                        disabled={page === totalPages}
                                        sx={userStyle.paginationbtn}
                                    >
                                        <LastPageIcon />
                                    </Button>
                                </Box>
                            </Box>
                            {/* ****** Table End ****** */}
                        </Box>
                    )}
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
            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                fullWidth={true}
                sx={{ marginTop: "50px" }}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            View Mikrotik Active Connections
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Mikrotik Name</Typography>
                                    <Typography>{singleRow.source}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Name</Typography>
                                    <Typography>{singleRow.name}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Service</Typography>
                                    <Typography>{singleRow.service}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Caller ID</Typography>
                                    <Typography>{singleRow.callerid}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Encoding</Typography>
                                    <Typography>{singleRow.encoding}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Address</Typography>
                                    <Typography>{singleRow.address}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Uptime</Typography>
                                    <Typography>{singleRow.uptime}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2} sx={{ marginLeft: "-2px" }}>
                            <Button
                                variant="contained"
                                sx={buttonStyles.btncancel}
                                onClick={handleCloseview}
                            >
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            <br />
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
                filteredDataTwo={filteredData ?? []}
                itemsTwo={items ?? []}
                filename={"Mikrotik Active Connections"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={deleteTeam}
                title="Are you sure, Do You want to Remove this Connection?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />

            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default PppActiveConnections;
