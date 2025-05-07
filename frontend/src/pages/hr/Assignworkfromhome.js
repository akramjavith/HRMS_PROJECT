import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { MultiSelect } from "react-multi-select-component";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import {
    FormGroup,
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
import domtoimage from 'dom-to-image';

function AssignWorkFromHome() {
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
        setUpdateLoader(false)
        setFilterLoader(false);
    };
    const handleClosePopupMalert = () => {
        setUpdateLoader(false)
        setOpenPopupMalert(false);
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setUpdateLoader(false)
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setUpdateLoader(false)
        setOpenPopup(false);
    };

    let exportColumnNames = [
        "Department",
        "Designation",
        "Company",
        "Branch",
        "Unit",
        "Team",
        "Employee",
        "Work From Home Days",
        "Restricted Days Count",
        "Is Carry Forward"
    ];
    let exportRowValues = [
        "department",
        "designation",
        "company",
        "branch",
        "unit",
        "team",
        "employeename",
        "workfromhomedays",
        "applyrestriction",
        "isCarryForward"
    ];

    const modes = [
        { label: "Department", value: "Department" },
        { label: "Designation", value: "Designation" },
        { label: "Employee", value: "Employee" },
    ]


    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [assignWFH, setAssignWFH] = useState({

        mode: "Department",
    });
    const [assignWFHEdit, setAssignWFHEdit] = useState({
        mode: "Please Select Mode",
    });
    const [departmentOption, setDepartmentOption] = useState([]);
    const [designationOption, setDesignationOption] = useState([]);
    const [teamsArray, setTeamsArray] = useState([]);
    const [teamsArrayEdit, setTeamsArrayEdit] = useState([]);
    const [teamsArrayList, setTeamsArrayList] = useState([]);
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
                    data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
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
            pagename: String("Assign Work From Home"),
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

    //function to fetch participants
    const fetchParticipants = async () => {
        setPageName(!pageName)
        try {
            let res_participants = await axios.get(SERVICE.USERALLLIMIT, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });

            setParticipantsOption([
                ...res_participants?.data?.users?.map((t) => ({
                    ...t,
                    label: t.companyname,
                    value: t.companyname,
                })),
            ]);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //function to fetch department based on branch and team
    const fetchDepartmentAll = async () => {
        setPageName(!pageName)
        try {
            let res_deptandteam = await axios.get(SERVICE.DEPARTMENT, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });

            setDepartmentOption([
                ...res_deptandteam?.data?.departmentdetails?.map((t) => ({
                    ...t,
                    label: t.deptname,
                    value: t.deptname,
                })),
            ]);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //function to fetch department based on branch and team
    const fetchDesignationAll = async () => {
        setPageName(!pageName)
        try {
            let res_desig = await axios.get(SERVICE.DESIGNATION, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });

            setDesignationOption([
                ...res_desig?.data?.designation
                    ?.map((t) => ({
                        ...t,
                        label: t.name,
                        value: t.name,
                    })),
            ]);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {

        fetchDepartmentAll();
        fetchDesignationAll();
        fetchParticipants();

    }, []);

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
        branch: true,
        unit: true,
        team: true,
        designation: true,
        employeename: true,
        department: true,
        designation: true,
        workfromhomedays: true,
        isCarryForward: true,
        applyrestriction: true,
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
        fetchAssignWFH();
    }, []);
    useEffect(() => {
        fetchAssignWFHEdit();
    }, [isEditOpen]);
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

    // const [deleteTeamId, setDeleteTeamId] = useState({});
    const [deleteTeamId, setDeleteTeamId] = useState("");

    const rowData = async (id, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.ASSIGNWORKFROMHOME_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteTeamId(res?.data?.sassignworkfromhome);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    // Alert delete popup
    let assignid = deleteTeamId?._id;
    const deleteTeam = async () => {
        setPageName(!pageName);
        try {
            if (assignid) {
                await axios.delete(`${SERVICE.ASSIGNWORKFROMHOME_SINGLE}/${assignid}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                await fetchAssignWFH();
                handleCloseMod();
                setFilteredRowData([])
                setFilteredChanges(null)
                setSelectedRows([]);
                setPage(1);
                setPopupContent("Deleted Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
            }
        } catch (err) {
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
                return axios.delete(`${SERVICE.ASSIGNWORKFROMHOME_SINGLE}/${item}`, {
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
            setFilteredRowData([])
            setFilteredChanges(null)
            await fetchAssignWFH();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    //Project updateby edit page...
    let updateby = assignWFHEdit?.updatedby;
    let addedby = assignWFHEdit?.addedby;

    let subprojectsid = assignWFHEdit?._id;

    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName);

        let comp = selectedOptionsCompanyEdit.map((item) => item.value);
        let bran = selectedOptionsBranchEdit.map((item) => item.value);
        let unit = selectedOptionsUnitEdit.map((item) => item.value);
        let team = selectedOptionsTeamEdit.map((item) => item.value);
        let emp = selectedOptionsCateEdit.map((item) => item.value);
        let depart = selectedOptionsDepartmentEdit.map((item) => item.value);
        let desig = selectedOptionsDesignationEdit.map((item) => item.value);

        try {
            let res = await axios.put(
                `${SERVICE.ASSIGNWORKFROMHOME_SINGLE}/${subprojectsid}`,
                {
                    company: comp,
                    branch: bran,
                    unit: unit,
                    team: team,
                    employeename: emp,
                    department: depart,
                    designation: desig,
                    mode: assignWFHEdit.mode,
                    workfromhomedays: filterStateEdit.workfromhomedays,
                    isCarryForward: filterStateEdit.isCarryForward,
                    applyrestriction: filterStateEdit.applyrestriction,
                    updatedby: [
                        ...updateby,
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
            await fetchAssignWFH();
            await fetchAssignWFHEdit();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setUpdateLoader(false);
        } catch (err) {
            setUpdateLoader(false);
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
        fetchAssignWFHEdit();
        if (assignWFHEdit.mode == "Employee") {
            let emps = selectedOptionsCateEdit.map((item) => item.value);
            let isNameMatch = teamsArrayEdit.some((data) => data.employeename.some((item) => emps.includes(item)));
            if (selectedOptionsCompanyEdit.length === 0) {
                setPopupContentMalert("Please Select Company");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (selectedOptionsBranchEdit.length === 0) {
                setPopupContentMalert("Please Select Branch");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (selectedOptionsUnitEdit.length === 0) {
                setPopupContentMalert("Please Select Unit");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (selectedOptionsTeamEdit.length === 0) {
                setPopupContentMalert("Please Select Team");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (selectedOptionsCateEdit.length === 0) {
                setPopupContentMalert("Please Select Employee");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }

            else if (filterStateEdit.workfromhomedays?.trim() === "") {
                setPopupContentMalert("Please Enter Work From Days!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (filterStateEdit.applyrestriction?.trim() === "") {
                setPopupContentMalert("Please Enter Apply Restriction!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }

            else if (isNameMatch) {
                setPopupContentMalert("Data Already Exists!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }

            else {
                sendEditRequest()
            }
        } else if (assignWFHEdit.mode == "Department") {
            let deps = selectedOptionsDepartmentEdit.map((item) => item.value);
            let isNameMatch = teamsArrayEdit.some((data) => data.department.some((item) => deps.includes(item)));
            if (selectedOptionsDepartmentEdit.length === 0) {
                setPopupContentMalert("Please Select Department");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (filterStateEdit.workfromhomedays?.trim() === "") {
                setPopupContentMalert("Please Enter Work From Days!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (filterStateEdit.applyrestriction?.trim() === "") {
                setPopupContentMalert("Please Enter Apply Restriction!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }

            else if (isNameMatch) {
                setPopupContentMalert("Data Already Exists!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }

            else {
                sendEditRequest()
            }
        } else if (assignWFHEdit.mode == "Designation") {
            let desigs = selectedOptionsDesignationEdit.map((item) => item.value);
            let isNameMatch = teamsArrayEdit.some((data) => data.designation.some((item) => desigs.includes(item)));
            if (selectedOptionsDesignationEdit.length === 0) {
                setPopupContentMalert("Please Select Designation");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (filterStateEdit.workfromhomedays?.trim() === "") {
                setPopupContentMalert("Please Enter Work From Days!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (filterStateEdit.applyrestriction?.trim() === "") {
                setPopupContentMalert("Please Enter Apply Restriction!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }

            else if (isNameMatch) {
                setPopupContentMalert("Data Already Exists!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }

            else {
                sendEditRequest()
            }
        }
        else if (

            (filterStateEdit.workfromhomedays?.trim() === "")
        ) {
            setPopupContentMalert("Please Enter Work From Days!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else {
            setPopupContentMalert("Please Select Mode!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

    };


    const fetchAssignWFH = async () => {
        setPageName(!pageName);
        try {
            setLoader(true);
            let response = await axios.get(SERVICE.ASSIGNWORKFROMHOMES, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const resdata = response?.data?.assignworkfromhomes
            setTeamsArrayList(resdata)
            setTeamsArray(resdata.map((data, index) => ({
                ...data,
                id: data._id,
                serialNumber: index + 1,
                department: data?.department?.join(","),
                company: data?.company?.join(","),
                branch: data?.branch?.join(","),
                unit: data?.unit?.join(","),
                team: data?.team?.join(","),
                designation: data?.designation?.join(","),
                employeename: data?.employeename?.join(","),
                workfromhome: data?.workfromhome,
                isCarryForward: data?.isCarryForward ? "Yes" : "No",
            })));

            setLoader(false);
        } catch (err) {
            setLoader(false);
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

    const fetchAssignWFHEdit = async () => {
        setPageName(!pageName);
        try {
            setLoader(true);
            let response = await axios.get(SERVICE.ASSIGNWORKFROMHOMES, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const resdata = response?.data?.assignworkfromhomes
            setTeamsArrayEdit(resdata.filter((data) => data._id != assignWFHEdit._id));
            setLoader(false);
        } catch (err) {
            console.log(err, 'err')
            setLoader(false);
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

    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Assign Work From Home.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Assign Work From Home",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = (datas) => {
        setItems(datas);
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



                </Grid>
            ),
        },
        {
            field: "workfromhomedays",
            headerName: "Work From Home Days",
            flex: 0,
            width: 150,
            hide: !columnVisibility.workfromhomedays,
            headerClassName: "bold-header",
        },

        {
            field: "applyrestriction",
            headerName: "Restricted Days Count",
            flex: 0,
            width: 150,
            hide: !columnVisibility.applyrestriction,
            headerClassName: "bold-header",
        },
        {
            field: "isCarryForward",
            headerName: "Is Carry Forward",
            flex: 0,
            width: 150,
            hide: !columnVisibility.isCarryForward,
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
                    {isUserRoleCompare?.includes("eassignworkfromhome") && (
                        <>
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    getCode(params.data.id, params.data.name)
                                }}
                            >
                                <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                            </Button>
                        </>
                    )}

                    {isUserRoleCompare?.includes("dassignworkfromhome") && (
                        <>
                            <Button
                                sx={userStyle.buttondelete}
                                onClick={(e) => {
                                    rowData(params.data.id, params.data.name);
                                }}
                            >
                                <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                            </Button>
                        </>
                    )}
                    {isUserRoleCompare?.includes("vassignworkfromhome") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iassignworkfromhome") && (
                        <Button
                            size="small"
                            sx={userStyle.actionbutton}

                            onClick={() => {
                                getinfoCode(params.data.id);
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
            ...data,
            id: data._id,
            serialNumber: data.serialNumber,
            type: data.type,
            company: data.company,
            branch: data.branch,
            unit: data.unit,
            team: data.team,
            department: data.department,
            designation: data.designation,
            employeename: data.employeename,
            workfromhomedays: data.workfromhomedays,
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

    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [filterState, setFilterState] = useState({

        employeestatus: "Please Select Employee Status",
        workfromhomedays: "",
        applyrestriction: "",
        isCarryForward: false
    });

    const [filterStateEdit, setFilterStateEdit] = useState({

        employeestatus: "Please Select Employee Status",
        workfromhomedays: "",
        applyrestriction: "",
        isCarryForward: false

    });



    //get single row to edit....
    const getCode = async (e, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.ASSIGNWORKFROMHOME_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            handleClickOpenEdit();
            setSelectedOptionsCompanyEdit(res?.data?.sassignworkfromhome?.company.map((item) => ({ label: item, value: item })));
            setSelectedOptionsBranchEdit(res?.data?.sassignworkfromhome?.branch.map((item) => ({ label: item, value: item })));
            setSelectedOptionsUnitEdit(res?.data?.sassignworkfromhome?.unit.map((item) => ({ label: item, value: item })));
            setSelectedOptionsTeamEdit(res?.data?.sassignworkfromhome?.team.map((item) => ({ label: item, value: item })));
            setSelectedOptionsCateEdit(res?.data?.sassignworkfromhome?.employeename.map((item) => ({ label: item, value: item })));
            setSelectedOptionsDepartmentEdit(res?.data?.sassignworkfromhome?.department.map((item) => ({ label: item, value: item })));
            setSelectedOptionsDesignationEdit(res?.data?.sassignworkfromhome?.designation.map((item) => ({ label: item, value: item })));

            setValueCompanyCatEdit(res?.data?.sassignworkfromhome?.company)
            setValueBranchCatEdit(res?.data?.sassignworkfromhome?.branch)
            setValueUnitCatEdit(res?.data?.sassignworkfromhome?.unit)
            setValueTeamCatEdit(res?.data?.sassignworkfromhome?.team)
            setValueCateEdit(res?.data?.sassignworkfromhome?.employeename)

            setFilterStateEdit({

                workfromhomedays: res?.data?.sassignworkfromhome?.workfromhomedays,

                applyrestriction: res?.data?.sassignworkfromhome?.applyrestriction,
                isCarryForward: res?.data?.sassignworkfromhome?.isCarryForward
                // id: e,
                // updatedby: singleData?.updatedby || [],
            });
            setAssignWFHEdit({
                ...res?.data?.sassignworkfromhome,

            });
        } catch (err) {
            console.log(err, 'err')
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.ASSIGNWORKFROMHOME_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAssignWFHEdit({
                ...res?.data?.sassignworkfromhome,

            });
            setFilterStateEdit({
                workfromhomedays: res?.data?.sassignworkfromhome?.workfromhomedays,
                applyrestriction: res?.data?.sassignworkfromhome?.applyrestriction,
                isCarryForward: res?.data?.sassignworkfromhome?.isCarryForward
            });
            handleClickOpenview();
            setSelectedOptionsCompanyEdit(res?.data?.sassignworkfromhome?.company.map((item) => ({ label: item, value: item })));
            setSelectedOptionsBranchEdit(res?.data?.sassignworkfromhome?.branch.map((item) => ({ label: item, value: item })));
            setSelectedOptionsUnitEdit(res?.data?.sassignworkfromhome?.unit.map((item) => ({ label: item, value: item })));
            setSelectedOptionsTeamEdit(res?.data?.sassignworkfromhome?.team.map((item) => ({ label: item, value: item })));
            setSelectedOptionsCateEdit(res?.data?.sassignworkfromhome?.employeename.map((item) => ({ label: item, value: item })));
            setSelectedOptionsDepartmentEdit(res?.data?.sassignworkfromhome?.department.map((item) => ({ label: item, value: item })));
            setSelectedOptionsDesignationEdit(res?.data?.sassignworkfromhome?.designation.map((item) => ({ label: item, value: item })));

            setValueCompanyCatEdit(res?.data?.sassignworkfromhome?.company)
            setValueBranchCatEdit(res?.data?.sassignworkfromhome?.branch)
            setValueUnitCatEdit(res?.data?.sassignworkfromhome?.unit)
            setValueTeamCatEdit(res?.data?.sassignworkfromhome?.team)
            setValueCateEdit(res?.data?.sassignworkfromhome?.employeename)

        } catch (err) {
            console.log(err, 'err')
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.ASSIGNWORKFROMHOME_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAssignWFHEdit(res?.data?.sassignworkfromhome);
            handleClickOpeninfo();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
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


    const [branchOption, setBranchOption] = useState([]);
    const [unitOption, setUnitOption] = useState([]);
    const [teamOption, setTeamOption] = useState([]);
    const [participantsOption, setParticipantsOption] = useState([]);
    const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
    const [valueCate, setValueCate] = useState("");
    const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]);
    const [valueCateEdit, setValueCateEdit] = useState("");
    const [branchOptionEdit, setBranchOptionEdit] = useState([]);
    const [companyOptionEdit, setCompanyOptionEdit] = useState([]);
    const [unitOptionEdit, setUnitOptionEdit] = useState([]);
    const [teamOptionEdit, setTeamOptionEdit] = useState([]);
    const [participantsOptionEdit, setParticipantsOptionEdit] = useState([]);

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
        setValueCate([]);
        setSelectedOptionsCate([]);
    };

    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    const handleCategoryChange = (options) => {
        setValueCate(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCate(options);
    };
    const customValueRendererCate = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select Participants";
    };



    //Department multiselect
    const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState([]);
    let [valueDepartmentCat, setValueDepartmentCat] = useState([]);

    const handleDepartmentChange = (options) => {
        setValueDepartmentCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDepartment(options);
        // setValueCate([]);
        // setSelectedOptionsCate([]);
    };

    const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
        return valueDepartmentCat?.length
            ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
            : "Please Select Department";
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
    let [valueCompanyCatEdit, setValueCompanyCatEdit] = useState([]);

    const handleCompanyChangeEdit = (options) => {
        setValueCompanyCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompanyEdit(options);
        setValueBranchCatEdit([]);
        setSelectedOptionsBranchEdit([]);
        setValueUnitCatEdit([]);
        setSelectedOptionsUnitEdit([]);
        setValueTeamCatEdit([]);
        setSelectedOptionsTeamEdit([]);
        setValueCateEdit([]);
        setSelectedOptionsCateEdit([]);
    };

    const customValueRendererCompanyEdit = (valueCompanyCatEdit, _categoryname) => {
        return valueCompanyCatEdit?.length
            ? valueCompanyCatEdit.map(({ label }) => label)?.join(", ")
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
    let [valueBranchCatEdit, setValueBranchCatEdit] = useState([]);

    const handleBranchChangeEdit = (options) => {
        setValueBranchCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranchEdit(options);
        setValueUnitCatEdit([]);
        setSelectedOptionsUnitEdit([]);
        setValueTeamCatEdit([]);
        setSelectedOptionsTeamEdit([]);
        setValueCateEdit([]);
        setSelectedOptionsCateEdit([]);
    };

    const customValueRendererBranchEdit = (valueBranchCatEdit, _categoryname) => {
        return valueBranchCatEdit?.length
            ? valueBranchCatEdit.map(({ label }) => label)?.join(", ")
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
    let [valueUnitCatEdit, setValueUnitCatEdit] = useState([]);

    const handleUnitChangeEdit = (options) => {
        setValueUnitCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnitEdit(options);
        setValueTeamCatEdit([]);
        setSelectedOptionsTeamEdit([]);
        setValueCateEdit([]);
        setSelectedOptionsCateEdit([]);
    };

    const customValueRendererUnitEdit = (valueUnitCatEdit, _categoryname) => {
        return valueUnitCatEdit?.length
            ? valueUnitCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
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
    let [valueDesignationCatEdit, setValueDesignationCatEdit] = useState([]);

    const handleDesignationChangeEdit = (options) => {
        setValueDesignationCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDesignationEdit(options);
        // setValueCate([]);
        // setSelectedOptionsCate([]);
    };

    const customValueRendererDesignationEdit = (valueDesignationCatEdit, _categoryname) => {
        return valueDesignationCatEdit?.length
            ? valueDesignationCatEdit.map(({ label }) => label)?.join(", ")
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


    //Department multiselect
    const [selectedOptionsDepartmentEdit, setSelectedOptionsDepartmentEdit] = useState([]);
    let [valueDepartmentCatEdit, setValueDepartmentCatEdit] = useState([]);

    const handleDepartmentChangeEdit = (options) => {
        setValueDepartmentCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDepartmentEdit(options);
        // setValueCate([]);
        // setSelectedOptionsCate([]);
    };

    const customValueRendererDepartmentEdit = (valueDepartmentCatEdit, _categoryname) => {
        return valueDepartmentCatEdit?.length
            ? valueDepartmentCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Department";
    };

    //team multiselect
    const [selectedOptionsTeamEdit, setSelectedOptionsTeamEdit] = useState([]);
    let [valueTeamCatEdit, setValueTeamCatEdit] = useState([]);

    const handleTeamChangeEdit = (options) => {
        setValueTeamCatEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeamEdit(options);
        setValueCateEdit([]);
        setSelectedOptionsCateEdit([]);
    };

    const customValueRendererTeamEdit = (valueTeamCatEdit, _categoryname) => {
        return valueTeamCatEdit?.length
            ? valueTeamCatEdit.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    const handleCategoryChangeEdit = (options) => {
        setValueCateEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCateEdit(options);
    };
    const customValueRendererCateEdit = (valueCateEdit, _employeename) => {
        return valueCateEdit.length
            ? valueCateEdit.map(({ label }) => label).join(", ")
            : "Please Select Participants";
    };

    // //MULTISELECT ONCHANGE END

    const handleClearFilter = (e) => {
        e.preventDefault();
        setAssignWFH({
            ...assignWFH,
            mode: "Department",

        });

        setSelectedOptionsCompany([])
        setSelectedOptionsBranch([])
        setSelectedOptionsUnit([])
        setSelectedOptionsTeam([])
        setSelectedOptionsCate([])
        setSelectedOptionsDepartment([])
        setSelectedOptionsDesignation([])
        setBranchOption([])
        setUnitOption([])
        setTeamOption([])
        setParticipantsOption([])
        setFilterState({

            employeestatus: "Please Select Employee Status",
            workfromhomedays: "",
            applyrestriction: "",
            isCarryForward: false
        });

        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };


    const [filterLoader, setFilterLoader] = useState(false);
    const [updateLoader, setUpdateLoader] = useState(false);
    const [tableLoader, setTableLoader] = useState(false);

    //submit option for saving
    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetchAssignWFH();
        if (assignWFH.mode == "Employee") {
            let emps = selectedOptionsCate.map((item) => item.value);
            let isNameMatch = teamsArrayList?.some((data) => data.employeename?.some((item) => emps.includes(item)));
            if (selectedOptionsCompany.length === 0) {
                setPopupContentMalert("Please Select Company");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (selectedOptionsBranch.length === 0) {
                setPopupContentMalert("Please Select Branch");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (selectedOptionsUnit.length === 0) {
                setPopupContentMalert("Please Select Unit");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (selectedOptionsTeam.length === 0) {
                setPopupContentMalert("Please Select Team");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (selectedOptionsCate.length === 0) {
                setPopupContentMalert("Please Select Employee");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (filterState.workfromhomedays?.trim() === "") {
                setPopupContentMalert("Please Enter Work From Days!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (filterState.applyrestriction?.trim() === "") {
                setPopupContentMalert("Please Enter Apply Restriction!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }

            else if (isNameMatch) {
                setPopupContentMalert("Data Already Exists!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else {
                sendRequest()
            }
        } else if (assignWFH.mode == "Department") {
            let deps = selectedOptionsDepartment.map((item) => item.value);
            let isNameMatch = teamsArrayList.some((data) => data.department.some((item) => deps.includes(item)));
            if (selectedOptionsDepartment.length === 0) {
                setPopupContentMalert("Please Select Department");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (filterState.workfromhomedays?.trim() === "") {
                setPopupContentMalert("Please Enter Work From Days!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (filterState.applyrestriction?.trim() === "") {
                setPopupContentMalert("Please Enter Apply Restriction!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }

            else if (isNameMatch) {
                setPopupContentMalert("Data Already Exists!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else {
                sendRequest()
            }
        } else if (assignWFH.mode == "Designation") {
            let desigs = selectedOptionsDesignation.map((item) => item.value);
            let isNameMatch = teamsArrayList.some((data) => data.designation.some((item) => desigs.includes(item)));
            if (selectedOptionsDesignation.length === 0) {
                setPopupContentMalert("Please Select Designation");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (filterState.workfromhomedays?.trim() === "") {
                setPopupContentMalert("Please Enter Work From Days!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (filterState.applyrestriction?.trim() === "") {
                setPopupContentMalert("Please Enter Apply Restriction!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }

            else if (isNameMatch) {
                setPopupContentMalert("Data Already Exits!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else {
                sendRequest()
            }
        }

        else {
            setPopupContentMalert("Please Select Mode!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
    };


    const sendRequest = async () => {
        setFilterLoader(true);
        setTableLoader(true);
        setPageName(!pageName);
        let comp = selectedOptionsCompany.map((item) => item.value);
        let bran = selectedOptionsBranch.map((item) => item.value);
        let unit = selectedOptionsUnit.map((item) => item.value);
        let team = selectedOptionsTeam.map((item) => item.value);
        let emp = selectedOptionsCate.map((item) => item.value);
        let depart = selectedOptionsDepartment.map((item) => item.value);
        let desig = selectedOptionsDesignation.map((item) => item.value);
        try {
            let response = await axios.post(
                SERVICE.ASSIGNWORKFROMHOME_CREATE,
                {

                    company: comp,
                    branch: bran,
                    unit: unit,
                    team: team,
                    employeename: emp,
                    department: depart,
                    designation: desig,
                    mode: assignWFH.mode,
                    workfromhomedays: filterState.workfromhomedays,
                    isCarryForward: Boolean(filterState.isCarryForward),
                    applyrestriction: filterState.applyrestriction,
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
            await fetchAssignWFH();
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsBtn(false);
        } catch (err) {
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

    //FILTER END

    return (
        <Box>
            <Headtitle title={"ASSIGN WORK FROM HOME"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Assign Work From Home"
                modulename="Leave&Permission"
                submodulename="Work From Home"
                mainpagename="Assign Work From Home"
                subpagename=""
                subsubpagename=""
            />
            <>
                {isUserRoleCompare?.includes("aassignworkfromhome") && (
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Add Assign Work From Home
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />

                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Mode <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={modes}
                                            value={{ label: assignWFH.mode, value: assignWFH.mode }}
                                            onChange={(e) => {
                                                setAssignWFH((prev) => ({
                                                    ...prev, mode: e.value,
                                                }))

                                                setSelectedOptionsCompany([])
                                                setSelectedOptionsBranch([])
                                                setSelectedOptionsUnit([])
                                                setSelectedOptionsTeam([])
                                                setSelectedOptionsCate([])
                                                setSelectedOptionsDepartment([])
                                                setSelectedOptionsDesignation([])
                                                setBranchOption([])
                                                setUnitOption([])
                                                setTeamOption([])
                                                setParticipantsOption([])
                                                setFilterState({
                                                    ...filterState, workfromhomedays: "", applyrestriction: "",
                                                    isCarryForward: false
                                                });
                                            }}
                                        />

                                    </FormControl>
                                </Grid>
                                {assignWFH.mode == "Employee" ?
                                    <>
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Company<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch?.map(data => ({
                                                        label: data.company,
                                                        value: data.company,
                                                    })).filter((item, index, self) => {
                                                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Branch<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch?.filter(
                                                        (comp) =>
                                                            valueCompanyCat?.includes(comp.company)
                                                    )?.map(data => ({
                                                        label: data.branch,
                                                        value: data.branch,
                                                    })).filter((item, index, self) => {
                                                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
                                                    Unit<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch?.filter(
                                                        (comp) =>
                                                            valueCompanyCat?.includes(comp.company) && valueBranchCat?.includes(comp.branch)
                                                    )?.map(data => ({
                                                        label: data.unit,
                                                        value: data.unit,
                                                    })).filter((item, index, self) => {
                                                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
                                                        ?.filter((u) => valueCompanyCat?.includes(u.company) && valueBranchCat?.includes(u.branch) && valueUnitCat?.includes(u.unit))
                                                        .map((u) => ({
                                                            ...u,
                                                            label: u.teamname,
                                                            value: u.teamname,
                                                        }))}
                                                    value={selectedOptionsTeam}
                                                    onChange={(e) => {
                                                        handleTeamChange(e);
                                                        fetchParticipants();
                                                    }}
                                                    valueRenderer={customValueRendererTeam}
                                                    labelledBy="Please Select Team"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Employee<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={participantsOption
                                                        ?.filter(
                                                            (u) =>
                                                                valueCompanyCat?.includes(u.company) &&
                                                                valueBranchCat?.includes(u.branch) &&
                                                                valueUnitCat?.includes(u.unit) &&
                                                                valueTeamCat?.includes(u.team)
                                                        )
                                                        .map((u) => ({
                                                            ...u,
                                                            label: u.companyname,
                                                            value: u.companyname,
                                                        }))}
                                                    value={selectedOptionsCate}
                                                    onChange={handleCategoryChange}
                                                    valueRenderer={customValueRendererCate}
                                                    labelledBy="Please Select Participants"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </> :
                                    <>
                                        {assignWFH.mode == "Department" ? <>
                                            <Grid item md={4} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Department<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={departmentOption}
                                                        value={selectedOptionsDepartment}
                                                        onChange={(e) => {
                                                            handleDepartmentChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererDepartment}
                                                        labelledBy="Please Select Department"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </> : <>
                                            {assignWFH.mode == "Designation" ?
                                                <>
                                                    <Grid item md={4} xs={12} sm={6}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography>
                                                                Designation<b style={{ color: "red" }}>*</b>
                                                            </Typography>
                                                            <MultiSelect
                                                                options={designationOption}
                                                                value={selectedOptionsDesignation}
                                                                onChange={(e) => {
                                                                    handleDesignationChange(e);
                                                                }}
                                                                valueRenderer={customValueRendererDesignation}
                                                                labelledBy="Please Select Department"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </> : <>
                                                </>}
                                        </>}
                                    </>}
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Work From Home Days <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Please Enter Work From Home"
                                            value={filterState.workfromhomedays}
                                            onChange={(e) => {
                                                setFilterState({ ...filterState, workfromhomedays: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {"Apply Restriction (Days Before)"} <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Please Enter No of Days"
                                            value={filterState.applyrestriction}
                                            onChange={(e) => {
                                                setFilterState({ ...filterState, applyrestriction: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12} mt={3}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filterState.isCarryForward}
                                                onChange={(e) => {
                                                    setFilterState({ ...filterState, isCarryForward: e.target.checked });
                                                }}
                                                color="primary"
                                            />
                                        }
                                        label="Is Carry Forward to Next Year"
                                    />
                                </Grid>
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

                        </>
                    </Box>
                )}
            </>
            <br /> <br />
            {/* ****** Table Start ****** */}
            {
                isUserRoleCompare?.includes("lassignworkfromhome") && (
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
                                        Assign Work From Home List
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
                                            {isUserRoleCompare?.includes("excelassignworkfromhome") && (
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
                                            {isUserRoleCompare?.includes("csvassignworkfromhome") && (
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
                                            {isUserRoleCompare?.includes("printassignworkfromhome") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                        &ensp;
                                                        <FaPrint />
                                                        &ensp;Print&ensp;
                                                    </Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfassignworkfromhome") && (
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
                                            {isUserRoleCompare?.includes("imageassignworkfromhome") && (
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
                                            maindatas={teamsArray}
                                            setSearchedString={setSearchedString}
                                            searchQuery={searchQuery}
                                            setSearchQuery={setSearchQuery}
                                            paginated={false}
                                            totalDatas={teamsArray}
                                        />
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
                                {isUserRoleCompare?.includes("bdassignworkfromhome") && (
                                    <Button
                                        variant="contained"
                                        sx={buttonStyles.buttonbulkdelete}
                                        onClick={handleClickOpenalert}
                                    >
                                        Bulk Delete
                                    </Button>
                                )}
                                <br />

                                <Box
                                    style={{
                                        width: "100%",
                                        overflowY: "hidden", // Hide the y-axis scrollbar
                                    }}
                                >
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
                                        itemsList={teamsArray}
                                    />
                                </Box>

                                {/* ****** Table End ****** */}
                            </Box>
                        )}
                    </>
                )
            }
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
                            View Assign Work From Home
                        </Typography>
                        <br /> <br />

                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Mode
                                    </Typography>
                                    {/* <OutlinedInput readOnly value={assignWFHEdit.mode} /> */}
                                    <Typography>
                                        {assignWFHEdit.mode}
                                    </Typography>


                                </FormControl>
                            </Grid>
                            {assignWFHEdit.mode == "Employee" ?
                                <>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Company
                                            </Typography>
                                            <Typography>
                                                {Array.isArray(selectedOptionsCompanyEdit) ? selectedOptionsCompanyEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                            </Typography>


                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography >
                                                Branch
                                            </Typography>
                                            <Typography>
                                                {Array.isArray(selectedOptionsBranchEdit) ? selectedOptionsBranchEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                            </Typography>

                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Unit
                                            </Typography>
                                            <Typography>
                                                {Array.isArray(selectedOptionsUnitEdit) ? selectedOptionsUnitEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                            </Typography>

                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Team
                                            </Typography>
                                            <Typography>
                                                {Array.isArray(selectedOptionsTeamEdit) ? selectedOptionsTeamEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                            </Typography>

                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee
                                            </Typography>
                                            <Typography>
                                                {Array.isArray(selectedOptionsCateEdit) ? selectedOptionsCateEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                            </Typography>

                                        </FormControl>
                                    </Grid>
                                </> :
                                <>
                                    {assignWFHEdit.mode == "Department" ? <>
                                        <Grid item md={4} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Department
                                                </Typography>
                                                <Typography>
                                                    {Array.isArray(selectedOptionsDepartmentEdit) ? selectedOptionsDepartmentEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                                </Typography>

                                            </FormControl>
                                        </Grid>
                                    </> : <>
                                        {assignWFHEdit.mode == "Designation" ?
                                            <>
                                                <Grid item md={4} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Designation
                                                        </Typography>
                                                        <Typography>
                                                            {Array.isArray(selectedOptionsDesignationEdit) ? selectedOptionsDesignationEdit.map((item, index) => (`${index + 1}. ${item.value} `)) : ""}
                                                        </Typography>

                                                    </FormControl>
                                                </Grid>
                                            </> : <>
                                            </>}
                                    </>}
                                </>}

                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Work From Home Days</Typography>
                                    <Typography>{filterStateEdit?.workfromhomedays}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">{"Apply Restriction (Days Before)"}</Typography>
                                    <Typography>{filterStateEdit?.applyrestriction}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">{"Is Carry Forward to Next Year"}</Typography>
                                    <Typography>{filterStateEdit?.isCarryForward ? "Yes" : "No"}</Typography>
                                </FormControl>
                            </Grid>

                        </Grid>
                        <br />
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
                        marginTop: "20px",
                        // "& .MuiPaper-root": {
                        //     overflow: "visible",
                        // },
                    }}
                >
                    <Box sx={{ padding: "20px 30px", }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Edit Assign Work From Home
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Mode <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={modes}
                                            value={{ label: assignWFHEdit.mode, value: assignWFHEdit.mode }}
                                            onChange={(e) => {
                                                setAssignWFHEdit((prev) => ({
                                                    ...prev, mode: e.value,
                                                }))

                                                setSelectedOptionsCompanyEdit([])
                                                setSelectedOptionsBranchEdit([])
                                                setSelectedOptionsUnitEdit([])
                                                setSelectedOptionsTeamEdit([])
                                                setSelectedOptionsCateEdit([])
                                                setSelectedOptionsDepartmentEdit([])
                                                setSelectedOptionsDesignationEdit([])
                                                setBranchOptionEdit([])
                                                setUnitOptionEdit([])
                                                setTeamOptionEdit([])
                                                setParticipantsOptionEdit([])
                                                setFilterStateEdit({
                                                    ...filterStateEdit, workfromhomedays: "", applyrestriction: "",
                                                    isCarryForward: false
                                                });

                                            }}
                                        />

                                    </FormControl>
                                </Grid>
                                {assignWFHEdit.mode == "Employee" ?
                                    <>
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Company<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch?.map(data => ({
                                                        label: data.company,
                                                        value: data.company,
                                                    })).filter((item, index, self) => {
                                                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                    })}
                                                    value={selectedOptionsCompanyEdit}
                                                    onChange={(e) => {
                                                        handleCompanyChangeEdit(e);
                                                    }}
                                                    valueRenderer={customValueRendererCompanyEdit}
                                                    labelledBy="Please Select Company"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Branch<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch?.filter(
                                                        (comp) =>
                                                            valueCompanyCatEdit?.includes(comp.company)
                                                    )?.map(data => ({
                                                        label: data.branch,
                                                        value: data.branch,
                                                    })).filter((item, index, self) => {
                                                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                    })}
                                                    value={selectedOptionsBranchEdit}
                                                    onChange={(e) => {
                                                        handleBranchChangeEdit(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranchEdit}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Unit<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch?.filter(
                                                        (comp) =>
                                                            valueCompanyCatEdit?.includes(comp.company) && valueBranchCatEdit?.includes(comp.branch)
                                                    )?.map(data => ({
                                                        label: data.unit,
                                                        value: data.unit,
                                                    })).filter((item, index, self) => {
                                                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                    })}
                                                    value={selectedOptionsUnitEdit}
                                                    onChange={(e) => {
                                                        handleUnitChangeEdit(e);
                                                    }}
                                                    valueRenderer={customValueRendererUnitEdit}
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
                                                        ?.filter((u) => valueCompanyCatEdit?.includes(u.company) && valueBranchCatEdit?.includes(u.branch) && valueUnitCatEdit?.includes(u.unit))
                                                        .map((u) => ({
                                                            ...u,
                                                            label: u.teamname,
                                                            value: u.teamname,
                                                        }))}
                                                    value={selectedOptionsTeamEdit}
                                                    onChange={(e) => {
                                                        handleTeamChangeEdit(e);
                                                    }}
                                                    valueRenderer={customValueRendererTeamEdit}
                                                    labelledBy="Please Select Team"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Employee<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={participantsOption
                                                        ?.filter(
                                                            (u) =>
                                                                valueCompanyCatEdit?.includes(u.company) &&
                                                                valueBranchCatEdit?.includes(u.branch) &&
                                                                valueUnitCatEdit?.includes(u.unit) &&
                                                                valueTeamCatEdit?.includes(u.team)
                                                        )
                                                        .map((u) => ({
                                                            ...u,
                                                            label: u.companyname,
                                                            value: u.companyname,
                                                        }))}
                                                    value={selectedOptionsCateEdit}
                                                    onChange={handleCategoryChangeEdit}
                                                    valueRenderer={customValueRendererCateEdit}
                                                    labelledBy="Please Select Participants"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </> :
                                    <>
                                        {assignWFHEdit.mode == "Department" ? <>
                                            <Grid item md={4} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Department<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <MultiSelect
                                                        options={departmentOption}
                                                        value={selectedOptionsDepartmentEdit}
                                                        onChange={(e) => {
                                                            handleDepartmentChangeEdit(e);
                                                        }}
                                                        valueRenderer={customValueRendererDepartmentEdit}
                                                        labelledBy="Please Select Department"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </> : <>
                                            {assignWFHEdit.mode == "Designation" ?
                                                <>
                                                    <Grid item md={4} xs={12} sm={6}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography>
                                                                Designation<b style={{ color: "red" }}>*</b>
                                                            </Typography>
                                                            <MultiSelect
                                                                options={designationOption}
                                                                value={selectedOptionsDesignationEdit}
                                                                onChange={(e) => {
                                                                    handleDesignationChangeEdit(e);
                                                                }}
                                                                valueRenderer={customValueRendererDesignationEdit}
                                                                labelledBy="Please Select Department"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </> : <>
                                                </>}
                                        </>}
                                    </>}

                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Work From Home Days <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Please Enter Work From Home"
                                            value={filterStateEdit.workfromhomedays}
                                            onChange={(e) => {
                                                setFilterStateEdit({ ...filterStateEdit, workfromhomedays: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {"Apply Restriction (Days Before)"} <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Please Enter No of Days"
                                            value={filterStateEdit.applyrestriction}
                                            onChange={(e) => {
                                                setFilterStateEdit({ ...filterStateEdit, applyrestriction: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} mt={3}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filterStateEdit.isCarryForward}
                                                onChange={(e) => {
                                                    setFilterStateEdit({ ...filterStateEdit, isCarryForward: e.target.checked });
                                                }}
                                                color="primary"
                                            />
                                        }
                                        label="Is Carry Forward to Next Year"
                                    />
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
                // filteredDataTwo={filteredData ?? []}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={teamsArray ?? []}
                // itemsTwo={items ?? []}
                filename={"Assign Work From Home"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={deleteTeam}
                title="Are you sure?"
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
                heading="Assign Work From Home Info"
                addedby={addedby}
                updateby={updateby}
            />

            {/* PLEASE SELECT ANY ROW */}
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />
            {/* EXTERNAL COMPONENTS -------------- END */}



        </Box >
    );
}

export default AssignWorkFromHome;