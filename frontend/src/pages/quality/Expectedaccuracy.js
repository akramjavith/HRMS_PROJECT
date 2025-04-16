import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, TextareaAutosize, TextField, Typography } from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import AggridTable from "../../components/AggridTable";
import AlertDialog from "../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

function ExpectedAccuray() {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);


    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("")
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    }

    const pathname = window.location.pathname;

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Expected Accuracy"),
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
    const gridRefTable = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch,
        buttonStyles } = useContext(UserRoleAccessContext);
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
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        project: true,
        queue: true,
        category: true,
        minimumaccuracy: true,
        mode: true,
        expectedaccuracyfrom: true,
        expectedaccuracyto: true,
        statusmode: true,
        percentage: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    let exportColumnNames = ["Project", "Queue", "Minimum Accuracy", "Category", "Mode", "Expected Accuracy", "Status Mode", "Percentage"];
    let exportRowValues = ["project", "queue", "minimumaccuracy", "category", "mode", "expectedaccuracyfrom", "statusmode", "percentage"];

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [accuracyMasterArray, setAccuracyMasterArray] = useState([]);

    //useEffect
    useEffect(() => {
        addSerialNumber(accuracyMasterArray);
    }, [accuracyMasterArray]);

    useEffect(() => {
        fetchEmployee();
    }, []);
    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

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
    // page refersh reload
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
        setIsHandleChange(true);
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


    // for Expected Accuracy
    const [projectOpt, setProjectopt] = useState([]);
    const [queueOption, setQueueOption] = useState([]);
    const [categoryOption, setCategoryOption] = useState("");
    const [queueOptionEdit, setQueueOptionEdit] = useState([]);
    const [projectOptEdit, setProjectoptEdit] = useState([]);

    //options
    const statusModeOptions = [
        { label: "Penalty", value: "Penalty" },
        { label: "Bonus", value: "Bonus" },
    ]
    const modeOptions = [
        { label: "Client", value: "Client" },
        { label: "Internal", value: "Internal" },
    ]

    const [selectedMode, setSelectedMode] = useState("Please Select Mode");
    const [selectedStatusMode, setSelectedStatusMode] = useState("Please Select Status Mode");
    const [expectedAccuracyDetails, setExpectedAccuracyDetails] = useState({
        from: "", to: "", percentage: "",
        project: "Please Select Project",
        category: "",
        queue: "Please Select Queue", minimumaccuracy: ""
    });

    const [selectedModeEdit, setSelectedModeEdit] = useState("Please Select Mode");
    const [selectedStatusModeEdit, setSelectedStatusModeEdit] = useState("Please Select Status Mode");
    const [expectedAccuracyDetailsEdit, setExpectedAccuracyDetailsEdit] = useState({
        from: "", to: "", percentage: "",
        project: "Please Select Project",
        category: "",
        queue: "Please Select Queue", minimumaccuracy: ""
    });

    //for edit section
    const [selectedOptionsSubcategoryEdit, setSelectedOptionsSubcategoryEdit] = useState([]);

    const [error, setError] = useState('');
    const [errorEdit, setErrorEdit] = useState('');

    const [accuracyMasterEdit, setAccuracyMasterEdit] = useState({ project: "Please Select Project", Category: "Please Select category", });


    const fetchProjectDropdowns = async () => {
        setPageName(!pageName)
        setPageName(!pageName)
        try {
            let res_category = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const companyall = [
                ...res_category?.data?.projmaster.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                })),
            ];

            setProjectopt(companyall);
            setProjectoptEdit(companyall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const fetchQueueDropdowns = async (e) => {
        setPageName(!pageName)
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.ACCURACYMASTERGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res_project.data.accuracymaster.filter((d) => d.projectvendor === e.value);

            const catall = result.map((d) => ({
                ...d,
                label: d.queue,
                value: d.queue,
            }));

            setQueueOption(catall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchMinimumaccuracy = async (e, project) => {
        setPageName(!pageName)
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.ACCURACYMASTERGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });


            let result = res_project.data.accuracymaster.filter((d) => (d.queue === e.value && d.projectvendor === project));

            setExpectedAccuracyDetails((prev) => ({
                ...prev, minimumaccuracy: result[0].minimumaccuracy
            }))

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchMinimumaccuracyEdit = async (e, project) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.ACCURACYMASTERGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });


            let result = res_project.data.accuracymaster.filter((d) => (d.queue === e.value && d.projectvendor === project));

            setExpectedAccuracyDetailsEdit((prev) => ({
                ...prev, minimumaccuracy: result[0].minimumaccuracy
            }))

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchQueueDropdownsEdit = async (e) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.ACCURACYMASTERGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res_project.data.accuracymaster.filter((d) => d.projectvendor === e);

            const catall = result.map((d) => ({
                ...d,
                label: d.queue,
                value: d.queue,
            }));

            setQueueOptionEdit(catall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const fetchCategoryDropdownsAll = async (e) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.ACCURACYQUEUEGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });


            let result = res_project.data.accuracyqueuegroupings.filter((d) => d.project && d.queue === e.value);

            setCategoryOption(result.flatMap(item => item.category).toString());
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchProjectDropdowns();
    }, []);

    const [accuracyMasterFilterArray, setAccuracyMasterFilterArray] = useState([])

    const fetchAccuracyMasterArray = async () => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.EXPECTEDACCURACYGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAccuracyMasterFilterArray(res_freq?.data?.expectedaccuracy.map((item, index) => ({

                id: item._id,
                serialNumber: item.serialNumber,
                project: item.project,
                queue: item.queue,
                minimumaccuracy: item.minimumaccuracy + " %",
                category: item.category,
                mode: item.mode,
                expectedaccuracyfrom: `${item.expectedaccuracyfrom} - ${item.expectedaccuracyto} %`,
                statusmode: item.statusmode,
                percentage: `${item.percentage} %`

            })));
            setLoader(true);

        } catch (err) { setLoader(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchAccuracyMasterArray()
    }, [isFilterOpen])


    const [overallFilterdata, setOverallFilterdata] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchEmployee = async () => {
        setPageName(!pageName)

        try {
            let res_employee = await axios.post(SERVICE.ALL_EXPECTEDACCURACYMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                page: Number(page),
                pageSize: Number(pageSize),
                searchQuery: searchQuery
            });

            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
            const ansOverallData = res_employee?.data?.totalProjectsOverallData?.length > 0 ? res_employee?.data?.totalProjectsOverallData : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                // serialNumber: index + 1,
            }));
            const itemsWithSerialNumberOverall = ansOverallData?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                // serialNumber: index + 1,
            }));
            //   setcheckemployeelist(true);
            setAccuracyMasterArray(itemsWithSerialNumber.map((item, index) => ({
                ...item,
                id: item._id,
                serialNumber: item.serialNumber,
                project: item.project,
                queue: item.queue,
                minimumaccuracy: item.minimumaccuracy + " %",
                category: item.category,
                mode: item.mode,
                expectedaccuracyfrom: `${item.expectedaccuracyfrom} - ${item.expectedaccuracyto} %`,
                statusmode: item.statusmode,
                percentage: `${item.percentage} %`
                // serialNumber: index + 1,
            })));
            setOverallFilterdata(itemsWithSerialNumberOverall?.length > 0 ? itemsWithSerialNumberOverall
                .map((item, index) => ({
                    ...item,
                    id: item._id,
                    serialNumber: item.serialNumber,
                    project: item.project,
                    queue: item.queue,
                    minimumaccuracy: item.minimumaccuracy + " %",
                    category: item.category,
                    mode: item.mode,
                    expectedaccuracyfrom: `${item.expectedaccuracyfrom} - ${item.expectedaccuracyto} %`,
                    statusmode: item.statusmode,
                    percentage: `${item.percentage} %`
                    // serialNumber: index + 1,
                })
                )
                : []);
            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);

            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    };

    useEffect(() => {
        fetchEmployee();
    }, [page, pageSize]);

    //set function to get particular row
    const rowData = async (id) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.EXPECTEDACCURACY_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setAccuracyMasterEdit(res?.data?.sexpectedaccuracy);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // Alert delete popup
    let brandid = accuracyMasterEdit._id;
    const delBrand = async () => {
        setPageName(!pageName)
        try {
            await axios.delete(`${SERVICE.EXPECTEDACCURACY_SINGLE}/${brandid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchEmployee();

            handleCloseMod();
            setSelectedRows([]);
            setPage(1);

            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const [isBtn, setIsBtn] = useState(false)
    //add function
    const sendRequest = async () => {
        setPageName(!pageName)
        try {
            let getAchievedAccuracydata = await axios.post(SERVICE.ACHEIVEDACCURACY_SINGLEBYDETAILS, {
                // project: String(selectedProject),
                project: String(expectedAccuracyDetails.project),
                queue: String(expectedAccuracyDetails.queue),

                expectedaccuracyfrom: expectedAccuracyDetails.from,
                expectedaccuracyto: expectedAccuracyDetails.to,

            })

            let data = getAchievedAccuracydata?.data?.existinglist[0]

            let datas = getAchievedAccuracydata?.data?.existinglist


            if (data) {
                if ((data.internalstatus === "" || data.internalstatus === undefined) && selectedMode === "Internal") {


                    let postData = await axios.put(`${SERVICE.ACHEIVEDACCURACY_SINGLEBYDETAILS}/${data._id}`, {
                        internalstatus: `${selectedStatusMode} ${expectedAccuracyDetails.percentage} %`
                    })

                }
                if ((data.clientstatus === "" || data.clientstatus === undefined) && selectedMode === "Client") {

                    let postData = await axios.put(`${SERVICE.ACHEIVEDACCURACY_SINGLEBYDETAILS}/${data._id}`, {
                        clientstatus: `${selectedStatusMode} ${expectedAccuracyDetails.percentage} %`
                    })




                }
            }

        } catch (e) {
        } finally {
            setIsBtn(true)

            setPageName(!pageName)
            try {
                await axios.post(SERVICE.EXPECTEDACCURACY_CREATE, {
                    project: String(expectedAccuracyDetails.project),
                    queue: String(expectedAccuracyDetails.queue),
                    category: String(categoryOption),
                    minimumaccuracy: Number(expectedAccuracyDetails.minimumaccuracy),
                    mode: selectedMode,
                    expectedaccuracyfrom: expectedAccuracyDetails.from,
                    expectedaccuracyto: expectedAccuracyDetails.to,
                    statusmode: selectedStatusMode,
                    percentage: expectedAccuracyDetails.percentage,
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });
                await fetchEmployee();
                setSelectedMode("Please Select Mode")
                setSelectedStatusMode("Please Select Status Mode")
                setExpectedAccuracyDetails({
                    ...expectedAccuracyDetails,
                    from: "", to: "", percentage: "",
                    category: "",
                })


                setIsBtn(false)
                setPopupContent("Added Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
            } catch (err) {
                setIsBtn(false)
                if (err.response?.data?.message === "This Data Already Exist!") {
                    setPopupContentMalert("Data Already Exists!");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                } else {
                    handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
                }
            }
        }

    };


    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();

        if (expectedAccuracyDetails.project === 'Please Select Project') {

            setPopupContentMalert("Please Select Project");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (expectedAccuracyDetails.queue === "Please Select Queue") {

            setPopupContentMalert("Please Select Queue");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (selectedMode === "Please Select Mode" || selectedMode === "") {

            setPopupContentMalert("Please Select Mode");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedMode === "Please Select Mode" || selectedMode === "") {

            setPopupContentMalert("Please Select Mode");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (expectedAccuracyDetails.from === "") {

            setPopupContentMalert("Please Enter Expected Accuracy From %");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (expectedAccuracyDetails.to === "") {

            setPopupContentMalert("Please Enter Expected Accuracy To %");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if ((Number(expectedAccuracyDetails.from) >= Number(expectedAccuracyDetails.to))) {

            setPopupContentMalert("Please Check the Expected Accuracy Values");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedStatusMode === "Please Select Status Mode" || selectedStatusMode === "") {

            setPopupContentMalert("Please Select Status Mode");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (expectedAccuracyDetails.percentage === "" || expectedAccuracyDetails.percentage === undefined) {

            setPopupContentMalert("Please Enter the Percentage value");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    };

    const handleclear = (e) => {
        e.preventDefault();
        setQueueOption([])
        setSelectedMode("Please Select Mode")
        setSelectedStatusMode("Please Select Status Mode")
        setExpectedAccuracyDetails({
            from: "", to: "", percentage: "", project: "Please Select Project", queue: "Please Select Queue",
            category: "", minimumaccuracy: ""
        })
        setCategoryOption("");

        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();

    };
    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
        setErrorEdit("")
    };
    //get single row to edit....
    const getCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.EXPECTEDACCURACY_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAccuracyMasterEdit(res?.data?.sexpectedaccuracy);
            fetchQueueDropdownsEdit(res?.data?.sexpectedaccuracy.project);
            setCategoryOption(res?.data?.sexpectedaccuracy.category);
            setSelectedModeEdit(res?.data?.sexpectedaccuracy.mode)
            setSelectedStatusModeEdit(res?.data?.sexpectedaccuracy.statusmode)
            setExpectedAccuracyDetailsEdit({
                ...res?.data?.sexpectedaccuracy, from: res?.data?.sexpectedaccuracy.expectedaccuracyfrom, to: res?.data?.sexpectedaccuracy.expectedaccuracyto, percentage: res?.data?.sexpectedaccuracy.percentage,
                project: res?.data?.sexpectedaccuracy.project, queue: res?.data?.sexpectedaccuracy.queue, category: res?.data?.sexpectedaccuracy.category,
            })


            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.EXPECTEDACCURACY_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAccuracyMasterEdit(res?.data?.sexpectedaccuracy);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.EXPECTEDACCURACY_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAccuracyMasterEdit(res?.data?.sexpectedaccuracy);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    //frequency master name updateby edit page...
    let updateby = accuracyMasterEdit.updatedby;
    let addedby = accuracyMasterEdit.addedby;
    let frequencyId = accuracyMasterEdit._id;

    //editing the single data...
    const sendEditRequest = async () => {
        let filteredArray = selectedOptionsSubcategoryEdit.map((data) => {
            return data.value
        })

        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.EXPECTEDACCURACY_SINGLE}/${frequencyId}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                project: String(expectedAccuracyDetailsEdit.project),
                queue: String(expectedAccuracyDetailsEdit.queue),
                minimumaccuracy: Number(expectedAccuracyDetailsEdit.minimumaccuracy),
                category: String(categoryOption),
                expectedaccuracyfrom: expectedAccuracyDetailsEdit.from,
                expectedaccuracyto: expectedAccuracyDetailsEdit.to,
                percentage: expectedAccuracyDetailsEdit.percentage,
                mode: selectedModeEdit,
                statusmode: selectedStatusModeEdit,
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchEmployee();
            // await fetchProcessQueueAll();
            handleCloseModEdit();

            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();

        } catch (err) {
            setIsBtn(false)
            if (err.response?.data?.message === "This Data Already Exist!") {
                setPopupContentMalert("Data Already Exists!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            }
        }
    };


    const editSubmit = (e) => {
        e.preventDefault();
        if (expectedAccuracyDetailsEdit.project === 'Please Select Project') {

            setPopupContentMalert("Please Select Project");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (expectedAccuracyDetailsEdit.queue === "Please Select Queue") {

            setPopupContentMalert("Please Select Queue");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (selectedModeEdit === "Please Select Mode" || selectedModeEdit === "") {

            setPopupContentMalert("Please Select Mode");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (expectedAccuracyDetailsEdit.from === "") {

            setPopupContentMalert("Please Enter Expected Accuracy From %");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (expectedAccuracyDetailsEdit.to === "") {

            setPopupContentMalert("Please Enter Expected Accuracy To %");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if ((Number(expectedAccuracyDetailsEdit.from) >= Number(expectedAccuracyDetailsEdit.to))) {

            setPopupContentMalert("Please Check the Expected Accuracy Values");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedStatusModeEdit === "Please Select Status Mode" || selectedStatusModeEdit === "") {

            setPopupContentMalert("Please Select Status Mode");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (expectedAccuracyDetailsEdit.percentage === "" || expectedAccuracyDetailsEdit.percentage === undefined) {

            setPopupContentMalert("Please Enter the Percentage value");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    };
    const delAreagrpcheckbox = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.EXPECTEDACCURACY_SINGLE}/${item}`, {
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
            setIsHandleChange(false);

            await fetchEmployee();


            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };



    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Expected Accuracy.png");
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
        documentTitle: "Expected Accuracy",
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
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );
    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox",
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            headerCheckboxSelection: true,
            checkboxSelection: true,
            sortable: false, // Optionally, you can make this column not sortable
            width: 75,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 75,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "project",
            headerName: "Project",
            flex: 0,
            width: 200,
            hide: !columnVisibility.project,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "queue",
            headerName: "Queue",
            flex: 0,
            width: 200,
            hide: !columnVisibility.queue,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "minimumaccuracy",
            headerName: "Minimum Accuracy",
            flex: 0,
            width: 200,
            hide: !columnVisibility.minimumaccuracy,
            headerClassName: "bold-header",
        },
        {
            field: "category",
            headerName: "Category",
            flex: 0,
            width: 200,
            hide: !columnVisibility.category,
            headerClassName: "bold-header",
        },

        {
            field: "mode",
            headerName: "Mode",
            flex: 0,
            width: 100,
            hide: !columnVisibility.mode,
            headerClassName: "bold-header",
        },
        {
            field: "expectedaccuracyfrom",
            headerName: "Expected Accuracy",
            flex: 0,
            width: 150,
            hide: !columnVisibility.expectedaccuracyfrom,
            headerClassName: "bold-header",
        },

        {
            field: "statusmode",
            headerName: "Status Mode",
            flex: 0,
            width: 100,
            hide: !columnVisibility.statusmode,
            headerClassName: "bold-header",

        },
        {
            field: "percentage",
            headerName: "Percentage",
            flex: 0,
            width: 100,
            hide: !columnVisibility.percentage,
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
                    {isUserRoleCompare?.includes("eexpectedaccuracy") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.data.id);
                            }}
                        >
                            <EditOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dexpectedaccuracy") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.data.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vexpectedaccuracy") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iexpectedaccuracy") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getinfoCode(params.data.id);
                            }}
                        >
                            <InfoOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttoninfo} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];



    const rowDataTable = filteredDatas.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            project: item.project,
            queue: item.queue,
            minimumaccuracy: item.minimumaccuracy ,
            category: item.category,
            mode: item.mode,
            expectedaccuracyfrom: item.expectedaccuracyfrom,
            statusmode: item.statusmode,
            percentage: item.percentage

            // code: item.code,
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
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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

    const [fileFormat, setFormat] = useState('')

    return (
        <Box>
            <Headtitle title={"EXPECTED ACCURACY"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Expected Accuracy"
                modulename="Quality"
                submodulename="Accuracy"
                mainpagename="Expected Accuracy"
                subpagename=""
                subsubpagename=""
            />
            <>
                {isUserRoleCompare?.includes("aaccuracymaster") && (
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Add Expected Accuracy</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Project <b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={projectOpt}
                                            styles={colourStyles}
                                            value={{
                                                label: expectedAccuracyDetails.project,
                                                value: expectedAccuracyDetails.project,
                                            }}
                                            onChange={(e) => {

                                                setExpectedAccuracyDetails({
                                                    ...expectedAccuracyDetails,
                                                    project: e.value,
                                                    queue: "Please Select Queue", minimumaccuracy: ""

                                                });
                                                setCategoryOption("")
                                                fetchQueueDropdowns(e);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Queue<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={queueOption}
                                            styles={colourStyles}
                                            value={{
                                                label: expectedAccuracyDetails.queue,
                                                value: expectedAccuracyDetails.queue,
                                            }}
                                            onChange={(e) => {

                                                setExpectedAccuracyDetails({
                                                    ...expectedAccuracyDetails,
                                                    queue: e.value, minimumaccuracy: ""
                                                });
                                                setCategoryOption("")
                                                fetchCategoryDropdownsAll(e)
                                                fetchMinimumaccuracy(e, expectedAccuracyDetails.project);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Minimum Accuracy
                                        </Typography>
                                        <OutlinedInput
                                            readOnly={true}
                                            value={expectedAccuracyDetails.minimumaccuracy}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Category
                                        </Typography>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={5}

                                            value={categoryOption}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Mode<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects options={modeOptions} styles={colourStyles} value={{ label: selectedMode, value: selectedMode }} onChange={(e) => {
                                            setSelectedMode(e.value);
                                        }} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>
                                        Expected Accuracy %<b style={{ color: "red" }}>*</b>
                                    </Typography>

                                    <Grid className="expected-accuracy">
                                        <FormControl fullWidth size="small" >
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                inputProps={{
                                                    min: 0,
                                                    max: 100,
                                                    step: 0.01,
                                                    pattern: "\\d*\\.?\\d{0,2}"
                                                }}
                                                placeholder="Please enter the number 0-100"
                                                value={expectedAccuracyDetails.from}
                                                sx={userStyle.input}
                                                onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    // Check if the new value matches the allowed pattern
                                                    const isValid = /^(\d{0,2}(\.\d{0,2})?|100(\.00?)?)$/.test(newValue);
                                                    if (isValid) {
                                                        setExpectedAccuracyDetails(prev => ({
                                                            ...prev,
                                                            from: newValue
                                                        }));
                                                        if (parseFloat(newValue) >= parseFloat(expectedAccuracyDetails.to)) {
                                                            setError('To value must be greater than From value');
                                                        } else {
                                                            setError('');
                                                        }
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <Typography>
                                            To
                                        </Typography>
                                        <FormControl fullWidth size="small" >
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                inputProps={{
                                                    min: 0,
                                                    max: 100,
                                                    step: 0.01,
                                                    pattern: "\\d*\\.?\\d{0,2}"
                                                }}
                                                placeholder="Please enter the number 0-100"
                                                value={expectedAccuracyDetails.to}
                                                sx={userStyle.input}
                                                onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    // Check if the new value matches the allowed pattern
                                                    const isValid = /^(\d{0,2}(\.\d{0,2})?|100(\.00?)?)$/.test(newValue);
                                                    if (isValid) {
                                                        setExpectedAccuracyDetails(prev => ({
                                                            ...prev,
                                                            to: newValue
                                                        }));
                                                        if (parseFloat(expectedAccuracyDetails.from) >= parseFloat(newValue)) {
                                                            setError('To value must be greater than From value');
                                                        } else {
                                                            setError('');
                                                        }
                                                    }
                                                }}
                                            />
                                        </FormControl>

                                    </Grid>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Status Mode<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects options={statusModeOptions} styles={colourStyles} value={{ label: selectedStatusMode, value: selectedStatusMode }}
                                            onChange={(e) => {
                                                setExpectedAccuracyDetails({
                                                    ...expectedAccuracyDetails,
                                                    percentage: ""
                                                });
                                                setSelectedStatusMode(e.value);
                                            }} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Percentage %<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            inputProps={{
                                                min: -100000,
                                                max: 100000,
                                                step: 0.01,
                                                pattern: "\\d*\\.?\\d{0,2}"
                                            }}
                                            placeholder="Please Enter Percentage"
                                            value={expectedAccuracyDetails.percentage !== '' ? (selectedStatusMode === 'Penalty' ? -expectedAccuracyDetails.percentage : expectedAccuracyDetails.percentage) : ''}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                // Check if the new value matches the allowed pattern
                                                const isValid = /^(-?\d{0,6}(\.\d{0,2})?|1000000(\.00?)?)$/.test(newValue);
                                                if (isValid || newValue === '') {
                                                    setExpectedAccuracyDetails(prev => ({
                                                        ...prev,
                                                        percentage: newValue !== '' ? (selectedStatusMode === 'Penalty' ? -newValue : newValue) : ''
                                                    }));
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            <br />
                            {error && <Typography color="error">{error}</Typography>}
                            <br />
                            <Grid container>
                                <Grid item md={3} xs={12} sm={6}>
                                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isBtn} sx={buttonStyles.buttonsubmit}>
                                        Submit
                                    </Button>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                )}
            </>
            <br /> <br />
            {/* ****** Table Start ****** */}
            {
                isUserRoleCompare?.includes("lexpectedaccuracy") && (
                    <>
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>Expected Accuracy List</Typography>
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
                                            <MenuItem value={totalProjects}>All</MenuItem>
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
                                        {isUserRoleCompare?.includes("excelexpectedaccuracy") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    fetchAccuracyMasterArray()
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvexpectedaccuracy") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    fetchAccuracyMasterArray()
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printexpectedaccuracy") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfexpectedaccuracy") && (
                                            <>
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
                                                        fetchAccuracyMasterArray()
                                                    }}
                                                >
                                                    <FaFilePdf />
                                                    &ensp;Export to PDF&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imageexpectedaccuracy") && (
                                            <>
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={handleCaptureImage}
                                                >
                                                    {" "}
                                                    <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTable}
                                        setItems={setItems}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPage}
                                        maindatas={overallFilterdata}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        paginated={true}
                                        totalDatas={overallFilterdata}
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
                            {isUserRoleCompare?.includes("bdexpectedaccuracy") && (
                                <>
                                    <Button variant="contained" color="error" onClick={handleClickOpenalert} sx={buttonStyles.buttonbulkdelete}>
                                        Bulk Delete
                                    </Button>
                                </>
                            )}
                            <br />
                            <br />
                            {!loader ? (
                                <Box sx={userStyle.container}>
                                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                    </Box>
                                </Box>
                            ) : (
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
                                        paginated={true}
                                        filteredDatas={filteredDatas}
                                        totalDatas={totalProjects}
                                        searchQuery={searchQuery}
                                        handleShowAllColumns={handleShowAllColumns}
                                        setFilteredRowData={setFilteredRowData}
                                        filteredRowData={filteredRowData}
                                        setFilteredChanges={setFilteredChanges}
                                        filteredChanges={filteredChanges}
                                        gridRefTableImg={gridRefTableImg}
                                        itemsList={overallFilterdata}
                                    />

                                </>
                            )}
                            {/* ****** Table End ****** */}
                        </Box>
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
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md">
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Expected Accuracy</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Project</Typography>
                                    <Typography>{accuracyMasterEdit.project}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Queue</Typography>
                                    <Typography>{accuracyMasterEdit.queue}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Minimum Accuracy</Typography>
                                    <Typography>{accuracyMasterEdit.minimumaccuracy + " %"}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Category</Typography>
                                    <Typography>{accuracyMasterEdit.category}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Mode</Typography>
                                    <Typography>{accuracyMasterEdit.mode}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Status Mode</Typography>
                                    <Typography>{accuracyMasterEdit.statusmode}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Expected Accuracy</Typography>
                                    <Typography>{`${accuracyMasterEdit.expectedaccuracyfrom}-${accuracyMasterEdit.expectedaccuracyto} %`}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Percentage</Typography>
                                    <Typography>{accuracyMasterEdit.percentage + " %"}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview} sx={buttonStyles.btncancel}>
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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

            {/* Edit DIALOG */}
            <Box>
                <Dialog open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    fullWidth={true}
                    sx={{
                        overflow: 'scroll',
                        '& .MuiPaper-root': {
                            overflow: 'scroll',
                        },
                        marginTop: "80px"
                    }}

                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>Edit Expected Accuracy</Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>

                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Projcet<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={projectOptEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: expectedAccuracyDetailsEdit.project,
                                                value: expectedAccuracyDetailsEdit.project,
                                            }}
                                            onChange={(e) => {

                                                setExpectedAccuracyDetailsEdit({
                                                    ...expectedAccuracyDetailsEdit,
                                                    project: e.value,
                                                    queue: "Please Select Queue", minimumaccuracy: ""
                                                });
                                                setCategoryOption("")
                                                fetchQueueDropdownsEdit(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Queue<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={queueOptionEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: expectedAccuracyDetailsEdit.queue,
                                                value: expectedAccuracyDetailsEdit.queue,
                                            }}
                                            onChange={(e) => {

                                                fetchMinimumaccuracyEdit(e, expectedAccuracyDetailsEdit.project)

                                                setExpectedAccuracyDetailsEdit({
                                                    ...expectedAccuracyDetailsEdit,
                                                    queue: e.value, minimumaccuracy: ""
                                                });
                                                setCategoryOption("")
                                                fetchCategoryDropdownsAll(e)
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Minimum Accuracy
                                        </Typography>
                                        <OutlinedInput
                                            readOnly={true}
                                            value={expectedAccuracyDetailsEdit.minimumaccuracy}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Category
                                        </Typography>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={5}
                                            value={categoryOption}
                                            // value={categoryOption}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Mode<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects options={modeOptions} styles={colourStyles} value={{ label: selectedModeEdit, value: selectedModeEdit }} onChange={(e) => {
                                            setSelectedModeEdit(e.value);

                                        }} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <Typography>
                                        Expected Accuracy %<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Grid className="expected-accuracy">
                                        <FormControl fullWidth size="small" >
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                inputProps={{
                                                    min: 0,
                                                    max: 100,
                                                    step: 0.01,
                                                    pattern: "\\d*\\.?\\d{0,2}"
                                                }}
                                                placeholder="Please enter the number 0-100"
                                                value={expectedAccuracyDetailsEdit.from}
                                                sx={userStyle.input}
                                                onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    // Check if the new value matches the allowed pattern
                                                    const isValid = /^(-?\d{0,6}(\.\d{0,2})?|1000000(\.00?)?)$/.test(newValue);
                                                    if (isValid) {
                                                        setExpectedAccuracyDetailsEdit(prev => ({
                                                            ...prev,
                                                            from: newValue
                                                        }));
                                                        if (parseFloat(newValue) >= parseFloat(expectedAccuracyDetailsEdit.to)) {
                                                            setErrorEdit('To value must be greater than From value');
                                                        } else {
                                                            setErrorEdit('');
                                                        }
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <Typography>
                                            To
                                        </Typography>
                                        <FormControl fullWidth size="small" >
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                inputProps={{
                                                    min: 0,
                                                    max: 100,
                                                    step: 0.01,
                                                    pattern: "\\d*\\.?\\d{0,2}"
                                                }}
                                                placeholder="Please enter the number 0-100"
                                                value={expectedAccuracyDetailsEdit.to}
                                                sx={userStyle.input}
                                                onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    // Check if the new value matches the allowed pattern
                                                    const isValid = /^(\d{0,2}(\.\d{0,2})?|100(\.00?)?)$/.test(newValue);
                                                    if (isValid) {
                                                        setExpectedAccuracyDetailsEdit(prev => ({
                                                            ...prev,
                                                            to: newValue
                                                        }));
                                                        if (parseFloat(expectedAccuracyDetailsEdit.from) >= parseFloat(newValue)) {
                                                            setErrorEdit('To value must be greater than From value');
                                                        } else {
                                                            setErrorEdit('');
                                                        }
                                                    }
                                                }}
                                            />
                                        </FormControl>

                                    </Grid>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Status Mode<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects options={statusModeOptions} styles={colourStyles} value={{ label: selectedStatusModeEdit, value: selectedStatusModeEdit }} onChange={(e) => {
                                            setExpectedAccuracyDetailsEdit({
                                                ...expectedAccuracyDetailsEdit,
                                                percentage: ""
                                            });
                                            setSelectedStatusModeEdit(e.value);
                                        }} />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Percentage %<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            inputProps={{
                                                min: -100000,
                                                max: 100000,
                                                step: 0.01,
                                                pattern: "\\d*\\.?\\d{0,2}"
                                            }}
                                            placeholder="Please Enter Percentage"
                                            value={expectedAccuracyDetailsEdit.percentage !== '' ? (selectedStatusModeEdit === 'Penalty' ? -expectedAccuracyDetailsEdit.percentage : expectedAccuracyDetailsEdit.percentage) : ''}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                // Check if the new value matches the allowed pattern
                                                const isValid = /^(-?\d{0,6}(\.\d{0,2})?|1000000(\.00?)?)$/.test(newValue);
                                                if (isValid || newValue === '') {
                                                    setExpectedAccuracyDetailsEdit((prev) => ({
                                                        ...prev,
                                                        percentage:
                                                            newValue !== ''
                                                                ? selectedStatusModeEdit === 'Penalty'
                                                                    ? -newValue
                                                                    : +newValue  // Convert to a positive number for 'Bonus'
                                                                : ''
                                                    }));
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Grid>


                            </Grid>
                            <br /> <br />
                            {errorEdit && <Typography color="error">{errorEdit}</Typography>}
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained" onClick={editSubmit} sx={buttonStyles.buttonsubmit}>
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
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
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={overallFilterdata ?? []}
                filename={"Expected Accuracy"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Expected Accuracy Info"
                addedby={addedby}
                updateby={updateby}
            />
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delBrand}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delAreagrpcheckbox}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />


        </Box >
    );
}

export default ExpectedAccuray;
