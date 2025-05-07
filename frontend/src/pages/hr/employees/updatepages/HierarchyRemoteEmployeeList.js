import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import DialogContentText from "@mui/material/DialogContentText";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
    Backdrop,
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
    TextareaAutosize,
    TextField,
    Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AggregatedSearchBar from "../../../../components/AggregatedSearchBar";
import domtoimage from 'dom-to-image';
import AggridTable from "../../../../components/AggridTable";
import AlertDialog from "../../../../components/Alert";
import { handleApiError } from "../../../../components/Errorhandling";
import ExportData from "../../../../components/ExportData";
import Headtitle from "../../../../components/Headtitle";
import InfoPopup from "../../../../components/InfoPopup.js";
import MessageAlert from "../../../../components/MessageAlert";
import PageHeading from "../../../../components/PageHeading";
import {
    AuthContext,
    UserRoleAccessContext,
} from "../../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";
function HierarchyRemoteEmployeeList() {
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        // setSubmitLoader(false);
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
        "Team",
        "Empcode",
        "Name",
        "Username",
    ];
    let exportRowValues = [
        "company",
        "branch",
        "unit",
        "team",
        "empcode",
        "companyname",
        "username",
    ];
    const [emphierarchy, setEmphierarchy] = useState([]);
    const modeDropDowns = [
        { label: "My Hierarchy List", value: "myhierarchy" },
        { label: "All Hierarchy List", value: "allhierarchy" },
        { label: "My + All Hierarchy List", value: "myallhierarchy" },
    ];
    const sectorDropDowns = [
        { label: "Primary", value: "Primary" },
        { label: "Secondary", value: "Secondary" },
        { label: "Tertiary", value: "Tertiary" },
        { label: "All", value: "all" },
    ];
    const [modeselection, setModeSelection] = useState({
        label: "My Hierarchy List",
        value: "myhierarchy",
    });
    const [sectorSelection, setSectorSelection] = useState({
        label: "Primary",
        value: "Primary",
    });
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);

    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const {
        isUserRoleAccess,
        isUserRoleCompare,
        isAssignBranch,
        allTeam,
        pageName,
        setPageName,
        buttonStyles,
        allUsersData,
    } = useContext(UserRoleAccessContext);

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
            pagename: String("Hierarchy Remote Employee List"),
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

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

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
                    data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 && data?.subpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 && data?.mainpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
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
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { auth } = useContext(AuthContext);
    const [isBtn, setIsBtn] = useState(false);
    const [isBtnFilter, setisBtnFilter] = useState(false);
    const [isBtnClear, setisBtnClear] = useState(false);
    const [loader, setLoader] = useState(false);

    const [pfesiform, setPfesiForm] = useState({
        esideduction: false,
        pfdeduction: false,
        uan: "UAN",
        pfmembername: "",
        insurancenumber: "",
        ipname: "",
        pfesifromdate: "",
        isenddate: false,
        pfesienddate: "",
    });

    const [addremoteemployeeWorkmode, setAddremoteemployeeWorkmode] = useState({
        wfhconfigurationdetails: "",
        internetdailylimit: "",
        internetspeed: "",
        internetssidname: "",
        auditchecklistworkareasecure: "Please Select",
        auditchecklistwindowsongroundlevelworkarea: "Please Select",
        auditchecklistworkstationisstored: "Please Select",
        auditchecklistnoprivatelyowned: "Please Select",
        auditchecklistwifisecurity: "Please Select",
    });

    const [isAddOpenalert, setAddOpenalert] = useState(false);
    // const [selectedbranch, setselectedbranch] = useState([]);

    const [isBankdetail, setBankdetail] = useState(false);

    let username = isUserRoleAccess.username;

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");

    //image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Hierarchy Remote Employee List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };


    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
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

    // Copied fields Name
    const handleCopy = (message) => {
        NotificationManager.success(`${message} 👍`, "", 2000);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        empcode: true,
        companyname: true,
        actions: true,
        username: true,

        unitcode: true,
        branchcode: true,

        count: true,
        systemname: true,
        systemshortname: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    const [primaryWorkStationInput, setPrimaryWorkStationInput] = useState("");
    const [employeeDetails, setEmployeeDetails] = useState({
        employeename: "",
        id: "",
        workstationinput: "",
        workmode: "",
    });
    useEffect(() => {
        fetchBranchUnit();
    }, [])

    const [branchData, setBranchData] = useState([])
    const [unitData, setUnitData] = useState([])
    //add function
    const fetchBranchUnit = async () => {

        try {

            let [res_branch, res_unit] = await Promise.all([
                axios.get(SERVICE.BRANCH, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.get(SERVICE.UNIT, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
            ]);

            setBranchData(res_branch?.data?.branch)
            setUnitData(res_unit?.data?.units)




        } catch (err) {

            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };
    const [rowParamsData, setRowParamsData] = useState({})
    const allotWorkStation = async (row) => {
        setRowParamsData(row)
        setPageName(!pageName);
        try {
            let aggregationPipeline = [
                {
                    $match: {
                        company: row?.company,
                        branch: row?.branch,
                        unit: row?.unit,
                        workstationinput: { $regex: "_[0-9]+_" }, // Match workstation codes
                    }
                },
                {
                    $addFields: {
                        workstationNumber: {
                            $toInt: { $arrayElemAt: [{ $split: ["$workstationinput", "_"] }, 1] }
                        }
                    }
                },
                {
                    $sort: { workstationNumber: -1 } // Get the highest workstation number
                },
                {
                    $limit: 1
                }
            ]
            let branchCode = branchData?.find(data => data?.name === row?.branch)?.code || "";
            let unitCode = unitData?.find(data => data?.name === row?.unit)?.code || "";
            console.log(row)
            console.log(branchCode,
                unitCode, "branchCodeunitCode")
            // let req = await axios.get(SERVICE.USER, {
            //   headers: {
            //     Authorization: `Bearer ${auth.APIToken}`,
            //   },
            // });
            let req = await axios.post(
                SERVICE.DYNAMICUSER_CONTROLLER,
                {
                    aggregationPipeline,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            let result = req.data.users
            console.log(result, "result")

            // let lastwscode;
            // let lastworkstation = req.data.users
            //   ?.filter(
            //     (item) =>
            //       item.company === row.company &&
            //       item.branch === row.branch &&
            //       item.unit === row.unit
            //   )
            //   .filter((item) => /_[0-9]+_/.test(item?.workstationinput));

            // if (lastworkstation.length === 0) {
            //   lastwscode = 0;
            // } else {
            //   let highestWorkstation = lastworkstation.reduce(
            //     (max, item) => {
            //       const num = parseInt(item.workstationinput.split("_")[1]);
            //       return num > max.num ? { num, item } : max;
            //     },
            //     { num: 0, item: null }
            //   ).num;

            //   lastwscode = highestWorkstation.toString().padStart(2, "0");
            // }
            let lastwscode = result.length > 0 ? result[0].workstationNumber + 1 : 1;
            let formattedWorkstationCode = lastwscode.toString().padStart(2, "0");

            let autoWorkStation = `W${branchCode?.slice(0, 2)?.toUpperCase()}${unitCode?.slice(0, 2)?.toUpperCase()}_${formattedWorkstationCode}_${row?.username?.toUpperCase()}`;

            // let autoWorkStation = `W${row?.branchcode
            //   ?.slice(0, 2)
            //   ?.toUpperCase()}${row?.unitcode?.slice(0, 2)?.toUpperCase()}_${lastwscode === 0
            //     ? "01"
            //     : (Number(lastwscode) + 1).toString().padStart(2, "0")
            //   }_${row?.username?.toUpperCase()}`;

            setPrimaryWorkStationInput(autoWorkStation?.slice(0, 15));
            setEmployeeDetails({
                employeename: row.companyname,
                id: row?.id,
                workstationinput: row?.workstationinput?.slice(0, 15),
                workmode: row?.workmode,
            });
            return autoWorkStation?.slice(0, 15)
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };
    const getCode = async (row) => {
        // setIsLoading(true);
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${row.id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let response = await axios.get(`${SERVICE.GET_SINGLE_REMOTE_WORKMODE}/?employeeid=${row.id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setPfesiForm({ ...res?.data?.suser, addremoteworkmode: response?.data?.addremoteworkmode });
            await allotWorkStation(row);
            handleClickOpenEdit();

        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    // Edit model
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsLoading(false);
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
        setAddremoteemployeeWorkmode({
            wfhconfigurationdetails: "",
            internetdailylimit: "",
            internetspeed: "",
            internetssidname: "",
            auditchecklistworkareasecure: "Please Select",
            auditchecklistwindowsongroundlevelworkarea: "Please Select",
            auditchecklistworkstationisstored: "Please Select",
            auditchecklistnoprivatelyowned: "Please Select",
            auditchecklistwifisecurity: "Please Select",
        });
        setSelectedOptionsSystemType([]);
        setSelectedOptionsNetworkType([]);
        setdocumentFilesssid([]);
        setdocumentFiles([]);
        setPrimaryWorkStationInput("");
        setEmployeeDetails({
            employeename: "",
            id: "",
            workstationinput: "",
            workmode: "",
        });
    };

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsLoading(false);
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    //Boardingupadate updateby edit page...
    let updateby = pfesiform?.updatedby;
    let addedby = pfesiform?.addedby;

    //edit Put call
    let boredit = pfesiform?._id;
    const sendRequestt = async () => {
        setIsBtn(true);
        let now = new Date();
        let currentTime = now.toLocaleTimeString();
        setPageName(!pageName);
        let workStationInput = await allotWorkStation(rowParamsData)
        try {
            let UpdatedLastIndex = [];
            const answer = pfesiform?.addremoteworkmode?.splice(0, pfesiform?.addremoteworkmode?.length - 1);
            let lastIndex = pfesiform?.addremoteworkmode[pfesiform?.addremoteworkmode.length - 1];

            if (lastIndex) {
                UpdatedLastIndex = [...answer, { ...lastIndex, workstationinput: workStationInput }];
                console.log(UpdatedLastIndex, 'answer');
            } else {
                console.error('addremoteworkmode is empty or undefined');
            }
            let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${boredit}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                workstationinput: workStationInput,
                approvedremotestatus: "approved",
                addremoteworkmode: UpdatedLastIndex
            });
            if (lastIndex) {
                await axios.put(
                    `${SERVICE.UPDATE_ANYLOG_REMOTE_WORKMODE}/?logid=${lastIndex?._id}&logname=addremoteworkmode`,
                    {
                        workstationinput: workStationInput,
                        updatedby: [
                            ...lastIndex?.updatedby,
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),
                            },
                        ],
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    }
                );
            }
            // await sendRequest();
            setAddremoteemployeeWorkmode({
                wfhconfigurationdetails: "",
                internetdailylimit: "",
                internetspeed: "",
                internetssidname: "",
                auditchecklistworkareasecure: "Please Select",
                auditchecklistwindowsongroundlevelworkarea: "Please Select",
                auditchecklistworkstationisstored: "Please Select",
                auditchecklistnoprivatelyowned: "Please Select",
                auditchecklistwifisecurity: "Please Select",
            });
            setSelectedOptionsSystemType([]);
            setSelectedOptionsNetworkType([]);
            setdocumentFilesssid([]);
            setdocumentFiles([]);
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            await TableHierachylist();
        } catch (err) {
            console.log(err);
            setIsBtn(false);
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const editSubmit = (e) => {
        e.preventDefault();
        sendRequestt();
    };

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

    const [isLoading, setIsLoading] = useState(false);
    const LoadingBackdrop = ({ open }) => {
        return (
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <div className="pulsating-circle">
                    <CircularProgress color="inherit" className="loading-spinner" />
                </div>
                <Typography
                    variant="h6"
                    sx={{ marginLeft: 2, color: "#fff", fontWeight: "bold" }}
                >
                    Please Wait...
                </Typography>
            </Backdrop>
        );
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Hierarchy Remote Employee List",
        pageStyle: "print",
    });

    //table entries ..,.
    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {
        const itemsWithSerialNumber = datas?.map((item, index) => ({
            _id: item?._id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            empcode: item.empcode,
            companyname: item.companyname,
            workmode: item.workmode || "",
            workstationinput: item.workstationinput || "",
            branchcode: item.branchcode || "",
            unitcode: item.unitcode || "",
            count: item?.count,
            systemname: item?.systemname,
            username: item.username,
            addremoteworkmode: item?.addremoteworkmode,
            systemshortname: item?.systemshortname?.slice(0, 15),
        }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber(employees);
    }, [employees]);

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

    const totalPages = Math.ceil(filteredDatas?.length / pageSize);

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
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 75,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 200,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 200,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 150,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 150,
            hide: !columnVisibility.team,
            headerClassName: "bold-header",
        },
        {
            field: "empcode",
            headerName: "Emp Code",
            flex: 0,
            width: 200,
            hide: !columnVisibility.empcode,
            headerClassName: "bold-header",
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <ListItem
                        sx={{
                            "&:hover": {
                                cursor: "pointer",
                                color: "blue",
                                textDecoration: "underline",
                            },
                        }}
                    >
                        <CopyToClipboard
                            onCopy={() => {
                                handleCopy("Copied Emp Code!");
                            }}
                            options={{ message: "Copied Emp Code!" }}
                            text={params?.data?.empcode}
                        >
                            <ListItemText primary={params?.data?.empcode} />
                        </CopyToClipboard>
                    </ListItem>
                </Grid>
            ),
        },
        {
            field: "companyname",
            headerName: "Name",
            flex: 0,
            width: 200,
            hide: !columnVisibility.companyname,
            headerClassName: "bold-header",
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <ListItem
                        sx={{
                            "&:hover": {
                                cursor: "pointer",
                                color: "blue",
                                textDecoration: "underline",
                            },
                        }}
                    >
                        <CopyToClipboard
                            onCopy={() => {
                                handleCopy("Copied Name!");
                            }}
                            options={{ message: "Copied Name!" }}
                            text={params?.data?.companyname}
                        >
                            <ListItemText primary={params?.data?.companyname} />
                        </CopyToClipboard>
                    </ListItem>
                </Grid>
            ),
        },
        {
            field: "username",
            headerName: "User Name",
            flex: 0,
            width: 130,
            hide: !columnVisibility.username,
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <ListItem
                        sx={{
                            "&:hover": {
                                cursor: "pointer",
                                color: "blue",
                                textDecoration: "underline",
                            },
                        }}
                    >
                        <CopyToClipboard
                            onCopy={() => {
                                handleCopy("Copied Username!");
                            }}
                            options={{ message: "Copied Username!" }}
                            text={params?.data?.username}
                        >
                            <ListItemText primary={params?.data?.username} />
                        </CopyToClipboard>
                    </ListItem>
                </Grid>
            ),
        },

        // {
        //   field: "branchcode",
        //   headerName: "Branch Code",
        //   flex: 0,
        //   width: 120,
        //   hide: !columnVisibility.branchcode,
        //   headerClassName: "bold-header",
        // },
        // {
        //   field: "unitcode",
        //   headerName: "Unit Code",
        //   flex: 0,
        //   width: 120,
        //   hide: !columnVisibility.unitcode,
        //   headerClassName: "bold-header",
        // },
        // {
        //   field: "count",
        //   headerName: "Count",
        //   flex: 0,
        //   width: 80,
        //   hide: !columnVisibility.count,
        //   headerClassName: "bold-header",
        // },
        // {
        //   field: "systemname",
        //   headerName: "System Name",
        //   flex: 0,
        //   width: 250,
        //   hide: !columnVisibility.systemname,
        //   headerClassName: "bold-header",
        // },
        // {
        //   field: "systemshortname",
        //   headerName: "ShortName",
        //   flex: 0,
        //   width: 250,
        //   hide: !columnVisibility.systemshortname,
        //   headerClassName: "bold-header",
        // },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            // Assign Bank Detail
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("ehierarchyremoteemployeelist") && (
                        <Button
                            variant="contained"
                            onClick={() => {
                                getCode(params.data);
                            }}
                        >
                            Approve
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
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            empcode: item.empcode,
            companyname: item.companyname,
            workmode: item.workmode,
            workstationinput: item.workstationinput,
            username: item.username,
            branchcode: item.branchcode,
            unitcode: item.unitcode,
            count: item.count,
            systemname: item.systemname,
            systemshortname: item.systemshortname,
            addremoteworkmode: item.addremoteworkmode,
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
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    const [selectedOptionsSystemType, setSelectedOptionsSystemType] = useState(
        []
    );
    let [valueSystemTypeCat, setValueSystemTypeCat] = useState([]);

    const [selectedOptionsNetworkType, setSelectedOptionsNetworkType] = useState(
        []
    );
    let [valueNetworkTypeCat, setValueNetworkTypeCat] = useState([]);

    const [isClearOpenalert, setClearOpenalert] = useState(false);

    const handleSystemTypeChange = (options) => {
        setValueSystemTypeCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsSystemType(options);
    };

    const handleNetworkTypeChange = (options) => {
        setValueNetworkTypeCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsNetworkType(options);
    };

    const customValueRendererSystemType = (valueSystemTypeCat, _categoryname) => {
        return valueSystemTypeCat?.length
            ? valueSystemTypeCat.map(({ label }) => label)?.join(", ")
            : "Please Select System Type";
    };

    const customValueRendererNetworkType = (
        valueNetworkTypeCat,
        _categoryname
    ) => {
        return valueNetworkTypeCat?.length
            ? valueNetworkTypeCat.map(({ label }) => label)?.join(", ")
            : "Please Select Network Type";
    };

    //add function
    const TableHierachylist = async () => {
        setLoader(true);

        setisBtnFilter(true);
        setPageName(!pageName);

        setFilterLoader(true);
        setTableLoader(true);
        try {
            let subprojectscreate = await axios.post(SERVICE.GETFILTERED_REMOTE_HIERARCHY_LIST, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                hierachy: modeselection.value,
                sector: sectorSelection.value,
                username: isUserRoleAccess.companyname,
                team: isUserRoleAccess.team,
                pagename: "menuhierarchyremoteemployeelist"
            });
            console.log(subprojectscreate?.data, 'subprojectscreate?.data?');
            let preresult = subprojectscreate?.data?.resultAccessFilter?.filter(
                (item) =>
                    item?.approvedremotestatus === "applied"
            );

            let result = preresult


            // Calculate counts dynamically
            const counts = {};

            const updatedData = result

            setEmployees(updatedData?.map((item, index) => ({ ...item, serialNumber: index + 1 })));
            setisBtnFilter(false);
            setLoader(false);

            setFilterLoader(false);
            setTableLoader(false);
        } catch (err) {
            setLoader(false);
            setisBtnFilter(false);
            setFilterLoader(false);
            setTableLoader(false);
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };
    const handleClear = async (e) => {
        e.preventDefault();
        setEmphierarchy([]);
        setEmployees([]);
        setModeSelection({ label: "My Hierarchy List", value: "myhierarchy" });
        setSectorSelection({ label: "Primary", value: "Primary" });
        setFilteredChanges(null)
        setFilteredRowData([])
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();

    };


    //FILTER START
    useEffect(() => {
        fetchDepartments();
    }, []);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const fetchDepartments = async () => {
        setPageName(!pageName);
        try {
            let req = await axios.get(SERVICE.DEPARTMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDepartmentOptions(
                req?.data?.departmentdetails?.map((data) => ({
                    label: data?.deptname,
                    value: data?.deptname,
                }))
            );
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [filterState, setFilterState] = useState({
        type: "Individual",
        employeestatus: "Please Select Employee Status",
    });
    const EmployeeStatusOptions = [
        { label: "Live Employee", value: "Live Employee" },
        { label: "Releave Employee", value: "Releave Employee" },
        { label: "Absconded", value: "Absconded" },
        { label: "Hold", value: "Hold" },
        { label: "Terminate", value: "Terminate" },
    ];
    const TypeOptions = [
        { label: "Individual", value: "Individual" },
        { label: "Department", value: "Department" },
        { label: "Company", value: "Company" },
        { label: "Branch", value: "Branch" },
        { label: "Unit", value: "Unit" },
        { label: "Team", value: "Team" },
    ];

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
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
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
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
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
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };

    //team multiselect
    const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
    let [valueTeamCat, setValueTeamCat] = useState([]);

    const handleTeamChange = (options) => {
        setValueTeamCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeam(options);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    //department multiselect
    const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState(
        []
    );
    let [valueDepartmentCat, setValueDepartmentCat] = useState([]);

    const handleDepartmentChange = (options) => {
        setValueDepartmentCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDepartment(options);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
        return valueDepartmentCat?.length
            ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
            : "Please Select Department";
    };
    //employee multiselect
    const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
    let [valueEmployeeCat, setValueEmployeeCat] = useState([]);

    const handleEmployeeChange = (options) => {
        setValueEmployeeCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsEmployee(options);
    };

    const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
        return valueEmployeeCat?.length
            ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
            : "Please Select Employee";
    };

    //MULTISELECT ONCHANGE END
    const handleClearFilter = () => {
        setValueCompanyCat([]);
        setSelectedOptionsCompany([]);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setEmployeeOptions([]);
        setEmployees([]);

        setFilterState({
            type: "Individual",
            employeestatus: "Please Select Employee Status",
        });

        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const [filterLoader, setFilterLoader] = useState(false);
    const [tableLoader, setTableLoader] = useState(false);


    //auto select all dropdowns
    const [allAssignCompany, setAllAssignCompany] = useState([]);
    const [allAssignBranch, setAllAssignBranch] = useState([]);
    const [allAssignUnit, setAllAssignUnit] = useState([]);
    const handleAutoSelect = async () => {
        setPageName(!pageName);
        try {
            let selectedValues = accessbranch
                ?.map((data) => ({
                    company: data.company,
                    branch: data.branch,
                    unit: data.unit,
                }))
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                );
            let selectedCompany = selectedValues
                ?.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.company === value.company)
                )
                .map((a, index) => {
                    return a.company;
                });

            let mappedCompany = selectedValues
                ?.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.company === value.company)
                )
                ?.map((data) => ({
                    label: data?.company,
                    value: data?.company,
                }));

            setValueCompanyCat(selectedCompany);
            setSelectedOptionsCompany(mappedCompany);

            let selectedBranch = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) => t.company === value.company && t.branch === value.branch
                        )
                )
                .map((a, index) => {
                    return a.branch;
                });

            let mappedBranch = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) => t.company === value.company && t.branch === value.branch
                        )
                )
                ?.map((data) => ({
                    label: data?.branch,
                    value: data?.branch,
                }));

            setValueBranchCat(selectedBranch);
            setSelectedOptionsBranch(mappedBranch);

            let selectedUnit = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                )
                .map((a, index) => {
                    return a.unit;
                });

            let mappedUnit = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                )
                ?.map((data) => ({
                    label: data?.unit,
                    value: data?.unit,
                }));

            setValueUnitCat(selectedUnit);
            setSelectedOptionsUnit(mappedUnit);

            let mappedTeam = allTeam
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit)
                )
                .map((u) => ({
                    label: u.teamname,
                    value: u.teamname,
                }));

            let selectedTeam = allTeam
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit)
                )
                .map((u) => u.teamname);

            let mappedemployees = allUsersData
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit) &&
                        selectedTeam?.includes(u.team)
                )
                .map((u) => ({
                    label: u.companyname,
                    value: u.companyname,
                }));

            let employees = allUsersData
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit) &&
                        selectedTeam?.includes(u.team)
                )
                .map((u) => u.companyname);
            setValueTeamCat(selectedTeam);
            setSelectedOptionsTeam(mappedTeam);
            setAllAssignCompany(selectedCompany);

            setAllAssignBranch(selectedBranch);

            setAllAssignUnit(selectedUnit);

            setValueEmployeeCat(employees);
            setSelectedOptionsEmployee(mappedemployees);
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    useEffect(() => {
        handleAutoSelect();
    }, [isAssignBranch]);

    //FILTER END

    const workfromhomesystemDetails = [
        { label: "Desktop", value: "Desktop" },
        { label: "Laptop", value: "Laptop" },
    ];
    const workfromhomeinternetDetails = [
        { label: "WIFI", value: "WIFI" },
        { label: "Mobile Network", value: "Mobile Network" },
    ];
    const auditcheckListOpt = [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
    ];

    const [documentFiles, setdocumentFiles] = useState([]);

    const handleFileDelete = (index) => {
        setdocumentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleResumeUpload = (event) => {
        const resume = event.target.files;
        const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
        let showAlert = false;
        for (let i = 0; i < resume?.length; i++) {
            const reader = new FileReader();
            const file = resume[i];
            if (file.size > maxFileSize) {
                showAlert = true;
                continue; // Skip this file and continue with the next one
            }
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFiles((prevFiles) => [
                    ...prevFiles,
                    {
                        name: file.name,
                        preview: reader.result,
                        data: reader.result.split(",")[1],
                        remark: "resume file",
                    },
                ]);
            };
        }
        if (showAlert) {
            setPopupContentMalert(
                "File size is greater than 1MB, please upload a file below 1MB.!"
            );
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
    };

    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    const [documentFilesssid, setdocumentFilesssid] = useState([]);

    const handleFileDeletessid = (index) => {
        setdocumentFilesssid((prevFiles) =>
            prevFiles.filter((_, i) => i !== index)
        );
    };

    const handleResumeUploadssid = (event) => {
        const resume = event.target.files;
        const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
        let showAlert = false;
        for (let i = 0; i < resume?.length; i++) {
            const reader = new FileReader();
            const file = resume[i];
            if (file.size > maxFileSize) {
                showAlert = true;
                continue; // Skip this file and continue with the next one
            }
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFilesssid((prevFiles) => [
                    ...prevFiles,
                    {
                        name: file.name,
                        preview: reader.result,
                        data: reader.result.split(",")[1],
                        remark: "resume file",
                    },
                ]);
            };
        }
        if (showAlert) {
            setPopupContentMalert(
                "File size is greater than 1MB, please upload a file below 1MB.!"
            );
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
    };

    const renderFilePreviewssid = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    return (
        <Box>
            <NotificationContainer />
            <Headtitle title={"HIERARCHY REMOTE EMPLOYEE"} />
            <LoadingBackdrop open={isLoading} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Hierarchy Remote Employee List"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="Employee"
                subpagename="Employee details"
                subsubpagename="Hierarchy Remote Employee List"
            />
            <br />

            {isUserRoleCompare?.includes("menuhierarchyremoteemployeelist") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Hierarchy Remote Employee List
                            </Typography>
                        </Grid>
                        <br />

                        <Grid container spacing={2}>
                            <>
                                <Grid item lg={2} md={2.5} xs={12} sm={6}>
                                    <Typography> Mode </Typography>
                                    <Selects
                                        options={modeDropDowns}
                                        value={{
                                            label: modeselection.label,
                                            value: modeselection.value,
                                        }}
                                        onChange={(e) => {
                                            setModeSelection(e);
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={2} md={2.5} xs={12} sm={6}>
                                    <Typography> Level </Typography>
                                    <Selects
                                        options={sectorDropDowns}
                                        value={{
                                            label: sectorSelection.label,
                                            value: sectorSelection.value,
                                        }}
                                        onChange={(e) => {
                                            setSectorSelection(e);
                                        }}
                                    />
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <Typography> &nbsp; </Typography>
                                    <Button
                                        sx={buttonStyles.buttonsubmit} variant="contained"
                                        onClick={TableHierachylist}
                                    >
                                        Filter
                                    </Button>
                                    &nbsp;
                                    &nbsp;
                                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                                        Clear
                                    </Button>
                                </Grid>

                            </>
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
                                        <MenuItem value={employees?.length}>All</MenuItem>
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
                                    {isUserRoleCompare?.includes(
                                        "excelhierarchyremoteemployeelist"
                                    ) && (
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
                                    {isUserRoleCompare?.includes("csvhierarchyremoteemployeelist") && (
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
                                    {isUserRoleCompare?.includes(
                                        "printhierarchyremoteemployeelist"
                                    ) && (
                                            <>
                                                <Button
                                                    sx={userStyle.buttongrp}
                                                    onClick={handleprint}
                                                >
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                    {isUserRoleCompare?.includes("pdfhierarchyremoteemployeelist") && (
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
                                    {isUserRoleCompare?.includes(
                                        "imagehierarchyremoteemployeelist"
                                    ) && (
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
                            <Grid item md={2} xs={6} sm={6}>
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTable}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={employees}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={employees}
                                />
                            </Grid>
                        </Grid> <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button> <br />    <br />
                        {loader === true ? (
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
                        ) : (
                            <>
                                {isBankdetail === true ? (
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
                                    <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefTableImg} >
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
                                            gridRefTableImg={gridRefTableImg}
                                            paginated={false}
                                            filteredDatas={filteredDatas}
                                            // totalDatas={totalDatas}
                                            searchQuery={searchedString}
                                            handleShowAllColumns={handleShowAllColumns}
                                            setFilteredRowData={setFilteredRowData}
                                            filteredRowData={filteredRowData}
                                            setFilteredChanges={setFilteredChanges}
                                            filteredChanges={filteredChanges}
                                            itemsList={employees}
                                        />
                                    </Box>
                                )}
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

            {/* Delete Modal */}

            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    sx={{ marginTop: "50px" }}
                >
                    <Box sx={{ width: "450px", borderRadius: "3px", overflow: "hidden", wordWrap: "break-word", whiteSpace: "normal" }}>
                        <>
                            <DialogContent>
                                <DialogContentText
                                    id="alert-dialog-description"
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "20px",
                                    }}
                                >
                                    <InfoOutlinedIcon style={{ fontSize: "3.5rem", color: "blue" }} />
                                    <Typography
                                        sx={{ fontSize: "1.4rem", fontWeight: "300", color: "black" }}
                                    >
                                        Are you Sure you want to approve for  {pfesiform?.companyname} as an Work Station: {primaryWorkStationInput}

                                    </Typography>
                                </DialogContentText>
                            </DialogContent>
                            <br />
                            <Grid
                                item
                                md={12}
                                sm={12}
                                xs={12}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                <Grid
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: "15px",
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        onClick={editSubmit}
                                        // disabled={isBtn}
                                        sx={buttonStyles.buttonsubmit}
                                    >
                                        Save
                                    </Button>
                                    <Grid item md={1}></Grid>
                                    <Button
                                        sx={buttonStyles.btncancel}
                                        onClick={handleCloseModEdit}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                            <br />
                        </>
                    </Box>
                </Dialog>
            </Box>

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
                itemsTwo={employees ?? []}
                filename={"Hierarchy Remote Employee List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Hierarchy Remote Employee Info"
                addedby={addedby}
                updateby={updateby}
            />

            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default HierarchyRemoteEmployeeList;
