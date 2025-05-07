import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { MultiSelect } from "react-multi-select-component";
import {
    Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText,
    MenuItem, OutlinedInput, Popover, Select, TextField, Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling.js";
import Headtitle from "../../components/Headtitle.js";
import StyledDataGrid from "../../components/TableStyle.js";
import { UserRoleAccessContext } from "../../context/Appcontext.js";
import { AuthContext } from "../../context/Appcontext.js";
import { userStyle, colourStyles } from "../../pageStyle.js";
import { SERVICE } from "../../services/Baseservice.js";
import moment from "moment";
import AlertDialog from "../../components/Alert.js";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData.js";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert.js";
import PageHeading from "../../components/PageHeading.js";
import LoadingButton from "@mui/lab/LoadingButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
function RocketchatMembersList() {
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
        setFilterLoader(false);
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
        "Username",
        "Empcode",
        "Employee Name",
        "Company",
        "Branch",
        "Unit",
        "Team",
        "Department",
        "Designation",
        "Connections Email",
        "Connections Roles",
        "Team Name",
        "Channel Name",
    ];
    let exportRowValues = [
        "username",
        "empcode",
        "companyname",
        "company",
        "branch",
        "unit",
        "team",
        "department",
        "designation",
        "rocketchatemail",
        "rocketchatroles",
        "teamName",
        "channelName",
    ];

    let typeOptions = [
        { label: "Public", value: "Public" },
        { label: "Private", value: "Private" },
    ];


    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [assetVariant, setAssetVariant] = useState({
        name: "",
        type: "Public",
        team: "",
        teamid: ""
    });

    const [assetVariantEdit, setAssetVariantEdit] = useState({
        name: "",
        displayname: "",
        type: "Invite",
    });
    const [teamsArray, setTeamsArray] = useState([]);
    const {
        isUserRoleCompare,
        isUserRoleAccess,
        pageName,
        setPageName,
        buttonStyles,
        allUsersData,
        isAssignBranch,
        alldesignation,
        allTeam,
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
            pagename: String("Connections Members List"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.companyname),
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
    const [isBtn, setIsBtn] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleteOpenRestore, setIsDeleteOpenRestore] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        username: true,
        empcode: true,
        companyname: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        designation: true,
        rocketchatemail: true,
        rocketchatroles: true,
        channelName: true,
        teamName: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    //useEffect
    useEffect(() => {
        addSerialNumber();
    }, [teamsArray]);

    useEffect(() => {
        // fetchRockeChatTeamChannelGrouping();
        fetchRockeChatTeams();
        fetchRockeChatChannels();
    }, []);
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
    const [infoDetails, setInfoDetails] = useState({
        addedby: [],
        updatedby: [],
    })
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
    //Delete model
    const handleClickOpenRestore = () => {
        setIsDeleteOpenRestore(true);
    };
    const handleCloseModRestore = () => {
        setIsDeleteOpenRestore(false);
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
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };

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

    const [deleteTeamId, setDeleteTeamId] = useState({});

    const deleteTeam = async () => {
        setPageName(!pageName);
        try {
            await axios.post(
                `${SERVICE.REMOVE_USERFROM_ROCKETCHAT_CHANNEL}`,
                {
                    deleteData: deleteTeamId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            await filterFunction();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setPopupContent("Deleted Successfully");
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
                handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            }
        }
    };

    const bulkdeletefunction = async () => {
        setPageName(!pageName);
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.SINGLE_ROCKETCHAT_TEAMCHANNELGROUPING}/${item}`, {
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
            await fetchRockeChatTeamChannelGrouping();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const [restoreTeamId, setRestoreTeamId] = useState("");



    //submit option for saving


    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.put(
                `${SERVICE.SINGLE_ROCKETCHAT_TEAMCHANNELGROUPING}/${filterStateEdit?.id}`,
                {
                    type: filterStateEdit?.type,
                    company: valueCompanyEditCat,
                    branch: valueBranchEditCat,
                    unit: valueUnitEditCat,
                    team: valueTeamEditCat,
                    department: valueDepartmentEditCat,
                    designation: valueDesignationEditCat,
                    // rocketchatteam: valueRocketchatTeamEditCat,
                    // rocketchatteamid: valueRocketchatTeamIdEditCat,
                    rocketchatteam: [filterStateEdit.connectionteam],
                    rocketchatteamid: [filterStateEdit.connectionteamid],
                    rocketchatchannel: valueRocketchatChannelEditCat,
                    rocketchatchannelid: valueRocketchatChannelIdEditCat,
                    updatedby: [
                        ...filterStateEdit?.updatedby,
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
            await fetchRockeChatTeamChannelGrouping();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            console.log("Error Response:", err.response);
            let error = err.response?.data?.message;
            if (error) {
                setPopupContentMalert(error);
                setPopupSeverityMalert("error");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            }
        }
    };
    const editSubmit = (e) => {
        e.preventDefault();

        const isDuplicate = teamsArray?.filter(data => data?._id !== filterStateEdit?.id)?.some((entry) => {
            // Common checks based on type
            const checkCompany = entry?.company.some(company => valueCompanyEditCat.includes(company));
            const checkBranch = entry?.branch.some(branch => valueBranchEditCat.includes(branch));
            const checkUnit = entry?.unit.some(unit => valueUnitEditCat.includes(unit));
            const checkTeam = entry?.team.some(team => valueTeamEditCat.includes(team));
            const checkDepartment = entry?.department.some(department => valueDepartmentEditCat.includes(department));
            const checkDesignation = entry?.designation.some(designation => valueDesignationEditCat.includes(designation));
            const checkRocketChatTeam = entry?.rocketchatteam.some(team => valueRocketchatTeamEditCat.includes(team));
            // Conditional check for RocketChatChannel only if valueRocketchatChannelCat is non-empty
            const checkRocketChatChannel = valueRocketchatChannelEditCat.length > 0
                ? entry.rocketchatchannel.some(channel => valueRocketchatChannelEditCat.includes(channel))
                : true;

            // Type-specific checks
            if (filterState.type === "Company") {
                return checkCompany && checkRocketChatTeam && checkRocketChatChannel;
            } else if (filterState.type === "Branch") {
                return checkCompany && checkBranch && checkRocketChatTeam && checkRocketChatChannel;
            } else if (filterState.type === "Unit") {
                return checkCompany && checkBranch && checkUnit && checkRocketChatTeam && checkRocketChatChannel;
            } else if (filterState.type === "Team") {
                return checkCompany && checkBranch && checkUnit && checkTeam && checkRocketChatTeam && checkRocketChatChannel;
            } else if (filterState.type === "Department") {
                return checkCompany && checkDepartment && checkBranch && checkRocketChatTeam && checkRocketChatChannel;
            } else if (filterState.type === "Designation") {
                return checkCompany && checkDesignation && checkBranch && checkRocketChatTeam && checkRocketChatChannel;
            }

            return false; // Default to no match if type doesn't match any condition
        });
        if (
            isDuplicate
        ) {
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            filterStateEdit?.type === "Please Select Type" ||
            filterStateEdit?.type === ""
        ) {
            setPopupContentMalert("Please Select Type!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsCompanyEdit?.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            ["Individual", "Branch", "Unit", "Team", "Department", "Designation"]?.includes(filterStateEdit?.type) &&
            selectedOptionsBranchEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Unit", "Team"]?.includes(filterStateEdit?.type) &&
            selectedOptionsUnitEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Team"]?.includes(filterStateEdit?.type) &&
            selectedOptionsTeamEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            filterStateEdit?.type === "Individual" &&
            selectedOptionsEmployeeEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Employee!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            filterStateEdit?.type === "Department" &&
            selectedOptionsDepartmentEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Department!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            filterStateEdit?.type === "Designation" &&
            selectedOptionsDesignationEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Designation!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        // else if (filterStateEdit.connectionteam === "" || !filterStateEdit.connectionteam) {
        //     setPopupContentMalert("Please Select Connections Team!");
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }
        // else if (selectedOptionsRocketchatTeamEdit?.length === 0) {
        //     setPopupContentMalert("Please Select Connections Teams!");
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }
        // else if (selectedOptionsRocketchatChannelEdit?.length === 0) {
        //     setPopupContentMalert("Please Select Connections Channels!");
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }
        else {
            sendEditRequest();
        }
    };
    //get all Asset Variant name.

    const fetchRockeChatTeamChannelGrouping = async () => {
        setPageName(!pageName);
        try {
            setLoader(true);
            let response = await axios.get(SERVICE.GET_ALL_ROCKETCHAT_TEAMCHANNELGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setTeamsArray(response?.data?.teamchannelgrouping);
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
                handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            }
        }
    };
    const [teamsOptions, setTeamsOptions] = useState([])
    const fetchRockeChatTeams = async () => {
        setPageName(!pageName);
        try {
            let response = await axios.get(SERVICE.GET_ALL_ROCKETCHAT_TEAMS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setTeamsOptions(response?.data?.rocketchatTeams?.map((data) => ({
                value: data?.name,
                label: data?.name,
                id: data?._id
            })));
        } catch (err) {
            console.log(err);
            let error = err.response?.data?.message;
            if (error) {
                setPopupContentMalert(error);
                setPopupSeverityMalert("error");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            }
        }
    };
    const [channelsOptions, setChannelsOptions] = useState([])
    const fetchRockeChatChannels = async () => {
        setPageName(!pageName);
        try {
            let response = await axios.get(SERVICE.GET_ALL_ROCKETCHAT_CHANNELS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setChannelsOptions(response?.data?.rocketchatChannels);
            console.log(response?.data?.rocketchatChannels, "channels");
        } catch (err) {
            console.log(err);
            let error = err.response?.data?.message;
            if (error) {
                setPopupContentMalert(error);
                setPopupSeverityMalert("error");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            }
        }
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Connections Members List.png");
                });
            });
        }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Connections Members List",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = () => {
        const itemsWithSerialNumber = teamsArray?.map((data, index) => ({
            ...data,
            serialNumber: index + 1,
            rocketchatroles: data?.rocketchatroles?.join(","),
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
            field: "username",
            headerName: "Username",
            flex: 0,
            width: 150,
            hide: !columnVisibility.username,
            headerClassName: "bold-header",
        },
        {
            field: "companyname",
            headerName: "Employee Name",
            flex: 0,
            width: 180,
            hide: !columnVisibility.companyname,
            headerClassName: "bold-header",
        },
        {
            field: "empcode",
            headerName: "Emp Code",
            flex: 0,
            width: 150,
            hide: !columnVisibility.empcode,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 150,
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
            field: "department",
            headerName: "Department",
            flex: 0,
            width: 150,
            hide: !columnVisibility.department,
            headerClassName: "bold-header",
        },
        {
            field: "designation",
            headerName: "Designation",
            flex: 0,
            width: 150,
            hide: !columnVisibility.designation,
            headerClassName: "bold-header",
        },
        {
            field: "rocketchatroles",
            headerName: "Connections Roles",
            flex: 0,
            width: 150,
            hide: !columnVisibility.rocketchatroles,
            headerClassName: "bold-header",
        },
        {
            field: "rocketchatemail",
            headerName: "Connections Email",
            flex: 0,
            width: 150,
            hide: !columnVisibility.rocketchatemail,
            headerClassName: "bold-header",
        },
        {
            field: "teamName",
            headerName: "Connections Team",
            flex: 0,
            width: 150,
            hide: !columnVisibility.teamName,
            headerClassName: "bold-header",
        },
        {
            field: "channelName",
            headerName: "Connections Channel",
            flex: 0,
            width: 150,
            hide: !columnVisibility.channelName,
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
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {/* {isUserRoleCompare?.includes("ememberslist") && (
                        <>
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    getCode(params.row.id)

                                }}
                            >
                                <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                            </Button>
                        </>
                    )} */}

                    {isUserRoleCompare?.includes("dmemberslist") && (
                        <>
                            <Button
                                sx={userStyle.buttondelete}
                                onClick={(e) => {
                                    setDeleteTeamId(params.row);
                                    handleClickOpen();
                                }}
                            >
                                <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                            </Button>
                        </>
                    )}
                    {isUserRoleCompare?.includes("vmemberslist") && (
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
                    {/* {isUserRoleCompare?.includes("ilist") && (
                        <Button
                            size="small"
                            sx={userStyle.actionbutton}
                            onClick={() => {
                                setInfoDetails({
                                    addedby: params?.row?.addedby,
                                    updatedby: params?.row?.updatedby,
                                })
                                handleClickOpeninfo();
                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
                        </Button>
                    )} */}
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData.map((data, index) => {
        return {
            id: data._id,
            serialNumber: data.serialNumber,
            username: data?.username,
            empcode: data?.empcode,
            employeeid: data?.employeeid,
            workmode: data?.workmode,
            companyname: data?.companyname,
            company: data.company,
            branch: data.branch,
            unit: data.unit,
            team: data.team,
            department: data?.department,
            designation: data?.designation,
            rocketchatid: data?.rocketchatid,
            rocketchatemail: data?.rocketchatemail,
            rocketchatroles: data?.rocketchatroles,
            channelId: data?.channelId,
            channelName: data?.channelName,
            teamId: data?.teamId,
            teamName: data?.teamName,
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
    const [filterStateEdit, setFilterStateEdit] = useState({
        type: "Company",
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
        { label: "Company", value: "Company" },
        { label: "Branch", value: "Branch" },
        { label: "Unit", value: "Unit" },
        { label: "Team", value: "Team" },
        { label: "Department", value: "Department" },
        { label: "Designation", value: "Designation" },
    ];

    const getCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SINGLE_ROCKETCHAT_TEAMCHANNELGROUPING}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let singleData = res?.data?.steamchannelgrouping;


            setFilterStateEdit({
                type: singleData?.type,
                id: e,
                updatedby: singleData?.updatedby || [],
                connectionteam: singleData?.rocketchatteam?.join(","),
                connectionteamid: singleData?.rocketchatteamid?.join(",")
            });

            setValueCompanyEditCat(singleData?.company);
            setSelectedOptionsCompanyEdit(singleData?.company.map((t) => ({
                label: t,
                value: t,
            })));
            setValueBranchEditCat(singleData?.branch);
            setSelectedOptionsBranchEdit(singleData?.branch.map((t) => ({
                label: t,
                value: t,
            })));
            setValueUnitEditCat(singleData?.unit);
            setSelectedOptionsUnitEdit(singleData?.unit.map((t) => ({
                label: t,
                value: t,
            })));
            setValueTeamEditCat(singleData?.team);
            setSelectedOptionsTeamEdit(singleData?.team.map((t) => ({
                label: t,
                value: t,
            })));
            setValueDepartmentEditCat(singleData?.department);
            setSelectedOptionsDepartmentEdit(singleData?.department.map((t) => ({
                label: t,
                value: t,
            })));
            setValueDesignationEditCat(singleData?.designation);
            setSelectedOptionsDesignationEdit(singleData?.designation.map((t) => ({
                label: t,
                value: t,
            })));
            setValueEmployeeEditCat([]);
            setSelectedOptionsEmployeeEdit([]);

            setValueRocketchatTeamEditCat(singleData?.rocketchatteam);
            setValueRocketchatTeamIdEditCat(singleData?.rocketchatteamid)


            setSelectedOptionsRocketchatTeamEdit(
                singleData?.rocketchatteam.map((teamName) => {
                    const matchedTeam = teamsOptions.find((team) => team.value === teamName);
                    return {
                        label: teamName,
                        value: teamName,
                        id: matchedTeam ? matchedTeam.id : "",
                    };
                })
            );
            console.log(
                singleData?.rocketchatteam.map((teamName) => {
                    const matchedTeam = teamsOptions.find((team) => team.value === teamName);
                    return {
                        label: teamName,
                        value: teamName,
                        id: matchedTeam ? matchedTeam.id : "",
                    };
                })
                , "getcode")
            console.log(
                teamsOptions, "teamsOptions")
            setValueRocketchatChannelEditCat(singleData?.rocketchatchannel);
            setValueRocketchatChannelIdEditCat(singleData?.rocketchatchannelid)
            setSelectedOptionsRocketchatChannelEdit(singleData?.rocketchatchannel.map((t) => ({
                label: t,
                value: t,
            })));
            handleClickOpenEdit();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
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
    //company multiselect edit
    const [selectedOptionsCompanyEdit, setSelectedOptionsCompanyEdit] = useState([]);
    let [valueCompanyEditCat, setValueCompanyEditCat] = useState([]);

    const handleCompanyEditChange = (options) => {
        setValueCompanyEditCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompanyEdit(options);
        setValueBranchEditCat([]);
        setSelectedOptionsBranchEdit([]);
        setValueUnitEditCat([]);
        setSelectedOptionsUnitEdit([]);
        setValueTeamEditCat([]);
        setSelectedOptionsTeamEdit([]);
        setValueDepartmentEditCat([]);
        setSelectedOptionsDepartmentEdit([]);
        setValueEmployeeEditCat([]);
        setSelectedOptionsEmployeeEdit([]);
    };

    const customValueRendererCompanyEdit = (valueCompanyEditCat, _categoryname) => {
        return valueCompanyEditCat?.length
            ? valueCompanyEditCat.map(({ label }) => label)?.join(", ")
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
    //branch multiselect edit
    const [selectedOptionsBranchEdit, setSelectedOptionsBranchEdit] = useState([]);
    let [valueBranchEditCat, setValueBranchEditCat] = useState([]);

    const handleBranchEditChange = (options) => {
        setValueBranchEditCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranchEdit(options);
        setValueUnitEditCat([]);
        setSelectedOptionsUnitEdit([]);
        setValueTeamEditCat([]);
        setSelectedOptionsTeamEdit([]);
        setValueDepartmentEditCat([]);
        setSelectedOptionsDepartmentEdit([]);
        setValueEmployeeEditCat([]);
        setSelectedOptionsEmployeeEdit([]);
    };

    const customValueRendererBranchEdit = (valueBranchEditCat, _categoryname) => {
        return valueBranchEditCat?.length
            ? valueBranchEditCat.map(({ label }) => label)?.join(", ")
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
    //unit multiselect
    const [selectedOptionsUnitEdit, setSelectedOptionsUnitEdit] = useState([]);
    let [valueUnitEditCat, setValueUnitEditCat] = useState([]);

    const handleUnitEditChange = (options) => {
        setValueUnitEditCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnitEdit(options);
        setValueTeamEditCat([]);
        setSelectedOptionsTeamEdit([]);
        setValueDepartmentEditCat([]);
        setSelectedOptionsDepartmentEdit([]);
        setValueEmployeeEditCat([]);
        setSelectedOptionsEmployeeEdit([]);
    };

    const customValueRendererUnitEdit = (valueUnitEditCat, _categoryname) => {
        return valueUnitEditCat?.length
            ? valueUnitEditCat.map(({ label }) => label)?.join(", ")
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
    //team multiselect edit
    const [selectedOptionsTeamEdit, setSelectedOptionsTeamEdit] = useState([]);
    let [valueTeamEditCat, setValueTeamEditCat] = useState([]);

    const handleTeamEditChange = (options) => {
        setValueTeamEditCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeamEdit(options);
        setValueDepartmentEditCat([]);
        setSelectedOptionsDepartmentEdit([]);
        setValueEmployeeEditCat([]);
        setSelectedOptionsEmployeeEdit([]);
    };

    const customValueRendererTeamEdit = (valueTeamEditCat, _categoryname) => {
        return valueTeamEditCat?.length
            ? valueTeamEditCat.map(({ label }) => label)?.join(", ")
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

    //department multiselect edit
    const [selectedOptionsDepartmentEdit, setSelectedOptionsDepartmentEdit] = useState(
        []
    );
    let [valueDepartmentEditCat, setValueDepartmentEditCat] = useState([]);

    const handleDepartmentEditChange = (options) => {
        setValueDepartmentEditCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDepartmentEdit(options);
        setValueEmployeeEditCat([]);
        setSelectedOptionsEmployeeEdit([]);
    };

    const customValueRendererDepartmentEdit = (valueDepartmentEditCat, _categoryname) => {
        return valueDepartmentEditCat?.length
            ? valueDepartmentEditCat.map(({ label }) => label)?.join(", ")
            : "Please Select Department";
    };
    //designation multiselect
    const [selectedOptionsDesignation, setSelectedOptionsDesignation] = useState(
        []
    );
    let [valueDesignationCat, setValueDesignationCat] = useState([]);

    const handleDesignationChange = (options) => {
        setValueDesignationCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDesignation(options);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererDesignation = (valueDesignationCat, _categoryname) => {
        return valueDesignationCat?.length
            ? valueDesignationCat.map(({ label }) => label)?.join(", ")
            : "Please Select Designation";
    };

    //Designation multiselect edit
    const [selectedOptionsDesignationEdit, setSelectedOptionsDesignationEdit] = useState(
        []
    );
    let [valueDesignationEditCat, setValueDesignationEditCat] = useState([]);

    const handleDesignationEditChange = (options) => {
        setValueDesignationEditCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDesignationEdit(options);
        setValueEmployeeEditCat([]);
        setSelectedOptionsEmployeeEdit([]);
    };

    const customValueRendererDesignationEdit = (valueDesignationEditCat, _categoryname) => {
        return valueDesignationEditCat?.length
            ? valueDesignationEditCat.map(({ label }) => label)?.join(", ")
            : "Please Select Designation";
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
    //employee multiselect edit
    const [selectedOptionsEmployeeEdit, setSelectedOptionsEmployeeEdit] = useState([]);
    let [valueEmployeeEditCat, setValueEmployeeEditCat] = useState([]);

    const handleEmployeeEditChange = (options) => {
        setValueEmployeeEditCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsEmployeeEdit(options);
    };

    const customValueRendererEmployeeEdit = (valueEmployeeEditCat, _categoryname) => {
        return valueEmployeeEditCat?.length
            ? valueEmployeeEditCat.map(({ label }) => label)?.join(", ")
            : "Please Select Employee";
    };
    //rocketchat teams multiselect create
    const [selectedOptionsRocketchatTeam, setSelectedOptionsRocketchatTeam] = useState([]);
    let [valueRocketchatTeamCat, setValueRocketchatTeamCat] = useState([]);
    let [valueRocketchatTeamIdCat, setValueRocketchatTeamIdCat] = useState([]);

    const handleRocketchatTeamChange = (options) => {
        setValueRocketchatTeamCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setValueRocketchatTeamIdCat(
            options.map((a, index) => {
                return a.id;
            })
        )
        setSelectedOptionsRocketchatTeam(options);
        setValueRocketchatChannelCat([])
        setSelectedOptionsRocketchatChannel([])
        setValueRocketchatChannelIdCat([])
    };

    const customValueRendererRocketchatTeam = (valueRocketchatTeamCat, _categoryname) => {
        return valueRocketchatTeamCat?.length
            ? valueRocketchatTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Connections Team";
    };
    //rocketchat teams multiselect edit
    const [selectedOptionsRocketchatTeamEdit, setSelectedOptionsRocketchatTeamEdit] = useState([]);
    let [valueRocketchatTeamEditCat, setValueRocketchatTeamEditCat] = useState([]);
    let [valueRocketchatTeamIdEditCat, setValueRocketchatTeamIdEditCat] = useState([]);
    const handleRocketchatTeamEditChange = (options) => {
        setValueRocketchatTeamEditCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setValueRocketchatTeamIdEditCat(
            options.map((a, index) => {
                return a.id;
            })
        )
        setSelectedOptionsRocketchatTeamEdit(options);
        setValueRocketchatChannelEditCat([])
        setSelectedOptionsRocketchatChannelEdit([])
        setValueRocketchatChannelIdEditCat([])
    };

    const customValueRendererRocketchatTeamEdit = (valueRocketchatTeamEditCat, _categoryname) => {
        return valueRocketchatTeamEditCat?.length
            ? valueRocketchatTeamEditCat.map(({ label }) => label)?.join(", ")
            : "Please Select Connections Team";
    };


    //rocketchat channels multiselect create
    const [selectedOptionsRocketchatChannel, setSelectedOptionsRocketchatChannel] = useState([]);
    let [valueRocketchatChannelCat, setValueRocketchatChannelCat] = useState([]);
    let [valueRocketchatChannelIdCat, setValueRocketchatChannelIdCat] = useState([]);

    const handleRocketchatChannelChange = (options) => {
        setValueRocketchatChannelCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setValueRocketchatChannelIdCat(
            options.map((a, index) => {
                return a.id;
            })
        )
        setSelectedOptionsRocketchatChannel(options);
    };

    const customValueRendererRocketchatChannel = (valueRocketchatChannelCat, _categoryname) => {
        return valueRocketchatChannelCat?.length
            ? valueRocketchatChannelCat.map(({ label }) => label)?.join(", ")
            : "Please Select Connections Channel";
    };
    //rocketchat channels multiselect edit
    const [selectedOptionsRocketchatChannelEdit, setSelectedOptionsRocketchatChannelEdit] = useState([]);
    let [valueRocketchatChannelEditCat, setValueRocketchatChannelEditCat] = useState([]);
    let [valueRocketchatChannelIdEditCat, setValueRocketchatChannelIdEditCat] = useState([]);

    const handleRocketchatChannelEditChange = (options) => {
        setValueRocketchatChannelEditCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setValueRocketchatChannelIdEditCat(
            options.map((a, index) => {
                return a.id;
            })
        )
        setSelectedOptionsRocketchatChannelEdit(options);
    };

    const customValueRendererRocketchatEditChannel = (valueRocketchatChannelEditCat, _categoryname) => {
        return valueRocketchatChannelEditCat?.length
            ? valueRocketchatChannelEditCat.map(({ label }) => label)?.join(", ")
            : "Please Select Connections Channel";
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
        setSelectedOptionsRocketchatTeam([]);
        setValueRocketchatTeamCat([])
        setValueRocketchatTeamIdCat([])
        setSelectedOptionsRocketchatChannel([]);
        setValueRocketchatChannelCat([])
        setValueRocketchatChannelIdCat([])

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
    const handleSubmit = () => {

        if (
            filterState?.type === "Please Select Type" ||
            filterState?.type === ""
        ) {
            setPopupContentMalert("Please Select Type!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsCompany?.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        // else if (
        //   filterState?.employeestatus === "Please Select Employee Status" ||
        //   filterState?.employeestatus === ""
        // ) {
        //   setPopupContentMalert("Please Select Employee Status!");
        //   setPopupSeverityMalert("info");
        //   handleClickOpenPopupMalert();
        // }
        else if (
            ["Individual", "Branch", "Unit", "Team", "Department", "Designation"]?.includes(filterState?.type) &&
            selectedOptionsBranch?.length === 0
        ) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
            selectedOptionsUnit?.length === 0
        ) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Team"]?.includes(filterState?.type) &&
            selectedOptionsTeam?.length === 0
        ) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            filterState?.type === "Individual" &&
            selectedOptionsEmployee?.length === 0
        ) {
            setPopupContentMalert("Please Select Employee!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            filterState?.type === "Department" &&
            selectedOptionsDepartment?.length === 0
        ) {
            setPopupContentMalert("Please Select Department!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            filterState?.type === "Designation" &&
            selectedOptionsDesignation?.length === 0
        ) {
            setPopupContentMalert("Please Select Designation!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        // else if (filterState.connectionteam === "" || !filterStateEdit.connectionteam) {
        //     setPopupContentMalert("Please Select Connections Team!");
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }
        // else if (selectedOptionsRocketchatTeam?.length === 0) {
        //     setPopupContentMalert("Please Select Connections Teams!");
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }
        // else if (selectedOptionsRocketchatChannel?.length === 0) {
        //     setPopupContentMalert("Please Select Connections Channels!");
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }
        else {
            filterFunction();
        }
    };

    const filterFunction = async () => {
        setFilterLoader(true);
        setTableLoader(true);
        setPageName(!pageName);
        try {
            let response = await axios.post(
                SERVICE.ROCKETCHAT_MEMBERS_FILTER,
                {
                    type: filterState?.type,
                    company: valueCompanyCat,
                    branch: valueBranchCat,
                    unit: valueUnitCat,
                    team: valueTeamCat,
                    department: valueDepartmentCat,
                    designation: valueDesignationCat,
                    employeename: valueEmployeeCat,
                    rocketchatteam: valueRocketchatTeamCat,
                    rocketchatteamid: valueRocketchatTeamIdCat,
                    rocketchatchannel: valueRocketchatChannelCat,
                    rocketchatchannelid: valueRocketchatChannelIdCat,
                    assigncompany: allAssignCompany,
                    assignbranch: allAssignBranch,
                    assignunit: allAssignUnit
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            setTeamsArray(response?.data?.users)
            setFilterLoader(false);
            setTableLoader(false);
            setIsBtn(false);
        } catch (err) {
            console.log(err);
            setFilterLoader(true);
            setTableLoader(true);
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };
    // const sendRequest = async () => {
    //     setFilterLoader(true);
    //     setTableLoader(true);
    //     setPageName(!pageName);
    //     try {
    //         let response = await axios.post(
    //             SERVICE.CREATE_ROCKETCHAT_TEAMCHANNELGROUPING,
    //             {
    //                 type: filterState?.type,
    //                 company: valueCompanyCat,
    //                 branch: valueBranchCat,
    //                 unit: valueUnitCat,
    //                 team: valueTeamCat,
    //                 department: valueDepartmentCat,
    //                 designation: valueDesignationCat,
    //                 // rocketchatteam: valueRocketchatTeamCat,
    //                 // rocketchatteamid: valueRocketchatTeamIdCat,
    //                 rocketchatteam: [filterState.connectionteam],
    //                 rocketchatteamid: [filterState.connectionteamid],
    //                 rocketchatchannel: valueRocketchatChannelCat,
    //                 rocketchatchannelid: valueRocketchatChannelIdCat,
    //                 addedby: [
    //                     {
    //                         name: String(isUserRoleAccess?.companyname),
    //                         date: String(new Date()),
    //                     },
    //                 ],
    //             },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${auth.APIToken}`,
    //                 },
    //             }
    //         );

    //         setFilterLoader(false);
    //         setTableLoader(false);
    //         await fetchRockeChatTeamChannelGrouping();
    //         setPopupContent("Added Successfully");
    //         setPopupSeverity("success");
    //         handleClickOpenPopup();
    //         setIsBtn(false);
    //     } catch (err) {
    //         console.log(err);
    //         setFilterLoader(true);
    //         setTableLoader(true);
    //         handleApiError(
    //             err,
    //             setPopupContentMalert,
    //             setPopupSeverityMalert,
    //             handleClickOpenPopupMalert
    //         );
    //     }
    // };

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
                        selectedTeam?.includes(u.team) &&
                        u.workmode !== "Internship"
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
                        selectedTeam?.includes(u.team) &&
                        u.workmode !== "Internship"
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


    return (
        <Box>
            <Headtitle title={"CONNECTIONS MEMBERS LIST"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Connections Members List"
                modulename="Connections"
                submodulename="Connections Members List"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            <>
                {isUserRoleCompare?.includes("amemberslist") && (
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Filter Connections Members List
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={TypeOptions}
                                            styles={colourStyles}
                                            value={{
                                                label:
                                                    !filterState.type ? "Please Select Type" : filterState.type,
                                                value:
                                                    !filterState.type ? "Please Select Type" : filterState.type,
                                            }}
                                            onChange={(e) => {
                                                setFilterState((prev) => ({
                                                    ...prev,
                                                    type: e.value,
                                                }));
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
                                                setValueDesignationCat([]);
                                                setSelectedOptionsDesignation([]);
                                                setValueEmployeeCat([]);
                                                setSelectedOptionsEmployee([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>
                                        Company<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <FormControl size="small" fullWidth>
                                        <MultiSelect
                                            options={accessbranch
                                                ?.map((data) => ({
                                                    label: data.company,
                                                    value: data.company,
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
                                            value={selectedOptionsCompany}
                                            onChange={(e) => {
                                                handleCompanyChange(e);
                                            }}
                                            valueRenderer={customValueRendererCompany}
                                            labelledBy="Please Select Company"
                                        />
                                    </FormControl>
                                </Grid>
                                {["Individual", "Team"]?.includes(filterState.type) ? (
                                    <>
                                        {/* Branch Unit Team */}
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
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
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
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
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Team<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={allTeam
                                                        ?.filter(
                                                            (u) =>
                                                                valueCompanyCat?.includes(u.company) &&
                                                                valueBranchCat?.includes(u.branch) &&
                                                                valueUnitCat?.includes(u.unit)
                                                        )
                                                        .map((u) => ({
                                                            ...u,
                                                            label: u.teamname,
                                                            value: u.teamname,
                                                        }))}
                                                    value={selectedOptionsTeam}
                                                    onChange={(e) => {
                                                        handleTeamChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererTeam}
                                                    labelledBy="Please Select Team"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Department"]?.includes(filterState.type) ? (
                                    <>
                                        {/* Department */}
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
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
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Department<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={departmentOptions}
                                                    value={selectedOptionsDepartment}
                                                    onChange={(e) => {
                                                        handleDepartmentChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererDepartment}
                                                    labelledBy="Please Select Department"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Designation"]?.includes(filterState.type) ? (
                                    <>
                                        {/* Designation */}
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
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
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Designation<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={alldesignation?.map(data => ({
                                                        label: data.name,
                                                        value: data.name,
                                                    })).filter((item, index, self) => {
                                                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                    })}
                                                    value={selectedOptionsDesignation}
                                                    onChange={(e) => {
                                                        handleDesignationChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererDesignation}
                                                    labelledBy="Please Select Designation"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Branch"]?.includes(filterState.type) ? (
                                    <>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
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
                                    </>
                                ) : ["Unit"]?.includes(filterState.type) ? (
                                    <>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
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
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
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
                                    </>
                                ) : (
                                    ""
                                )}
                                {["Individual"]?.includes(filterState.type) && (
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={allUsersData
                                                    ?.filter(
                                                        (u) =>
                                                            valueCompanyCat?.includes(u.company) &&
                                                            valueBranchCat?.includes(u.branch) &&
                                                            valueUnitCat?.includes(u.unit) &&
                                                            valueTeamCat?.includes(u.team) &&
                                                            u.workmode !== "Internship"
                                                    )
                                                    .map((u) => ({
                                                        label: u.companyname,
                                                        value: u.companyname,
                                                    }))}
                                                value={selectedOptionsEmployee}
                                                onChange={(e) => {
                                                    handleEmployeeChange(e);
                                                }}
                                                valueRenderer={customValueRendererEmployee}
                                                labelledBy="Please Select Employee"
                                            />
                                        </FormControl>
                                    </Grid>
                                )}
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            Connections Team
                                        </Typography>
                                        <MultiSelect
                                            options={teamsOptions}
                                            value={selectedOptionsRocketchatTeam}
                                            onChange={(e) => {
                                                handleRocketchatTeamChange(e);
                                            }}
                                            valueRenderer={customValueRendererRocketchatTeam}
                                            labelledBy="Please Select Connections Teams"
                                        />
                                        {/* <Selects
                                            options={teamsOptions}
                                            styles={colourStyles}
                                            value={{
                                                label:
                                                    !filterState.connectionteam ? "Please Select Connection Team" : filterState.connectionteam,
                                                value:
                                                    !filterState.connectionteam ? "Please Select Connection Team" : filterState.connectionteam,
                                            }}
                                            onChange={(e) => {
                                                setFilterState((prev) => ({
                                                    ...prev,
                                                    connectionteam: e.value,
                                                    connectionteamid: e.id,
                                                }));
                                                setValueRocketchatChannelCat([])
                                                setSelectedOptionsRocketchatChannel([])
                                                setValueRocketchatChannelIdCat([])
                                            }}
                                        /> */}
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            Connections Channels
                                        </Typography>
                                        <MultiSelect
                                            options={channelsOptions?.filter(data => selectedOptionsRocketchatTeam?.some(item => item.id === data?.teamId))?.map(entry => ({
                                                label: entry.name,
                                                value: entry.name,
                                                id: entry._id
                                            }))}
                                            value={selectedOptionsRocketchatChannel}
                                            onChange={(e) => {
                                                handleRocketchatChannelChange(e);
                                            }}
                                            valueRenderer={customValueRendererRocketchatChannel}
                                            labelledBy="Please Select Connections Channels"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6} mt={3}>
                                    <div style={{ display: "flex", gap: "20px" }}>
                                        <LoadingButton
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSubmit}
                                            loading={filterLoader}
                                            sx={buttonStyles.buttonsubmit}
                                        >
                                            Filter
                                        </LoadingButton>

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
            {isUserRoleCompare?.includes("lmemberslist") && (
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
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>
                                    List Connections Members List
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
                                            <MenuItem value={teamsArray?.length}>
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
                                        {isUserRoleCompare?.includes("excelmemberslist") && (
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
                                        {isUserRoleCompare?.includes("csvmemberslist") && (
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
                                        {isUserRoleCompare?.includes("printmemberslist") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfmemberslist") && (
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
                                        {isUserRoleCompare?.includes("imagememberslist") && (
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
                            &ensp;
                            {/* {isUserRoleCompare?.includes("bdspeed") && (
                                <Button
                                    variant="contained"
                                    sx={buttonStyles.buttonbulkdelete}
                                    onClick={handleClickOpenalert}
                                >
                                    Bulk Delete
                                </Button>
                            )} */}
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
                            {" "}
                            View Connections Members List
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Username</Typography>
                                    <Typography>{singleRow.username}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Employee Name</Typography>
                                    <Typography>{singleRow.companyname}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Emp Code</Typography>
                                    <Typography>{singleRow.empcode}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{singleRow.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{singleRow.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{singleRow.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Team</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{singleRow.team}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Department</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{singleRow.department}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Designation</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{singleRow.designation}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Connections Email</Typography>
                                    <Typography>{singleRow.rocketchatemail}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Connections Roles</Typography>
                                    <Typography>{singleRow.rocketchatroles}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6" >Connections Team</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{singleRow.teamName}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Connections Channel</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{singleRow.channelName}</Typography>
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
            {/* Edit DIALOG */}
            <Box>
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    fullWidth={true}
                    sx={{
                        overflow: "visible",
                        marginTop: "20px",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                    }}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Edit Connections Members List
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={6} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={TypeOptions}
                                            styles={colourStyles}
                                            value={{
                                                label:
                                                    !filterStateEdit.type ? "Please Select Type" : filterStateEdit.type,
                                                value:
                                                    !filterStateEdit.type ? "Please Select Type" : filterStateEdit.type,
                                            }}
                                            onChange={(e) => {
                                                setFilterStateEdit((prev) => ({
                                                    ...prev,
                                                    type: e.value,
                                                }));
                                                setValueCompanyEditCat([]);
                                                setSelectedOptionsCompanyEdit([]);
                                                setValueBranchEditCat([]);
                                                setSelectedOptionsBranchEdit([]);
                                                setValueUnitEditCat([]);
                                                setSelectedOptionsUnitEdit([]);
                                                setValueTeamEditCat([]);
                                                setSelectedOptionsTeamEdit([]);
                                                setValueDepartmentEditCat([]);
                                                setSelectedOptionsDepartmentEdit([]);
                                                setValueDesignationEditCat([]);
                                                setSelectedOptionsDesignationEdit([]);
                                                setValueEmployeeEditCat([]);
                                                setSelectedOptionsEmployeeEdit([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={6} sm={6}>
                                    <Typography>
                                        Company<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <FormControl size="small" fullWidth>
                                        <MultiSelect
                                            options={accessbranch
                                                ?.map((data) => ({
                                                    label: data.company,
                                                    value: data.company,
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
                                            value={selectedOptionsCompanyEdit}
                                            onChange={(e) => {
                                                handleCompanyEditChange(e);
                                            }}
                                            valueRenderer={customValueRendererCompanyEdit}
                                            labelledBy="Please Select Company"
                                        />
                                    </FormControl>
                                </Grid>
                                {["Individual", "Team"]?.includes(filterStateEdit.type) ? (
                                    <>
                                        {/* Branch Unit Team */}
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyEditCat?.includes(comp.company)
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
                                                    value={selectedOptionsBranchEdit}
                                                    onChange={(e) => {
                                                        handleBranchEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranchEdit}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter(
                                                            (comp) =>
                                                                valueCompanyEditCat?.includes(comp.company) &&
                                                                valueBranchEditCat?.includes(comp.branch)
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
                                                    value={selectedOptionsUnitEdit}
                                                    onChange={(e) => {
                                                        handleUnitEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererUnitEdit}
                                                    labelledBy="Please Select Unit"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Team<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={allTeam
                                                        ?.filter(
                                                            (u) =>
                                                                valueCompanyEditCat?.includes(u.company) &&
                                                                valueBranchEditCat?.includes(u.branch) &&
                                                                valueUnitEditCat?.includes(u.unit)
                                                        )
                                                        .map((u) => ({
                                                            ...u,
                                                            label: u.teamname,
                                                            value: u.teamname,
                                                        }))}
                                                    value={selectedOptionsTeamEdit}
                                                    onChange={(e) => {
                                                        handleTeamEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererTeamEdit}
                                                    labelledBy="Please Select Team"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Department"]?.includes(filterStateEdit.type) ? (
                                    <>
                                        {/* Department */}
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyEditCat?.includes(comp.company)
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
                                                    value={selectedOptionsBranchEdit}
                                                    onChange={(e) => {
                                                        handleBranchEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranchEdit}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Department<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={departmentOptions}
                                                    value={selectedOptionsDepartmentEdit}
                                                    onChange={(e) => {
                                                        handleDepartmentEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererDepartmentEdit}
                                                    labelledBy="Please Select Department"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Designation"]?.includes(filterStateEdit.type) ? (
                                    <>
                                        {/* Designation */}
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyEditCat?.includes(comp.company)
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
                                                    value={selectedOptionsBranchEdit}
                                                    onChange={(e) => {
                                                        handleBranchEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranchEdit}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Designation<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={alldesignation?.map(data => ({
                                                        label: data.name,
                                                        value: data.name,
                                                    })).filter((item, index, self) => {
                                                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                    })}
                                                    value={selectedOptionsDesignationEdit}
                                                    onChange={(e) => {
                                                        handleDesignationEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererDesignationEdit}
                                                    labelledBy="Please Select Designation"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Branch"]?.includes(filterStateEdit.type) ? (
                                    <>
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyEditCat?.includes(comp.company)
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
                                                    value={selectedOptionsBranchEdit}
                                                    onChange={(e) => {
                                                        handleBranchEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranchEdit}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Unit"]?.includes(filterStateEdit.type) ? (
                                    <>
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyEditCat?.includes(comp.company)
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
                                                    value={selectedOptionsBranchEdit}
                                                    onChange={(e) => {
                                                        handleBranchEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranchEdit}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter(
                                                            (comp) =>
                                                                valueCompanyEditCat?.includes(comp.company) &&
                                                                valueBranchEditCat?.includes(comp.branch)
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
                                                    value={selectedOptionsUnitEdit}
                                                    onChange={(e) => {
                                                        handleUnitEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererUnitEdit}
                                                    labelledBy="Please Select Unit"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : (
                                    ""
                                )}
                                {["Individual"]?.includes(filterStateEdit.type) && (
                                    <Grid item md={4} xs={6} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={allUsersData
                                                    ?.filter(
                                                        (u) =>
                                                            valueCompanyEditCat?.includes(u.company) &&
                                                            valueBranchEditCat?.includes(u.branch) &&
                                                            valueUnitEditCat?.includes(u.unit) &&
                                                            valueTeamEditCat?.includes(u.team) &&
                                                            u.workmode !== "Internship"
                                                    )
                                                    .map((u) => ({
                                                        label: u.companyname,
                                                        value: u.companyname,
                                                    }))}
                                                value={selectedOptionsEmployeeEdit}
                                                onChange={(e) => {
                                                    handleEmployeeEditChange(e);
                                                }}
                                                valueRenderer={customValueRendererEmployeeEdit}
                                                labelledBy="Please Select Employee"
                                            />
                                        </FormControl>
                                    </Grid>
                                )}
                                <Grid item md={4} xs={6} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            Connections Team
                                        </Typography>
                                        <MultiSelect
                                            options={teamsOptions}
                                            value={selectedOptionsRocketchatTeamEdit}
                                            onChange={(e) => {
                                                handleRocketchatTeamEditChange(e);
                                            }}
                                            valueRenderer={customValueRendererRocketchatTeamEdit}
                                            labelledBy="Please Select Connections Teams"
                                        />
                                        {/* <Selects
                                            options={teamsOptions}
                                            styles={colourStyles}
                                            value={{
                                                label:
                                                    !filterStateEdit.connectionteam ? "Please Select Connection Team" : filterStateEdit.connectionteam,
                                                value:
                                                    !filterStateEdit.connectionteam ? "Please Select Connection Team" : filterStateEdit.connectionteam,
                                            }}
                                            onChange={(e) => {
                                                setFilterStateEdit((prev) => ({
                                                    ...prev,
                                                    connectionteam: e.value,
                                                    connectionteamid: e.id,
                                                }));
                                                setValueRocketchatChannelEditCat([])
                                                setSelectedOptionsRocketchatChannelEdit([])
                                                setValueRocketchatChannelIdEditCat([])
                                            }}
                                        /> */}
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={6} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            Connections Channels
                                        </Typography>
                                        <MultiSelect
                                            options={channelsOptions?.filter(data => selectedOptionsRocketchatTeamEdit?.some(item => item.id === data?.teamId))?.map(entry => ({
                                                label: entry.name,
                                                value: entry.name,
                                                id: entry._id
                                            }))}
                                            value={selectedOptionsRocketchatChannelEdit}
                                            onChange={(e) => {
                                                handleRocketchatChannelEditChange(e);
                                            }}
                                            valueRenderer={customValueRendererRocketchatEditChannel}
                                            labelledBy="Please Select Connections Channels"
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid
                                container
                                spacing={2}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Grid item md={3} xs={12} sm={12}>
                                    <Button
                                        variant="contained"
                                        onClick={editSubmit}
                                        sx={buttonStyles.buttonsubmit}
                                    >
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={3} xs={12} sm={12}>
                                    <Button
                                        sx={buttonStyles.btncancel}
                                        onClick={handleCloseModEdit}
                                    >
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>
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
                filename={"Connections Members List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={deleteTeam}
                title="Are you sure? Do you want to remove user from this channel?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={bulkdeletefunction}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Connections Members List Info"
                addedby={infoDetails?.addedby}
                updateby={infoDetails?.updatedby}
            />
            {/*Team Restore ALERT DIALOG ARE YOU SURE? */}
            {/* <DeleteConfirmation
        open={isDeleteOpenRestore}
        onClose={handleCloseModRestore}
        onConfirm={restoreTeam}
        title="Are you sure, Do You Want to Restore This Team?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      /> */}

            {/* PLEASE SELECT ANY ROW */}
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />
            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default RocketchatMembersList;