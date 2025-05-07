import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import { BASE_URL } from "../../services/Authservice";
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
    Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";


import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import domtoimage from 'dom-to-image';
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import AlertDialog from "../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
function InterviewRoundsTestVerification() {
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const [btnSubmit, setBtnSubmit] = useState(false);
    const handleClickOpenPopupMalert = () => {
        setBtnSubmit(false);
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
    const [linksArray, setLinksArray] = useState([]);
    console.log(linksArray, "linksArray")
    const startRounds = () => {
        if (linksArray.length > 0) {
            localStorage.setItem("roundLinks", JSON.stringify(linksArray)); // Store links in localStorage
            localStorage.setItem("currentIndex", "0"); // Start from first round
            window.open(linksArray[0].link, "_blank"); // Open first round in new tab
        }
    };

    let exportColumnNames = [
        "Designation",
        "Round",
        "Type",
        "Category",
        "Subcategory",
        "Typetest",
        "Test Name",
        "Questioncount",
        "Countfrom",
        "Countto",
        "Question",
        "Duration",
        // "RetestCount",
        // "RetestApplicableFor",
        "Mode",
        "RoundMode",
    ];
    let exportRowValues = [
        "designation",
        "round",
        "type",
        "category",
        "subcategory",
        "typetest",
        "testname",
        "questioncount",
        "countfrom",
        "countto",
        "question",
        "duration",
        // "retestcount",
        // "retestfor",
        "mode",
        "roundmode",
    ];

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

    const [interviewgrouping, setInterviewgrouping] = useState({
        designation: "Please Select Designation",
        round: "Please Select Round",
        type: "Please Select Type",
        typetest: "Please Select Type",
        category: "Please Select Category",
        subcategory: "Please Select Subcategory",
        question: "",
        questioncount: "",
        countfrom: "",
        countto: "",
        duration: "00:20",
        testname: "Please Select TestName",
        isoffline: false,
        mode: "Questions",
        roundmode: "Either",
    });

    let modeOptions = [
        {
            label: "Questions",
            value: "Questions",
        },
        {
            label: "Online or Interview Test",
            value: "Online or Interview Test",
        },
        {
            label: "Typing Test",
            value: "Typing Test",
        },
        {
            label: "Verification/Administrative",
            value: "Verification/Administrative",
        },
    ];

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
            pagename: String("Interview Rounds Test Verification"),
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





    const [hrsOption, setHrsOption] = useState([]);
    const [minsOption, setMinsOption] = useState([]);
    const [hours, setHours] = useState("00");
    const [minutes, setMinutes] = useState("20");
    const [hoursEdit, setHoursEdit] = useState("Hrs");
    const [minutesEdit, setMinutesEdit] = useState("Mins");
    const [restrictionLength, setRestrictionLength] = useState(0);
    const [restrictionLengthEdit, setRestrictionLengthEdit] = useState(0);
    const [restrictionStatusLength, setRestrictionStatusLength] = useState(0);
    const [restrictionStatusLengthEdit, setRestrictionStatusLengthEdit] =
        useState(0);

    const [retestCount, setRetestCount] = useState(0);
    const [eligibleMarks, setEligibleMarks] = useState(0);
    const [eligibleMarksEdit, setEligibleMarksEdit] = useState(0);
    const [comparisonType, setComparisonType] = useState(
        "Greater Than or Equal to"
    );
    const [comparisonTypeEdit, setComparisonTypeEdit] = useState(
        "Greater Than or Equal to"
    );
    const comparisonoptions = [
        { label: "Less Than", value: "Less Than" },
        { label: "Less Than or Equal to", value: "Less Than or Equal to" },
        { label: "Greater Than", value: "Greater Than" },
        { label: "Greater Than or Equal to", value: "Greater Than or Equal to" },
        { label: "Equal to", value: "Equal to" },
    ];

    const [retestFor, setRetestFor] = useState("Both");
    const [retestCountEdit, setRetestCountEdit] = useState(0);
    const [retestForEdit, setRetestForEdit] = useState("Both");



    const [interviewgroupingEdit, setInterviewgroupingEdit] = useState({
        designation: "Please Select Designation",
        round: "Please Select Round",
        category: "Please Select Category",
        subcategory: [],
        question: "",
        duration: "00:00",
        testname: "Please Select TestName",
        isoffline: false,
        mode: "Questions",
        roundmode: "Either",
    });

    const [interviewgroupingall, setInterviewgroupingall] = useState([]);
    const [dataAvailable, setDataAvailable] = useState([]);
    const [dataAvailableEdit, setDataAvailableEdit] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const {
        isUserRoleCompare,
        isUserRoleAccess,
        alldesignation,
        pageName,
        setPageName,
        buttonStyles,
    } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [reasonmasterCheck, setReasonmastercheck] = useState(false);
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
    let [valueCate, setValueCate] = useState([]);

    const handleQuestionChange = (options) => {
        setValueCate(
            options.map((a, index) => {
                return a.value;
            })
        );
        setEligibleMarks(0);
        const data = options.map((data) => {
            return {
                question: data?.question,
                type: data?.type,
                informreason: data?.informreason || "",
                optionArr: data?.optionArr,
                answers: data?.answers,
                date: data?.date,
                fromdate: data?.fromdate,
                todate: data?.todate,
                datestatus: data?.datestatus,
                datedescription: data?.datedescription,
                secondarytodo: data?.secondarytodo,
                subquestionlength: data?.subquestionlength,
                yesorno: data?.yesorno,
                statusAns: data?.statusAns,

                typingspeed: data?.typingspeed,
                typingspeedvalidation: data?.typingspeedvalidation,
                typingspeedfrom: data?.typingspeedfrom,
                typingspeedto: data?.typingspeedto,
                typingspeedstatus: data?.typingspeedstatus,

                typingaccuracy: data?.typingaccuracy,
                typingaccuracyvalidation: data?.typingaccuracyvalidation,
                typingaccuracyfrom: data?.typingaccuracyfrom,
                typingaccuracyto: data?.typingaccuracyto,
                typingaccuracystatus: data?.typingaccuracystatus,

                typingmistakes: data?.typingmistakes,
                typingmistakesvalidation: data?.typingmistakesvalidation,
                typingmistakesfrom: data?.typingmistakesfrom,
                typingmistakesto: data?.typingmistakesto,
                typingmistakesstatus: data?.typingmistakesstatus,

                typingduration: data?.typingduration,
                statusAllotId: data?._id,
            };
        });
        setDataAvailable(data);

        setSelectedOptionsCate(options);
    };
    const handleQuestionChangeVerification = (options) => {
        setValueCate(
            options.map((a, index) => {
                return a.value;
            })
        );
        console.log(options, "options")
        setEligibleMarks(0);

        const data = options.map((data) => {
            let optionsArray = data?.optionsArray?.length ? data?.optionsArray : [
                { status: "Eligible", options: "Yes", description: "" },
                { status: "Not-Eligible", options: "No", description: "" },
            ]
            return {
                question: data?.value,
                type: "Radio",
                optionArr: optionsArray,
                answers: data?.answers,
                date: data?.date,
                fromdate: data?.fromdate,
                informreason: data?.informreason || "",
                todate: data?.todate,
                datestatus: data?.datestatus,
                datedescription: data?.datedescription,
                secondarytodo: data?.secondarytodo,
                subquestionlength: data?.subquestionlength,
                yesorno: "No",
                statusAns: data?.statusAns,

                typingspeed: data?.typingspeed,
                typingspeedvalidation: data?.typingspeedvalidation,
                typingspeedfrom: data?.typingspeedfrom,
                typingspeedto: data?.typingspeedto,
                typingspeedstatus: data?.typingspeedstatus,

                typingaccuracy: data?.typingaccuracy,
                typingaccuracyvalidation: data?.typingaccuracyvalidation,
                typingaccuracyfrom: data?.typingaccuracyfrom,
                typingaccuracyto: data?.typingaccuracyto,
                typingaccuracystatus: data?.typingaccuracystatus,

                typingmistakes: data?.typingmistakes,
                typingmistakesvalidation: data?.typingmistakesvalidation,
                typingmistakesfrom: data?.typingmistakesfrom,
                typingmistakesto: data?.typingmistakesto,
                typingmistakesstatus: data?.typingmistakesstatus,

                typingduration: data?.typingduration,
                statusAllotId: data?._id,
            };
        });
        setDataAvailable(data);

        setSelectedOptionsCate(options);
    };

    const customValueRendererCate = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label)?.join(", ")
            : "Please select Question";
    };

    // Edit functionlity
    const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]);
    let [valueCateEdit, setValueCateEdit] = useState("");

    const handleQuestionChangeEdit = (options) => {
        setSelectedOptionsCateEdit(options);

        const data = options.map((data) => {
            return {
                // question: data?.question,
                // type: data?.type,
                // optionArr: data?.optionArr,
                // answers: data?.answers,
                // date: data?.date,
                // fromdate: data?.fromdate,
                // todate: data?.todate,
                // datestatus: data?.datestatus,
                // datedescription: data?.datedescription,
                // secondarytodo: data?.secondarytodo,
                // subquestionlength: data?.subquestionlength,
                // yesorno: data?.yesorno,
                // statusAns: data?.statusAns,
                // statusAllotId:data?._id

                question: data?.question,
                type: data?.type,
                optionArr: data?.optionArr,
                informreason: data?.informreason || "",
                answers: data?.answers,
                date: data?.date,
                fromdate: data?.fromdate,
                todate: data?.todate,
                datestatus: data?.datestatus,
                datedescription: data?.datedescription,
                secondarytodo: data?.secondarytodo,
                subquestionlength: data?.subquestionlength,
                yesorno: data?.yesorno,
                statusAns: data?.statusAns,

                typingspeed: data?.typingspeed,
                typingspeedvalidation: data?.typingspeedvalidation,
                typingspeedfrom: data?.typingspeedfrom,
                typingspeedto: data?.typingspeedto,
                typingspeedstatus: data?.typingspeedstatus,

                typingaccuracy: data?.typingaccuracy,
                typingaccuracyvalidation: data?.typingaccuracyvalidation,
                typingaccuracyfrom: data?.typingaccuracyfrom,
                typingaccuracyto: data?.typingaccuracyto,
                typingaccuracystatus: data?.typingaccuracystatus,

                typingmistakes: data?.typingmistakes,
                typingmistakesvalidation: data?.typingmistakesvalidation,
                typingmistakesfrom: data?.typingmistakesfrom,
                typingmistakesto: data?.typingmistakesto,
                typingmistakesstatus: data?.typingmistakesstatus,

                typingduration: data?.typingduration,
                statusAllotId: data?._id,
            };
        });
        setDataAvailableEdit(data);
    };

    const customValueRendererCateEdit = (valueCateEdit, _employeename) => {
        return valueCateEdit.length
            ? valueCateEdit.map(({ label }) => label)?.join(", ")
            : "Please select Question";
    };

    //image

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Interview Rounds Test Verification.png");
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
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        designation: true,
        mode: true,
        typetest: true,
        questioncount: true,
        countto: true,
        countfrom: true,
        roundmode: true,
        isoffline: true,
        testname: true,
        category: true,
        subcategory: true,
        round: true,
        type: true,
        question: true,
        duration: true,
        retestcount: true,
        retestfor: true,
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

    const [deleteCheckpointicket, setDeleteCheckpointticket] = useState("");



    const [interviewQuestionSubCategory, setInterviewQuestionSubCategory] =
        useState([]);
    //get all project.

    // Alert delete popup
    let Checkpointticketsid = deleteCheckpointicket?._id;





    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(
                `${SERVICE.INTERVIEWQUESTIONGROUPING_SINGLE}/${e}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            setInterviewgroupingEdit(res?.data?.sinterviewgroupingquestion);
            handleClickOpenview();
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName);
        try {
            let res = await axios.get(
                `${SERVICE.INTERVIEWQUESTIONGROUPING_SINGLE}/${e}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            setInterviewgroupingEdit(res?.data?.sinterviewgroupingquestion);
            handleClickOpeninfo();
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };


    //Project updateby edit page...
    let updateby = interviewgroupingEdit?.updatedby;
    let addedby = interviewgroupingEdit?.addedby;

    let subprojectsid = interviewgroupingEdit?._id;



    // Excel
    const fileName = "Interview Question Grouping_Master";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Interview Rounds Test Verification",
        pageStyle: "print",
    });

    // useEffect(() => {
    //     fetchInterviewgrouping();
    // }, []);
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
        addSerialNumber(interviewgroupingall);
    }, [interviewgroupingall]);
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
            Object.values(item)?.join(" ").toLowerCase().includes(term)
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

    //start test model
    const [isStartTestOpencheckbox, setIsStartTestOpencheckbox] = useState(false);
    const [startTestFullName, setStartTestFullName] = useState("");
    const [paramsValue, setParamsValue] = useState({
        roundmode: "",
        roundorderid: "",
        questionorderid: "",
        questiongroupingid: "",
        designation: "",
        roundname: "",
        testname: "",
    });
    const handleCloseModcheckboxStartTest = () => {
        setIsStartTestOpencheckbox(false);
        localStorage.removeItem("roundLinks");
        localStorage.removeItem("currentIndex");
    };
    const handleOpenModcheckboxStartTest = () => {
        setIsStartTestOpencheckbox(true);
    };
    const columnDataTable = [

        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "designation",
            headerName: "Designation",
            flex: 0,
            width: 160,
            hide: !columnVisibility.designation,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "round",
            headerName: "Round",
            flex: 0,
            width: 160,
            hide: !columnVisibility.round,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "type",
            headerName: "Type",
            flex: 0,
            width: 160,
            hide: !columnVisibility.type,
            headerClassName: "bold-header",
        },
        {
            field: "category",
            headerName: "Category",
            flex: 0,
            width: 160,
            hide: !columnVisibility.category,
            headerClassName: "bold-header",
        },
        {
            field: "subcategory",
            headerName: "Subcategory",
            flex: 0,
            width: 160,
            hide: !columnVisibility.subcategory,
            headerClassName: "bold-header",
        },
        {
            field: "typetest",
            headerName: "Type",
            flex: 0,
            width: 160,
            hide: !columnVisibility.typetest,
            headerClassName: "bold-header",
        },
        {
            field: "testname",
            headerName: "Test Name",
            flex: 0,
            width: 160,
            hide: !columnVisibility.testname,
            headerClassName: "bold-header",
        },
        {
            field: "questioncount",
            headerName: "Question Count",
            flex: 0,
            width: 100,
            hide: !columnVisibility.questioncount,
            headerClassName: "bold-header",
        },
        {
            field: "countfrom",
            headerName: "Count From",
            flex: 0,
            width: 100,
            hide: !columnVisibility.countfrom,
            headerClassName: "bold-header",
        },
        {
            field: "countto",
            headerName: "Count To",
            flex: 0,
            width: 100,
            hide: !columnVisibility.countto,
            headerClassName: "bold-header",
        },
        {
            field: "question",
            headerName: "Question",
            flex: 0,
            width: 220,
            hide: !columnVisibility.question,
            headerClassName: "bold-header",
        },
        {
            field: "duration",
            headerName: "Duration",
            flex: 0,
            width: 100,
            hide: !columnVisibility.duration,
            headerClassName: "bold-header",
        },
        // {
        //     field: "retestcount",
        //     headerName: "Retest Count",
        //     flex: 0,
        //     width: 100,
        //     hide: !columnVisibility.retestcount,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "retestfor",
        //     headerName: "Retest Applicable For",
        //     flex: 0,
        //     width: 100,
        //     hide: !columnVisibility.retestfor,
        //     headerClassName: "bold-header",
        // },
        {
            field: "mode",
            headerName: "Mode",
            flex: 0,
            width: 160,
            hide: !columnVisibility.mode,
            headerClassName: "bold-header",
        },
        {
            field: "roundmode",
            headerName: "Round Mode",
            flex: 0,
            width: 120,
            hide: !columnVisibility.roundmode,
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
            //lockPinned: true,
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>


                    {isUserRoleCompare?.includes("vinterviewroundstestverification") && (
                        <Button
                            // endIcon={<BusinessIcon />}
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => {
                                // webpages/interview/interviewroundstestverification/:groupingid
                                handleOpenModcheckboxStartTest();
                                setStartTestFullName(`Designation : ${params?.data?.designation} ,Round : ${params?.data.round}`);
                                setParamsValue({
                                    roundmode: params?.data?.mode,
                                    roundorderid: params?.data?.roundorderid,
                                    questionorderid: params?.data?.questionorderid,
                                    questiongroupingid: params?.data?.id,
                                    designation: params?.data?.designation,
                                    roundname: params?.data?.round,
                                    testname: params?.data?.testname,
                                });
                            }}
                        >
                            START
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vinterviewroundstestverification") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {

                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iinterviewroundstestverification") && (
                        <Button
                            sx={userStyle.buttonedit}
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

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.id,
            serialNumber: item.serialNumber,
            designation: item.designation,
            mode: item.mode,
            roundmode: item.roundmode,
            typetest: item.typetest,
            questioncount: item.questioncount,
            countto: item.countto,
            countfrom: item.countfrom,
            category: item.category,
            subcategory: item.subcategory,
            round: item.round,
            type: item.type,
            duration: item.duration,
            question: item.question,
            arrques: item.question,
            interviewForm: item.interviewForm,
            retestcount: item.retestcount,
            retestfor: item.retestfor,
            testname: item?.testname,
            roundorderid: item?.roundorderid,
            questionorderid: item?.questionorderid
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


    const [designation, setDesignation] = useState([]);

    useEffect(() => {
        fetchDesignation();
    }, []);

    const [filterState, setFilterState] = useState({
        designation: "",
    });

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

    const handleClearFilter = () => {

        setFilterState({
            designation: ""
        });

        setInterviewgroupingall([])
        setLinksArray([])
        localStorage.removeItem("roundLinks");
        localStorage.removeItem("currentIndex");
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const handleFilter = () => {
        if (
            filterState?.designation === "Please Select Designation" ||
            filterState?.designation === ""
        ) {
            setPopupContentMalert("Please Select Designation!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            fetchReturnData();
        }
    }
    const [filterLoader, setFilterLoader] = useState(false);
    const [tableLoader, setTableLoader] = useState(false);

    const fetchReturnData = async () => {
        setPageName(!pageName);
        setFilterLoader(true);
        setTableLoader(true);
        try {

            let response = await axios.post(
                SERVICE.INTERVIEW_ROUND_TEST_VERIFICATION_FILTER,
                {
                    designation: [filterState?.designation]
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );


            const itemsWithSerialNumber = response?.data?.finalData?.map((item, index) => {
                let link = "";

                if (item.mode === "Online or Interview Test") {
                    link = `${BASE_URL}/webpages/interview/interviewroundstestverification/onlineorinterviewtest/${item.designation}/${item.round}/${item.testname}/${isUserRoleAccess?._id}`;
                }
                else if (item.mode === "Typing Test") {
                    link = `${BASE_URL}/webpages/interview/interviewroundstestverification/${item?._id}/${item.questionorderid}/${item.roundorderid}/typingtest/${item.designation}/${item.round}/${isUserRoleAccess?._id}`;
                }
                else if (item.mode === "Questions") {
                    link = `${BASE_URL}/webpages/interview/interviewroundstestverification/${item?._id}/${item.questionorderid}/${item.roundorderid}/questions/${item.designation}/${item.round}/${isUserRoleAccess?._id}`;
                }
                else if (item.mode === "Verification/Administrative") {
                    link = `${BASE_URL}/webpages/interview/interviewroundstestverification/${item?._id}/${item.questionorderid}/${item.roundorderid}/verification/${item.designation}/${item.round}/${isUserRoleAccess?._id}`;
                }

                return {
                    ...item,
                    serialNumber: index + 1,
                    id: item._id,
                    question: item.question?.join(",").toString(),
                    questionArray: item.question,
                    link,
                }
            }
            );

            setInterviewgroupingall(itemsWithSerialNumber);

            // Store only links in the separate state
            const linksData = itemsWithSerialNumber?.map((item) => ({
                id: item.id,
                link: item.link
            }));

            setLinksArray(linksData);
            localStorage.removeItem("roundLinks");
            localStorage.removeItem("currentIndex");
            setFilterLoader(false);
            setTableLoader(false);
        } catch (err) {
            console.log(err, "err")
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
    return (
        <Box>
            <Headtitle title={"INTERVIEW ROUNDS TEST VERIFICATION"} />
            {/* ****** Header Content ****** */}

            <PageHeading
                title="Interview Rounds Test Verification"
                modulename="Interview"
                submodulename="Interview Creation"
                mainpagename="Interview Rounds Test Verification"
                subpagename=""
                subsubpagename=""
            />


            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("linterviewroundstestverification") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Interview Rounds Test Verification Filter
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br /> </>
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Designation<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={designation}
                                        styles={colourStyles}
                                        value={{
                                            label: filterState.designation ? filterState.designation : "Please Select Designation",
                                            value: filterState.designation ? filterState.designation : "Please Select Designation",
                                        }}
                                        onChange={(e) => {
                                            setFilterState((prev) => ({
                                                ...prev,
                                                designation: e.value,
                                            }));

                                        }}
                                    />
                                </FormControl>
                            </Grid>
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
                    </Box>
                </>
            )} <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("linterviewroundstestverification") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                {" "}
                                List Interview Rounds Test Verification
                            </Typography>
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
                                        <MenuItem value={interviewgroupingall?.length}>
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
                                    {isUserRoleCompare?.includes(
                                        "excelinterviewroundstestverification"
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
                                        "csvinterviewroundstestverification"
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
                                        "printinterviewroundstestverification"
                                    ) && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                    {isUserRoleCompare?.includes(
                                        "pdfinterviewroundstestverification"
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
                                        "imageinterviewroundstestverification"
                                    ) && (
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
                                    maindatas={interviewgroupingall}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={interviewgroupingall}
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
                        {linksArray?.length > 0 && (
                            <Button
                                variant="contained"
                                sx={buttonStyles.buttonbulkdelete}
                                onClick={startRounds}
                            >
                                Start All Rounds
                            </Button>
                        )}
                        <br />
                        <br />
                        {tableLoader ? (
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
                                    // totalDatas={totalProjects}
                                    searchQuery={searchQuery}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={interviewgroupingall}
                                />
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

            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                sx={{ marginTop: "50px" }}
            >
                <Box sx={{ width: "750px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Interview Rounds Test Verification
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Designation</Typography>
                                    <Typography>{interviewgroupingEdit.designation}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Round</Typography>
                                    <Typography>{interviewgroupingEdit.round}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Mode</Typography>
                                    <Typography>{interviewgroupingEdit.mode}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Round Mode</Typography>
                                    <Typography>{interviewgroupingEdit.roundmode}</Typography>
                                </FormControl>
                            </Grid>
                            {interviewgroupingEdit.mode == "Questions" && (
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Type</Typography>
                                        <Typography>{interviewgroupingEdit.type}</Typography>
                                    </FormControl>
                                </Grid>
                            )}
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Category</Typography>
                                    <Typography>{interviewgroupingEdit.category}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Subcategory</Typography>
                                    <Typography>{interviewgroupingEdit?.subcategory?.join(",")}</Typography>
                                </FormControl>
                            </Grid>

                            {interviewgroupingEdit?.mode == "Typing Test" && (
                                <>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Type</Typography>
                                            <Typography>{interviewgroupingEdit.typetest}</Typography>
                                        </FormControl>
                                    </Grid>
                                    {["Running", "Random"]?.includes(
                                        interviewgroupingEdit.typetest
                                    ) ? (
                                        <Grid item md={4} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Question Count</Typography>
                                                <Typography>
                                                    {interviewgroupingEdit.questioncount}
                                                </Typography>
                                            </FormControl>
                                        </Grid>
                                    ) : interviewgroupingEdit.typetest === "Manual" ? (
                                        <>
                                            <Grid item md={4} sm={6} xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography variant="h6">
                                                        Question Count From
                                                    </Typography>
                                                    <Typography>
                                                        {interviewgroupingEdit.countfrom}
                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={4} sm={6} xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography variant="h6">
                                                        Question Count To
                                                    </Typography>
                                                    <Typography>
                                                        {interviewgroupingEdit.countto}
                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : (
                                        ""
                                    )}
                                </>
                            )}
                            {interviewgroupingEdit.mode == "Online or Interview Test" && (
                                <>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">TestName</Typography>
                                            <Typography>{interviewgroupingEdit.testname}</Typography>
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Type</Typography>
                                            <Typography>{interviewgroupingEdit.typetest}</Typography>
                                        </FormControl>
                                    </Grid>
                                    {["Running", "Random"]?.includes(
                                        interviewgroupingEdit.typetest
                                    ) ? (
                                        <Grid item md={4} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Question Count</Typography>
                                                <Typography>
                                                    {interviewgroupingEdit.questioncount}
                                                </Typography>
                                            </FormControl>
                                        </Grid>
                                    ) : interviewgroupingEdit.typetest === "Manual" ? (
                                        <>
                                            <Grid item md={4} sm={6} xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography variant="h6">
                                                        Question Count From
                                                    </Typography>
                                                    <Typography>
                                                        {interviewgroupingEdit.countfrom}
                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={4} sm={6} xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography variant="h6">
                                                        Question Count To
                                                    </Typography>
                                                    <Typography>
                                                        {interviewgroupingEdit.countto}
                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : (
                                        ""
                                    )}
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Total Marks</Typography>
                                            <Typography>
                                                {interviewgroupingEdit.totalmarks}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Eligible Marks</Typography>
                                            <Typography>
                                                {interviewgroupingEdit.eligiblemarks}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                </>
                            )}
                            {(interviewgroupingEdit.mode == "Questions" || interviewgroupingEdit.mode == "Verification/Administrative") && (
                                <>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Question</Typography>
                                            <Typography>
                                                {Array.isArray(interviewgroupingEdit.question)
                                                    ? interviewgroupingEdit.question
                                                        .map((item) => `${item}`)
                                                        ?.join(",")
                                                    : ""}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Total Marks</Typography>
                                            <Typography>
                                                {interviewgroupingEdit.totalmarks}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Eligible Marks</Typography>
                                            <Typography>
                                                {interviewgroupingEdit.eligiblemarks}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                </>
                            )} <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Duration</Typography>
                                    <Typography>{interviewgroupingEdit.duration}</Typography>
                                </FormControl>
                            </Grid>

                            {interviewgroupingEdit.mode == "Typing Test" && (
                                <>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Retest Count</Typography>
                                            <Typography>
                                                {interviewgroupingEdit.retestcount}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">
                                                Retest Applicable For
                                            </Typography>
                                            <Typography>{interviewgroupingEdit.retestfor}</Typography>
                                        </FormControl>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCloseview}
                                sx={buttonStyles.btncancel}
                            >
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
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr} sx={buttonStyles.buttonsubmit}>
                            ok
                        </Button>
                    </DialogActions>
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
                itemsTwo={interviewgroupingall ?? []}
                filename={"Interview Rounds Test Verification"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Interview Rounds Test Verification Info"
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


            {/* Start Test Modal */}
            <Box>
                <Dialog
                    open={isStartTestOpencheckbox}
                    onClose={handleCloseModcheckboxStartTest}
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
                            Are you sure? Do you want to Start Test for {startTestFullName} ?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseModcheckboxStartTest}
                            color="error"
                            variant="contained"
                        >
                            No
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            color="success"
                            onClick={(e) => {

                                handleCloseModcheckboxStartTest();

                                if (paramsValue?.roundmode === "Online or Interview Test") {

                                    window.open(`${BASE_URL}/webpages/interview/interviewroundstestverification/onlineorinterviewtest/${paramsValue?.designation}/${paramsValue?.roundname}/${paramsValue?.testname}/${isUserRoleAccess?._id}`, "_blank")
                                }
                                else if (paramsValue?.roundmode === "Typing Test") {

                                    window.open(`${BASE_URL}/webpages/interview/interviewroundstestverification/${paramsValue?.questiongroupingid}/${paramsValue?.questionorderid}/${paramsValue?.roundorderid}/typingtest/${paramsValue?.designation}/${paramsValue?.roundname}/${isUserRoleAccess?._id}`, "_blank")
                                }
                                else if (paramsValue?.roundmode === "Questions") {

                                    window.open(`${BASE_URL}/webpages/interview/interviewroundstestverification/${paramsValue?.questiongroupingid}/${paramsValue?.questionorderid}/${paramsValue?.roundorderid}/questions/${paramsValue?.designation}/${paramsValue?.roundname}/${isUserRoleAccess?._id}`, "_blank")
                                }
                                else if (paramsValue?.roundmode === "Verification/Administrative") {

                                    window.open(`${BASE_URL}/webpages/interview/interviewroundstestverification/${paramsValue?.questiongroupingid}/${paramsValue?.questionorderid}/${paramsValue?.roundorderid}/verification/${paramsValue?.designation}/${paramsValue?.roundname}/${isUserRoleAccess?._id}`, "_blank")
                                }

                            }}
                        >
                            {" "}
                            Yes{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

export default InterviewRoundsTestVerification;
