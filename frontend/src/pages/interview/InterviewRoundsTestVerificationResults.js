import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box,
    Button,
    Container,
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
    Paper,
    Popover,
    Select,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TextField,
    Typography,
    OutlinedInput,
    TableCell,
    TableRow
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import AlertDialog from "../../components/Alert";
import {
    PleaseSelectRow
} from "../../components/DeleteConfirmation.js";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import {
    AuthContext,
    UserRoleAccessContext,
} from "../../context/Appcontext";
import { userStyle, colourStyles } from "../../pageStyle.js";
import { SERVICE } from "../../services/Baseservice";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import moment from "moment-timezone";

import { useTable } from "react-table";
function InterviewRoundsTestVerificationResults() {
    const [isLoading, setIsLoading] = useState(false);



    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const gridRefTableImg = useRef(null);

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
        setIsLoading(false);
        setUpdateLoader(false);
        setTableLoader(false);
        setFilterLoader(false);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
        setIsLoading(false);
        setUpdateLoader(false);
        setTableLoader(false);
        setFilterLoader(false);
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
        setIsLoading(false);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
        setIsLoading(false);
    };
    const navigate = useNavigate();

    let exportColumnNames = [

        // "Company",
        // "Branch",
        // "Unit",
        // "Team",
        // "Department",
        "Designation",
        "Round Name",
        "Mode",
        "Employeename",
        "Attended Date/Time",
    ];
    let exportRowValues = [

        // "company",
        // "branch",
        // "unit",
        // "team",
        // "department",
        "designation",
        "round",
        "mode",
        "employeename",

        "completedat",
    ];
    const [roundmasterEdit, setRoundmasterEdit] = useState({});

    const calculateResult = () => {
        const userTakenResults = roundmasterEdit?.interviewForm?.map((data) => {

            if (
                data?.userans?.filter((item) => item !== "")?.length > 0 &&
                data.optionArr?.map((t) => t?.options)?.includes("NOANSWER")
            ) {
                return "Eligible";
            }
            else if (
                data?.type === "Date Range" &&
                data?.userans?.length > 0 &&
                new Date(data?.userans[0]) >= new Date(data?.fromdate) &&
                new Date(data?.userans[0]) <= new Date(data?.todate)
            ) {
                return "Eligible";
            }
            else if (
                data?.type === "Date" &&
                data?.userans?.length > 0 &&
                data?.userans[0] === data?.date
            ) {
                return "Eligible";
            }
            else if (
                data?.type === "Text-Numeric" &&
                data?.userans?.filter((item) => item !== "")?.length > 0 &&
                data?.optionArr?.length > 0
            ) {
                let validations = data?.optionArr[0]?.validation;
                let validationsOptions = data?.optionArr[0]?.options;
                let numericOnly = data?.userans[0];
                if (validations === "Less Than") {
                    if (Number(numericOnly) < Number(validationsOptions)) {
                        return "Eligible";
                    }
                } else if (validations === "Less Than or Equal to") {
                    if (Number(numericOnly) <= Number(validationsOptions)) {
                        return "Eligible";
                    }
                } else if (validations === "Greater Than") {
                    if (Number(numericOnly) > Number(validationsOptions)) {
                        return "Eligible";
                    }
                } else if (validations === "Greater Than or Equal to") {
                    if (Number(numericOnly) >= Number(validationsOptions)) {
                        return "Eligible";
                    }
                } else if (validations === "Equal to") {
                    if (Number(numericOnly) === Number(validationsOptions)) {
                        return "Eligible";
                    }
                } else if (validations === "Between") {
                    if (
                        Number(numericOnly) >=
                        data?.optionArr[0].betweenfrom &&
                        Number(numericOnly) <= data?.optionArr[0].betweento
                    ) {
                        return "Eligible";
                    }
                }

            }
            else if (
                data?.type !== "Date Range" &&
                data?.type !== "Date" &&
                data?.userans?.filter((item) => item !== "")?.length > 0 &&
                data.optionArr
                    ?.filter((item) => data.userans?.includes(item?.options))
                    ?.map((t) => t.status)
                    .filter((item) => item.trim() === "Eligible").length >=
                data.optionArr
                    ?.filter(
                        (item) =>
                            data.userans?.includes(item?.options) &&
                            (item?.status === "Not-Eligible" ||
                                item?.status === "Manual Decision")
                    )
                    ?.map((t) => t.status).length
            ) {
                return "Eligible";
            } else {
                return "Not Eligible";
            }
        });
        const userTakenMarks = userTakenResults?.filter(
            (data) => data === "Eligible"
        )?.length;
        const { eligiblemarks } = roundmasterEdit;

        // Calculate the result based on the comparison type
        let testResults = "Fail";

        if (userTakenMarks >= eligiblemarks) testResults = "Pass";

        return { userTakenMarks, testResults };
    };
    const getNumericEligibility = (data) => {

        if (
            data?.type === "Text-Numeric" &&
            data?.userans?.filter((item) => item !== "")?.length > 0 &&
            data?.optionArr?.length > 0
        ) {
            const validations = data?.optionArr[0]?.validation;
            const validationsOptions = data?.optionArr[0]?.options;
            const numericOnly = data?.userans[0];

            if (validations === "Less Than" && Number(numericOnly) < Number(validationsOptions)) return "Eligible";
            if (validations === "Less Than or Equal to" && Number(numericOnly) <= Number(validationsOptions)) return "Eligible";
            if (validations === "Greater Than" && Number(numericOnly) > Number(validationsOptions)) return "Eligible";
            if (validations === "Greater Than or Equal to" && Number(numericOnly) >= Number(validationsOptions)) return "Eligible";
            if (validations === "Equal to" && Number(numericOnly) === Number(validationsOptions)) return "Eligible";
            if (
                validations === "Between" &&
                Number(numericOnly) >= data?.optionArr[0].betweenfrom &&
                Number(numericOnly) <= data?.optionArr[0].betweento
            ) return "Eligible";
        }
        return null;
    };
    const getNumericEligibilitysub = (data) => {

        if (
            data?.type === "Text-Numeric" &&
            data?.userans?.filter((item) => item !== "")?.length > 0 &&
            data?.optionslist?.length > 0
        ) {
            const validations = data?.optionslist[0]?.validation;
            const validationsOptions = data?.optionslist[0]?.answer;
            const numericOnly = data?.userans[0];

            if (validations === "Less Than" && Number(numericOnly) < Number(validationsOptions)) return "Eligible";
            if (validations === "Less Than or Equal to" && Number(numericOnly) <= Number(validationsOptions)) return "Eligible";
            if (validations === "Greater Than" && Number(numericOnly) > Number(validationsOptions)) return "Eligible";
            if (validations === "Greater Than or Equal to" && Number(numericOnly) >= Number(validationsOptions)) return "Eligible";
            if (validations === "Equal to" && Number(numericOnly) === Number(validationsOptions)) return "Eligible";
            if (
                validations === "Between" &&
                Number(numericOnly) >= data?.optionslist[0].betweenfrom &&
                Number(numericOnly) <= data?.optionslist[0].betweento
            ) return "Eligible";
        }
        return null;
    };

    let { userTakenMarks, testResults } = calculateResult();
    // Convert data URI to Blob
    const dataURItoBlob = (dataURI) => {
        const byteString = atob(dataURI.split(",")[1]);
        const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    };
    const handleViewImageSubEdit = (data) => {
        const blob = dataURItoBlob(data.uploadedimage);
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl);
    };
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteData, setDeleteData] = useState({});
    //Delete model
    const handleClickOpenDelete = () => {
        setIsDeleteOpen(true);
    };
    const handleClickCloseDelete = () => {
        setIsDeleteOpen(false);
    };





    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editDetails, setEditDetails] = useState({});
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const handleClickOpenalert = () => {
        setIsHandleChange(true);
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            handleClickOpencheckbox();

            // overallBulkdelete(selectedRows);
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };


    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };


    // view model
    const [openview, setOpenview] = useState(false);
    const [viewDetails, setViewDetails] = useState({});
    const [infoDetails, setInfoDetails] = useState({});

    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };


    const [openviewTypingtest, setOpenviewTypingtest] = useState(false);
    const handleClickOpenviewTypingtest = () => {
        setOpenviewTypingtest(true);
    };

    const handleCloseviewTypingtest = () => {
        setOpenviewTypingtest(false);

        setChecked(false);
    };
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };






    const [employees, setEmployees] = useState([]);
    const [selectedUserType, setSelectedUserType] = useState("Employee");
    const [searchQuery, setSearchQuery] = useState("");
    const {
        isUserRoleAccess,
        isUserRoleCompare,
        isAssignBranch,
        pageName,
        setPageName,
        buttonStyles,
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
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { auth, setAuth } = useContext(AuthContext);
    const [isBtnFilter, setisBtnFilter] = useState(false);

    const [loader, setLoader] = useState(false);

    let username = isUserRoleAccess.username;

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");



    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "InterviewRoundsTestVerificationResults.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    const [checked, setChecked] = useState(false);

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




    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        actions: true,

        // company: true,
        // branch: true,
        // unit: true,
        // team: true,
        // department: true,
        designation: true,
        employeename: true,

        completedat: true,
        mode: true,
        round: true,

    };

    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
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

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Practice Questions Grouping",
        pageStyle: "print",
    });

    //table entries ..,.
    const [items, setItems] = useState([]);

    const addSerialNumber = (data) => {

        setItems(data);
    };

    useEffect(() => {
        addSerialNumber(employees);
    }, [employees]);

    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);

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
            Object.values(item).join(" ").toLowerCase()?.includes(term)
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

    const viewResponses = async (id, roundmode) => {
        setIsLoading(true);
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.GET_SINGLE_TEST_RESPONSE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let res1 = await axios.get(SERVICE.INTERVIEWQUESTION);

            let singleRound = res?.data?.sTestResponse;

            let cat = singleRound?.category;
            let subcat = singleRound?.subcategory;

            let intQues = res1?.data?.interviewquestions?.filter(
                (data) => data.category === cat && data.subcategory === subcat
            );

            let mainSame;

            mainSame = singleRound?.interviewForm?.map((data) => {
                let foundData = intQues?.find((item) => item?.name == data?.question);
                if (foundData) {
                    let subsame = data?.secondarytodo?.map((data1) => {
                        let foundSubsame = foundData?.subquestions?.find(
                            (item1) => item1?.question == data1?.question
                        );
                        if (foundSubsame) {
                            return {
                                ...data1,
                                uploadedimage: foundSubsame?.uploadedimage || "",
                                uploadedimagename: foundSubsame?.uploadedimagename || "",
                                data: foundSubsame?.files?.[0]?.data || "",
                            };
                        } else {
                            return {
                                ...data1,
                                uploadedimage: "",
                                uploadedimagename: "",
                                data: "",
                            };
                        }
                    });
                    return {
                        ...data,
                        uploadedimage: foundData?.uploadedimage || "",
                        uploadedimagename: foundData?.uploadedimagename || "",
                        data: foundData?.files?.[0]?.data || "",
                        secondarytodo: subsame,
                    };
                } else {
                    return {
                        ...data,
                        uploadedimage: "",
                        uploadedimagename: "",
                        data: "",
                        secondarytodo: (data?.secondarytodo || []).map((subsame) => ({
                            ...subsame,
                            uploadedimage: "",
                            uploadedimagename: "",
                            data: "",
                        })),
                    };
                }
            });
            let mergedData = {
                ...singleRound,
                interviewForm: mainSame,
                totalmarks: singleRound?.totalmarks,
                eligiblemarks: singleRound?.eligiblemarks,
                markcomparison: singleRound?.markcomparison,
                mode: singleRound?.mode,
            };




            setRoundmasterEdit(mergedData);
            setIsLoading(false);

            if (roundmode === "typingtest") {
                handleClickOpenviewTypingtest();
            } else {
                handleClickOpenview();
            }
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const columnDataTable = [

        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 75,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },



        // {
        //     field: "company",
        //     headerName: "Company",
        //     flex: 0,
        //     width: 150,
        //     hide: !columnVisibility.company,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "branch",
        //     headerName: "Branch",
        //     flex: 0,
        //     width: 150,
        //     hide: !columnVisibility.branch,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "unit",
        //     headerName: "Unit",
        //     flex: 0,
        //     width: 150,
        //     hide: !columnVisibility.unit,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "team",
        //     headerName: "Team",
        //     flex: 0,
        //     width: 150,
        //     hide: !columnVisibility.team,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "department",
        //     headerName: "Department",
        //     flex: 0,
        //     width: 150,
        //     hide: !columnVisibility.department,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "designation",
        //     headerName: "Designation",
        //     flex: 0,
        //     width: 150,
        //     hide: !columnVisibility.designation,
        //     headerClassName: "bold-header",
        // },

        {
            field: "designation",
            headerName: "Designation",
            flex: 0,
            width: 200,
            hide: !columnVisibility.designation,
            headerClassName: "bold-header",

        },
        {
            field: "round",
            headerName: "Round",
            flex: 0,
            width: 200,
            hide: !columnVisibility.round,
            headerClassName: "bold-header",

        },
        {
            field: "mode",
            headerName: "Mode",
            flex: 0,
            width: 180,
            hide: !columnVisibility.mode,
            headerClassName: "bold-header",

        },
        {
            field: "employeename",
            headerName: "Employee",
            flex: 0,
            width: 250,
            hide: !columnVisibility.employeename,
            headerClassName: "bold-header",

        },


        // {
        //     field: "category",
        //     headerName: "Category",
        //     flex: 0,
        //     width: 120,
        //     hide: !columnVisibility.category,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "subcategory",
        //     headerName: "Sub Category",
        //     flex: 0,
        //     width: 150,
        //     hide: !columnVisibility.subcategory,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "questions",
        //     headerName: "Questions",
        //     flex: 0,
        //     width: 200,
        //     hide: !columnVisibility.questions,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "speed",
        //     headerName: "Speed in wpm",
        //     flex: 0,
        //     width: 200,
        //     hide: !columnVisibility.speed,
        //     headerClassName: "bold-header",
        //     cellRenderer: (params) => {
        //         const speedStatus = params.data.speedstatus; // Check speed status for the row
        //         const color = speedStatus ? "green" : "red"; // Green if true, red if false

        //         return (
        //             <span style={{ color: color }}>
        //                 {params.value}
        //             </span>
        //         );
        //     },
        // },
        // {
        //     field: "accuracy",
        //     headerName: "Accuracy in %",
        //     flex: 0,
        //     width: 200,
        //     hide: !columnVisibility.accuracy,
        //     headerClassName: "bold-header",
        //     cellRenderer: (params) => {
        //         const accStatus = params.data.accuracystatus; // Check speed status for the row
        //         const color = accStatus ? "green" : "red"; // Green if true, red if false

        //         return (
        //             <span style={{ color: color }}>
        //                 {params.value}
        //             </span>
        //         );
        //     },
        // },
        // {
        //     field: "mistakes",
        //     headerName: "Mistakes",
        //     flex: 0,
        //     width: 200,
        //     hide: !columnVisibility.mistakes,
        //     headerClassName: "bold-header",
        //     cellRenderer: (params) => {
        //         const accStatus = params.data.mistakesstatus; // Check speed status for the row
        //         const color = accStatus ? "green" : "red"; // Green if true, red if false

        //         return (
        //             <span style={{ color: color }}>
        //                 {params.value}
        //             </span>
        //         );
        //     },
        // },
        // {
        //     field: "time",
        //     headerName: "Time (MM:SS)",
        //     flex: 0,
        //     width: 200,
        //     hide: !columnVisibility.time,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "status",
        //     headerName: "Status",
        //     flex: 0,
        //     width: 150,
        //     hide: !columnVisibility.status,
        //     headerClassName: "bold-header",
        //     cellRenderer: (params) => {
        //         const accStatus = params.data.individualresult; // Check speed status for the row
        //         const color = accStatus ? "green" : "red"; // Green if true, red if false

        //         return (
        //             <span style={{ color: color }}>
        //                 {params.value}
        //             </span>
        //         );
        //     },
        // },
        {
            field: "completedat",
            headerName: "Attended Date/Time",
            flex: 0,
            width: 150,
            hide: !columnVisibility.completedat,
            headerClassName: "bold-header",
        },


        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 100,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },

            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("vinterviewroundstestverificationresults") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                viewResponses(
                                    params?.data?.id,
                                    params?.data?.realmode,
                                );
                            }}
                        // onClick={() => {



                        //     setViewDetails(params?.data);
                        //     handleClickOpenview();
                        // }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}

                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData?.map((item, index) => {
        return {

            serialNumber: item?.serialNumber,
            id: item?.id,
            // company: item?.company,
            // branch: item?.branch,
            // unit: item?.unit,
            // team: item?.team,
            // department: item?.department,
            designation: item?.designation,
            employeename: item?.employeename,
            completedat: item?.completedat,
            mode: item?.mode,
            realmode: item?.realmode,
            round: item?.round,

        };
    });
    const rowsWithCheckboxes = rowDataTable?.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows?.includes(row.id),
    }));

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        setColumnVisibility(initialColumnVisibility);
    };

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTable?.filter((column) =>
        column.headerName.toLowerCase()?.includes(searchQueryManage.toLowerCase())
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
                    {filteredColumns?.map((column) => (
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
                                columnDataTable?.forEach((column) => {
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

    //add function

    //overall edit popup
    const [openOverAllEditPopup, setOpenOverAllEditPopup] = useState(false);
    const handleOpenOverallEditPopup = () => {
        setOpenOverAllEditPopup(true);
    };
    const handleCloseOverallEditPopup = () => {
        setOpenOverAllEditPopup(false);
    };
    const [updateLoader, setUpdateLoader] = useState(false);






    const daysoptions = [
        { label: "Yesterday", value: "Yesterday" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Today", value: "Today" },
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "Custom Fields", value: "Custom Fields" },
    ]

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const [filterUser, setFilterUser] = useState({
        day: "Today",
        fromtime: '00:00',
        totime: '23:59',
        fromdate: moment().format('YYYY-MM-DD'),
        todate: moment().format('YYYY-MM-DD'),
    });

    const handleChangeFilterDate = (e) => {
        let fromDate = '';
        let toDate = moment().format('YYYY-MM-DD');
        switch (e.value) {
            case 'Today':
                setFilterUser((prev) => ({ ...prev, fromdate: toDate, todate: toDate, day: e.value }))
                break;
            case 'Yesterday':
                fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                toDate = fromDate; // Yesterday’s date
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate, day: e.value }))
                break;

            case 'Last Week':
                fromDate = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
                toDate = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate, day: e.value }))
                break;

            case 'This Week':
                fromDate = moment().startOf('week').format('YYYY-MM-DD');
                toDate = moment().endOf('week').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate, day: e.value }))
                break;

            case 'Last Month':
                fromDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
                toDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate, day: e.value }))
                break;

            case 'This Month':
                fromDate = moment().startOf('month').format('YYYY-MM-DD');
                toDate = moment().endOf('month').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate, day: e.value }))
                break;

            case 'Custom Fields':
                setFilterUser((prev) => ({ ...prev, fromdate: "", todate: "", day: e.value }))
                break;
            default:
                return;
        }
    }











    const [filterLoader, setFilterLoader] = useState(false);
    const [tableLoader, setTableLoader] = useState(false);


    // useEffect(() => { fetchReturnData() }, [])

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
            pagename: String("Interview Rounds Test Verification Results"),
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

    //FILTER START
    // useEffect(() => {
    //     fetchDepartments();
    //     getPracticeQuestions();
    // }, []);

    const [designation, setDesignation] = useState([]);
    const [roundOrder, setRoundOrder] = useState([]);

    useEffect(() => {
        fetchDesignation();
        fetchInterviewOrders();
    }, []);

    const fetchInterviewOrders = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.get(SERVICE.INTERVIEWROUNDORDER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setRoundOrder(res?.data?.interviewroundorders);
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const fetchDesignation = async () => {
        setPageName(!pageName);
        try {
            let res_category = await axios.get(SERVICE.DESIGNATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const categoryall = [
                ...res_category?.data?.designation?.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                })),
            ];

            setDesignation(categoryall);
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };
    const [practiceQuestions, setPracticeQuestions] = useState([])
    const getPracticeQuestions = async () => {
        setPageName(!pageName);
        try {
            let response = await axios.get(`${SERVICE.ALL_TYPING_PRACTICE_QUESTIONS}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let questions = response.data.allPracticeQuestions
            setPracticeQuestions(questions)
            return questions?.length > 0 ? questions : [];
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };
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

    const TypeOptions = [
        { label: "Individual", value: "Individual" },
        { label: "Company", value: "Company" },
        { label: "Branch", value: "Branch" },
        { label: "Unit", value: "Unit" },
        { label: "Team", value: "Team" },
        { label: "Department", value: "Department" },
    ];

    //MULTISELECT ONCHANGE START


    //designation multiselect
    const [selectedOptionsDesignation, setSelectedOptionsDesignation] = useState([]);
    let [valueDesignationCat, setValueDesignationCat] = useState([]);

    const handleDesignationChange = (options) => {
        setValueDesignationCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDesignation(options);
        setValueRoundsCat([]);
        setSelectedOptionsRounds([]);

    };

    const customValueRendererDesignation = (valueDesignationCat, _categoryname) => {
        return valueDesignationCat?.length
            ? valueDesignationCat.map(({ label }) => label)?.join(", ")
            : "Please Select Designation";
    };
    //rounds multiselect
    const [selectedOptionsRounds, setSelectedOptionsRounds] = useState([]);
    let [valueRoundsCat, setValueRoundsCat] = useState([]);

    const handleRoundsChange = (options) => {
        setValueRoundsCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsRounds(options);

    };

    const customValueRendererRounds = (valueRoundsCat, _categoryname) => {
        return valueRoundsCat?.length
            ? valueRoundsCat.map(({ label }) => label)?.join(", ")
            : "Please Select Rounds";
    };
    //round mode multiselect
    const [selectedOptionsMode, setSelectedOptionsMode] = useState([]);
    let [valueModeCat, setValueModeCat] = useState([]);

    const handleModeChange = (options) => {
        setValueModeCat(
            options.map((a, index) => {
                return a.originalvalue;
            })
        );
        setSelectedOptionsMode(options);

    };

    const customValueRendererMode = (valueModeCat, _categoryname) => {
        return valueModeCat?.length
            ? valueModeCat.map(({ label }) => label)?.join(", ")
            : "Please Select Mode";
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
    //category multiselect
    const [selectedOptionsCategory, setSelectedOptionsCategory] = useState([]);
    let [valueCategoryCat, setValueCategoryCat] = useState([]);

    const handleCategoryChange = (options) => {
        setValueCategoryCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCategory(options);
        setSelectedOptionsSubCategory([])
        setValueSubCategoryCat([])
        setSelectedOptionsQuestions([])
        setValueQuestionsCat([])
    };

    const customValueRendererCategory = (valueCategoryCat, _categoryname) => {
        return valueCategoryCat?.length
            ? valueCategoryCat.map(({ label }) => label)?.join(", ")
            : "Please Select Category";
    };
    //sub category multiselect
    const [selectedOptionsSubCategory, setSelectedOptionsSubCategory] = useState([]);
    let [valueSubCategoryCat, setValueSubCategoryCat] = useState([]);

    const handleSubCategoryChange = (options) => {
        setValueSubCategoryCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsSubCategory(options);
        setSelectedOptionsQuestions([])
        setValueQuestionsCat([])
    };

    const customValueRendererSubCategory = (valueSubCategoryCat, _Subcategoryname) => {
        return valueSubCategoryCat?.length
            ? valueSubCategoryCat.map(({ label }) => label)?.join(", ")
            : "Please Select Sub Category";
    };

    //status multiselect
    const [selectedOptionsQuestions, setSelectedOptionsQuestions] = useState([]);
    let [valueQuestionsCat, setValueQuestionsCat] = useState([]);

    const handleQuestionsChange = (options) => {
        setValueQuestionsCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsQuestions(options);
    };

    const customValueRendererQuestions = (valueSubCategoryCat, _Subcategoryname) => {
        return valueSubCategoryCat?.length
            ? valueSubCategoryCat.map(({ label }) => label)?.join(", ")
            : "Please Select Questions";
    };

    //status multiselect
    const [selectedOptionsStatus, setSelectedOptionsStatus] = useState([]);
    let [valueStatusCat, setValueStatusCat] = useState([]);

    const handleStatusChange = (options) => {
        setValueStatusCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsStatus(options);
    };

    const customValueRendererStatus = (valueSubCategoryCat, _Subcategoryname) => {
        return valueSubCategoryCat?.length
            ? valueSubCategoryCat.map(({ label }) => label)?.join(", ")
            : "Please Select Status";
    };

    //MULTISELECT ONCHANGE END
    const handleClearFilter = () => {
        setFilterUser({
            day: "Today",
            fromtime: '00:00',
            totime: '23:59',
            fromdate: moment().format('YYYY-MM-DD'),
            todate: moment().format('YYYY-MM-DD'),
        });
        setValueDesignationCat([]);
        setSelectedOptionsDesignation([]);
        setValueRoundsCat([]);
        setSelectedOptionsRounds([]);
        setValueModeCat([]);
        setSelectedOptionsMode([]);



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

        setValueCategoryCat([]);
        setSelectedOptionsCategory([]);
        setSelectedOptionsSubCategory([])
        setValueSubCategoryCat([])
        setSelectedOptionsStatus([])
        setValueStatusCat([])
        setSelectedOptionsQuestions([])
        setValueQuestionsCat([])

        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const handleFilter = () => {
        // if (
        //     filterState?.type === "Please Select Type" ||
        //     filterState?.type === ""
        // ) {
        //     setPopupContentMalert("Please Select Type!");
        //     setPopupSeverityMalert("warning");
        //     handleClickOpenPopupMalert();
        // } 
        if (selectedOptionsDesignation?.length === 0) {
            setPopupContentMalert("Please Select Designation!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        // else if (
        //     ["Individual", "Branch", "Unit", "Team"]?.includes(filterState?.type) &&
        //     selectedOptionsBranch?.length === 0
        // ) {
        //     setPopupContentMalert("Please Select Branch!");
        //     setPopupSeverityMalert("warning");
        //     handleClickOpenPopupMalert();
        // } else if (
        //     ["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
        //     selectedOptionsUnit?.length === 0
        // ) {
        //     setPopupContentMalert("Please Select Unit!");
        //     setPopupSeverityMalert("warning");
        //     handleClickOpenPopupMalert();
        // } else if (
        //     ["Individual", "Team"]?.includes(filterState?.type) &&
        //     selectedOptionsTeam?.length === 0
        // ) {
        //     setPopupContentMalert("Please Select Team!");
        //     setPopupSeverityMalert("warning");
        //     handleClickOpenPopupMalert();
        // } else if (
        //     filterState?.type === "Individual" &&
        //     selectedOptionsEmployee?.length === 0
        // ) {
        //     setPopupContentMalert("Please Select Employee!");
        //     setPopupSeverityMalert("warning");
        //     handleClickOpenPopupMalert();
        // } else if (
        //     filterState?.type === "Department" &&
        //     selectedOptionsDepartment?.length === 0
        // ) {
        //     setPopupContentMalert("Please Select Department!");
        //     setPopupSeverityMalert("warning");
        //     handleClickOpenPopupMalert();
        // }

        else if (
            filterUser?.fromdate === "" ||
            !filterUser?.fromdate
        ) {
            setPopupContentMalert("Please Select From Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            filterUser?.todate === "" ||
            !filterUser?.todate
        ) {
            setPopupContentMalert("Please Select To Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (
            filterUser?.fromtime === "" ||
            !filterUser?.fromtime
        ) {
            setPopupContentMalert("Please Select From Time!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (
            filterUser?.totime === "" ||
            !filterUser?.totime
        ) {
            setPopupContentMalert("Please Select To Time!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            fetchReturnData();
        }
    };


    const fetchReturnData = async () => {
        setPageName(!pageName);
        setLoader(true);
        setisBtnFilter(true);
        setFilterLoader(true);
        setTableLoader(true);
        try {

            // ...(filterUser?.fromdate && filterUser?.day !== "" && filterUser?.todate
            //     ? [
            //         {
            //             $expr: {
            //                 $and: [
            //                     {
            //                         $gte: [
            //                             {
            //                                 $dateToString: {
            //                                     format: "%Y-%m-%d", // Extract YYYY-MM-DD
            //                                     date: "$createdAt",
            //                                 },
            //                             },
            //                             filterUser?.fromdate, // Ensure this is in "YYYY-MM-DD" format
            //                         ],
            //                     },
            //                     {
            //                         $lte: [
            //                             {
            //                                 $dateToString: {
            //                                     format: "%Y-%m-%d",
            //                                     date: "$createdAt",
            //                                 },
            //                             },
            //                             filterUser?.todate, // Ensure this is in "YYYY-MM-DD" format
            //                         ],
            //                     },
            //                 ],
            //             },
            //         },
            //     ]
            //     : []),

            // ...(filterUser?.fromtime && filterUser?.day !== "" && filterUser?.totime
            //     ? [
            //         {
            //             $expr: {
            //                 $and: [
            //                     {
            //                         $gte: [
            //                             {
            //                                 $add: [
            //                                     { $multiply: [{ $hour: "$createdAt" }, 60] }, // Convert hours to minutes
            //                                     { $minute: "$createdAt" }, // Add minutes
            //                                 ],
            //                             },
            //                             {
            //                                 $add: [
            //                                     {
            //                                         $multiply: [
            //                                             { $toInt: { $substr: [filterUser?.fromtime, 0, 2] } }, // Extract hour from "HH:mm"
            //                                             60,
            //                                         ],
            //                                     },
            //                                     { $toInt: { $substr: [filterUser?.fromtime, 3, 2] } }, // Extract minutes
            //                                 ],
            //                             },
            //                         ],
            //                     },
            //                     {
            //                         $lte: [
            //                             {
            //                                 $add: [
            //                                     { $multiply: [{ $hour: "$createdAt" }, 60] }, // Convert hours to minutes
            //                                     { $minute: "$createdAt" }, // Add minutes
            //                                 ],
            //                             },
            //                             {
            //                                 $add: [
            //                                     {
            //                                         $multiply: [
            //                                             { $toInt: { $substr: [filterUser?.totime, 0, 2] } }, // Extract hour from "HH:mm"
            //                                             60,
            //                                         ],
            //                                     },
            //                                     { $toInt: { $substr: [filterUser?.totime, 3, 2] } }, // Extract minutes
            //                                 ],
            //                             },
            //                         ],
            //                     },
            //                 ],
            //             },
            //         },
            //     ]
            //     : []),
            const pipeline = [
                // Now apply filtering conditions AFTER unwind
                {
                    $match: {
                        ...(valueDesignationCat.length > 0 && { "designation": { $in: valueDesignationCat } }),
                        ...(valueRoundsCat.length > 0 && { "round": { $in: valueRoundsCat } }),
                        ...(valueModeCat.length > 0 && { "mode": { $in: valueModeCat } }),
                        // Date filtering condition
                        // ...(filterUser?.fromdate && filterUser?.day !== "" && filterUser?.todate && {
                        //     $expr: {
                        //         $and: [
                        //             {
                        //                 $gte: [
                        //                     {
                        //                         $dateToString: {
                        //                             format: "%Y-%m-%d", // Format to "YYYY-MM-DD"
                        //                             date: "$createdAt"
                        //                         }
                        //                     },
                        //                     filterUser.fromdate // Ensure this is in "YYYY-MM-DD" format
                        //                 ]
                        //             },
                        //             {
                        //                 $lte: [
                        //                     {
                        //                         $dateToString: {
                        //                             format: "%Y-%m-%d",
                        //                             date: "$createdAt"
                        //                         }
                        //                     },
                        //                     filterUser.todate // Ensure this is in "YYYY-MM-DD" format
                        //                 ]
                        //             }
                        //         ]
                        //     }
                        // })


                        date: {
                            $gte: filterUser?.fromdate,
                            $lte: filterUser?.todate,
                        },
                        $expr: {
                            $and: [
                                {
                                    $gte: [
                                        { $substr: ["$time", 0, 5] }, // Extract "HH:mm" from time field
                                        filterUser?.fromtime,
                                    ],
                                },
                                {
                                    $lte: [
                                        { $substr: ["$time", 0, 5] }, // Extract "HH:mm" from time field
                                        filterUser?.totime,
                                    ],
                                },
                            ],
                        },



                    }
                }
            ];



            let response = await axios.post(
                SERVICE.DYNAMIC_TEST_RESPONSE,
                {
                    pipeline
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            console.log(response?.data?.interviewquestions, "response?.data?.interviewquestions")

            const itemsWithSerialNumber = response?.data?.interviewquestions?.map((item, index) => {




                return {
                    ...item,
                    serialNumber: index + 1,
                    id: item._id,
                    completedat: moment(item.createdAt).format("DD-MM-YYYY hh:mm:ss A"),
                    realmode: item?.mode,
                    mode: item?.mode === "onlineorinterviewtest" ? "Online or Interview Test"
                        : item?.mode === "typingtest" ? "Typing Test" : item?.mode === "questions" ? "Questions" : item?.mode === "verification" ? "Verification/Administrative" : "N/A"

                };
            });

            setEmployees(itemsWithSerialNumber);

            setisBtnFilter(false);
            setLoader(false);
            setFilterLoader(false);
            setTableLoader(false);
        } catch (err) {
            console.log(err, "err")
            setFilterLoader(false);
            setTableLoader(false);
            setLoader(false);
            setisBtnFilter(false);
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

    // useEffect(() => {
    //     handleAutoSelect();
    // }, [isAssignBranch]);

    //FILTER END



    return (
        <Box>
            <NotificationContainer />
            <Headtitle title={"INTERVIEW ROUNDS TEST VERIFICATION RESULTS"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Interview Rounds Test Verification Results"
                modulename="Interview"
                submodulename="Interview Creation"
                mainpagename="Interview Rounds Test Verification Results"
                subpagename=""
                subsubpagename=""
            />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("linterviewroundstestverificationresults") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Interview Rounds Test Verification Results Filter
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                {/* <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={TypeOptions}
                                            styles={colourStyles}
                                            value={{
                                                label: filterState.type ?? "Please Select Type",
                                                value: filterState.type ?? "Please Select Type",
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
                                                setValueEmployeeCat([]);
                                                setSelectedOptionsEmployee([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid> */}
                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>
                                        Designation<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <FormControl size="small" fullWidth>
                                        <MultiSelect
                                            options={designation}
                                            value={selectedOptionsDesignation}
                                            onChange={(e) => {
                                                handleDesignationChange(e);
                                            }}
                                            valueRenderer={customValueRendererDesignation}
                                            labelledBy="Please Select Designation"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>
                                        Rounds
                                    </Typography>
                                    <FormControl size="small" fullWidth>
                                        <MultiSelect
                                            options={roundOrder
                                                ?.filter((item) => valueDesignationCat?.includes(item?.designation))
                                                ?.flatMap(arr => arr?.round)
                                                ?.map((data) => ({
                                                    label: data,
                                                    value: data,
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
                                            value={selectedOptionsRounds}
                                            onChange={(e) => {
                                                handleRoundsChange(e);
                                            }}
                                            valueRenderer={customValueRendererRounds}
                                            labelledBy="Please Select Rounds"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>
                                        Mode
                                    </Typography>
                                    <FormControl size="small" fullWidth>
                                        <MultiSelect
                                            options={[
                                                {
                                                    label: "Questions",
                                                    value: "Questions",
                                                    originalvalue: "questions",
                                                },
                                                {
                                                    label: "Online or Interview Test",
                                                    value: "Online or Interview Test",
                                                    originalvalue: "onlineorinterviewtest",
                                                },
                                                {
                                                    label: "Typing Test",
                                                    value: "Typing Test",
                                                    originalvalue: "typingtest",
                                                },
                                                {
                                                    label: "Verification/Administrative",
                                                    value: "Verification/Administrative",
                                                    originalvalue: "verification",
                                                },
                                            ]}
                                            value={selectedOptionsMode}
                                            onChange={(e) => {
                                                handleModeChange(e);
                                            }}
                                            valueRenderer={customValueRendererMode}
                                            labelledBy="Please Select Mode"
                                        />
                                    </FormControl>
                                </Grid>
                                {/* <Grid item md={3} xs={12} sm={12}>
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
                                </Grid> */}

                                {/* <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee Status<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={EmployeeStatusOptions}
                        styles={colourStyles}
                        value={{
                          label:
                            filterState.employeestatus ??
                            "Please Select Employee Status",
                          value:
                            filterState.employeestatus ??
                            "Please Select Employee Status",
                        }}
                        onChange={(e) => {
                          setFilterState((prev) => ({
                            ...prev,
                            employeestatus: e.value,
                          }));
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
                        }}
                      />
                    </FormControl>
                  </Grid> */}

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontWeight: "500" }}>
                                            Days
                                        </Typography>
                                        <Selects
                                            options={daysoptions}
                                            // styles={colourStyles}
                                            value={{ label: filterUser.day ? filterUser.day : "Please Select Days", value: filterUser.day ? filterUser.day : "Please Select Days" }}
                                            onChange={(e) => {
                                                handleChangeFilterDate(e);
                                                // setFilterUser((prev) => ({ ...prev, day: e.value }))
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {filterUser.day !== "" && <>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                {" "}
                                                From Date<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="from-date"
                                                type="date"
                                                disabled={filterUser.day !== "Custom Fields"}
                                                value={filterUser.fromdate}
                                                onChange={(e) => {
                                                    const newFromDate = e.target.value;
                                                    setFilterUser((prevState) => ({
                                                        ...prevState,
                                                        fromdate: newFromDate,
                                                        todate: prevState.todate && new Date(prevState.todate) > new Date(newFromDate) ? prevState.todate : ""
                                                    }));
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                To Date<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="to-date"
                                                type="date"
                                                value={filterUser.todate}
                                                disabled={filterUser.day !== "Custom Fields"}
                                                onChange={(e) => {
                                                    const selectedToDate = new Date(e.target.value);
                                                    const selectedFromDate = new Date(filterUser.fromdate);

                                                    if (selectedToDate >= selectedFromDate && selectedToDate >= new Date(selectedFromDate)) {
                                                        setFilterUser({
                                                            ...filterUser,
                                                            todate: e.target.value
                                                        });
                                                    } else {
                                                        setFilterUser({
                                                            ...filterUser,
                                                            todate: "" // Reset to empty string if the condition fails
                                                        });
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={1.5} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                {" "}
                                                From Time<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="from-time"
                                                type="time"
                                                value={filterUser.fromtime}
                                                onChange={(e) => {
                                                    const newFromDate = e.target.value;
                                                    setFilterUser((prevState) => ({
                                                        ...prevState,
                                                        fromtime: newFromDate,
                                                    }));
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1.5} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                {" "}
                                                To Time<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="to-time"
                                                type="time"
                                                value={filterUser.totime}
                                                onChange={(e) => {
                                                    const newFromDate = e.target.value;
                                                    console.log(newFromDate)
                                                    setFilterUser((prevState) => ({
                                                        ...prevState,
                                                        totime: newFromDate,
                                                    }));
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </>}
                                <Grid item md={3} xs={12} sm={6} mt={3}>
                                    <div style={{ display: "flex", gap: "20px" }}>
                                        <LoadingButton
                                            variant="contained"
                                            color="primary"
                                            onClick={handleFilter}
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
                </>
            )} <br />
            {tableLoader ? (
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
                <>
                    {isUserRoleCompare?.includes("linterviewroundstestverificationresults") && (
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography sx={userStyle.SubHeaderText}>
                                            List Interview Rounds Test Verification Results
                                        </Typography>
                                    </Grid>

                                </Grid>
                                <br />
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
                                                "excelinterviewroundstestverificationresults"
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
                                            {isUserRoleCompare?.includes(
                                                "csvinterviewroundstestverificationresults"
                                            ) && (
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
                                                "printinterviewroundstestverificationresults"
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
                                            {isUserRoleCompare?.includes(
                                                "pdfinterviewroundstestverificationresults"
                                            ) && (
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
                                                "imageinterviewroundstestverificationresults"
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
                                    searchQuery={searchQuery}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={employees}
                                />
                            </Box>
                        </>
                    )}
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
                filename={"InterviewRoundsTestVerificationResults"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

            {/* EXTERNAL COMPONENTS -------------- END */}



            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="lg"
                sx={{ marginTop: "50px" }}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Interview Rounds Test Verification Results
                        </Typography>
                        <br />
                        <Grid container spacing={2}>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails.company}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails.branch}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Team</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails.team}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Department</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails.department}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Designation</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails.designation}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Employee</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails.employeename}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Category</Typography>
                                    <Typography>{viewDetails?.category}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub Category</Typography>
                                    <Typography>{viewDetails?.subcategory}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Attended Time</Typography>
                                    <Typography>{viewDetails?.completedat}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Questions</Typography>
                                    {viewDetails?.result?.length > 0 && viewDetails?.result?.map((t, index) => {

                                        return (
                                            <>
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        item
                                                        md={12}
                                                        xs={12}
                                                        sm={12}
                                                        style={{ marginTop: "20px" }}
                                                    >
                                                        <FormControl fullWidth size="small">
                                                            <Typography
                                                                style={{
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    whiteSpace: "nowrap",
                                                                    maxWidth: "100%",
                                                                }}
                                                                title={t.question}
                                                            >
                                                                {index + 1} . {t.question}
                                                            </Typography>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={8} xs={12} sm={12}>
                                                        {/* Table */}
                                                        <Container maxWidth="sm" style={{ marginTop: "20px" }}>
                                                            <TableContainer component={Paper}>
                                                                <Table
                                                                    aria-label="customized table"
                                                                    id="raisetickets"
                                                                // ref={componentRef}
                                                                >
                                                                    <TableHead
                                                                        sx={{ fontWeight: "600", textAlign: "center" }}
                                                                    >
                                                                        <StyledTableRow>
                                                                            <StyledTableCell
                                                                                sx={{
                                                                                    textAlign: "center",
                                                                                    justifyContent: "center",
                                                                                }}
                                                                            >
                                                                                <Box sx={userStyle.tableheadstyle}>
                                                                                    <Box
                                                                                        sx={{
                                                                                            textAlign: "center",
                                                                                            justifyContent: "center",
                                                                                        }}
                                                                                    >
                                                                                        Speed &nbsp; (
                                                                                        <span style={{ fontSize: "12px" }}>
                                                                                            {t?.actualspeed}
                                                                                        </span>
                                                                                        )
                                                                                    </Box>
                                                                                </Box>
                                                                            </StyledTableCell>
                                                                            <StyledTableCell
                                                                                sx={{
                                                                                    textAlign: "center",
                                                                                    justifyContent: "center",
                                                                                }}
                                                                            >
                                                                                <Box sx={userStyle.tableheadstyle}>
                                                                                    <Box
                                                                                        sx={{
                                                                                            textAlign: "center",
                                                                                            justifyContent: "center",
                                                                                        }}
                                                                                    >
                                                                                        Accuracy &nbsp; (
                                                                                        <span style={{ fontSize: "12px" }}>
                                                                                            {t?.actualacuuracy}
                                                                                        </span>
                                                                                        )
                                                                                    </Box>
                                                                                </Box>
                                                                            </StyledTableCell>
                                                                            <StyledTableCell
                                                                                sx={{
                                                                                    textAlign: "center",
                                                                                    justifyContent: "center",
                                                                                }}
                                                                            >
                                                                                <Box sx={userStyle.tableheadstyle}>
                                                                                    <Box
                                                                                        sx={{
                                                                                            textAlign: "center",
                                                                                            justifyContent: "center",
                                                                                        }}
                                                                                    >
                                                                                        Mistakes &nbsp; (
                                                                                        <span style={{ fontSize: "12px" }}>
                                                                                            {t?.actualmistakes}
                                                                                        </span>
                                                                                        )
                                                                                    </Box>
                                                                                </Box>
                                                                            </StyledTableCell>
                                                                            <StyledTableCell
                                                                                sx={{
                                                                                    textAlign: "center",
                                                                                    justifyContent: "center",
                                                                                }}
                                                                            >
                                                                                <Box sx={userStyle.tableheadstyle}>
                                                                                    <Box
                                                                                        sx={{
                                                                                            textAlign: "center",
                                                                                            justifyContent: "center",
                                                                                        }}
                                                                                    >
                                                                                        Time Taken (
                                                                                        <span style={{ fontSize: "12px" }}>
                                                                                            {t?.actualtime}
                                                                                        </span>
                                                                                        )
                                                                                    </Box>
                                                                                </Box>
                                                                            </StyledTableCell>
                                                                            <StyledTableCell
                                                                                sx={{
                                                                                    textAlign: "center",
                                                                                    justifyContent: "center",
                                                                                }}
                                                                            >
                                                                                <Box sx={userStyle.tableheadstyle}>
                                                                                    <Box
                                                                                        sx={{
                                                                                            textAlign: "center",
                                                                                            justifyContent: "center",
                                                                                        }}
                                                                                    >
                                                                                        Status
                                                                                    </Box>
                                                                                </Box>
                                                                            </StyledTableCell>
                                                                        </StyledTableRow>
                                                                    </TableHead>
                                                                    <TableBody align="left">
                                                                        {viewDetails?.result?.length > 0 ? (
                                                                            <StyledTableRow key={index}>
                                                                                <StyledTableCell>
                                                                                    {t?.speed}&nbsp; &nbsp;
                                                                                    {t?.speedstatus ? (
                                                                                        <CheckCircleIcon
                                                                                            color="success"
                                                                                            style={{
                                                                                                fontSize: "15px",
                                                                                                marginTop: "10px",
                                                                                            }}
                                                                                        />
                                                                                    ) : (
                                                                                        <CancelIcon
                                                                                            color="error"
                                                                                            style={{
                                                                                                fontSize: "15px",
                                                                                                marginTop: "7px",
                                                                                            }}
                                                                                        />
                                                                                    )}
                                                                                </StyledTableCell>
                                                                                <StyledTableCell>
                                                                                    {t?.accuracy}&nbsp; &nbsp;
                                                                                    {t?.accuracystatus ? (
                                                                                        <CheckCircleIcon
                                                                                            color="success"
                                                                                            style={{
                                                                                                fontSize: "15px",
                                                                                                marginTop: "7px",
                                                                                            }}
                                                                                        />
                                                                                    ) : (
                                                                                        <CancelIcon
                                                                                            color="error"
                                                                                            style={{
                                                                                                fontSize: "15px",
                                                                                                marginTop: "7px",
                                                                                            }}
                                                                                        />
                                                                                    )}
                                                                                </StyledTableCell>
                                                                                <StyledTableCell>
                                                                                    {t?.mistakes}&nbsp; &nbsp;
                                                                                    {t?.mistakesstatus ? (
                                                                                        <CheckCircleIcon
                                                                                            color="success"
                                                                                            style={{
                                                                                                fontSize: "15px",
                                                                                                marginTop: "7px",
                                                                                            }}
                                                                                        />
                                                                                    ) : (
                                                                                        <CancelIcon
                                                                                            color="error"
                                                                                            style={{
                                                                                                fontSize: "15px",
                                                                                                marginTop: "7px",
                                                                                            }}
                                                                                        />
                                                                                    )}
                                                                                </StyledTableCell>
                                                                                <StyledTableCell>
                                                                                    {t?.timetaken}
                                                                                </StyledTableCell>
                                                                                <StyledTableCell>
                                                                                    {t?.individualresult ? (
                                                                                        <CheckCircleIcon color="success" />
                                                                                    ) : (
                                                                                        <CancelIcon color="error" />
                                                                                    )}
                                                                                </StyledTableCell>
                                                                            </StyledTableRow>
                                                                        ) : (
                                                                            <StyledTableRow>
                                                                                <StyledTableCell
                                                                                    colSpan={12}
                                                                                    sx={{
                                                                                        height: "50px",
                                                                                    }}
                                                                                    align="center"
                                                                                >
                                                                                    No Data Available
                                                                                </StyledTableCell>
                                                                            </StyledTableRow>
                                                                        )}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        </Container>
                                                    </Grid>
                                                </Grid>
                                                <br />
                                            </>
                                        );
                                    })}

                                </FormControl>
                            </Grid>



                        </Grid>
                        <br /> <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCloseview}
                                sx={buttonStyles.btncancel}
                            >
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>




            {/* <LoadingBackdrop open={isLoading} /> */}


            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Practice Session Info"
                addedby={infoDetails?.addedby}
                updateby={infoDetails?.updatedby}
            />





            {/* PLEASE SELECT ANY ROW */}
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />



            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="lg"
                sx={{ marginTop: "50px" }}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Response &nbsp;&nbsp; <b> {roundmasterEdit?.employeename} </b>
                        </Typography>
                        <>
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Typography sx={userStyle.HeaderText}>
                                        {" "}
                                        Main Questions
                                    </Typography>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12}>
                                    <Grid container spacing={2}>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <Typography sx={{ fontWeight: "bold" }}>
                                                Total marks: {roundmasterEdit.totalmarks}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <Typography sx={{ fontWeight: "bold" }}>
                                                Eligible marks: {roundmasterEdit.eligiblemarks}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <Typography sx={{ fontWeight: "bold" }}>
                                                Obtained marks: {userTakenMarks}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <Typography
                                                sx={{
                                                    fontWeight: "bold",
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                Result:
                                                <Box
                                                    sx={{
                                                        ml: 1,
                                                        color: testResults === "Pass" ? "green" : "red",
                                                        display: "flex",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    {testResults === "Pass" ? (
                                                        <CheckCircleIcon />
                                                    ) : (
                                                        <CancelIcon />
                                                    )}
                                                    <Box sx={{ ml: 1 }}>{testResults}</Box>
                                                </Box>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Questions </Typography>
                                    </FormControl>
                                </Grid>

                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">User Ans </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Correct Ans </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={1.5} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">User Ans Status </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Options </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={0.5} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Status </Typography>
                                    </FormControl>
                                </Grid> */}
                            </Grid>
                            <br />
                            <br />
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Questions</TableCell>
                                            <TableCell>User Ans</TableCell>
                                            <TableCell>Correct Ans</TableCell>
                                            <TableCell>User Ans Status</TableCell>
                                            <TableCell>Options</TableCell>
                                            <TableCell>Status</TableCell>
                                            {roundmasterEdit?.interviewForm?.some(item => item?.additionalinformation) && <TableCell>Additional Information</TableCell>}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {roundmasterEdit?.interviewForm?.map((data, index) => (
                                            <TableRow key={index}>
                                                <TableCell>

                                                    <Typography
                                                        style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}
                                                        title={data.question}
                                                    >
                                                        &nbsp;
                                                        {data?.uploadedimage && (
                                                            <IconButton aria-label="view" onClick={() => handleViewImageSubEdit(data)}>
                                                                <VisibilityOutlinedIcon sx={{ color: "#0B7CED" }} />
                                                            </IconButton>
                                                        )}
                                                        &nbsp;{index + 1} . {data.question}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {data?.ignored === "true" ? (
                                                        <Typography color="error">This question is ignored</Typography>
                                                    ) : (
                                                        <Typography>
                                                            {data?.userans?.map((t, i) => `${i + 1 + ". "}` + t).toString()}
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        {data?.type === "Date Range" ? `${data?.fromdate || ""} - ${data?.todate || ""}` : data?.type === "Date" ? data?.date : data?.type === "Text-Numeric" ? data?.optionArr?.[0]?.validation === "Between"
                                                            ? `(Between ${data?.optionArr?.[0]?.betweenfrom || ""} and ${data?.optionArr?.[0]?.betweento || ""})`
                                                            : `(${data?.optionArr?.[0]?.validation || ""} ${data?.optionArr?.[0]?.options})`
                                                            : data.optionArr
                                                                ?.filter((data) => data?.status === "Eligible")
                                                                ?.map((t, i) => `${i + 1 + ". "}` + t?.options)
                                                                .toString()}
                                                    </Typography>
                                                </TableCell>



                                                <TableCell>
                                                    {data?.type === "Date Range" &&
                                                        data?.userans?.length > 0 &&
                                                        new Date(data?.userans[0]) >= new Date(data?.fromdate) &&
                                                        new Date(data?.userans[0]) <= new Date(data?.todate) ? (
                                                        "Eligible"
                                                    ) : data?.type === "Date" &&
                                                        data?.userans?.length > 0 &&
                                                        data?.userans[0] ===
                                                        data?.date ? (
                                                        "Eligible"
                                                    ) : getNumericEligibility(data) === "Eligible" ? (
                                                        "Eligible"
                                                    ) : data.optionArr?.length > 0 && data.optionArr?.some((t) => t?.options === "NOANSWER") && data.userans?.length > 0 &&
                                                        data.userans?.some((item) => item !== "")
                                                        ? "Eligible"
                                                        : (data.optionArr
                                                            ?.filter((item) => data.userans?.includes(item?.options))
                                                            ?.map((t, i) => `${i + 1}. ${t.status}`)
                                                            .join(", ") || "Not-Eligible")}
                                                </TableCell>



                                                <TableCell>
                                                    {data.optionArr?.map((t, i) => `${i + 1}. ${t?.options}`).join(", ")}
                                                </TableCell>
                                                <TableCell>
                                                    {data?.userans?.some((item) => item !== "") && data.optionArr?.length > 0 &&
                                                        data.optionArr?.some((t) => t?.options === "NOANSWER") ? (
                                                        <CheckCircleIcon color="success" />
                                                    ) : data?.type === "Date Range" &&
                                                        data?.userans?.length > 0 &&
                                                        new Date(data?.userans[0]) >= new Date(data?.fromdate) &&
                                                        new Date(data?.userans[0]) <= new Date(data?.todate) ? (
                                                        <CheckCircleIcon color="success" />
                                                    ) : data?.type === "Date" &&
                                                        data?.userans?.length > 0 &&
                                                        data?.userans[0] ===
                                                        data?.date ? (
                                                        <CheckCircleIcon color="success" />
                                                    ) : getNumericEligibility(data) === "Eligible" ? (
                                                        <CheckCircleIcon color="success" />
                                                    ) :
                                                        data?.type !== "Text-Numeric" &&
                                                            data?.type !== "Date Range" &&
                                                            data?.type !== "Date" &&
                                                            data?.userans?.some((item) => item !== "") &&
                                                            data.optionArr
                                                                ?.filter((item) => data.userans?.includes(item?.options))
                                                                ?.map((t) => t.status)
                                                                ?.filter((status) => status.trim() === "Eligible")
                                                                .length >=
                                                            data.optionArr
                                                                ?.filter(
                                                                    (item) =>
                                                                        data.userans?.includes(item?.options) &&
                                                                        (item.status === "Not-Eligible" || item.status === "Manual Decision")
                                                                )
                                                                ?.map((t) => t.status).length ? (
                                                            <CheckCircleIcon color="success" />
                                                        ) : (
                                                            <CancelIcon color="error" />
                                                        )}
                                                </TableCell>

                                                {roundmasterEdit?.interviewForm?.some(item => item?.additionalinformation) && <TableCell>{data?.additionalinformation || ""}</TableCell>}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* {roundmasterEdit?.interviewForm?.map((data, index) => {
                                return (
                                    <>
                                        <Grid container spacing={2}>
                                            <Grid item md={4} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography
                                                        style={{
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                            maxWidth: "100%",
                                                        }}
                                                        title={data.question}
                                                    >

                                                        &nbsp;
                                                        {data?.uploadedimage && (
                                                            <>
                                                                <>
                                                                    <IconButton
                                                                        aria-label="view"
                                                                        onClick={() => {
                                                                            handleViewImageSubEdit(data);
                                                                        }}
                                                                    >
                                                                        <VisibilityOutlinedIcon
                                                                            sx={{ color: "#0B7CED" }}
                                                                        />
                                                                    </IconButton>
                                                                </>
                                                            </>
                                                        )}
                                                        &nbsp;{index + 1} . {data.question}
                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {data?.userans
                                                            ?.map((t, i) => `${i + 1 + ". "}` + t)
                                                            .toString()}
                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {data.optionArr
                                                            ?.filter((data) => data?.status === "Eligible")
                                                            ?.map((t, i) => `${i + 1 + ". "}` + t?.options)
                                                            .toString()}
                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={1.5} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {data.optionArr
                                                            ?.map((t, i) => t?.options)
                                                            ?.includes("NOANSWER") &&
                                                            data?.userans?.filter((item) => item !== "")
                                                                ?.length > 0
                                                            ? "Eligible"
                                                            : data.optionArr
                                                                ?.filter((item) =>
                                                                    data?.userans?.includes(item?.options)
                                                                )
                                                                ?.map((t, i) => `${i + 1 + ". "}` + t.status)
                                                                .toString()}
                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {data.optionArr
                                                            ?.map((t, i) => `${i + 1 + ". "}` + t?.options)
                                                            .toString()}
                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={0.5} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {data?.userans?.filter((item) => item !== "")
                                                            ?.length > 0 &&
                                                            data.optionArr
                                                                ?.map((t) => t?.options)
                                                                ?.includes("NOANSWER") ? (
                                                            <CheckCircleIcon color="success" />
                                                        ) : data?.type === "Date Range" &&
                                                            data?.userans?.length > 0 &&
                                                            new Date(data?.userans[0]) >=
                                                            new Date(data?.optionArr[0]?.options) &&
                                                            new Date(data?.userans[0]) <=
                                                            new Date(data?.optionArr[1]?.options) ? (
                                                            <CheckCircleIcon color="success" />
                                                        ) : data?.type !== "Date Range" &&
                                                            data?.userans?.filter((item) => item !== "")
                                                                ?.length > 0 &&
                                                            data.optionArr
                                                                ?.filter((item) =>
                                                                    data?.userans?.includes(item?.options)
                                                                )
                                                                ?.map((t, i) => t.status)
                                                                .filter((item) => item.trim() === "Eligible")
                                                                .length >=
                                                            data.optionArr
                                                                ?.filter(
                                                                    (item) =>
                                                                        data?.userans?.includes(item?.options) &&
                                                                        (item?.status === "Not-Eligible" ||
                                                                            item?.status === "Manual Decision")
                                                                )
                                                                ?.map((t, i) => t.status).length ? (
                                                            <CheckCircleIcon color="success" />
                                                        ) : (
                                                            <CancelIcon color="error" />
                                                        )}
                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                        <br />
                                    </>
                                );
                            })} */}

                            {/* {roundmasterEdit?.interviewForm?.length > 0 &&
                                roundmasterEdit?.interviewForm?.some(
                                    (form) => form.secondarytodo && form.secondarytodo.length > 0
                                ) && (
                                    <Grid container spacing={2}>
                                        <Grid item md={12} xs={12} sm={12}>
                                            <Typography sx={userStyle.HeaderText}>
                                                {" "}
                                                Sub Questions
                                            </Typography>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Questions </Typography>
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={2} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">User Ans </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={2} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Correct Ans </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={1.5} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">User Ans Status </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={2} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Options </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={0.5} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Status </Typography>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                )}
                            <br />
                            {roundmasterEdit?.interviewForm?.length > 0 &&
                                roundmasterEdit?.interviewForm?.map((data, index) => {
                                    return data?.secondarytodo?.map((item, ind) => (
                                        <>
                                            <Grid container spacing={2}>
                                                <Grid item md={4} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography
                                                            style={{
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                                maxWidth: "100%",
                                                            }}
                                                            title={item.question}
                                                        >
                                                            {item.uploadedimage && (
                                                                <>
                                                                    <>
                                                                        <IconButton
                                                                            aria-label="view"
                                                                            onClick={() => {
                                                                                handleViewImageSubEdit(item);
                                                                            }}
                                                                        >
                                                                            <VisibilityOutlinedIcon
                                                                                sx={{ color: "#0B7CED" }}
                                                                            />
                                                                        </IconButton>
                                                                    </>
                                                                </>
                                                            )}
                                                            &nbsp; {index + 1}.{ind + 1} {item?.question}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={2} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            {item?.userans
                                                                ?.map((t, i) => `${i + 1 + ". "}` + t + " ")
                                                                .toString()}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={2} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            {item?.optionslist
                                                                ?.filter((data) => data?.status === "Eligible")
                                                                ?.map(
                                                                    (t, i) => `${i + 1 + ". "}` + t?.answer + " "
                                                                )
                                                                .toString()}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={1.5} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            {" "}
                                                            {item?.optionslist
                                                                ?.map((t, i) => t?.answer)
                                                                ?.includes("NOANSWER") &&
                                                                item?.userans?.filter((item) => item !== "")
                                                                    ?.length > 0
                                                                ? "Eligible"
                                                                : item?.optionslist
                                                                    ?.filter((data) =>
                                                                        item?.userans?.includes(data?.answer)
                                                                    )
                                                                    ?.map(
                                                                        (t, i) => `${i + 1 + ". "}` + t.status
                                                                    )
                                                                    .toString()}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item md={2} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            {item?.optionslist
                                                                ?.map(
                                                                    (t, i) => `${i + 1 + ". "}` + t?.answer + " "
                                                                )
                                                                .toString()}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item md={0.5} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            {" "}
                                                            {item?.userans?.filter((item) => item !== "")
                                                                ?.length > 0 &&
                                                                item?.optionslist
                                                                    ?.map((t, i) => t?.answer)
                                                                    ?.includes("NOANSWER") ? (
                                                                <CheckCircleIcon color="success" />
                                                            ) : item?.type === "Date Range" &&
                                                                item?.userans?.length > 0 &&
                                                                new Date(item?.userans[0]) >=
                                                                new Date(item?.optionslist[0].answer) &&
                                                                new Date(item?.userans[0]) <=
                                                                new Date(item?.optionslist[1].answer) ? (
                                                                <CheckCircleIcon color="success" />
                                                            ) : item?.type !== "Date Range" &&
                                                                item?.userans?.filter((item) => item !== "")
                                                                    ?.length > 0 &&
                                                                item?.optionslist
                                                                    ?.filter((data) =>
                                                                        item?.userans?.includes(data?.answer)
                                                                    )
                                                                    ?.map((t, i) => t.status)
                                                                    .filter((item) => item.trim() === "Eligible")
                                                                    .length >=
                                                                item.optionslist
                                                                    ?.filter(
                                                                        (data) =>
                                                                            item?.userans?.includes(data?.answer) &&
                                                                            (data?.status === "Not-Eligible" ||
                                                                                data?.status === "Manual Decision")
                                                                    )
                                                                    ?.map((t, i) => t.status).length ? (
                                                                <CheckCircleIcon color="success" />
                                                            ) : (
                                                                <CancelIcon color="error" />
                                                            )}
                                                        </Typography>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                            <br />
                                        </>
                                    ));
                                })} */}

                            {roundmasterEdit?.interviewForm?.length > 0 &&
                                roundmasterEdit?.interviewForm?.some(
                                    (form) => form.secondarytodo && form.secondarytodo.length > 0
                                ) && (
                                    <>
                                        <Typography sx={userStyle.HeaderText}>Sub Questions</Typography>
                                        <TableContainer component={Paper}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Questions</TableCell>
                                                        <TableCell>User Ans</TableCell>
                                                        <TableCell>Correct Ans</TableCell>
                                                        <TableCell>User Ans Status</TableCell>
                                                        <TableCell>Options</TableCell>
                                                        <TableCell>Status</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {roundmasterEdit?.interviewForm?.map((data, index) =>
                                                        data?.secondarytodo?.map((item, ind) => (
                                                            <TableRow key={`${index}-${ind}`}>
                                                                <TableCell>
                                                                    {item.uploadedimage && (
                                                                        <IconButton onClick={() => handleViewImageSubEdit(item)}>
                                                                            <VisibilityOutlinedIcon sx={{ color: "#0B7CED" }} />
                                                                        </IconButton>
                                                                    )}
                                                                    {index + 1}.{ind + 1} {item?.question}
                                                                </TableCell>

                                                                <TableCell>
                                                                    {data?.ignored === "true" ? (
                                                                        <Typography color="error">This question is ignored</Typography>
                                                                    ) : (
                                                                        <Typography>  {item?.userans?.join(", ")}       </Typography>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item?.type === "Text-Numeric" && item?.optionslist?.length > 0 ? item?.optionslist?.[0]?.validation === "Between"
                                                                        ? `(Between ${item?.optionslist?.[0]?.betweenfrom || ""} and ${item?.optionslist?.[0]?.betweento || ""})`
                                                                        : `(${item?.optionslist?.[0]?.validation || ""} ${item?.optionslist?.[0]?.answer})`
                                                                        : item?.optionslist
                                                                            ?.filter((data) => data?.status === "Eligible")
                                                                            ?.map((t) => t?.answer)
                                                                            .join(", ")}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item?.optionslist?.some((t) => t?.answer === "NOANSWER") &&
                                                                        item?.userans?.filter((ans) => ans !== "").length > 0
                                                                        ? "Eligible"
                                                                        : getNumericEligibilitysub(item) === "Eligible" ? (
                                                                            "Eligible"
                                                                        ) : item?.optionslist
                                                                            ?.filter((data) => item?.userans?.includes(data?.answer))
                                                                            ?.map((t) => t.status)
                                                                            .join(", ") || "Not-Eligible"}
                                                                </TableCell>
                                                                <TableCell>{item?.optionslist?.map((t) => t?.answer).join(", ")}</TableCell>
                                                                <TableCell>
                                                                    {item?.userans?.filter((ans) => ans !== "").length > 0 &&
                                                                        item?.optionslist?.some((t) => t?.answer === "NOANSWER") ? (
                                                                        <CheckCircleIcon color="success" />
                                                                    ) : item?.type === "Date Range" &&
                                                                        item?.userans?.length > 0 &&
                                                                        new Date(item?.userans[0]) >= new Date(item?.optionslist[0].answer) &&
                                                                        new Date(item?.userans[0]) <= new Date(item?.optionslist[1].answer) ? (
                                                                        <CheckCircleIcon color="success" />
                                                                    ) : getNumericEligibilitysub(item) === "Eligible" ? (
                                                                        <CheckCircleIcon color="success" />
                                                                    ) :
                                                                        item?.type !== "Text-Numeric" &&
                                                                            item?.type !== "Date Range" &&
                                                                            item?.type !== "Date" &&
                                                                            item?.userans?.filter((ans) => ans !== "").length > 0 &&
                                                                            item?.optionslist?.filter((data) => item?.userans?.includes(data?.answer))
                                                                                .map((t) => t.status)
                                                                                .filter((status) => status.trim() === "Eligible").length >=
                                                                            item?.optionslist?.filter(
                                                                                (data) =>
                                                                                    item?.userans?.includes(data?.answer) &&
                                                                                    (data?.status === "Not-Eligible" || data?.status === "Manual Decision")
                                                                            ).length ? (
                                                                            <CheckCircleIcon color="success" />
                                                                        ) : (
                                                                            <CancelIcon color="error" />
                                                                        )}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </>
                                )}
                        </>

                        <br /> <br />
                        <Grid container spacing={2}>

                            <Grid item md={6} sm={2} xs={12}>
                                {" "}
                                <Button sx={buttonStyles.btncancel} onClick={handleCloseview}>
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog >
            {/* typing test view model */}
            < Dialog
                open={openviewTypingtest}
                onClose={handleClickOpenviewTypingtest}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="lg"
                sx={{ marginTop: "50px" }
                }
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Response &nbsp;&nbsp; <b>
                                {" "}
                                {roundmasterEdit?.employeename}{" "}
                            </b>{" "}
                            &nbsp;&nbsp; Typing Test Results
                        </Typography>

                        <br />
                        <>
                            <br />
                            {roundmasterEdit?.interviewForm?.map((t, index) => {
                                const speed = t.userans?.includes("InComplete")
                                    ? "InComplete"
                                    : `${t.typingspeedans} wpm`;

                                const accuracy = t.userans?.includes("InComplete")
                                    ? "InComplete"
                                    : `${t.typingaccuracyans} %`;

                                const mistakes = t.userans?.includes("InComplete")
                                    ? "InComplete"
                                    : t.typingmistakesans;
                                const status = t.typingresult === "Eligible" ? true : false;
                                const timetakeninseconds = t.userans?.includes("InComplete")
                                    ? "InComplete"
                                    : `${moment.utc(t.timetaken * 1000).format("mm:ss")}`;

                                const speedstatus =
                                    t?.typingresultstatus?.length > 0
                                        ? t?.typingresultstatus[0]
                                        : false;
                                const accuracystatus =
                                    t?.typingresultstatus?.length > 0
                                        ? t?.typingresultstatus[1]
                                        : false;
                                const mistakesstatus =
                                    t?.typingresultstatus?.length > 0
                                        ? t?.typingresultstatus[2]
                                        : false;

                                const actualspeed =
                                    t?.typingspeedvalidation === "Between"
                                        ? `Between ${t?.typingspeedfrom} to ${t?.typingspeedto}`
                                        : `${t?.typingspeedvalidation} ${t?.typingspeed}`;
                                const actualacuuracy =
                                    t?.typingaccuracyvalidation === "Between"
                                        ? `Between ${t?.typingaccuracyfrom} to ${t?.typingaccuracyto}`
                                        : `${t?.typingaccuracyvalidation} ${t?.typingaccuracy}`;
                                const actualmistakes =
                                    t?.typingmistakesvalidation === "Between"
                                        ? `Between ${t?.typingmistakesfrom} to ${t?.typingmistakesto}`
                                        : `${t?.typingmistakesvalidation} ${t?.typingmistakes}`;
                                const actualtime = t?.typingduration;
                                return (
                                    <>
                                        <Grid container spacing={2}>
                                            <Grid
                                                item
                                                md={12}
                                                xs={12}
                                                sm={12}
                                                style={{ marginTop: "20px" }}
                                            >
                                                <FormControl fullWidth size="small">
                                                    <Typography
                                                        style={{
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                            maxWidth: "100%",
                                                        }}
                                                        title={t.question}
                                                    >

                                                        &nbsp;
                                                        {t?.uploadedimage && (
                                                            <>
                                                                <>
                                                                    <IconButton
                                                                        aria-label="view"
                                                                        onClick={() => {
                                                                            handleViewImageSubEdit(t);
                                                                        }}
                                                                    >
                                                                        <VisibilityOutlinedIcon
                                                                            sx={{ color: "#0B7CED" }}
                                                                        />
                                                                    </IconButton>
                                                                </>
                                                            </>
                                                        )}
                                                        &nbsp;{index + 1} . {t.question}
                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={8} xs={12} sm={12}>
                                                {/* Table */}
                                                <Container maxWidth="sm" style={{ marginTop: "20px" }}>
                                                    <TableContainer component={Paper}>
                                                        <Table
                                                            aria-label="customized table"
                                                            id="raisetickets"
                                                        // ref={componentRef}
                                                        >
                                                            <TableHead
                                                                sx={{ fontWeight: "600", textAlign: "center" }}
                                                            >
                                                                <StyledTableRow>
                                                                    <StyledTableCell
                                                                        sx={{
                                                                            textAlign: "center",
                                                                            justifyContent: "center",
                                                                        }}
                                                                    >
                                                                        <Box sx={userStyle.tableheadstyle}>
                                                                            <Box
                                                                                sx={{
                                                                                    textAlign: "center",
                                                                                    justifyContent: "center",
                                                                                }}
                                                                            >
                                                                                Speed &nbsp; (
                                                                                <span style={{ fontSize: "12px" }}>
                                                                                    {actualspeed}
                                                                                </span>
                                                                                )
                                                                            </Box>
                                                                        </Box>
                                                                    </StyledTableCell>
                                                                    <StyledTableCell
                                                                        sx={{
                                                                            textAlign: "center",
                                                                            justifyContent: "center",
                                                                        }}
                                                                    >
                                                                        <Box sx={userStyle.tableheadstyle}>
                                                                            <Box
                                                                                sx={{
                                                                                    textAlign: "center",
                                                                                    justifyContent: "center",
                                                                                }}
                                                                            >
                                                                                Accuracy &nbsp; (
                                                                                <span style={{ fontSize: "12px" }}>
                                                                                    {actualacuuracy}
                                                                                </span>
                                                                                )
                                                                            </Box>
                                                                        </Box>
                                                                    </StyledTableCell>
                                                                    <StyledTableCell
                                                                        sx={{
                                                                            textAlign: "center",
                                                                            justifyContent: "center",
                                                                        }}
                                                                    >
                                                                        <Box sx={userStyle.tableheadstyle}>
                                                                            <Box
                                                                                sx={{
                                                                                    textAlign: "center",
                                                                                    justifyContent: "center",
                                                                                }}
                                                                            >
                                                                                Mistakes &nbsp; (
                                                                                <span style={{ fontSize: "12px" }}>
                                                                                    {actualmistakes}
                                                                                </span>
                                                                                )
                                                                            </Box>
                                                                        </Box>
                                                                    </StyledTableCell>
                                                                    <StyledTableCell
                                                                        sx={{
                                                                            textAlign: "center",
                                                                            justifyContent: "center",
                                                                        }}
                                                                    >
                                                                        <Box sx={userStyle.tableheadstyle}>
                                                                            <Box
                                                                                sx={{
                                                                                    textAlign: "center",
                                                                                    justifyContent: "center",
                                                                                }}
                                                                            >
                                                                                Time Taken (
                                                                                <span style={{ fontSize: "12px" }}>
                                                                                    {actualtime}
                                                                                </span>
                                                                                )
                                                                            </Box>
                                                                        </Box>
                                                                    </StyledTableCell>
                                                                    <StyledTableCell
                                                                        sx={{
                                                                            textAlign: "center",
                                                                            justifyContent: "center",
                                                                        }}
                                                                    >
                                                                        <Box sx={userStyle.tableheadstyle}>
                                                                            <Box
                                                                                sx={{
                                                                                    textAlign: "center",
                                                                                    justifyContent: "center",
                                                                                }}
                                                                            >
                                                                                Status
                                                                            </Box>
                                                                        </Box>
                                                                    </StyledTableCell>
                                                                    {t?.additionalinformation &&
                                                                        <StyledTableCell
                                                                            sx={{
                                                                                textAlign: "center",
                                                                                justifyContent: "center",
                                                                            }}
                                                                        >
                                                                            <Box sx={userStyle.tableheadstyle}>
                                                                                <Box
                                                                                    sx={{
                                                                                        textAlign: "center",
                                                                                        justifyContent: "center",
                                                                                    }}
                                                                                >
                                                                                    Additional Information
                                                                                </Box>
                                                                            </Box>
                                                                        </StyledTableCell>}
                                                                </StyledTableRow>
                                                            </TableHead>
                                                            <TableBody align="left">
                                                                {roundmasterEdit?.interviewForm?.length > 0 ? (
                                                                    <StyledTableRow key={index}>
                                                                        <StyledTableCell>
                                                                            {speed}&nbsp; &nbsp;
                                                                            {speedstatus ? (
                                                                                <CheckCircleIcon
                                                                                    color="success"
                                                                                    style={{
                                                                                        fontSize: "15px",
                                                                                        marginTop: "10px",
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <CancelIcon
                                                                                    color="error"
                                                                                    style={{
                                                                                        fontSize: "15px",
                                                                                        marginTop: "7px",
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell>
                                                                            {accuracy}&nbsp; &nbsp;
                                                                            {accuracystatus ? (
                                                                                <CheckCircleIcon
                                                                                    color="success"
                                                                                    style={{
                                                                                        fontSize: "15px",
                                                                                        marginTop: "7px",
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <CancelIcon
                                                                                    color="error"
                                                                                    style={{
                                                                                        fontSize: "15px",
                                                                                        marginTop: "7px",
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell>
                                                                            {mistakes}&nbsp; &nbsp;
                                                                            {mistakesstatus ? (
                                                                                <CheckCircleIcon
                                                                                    color="success"
                                                                                    style={{
                                                                                        fontSize: "15px",
                                                                                        marginTop: "7px",
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <CancelIcon
                                                                                    color="error"
                                                                                    style={{
                                                                                        fontSize: "15px",
                                                                                        marginTop: "7px",
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell>
                                                                            {timetakeninseconds}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell>
                                                                            {status ? (
                                                                                <CheckCircleIcon color="success" />
                                                                            ) : (
                                                                                <CancelIcon color="error" />
                                                                            )}
                                                                        </StyledTableCell>
                                                                        {t?.additionalinformation &&
                                                                            <StyledTableCell>
                                                                                {t?.additionalinformation}
                                                                            </StyledTableCell>
                                                                        }
                                                                    </StyledTableRow>
                                                                ) : (
                                                                    <StyledTableRow>
                                                                        <StyledTableCell
                                                                            colSpan={12}
                                                                            sx={{
                                                                                height: "50px",
                                                                            }}
                                                                            align="center"
                                                                        >
                                                                            No Data Available
                                                                        </StyledTableCell>
                                                                    </StyledTableRow>
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Container>
                                            </Grid>
                                        </Grid>
                                        <br />
                                    </>
                                );
                            })}
                        </>

                        <br /> <br />
                        <Grid container spacing={2}>

                            <Grid item md={6} sm={2} xs={12}>
                                {" "}
                                <Button
                                    sx={buttonStyles.btncancel}
                                    onClick={handleCloseviewTypingtest}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog >
        </Box >
    );
}

export default InterviewRoundsTestVerificationResults;