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
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import {
    FormGroup, Backdrop,
    Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText,
    MenuItem, OutlinedInput, Popover, Select, TextField, Typography, Tooltip, Modal, FormControlLabel
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

function RocketchatTeamChannelGrouping() {
    const [isLoading, setIsLoading] = useState(false);

    const LoadingBackdrop = ({ open }) => {
        return (
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}
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



    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
        setUpdateLoader(false);
        setIsLoading(false);
        setFilterLoader(false);
    };
    const handleClosePopupMalert = () => {
        setUpdateLoader(false)
        setIsLoading(false);
        setOpenPopupMalert(false);
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setUpdateLoader(false)
        setIsLoading(false);
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setUpdateLoader(false)
        setIsLoading(false);
        setOpenPopup(false);
    };

    let exportColumnNames = [
        "Type",
        "Work Mode",
        "Company",
        "Branch",
        "Unit",
        "Team",
        "Department",
        "Designation",
        "Process",
        "Shift Grouping",
        "Shift",
        "Employee",
        "Connections Teams",
        "Connections Channels",
    ];
    let exportRowValues = [
        "type",
        "workmode",
        "company",
        "branch",
        "unit",
        "team",
        "department",
        "designation",
        "process",
        "shiftgrouping",
        "shift",
        "employeename",
        "rocketchatteam",
        "rocketchatchannel",
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
        isAssignBranch,
        alldesignation,
        allTeam,
        allUsersData,
    } = useContext(UserRoleAccessContext);

    // const [allUsersData, setAllUsersData] = useState([])
    // const fetchEmployeeDropdown = async () => {
    //     setPageName(!pageName);
    //     try {
    //         const aggregationPipeline = [
    //             {
    //                 $match: {
    //                     $and: [
    //                         {
    //                             enquirystatus: {
    //                                 $nin: ["Enquiry Purpose"],
    //                             },
    //                         },
    //                         // Reasonable status filter
    //                         {
    //                             resonablestatus: {
    //                                 $nin: [
    //                                     "Not Joined",
    //                                     "Postponed",
    //                                     "Rejected",
    //                                     "Closed",
    //                                     "Releave Employee",
    //                                     "Absconded",
    //                                     "Hold",
    //                                     "Terminate",
    //                                 ],
    //                             },
    //                         },
    //                         {
    //                             rocketchatid: {
    //                                 $exists: true, // Ensure the field exists
    //                                 $ne: "",       // Ensure it is not an empty string
    //                             },
    //                         },
    //                     ],
    //                 },
    //             },
    //             {
    //                 $project: {
    //                     empcode: 1,
    //                     companyname: 1,
    //                     company: 1,
    //                     branch: 1,
    //                     unit: 1,
    //                     team: 1,
    //                     department: 1,
    //                     designation: 1,
    //                     username: 1,
    //                 },
    //             },
    //         ];
    //         let response = await axios.post(
    //             SERVICE.DYNAMICUSER_CONTROLLER,
    //             {
    //                 aggregationPipeline,
    //             },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${auth.APIToken}`,
    //                 },
    //             }
    //         );
    //         setAllUsersData(response.data.users);

    //     } catch (err) {
    //         console.log(err);
    //         handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    //     }
    // };
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
        fetchProcess();
        ShiftGroupingDropdwons();
        // fetchEmployeeDropdown();
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Connections Team & Channel Grouping"),
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
        type: true,
        company: true,
        workmode: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        designation: true,
        employeename: true,
        process: true,
        shiftgrouping: true,
        shift: true,
        rocketchatteam: true,
        rocketchatchannel: true,
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
        fetchRockeChatTeamChannelGrouping();
        fetchMikroTikSecrets();
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
        setIsLoading(true);
        setPageName(!pageName);
        try {
            await axios.delete(
                `${SERVICE.SINGLE_ROCKETCHAT_TEAMCHANNELGROUPING}/${deleteTeamId?.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            await fetchRockeChatTeamChannelGrouping();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
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
        setIsLoading(true);
        setPageName(!pageName);
        try {
            let res = await axios.put(
                `${SERVICE.SINGLE_ROCKETCHAT_TEAMCHANNELGROUPING}/${filterStateEdit?.id}`,
                {
                    type: filterStateEdit?.type,
                    workmode: valueWorkModeEditCat,
                    company: valueCompanyEditCat,
                    branch: valueBranchEditCat,
                    unit: valueUnitEditCat,
                    team: valueTeamEditCat,
                    department: valueDepartmentEditCat,
                    designation: valueDesignationEditCat,
                    process: valueProcessEditCat,
                    shiftgrouping: valueShiftGroupingEditCat,
                    shift: valueShiftEditCat,
                    employeename: valueEmployeeEditCat,
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
            setUpdateLoader(false);
            setIsLoading(false);
        } catch (err) {
            setUpdateLoader(false);
            setIsLoading(false);
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
        setUpdateLoader(true);
        e.preventDefault();

        // const isDuplicate = teamsArray?.filter(data => data?._id !== filterStateEdit?.id)?.some((entry) => {
        //     // Common checks based on type
        //     const checkCompany = entry?.company.some(company => valueCompanyEditCat.includes(company));
        //     const checkBranch = entry?.branch.some(branch => valueBranchEditCat.includes(branch));
        //     const checkUnit = entry?.unit.some(unit => valueUnitEditCat.includes(unit));
        //     const checkTeam = entry?.team.some(team => valueTeamEditCat.includes(team));
        //     const checkDepartment = entry?.department.some(department => valueDepartmentEditCat.includes(department));
        //     const checkDesignation = entry?.designation.some(designation => valueDesignationEditCat.includes(designation));
        //     const checkEmployee = entry?.employeename.some(employee => valueEmployeeEditCat.includes(employee));
        //     // const checkRocketChatTeam = entry?.rocketchatteam.some(team => valueRocketchatTeamEditCat.includes(team));
        //     const checkRocketChatTeam = entry.rocketchatteam?.includes(filterStateEdit.connectionteam);
        //     // Conditional check for RocketChatChannel only if valueRocketchatChannelCat is non-empty
        //     const checkRocketChatChannel = valueRocketchatChannelEditCat.length > 0
        //         ? entry.rocketchatchannel.some(channel => valueRocketchatChannelEditCat.includes(channel))
        //         : true;

        //     // Type-specific checks
        //     if (filterState.type === "Company") {
        //         return checkCompany && checkRocketChatTeam && checkRocketChatChannel;
        //     } else if (filterState.type === "Branch") {
        //         return checkCompany && checkBranch && checkRocketChatTeam && checkRocketChatChannel;
        //     } else if (filterState.type === "Unit") {
        //         return checkCompany && checkBranch && checkUnit && checkRocketChatTeam && checkRocketChatChannel;
        //     }
        //     else if (filterState.type === "Team") {
        //         return checkCompany && checkBranch && checkUnit && checkTeam && checkRocketChatTeam && checkRocketChatChannel;
        //     }
        //     else if (filterState.type === "Individual") {
        //         return checkCompany && checkBranch && checkUnit && checkTeam && checkRocketChatTeam && checkRocketChatChannel && checkEmployee;
        //     }
        //     else if (filterState.type === "Department") {
        //         return checkCompany && checkDepartment && checkBranch && checkUnit && checkRocketChatTeam && checkRocketChatChannel;
        //     } else if (filterState.type === "Designation") {
        //         return checkCompany && checkDesignation && checkBranch && checkUnit && checkRocketChatTeam && checkRocketChatChannel;
        //     }

        //     return false; // Default to no match if type doesn't match any condition
        // });


        const commonConditions = (entry) =>
            entry.company.some(company => valueCompanyEditCat.includes(company)) &&
            entry.workmode.some(wkmode => valueWorkModeEditCat.includes(wkmode)) &&
            entry.rocketchatteam?.includes(filterStateEdit.connectionteam) &&
            (valueRocketchatChannelEditCat.length > 0
                ? entry.rocketchatchannel?.length > 0 &&
                entry.rocketchatchannel.some(channel => valueRocketchatChannelEditCat.includes(channel))
                : entry.rocketchatchannel?.length === 0 // If valueRocketchatChannelCat is empty, ensure entry.rocketchatchannel is also empty
            );

        // Define specific conditions for each type
        const typeSpecificConditions = {
            Company: (entry) => true, // No additional checks for Company
            Branch: (entry) => entry.branch.some(branch => valueBranchEditCat.includes(branch)),
            Unit: (entry) =>
                entry.branch.some(branch => valueBranchEditCat.includes(branch)) &&
                entry.unit.some(unit => valueUnitEditCat.includes(unit)),
            Team: (entry) =>
                entry.branch.some(branch => valueBranchEditCat.includes(branch)) &&
                entry.unit.some(unit => valueUnitEditCat.includes(unit)) &&
                entry.team.some(team => valueTeamEditCat.includes(team)),
            Individual: (entry) =>
                entry.branch.some(branch => valueBranchEditCat.includes(branch)) &&
                entry.unit.some(unit => valueUnitEditCat.includes(unit)) &&
                entry.team.some(team => valueTeamEditCat.includes(team)) &&
                entry.employeename.some(empname => valueEmployeeEditCat.includes(empname)),
            "VPN Type": (entry) =>
                entry.branch.some(branch => valueBranchEditCat.includes(branch)) &&
                entry.unit.some(unit => valueUnitEditCat.includes(unit)) &&
                entry.team.some(team => valueTeamEditCat.includes(team)) &&
                entry.employeename.some(empname => valueEmployeeEditCat.includes(empname)),
            Department: (entry) =>
                entry.branch.some(branch => valueBranchEditCat.includes(branch)) &&
                entry.unit.some(unit => valueUnitEditCat.includes(unit)) &&
                entry.department.some(dept => valueDepartmentEditCat.includes(dept)),
            Designation: (entry) =>
                entry.branch.some(branch => valueBranchEditCat.includes(branch)) &&
                entry.unit.some(unit => valueUnitEditCat.includes(unit)) &&
                entry.designation.some(des => valueDesignationEditCat.includes(des)),
            Process: (entry) =>
                entry.branch.some(branch => valueBranchEditCat.includes(branch)) &&
                entry.unit.some(unit => valueUnitEditCat.includes(unit)) &&
                entry.team.some(team => valueTeamEditCat.includes(team)) &&
                entry.process.some(proc => valueProcessEditCat.includes(proc)),
            Shift: (entry) =>
                entry.branch.some(branch => valueBranchEditCat.includes(branch)) &&
                entry.unit.some(unit => valueUnitEditCat.includes(unit)) &&
                entry.team.some(team => valueTeamEditCat.includes(team)) &&
                entry.shiftgrouping.some(shiftgrp => valueShiftGroupingEditCat.includes(shiftgrp)) &&
                entry.shift.some(shift => valueShiftEditCat.includes(shift))
        };

        // Check for duplicates
        const isDuplicate = teamsArray?.filter(data => data?._id !== filterStateEdit?.id)?.some((entry) => {
            // Ensure the entry type matches filterState type
            if (entry?.type !== filterStateEdit.type) return false;

            // Apply common and type-specific conditions
            return (
                commonConditions(entry) &&
                typeSpecificConditions[filterStateEdit.type]?.(entry) // Call the appropriate function for type-specific checks
            );
        });
        if (
            isDuplicate
        ) {
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else
            if (
                filterStateEdit?.type === "Please Select Type" ||
                filterStateEdit?.type === ""
            ) {
                setPopupContentMalert("Please Select Type!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (selectedOptionsWorkModeEdit?.length === 0) {
                setPopupContentMalert("Please Select Work Mode!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (selectedOptionsCompanyEdit?.length === 0) {
                setPopupContentMalert("Please Select Company!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                ["Individual", "VPN Type", "Branch", "Unit", "Team", "Department", "Designation", "Process", "Shift"]?.includes(filterStateEdit?.type) &&
                selectedOptionsBranchEdit?.length === 0
            ) {
                setPopupContentMalert("Please Select Branch!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                ["Individual", "VPN Type", "Unit", "Team", "Departmet", "Designation", "Process", "Shift"]?.includes(filterStateEdit?.type) &&
                selectedOptionsUnitEdit?.length === 0
            ) {
                setPopupContentMalert("Please Select Unit!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                ["Individual", "VPN Type", "Team", "Process", "Shift"]?.includes(filterStateEdit?.type) &&
                selectedOptionsTeamEdit?.length === 0
            ) {
                setPopupContentMalert("Please Select Team!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                ["Individual", "VPN Type"]?.includes(filterStateEdit?.type) &&
                selectedOptionsEmployeeEdit?.length === 0
            ) {
                setPopupContentMalert("Please Select Employee!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                filterStateEdit?.type === "Process" &&
                selectedOptionsProcessEdit?.length === 0
            ) {
                setPopupContentMalert("Please Select Process!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                filterStateEdit?.type === "Shift" &&
                selectedOptionsShiftGroupingEdit?.length === 0
            ) {
                setPopupContentMalert("Please Select Shift Grouping!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                filterStateEdit?.type === "Shift" &&
                selectedOptionsShiftEdit?.length === 0
            ) {
                setPopupContentMalert("Please Select Shift!");
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
            else if (filterStateEdit.connectionteam === "" || !filterStateEdit.connectionteam) {
                setPopupContentMalert("Please Select Connections Team!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
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
    const addIndividualFunc = (e) => {
        setUpdateLoader(true);
        e.preventDefault();

        if (selectedOptionsWorkModeEdit?.length === 0) {
            setPopupContentMalert("Please Select Work Mode!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsCompanyEdit?.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            selectedOptionsBranchEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            selectedOptionsUnitEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            selectedOptionsTeamEdit?.length === 0
        ) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            selectedOptionsAddIndividual?.length === 0
        ) {
            setPopupContentMalert("Please Select Employee!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendAddindividual();
        }
    };
    const sendAddindividual = async () => {
        setIsLoading(true);
        setPageName(!pageName);
        try {
            let res = await axios.put(
                `${SERVICE.ADD_ROCKETCHAT_GROUPING_INDIVIDUAL}/${addIndividual?.id}`,
                {
                    type: addIndividual?.type,
                    workmode: valueWorkModeEditCat,
                    company: valueCompanyEditCat,
                    branch: valueBranchEditCat,
                    unit: valueUnitEditCat,
                    team: valueTeamEditCat,
                    employeename: valueAddIndividualCat,

                    rocketchatteam: addIndividual.rocketchatteam,
                    rocketchatteamid: addIndividual.rocketchatteamid,
                    rocketchatchannel: addIndividual.rocketchatchannel,
                    rocketchatchannelid: addIndividual.rocketchatchannelid,
                    updatedby: [
                        ...addIndividual?.updatedby,
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
            handleCloseModAdd();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setUpdateLoader(false);
            setIsLoading(false);
        } catch (err) {
            setUpdateLoader(false);
            setIsLoading(false);
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
    const [vpnTypeDatas, setVpnTypeDatas] = useState([]);
    const fetchMikroTikSecrets = async () => {
        setPageName(!pageName);
        try {
            let response = await axios.post(SERVICE.GET_MIKROTIK_SECRETS_LOCAL, {
                accessbranch: accessbranch,
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setVpnTypeDatas(response?.data?.secrets);

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
                    saveAs(blob, "Connections Team&Channel Grouping.png");
                });
            });
        }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Connections Team&Channel Grouping",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = () => {
        const itemsWithSerialNumber = teamsArray?.map((data, index) => ({
            ...data,
            serialNumber: index + 1,
            workmode: data?.workmode?.join(","),
            company: data?.company?.join(","),
            branch: data?.branch?.join(","),
            unit: data?.unit?.join(","),
            team: data?.team?.join(","),
            department: data?.department?.join(","),
            designation: data?.designation?.join(","),
            employeename: data?.employeename?.join(","),
            rocketchatteam: data?.rocketchatteam?.join(","),
            rocketchatchannel: data?.rocketchatchannel?.join(","),
            process: data?.process?.join(","),
            shiftgrouping: data?.shiftgrouping?.join(","),
            shift: data?.shift?.join(","),
            addedby: data.addedby || [],
            updatedby: data.updatedby || [],
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
        // {
        //     field: "checkbox",
        //     headerName: "Checkbox", // Default header name
        //     headerStyle: {
        //         fontWeight: "bold", // Apply the font-weight style to make the header text bold
        //         // Add any other CSS styles as needed
        //     },
        //     renderHeader: (params) => (
        //         <CheckboxHeader
        //             selectAllChecked={selectAllChecked}
        //             onSelectAll={() => {
        //                 if (rowDataTable.length === 0) {
        //                     // Do not allow checking when there are no rows
        //                     return;
        //                 }
        //                 if (selectAllChecked) {
        //                     setSelectedRows([]);
        //                 } else {
        //                     const allRowIds = rowDataTable.map((row) => row.id);
        //                     setSelectedRows(allRowIds);
        //                 }
        //                 setSelectAllChecked(!selectAllChecked);
        //             }}
        //         />
        //     ),

        //     renderCell: (params) => (
        //         <Checkbox
        //             checked={selectedRows.includes(params.row.id)}
        //             onChange={() => {
        //                 let updatedSelectedRows;
        //                 if (selectedRows.includes(params.row.id)) {
        //                     updatedSelectedRows = selectedRows.filter(
        //                         (selectedId) => selectedId !== params.row.id
        //                     );
        //                 } else {
        //                     updatedSelectedRows = [...selectedRows, params.row.id];
        //                 }
        //                 setSelectedRows(updatedSelectedRows);
        //                 // Update the "Select All" checkbox based on whether all rows are selected
        //                 setSelectAllChecked(
        //                     updatedSelectedRows.length === filteredData.length
        //                 );
        //             }}
        //         />
        //     ),
        //     sortable: false, // Optionally, you can make this column not sortable
        //     width: 90,
        //     hide: !columnVisibility.checkbox,
        //     headerClassName: "bold-header",
        // },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "type",
            headerName: "Type",
            flex: 0,
            width: 120,
            hide: !columnVisibility.type,
            headerClassName: "bold-header",
        },
        {
            field: "workmode",
            headerName: "Work Mode",
            flex: 0,
            width: 120,
            hide: !columnVisibility.workmode,
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
            field: "process",
            headerName: "Process",
            flex: 0,
            width: 150,
            hide: !columnVisibility.process,
            headerClassName: "bold-header",
        },
        {
            field: "shiftgrouping",
            headerName: "Shift Grouping",
            flex: 0,
            width: 150,
            hide: !columnVisibility.shiftgrouping,
            headerClassName: "bold-header",
        },
        {
            field: "shift",
            headerName: "Shift",
            flex: 0,
            width: 150,
            hide: !columnVisibility.shift,
            headerClassName: "bold-header",
        },
        {
            field: "employeename",
            headerName: "Employee",
            flex: 0,
            width: 250,
            hide: !columnVisibility.employeename,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between", // Ensures proper spacing between name and buttons
                        width: "100%", // Ensures the container takes up the full cell width
                    }}
                >
                    {/* Display Employee Name */}
                    <Typography
                        variant="body2"
                        sx={{
                            flexGrow: 1, // Allows the name to take remaining space
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            marginRight: 1,
                        }}
                        title={params.row.employeename} // Show full name on hover
                    >
                        {params.row.employeename || ""}
                    </Typography>

                    {/* Conditionally Render Buttons */}
                    {["Individual", "VPN Type"]?.includes(params.row.type) && (
                        <>
                            {/* Add Button with Tooltip */}
                            <Tooltip title="Add Employee" arrow>
                                <Button
                                    sx={userStyle.buttonadd}
                                    onClick={() => {
                                        getCodeAdd(params.row.id);
                                        console.log("Add button clicked for:", params.row.id);
                                    }}
                                >
                                    <AddOutlinedIcon sx={buttonStyles.buttonadd} />
                                </Button>
                            </Tooltip>

                            {/* Remove Button with Tooltip */}
                            <Tooltip title="Remove Employee" arrow>
                                <Button
                                    sx={userStyle.buttonremove}
                                    onClick={() => {
                                        getCodeRemove(params.row.id);
                                        console.log("Remove button clicked for:", params.row.id);
                                    }}
                                >
                                    <RemoveOutlinedIcon sx={buttonStyles.buttonremove} />
                                </Button>
                            </Tooltip>
                        </>
                    )}
                </Grid>
            ),
        },
        {
            field: "rocketchatteam",
            headerName: "Connections Teams",
            flex: 0,
            width: 150,
            hide: !columnVisibility.rocketchatteam,
            headerClassName: "bold-header",
        },
        {
            field: "rocketchatchannel",
            headerName: "Connections Channels",
            flex: 0,
            width: 150,
            hide: !columnVisibility.rocketchatchannel,
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
                    {isUserRoleCompare?.includes("eteam&channelgrouping") && (
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
                    )}

                    {isUserRoleCompare?.includes("dteam&channelgrouping") && (
                        <>
                            <Button
                                sx={userStyle.buttondelete}
                                onClick={(e) => {
                                    setDeleteTeamId({ id: params.row.id, type: params.row.type });
                                    handleClickOpen();
                                }}
                            >
                                <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                            </Button>
                        </>
                    )}
                    {isUserRoleCompare?.includes("vteam&channelgrouping") && (
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
                    {isUserRoleCompare?.includes("ilist") && (
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
                    )}
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData.map((data, index) => {
        return {
            id: data._id,
            serialNumber: data.serialNumber,
            process: data.process,
            shiftgrouping: data.shiftgrouping,
            shift: data.shift,
            type: data.type,
            workmode: data.workmode,
            company: data.company,
            branch: data.branch,
            unit: data.unit,
            team: data.team,
            department: data.department,
            designation: data.designation,
            employeename: data.employeename,
            rocketchatteam: data.rocketchatteam,
            rocketchatchannel: data.rocketchatchannel,
            addedby: data.addedby,
            updatedby: data.updatedby,
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
        type: "Company",
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
        { label: "VPN Type", value: "VPN Type" },
        { label: "Process", value: "Process" },
        { label: "Shift", value: "Shift" },
        { label: "Company", value: "Company" },
        { label: "Branch", value: "Branch" },
        { label: "Unit", value: "Unit" },
        { label: "Team", value: "Team" },
        { label: "Department", value: "Department" },
        { label: "Designation", value: "Designation" },
    ];
    const workModeOptions = [
        { label: "Office", value: "Office" },
        { label: "Remote", value: "Remote" },
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
                workmode: singleData?.workmode || [],
                connectionteam: singleData?.rocketchatteam?.join(","),
                connectionteamid: singleData?.rocketchatteamid?.join(",")
            });

            setValueWorkModeEditCat(singleData?.workmode || []);
            setSelectedOptionsWorkModeEdit(singleData?.workmode ? singleData?.workmode.map((t) => ({
                label: t,
                value: t,
            })) : []);
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
            setValueEmployeeEditCat(singleData?.employeename);
            setSelectedOptionsEmployeeEdit(singleData?.employeename.map((t) => ({
                label: t,
                value: t,
            })));

            setValueProcessEditCat(singleData?.process || []);
            setSelectedOptionsProcessEdit(singleData?.process ? singleData?.process.map((t) => ({
                label: t,
                value: t,
            })) : []);
            setValueShiftGroupingEditCat(singleData?.shiftgrouping || []);
            setSelectedOptionsShiftGroupingEdit(singleData?.shiftgrouping ? singleData?.shiftgrouping.map((t) => ({
                label: t,
                value: t,
            })) : []);
            setValueShiftEditCat(singleData?.shift || []);
            setSelectedOptionsShiftEdit(singleData?.shift ? singleData?.shift.map((t) => ({
                label: t,
                value: t,
            })) : []);

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

            setValueRocketchatChannelEditCat(singleData?.rocketchatchannel);
            setValueRocketchatChannelIdEditCat(singleData?.rocketchatchannelid)
            setSelectedOptionsRocketchatChannelEdit(
                singleData?.rocketchatchannel.map((channelName) => {
                    const matchedChannel = channelsOptions.find((channel) => channel.name === channelName);
                    return {
                        label: channelName,
                        value: channelName,
                        id: matchedChannel?._id || null, // Use the matched ID or null if not found
                    };
                })
            );

            handleClickOpenEdit();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    const [isAddOpen, setIsAddOpen] = useState(false);
    //Edit model...
    const handleClickOpenAdd = () => {
        setIsAddOpen(true);
    };
    const handleCloseModAdd = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsAddOpen(false);
    };
    const [addIndividual, setAddNewIndividual] = useState({
    });
    const [selectedOptionsAddIndividual, setSelectedOptionsAddIndividual] = useState([]);
    let [valueAddIndividualCat, setValueAddIndividualCat] = useState([]);

    const handleAddIndividualChange = (options) => {
        setValueAddIndividualCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsAddIndividual(options);
    };
    const customValueRendererAddIndividual = (valueEmployeeAddIndividual, _categoryname) => {
        return valueEmployeeAddIndividual?.length
            ? valueEmployeeAddIndividual.map(({ label }) => label)?.join(", ")
            : "Please Select Employee";
    };
    const [addIndividualOptions, setAddIndividualOptions] = useState([]);
    const [existingEmployee, setExistingEmployee] = useState([]);
    const getCodeAdd = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SINGLE_ROCKETCHAT_TEAMCHANNELGROUPING}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let singleData = res?.data?.steamchannelgrouping;


            setAddNewIndividual({
                type: singleData?.type,
                id: e,
                company: singleData?.company || [],
                branch: singleData?.branch || [],
                unit: singleData?.unit || [],
                team: singleData?.team || [],
                employeename: singleData?.employeename || [],
                rocketchatchannel: singleData?.rocketchatchannel || [],
                rocketchatteam: singleData?.rocketchatteam || [],
                rocketchatchannelid: singleData?.rocketchatchannelid || [],
                rocketchatteamid: singleData?.rocketchatteamid || [],

                updatedby: singleData?.updatedby || [],
            });

            setValueWorkModeEditCat(singleData?.workmode || []);
            setSelectedOptionsWorkModeEdit(singleData?.workmode ? singleData?.workmode.map((t) => ({
                label: t,
                value: t,
            })) : []);
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

            let allEmp = allUsersData
                ?.filter(
                    (u) =>
                        singleData?.company?.includes(u.company) &&
                        singleData?.branch?.includes(u.branch) &&
                        singleData?.unit?.includes(u.unit) &&
                        singleData?.team?.includes(u.team)
                ).map((u) => (u.companyname));
            setExistingEmployee(singleData?.employeename)
            let remainingEmp = allEmp?.filter(data => !singleData?.employeename?.includes(data)).map((u) => ({
                label: u,
                value: u,
            }))
            setAddIndividualOptions(remainingEmp);

            setValueAddIndividualCat([]);
            setSelectedOptionsAddIndividual([]);
            handleClickOpenAdd();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const [openRemove, setOpenRemove] = useState(false); // Example employee array
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [removeIndividual, setRemoveIndividual] = useState({});
    // Open/Close Modal Handlers
    const handleOpenRemove = () => setOpenRemove(true);
    const handleCloseRemove = () => {
        setSelectedEmployees([]); // Reset selected employees on close
        setOpenRemove(false);
        setSearchTerm("");
        setRemoveIndividual({});
    };

    // Handle Checkbox Toggle
    const handleCheckboxChange = (name) => {
        setSelectedEmployees((prev) =>
            prev.includes(name)
                ? prev.filter((n) => n !== name)
                : [...prev, name]
        );
    };
    const [searchTerm, setSearchTerm] = useState("");

    // Filter employees based on the search term
    const filteredEmployees = removeIndividual?.employeename?.filter((name) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Handle Update Button
    const handleUpdateRemove = () => {

        const updatedEmployees = removeIndividual?.employeename?.filter((name) => !selectedEmployees.includes(name));
        // Update employee list
        if (selectedEmployees?.length === 0) {
            setPopupContentMalert("Please Select Any Employee To Remove!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (removeIndividual?.employeename?.length === selectedEmployees?.length) {
            setPopupContentMalert("Cannot Remove all the Employee from Grouping!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRemoveindividual();
        }

    };

    const sendRemoveindividual = async () => {
        setUpdateLoader(true);
        setIsLoading(true);
        setPageName(!pageName);
        try {
            let res = await axios.put(
                `${SERVICE.REMOVE_ROCKETCHAT_GROUPING_INDIVIDUAL}/${removeIndividual?.id}`,
                {
                    employeename: selectedEmployees,
                    updatedby: [
                        ...removeIndividual?.updatedby,
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
            handleCloseRemove();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setUpdateLoader(false);
            setIsLoading(false);
        } catch (err) {
            setUpdateLoader(false);
            setIsLoading(false);
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
    const getCodeRemove = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.SINGLE_ROCKETCHAT_TEAMCHANNELGROUPING}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let singleData = res?.data?.steamchannelgrouping;


            setRemoveIndividual({
                type: singleData?.type,
                id: e,
                company: singleData?.company || [],
                branch: singleData?.branch || [],
                unit: singleData?.unit || [],
                team: singleData?.team || [],
                employeename: singleData?.employeename || [],
                rocketchatchannel: singleData?.rocketchatchannel || [],
                rocketchatteam: singleData?.rocketchatteam || [],
                rocketchatchannelid: singleData?.rocketchatchannelid || [],
                rocketchatteamid: singleData?.rocketchatteamid || [],

                updatedby: singleData?.updatedby || [],
            });

            handleOpenRemove();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };


    const [ShiftGroupingOptions, setShiftGroupingOptions] = useState([]);
    const ShiftGroupingDropdwons = async () => {
        try {
            let res = await axios.get(SERVICE.GETALLSHIFTGROUPS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setShiftGroupingOptions(
                res?.data?.shiftgroupings.map((data) => ({
                    ...data,
                    label: data.shiftday + "_" + data.shifthours,
                    value: data.shiftday + "_" + data.shifthours,
                }))
            );
        } catch (err) {
            console.log(err)
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const [shiftOptions, setShiftOptions] = useState([]);
    const ShiftDropdwons = async (eArray) => {
        try {
            let shiftFlat = [];

            // Fetch all shift groups once
            let res = await axios.get(SERVICE.GETALLSHIFTGROUPS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const shiftGroups = res?.data?.shiftgroupings || [];

            // Process each value in the array
            eArray.forEach((e) => {
                let answerFirst = e?.split("_")[0];
                let answerSecond = e?.split("_")[1];

                // Filter shift groups matching the current array value
                const shiftGroup = shiftGroups.filter(
                    (data) =>
                        data.shiftday === answerFirst && data.shifthours === answerSecond
                );

                // Aggregate shifts
                if (shiftGroup?.length > 0) {
                    shiftFlat = shiftFlat.concat(shiftGroup.flatMap((data) => data.shift));
                }
            });

            // Remove duplicates and set shift options
            const uniqueShifts = Array.from(new Set(shiftFlat));
            setShiftOptions(
                uniqueShifts.map((data) => ({
                    label: data,
                    value: data,
                }))
            );
        } catch (err) {
            console.log(err);
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };


    const [processValues, setProcessValues] = useState([]);
    const [processOptions, setProcessOptions] = useState([]);




    const fetchProcess = async () => {
        setPageName(!pageName);
        try {
            let res_freq = await axios.get(SERVICE.ALL_PROCESS_AND_TEAM, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setProcessValues(res_freq?.data?.processteam);
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };


    //MULTISELECT ONCHANGE START

    //shift grouping multiselect
    const [selectedOptionsShiftGrouping, setSelectedOptionsShiftGrouping] = useState([]);
    let [valueShiftGroupingCat, setValueShiftGroupingCat] = useState([]);

    const handleShiftGroupingChange = (options) => {
        let arrayvalus =
            options.map((a, index) => {
                return a.value;
            })

        setValueShiftGroupingCat(arrayvalus);
        setSelectedOptionsShiftGrouping(options);


        setValueShiftCat([]);
        setSelectedOptionsShift([]);

        ShiftDropdwons(arrayvalus)
    };

    const customValueRendererShiftGrouping = (valueShiftGroupingCat, _categoryname) => {
        return valueShiftGroupingCat?.length
            ? valueShiftGroupingCat.map(({ label }) => label)?.join(", ")
            : "Please Select Shift Grouping";
    };

    //Shift Grouping edit

    const [selectedOptionsShiftGroupingEdit, setSelectedOptionsShiftGroupingEdit] = useState([]);
    let [valueShiftGroupingEditCat, setValueShiftGroupingEditCat] = useState([]);

    const handleShiftGroupingEditChange = (options) => {
        setValueShiftGroupingEditCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsShiftGroupingEdit(options);
    };

    const customValueRendererShiftGroupingEdit = (valueShiftGroupingEditCat, _categoryname) => {
        return valueShiftGroupingEditCat?.length
            ? valueShiftGroupingEditCat.map(({ label }) => label)?.join(", ")
            : "Please Select Shift Grouping";
    };


    //Shift multiselect
    const [selectedOptionsShift, setSelectedOptionsShift] = useState([]);
    let [valueShiftCat, setValueShiftCat] = useState([]);

    const handleShiftChange = (options) => {
        setValueShiftCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsShift(options);
    };

    const customValueRendererShift = (valueShiftCat, _categoryname) => {
        return valueShiftCat?.length
            ? valueShiftCat.map(({ label }) => label)?.join(", ")
            : "Please Select Shift";
    };

    //Shift edit

    const [selectedOptionsShiftEdit, setSelectedOptionsShiftEdit] = useState([]);
    let [valueShiftEditCat, setValueShiftEditCat] = useState([]);

    const handleShiftEditChange = (options) => {
        setValueShiftEditCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsShiftEdit(options);
    };

    const customValueRendererShiftEdit = (valueShiftEditCat, _categoryname) => {
        return valueShiftEditCat?.length
            ? valueShiftEditCat.map(({ label }) => label)?.join(", ")
            : "Please Select Shift";
    };

    //process multiselect
    const [selectedOptionsProcess, setSelectedOptionsProcess] = useState([]);
    let [valueProcessCat, setValueProcessCat] = useState([]);

    const handleProcessChange = (options) => {
        setValueProcessCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsProcess(options);
    };

    const customValueRendererProcess = (valueProcessCat, _categoryname) => {
        return valueProcessCat?.length
            ? valueProcessCat.map(({ label }) => label)?.join(", ")
            : "Please Select Process";
    };

    //process edit

    const [selectedOptionsProcessEdit, setSelectedOptionsProcessEdit] = useState([]);
    let [valueProcessEditCat, setValueProcessEditCat] = useState([]);

    const handleProcessEditChange = (options) => {
        setValueProcessEditCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsProcessEdit(options);
    };

    const customValueRendererProcessEdit = (valueProcessEditCat, _categoryname) => {
        return valueProcessEditCat?.length
            ? valueProcessEditCat.map(({ label }) => label)?.join(", ")
            : "Please Select Process";
    };

    //workmode multiselect
    const [selectedOptionsWorkMode, setSelectedOptionsWorkMode] = useState([]);
    let [valueWorkModeCat, setValueWorkModeCat] = useState([]);

    const handleWorkModeChange = (options) => {
        setValueWorkModeCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsWorkMode(options);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererWorkMode = (valueWorkModeCat, _categoryname) => {
        return valueWorkModeCat?.length
            ? valueWorkModeCat.map(({ label }) => label)?.join(", ")
            : "Please Select Work Mode";
    };

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

        setValueProcessCat([]);
        setSelectedOptionsProcess([]);

        // setValueShiftGroupingCat([]);
        // setSelectedOptionsShiftGrouping([]);

        // setValueShiftCat([]);
        // setSelectedOptionsShift([]);
    };

    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };
    //work mode multiselect edit
    const [selectedOptionsWorkModeEdit, setSelectedOptionsWorkModeEdit] = useState([]);
    let [valueWorkModeEditCat, setValueWorkModeEditCat] = useState([]);

    const handleWorkModeEditChange = (options) => {
        setValueWorkModeEditCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsWorkModeEdit(options);
        setValueAddIndividualCat([]);
        setSelectedOptionsAddIndividual([]);
    };

    const customValueRendererWorkModeEdit = (valueWorkModeEditCat, _categoryname) => {
        return valueWorkModeEditCat?.length
            ? valueWorkModeEditCat.map(({ label }) => label)?.join(", ")
            : "Please Select Work Mode";
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
        setValueProcessEditCat([]);
        setSelectedOptionsProcessEdit([]);

        // setValueShiftGroupingEditCat([]);
        // setSelectedOptionsShiftGroupingEdit([]);

        // setValueShiftEditCat([]);
        // setSelectedOptionsShiftEdit([]);
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

        setValueProcessCat([]);
        setSelectedOptionsProcess([]);
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
        setValueProcessEditCat([]);
        setSelectedOptionsProcessEdit([]);
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

        setValueProcessCat([]);
        setSelectedOptionsProcess([]);
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
        setValueProcessEditCat([]);
        setSelectedOptionsProcessEdit([]);
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
        let teamArray =
            options.map((a, index) => {
                return a.value;
            })

        setValueTeamCat(teamArray);
        setSelectedOptionsTeam(options);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);

        setValueProcessCat([]);
        setSelectedOptionsProcess([]);
        if (filterState.type === "Process") {
            filterProcess(teamArray)
        }
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
        setValueProcessEditCat([]);
        setSelectedOptionsProcessEdit([]);
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
        setValueDesignationCat([]);
        setSelectedOptionsDesignation([]);
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

        setValueProcessCat([]);
        setSelectedOptionsProcess([]);

        setValueShiftGroupingCat([]);
        setSelectedOptionsShiftGrouping([]);

        setValueShiftCat([]);
        setSelectedOptionsShift([]);

        setFilterState({
            type: "Company",
            employeestatus: "Please Select Employee Status",
        });

        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const [filterLoader, setFilterLoader] = useState(false);
    const [updateLoader, setUpdateLoader] = useState(false);
    const [tableLoader, setTableLoader] = useState(false);
    const handleSubmit = () => {
        // const isDuplicate = teamsArray.some((entry) => {

        //     // Type-specific checks
        //     if (filterState.type === "Company") {
        //         const checkData = entry?.type=== "Company" && 
        //         entry.company.some(company => valueCompanyCat.includes(company))&&
        //          entry.workmode.some(wkmode => valueWorkModeCat.includes(wkmode)) && 
        //          entry.rocketchatteam?.includes(filterState.connectionteam) && 
        //          entry.rocketchatchannel.some(channel => valueRocketchatChannelCat.includes(channel)) ;
        //         return checkData;
        //     } else if (filterState.type === "Branch") {
        //         const checkData = entry?.type=== "Branch" && 
        //         entry.company.some(company => valueCompanyCat.includes(company))&&
        //         entry.branch.some(branch => valueBranchCat.includes(branch)) &&
        //          entry.workmode.some(wkmode => valueWorkModeCat.includes(wkmode)) && 
        //          entry.rocketchatteam?.includes(filterState.connectionteam) && 
        //          entry.rocketchatchannel.some(channel => valueRocketchatChannelCat.includes(channel)) ;
        //         return checkData;
        //     } else if (filterState.type === "Unit") {
        //         const checkData = entry?.type=== "Unit" && 
        //         entry.company.some(company => valueCompanyCat.includes(company))&&
        //         entry.branch.some(branch => valueBranchCat.includes(branch)) &&
        //         entry.unit.some(unit => valueUnitCat.includes(unit)) &&
        //          entry.workmode.some(wkmode => valueWorkModeCat.includes(wkmode)) && 
        //          entry.rocketchatteam?.includes(filterState.connectionteam) && 
        //          entry.rocketchatchannel.some(channel => valueRocketchatChannelCat.includes(channel)) ;
        //         return checkData;
        //     } else if (filterState.type === "Team") {
        //         const checkData = entry?.type=== "Team" && 
        //         entry.company.some(company => valueCompanyCat.includes(company))&&
        //         entry.branch.some(branch => valueBranchCat.includes(branch)) &&
        //         entry.unit.some(unit => valueUnitCat.includes(unit)) &&
        //         entry.team.some(team => valueTeamCat.includes(team)) &&
        //          entry.workmode.some(wkmode => valueWorkModeCat.includes(wkmode)) && 
        //          entry.rocketchatteam?.includes(filterState.connectionteam) && 
        //          entry.rocketchatchannel.some(channel => valueRocketchatChannelCat.includes(channel)) ;
        //         return checkData;
        //     }
        //     else if (filterState.type === "Individual") {
        //         const checkData = entry?.type=== "Individual" && 
        //         entry.company.some(company => valueCompanyCat.includes(company))&&
        //         entry.branch.some(branch => valueBranchCat.includes(branch)) &&
        //         entry.unit.some(unit => valueUnitCat.includes(unit)) &&
        //         entry.team.some(team => valueTeamCat.includes(team)) &&
        //         entry.employeename.some(empname => valueEmployeeCat.includes(empname)) &&
        //          entry.workmode.some(wkmode => valueWorkModeCat.includes(wkmode)) && 
        //          entry.rocketchatteam?.includes(filterState.connectionteam) && 
        //          entry.rocketchatchannel.some(channel => valueRocketchatChannelCat.includes(channel)) ;
        //         return checkData;
        //     }
        //     else if (filterState.type === "VPN Type") {
        //         const checkData = entry?.type=== "VPN Type" && 
        //         entry.company.some(company => valueCompanyCat.includes(company))&&
        //         entry.branch.some(branch => valueBranchCat.includes(branch)) &&
        //         entry.unit.some(unit => valueUnitCat.includes(unit)) &&
        //         entry.team.some(team => valueTeamCat.includes(team)) &&
        //         entry.employeename.some(empname => valueEmployeeCat.includes(empname)) &&
        //          entry.workmode.some(wkmode => valueWorkModeCat.includes(wkmode)) && 
        //          entry.rocketchatteam?.includes(filterState.connectionteam) && 
        //          entry.rocketchatchannel.some(channel => valueRocketchatChannelCat.includes(channel)) ;
        //         return checkData;
        //     }
        //     else if (filterState.type === "Department") {
        //         const checkData = entry?.type=== "Department" && 
        //         entry.company.some(company => valueCompanyCat.includes(company))&&
        //         entry.branch.some(branch => valueBranchCat.includes(branch)) &&
        //         entry.unit.some(unit => valueUnitCat.includes(unit)) &&
        //         entry.department.some(dept => valueDepartmentCat.includes(dept)) &&
        //          entry.workmode.some(wkmode => valueWorkModeCat.includes(wkmode)) && 
        //          entry.rocketchatteam?.includes(filterState.connectionteam) && 
        //          entry.rocketchatchannel.some(channel => valueRocketchatChannelCat.includes(channel)) ;
        //         return checkData;
        //     }
        //     else if (filterState.type === "Designation") {
        //         const checkData = entry?.type=== "Designation" && 
        //         entry.company.some(company => valueCompanyCat.includes(company))&&
        //         entry.branch.some(branch => valueBranchCat.includes(branch)) &&
        //         entry.unit.some(unit => valueUnitCat.includes(unit)) &&
        //         entry.designation.some(des => valueDesignationCat.includes(des)) &&
        //          entry.workmode.some(wkmode => valueWorkModeCat.includes(wkmode)) && 
        //          entry.rocketchatteam?.includes(filterState.connectionteam) && 
        //          entry.rocketchatchannel.some(channel => valueRocketchatChannelCat.includes(channel)) ;
        //         return checkData;
        //     }
        //     else if (filterState.type === "Process") {
        //         const checkData = entry?.type=== "Process" && 
        //         entry.company.some(company => valueCompanyCat.includes(company))&&
        //         entry.branch.some(branch => valueBranchCat.includes(branch)) &&
        //         entry.unit.some(unit => valueUnitCat.includes(unit)) &&
        //         entry.process.some(proc => valueProcessCat.includes(proc)) &&
        //          entry.workmode.some(wkmode => valueWorkModeCat.includes(wkmode)) && 
        //          entry.rocketchatteam?.includes(filterState.connectionteam) && 
        //          entry.rocketchatchannel.some(channel => valueRocketchatChannelCat.includes(channel)) ;
        //         return checkData;
        //     }

        //     return false; // Default to no match if type doesn't match any condition
        // });

        // Define common conditions for all types
        const commonConditions = (entry) =>
            entry.company.some(company => valueCompanyCat.includes(company)) &&
            entry.workmode.some(wkmode => valueWorkModeCat.includes(wkmode)) &&
            entry.rocketchatteam?.includes(filterState.connectionteam) &&
            (valueRocketchatChannelCat.length > 0
                ? entry.rocketchatchannel?.length > 0 &&
                entry.rocketchatchannel.some(channel => valueRocketchatChannelCat.includes(channel))
                : entry.rocketchatchannel?.length === 0 // If valueRocketchatChannelCat is empty, ensure entry.rocketchatchannel is also empty
            );
        // Define specific conditions for each type
        const typeSpecificConditions = {
            Company: (entry) => true, // No additional checks for Company
            Branch: (entry) => entry.branch.some(branch => valueBranchCat.includes(branch)),
            Unit: (entry) =>
                entry.branch.some(branch => valueBranchCat.includes(branch)) &&
                entry.unit.some(unit => valueUnitCat.includes(unit)),
            Team: (entry) =>
                entry.branch.some(branch => valueBranchCat.includes(branch)) &&
                entry.unit.some(unit => valueUnitCat.includes(unit)) &&
                entry.team.some(team => valueTeamCat.includes(team)),
            Individual: (entry) =>
                entry.branch.some(branch => valueBranchCat.includes(branch)) &&
                entry.unit.some(unit => valueUnitCat.includes(unit)) &&
                entry.team.some(team => valueTeamCat.includes(team)) &&
                entry.employeename.some(empname => valueEmployeeCat.includes(empname)),
            "VPN Type": (entry) =>
                entry.branch.some(branch => valueBranchCat.includes(branch)) &&
                entry.unit.some(unit => valueUnitCat.includes(unit)) &&
                entry.team.some(team => valueTeamCat.includes(team)) &&
                entry.employeename.some(empname => valueEmployeeCat.includes(empname)),
            Department: (entry) =>
                entry.branch.some(branch => valueBranchCat.includes(branch)) &&
                entry.unit.some(unit => valueUnitCat.includes(unit)) &&
                entry.department.some(dept => valueDepartmentCat.includes(dept)),
            Designation: (entry) =>
                entry.branch.some(branch => valueBranchCat.includes(branch)) &&
                entry.unit.some(unit => valueUnitCat.includes(unit)) &&
                entry.designation.some(des => valueDesignationCat.includes(des)),
            Process: (entry) =>
                entry.branch.some(branch => valueBranchCat.includes(branch)) &&
                entry.unit.some(unit => valueUnitCat.includes(unit)) &&
                entry.team.some(team => valueTeamCat.includes(team)) &&
                entry.process.some(proc => valueProcessCat.includes(proc)),
            Shift: (entry) =>
                entry.branch.some(branch => valueBranchCat.includes(branch)) &&
                entry.unit.some(unit => valueUnitCat.includes(unit)) &&
                entry.team.some(team => valueTeamCat.includes(team)) &&
                entry.shiftgrouping.some(shiftgrp => valueShiftGroupingCat.includes(shiftgrp)) &&
                entry.shift.some(shift => valueShiftCat.includes(shift)),
        };

        // Check for duplicates
        const isDuplicate = teamsArray.some((entry) => {
            // Ensure the entry type matches filterState type
            if (entry?.type !== filterState.type) return false;

            // Apply common and type-specific conditions
            return (
                commonConditions(entry) &&
                typeSpecificConditions[filterState.type]?.(entry) // Call the appropriate function for type-specific checks
            );
        });

        if (
            isDuplicate
        ) {
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else
            if (
                filterState?.type === "Please Select Type" ||
                filterState?.type === ""
            ) {
                setPopupContentMalert("Please Select Type!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (selectedOptionsWorkMode?.length === 0) {
                setPopupContentMalert("Please Select Work Mode!");
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
                ["Individual", "VPN Type", "Branch", "Unit", "Team", "Department", "Designation", "Process", "Shift"]?.includes(filterState?.type) &&
                selectedOptionsBranch?.length === 0
            ) {
                setPopupContentMalert("Please Select Branch!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                ["Individual", "VPN Type", "Unit", "Team", "Departmet", "Designation", "Process", "Shift"]?.includes(filterState?.type) &&
                selectedOptionsUnit?.length === 0
            ) {
                setPopupContentMalert("Please Select Unit!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                ["Individual", "VPN Type", "Team", "Process", "Shift"]?.includes(filterState?.type) &&
                selectedOptionsTeam?.length === 0
            ) {
                setPopupContentMalert("Please Select Team!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                ["Individual", "VPN Type"]?.includes(filterState?.type) &&
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
            else if (
                filterState?.type === "Process" &&
                selectedOptionsProcess?.length === 0
            ) {
                setPopupContentMalert("Please Select Process!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                filterState?.type === "Shift" &&
                selectedOptionsShiftGrouping?.length === 0
            ) {
                setPopupContentMalert("Please Select Shift Grouping!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                filterState?.type === "Shift" &&
                selectedOptionsShift?.length === 0
            ) {
                setPopupContentMalert("Please Select Shift!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (filterState.connectionteam === "" || !filterState.connectionteam) {
                setPopupContentMalert("Please Select Connections Team!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
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
                sendRequest();
            }
    };

    const sendRequest = async () => {
        setFilterLoader(true);
        setTableLoader(true);
        setPageName(!pageName);
        setIsLoading(true);
        try {
            let response = await axios.post(
                SERVICE.CREATE_ROCKETCHAT_TEAMCHANNELGROUPING,
                {
                    type: filterState?.type,
                    workmode: valueWorkModeCat,
                    company: valueCompanyCat,
                    branch: valueBranchCat,
                    unit: valueUnitCat,
                    team: valueTeamCat,
                    department: valueDepartmentCat,
                    designation: valueDesignationCat,
                    employeename: valueEmployeeCat,
                    process: valueProcessCat,
                    shiftgrouping: valueShiftGroupingCat,
                    shift: valueShiftCat,
                    // rocketchatteam: valueRocketchatTeamCat,
                    // rocketchatteamid: valueRocketchatTeamIdCat,
                    rocketchatteam: [filterState.connectionteam],
                    rocketchatteamid: [filterState.connectionteamid],
                    rocketchatchannel: valueRocketchatChannelCat,
                    rocketchatchannelid: valueRocketchatChannelIdCat,
                    addedby: [
                        {
                            name: String(isUserRoleAccess?.companyname),
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

            setFilterLoader(false);
            setTableLoader(false);
            await fetchRockeChatTeamChannelGrouping();
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsBtn(false);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setFilterLoader(true);
            setIsLoading(false);
            setTableLoader(true);
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    //auto select all dropdowns
    const [allAssignCompany, setAllAssignCompany] = useState([]);
    const [allAssignBranch, setAllAssignBranch] = useState([]);
    const [allAssignUnit, setAllAssignUnit] = useState([]);


    //FILTER END
    const filterProcess = (teamArray) => {
        let result = processValues.filter(
            (d) =>
                valueCompanyCat?.includes(d.company) &&
                valueBranchCat?.includes(d.branch) &&
                valueUnitCat?.includes(d.unit) &&
                teamArray?.includes(d.team)
        );

        const processall = result.map((d) => ({
            label: d.process,
            value: d.process,
        }));

        setProcessOptions(processall);
    }


    return (
        <Box>
            <Headtitle title={"CONNECTIONS TEAM AND CHANNEL GROUPING"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Connections Team and Channel Grouping"
                modulename="Connections"
                submodulename="Team & Channel Grouping"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            <>
                {isUserRoleCompare?.includes("ateam&channelgrouping") && (
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Add Connections Team and Channel Grouping
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

                                                setValueProcessCat([]);
                                                setSelectedOptionsProcess([]);


                                                setValueShiftGroupingCat([]);
                                                setSelectedOptionsShiftGrouping([]);

                                                setValueShiftCat([]);
                                                setSelectedOptionsShift([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Work Mode<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={workModeOptions}
                                            value={selectedOptionsWorkMode}
                                            onChange={(e) => {
                                                handleWorkModeChange(e);
                                            }}
                                            valueRenderer={customValueRendererWorkMode}
                                            labelledBy="Please Select Work Mode"
                                        />
                                        {/* <Selects
                                            options={workModeOptions}
                                            styles={colourStyles}
                                            value={{
                                                label:
                                                    !filterState.workmode ? "Please Select Workmode" : filterState.workmode,
                                                value:
                                                    !filterState.workmode ? "Please Select Workmode" : filterState.workmode,
                                            }}
                                            onChange={(e) => {
                                                setFilterState((prev) => ({
                                                    ...prev,
                                                    workmode: e.value,
                                                }));
                                                setValueEmployeeCat([]);
                                                setSelectedOptionsEmployee([]);
                                            }}
                                        /> */}
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

                                {["Individual", "VPN Type", "Team", "Process", "Shift"]?.includes(filterState.type) ? (
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
                                        {["Process"]?.includes(filterState.type) && (
                                            <Grid item md={3} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Process<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={processOptions}
                                                        value={selectedOptionsProcess}
                                                        onChange={(e) => {
                                                            handleProcessChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererProcess}
                                                        labelledBy="Please Select Process"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        )}
                                        {["Shift"]?.includes(filterState.type) && (
                                            <>
                                                <Grid item md={3} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Shift Grouping<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <MultiSelect
                                                            options={ShiftGroupingOptions}
                                                            value={selectedOptionsShiftGrouping}
                                                            onChange={(e) => {
                                                                handleShiftGroupingChange(e);
                                                            }}
                                                            valueRenderer={customValueRendererShiftGrouping}
                                                            labelledBy="Please Select Shift Grouping"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={3} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Shift<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <MultiSelect
                                                            options={shiftOptions}
                                                            value={selectedOptionsShift}
                                                            onChange={(e) => {
                                                                handleShiftChange(e);
                                                            }}
                                                            valueRenderer={customValueRendererShift}
                                                            labelledBy="Please Select Shift"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>
                                        )}
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
                                {["Individual", "VPN Type"]?.includes(filterState.type) && (
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={filterState.type === "Individual" ? allUsersData
                                                    ?.filter((u) => {
                                                        // Check if valueWorkModeCat contains only "Internship"
                                                        if (valueWorkModeCat?.length === 1 && valueWorkModeCat.includes("Remote")) {
                                                            return (
                                                                u.workmode === "Remote" &&
                                                                valueCompanyCat?.includes(u.company) &&
                                                                valueBranchCat?.includes(u.branch) &&
                                                                valueUnitCat?.includes(u.unit) &&
                                                                valueTeamCat?.includes(u.team)
                                                            );
                                                        }
                                                        // Check if valueWorkModeCat contains only "Employee"
                                                        if (valueWorkModeCat?.length === 1 && valueWorkModeCat.includes("Office")) {
                                                            return (
                                                                u.workmode !== "Remote" &&
                                                                valueCompanyCat?.includes(u.company) &&
                                                                valueBranchCat?.includes(u.branch) &&
                                                                valueUnitCat?.includes(u.unit) &&
                                                                valueTeamCat?.includes(u.team)
                                                            );
                                                        }
                                                        // If it contains both or is empty, apply no filtering on workmode
                                                        return (
                                                            valueCompanyCat?.includes(u.company) &&
                                                            valueBranchCat?.includes(u.branch) &&
                                                            valueUnitCat?.includes(u.unit) &&
                                                            valueTeamCat?.includes(u.team)
                                                        );
                                                    })
                                                    ?.map((u) => ({
                                                        label: u.companyname,
                                                        value: u.companyname,
                                                    }))
                                                    : vpnTypeDatas?.filter((item) => (
                                                        valueCompanyCat?.includes(item.company) &&
                                                        valueBranchCat?.includes(item.branch) &&
                                                        valueUnitCat?.includes(item.unit) &&
                                                        valueTeamCat?.some(data => item.team.includes(data))
                                                    ))?.map(user => ({
                                                        label: user?.employeename,
                                                        value: user?.employeename,
                                                    }))?.filter((item, index, self) => {
                                                        return (
                                                            self.findIndex(
                                                                (i) =>
                                                                    i.label === item.label &&
                                                                    i.value === item.value
                                                            ) === index
                                                        );
                                                    })
                                                }

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
                                            Connections Team<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        {/* <MultiSelect
                                            options={teamsOptions}
                                            value={selectedOptionsRocketchatTeam}
                                            onChange={(e) => {
                                                handleRocketchatTeamChange(e);
                                            }}
                                            valueRenderer={customValueRendererRocketchatTeam}
                                            labelledBy="Please Select Connections Teams"
                                        /> */}
                                        <Selects
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
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            Connections Channels
                                        </Typography>
                                        <MultiSelect
                                            options={channelsOptions?.filter(data => data?.teamId === filterState.connectionteamid)?.map(entry => ({
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
                                            Submit
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
            {isUserRoleCompare?.includes("lteam&channelgrouping") && (
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
                                    List Connections Team and Channel Grouping
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
                                        {isUserRoleCompare?.includes("excelteam&channelgrouping") && (
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
                                        {isUserRoleCompare?.includes("csvteam&channelgrouping") && (
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
                                        {isUserRoleCompare?.includes("printteam&channelgrouping") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfteam&channelgrouping") && (
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
                                        {isUserRoleCompare?.includes("imageteam&channelgrouping") && (
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
                            {/* &ensp;
                            {isUserRoleCompare?.includes("bdspeed") && (
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
                            View Connections Team and Channel Grouping
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Type</Typography>
                                    <Typography>{singleRow.type}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Work Mode</Typography>
                                    <Typography>{singleRow?.workmode}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{!["Individual", "VPN Type"]?.includes(singleRow.type) ? singleRow.company : [...new Set(allUsersData?.filter((data) => singleRow?.employeename?.split(",")?.includes(data?.companyname))?.map(item => item.company))]?.join(",")}</Typography>
                                </FormControl>
                            </Grid>


                            {["Individual", "VPN Type", "Branch", "Unit", "Team", "Department", "Designation", "Process", "Shift"]?.includes(singleRow.type) && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Branch</Typography>
                                        <Typography sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "pre-wrap",
                                        }}>{!["Individual", "VPN Type"]?.includes(singleRow.type) ? singleRow.branch : [...new Set(allUsersData?.filter((data) => singleRow?.employeename?.split(",")?.includes(data?.companyname))?.map(item => item.branch))]?.join(",")}</Typography>
                                    </FormControl>
                                </Grid>
                            )}
                            {["Individual", "VPN Type", "Unit", "Team", "Department", "Designation", "Process", "Shift"]?.includes(singleRow.type) && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Unit</Typography>
                                        <Typography sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "pre-wrap",
                                        }}>{!["Individual", "VPN Type"]?.includes(singleRow.type) ? singleRow.unit : [...new Set(allUsersData?.filter((data) => singleRow?.employeename?.split(",")?.includes(data?.companyname))?.map(item => item.unit))]?.join(",")}</Typography>
                                    </FormControl>
                                </Grid>
                            )}
                            {["Individual", "VPN Type", "Team", "Process", "Shift"]?.includes(singleRow.type) && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Team</Typography>
                                        <Typography sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "pre-wrap",
                                        }}>{!["Individual", "VPN Type"]?.includes(singleRow.type) ? singleRow.team : [...new Set(allUsersData?.filter((data) => singleRow?.employeename?.split(",")?.includes(data?.companyname))?.map(item => item.team))]?.join(",")}</Typography>
                                    </FormControl>
                                </Grid>)}
                            {["Process"]?.includes(singleRow.type) && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Process</Typography>
                                        <Typography sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "pre-wrap",
                                        }}>{singleRow?.process}</Typography>
                                    </FormControl>
                                </Grid>)}
                            {["Shift"]?.includes(singleRow.type) && (
                                <>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Shift Grouping</Typography>
                                            <Typography sx={{
                                                wordBreak: "break-word",
                                                overflowWrap: "break-word",
                                                whiteSpace: "pre-wrap",
                                            }}>{singleRow?.shiftgrouping}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Shift</Typography>
                                            <Typography sx={{
                                                wordBreak: "break-word",
                                                overflowWrap: "break-word",
                                                whiteSpace: "pre-wrap",
                                            }}>{singleRow?.shift}</Typography>
                                        </FormControl>
                                    </Grid>
                                </>
                            )}
                            {["Department"]?.includes(singleRow.type) && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Department</Typography>
                                        <Typography sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "pre-wrap",
                                        }}>{singleRow.department}</Typography>
                                    </FormControl>
                                </Grid>)}
                            {["Designation"]?.includes(singleRow.type) && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Designation</Typography>
                                        <Typography sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "pre-wrap",
                                        }}>{singleRow.designation}</Typography>
                                    </FormControl>
                                </Grid>)}
                            {["Individual", "VPN Type"]?.includes(singleRow.type) && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Employee</Typography>
                                        <Typography sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "pre-wrap",
                                        }}>{singleRow.employeename}</Typography>
                                    </FormControl>
                                </Grid>)}
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6" >Connections Team</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{singleRow.rocketchatteam}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Connections Channel</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{singleRow.rocketchatchannel}</Typography>
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
                        // overflow: "visible",
                        marginTop: "50px",
                        // "& .MuiPaper-root": {
                        //     overflow: "visible",
                        // },
                    }}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Edit Connections Team and Channel Grouping
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={6} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Type
                                        </Typography>
                                        {/* <Selects
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
                                        /> */}
                                        {/* <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={filterStateEdit.type}
                                            readOnly
                                        /> */}
                                        <Typography>
                                            {filterStateEdit.type}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={6} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Work Mode
                                        </Typography>
                                        <Typography>
                                            {filterStateEdit?.workmode?.join(",")}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={6} sm={6}>
                                    <Typography>
                                        Company
                                    </Typography>
                                    <FormControl size="small" fullWidth>
                                        {/* <MultiSelect
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
                                        /> */}

                                        {/* {selectedOptionsCompanyEdit.length !== 0
                                            ? selectedOptionsCompanyEdit.map((data, index) => (
                                                <Typography>
                                                    {index + 1}.{data.value}
                                                </Typography>
                                            ))
                                            : ""} */}
                                        <Typography sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "pre-wrap",
                                        }}>
                                            {!["Individual", "VPN Type"]?.includes(filterStateEdit.type) ? valueCompanyEditCat?.join(",") : [...new Set(allUsersData?.filter((data) => valueEmployeeEditCat?.includes(data?.companyname))?.map(item => item.company))]?.join(",")}</Typography>
                                    </FormControl>
                                </Grid>

                                {["Individual", "VPN Type", "Team", "Process", "Shift"]?.includes(filterStateEdit.type) ? (
                                    <>
                                        {/* Branch Unit Team */}
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch
                                                </Typography>
                                                {/* <MultiSelect
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
                                                /> */}
                                                {/* {selectedOptionsBranchEdit.length !== 0
                                                    ? selectedOptionsBranchEdit.map((data, index) => (
                                                        <Typography>
                                                            {index + 1}.{data.value}
                                                        </Typography>
                                                    ))
                                                    : ""} */}
                                                <Typography sx={{
                                                    wordBreak: "break-word",
                                                    overflowWrap: "break-word",
                                                    whiteSpace: "pre-wrap",
                                                }}>
                                                    {!["Individual", "VPN Type"]?.includes(filterStateEdit.type) ? valueBranchEditCat?.join(",") : [...new Set(allUsersData?.filter((data) => valueEmployeeEditCat?.includes(data?.companyname))?.map(item => item.branch))]?.join(",")}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit
                                                </Typography>
                                                {/* <MultiSelect
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
                                                /> */}
                                                {/* {selectedOptionsUnitEdit.length !== 0
                                                    ? selectedOptionsUnitEdit.map((data, index) => (
                                                        <Typography>
                                                            {index + 1}.{data.value}
                                                        </Typography>
                                                    ))
                                                    : ""} */}
                                                <Typography sx={{
                                                    wordBreak: "break-word",
                                                    overflowWrap: "break-word",
                                                    whiteSpace: "pre-wrap",
                                                }}> {!["Individual", "VPN Type"]?.includes(filterStateEdit.type) ? valueUnitEditCat?.join(",") : [...new Set(allUsersData?.filter((data) => valueEmployeeEditCat?.includes(data?.companyname))?.map(item => item.unit))]?.join(",")}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Team
                                                </Typography>
                                                {/* <MultiSelect
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
                                                /> */}
                                                {/* {selectedOptionsTeamEdit.length !== 0
                                                    ? selectedOptionsTeamEdit.map((data, index) => (
                                                        <Typography>
                                                            {index + 1}.{data.value}
                                                        </Typography>
                                                    ))
                                                    : ""} */}
                                                <Typography sx={{
                                                    wordBreak: "break-word",
                                                    overflowWrap: "break-word",
                                                    whiteSpace: "pre-wrap",
                                                }}>
                                                    {!["Individual", "VPN Type"]?.includes(filterStateEdit.type) ? valueTeamEditCat?.join(",") : [...new Set(allUsersData?.filter((data) => valueEmployeeEditCat?.includes(data?.companyname))?.map(item => item.team))]?.join(",")}</Typography>
                                            </FormControl>
                                        </Grid>
                                        {["Process"]?.includes(filterStateEdit.type) && <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Process
                                                </Typography>

                                                <Typography sx={{
                                                    wordBreak: "break-word",
                                                    overflowWrap: "break-word",
                                                    whiteSpace: "pre-wrap",
                                                }}>
                                                    {valueProcessEditCat?.join(",")}</Typography>
                                            </FormControl>
                                        </Grid>}
                                        {["Shift"]?.includes(filterStateEdit.type) && (
                                            <>
                                                <Grid item md={4} xs={6} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Shift Grouping
                                                        </Typography>

                                                        <Typography sx={{
                                                            wordBreak: "break-word",
                                                            overflowWrap: "break-word",
                                                            whiteSpace: "pre-wrap",
                                                        }}>
                                                            {valueShiftGroupingEditCat?.join(",")}</Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={4} xs={6} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Shift
                                                        </Typography>

                                                        <Typography sx={{
                                                            wordBreak: "break-word",
                                                            overflowWrap: "break-word",
                                                            whiteSpace: "pre-wrap",
                                                        }}>
                                                            {valueShiftEditCat?.join(",")}</Typography>
                                                    </FormControl>
                                                </Grid>
                                            </>)}

                                    </>
                                ) : ["Department"]?.includes(filterStateEdit.type) ? (
                                    <>
                                        {/* Department */}
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch
                                                </Typography>
                                                {/* <MultiSelect
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
                                                /> */}
                                                {/* {selectedOptionsBranchEdit.length !== 0
                                                    ? selectedOptionsBranchEdit.map((data, index) => (
                                                        <Typography>
                                                            {index + 1}.{data.value}
                                                        </Typography>
                                                    ))
                                                    : ""} */}
                                                <Typography sx={{
                                                    wordBreak: "break-word",
                                                    overflowWrap: "break-word",
                                                    whiteSpace: "pre-wrap",
                                                }}>{!["Individual", "VPN Type"]?.includes(filterStateEdit.type) ? valueBranchEditCat?.join(",") : [...new Set(allUsersData?.filter((data) => valueEmployeeEditCat?.includes(data?.companyname))?.map(item => item.branch))]?.join(",")}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit
                                                </Typography>
                                                {/* <MultiSelect
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
                                                /> */}
                                                {/* {selectedOptionsUnitEdit.length !== 0
                                                    ? selectedOptionsUnitEdit.map((data, index) => (
                                                        <Typography>
                                                            {index + 1}.{data.value}
                                                        </Typography>
                                                    ))
                                                    : ""} */}
                                                <Typography sx={{
                                                    wordBreak: "break-word",
                                                    overflowWrap: "break-word",
                                                    whiteSpace: "pre-wrap",
                                                }}>{!["Individual", "VPN Type"]?.includes(filterStateEdit.type) ? valueUnitEditCat?.join(",") : [...new Set(allUsersData?.filter((data) => valueEmployeeEditCat?.includes(data?.companyname))?.map(item => item.unit))]?.join(",")}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Department
                                                </Typography>
                                                {/* <MultiSelect
                                                    options={departmentOptions}
                                                    value={selectedOptionsDepartmentEdit}
                                                    onChange={(e) => {
                                                        handleDepartmentEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererDepartmentEdit}
                                                    labelledBy="Please Select Department"
                                                /> */}
                                                {selectedOptionsDepartmentEdit.length !== 0
                                                    ? selectedOptionsDepartmentEdit.map((data, index) => (
                                                        <Typography>
                                                            {index + 1}.{data.value}
                                                        </Typography>
                                                    ))
                                                    : ""}
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
                                                    Branch
                                                </Typography>
                                                {/* <MultiSelect
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
                                                /> */}
                                                {/* {selectedOptionsBranchEdit.length !== 0
                                                    ? selectedOptionsBranchEdit.map((data, index) => (
                                                        <Typography>
                                                            {index + 1}.{data.value}
                                                        </Typography>
                                                    ))
                                                    : ""} */}
                                                <Typography sx={{
                                                    wordBreak: "break-word",
                                                    overflowWrap: "break-word",
                                                    whiteSpace: "pre-wrap",
                                                }}>{!["Individual", "VPN Type"]?.includes(filterStateEdit.type) ? valueBranchEditCat?.join(",") : [...new Set(allUsersData?.filter((data) => valueEmployeeEditCat?.includes(data?.companyname))?.map(item => item.branch))]?.join(",")}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Unit
                                                </Typography>
                                                {/* <MultiSelect
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
                                                /> */}
                                                {/* {selectedOptionsUnitEdit.length !== 0
                                                    ? selectedOptionsUnitEdit.map((data, index) => (
                                                        <Typography>
                                                            {index + 1}.{data.value}
                                                        </Typography>
                                                    ))
                                                    : ""} */}
                                                <Typography sx={{
                                                    wordBreak: "break-word",
                                                    overflowWrap: "break-word",
                                                    whiteSpace: "pre-wrap",
                                                }}>{!["Individual", "VPN Type"]?.includes(filterStateEdit.type) ? valueUnitEditCat?.join(",") : [...new Set(allUsersData?.filter((data) => valueEmployeeEditCat?.includes(data?.companyname))?.map(item => item.unit))]?.join(",")}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Designation
                                                </Typography>
                                                {/* <MultiSelect
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
                                                /> */}
                                                {selectedOptionsDesignationEdit.length !== 0
                                                    ? selectedOptionsDesignationEdit.map((data, index) => (
                                                        <Typography>
                                                            {index + 1}.{data.value}
                                                        </Typography>
                                                    ))
                                                    : ""}
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Branch"]?.includes(filterStateEdit.type) ? (
                                    <>
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch
                                                </Typography>
                                                {/* <MultiSelect
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
                                                /> */}
                                                {/* {selectedOptionsBranchEdit.length !== 0
                                                    ? selectedOptionsBranchEdit.map((data, index) => (
                                                        <Typography>
                                                            {index + 1}.{data.value}
                                                        </Typography>
                                                    ))
                                                    : ""} */}
                                                <Typography sx={{
                                                    wordBreak: "break-word",
                                                    overflowWrap: "break-word",
                                                    whiteSpace: "pre-wrap",
                                                }}> {!["Individual", "VPN Type"]?.includes(filterStateEdit.type) ? valueBranchEditCat?.join(",") : [...new Set(allUsersData?.filter((data) => valueEmployeeEditCat?.includes(data?.companyname))?.map(item => item.branch))]?.join(",")}</Typography>
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Unit"]?.includes(filterStateEdit.type) ? (
                                    <>
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch
                                                </Typography>
                                                {/* <MultiSelect
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
                                                /> */}
                                                {/* {selectedOptionsBranchEdit.length !== 0
                                                    ? selectedOptionsBranchEdit.map((data, index) => (
                                                        <Typography>
                                                            {index + 1}.{data.value}
                                                        </Typography>
                                                    ))
                                                    : ""} */}
                                                <Typography sx={{
                                                    wordBreak: "break-word",
                                                    overflowWrap: "break-word",
                                                    whiteSpace: "pre-wrap",
                                                }}>{!["Individual", "VPN Type"]?.includes(filterStateEdit.type) ? valueBranchEditCat?.join(",") : [...new Set(allUsersData?.filter((data) => valueEmployeeEditCat?.includes(data?.companyname))?.map(item => item.branch))]?.join(",")}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={6} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit
                                                </Typography>
                                                {/* <MultiSelect
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
                                                /> */}
                                                {/* {selectedOptionsUnitEdit.length !== 0
                                                    ? selectedOptionsUnitEdit.map((data, index) => (
                                                        <Typography>
                                                            {index + 1}.{data.value}
                                                        </Typography>
                                                    ))
                                                    : ""} */}
                                                <Typography sx={{
                                                    wordBreak: "break-word",
                                                    overflowWrap: "break-word",
                                                    whiteSpace: "pre-wrap",
                                                }}>{!["Individual", "VPN Type"]?.includes(filterStateEdit.type) ? valueUnitEditCat?.join(",") : [...new Set(allUsersData?.filter((data) => valueEmployeeEditCat?.includes(data?.companyname))?.map(item => item.unit))]?.join(",")}</Typography>
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : (
                                    ""
                                )}
                                {["Individual", "VPN Type"]?.includes(filterStateEdit.type) && (
                                    <Grid item md={4} xs={6} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee
                                            </Typography>
                                            {/* <MultiSelect
                                                options={allUsersData
                                                    ?.filter(
                                                        (u) =>
                                                            valueCompanyEditCat?.includes(u.company) &&
                                                            valueBranchEditCat?.includes(u.branch) &&
                                                            valueUnitEditCat?.includes(u.unit) &&
                                                            valueTeamEditCat?.includes(u.team)
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
                                            /> */}
                                            {selectedOptionsEmployeeEdit.length !== 0
                                                ? selectedOptionsEmployeeEdit.map((data, index) => (
                                                    <Typography>
                                                        {index + 1}.{data.value}
                                                    </Typography>
                                                ))
                                                : ""}
                                        </FormControl>
                                    </Grid>
                                )}
                                <Grid item md={4} xs={6} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            Connections Team<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        {/* <MultiSelect
                                            options={teamsOptions}
                                            value={selectedOptionsRocketchatTeamEdit}
                                            onChange={(e) => {
                                                handleRocketchatTeamEditChange(e);
                                            }}
                                            valueRenderer={customValueRendererRocketchatTeamEdit}
                                            labelledBy="Please Select Connections Teams"
                                        /> */}
                                        <Selects
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
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={6} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            Connections Channels
                                        </Typography>
                                        <MultiSelect
                                            options={channelsOptions?.filter(data => data?.teamId === filterStateEdit.connectionteamid)?.map(entry => ({
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
                                    <LoadingButton
                                        variant="contained"
                                        color="primary"
                                        onClick={editSubmit}
                                        loading={updateLoader}
                                        sx={buttonStyles.buttonsubmit}
                                    >
                                        Update
                                    </LoadingButton>
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
            {/* Add new Employee DIALOG */}
            <Box>
                <Dialog
                    open={isAddOpen}
                    onClose={handleCloseModAdd}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    fullWidth={true}
                    sx={{
                        marginTop: "50px",
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                    }}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Add New Employee in Connections Team and Channel Grouping
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={6} sm={6}>
                                    <Typography sx={{ fontWeight: "bold" }}>
                                        ConnecTTS Team
                                    </Typography>
                                    <FormControl size="small" fullWidth>
                                        <Typography sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "pre-wrap",
                                        }}>
                                            {addIndividual.rocketchatteam?.join(",")}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={6} sm={6}>
                                    <Typography sx={{ fontWeight: "bold" }}>
                                        ConnecTTS Channels
                                    </Typography>
                                    <FormControl size="small" fullWidth>
                                        <Typography sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "pre-wrap",
                                        }}>
                                            {addIndividual.rocketchatchannel?.join(",")}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={6} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontWeight: "bold" }}>
                                            Type
                                        </Typography>
                                        <Typography>
                                            {addIndividual.type}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={6} sm={6}>
                                    <Typography>
                                        Work Mode<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <FormControl size="small" fullWidth>
                                        <MultiSelect
                                            options={workModeOptions}
                                            value={selectedOptionsWorkModeEdit}
                                            onChange={(e) => {
                                                handleWorkModeEditChange(e);
                                            }}
                                            valueRenderer={customValueRendererWorkModeEdit}
                                            labelledBy="Please Select Work Mode"
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
                                        {/* <Typography sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "pre-wrap",
                                        }}>
                                           
                                            {addIndividual.company?.join(",")}
                                        </Typography> */}
                                    </FormControl>
                                </Grid>

                                <Grid item md={4} xs={6} sm={6}>
                                    <Typography>
                                        Branch<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <FormControl size="small" fullWidth>
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
                                        {/* <Typography sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "pre-wrap",
                                        }}>
                                            {addIndividual.branch?.join(",")}
                                        </Typography> */}
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={6} sm={6}>
                                    <Typography>
                                        Unit<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <FormControl size="small" fullWidth>
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
                                        {/* <Typography sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "pre-wrap",
                                        }}>
                                            {addIndividual.unit?.join(",")}
                                        </Typography> */}
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={6} sm={6}>
                                    <Typography>
                                        Team<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <FormControl size="small" fullWidth>
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
                                        {/* <Typography sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "pre-wrap",
                                        }}>
                                            {addIndividual.team?.join(",")}
                                        </Typography> */}
                                    </FormControl>
                                </Grid>

                                <Grid item md={4} xs={6} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Employee<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            // options={addIndividualOptions}
                                            options={addIndividual.type === "Individual" ? allUsersData
                                                ?.filter((u) => {
                                                    // Check if valueWorkModeCat contains only "Internship"
                                                    if (valueWorkModeEditCat?.length === 1 && valueWorkModeEditCat.includes("Remote")) {
                                                        return (
                                                            u.workmode === "Remote" &&
                                                            valueCompanyEditCat?.includes(u.company) &&
                                                            valueBranchEditCat?.includes(u.branch) &&
                                                            valueUnitEditCat?.includes(u.unit) &&
                                                            valueTeamEditCat?.includes(u.team) &&
                                                            !existingEmployee?.includes(u.companyname)
                                                        );
                                                    }
                                                    // Check if valueWorkModeCat contains only "Employee"
                                                    if (valueWorkModeEditCat?.length === 1 && valueWorkModeEditCat.includes("Office")) {
                                                        return (
                                                            u.workmode !== "Remote" &&
                                                            valueCompanyEditCat?.includes(u.company) &&
                                                            valueBranchEditCat?.includes(u.branch) &&
                                                            valueUnitEditCat?.includes(u.unit) &&
                                                            valueTeamEditCat?.includes(u.team) &&
                                                            !existingEmployee?.includes(u.companyname)
                                                        );
                                                    }
                                                    // If it contains both or is empty, apply no filtering on workmode
                                                    return (
                                                        valueCompanyEditCat?.includes(u.company) &&
                                                        valueBranchEditCat?.includes(u.branch) &&
                                                        valueUnitEditCat?.includes(u.unit) &&
                                                        valueTeamEditCat?.includes(u.team) &&
                                                        !existingEmployee?.includes(u.companyname)
                                                    );
                                                })
                                                ?.map((u) => ({
                                                    label: u.companyname,
                                                    value: u.companyname,
                                                }))

                                                : vpnTypeDatas?.filter((item) => (
                                                    valueCompanyEditCat?.includes(item.company) &&
                                                    valueBranchEditCat?.includes(item.branch) &&
                                                    valueUnitEditCat?.includes(item.unit) &&
                                                    valueTeamEditCat?.some(data => item.team.includes(data)) &&
                                                    !existingEmployee?.includes(item.employeename)
                                                ))?.map(user => ({
                                                    label: user?.employeename,
                                                    value: user?.employeename,
                                                }))?.filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })
                                            }


                                            value={selectedOptionsAddIndividual}
                                            onChange={(e) => {
                                                handleAddIndividualChange(e);
                                            }}
                                            valueRenderer={customValueRendererAddIndividual}
                                            labelledBy="Please Select Employee"
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
                                    <LoadingButton
                                        variant="contained"
                                        color="primary"
                                        onClick={addIndividualFunc}
                                        loading={updateLoader}
                                        sx={buttonStyles.buttonsubmit}
                                    >
                                        Update
                                    </LoadingButton>
                                </Grid>
                                <br />
                                <Grid item md={3} xs={12} sm={12}>
                                    <Button
                                        sx={buttonStyles.btncancel}
                                        onClick={handleCloseModAdd}
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
                filename={"Connections Team&Channel Grouping"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={deleteTeam}
                title="Are you sure? The Users in those Team and Channels may also removed?"
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
                heading="Connections Team and Channel Grouping Info"
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

            <LoadingBackdrop open={isLoading} />
            {/* Popup Modal */}
            <Modal
                open={openRemove}
                onClose={handleCloseRemove}
                aria-labelledby="popup-title"
                aria-describedby="popup-description"
                sx={{ marginTop: "30px" }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 500,
                        maxHeight: "80vh",
                        overflowY: "auto",
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: "8px",
                    }}
                >
                    <Typography id="popup-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                        Remove Employees (Choose Employees to remove)
                    </Typography>

                    {/* Search Bar */}
                    <TextField
                        label="Search Employee"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* List of Employees with Checkboxes */}
                    <FormGroup>
                        {filteredEmployees?.map((name, index) => (
                            <FormControlLabel
                                key={index}
                                control={
                                    <Checkbox
                                        checked={selectedEmployees.includes(name)}
                                        onChange={() => handleCheckboxChange(name)}
                                    />
                                }
                                label={name}
                            />
                        ))}
                        {filteredEmployees?.length === 0 && (
                            <Typography variant="body2" sx={{ mt: 2, color: "gray" }}>
                                No employees found.
                            </Typography>
                        )}
                    </FormGroup>

                    {/* Action Buttons */}
                    <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                        <Button variant="outlined" sx={buttonStyles.btncancel} onClick={handleCloseRemove}>
                            Cancel
                        </Button>

                        <LoadingButton
                            variant="contained"
                            color="primary"
                            onClick={handleUpdateRemove}
                            loading={updateLoader}
                            sx={buttonStyles.buttonsubmit}
                        >
                            Update
                        </LoadingButton>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}

export default RocketchatTeamChannelGrouping;