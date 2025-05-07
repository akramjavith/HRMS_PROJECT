import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
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
function Interviewgroupingquestion() {
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

  let exportColumnNames = [
    "Designation",
    "Round",
    "Type",
    "Category",
    "Subcategory",
    "Typetest",
    "Questioncount",
    "Countfrom",
    "Countto",
    "Question",
    "Duration",
    "RetestCount",
    "RetestApplicableFor",
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
    "questioncount",
    "countfrom",
    "countto",
    "question",
    "duration",
    "retestcount",
    "retestfor",
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
    subcategory: [],
    subcategoryarray: [],
    question: "",
    questioncount: "",
    countfrom: "",
    countto: "",
    duration: "00:20",
    testname: "Please Select TestName",
    isoffline: false,
    mode: "Please Select Mode",
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
      pagename: String("Interview Questions Grouping"),
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



  useEffect(() => { fetchVerificationMaster() }, []);
  const [verificationMaster, setVerificationMaster] = useState([])
  const fetchVerificationMaster = async () => {
    setPageName(!pageName);
    try {

      let response = await axios.get(
        SERVICE.ALL_INTERVIEW_VERIFICATION,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      const itemsWithSerialNumber = response?.data?.allInterviewVerification;


      setVerificationMaster(itemsWithSerialNumber);

    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
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
  const [eligibleMarksLimit, setEligibleMarksLimit] = useState(0);
  const [eligibleMarksLimitEdit, setEligibleMarksLimitEdit] = useState(0);
  const [eligibleMarksEditLimit, setEligibleMarksEditLimit] = useState(0);
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

  const functionTotalCount = async (cat, subcate) => {
    let res = await axios.get(SERVICE.ALL_ONLINE_TEST_QUESTION, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    const answe = res.data.onlinetestquestions?.filter(
      (data) => data.category === cat && subcate?.includes(data.subcategory)
    );
    setRestrictionLength(answe?.length);
  };
  const functionTotalCountEdit = async (cat, subcate) => {
    let res = await axios.get(SERVICE.ALL_ONLINE_TEST_QUESTION, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    const answe = res.data.onlinetestquestions?.filter(
      (data) => data.category === cat && subcate?.includes(data.subcategory)
    );
    setRestrictionLengthEdit(answe?.length);
  };

  const functionStatusAllot = async (desig, cat, subcate) => {
    let res = await axios.get(SERVICE.GET_INT_FORM_DESIGN, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    const answe = res.data.interviewformdesign?.filter(
      (data) =>
        data.category === cat &&
        subcate?.includes(data.subcategory) &&
        data.designation?.includes(desig) &&
        data.type === "Typing Test"
    );
    setRestrictionStatusLength(answe?.length);
  };
  const functionStatusAllotEdit = async (desig, cat, subcate) => {
    let res = await axios.get(SERVICE.GET_INT_FORM_DESIGN, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    const answe = res.data.interviewformdesign?.filter(
      (data) =>
        data.category === cat &&
        subcate?.includes(data.subcategory) &&
        data.designation?.includes(desig) &&
        data.type === "Typing Test"
    );
    setRestrictionStatusLengthEdit(answe?.length);
  };

  //function to generate hrs
  const generateHrsOptions = () => {
    const hrsOpt = [];
    for (let i = 0; i <= 23; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      hrsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setHrsOption(hrsOpt);
  };
  //function to generate mins
  const generateMinsOptions = () => {
    const minsOpt = [];
    for (let i = 0; i <= 59; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      minsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setMinsOption(minsOpt);
  };

  const [interviewgroupingEdit, setInterviewgroupingEdit] = useState({
    designation: "Please Select Designation",
    round: "Please Select Round",
    category: "Please Select Category",
    subcategory: [],
    subcategoryarray: [],
    question: "",
    duration: "00:00",
    testname: "Please Select TestName",
    isoffline: false,
    mode: "Please Select Mode",
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
    console.log(options, "options");
    let eligilimit = options?.filter(ques => ques?.originalquestionvalues?.questionpreference === "Mandatory")?.length

    setEligibleMarksLimit(eligilimit);
    setValueCate(
      options?.map((a, index) => {
        return a.value;
      })
    );
    setEligibleMarks(0);
    const data = options?.map((data) => {
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
      options?.map((a, index) => {
        return a.value;
      })
    );
    console.log(options, "options")
    let eligilimit = options?.filter(ques => ques?.questionpreference === "Mandatory")?.length

    setEligibleMarksLimit(eligilimit);
    setEligibleMarks(0);

    const data = options?.map((data) => {
      let optionsArray = data?.optionsArray?.length ? data?.optionsArray : [
        { status: "Eligible", options: "Yes", tamiloptions: "ஆம்", description: "", tamildescription: "" },
        { status: "Not-Eligible", options: "No", tamiloptions: "இல்லை", description: "", tamildescription: "" },
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
      ? valueCate?.map(({ label }) => label).join(", ")
      : "Please select Question";
  };
  const customValueRendererSubCate = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate?.map(({ label }) => label).join(", ")
      : "Please select Sub Category";
  };

  // Edit functionlity
  const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]);
  let [valueCateEdit, setValueCateEdit] = useState("");

  const handleQuestionChangeEdit = (options) => {

    let eligilimit = options?.filter(ques => ques?.originalquestionvalues?.questionpreference === "Mandatory")?.length
    setValueCateEdit(options?.map((data) => data?.value))
    setEligibleMarksEditLimit(eligilimit);
    setSelectedOptionsCateEdit(options);

    setEligibleMarksEdit(0);
    const data = options?.map((data) => {
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
    setDataAvailableEdit(data);
  };


  const handleQuestionChangeVerificationEdit = (options) => {
    setValueCateEdit(
      options?.map((a, index) => {
        return a.value;
      })
    );
    console.log(options, "options")
    let eligilimit = options?.filter(ques => ques?.questionpreference === "Mandatory")?.length

    setEligibleMarksEditLimit(eligilimit);
    setEligibleMarksEdit(0);

    const data = options?.map((data) => {
      let optionsArray = data?.optionsArray?.length ? data?.optionsArray : [
        { status: "Eligible", options: "Yes", tamiloptions: "ஆம்", description: "", tamildescription: "" },
        { status: "Not-Eligible", options: "No", tamiloptions: "இல்லை", description: "", tamildescription: "" },
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
    setDataAvailableEdit(data);
    setSelectedOptionsCateEdit(options);
  };
  const customValueRendererCateEdit = (valueCateEdit, _employeename) => {
    return valueCateEdit.length
      ? valueCateEdit?.map(({ label }) => label).join(", ")
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
          saveAs(blob, "Interview Question Grouping.png");
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
    setIsHandleChange(true);
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      // setIsDeleteOpencheckbox(true);
      overallBulkdelete(selectedRows);
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

  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(
        `${SERVICE.INTERVIEWQUESTIONGROUPING_SINGLE}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setDeleteCheckpointticket(res?.data?.sinterviewgroupingquestion);
      handleClickOpen();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [interviewQuestionSubCategory, setInterviewQuestionSubCategory] =
    useState([]);
  //get all project.
  const fetchInterviewQuestion = async () => {
    setPageName(!pageName);
    try {
      const [res_statusallot, res_project] = await Promise.all([
        axios.get(SERVICE.GET_INT_FORM_DESIGN, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.INTERVIEWQUESTION, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);
      let statCat = res_statusallot?.data?.interviewformdesign?.filter(
        (data) => data?.type === "Typing Test"
      );

      const uniqueCategories = [
        ...new Set(statCat?.map((item) => item?.category)),
      ];
      const interviewQuestionCategories = uniqueCategories?.map((category) => ({
        label: category,
        value: category,
      }));
      setInterviewQuestionSubCategory(statCat);
      console.log(statCat, "statCat");
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // Alert delete popup
  let Checkpointticketsid = deleteCheckpointicket?._id;
  const delCheckpointticket = async () => {
    setPageName(!pageName);
    try {
      if (Checkpointticketsid) {
        let overallcheck = await axios.post(
          `${SERVICE.INTERVIEWQUESTIONGROUPING_OVERALLDELETE}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            category: deleteCheckpointicket?.category,
            subcategory: Array?.isArray(deleteCheckpointicket.subcategory) && deleteCheckpointicket.subcategory?.length > 0 ? deleteCheckpointicket.subcategory : [deleteCheckpointicket.subcategory],
            question: deleteCheckpointicket?.question,
            designation: deleteCheckpointicket?.designation,
            round: deleteCheckpointicket?.round,
          }
        );
        if (overallcheck?.data?.mayidelete) {
          await axios.delete(
            `${SERVICE.INTERVIEWQUESTIONGROUPING_SINGLE}/${Checkpointticketsid}`,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            }
          );
          setFilteredChanges(null)
          setFilteredRowData([]);
          await fetchInterviewgrouping();
          handleCloseMod();
          setSelectedRows([]);
          setPage(1);
          setPopupContent("Deleted Successfully");
          setPopupSeverity("success");
          handleClickOpenPopup();

        }
      }
    } catch (err) {
      handleCloseMod();
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const overallBulkdelete = async (ids) => {
    setPageName(!pageName);
    try {
      let overallcheck = await axios.post(
        `${SERVICE.INTERVIEWQUESTIONGROUPING_OVERALLBULKDELETE}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          id: ids,
        }
      );

      setSelectedRows(overallcheck?.data?.result);
      setIsDeleteOpencheckbox(true);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const delCheckpointticketcheckbox = async () => {
    setPageName(!pageName);
    try {
      if (selectedRows?.length > 0) {
        const deletePromises = selectedRows?.map((item) => {
          return axios.delete(
            `${SERVICE.INTERVIEWQUESTIONGROUPING_SINGLE}/${item}`,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            }
          );
        });

        // Wait for all delete requests to complete
        await Promise.all(deletePromises);
        setIsHandleChange(false);
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setFilteredChanges(null)
        setFilteredRowData([]);
        await fetchInterviewgrouping();
      }
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [categorys, setCategorys] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [isTestNames, setIsTestnames] = useState([]);
  const [round, setRound] = useState([]);
  const [type, setType] = useState([]);
  const [typeAll, setTypeAll] = useState([]);

  const [interviewquestionsall, setInterviewquestionall] = useState([]);
  const fetchRound = async () => {
    setPageName(!pageName);
    try {
      let res_category = await axios.get(SERVICE.ROUNDMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const roundall = [
        ...res_category?.data?.roundmasters?.map((d) => ({
          ...d,
          label: d.nameround,
          value: d.nameround,
        })),
      ];

      setRound(roundall);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const fetchType = async () => {
    setPageName(!pageName);
    try {
      let res_category = await axios.get(SERVICE.INTERVIEWTYPEMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const roundall = [
        ...new Set(
          res_category?.data?.interviewtypemasters?.map((d) => d.nametype)
        ),
      ]?.map((uniqueValue) => ({
        label: uniqueValue,
        value: uniqueValue,
      }));

      setType(roundall);
      console.log(res_category?.data?.interviewtypemasters, "res_category?.data?.interviewtypemasters");
      setTypeAll(res_category?.data?.interviewtypemasters);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchInterviewquestions = async () => {
    setPageName(!pageName);
    try {
      let res_category = await axios.get(SERVICE.GET_INT_FORM_DESIGN, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let res_project = await axios.post(SERVICE.DYNAMIC_INTERVIEWQUESTION, {
        pipeline: [
          {
            $match: {
              typingtest: false
            }
          },
          {
            $project: {
              uploadedimage: 0,
              files: 0,
              "subquestions.uploadedimage": 0,
              "subquestions.files": 0
            }
          }
        ]
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let intQuestion = res_project?.data?.interviewquestions;
      const categoryall = [
        ...res_category?.data?.interviewformdesign?.map((d) => {


          let findQuest = intQuestion?.find(item =>
            item?.name === d.question &&
            item?.category === d.category &&
            item?.subcategory === d.subcategory
          )

          return {
            ...d,
            label: d.question,
            value: d.question,
            originalquestionvalues: findQuest || {},
          }
        }),
      ];
      setInterviewquestionall(categoryall);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [questionSubcategory, setQuestionsSubCategory] = useState([])

  const fetchCategoryinterview = async () => {
    setPageName(!pageName);
    try {
      let res_category = await axios.get(SERVICE.CATEGORYINTERVIEW, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const result = res_category?.data?.interviewcategory.filter(
        (data, index) => {
          return data.mode === "Online or Interview Test";
        }
      );
      const categoryall = [
        ...result?.map((d) => ({
          ...d,
          label: d.categoryname,
          value: d.categoryname,
        })),
      ];

      const questionsubcat = res_category?.data?.interviewcategory.filter(
        (data, index) => {
          return data.mode === "Questions";
        }
      );

      setCategorys(categoryall);
      setQuestionsSubCategory(questionsubcat);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchSubCategoryTestName = async (category, subcategory) => {
    setPageName(!pageName);
    try {
      const [res_category, res_testname] = await Promise.all([
        axios.get(SERVICE.CATEGORYINTERVIEW, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.INTERVIEWTESTMASTER, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      const result = res_category?.data?.interviewcategory.filter(
        (data, index) => {
          return (
            data.categoryname === category &&
            data.mode === "Online or Interview Test"
          );
        }
      );
      let data_set = res_testname.data.interviewtestmasters.filter((data) => {
        return category === data.category && subcategory?.includes(data.subcategory);
      });
      const subcategoryall = result[0]?.subcategoryname?.map((d) => ({
        ...d,
        label: d,
        value: d,
      }));

      setSubcategorys(subcategoryall);
      setIsTestnames(
        data_set?.map((d) => ({
          ...d,
          label: d.testname,
          value: d.testname,
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
  const fetchSubCategoryBasedDuration = async (category, subcategory) => {
    setPageName(!pageName);
    try {
      let res_category = await axios.get(SERVICE.INTERVIEWTESTMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_category.data.interviewtestmasters.filter((data) => {
        return category === data.category && subcategory?.includes(data.subcategory);
      });

      setIsTestnames(
        data_set?.map((d) => ({
          ...d,
          label: d.testname,
          value: d.testname,
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

  useEffect(() => {
    generateHrsOptions();
    generateMinsOptions();
    fetchInterviewQuestion();
  }, []);

  //add function
  const sendRequest = async () => {
    setBtnSubmit(true);
    setPageName(!pageName);
    try {
      let subprojectscreate = await axios.post(
        SERVICE.INTERVIEWQUESTIONGROUPING_CREATE,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          totalmarks: Number(
            (interviewgrouping.mode === "Questions" || interviewgrouping.mode === "Verification/Administrative")
              ? valueCate?.length
              : interviewgrouping?.totalmarks
          ),
          eligiblemarks: Number(eligibleMarks),
          markcomparison: String(comparisonType),

          designation: String(interviewgrouping.designation),
          isoffline: Boolean(interviewgrouping.isoffline),
          mode: String(interviewgrouping.mode),
          roundmode: String(interviewgrouping.roundmode),
          typetest: String(
            interviewgrouping.typetest === "Please Select Type"
              ? ""
              : interviewgrouping.typetest
          ),
          questioncount: String(interviewgrouping.questioncount ?? ""),
          countfrom: String(interviewgrouping.countfrom ?? ""),
          countto: String(interviewgrouping.countto ?? ""),
          round: String(interviewgrouping.round),
          type: String(
            interviewgrouping.type == "Please Select Type"
              ? ""
              : interviewgrouping.type
          ),
          testname: String(
            interviewgrouping.testname == "Please Select TestName"
              ? ""
              : interviewgrouping.testname
          ),
          category: String(interviewgrouping.category),
          subcategory: interviewgrouping.subcategoryarray?.length > 0 ? interviewgrouping.subcategoryarray : [],
          question: [...valueCate],
          duration: String(interviewgrouping.duration),
          retestcount: Number(retestCount),
          retestfor:
            interviewgrouping.mode === "Typing Test" && retestCount > 0
              ? String(retestFor)
              : "",
          interviewForm: dataAvailable,
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchInterviewgrouping();
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setFilteredChanges(null)
      setFilteredRowData([]);
      setBtnSubmit(false);
    } catch (err) {
      setBtnSubmit(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    setBtnSubmit(true);
    e.preventDefault();

    const isNameMatch = interviewgroupingall.some(
      (item) =>
        item.designation === interviewgrouping.designation &&
        item.round === interviewgrouping.round
    );
    const isSameQuestion = interviewgroupingall.some(
      (item) =>
        item.designation === interviewgrouping.designation &&
        item?.questionArray?.some(data => valueCate?.includes(data)) &&
        (item.mode === "Questions" || item.mode === "Verification/Administrative")
    );

    if (interviewgrouping.designation === "Please Select Designation") {
      setPopupContentMalert("Please Select Designation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (interviewgrouping.round === "Please Select Round") {
      setPopupContentMalert("Please Select Round!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (interviewgrouping?.mode === "Please Select Mode") {
      setPopupContentMalert("Please Select Mode!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      interviewgrouping.mode === "Questions" &&
      interviewgrouping.type === "Please Select Type"
    ) {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (interviewgrouping.category === "Please Select Category") {
      setPopupContentMalert("Please Select Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (interviewgrouping.subcategory?.length === 0) {
      setPopupContentMalert("Please Select Subcategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      interviewgrouping.mode === "Online or Interview Test" &&
      interviewgrouping.testname === "Please Select TestName"
    ) {
      setPopupContentMalert("Please Select TestName!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (interviewgrouping.mode === "Questions" || interviewgrouping.mode === "Verification/Administrative") &&
      selectedOptionsCate.length == 0
    ) {
      setPopupContentMalert("Please Select Question!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (interviewgrouping.mode === "Online or Interview Test" ||
        interviewgrouping.mode === "Typing Test") &&
      (interviewgrouping?.typetest === "" ||
        interviewgrouping?.typetest == "Please Select Type" ||
        interviewgrouping?.typetest === undefined)
    ) {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Running", "Random"]?.includes(interviewgrouping.typetest) &&
      (interviewgrouping.mode === "Online or Interview Test" ||
        interviewgrouping.mode === "Typing Test") &&
      (interviewgrouping?.questioncount === "" ||
        interviewgrouping?.questioncount == 0 ||
        interviewgrouping?.questioncount === undefined)
    ) {
      setPopupContentMalert("Please Enter Total Questions!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      interviewgrouping.typetest === "Manual" &&
      (interviewgrouping.mode === "Online or Interview Test" ||
        interviewgrouping.mode === "Typing Test") &&
      (interviewgrouping?.countfrom === "" ||
        interviewgrouping?.countfrom == 0 ||
        interviewgrouping?.countfrom === undefined)
    ) {
      setPopupContentMalert("Please Enter Total Question Count From!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      interviewgrouping.typetest === "Manual" &&
      (interviewgrouping.mode === "Online or Interview Test" ||
        interviewgrouping.mode === "Typing Test") &&
      (interviewgrouping?.countto === "" ||
        interviewgrouping?.countto == 0 ||
        interviewgrouping?.countto === undefined)
    ) {
      setPopupContentMalert("Please Enter Total Question Count To!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      interviewgrouping.typetest === "Manual" &&
      (interviewgrouping.mode === "Online or Interview Test" ||
        interviewgrouping.mode === "Typing Test") &&
      Number(interviewgrouping?.countto) <= Number(interviewgrouping?.countfrom)
    ) {
      setPopupContentMalert(
        "Total Question Count To Should Greater Than Total Question Count From!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Running", "Random"]?.includes(interviewgrouping.typetest) &&
      interviewgrouping.mode === "Online or Interview Test" &&
      Number(interviewgrouping?.questioncount) > restrictionLength
    ) {
      setPopupContentMalert(
        "Please Enter Total Question Count Less than Total Number of Questions Available!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      interviewgrouping.typetest === "Manual" &&
      interviewgrouping.mode === "Online or Interview Test" &&
      Number(interviewgrouping?.countto) > restrictionLength
    ) {
      setPopupContentMalert(
        "Please Enter Total Question Count To Less than Total Number of Questions Available!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Running", "Random"]?.includes(interviewgrouping.typetest) &&
      interviewgrouping.mode === "Typing Test" &&
      Number(interviewgrouping?.questioncount) > restrictionStatusLength
    ) {
      setPopupContentMalert(
        "Please Enter Total Question Count Less than Total Number of Questions Available!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      interviewgrouping.typetest === "Manual" &&
      interviewgrouping.mode === "Typing Test" &&
      Number(interviewgrouping?.countto) > restrictionStatusLength
    ) {
      setPopupContentMalert(
        "Please Enter Total Question Count To Less than Total Number of Questions Available!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      // interviewgrouping.mode !== "Verification/Administrative" &&
      (interviewgrouping.duration === "00:00" ||
        interviewgrouping.duration.includes("Mins"))
    ) {
      setPopupContentMalert("Please Select Duration!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (interviewgrouping.mode === "Questions" ||
        interviewgrouping.mode === "Online or Interview Test" || interviewgrouping.mode === "Verification/Administrative") &&
      (eligibleMarks === "" || eligibleMarks == 0)
    ) {
      setPopupContentMalert("Please Enter Eligible Marks!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (interviewgrouping.mode === "Typing Test" && retestCount === "") {
      setPopupContentMalert("Please Enter Retest Count!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert("Designation and Round Already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isSameQuestion) {
      setPopupContentMalert("Some Questions Already Added in another Round for this Designation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setEligibleMarks(0);
    setEligibleMarksLimit(0);
    setComparisonType("Greater Than or Equal to");
    setInterviewgrouping({
      designation: "Please Select Designation",
      round: "Please Select Round",
      type: "Please Select Type",
      category: "Please Select Category",
      subcategory: [],
      subcategoryarray: [],
      duration: "00:20",
      testname: "Please Select TestName",
      mode: "Please Select Mode",
      roundmode: "Either",
      totalmarks: 0,
    });
    setHours("00");
    setMinutes("20");
    setRetestCount(0);
    setRetestFor("Both");
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
    setSelectedOptionsCate([]);

  };

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

  const [questionOrder, setQuestionOrder] = useState([]);
  useEffect(() => {
    fetchQuestionOrder();
  }, [])
  const fetchQuestionOrder = async () => {
    setPageName(!pageName);
    try {
      let res_check = await axios.get(SERVICE.INTERVIEWQUESTIONSORDER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });


      setQuestionOrder(res_check?.data?.interviewquestionsorders);
      return res_check?.data?.interviewquestionsorders;

    } catch (err) {

      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const [editable, setEditable] = useState(false);
  const [findedQuestionOrder, setFindedQuestionOrder] = useState({});
  const [oldData, setOldData] = useState({})
  //get single row to edit....
  const getCode = async (e) => {
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


      let questiongrping = res?.data?.sinterviewgroupingquestion;
      setOldData(questiongrping)
      let findedQuestionsOrder = questionOrder?.find(data =>
        data?.category === questiongrping?.category &&
        data?.designation === questiongrping?.designation &&
        data?.round === questiongrping?.round &&
        data?.subcategory?.some(item => questiongrping?.subcategory?.includes(item)) &&
        data?.question?.some(item => questiongrping?.question?.includes(item))
      )
      console.log(findedQuestionsOrder, "findedQuestionsOrder")
      setFindedQuestionOrder(findedQuestionsOrder);
      setEditable(findedQuestionsOrder ? true : false);

      let lastsub = Array?.isArray(res?.data?.sinterviewgroupingquestion?.subcategory) ? res?.data?.sinterviewgroupingquestion?.subcategory : [res?.data?.sinterviewgroupingquestion?.subcategory]
      fetchSubCategoryTestName(
        res?.data?.sinterviewgroupingquestion?.category,
        lastsub
      );
      functionTotalCountEdit(
        res?.data?.sinterviewgroupingquestion?.category,
        lastsub
      );

      setRetestCountEdit(
        res?.data?.sinterviewgroupingquestion?.retestcount
          ? res?.data?.sinterviewgroupingquestion?.retestcount
          : 0
      );
      functionStatusAllotEdit(
        res?.data?.sinterviewgroupingquestion?.designation,
        res?.data?.sinterviewgroupingquestion?.category,
        lastsub
      );
      setRetestForEdit(
        res?.data?.sinterviewgroupingquestion?.retestfor === ""
          ? "Both"
          : res?.data?.sinterviewgroupingquestion?.retestfor
      );
      setComparisonTypeEdit(
        res?.data?.sinterviewgroupingquestion?.markcomparison ??
        "Greater Than or Equal to"
      );
      setEligibleMarksEdit(
        res?.data?.sinterviewgroupingquestion?.eligiblemarks ?? 0
      );

      if (res?.data?.sinterviewgroupingquestion?.mode === "Questions") {

        let questionsss = interviewquestionsall?.filter(
          (item) =>
            item?.designation.includes(
              res?.data?.sinterviewgroupingquestion?.designation
            ) &&
            item?.category === res?.data?.sinterviewgroupingquestion.category &&
            res?.data?.sinterviewgroupingquestion.subcategory?.includes(item?.subcategory) &&
            res?.data?.sinterviewgroupingquestion.question?.includes(item?.question)
        )
        let eligilimit = questionsss?.filter(ques => ques?.originalquestionvalues?.questionpreference === "Mandatory")?.length
        setEligibleMarksEditLimit(eligilimit);
      } else if (res?.data?.sinterviewgroupingquestion?.mode === "Verification/Administrative") {
        let questionsss = verificationMaster?.filter(data => data?.category === res?.data?.sinterviewgroupingquestion.category && res?.data?.sinterviewgroupingquestion.subcategory?.includes(data?.subcategory) && res?.data?.sinterviewgroupingquestion.question?.includes(data?.question))
        let eligilimit = questionsss?.filter(ques => ques?.questionpreference === "Mandatory")?.length
        setEligibleMarksEditLimit(eligilimit);
      }

      let findedRound = round?.find(item => item?.nameround === res?.data?.sinterviewgroupingquestion?.round)

      setInterviewgroupingEdit({
        ...res?.data?.sinterviewgroupingquestion,
        modeoptions: findedRound?.questionmode && findedRound?.questionmode?.length > 0 ? findedRound?.questionmode?.map((data) => ({
          label: data,
          value: data,
        })) : null,
        subcategory: Array.isArray(res?.data?.sinterviewgroupingquestion?.subcategory) && res?.data?.sinterviewgroupingquestion?.subcategory?.length > 0 ? res?.data?.sinterviewgroupingquestion?.subcategory?.map(data => ({
          label: data,
          value: data
        })) : [{
          label: res?.data?.sinterviewgroupingquestion?.subcategory,
          value: res?.data?.sinterviewgroupingquestion?.subcategory
        }],
        subcategoryarray: Array.isArray(res?.data?.sinterviewgroupingquestion?.subcategory) && res?.data?.sinterviewgroupingquestion?.subcategory?.length > 0 ? res?.data?.sinterviewgroupingquestion?.subcategory : [res?.data?.sinterviewgroupingquestion?.subcategory]
      });
      setDataAvailableEdit(
        res?.data?.sinterviewgroupingquestion?.interviewForm
      );
      const [hours, minutes] =
        res?.data?.sinterviewgroupingquestion.duration.split(":");
      setHoursEdit(hours);
      setMinutesEdit(minutes);
      setSelectedOptionsCateEdit(
        res?.data?.sinterviewgroupingquestion.interviewForm?.length > 0 ?
          res?.data?.sinterviewgroupingquestion.interviewForm?.map((item) => ({
            ...item,
            label: item.question,
            value: item.question,
          })) : []
      );
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

  useEffect(() => {
    fetchCategoryinterview();
    fetchRound();
    fetchType();
    fetchInterviewquestions();
  }, []);

  //Project updateby edit page...
  let updateby = interviewgroupingEdit?.updatedby;
  let addedby = interviewgroupingEdit?.addedby;

  let subprojectsid = interviewgroupingEdit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    let employ = selectedOptionsCateEdit?.map((item) => item.value);
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.INTERVIEWQUESTIONGROUPING_SINGLE}/${subprojectsid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          totalmarks: Number(
            (interviewgroupingEdit.mode === "Questions" || interviewgroupingEdit.mode === "Verification/Administrative")
              ? employ?.length
              : interviewgroupingEdit?.totalmarks
          ),
          eligiblemarks: Number(eligibleMarksEdit),
          markcomparison: String(comparisonTypeEdit),

          designation: String(interviewgroupingEdit.designation),
          mode: String(interviewgroupingEdit.mode),
          roundmode: String(interviewgroupingEdit.roundmode),
          testname: String(
            interviewgroupingEdit.testname === "Please Select TestName"
              ? ""
              : interviewgroupingEdit.testname
          ),
          typetest: String(
            interviewgroupingEdit.typetest === "Questions"
              ? ""
              : interviewgroupingEdit.typetest
          ),
          questioncount: String(interviewgroupingEdit.questioncount ?? ""),
          countfrom: String(interviewgroupingEdit.countfrom ?? ""),
          countto: String(interviewgroupingEdit.countto ?? ""),
          round: String(interviewgroupingEdit.round),
          type: String(
            interviewgroupingEdit.type === "Please Select Type"
              ? ""
              : interviewgroupingEdit.type
          ),
          category: String(interviewgroupingEdit.category),
          subcategory: Array?.isArray(interviewgroupingEdit.subcategoryarray) && interviewgroupingEdit.subcategoryarray?.length > 0 ? interviewgroupingEdit.subcategoryarray : [interviewgroupingEdit.subcategoryarray],
          duration: String(interviewgroupingEdit.duration),
          retestcount: Number(retestCountEdit),
          question: [...employ],
          interviewForm: dataAvailableEdit,
          retestfor:
            interviewgroupingEdit.mode === "Typing Test" && retestCountEdit > 0
              ? String(retestForEdit)
              : "",
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );

      await axios.put(`${SERVICE.INTERVIEWQUESTIONGROUPING_OVERALLEDIT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        designation: interviewgroupingEdit.designation,
        olddesignation: oldData?.designation,
        round: interviewgroupingEdit.round,
        oldround: oldData?.round,
        category: interviewgroupingEdit.category,
        oldcategory: oldData?.category,
        oldsubcategory: oldData?.subcategory,
        oldquestion: oldData?.question,
        subcategory: Array?.isArray(interviewgroupingEdit.subcategoryarray) && interviewgroupingEdit.subcategoryarray?.length > 0 ? interviewgroupingEdit.subcategoryarray : [interviewgroupingEdit.subcategoryarray],
        type: String(
          interviewgroupingEdit.type === "Please Select Type"
            ? ""
            : interviewgroupingEdit.type
        ),
        oldtype: String(
          oldData.type === "Please Select Type"
            ? ""
            : oldData.type
        ),
        interviewForm: dataAvailableEdit,
        question: [...employ],

        duration: interviewgroupingEdit.duration,

        totalmarks: Number(employ?.length),
        eligiblemarks: Number(eligibleMarksEdit),
        markcomparison: String(comparisonTypeEdit),
      });



      await fetchInterviewgrouping();
      handleCloseModEdit();
      handleCloseOverallEditPopup();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setFilteredChanges(null)
      setFilteredRowData([]);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  //overall edit popup
  const [openOverAllEditPopup, setOpenOverAllEditPopup] = useState(false);
  const [openStatusEditPopup, setOpenStatusEditPopup] = useState(false);
  const handleOpenOverallEditPopup = () => {
    setOpenOverAllEditPopup(true);
  };
  const handleCloseOverallEditPopup = () => {
    setOpenOverAllEditPopup(false);
  };
  const editSubmit = async (e) => {
    e.preventDefault();
    let resdata = await fetchInterviewgroupingall();

    const isNameMatch = resdata.some(
      (item) =>
        item.designation === interviewgroupingEdit.designation &&
        item.round === interviewgroupingEdit.round
    );

    if (interviewgroupingEdit.designation === "Please Select Designation") {
      setPopupContentMalert("Please Select Designation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (interviewgroupingEdit.round === "Please Select Round") {
      setPopupContentMalert("Please Select Round!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (interviewgroupingEdit?.mode === "Please Select Mode") {
      setPopupContentMalert("Please Select Mode!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      interviewgroupingEdit.mode === "Questions" &&
      (interviewgroupingEdit.type === "Please Select Type" ||
        interviewgroupingEdit.type === "")
    ) {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      interviewgroupingEdit?.roundmode === "" ||
      interviewgroupingEdit?.roundmode === undefined
    ) {
      setPopupContentMalert("Please Select Round Mode!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (interviewgroupingEdit.category === "Please Select Category") {
      setPopupContentMalert("Please Select Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      interviewgroupingEdit.subcategory?.length === 0
    ) {
      setPopupContentMalert("Please Select Subcategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      interviewgroupingEdit.mode === "Online or Interview Test" &&
      interviewgroupingEdit.testname === "Please Select TestName"
    ) {
      setPopupContentMalert("Please Select TestName!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (interviewgroupingEdit.mode === "Questions" || interviewgroupingEdit.mode === "Verification/Administrative") &&
      selectedOptionsCateEdit.length == 0
    ) {
      setPopupContentMalert("Please Select Question!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (interviewgroupingEdit.mode === "Online or Interview Test" ||
        interviewgroupingEdit.mode === "Typing Test") &&
      (interviewgroupingEdit?.typetest === "" ||
        interviewgroupingEdit?.typetest == "Please Select Type" ||
        interviewgroupingEdit?.typetest === undefined)
    ) {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Running", "Random"]?.includes(interviewgroupingEdit.typetest) &&
      (interviewgroupingEdit.mode === "Online or Interview Test" ||
        interviewgroupingEdit.mode === "Typing Test") &&
      (interviewgroupingEdit?.questioncount === "" ||
        interviewgroupingEdit?.questioncount == 0 ||
        interviewgroupingEdit?.questioncount === undefined)
    ) {
      setPopupContentMalert("Please Enter Total Questions!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      interviewgroupingEdit.typetest === "Manual" &&
      (interviewgroupingEdit.mode === "Online or Interview Test" ||
        interviewgroupingEdit.mode === "Typing Test") &&
      (interviewgroupingEdit?.countfrom === "" ||
        interviewgroupingEdit?.countfrom == 0 ||
        interviewgroupingEdit?.countfrom === undefined)
    ) {
      setPopupContentMalert("Please Enter Total Question Count From!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      interviewgroupingEdit.typetest === "Manual" &&
      (interviewgroupingEdit.mode === "Online or Interview Test" ||
        interviewgroupingEdit.mode === "Typing Test") &&
      (interviewgroupingEdit?.countto === "" ||
        interviewgroupingEdit?.countto == 0 ||
        interviewgroupingEdit?.countto === undefined)
    ) {
      setPopupContentMalert("Please Enter Total Question Count To!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      interviewgroupingEdit.typetest === "Manual" &&
      (interviewgroupingEdit.mode === "Online or Interview Test" ||
        interviewgroupingEdit.mode === "Typing Test") &&
      Number(interviewgroupingEdit?.countto) <=
      Number(interviewgroupingEdit?.countfrom)
    ) {
      setPopupContentMalert(
        "Total Question Count To Should Greater Than Total Question Count From!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Running", "Random"]?.includes(interviewgroupingEdit.typetest) &&
      interviewgroupingEdit.mode === "Online or Interview Test" &&
      Number(interviewgroupingEdit?.questioncount) > restrictionLengthEdit
    ) {
      setPopupContentMalert(
        "Please Enter Total Question Count Less than Total Number of Questions Available!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      interviewgroupingEdit.typetest === "Manual" &&
      interviewgroupingEdit.mode === "Online or Interview Test" &&
      Number(interviewgroupingEdit?.countto) > restrictionLengthEdit
    ) {
      setPopupContentMalert(
        "Please Enter Total Question Count To Less than Total Number of Questions Available!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Running", "Random"]?.includes(interviewgroupingEdit.typetest) &&
      interviewgroupingEdit.mode === "Typing Test" &&
      Number(interviewgroupingEdit?.questioncount) > restrictionStatusLengthEdit
    ) {
      setPopupContentMalert(
        "Please Enter Total Question Count Less than Total Number of Questions Available!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      interviewgroupingEdit.typetest === "Manual" &&
      interviewgroupingEdit.mode === "Typing Test" &&
      Number(interviewgroupingEdit?.countto) > restrictionStatusLengthEdit
    ) {
      setPopupContentMalert(
        "Please Enter Total Question Count To Less than Total Number of Questions Available!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      // interviewgroupingEdit.mode !== "Verification/Administrative" &&
      (interviewgroupingEdit.duration === "00:00" ||
        interviewgroupingEdit.duration.includes("Mins"))
    ) {
      setPopupContentMalert("Please Select Duration!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (interviewgroupingEdit.mode === "Questions" ||
        interviewgroupingEdit.mode === "Online or Interview Test" || interviewgroupingEdit.mode === "Verification/Administrative") &&
      (eligibleMarksEdit === "" || eligibleMarksEdit == 0)
    ) {
      setPopupContentMalert("Please Enter Eligible Marks!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      interviewgroupingEdit.mode === "Typing Test" &&
      retestCountEdit === ""
    ) {
      setPopupContentMalert("Please Enter Retest Count!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Designation and Round Already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {

      if (editable && ["Questions", "Online or Interview Test"]?.includes(interviewgroupingEdit.mode)) {
        handleOpenOverallEditPopup();
        handleCloseModEdit();
      } else {
        sendEditRequest();
      }
    }
  };

  //get all Sub vendormasters.
  const fetchInterviewgrouping = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.INTERVIEWQUESTIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const itemsWithSerialNumber = res_vendor?.data?.interviewgroupingquestion?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        id: item._id,
        question: item.question?.join(",").toString(),
        questionArray: item.question,
        subcategory: Array?.isArray(item.subcategory) && item.subcategory?.length > 0 ? item.subcategory?.join(",") : item.subcategory,
      }));

      setInterviewgroupingall(itemsWithSerialNumber);
      setReasonmastercheck(true);
    } catch (err) {
      setReasonmastercheck(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //get all Sub vendormasters.
  const fetchInterviewgroupingall = async () => {
    setPageName(!pageName);
    try {
      let res_check = await axios.get(SERVICE.INTERVIEWQUESTIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      return res_check?.data?.interviewgroupingquestion.filter(
        (item) => item._id !== interviewgroupingEdit._id
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

  // Excel
  const fileName = "Interview Question Grouping_Master";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Interview Question Grouping Master",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchInterviewgrouping();
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
      //lockPinned: true,
    },
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
      field: "questioncount",
      headerName: "Total Questions",
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
    {
      field: "retestcount",
      headerName: "Retest Count",
      flex: 0,
      width: 100,
      hide: !columnVisibility.retestcount,
      headerClassName: "bold-header",
    },
    {
      field: "retestfor",
      headerName: "Retest Applicable For",
      flex: 0,
      width: 100,
      hide: !columnVisibility.retestfor,
      headerClassName: "bold-header",
    },
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
          {isUserRoleCompare?.includes("einterviewquestionsgrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getCode(params.data.id, params.data.name);
                // getinterviewvaluesCate(params.data)
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dinterviewquestionsgrouping") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vinterviewquestionsgrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iinterviewquestionsgrouping") && (
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

  const rowDataTable = filteredData?.map((item, index) => {
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
    };
  });

  const rowsWithCheckboxes = rowDataTable?.map((row) => ({
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
  return (
    <Box>
      <Headtitle title={"INTERVIEW GROUPING"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Interview Questions Grouping"
        modulename="Interview"
        submodulename="Interview Creation"
        mainpagename="Interview Questions Grouping"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("ainterviewquestionsgrouping") && (
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Add Interview Question Grouping Master
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Designation<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={alldesignation
                      ?.map((data) => ({
                        label: data.name,
                        value: data.name,
                      }))
                      .filter((item, index, self) => {
                        return (
                          self.findIndex(
                            (i) =>
                              i.label === item.label && i.value === item.value
                          ) === index
                        );
                      })}
                    styles={colourStyles}
                    value={{
                      label: interviewgrouping.designation,
                      value: interviewgrouping.designation,
                    }}
                    onChange={(e) => {
                      setInterviewgrouping({
                        ...interviewgrouping,
                        designation: e.value,
                        round: "Please Select Round",
                        mode: "Please Select Mode",
                        category: "Please Select Category",
                        subcategory: [],
                        subcategoryarray: [],
                      });
                      setSelectedOptionsCate([]);
                      setValueCate([]);
                      setEligibleMarks(0);
                      setEligibleMarksLimit(0);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Round<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={round?.filter((data) => !interviewgroupingall?.some(item => item?.designation === interviewgrouping.designation && item?.round === data?.nameround))}
                    styles={colourStyles}
                    value={{
                      label: interviewgrouping.round,
                      value: interviewgrouping.round,
                    }}
                    onChange={(e) => {
                      setInterviewgrouping({
                        ...interviewgrouping,
                        round: e.value,
                        modeoptions: e?.questionmode && e?.questionmode?.length > 0 ? e.questionmode?.map((data) => ({
                          label: data,
                          value: data,
                        })) : null
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Mode <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={interviewgrouping?.modeoptions || modeOptions}
                    styles={colourStyles}
                    value={{
                      label: interviewgrouping.mode,
                      value: interviewgrouping.mode,
                    }}
                    onChange={(e) => {
                      setInterviewgrouping({
                        ...interviewgrouping,
                        mode: e.value,
                        type: "Please Select Type",
                        typetest: "Please Select Type",
                        category: "Please Select Category",
                        subcategory: [],
                        subcategoryarray: [],
                        testname: "Please Select TestName",
                        duration: "00:20",

                        questioncount: "",
                        countfrom: "",
                        countto: "",
                        totalmarks: 0,
                      });
                      setSubcategorys([]);
                      setIsTestnames([]);
                      setValueCate([]);
                      setSelectedOptionsCate([]);
                      setHours("00");
                      setMinutes("20");
                      setRetestCount(0);
                      setRetestFor("Both");
                      setEligibleMarks(0);
                      setEligibleMarksLimit(0);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Round Mode <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={[
                      {
                        label: "Online",
                        value: "Online",
                      },
                      {
                        label: "Offline",
                        value: "Offline",
                      },
                      {
                        label: "Either",
                        value: "Either",
                      },
                    ]}
                    styles={colourStyles}
                    value={{
                      label: interviewgrouping.roundmode,
                      value: interviewgrouping.roundmode,
                    }}
                    onChange={(e) => {
                      setInterviewgrouping({
                        ...interviewgrouping,
                        roundmode: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              {(interviewgrouping.mode == "Questions" ||
                interviewgrouping.mode == "Typing Test") && (
                  <>
                    {interviewgrouping.mode == "Questions" && (
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Type<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={type}
                            styles={colourStyles}
                            value={{
                              label: interviewgrouping.type,
                              value: interviewgrouping.type,
                            }}
                            onChange={(e) => {
                              setInterviewgrouping({
                                ...interviewgrouping,
                                type: e.value,
                                category: "Please Select Category",
                                subcategory: [],
                                subcategoryarray: [],
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    )}

                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Category<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={
                            interviewgrouping.mode === "Questions"
                              ? [
                                ...typeAll
                                  .filter(
                                    (item) =>
                                      item.nametype ===
                                      interviewgrouping.type &&
                                      item.mode === interviewgrouping.mode
                                  )
                                  .flatMap((item) =>
                                    item.categorytype?.map((categorytype) => ({
                                      label: categorytype,
                                      value: categorytype,
                                    }))
                                  )
                                  .reduce((unique, item) => {
                                    if (
                                      !unique.some(
                                        (elem) =>
                                          elem.label === item.label &&
                                          elem.value === item.value
                                      )
                                    ) {
                                      unique.push(item);
                                    }
                                    return unique;
                                  }, []),
                              ]
                              : [
                                ...new Set(
                                  interviewQuestionSubCategory
                                    ?.filter(
                                      (data) =>
                                        data?.designation?.includes(
                                          interviewgrouping?.designation
                                        ) &&
                                        data.mode === interviewgrouping.mode
                                    )
                                    ?.map((item) => item?.category)
                                ),
                              ]?.map((category) => ({
                                label: category,
                                value: category,
                              }))
                          }
                          styles={colourStyles}
                          value={{
                            label: interviewgrouping.category,
                            value: interviewgrouping.category,
                          }}
                          onChange={(e) => {
                            setInterviewgrouping({
                              ...interviewgrouping,
                              category: e.value,
                              subcategory: [],
                              subcategoryarray: [],
                            });
                            setSelectedOptionsCate([]);
                            setValueCate([]);
                            setEligibleMarks(0);
                            setEligibleMarksLimit(0);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Sub Category<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={
                            interviewgrouping.mode === "Questions"
                              ? Array.from(
                                new Set(
                                  typeAll
                                    .filter(
                                      (item) =>
                                        item?.nametype === interviewgrouping.type &&
                                        item?.categorytype?.includes(interviewgrouping.category) &&
                                        item.mode === interviewgrouping.mode
                                    )
                                    .flatMap((item) =>
                                      item.subcategorytype
                                        .filter(
                                          (subcategorytype) =>
                                            questionSubcategory.some(
                                              (question) =>
                                                question.categoryname === interviewgrouping.category &&
                                                question.subcategoryname?.includes(subcategorytype)
                                            )
                                        )
                                        ?.map((subcategorytype) =>
                                          JSON.stringify({
                                            label: subcategorytype,
                                            value: subcategorytype,
                                          })
                                        )
                                    )
                                )
                              )?.map((str) => JSON.parse(str))
                              : [
                                ...new Set(
                                  interviewQuestionSubCategory
                                    ?.filter(
                                      (data) =>
                                        data?.designation?.includes(
                                          interviewgrouping?.designation
                                        ) &&
                                        data?.category ===
                                        interviewgrouping.category &&
                                        data.mode === interviewgrouping.mode
                                    )
                                    ?.map((item) => item.subcategory)
                                ),
                              ]?.map((subcategory) => ({
                                label: subcategory,
                                value: subcategory,
                              }))
                          }
                          value={interviewgrouping?.subcategory}
                          onChange={(e) => {
                            let valuesOnly = e?.map(data => data?.value)
                            setInterviewgrouping({
                              ...interviewgrouping,
                              subcategory: e,
                              subcategoryarray: valuesOnly,
                              reasonmaster: "Please Select Reason",
                            });
                            functionStatusAllot(
                              interviewgrouping?.designation,
                              interviewgrouping.category,
                              valuesOnly
                            );

                            setSelectedOptionsCate([]);
                            setValueCate([]);
                            setEligibleMarks(0);
                            setEligibleMarksLimit(0);
                          }}
                          valueRenderer={customValueRendererSubCate}
                          labelledBy="Please Select Sub Category"
                        />
                        {/* <Selects
                          options={
                            interviewgrouping.mode === "Questions"
                              ? Array.from(
                                new Set(
                                  typeAll
                                    .filter(
                                      (item) =>
                                        item?.nametype === interviewgrouping.type &&
                                        item?.categorytype?.includes(interviewgrouping.category) &&
                                        item.mode === interviewgrouping.mode
                                    )
                                    .flatMap((item) =>
                                      item.subcategorytype
                                        .filter(
                                          (subcategorytype) =>
                                            questionSubcategory.some(
                                              (question) =>
                                                question.categoryname === interviewgrouping.category &&
                                                question.subcategoryname?.includes(subcategorytype)
                                            )
                                        )
                                        ?.map((subcategorytype) =>
                                          JSON.stringify({
                                            label: subcategorytype,
                                            value: subcategorytype,
                                          })
                                        )
                                    )
                                )
                              )?.map((str) => JSON.parse(str))
                              : [
                                ...new Set(
                                  interviewQuestionSubCategory
                                    ?.filter(
                                      (data) =>
                                        data?.designation?.includes(
                                          interviewgrouping?.designation
                                        ) &&
                                        data?.category ===
                                        interviewgrouping.category &&
                                        data.mode === interviewgrouping.mode
                                    )
                                    ?.map((item) => item.subcategory)
                                ),
                              ]?.map((subcategory) => ({
                                label: subcategory,
                                value: subcategory,
                              }))
                          }
                          styles={colourStyles}
                          value={{
                            label: interviewgrouping.subcategory,
                            value: interviewgrouping.subcategory,
                          }}
                          onChange={(e) => {
                            setInterviewgrouping({
                              ...interviewgrouping,
                              subcategory: e.value,
                              reasonmaster: "Please Select Reason",
                            });
                            functionStatusAllot(
                              interviewgrouping?.designation,
                              interviewgrouping.category,
                              e.value
                            );

                            setSelectedOptionsCate([]);
                            setValueCate([]);
                            setEligibleMarks(0);
                          }}
                        /> */}
                      </FormControl>
                    </Grid>

                    {interviewgrouping.mode == "Questions" && (
                      <>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Questions <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <MultiSelect
                              options={interviewquestionsall?.filter(
                                (item) =>
                                  item?.designation.includes(
                                    interviewgrouping?.designation
                                  ) &&
                                  item?.category === interviewgrouping.category &&
                                  interviewgrouping.subcategoryarray?.includes(item?.subcategory) &&
                                  (interviewgrouping.mode === "Questions"
                                    ? item?.type !== "Typing Test"
                                    : item?.type === "Typing Test")
                              )}
                              value={selectedOptionsCate}
                              onChange={handleQuestionChange}
                              valueRenderer={customValueRendererCate}
                              labelledBy="Please Select Question"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Typography>Total Marks</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              value={valueCate?.length}
                            />
                          </FormControl>
                        </Grid>
                        {/* <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Mark Comparison<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={comparisonoptions}
                            styles={colourStyles}
                            value={{
                              label: comparisonType,
                              value: comparisonType,
                            }}
                            onChange={(e) => {
                              setComparisonType(e.value);
                            }}
                          />
                        </FormControl>
                      </Grid> */}
                        <Grid item md={3} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Eligible Marks <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Please Enter Eligible Marks"
                              value={eligibleMarks}
                              onChange={(e) => {
                                const numericOnly = e.target.value.replace(
                                  /[^0-9.;\s]/g,
                                  ""
                                );
                                if ((Number(numericOnly) <= valueCate?.length && Number(numericOnly) >= Number(eligibleMarksLimit)) || Number(numericOnly) === 0)
                                  setEligibleMarks(numericOnly)
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Mandatory Questions
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              value={eligibleMarksLimit}
                              readOnly
                            />
                          </FormControl>
                        </Grid>
                      </>
                    )}
                  </>
                )}
              {interviewgrouping.mode == "Typing Test" && (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Type<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={[
                          { label: "Running", value: "Running" },
                          { label: "Random", value: "Random" },
                          { label: "Manual", value: "Manual" },
                        ]}
                        styles={colourStyles}
                        value={{
                          label: interviewgrouping.typetest,
                          value: interviewgrouping.typetest,
                        }}
                        onChange={(e) => {
                          setInterviewgrouping({
                            ...interviewgrouping,
                            typetest: e.value,
                            questioncount: "",
                            countfrom: "",
                            countto: "",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {["Running", "Random"]?.includes(
                    interviewgrouping.typetest
                  ) ? (
                    <Grid item md={3} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Total Questions <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlinedname"
                          type="text"
                          value={interviewgrouping.questioncount}
                          onChange={(e) => {
                            setInterviewgrouping({
                              ...interviewgrouping,
                              questioncount:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value)
                                  : "",
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  ) : interviewgrouping.typetest === "Manual" ? (
                    <>
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Total Question Count From<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlinedname"
                            type="text"
                            value={interviewgrouping.countfrom}
                            onChange={(e) => {
                              setInterviewgrouping({
                                ...interviewgrouping,
                                countfrom:
                                  Number(e.target.value) > 0
                                    ? Number(e.target.value)
                                    : "",
                                countto: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Total Question Count To <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlinedname"
                            type="text"
                            disabled={
                              interviewgrouping.countfrom === "" ||
                              Number(interviewgrouping.countfrom) === 0
                            }
                            value={interviewgrouping.countto}
                            onChange={(e) => {
                              setInterviewgrouping({
                                ...interviewgrouping,
                                countto:
                                  Number(e.target.value) > 0
                                    ? Number(e.target.value)
                                    : "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Total Questions
                          </Typography>
                          <OutlinedInput
                            id="component-outlinedname"
                            type="text"
                            value={(Number(interviewgrouping.countto) - Number(interviewgrouping.countfrom) + 1)}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                    </>
                  ) : (
                    ""
                  )}
                </>
              )}
              {interviewgrouping.mode == "Online or Interview Test" && (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Category<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={categorys}
                        styles={colourStyles}
                        value={{
                          label: interviewgrouping.category,
                          value: interviewgrouping.category,
                        }}
                        onChange={(e) => {
                          setInterviewgrouping({
                            ...interviewgrouping,
                            category: e.value,
                            typetest: "Please Select Type",
                            subcategory: [],
                            subcategoryarray: [],
                            testname: "Please Select TestName",
                          });
                          setSelectedOptionsCate([]);
                          setValueCate([]);
                          setEligibleMarks(0);
                          setEligibleMarksLimit(0);
                          setIsTestnames([]);
                          setSubcategorys(
                            e?.subcategoryname?.map((d) => ({
                              ...d,
                              label: d,
                              value: d,
                            }))
                          );
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Sub Category <b style={{ color: "red" }}>*</b>
                      </Typography>

                      <MultiSelect
                        options={subcategorys}
                        value={interviewgrouping?.subcategory}
                        onChange={(e) => {
                          let valuesOnly = e?.map(data => data?.value)
                          fetchSubCategoryBasedDuration(
                            interviewgrouping.category,
                            valuesOnly
                          );
                          functionTotalCount(
                            interviewgrouping.category,
                            valuesOnly
                          );
                          setInterviewgrouping({
                            ...interviewgrouping,
                            subcategory: e,
                            subcategoryarray: valuesOnly,
                            testname: "Please Select TestName",
                          });
                        }}

                        valueRenderer={customValueRendererSubCate}
                        labelledBy="Please Select Sub Category"
                      />
                      {/* <Selects
                        options={subcategorys}
                        styles={colourStyles}
                        value={{
                          label: interviewgrouping.subcategory,
                          value: interviewgrouping.subcategory,
                        }}
                        onChange={(e) => {
                          fetchSubCategoryBasedDuration(
                            interviewgrouping.category,
                            e.value
                          );
                          functionTotalCount(
                            interviewgrouping.category,
                            e.value
                          );
                          setInterviewgrouping({
                            ...interviewgrouping,
                            subcategory: e.value,
                            testname: "Please Select TestName",
                          });
                        }}
                      /> */}
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        TestName <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={isTestNames}
                        styles={colourStyles}
                        value={{
                          label: interviewgrouping.testname,
                          value: interviewgrouping.testname,
                        }}
                        onChange={(e) => {
                          let redur = e?.durationhours?.split(":");
                          setInterviewgrouping({
                            ...interviewgrouping,
                            testname: e.value,
                            duration: redur
                              ? `${redur[0]}:${redur[1]}`
                              : `00:00`,
                          });
                          setHours(redur ? redur[0] : `00`);
                          setMinutes(redur ? redur[1] : `00`);
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Type<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={[
                          { label: "Running", value: "Running" },
                          { label: "Random", value: "Random" },
                          { label: "Manual", value: "Manual" },
                        ]}
                        styles={colourStyles}
                        value={{
                          label: interviewgrouping.typetest,
                          value: interviewgrouping.typetest,
                        }}
                        onChange={(e) => {
                          setInterviewgrouping({
                            ...interviewgrouping,
                            typetest: e.value,
                            questioncount: "",
                            countfrom: "",
                            countto: "",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {["Running", "Random"]?.includes(
                    interviewgrouping.typetest
                  ) ? (
                    <Grid item md={3} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Total Questions <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlinedname"
                          type="text"
                          value={interviewgrouping.questioncount}
                          onChange={(e) => {
                            setInterviewgrouping({
                              ...interviewgrouping,
                              questioncount:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value)
                                  : "",
                              totalmarks:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value)
                                  : "",
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  ) : interviewgrouping.typetest === "Manual" ? (
                    <>
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Total Question Count From<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlinedname"
                            type="text"
                            value={interviewgrouping.countfrom}
                            onChange={(e) => {
                              setInterviewgrouping({
                                ...interviewgrouping,
                                countfrom:
                                  Number(e.target.value) > 0
                                    ? Number(e.target.value)
                                    : "",
                                countto: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Total Question Count To <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlinedname"
                            type="text"
                            disabled={
                              interviewgrouping.countfrom === "" ||
                              Number(interviewgrouping.countfrom) === 0
                            }
                            value={interviewgrouping.countto}
                            onChange={(e) => {
                              setInterviewgrouping({
                                ...interviewgrouping,
                                countto:
                                  Number(e.target.value) > 0
                                    ? Number(e.target.value)
                                    : "",
                                totalmarks:
                                  Number(e.target.value) > 0
                                    ? Number(e.target.value) >
                                      Number(interviewgrouping.countfrom)
                                      ? Number(e.target.value) -
                                      Number(interviewgrouping.countfrom) +
                                      1
                                      : ""
                                    : "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Total Questions
                          </Typography>
                          <OutlinedInput
                            id="component-outlinedname"
                            type="text"
                            value={(Number(interviewgrouping.countto) - Number(interviewgrouping.countfrom) + 1)}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                    </>
                  ) : (
                    ""
                  )}

                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>Total Marks</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={interviewgrouping?.totalmarks}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Eligible Marks <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Eligible Marks"
                        value={eligibleMarks}
                        onChange={(e) => {
                          const numericOnly = e.target.value.replace(
                            /[^0-9.;\s]/g,
                            ""
                          );
                          if (
                            Number(numericOnly) <=
                            Number(interviewgrouping?.totalmarks)
                          )
                            setEligibleMarks(numericOnly);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>
              )}
              <Grid item md={3} xs={12} sm={6}>
                <Typography>
                  Duration (HH:MM)<b style={{ color: "red" }}>*</b>
                </Typography>
                <Grid container spacing={1}>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Selects
                        maxMenuHeight={300}
                        options={hrsOption}
                        placeholder="Hrs"
                        value={{ label: `${hours}`, value: `${hours}` }}
                        onChange={(e) => {
                          setHours(e.value);
                          setInterviewgrouping({
                            ...interviewgrouping,
                            duration: `${e.value}:${minutes}`,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Selects
                        maxMenuHeight={300}
                        options={minsOption}
                        placeholder="Mins"
                        value={{
                          label: `${minutes}`,
                          value: `${minutes}`,
                        }}
                        onChange={(e) => {
                          setMinutes(e.value);
                          setInterviewgrouping({
                            ...interviewgrouping,
                            duration: `${hours}:${e.value}`,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              {interviewgrouping.mode == "Typing Test" && (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Retest Count <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Retest Count"
                        value={retestCount}
                        onChange={(e) => {
                          const numericOnly = e.target.value
                            .replace(/[^0-9.;\s]/g, "")
                            .slice(0, 2);
                          setRetestCount(numericOnly);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Retest Applicable For <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={[
                          {
                            label: "Eligible",
                            value: "Eligible",
                          },
                          {
                            label: "Not Eligible",
                            value: "Not Eligible",
                          },
                          {
                            label: "Both",
                            value: "Both",
                          },
                        ]}
                        styles={colourStyles}
                        value={{
                          label: retestFor,
                          value: retestFor,
                        }}
                        onChange={(e) => {
                          setRetestFor(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>
              )}




              {(interviewgrouping.mode == "Verification/Administrative") && (
                <>


                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Category<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={[
                          ...verificationMaster
                            ?.map((item) => ({
                              label: item?.category,
                              value: item?.category,
                            })
                            )
                            .reduce((unique, item) => {
                              if (
                                !unique.some(
                                  (elem) =>
                                    elem.label === item.label &&
                                    elem.value === item.value
                                )
                              ) {
                                unique.push(item);
                              }
                              return unique;
                            }, []),
                        ]

                        }
                        styles={colourStyles}
                        value={{
                          label: interviewgrouping.category,
                          value: interviewgrouping.category,
                        }}
                        onChange={(e) => {
                          setInterviewgrouping({
                            ...interviewgrouping,
                            category: e.value,
                            subcategory: [],
                            subcategoryarray: [],
                          });
                          setSelectedOptionsCate([]);
                          setValueCate([]);
                          setEligibleMarks(0);
                          setEligibleMarksLimit(0);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Sub Category<b style={{ color: "red" }}>*</b>
                      </Typography>

                      <MultiSelect
                        options={[
                          ...verificationMaster
                            .filter(data => data?.category === interviewgrouping.category)
                            ?.map((item) => ({
                              label: item?.subcategory,
                              value: item?.subcategory,
                            })
                            )
                            .reduce((unique, item) => {
                              if (
                                !unique.some(
                                  (elem) =>
                                    elem.label === item.label &&
                                    elem.value === item.value
                                )
                              ) {
                                unique.push(item);
                              }
                              return unique;
                            }, []),
                        ]

                        }
                        value={interviewgrouping?.subcategory}
                        onChange={(e) => {
                          let valuesOnly = e?.map(data => data?.value)

                          setSelectedOptionsCate([]);
                          setValueCate([]);
                          setEligibleMarks(0);
                          setEligibleMarksLimit(0);
                          setInterviewgrouping({
                            ...interviewgrouping,
                            subcategory: e,
                            subcategoryarray: valuesOnly,
                            reasonmaster: "Please Select Reason",
                          });
                        }}

                        valueRenderer={customValueRendererSubCate}
                        labelledBy="Please Select Sub Category"
                      />
                      {/* <Selects
                        options={[
                          ...verificationMaster
                            .filter(data => data?.category === interviewgrouping.category)
                            ?.map((item) => ({
                              label: item?.subcategory,
                              value: item?.subcategory,
                            })
                            )
                            .reduce((unique, item) => {
                              if (
                                !unique.some(
                                  (elem) =>
                                    elem.label === item.label &&
                                    elem.value === item.value
                                )
                              ) {
                                unique.push(item);
                              }
                              return unique;
                            }, []),
                        ]

                        }
                        styles={colourStyles}
                        value={{
                          label: interviewgrouping.subcategory,
                          value: interviewgrouping.subcategory,
                        }}
                        onChange={(e) => {
                          setInterviewgrouping({
                            ...interviewgrouping,
                            subcategory: e.value,
                            reasonmaster: "Please Select Reason",
                          });
                          setSelectedOptionsCate([]);
                          setValueCate([]);
                          setEligibleMarks(0);
                        }}
                      /> */}
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Questions <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={[
                          ...verificationMaster
                            .filter(data => data?.category === interviewgrouping.category && interviewgrouping.subcategoryarray?.includes(data?.subcategory))
                            ?.map((item) => ({
                              ...item,
                              label: item?.question,
                              value: item?.question,
                            })
                            )
                            .reduce((unique, item) => {
                              if (
                                !unique.some(
                                  (elem) =>
                                    elem.label === item.label &&
                                    elem.value === item.value
                                )
                              ) {
                                unique.push(item);
                              }
                              return unique;
                            }, []),
                        ]

                        }
                        value={selectedOptionsCate}
                        onChange={handleQuestionChangeVerification}
                        valueRenderer={customValueRendererCate}
                        labelledBy="Please Select Question"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>Total Marks</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={valueCate?.length}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Eligible Marks <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Eligible Marks"
                        value={eligibleMarks}
                        onChange={(e) => {
                          const numericOnly = e.target.value.replace(
                            /[^0-9.;\s]/g,
                            ""
                          );
                          if ((Number(numericOnly) <= valueCate?.length && Number(numericOnly) >= Number(eligibleMarksLimit)) || Number(numericOnly) === 0)
                            setEligibleMarks(numericOnly);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Mandatory Questions
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={eligibleMarksLimit}
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={2.5} xs={12} sm={6}>

                <LoadingButton
                  variant="contained"
                  loading={btnSubmit}
                  sx={buttonStyles.buttonsubmit}
                  onClick={handleSubmit}
                >
                  Submit
                </LoadingButton>
              </Grid>
              <Grid item md={2.5} xs={12} sm={6}>
                <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                  Clear
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      )}
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="lg"
          sx={{ marginTop: "50px" }}
        >
          <Box sx={userStyle.dialogbox}>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Interview Question Grouping Master
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Designation<b style={{ color: "red" }}>*</b>
                  </Typography>
                  {!editable

                    ?
                    <Selects
                      options={alldesignation
                        ?.map((data) => ({
                          label: data.name,
                          value: data.name,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      styles={colourStyles}
                      value={{
                        label: interviewgroupingEdit.designation,
                        value: interviewgroupingEdit.designation,
                      }}
                      onChange={(e) => {
                        setInterviewgroupingEdit({
                          ...interviewgroupingEdit,
                          designation: e.value,
                          round: "Please Select Round",
                          mode: "Please Select Mode",
                          category: "Please Select Category",
                          subcategory: [],
                          subcategoryarray: [],
                        });
                        setSelectedOptionsCateEdit([]);
                        setValueCateEdit([]);
                      }}
                    />
                    : <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Interview Question Type"
                      value={interviewgroupingEdit.designation}
                      readOnly
                    />}


                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Round<b style={{ color: "red" }}>*</b>
                  </Typography>

                  {!editable

                    ?
                    <Selects
                      options={round?.filter((data) => !interviewgroupingall?.filter(datum => datum?._id !== interviewgroupingEdit?._id)?.some(item => item?.designation === interviewgroupingEdit.designation && item?.round === data?.nameround))}
                      styles={colourStyles}
                      value={{
                        label: interviewgroupingEdit.round,
                        value: interviewgroupingEdit.round,
                      }}
                      onChange={(e) => {
                        setInterviewgroupingEdit({
                          ...interviewgroupingEdit,
                          round: e.value,
                          modeoptions: e?.questionmode && e?.questionmode?.length > 0 ? e.questionmode?.map((data) => ({
                            label: data,
                            value: data,
                          })) : null
                        });
                      }}
                    /> :
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Interview Question Type"
                      value={interviewgroupingEdit.round}
                      readOnly
                    />}
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Mode <b style={{ color: "red" }}>*</b>
                  </Typography>

                  {!editable

                    ?
                    <Selects
                      options={interviewgroupingEdit?.modeoptions || modeOptions}
                      styles={colourStyles}
                      value={{
                        label: interviewgroupingEdit.mode,
                        value: interviewgroupingEdit.mode,
                      }}
                      onChange={(e) => {
                        setInterviewgroupingEdit({
                          ...interviewgroupingEdit,
                          mode: e.value,
                          category: "Please Select Category",
                          subcategory: [],
                          subcategoryarray: [],
                          type: "Please Select Type",
                          testname: "Please Select TestName",
                        });
                        setSubcategorys([]);
                        setIsTestnames([]);
                        setSelectedOptionsCateEdit([]);
                        setValueCateEdit([]);
                        setHoursEdit("00");
                        setMinutesEdit("20");
                        setRetestCountEdit(0);
                        setRetestForEdit("Both");
                      }}
                    /> :
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Interview Question Type"
                      value={interviewgroupingEdit.mode}
                      readOnly
                    />}
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Round Mode <b style={{ color: "red" }}>*</b>
                  </Typography>

                  {!editable

                    ? <Selects
                      options={[
                        {
                          label: "Online",
                          value: "Online",
                        },
                        {
                          label: "Offline",
                          value: "Offline",
                        },
                        {
                          label: "Either",
                          value: "Either",
                        },
                      ]}
                      styles={colourStyles}
                      value={{
                        label: interviewgroupingEdit.roundmode,
                        value: interviewgroupingEdit.roundmode,
                      }}
                      onChange={(e) => {
                        setInterviewgroupingEdit({
                          ...interviewgroupingEdit,
                          roundmode: e.value,
                        });
                      }}
                    /> :
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Interview Question Type"
                      value={interviewgroupingEdit.roundmode}
                      readOnly
                    />}

                </FormControl>
              </Grid>
              {(interviewgroupingEdit.mode == "Questions" || interviewgroupingEdit.mode == "Verification/Administrative" ||
                interviewgroupingEdit.mode == "Typing Test") && (
                  <>
                    {interviewgroupingEdit.mode == "Questions" && (
                      <Grid item md={6} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Type<b style={{ color: "red" }}>*</b>
                          </Typography>

                          {!editable

                            ? <Selects
                              options={type}
                              styles={colourStyles}
                              value={{
                                label:
                                  interviewgroupingEdit.type === ""
                                    ? "Please Select Type"
                                    : interviewgroupingEdit.type,
                                value:
                                  interviewgroupingEdit.type === ""
                                    ? "Please Select Type"
                                    : interviewgroupingEdit.type,
                              }}
                              onChange={(e) => {
                                setInterviewgroupingEdit({
                                  ...interviewgroupingEdit,
                                  type: e.value,
                                  category: "Please Select Category",
                                  subcategory: [],
                                  subcategoryarray: [],
                                });
                              }}
                            /> :
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Interview Question Type"
                              value={interviewgroupingEdit.type}
                              readOnly
                            />}

                        </FormControl>
                      </Grid>
                    )}


                    {(interviewgroupingEdit.mode == "Questions") && (
                      <>

                        <Grid item md={6} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Category<b style={{ color: "red" }}>*</b>
                            </Typography>

                            {!editable

                              ? <Selects
                                options={
                                  interviewgroupingEdit?.mode === "Questions"
                                    ? [
                                      ...typeAll
                                        .filter(
                                          (item) =>
                                            item.nametype ===
                                            interviewgroupingEdit.type &&
                                            item.mode === interviewgroupingEdit.mode
                                        )
                                        .flatMap((item) =>
                                          item.categorytype?.map((categorytype) => ({
                                            label: categorytype,
                                            value: categorytype,
                                          }))
                                        )
                                        .reduce((unique, item) => {
                                          if (
                                            !unique.some(
                                              (elem) =>
                                                elem.label === item.label &&
                                                elem.value === item.value
                                            )
                                          ) {
                                            unique.push(item);
                                          }
                                          return unique;
                                        }, []),
                                    ]
                                    : [
                                      ...new Set(
                                        interviewQuestionSubCategory
                                          ?.filter(
                                            (data) =>
                                              data?.designation?.includes(
                                                interviewgroupingEdit?.designation
                                              ) &&
                                              data.mode === interviewgroupingEdit.mode
                                          )
                                          ?.map((item) => item?.category)
                                      ),
                                    ]?.map((category) => ({
                                      label: category,
                                      value: category,
                                    }))
                                }
                                styles={colourStyles}
                                value={{
                                  label: interviewgroupingEdit.category,
                                  value: interviewgroupingEdit.category,
                                }}
                                onChange={(e) => {
                                  setInterviewgroupingEdit({
                                    ...interviewgroupingEdit,
                                    category: e.value,
                                    subcategory: [],
                                    subcategoryarray: [],
                                  });
                                  setSelectedOptionsCateEdit([]);
                                  setValueCateEdit([]);
                                }}
                              /> : <OutlinedInput
                                id="component-outlined"
                                type="text"
                                placeholder="Interview Question Type"
                                value={interviewgroupingEdit.category}
                                readOnly
                              />}


                          </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Sub Category<b style={{ color: "red" }}>*</b>
                            </Typography>

                            {!editable

                              ?
                              <MultiSelect
                                options={
                                  interviewgroupingEdit?.mode === "Questions"
                                    ? Array.from(
                                      new Set(
                                        typeAll
                                          .filter(
                                            (item) =>
                                              item?.nametype ===
                                              interviewgroupingEdit.type &&
                                              item?.categorytype?.includes(
                                                interviewgroupingEdit.category
                                              ) &&
                                              item.mode === interviewgroupingEdit.mode
                                          )
                                          .flatMap((item) =>
                                            item.subcategorytype?.map(
                                              (subcategorytype) =>
                                                JSON.stringify({
                                                  label: subcategorytype,
                                                  value: subcategorytype,
                                                })
                                            )
                                          )
                                      )
                                    )?.map((str) => JSON.parse(str))
                                    : [
                                      ...new Set(
                                        interviewQuestionSubCategory
                                          ?.filter(
                                            (data) =>
                                              data?.designation?.includes(
                                                interviewgroupingEdit?.designation
                                              ) &&
                                              data?.category ===
                                              interviewgroupingEdit.category &&
                                              data.mode === interviewgroupingEdit.mode
                                          )
                                          ?.map((item) => item.subcategory)
                                      ),
                                    ]?.map((subcategory) => ({
                                      label: subcategory,
                                      value: subcategory,
                                    }))
                                }
                                styles={colourStyles}
                                value={interviewgroupingEdit.subcategory}
                                onChange={(e) => {
                                  let valuesOnly = e?.map(data => data?.value)
                                  setInterviewgroupingEdit({
                                    ...interviewgroupingEdit,
                                    subcategory: e,
                                    subcategoryarray: valuesOnly,
                                    reason: "Please Select Reason",
                                  });
                                  functionStatusAllotEdit(
                                    interviewgroupingEdit?.designation,
                                    interviewgroupingEdit?.category,
                                    valuesOnly
                                  );
                                  setSelectedOptionsCateEdit([]);
                                  setValueCateEdit([]);

                                  setEligibleMarksEdit(0);
                                  setEligibleMarksEditLimit(0);
                                }}


                                valueRenderer={customValueRendererSubCate}
                                labelledBy="Please Select Sub Category"
                              /> : <>
                                {interviewgroupingEdit?.subcategoryarray?.length !== 0
                                  ? interviewgroupingEdit?.subcategoryarray?.map((data, index) => (
                                    <Typography>
                                      {index + 1}.{data}
                                    </Typography>
                                  ))
                                  : ""}</>}
                            {/* <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Interview Question Type"
                          value={interviewgroupingEdit.subcategory}
                          readOnly
                        /> */}

                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Questions <b style={{ color: "red" }}>*</b>
                            </Typography>

                            <MultiSelect
                              options={interviewquestionsall?.filter(
                                (item) =>
                                  item?.designation.includes(
                                    interviewgroupingEdit?.designation
                                  ) &&
                                  item?.category ===
                                  interviewgroupingEdit.category &&

                                  interviewgroupingEdit?.subcategoryarray?.includes(item?.subcategory) &&
                                  (interviewgroupingEdit.mode === "Questions"
                                    ? item?.type !== "Typing Test"
                                    : item?.type === "Typing Test")
                              )}
                              value={selectedOptionsCateEdit}
                              onChange={handleQuestionChangeEdit}
                              valueRenderer={customValueRendererCateEdit}
                              labelledBy="Please Select Question"
                            /> :
                            {/* <>
                                {selectedOptionsCateEdit.length !== 0
                                  ? selectedOptionsCateEdit?.map((data, index) => (
                                    <Typography>
                                      {index + 1}.{data.value}
                                    </Typography>
                                  ))
                                  : ""}
                              </>
                            } */}

                          </FormControl>
                        </Grid>

                        <Grid item md={3} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Typography>Total Marks</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              value={selectedOptionsCateEdit?.length}
                            />
                          </FormControl>
                        </Grid>
                        {/* <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Mark Comparison<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={comparisonoptions}
                            styles={colourStyles}
                            value={{
                              label: comparisonTypeEdit,
                              value: comparisonTypeEdit,
                            }}
                            onChange={(e) => {
                              setComparisonTypeEdit(e.value);
                            }}
                          />
                        </FormControl>
                      </Grid> */}
                        <Grid item md={3} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Eligible Marks <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Please Enter Eligible Marks"
                              value={eligibleMarksEdit}
                              onChange={(e) => {
                                const numericOnly = e.target.value.replace(
                                  /[^0-9.;\s]/g,
                                  ""
                                );
                                if ((Number(numericOnly) <= selectedOptionsCateEdit?.length && Number(numericOnly) >= Number(eligibleMarksEditLimit)) || Number(numericOnly) === 0)
                                  setEligibleMarksEdit(numericOnly);
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Mandatory Questions
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              value={eligibleMarksEditLimit}
                              readOnly
                            />
                          </FormControl>
                        </Grid>
                      </>
                    )}


                    {(interviewgroupingEdit.mode == "Verification/Administrative") && (
                      <>

                        <Grid item md={6} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Category<b style={{ color: "red" }}>*</b>
                            </Typography>

                            {!editable

                              ? <Selects
                                options={[
                                  ...verificationMaster
                                    ?.map((item) => ({
                                      label: item?.category,
                                      value: item?.category,
                                    })
                                    )
                                    .reduce((unique, item) => {
                                      if (
                                        !unique.some(
                                          (elem) =>
                                            elem.label === item.label &&
                                            elem.value === item.value
                                        )
                                      ) {
                                        unique.push(item);
                                      }
                                      return unique;
                                    }, []),
                                ]

                                }
                                styles={colourStyles}
                                value={{
                                  label: interviewgroupingEdit.category,
                                  value: interviewgroupingEdit.category,
                                }}
                                onChange={(e) => {
                                  setInterviewgroupingEdit({
                                    ...interviewgroupingEdit,
                                    category: e.value,
                                    subcategory: [],
                                    subcategoryarray: [],
                                  });
                                  setSelectedOptionsCateEdit([]);
                                  setValueCateEdit([]);
                                }}
                              /> : <OutlinedInput
                                id="component-outlined"
                                type="text"
                                placeholder="Interview Question Type"
                                value={interviewgroupingEdit.category}
                                readOnly
                              />}


                          </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Sub Category<b style={{ color: "red" }}>*</b>
                            </Typography>

                            {!editable

                              ?
                              <MultiSelect

                                options={[
                                  ...verificationMaster
                                    .filter(data => data?.category === interviewgroupingEdit.category)
                                    ?.map((item) => ({
                                      label: item?.subcategory,
                                      value: item?.subcategory,
                                    })
                                    )
                                    .reduce((unique, item) => {
                                      if (
                                        !unique.some(
                                          (elem) =>
                                            elem.label === item.label &&
                                            elem.value === item.value
                                        )
                                      ) {
                                        unique.push(item);
                                      }
                                      return unique;
                                    }, []),
                                ]

                                }

                                styles={colourStyles}
                                value={interviewgroupingEdit.subcategory}
                                onChange={(e) => {
                                  let valuesOnly = e?.map(data => data?.value)
                                  setInterviewgroupingEdit({
                                    ...interviewgroupingEdit,
                                    subcategory: e,
                                    subcategoryarray: valuesOnly,
                                    reason: "Please Select Reason",
                                  });
                                  functionStatusAllotEdit(
                                    interviewgroupingEdit?.designation,
                                    interviewgroupingEdit?.category,
                                    valuesOnly
                                  );
                                  setSelectedOptionsCateEdit([]);
                                  setValueCateEdit([]);

                                  setEligibleMarksEdit(0);
                                  setEligibleMarksEditLimit(0);
                                }}


                                valueRenderer={customValueRendererSubCate}
                                labelledBy="Please Select Sub Category"
                              /> : <>
                                {interviewgroupingEdit?.subcategoryarray?.length !== 0
                                  ? interviewgroupingEdit?.subcategoryarray?.map((data, index) => (
                                    <Typography>
                                      {index + 1}.{data}
                                    </Typography>
                                  ))
                                  : ""}</>}
                            {/* <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Interview Question Type"
                          value={interviewgroupingEdit.subcategory}
                          readOnly
                        /> */}

                          </FormControl>
                        </Grid>


                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Questions <b style={{ color: "red" }}>*</b>
                            </Typography>

                            <MultiSelect
                              options={[
                                ...verificationMaster
                                  .filter(data => data?.category === interviewgroupingEdit.category && interviewgroupingEdit.subcategoryarray?.includes(data?.subcategory))
                                  ?.map((item) => ({
                                    ...item,
                                    label: item?.question,
                                    value: item?.question,
                                  })
                                  )
                                  .reduce((unique, item) => {
                                    if (
                                      !unique.some(
                                        (elem) =>
                                          elem.label === item.label &&
                                          elem.value === item.value
                                      )
                                    ) {
                                      unique.push(item);
                                    }
                                    return unique;
                                  }, []),
                              ]

                              }
                              value={selectedOptionsCateEdit}
                              onChange={handleQuestionChangeVerificationEdit}
                              valueRenderer={customValueRendererCate}
                              labelledBy="Please Select Question"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Questions <b style={{ color: "red" }}>*</b>
                            </Typography>
                            {!editable

                              ?
                              <MultiSelect
                                options={[
                                  ...verificationMaster
                                    .filter(data => data?.category === interviewgroupingEdit.category && interviewgroupingEdit.subcategoryarray?.includes(data?.subcategory))
                                    ?.map((item) => ({
                                      ...item,
                                      label: item?.question,
                                      value: item?.question,
                                    })
                                    )
                                    .reduce((unique, item) => {
                                      if (
                                        !unique.some(
                                          (elem) =>
                                            elem.label === item.label &&
                                            elem.value === item.value
                                        )
                                      ) {
                                        unique.push(item);
                                      }
                                      return unique;
                                    }, []),
                                ]

                                }
                                value={selectedOptionsCateEdit}
                                onChange={handleQuestionChangeVerificationEdit}
                                valueRenderer={customValueRendererCateEdit}
                                labelledBy="Please Select Question"
                              /> : <>
                                {selectedOptionsCateEdit.length !== 0
                                  ? selectedOptionsCateEdit?.map((data, index) => (
                                    <Typography>
                                      {index + 1}.{data.value}
                                    </Typography>
                                  ))
                                  : ""}
                              </>
                            }

                          </FormControl>
                        </Grid>

                        <Grid item md={3} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Typography>Total Marks</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              value={selectedOptionsCateEdit?.length}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item md={3} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Eligible Marks <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Please Enter Eligible Marks"
                              value={eligibleMarksEdit}
                              onChange={(e) => {
                                const numericOnly = e.target.value.replace(
                                  /[^0-9.;\s]/g,
                                  ""
                                );

                                if ((Number(numericOnly) <= selectedOptionsCateEdit?.length && Number(numericOnly) >= Number(eligibleMarksEditLimit)) || Number(numericOnly) === 0)
                                  setEligibleMarksEdit(numericOnly);
                              }}

                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Mandatory Questions
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              value={eligibleMarksEditLimit}
                              readOnly
                            />
                          </FormControl>
                        </Grid>

                      </>
                    )}
                  </>
                )}

              {interviewgroupingEdit.mode == "Typing Test" && (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Type<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={[
                          { label: "Running", value: "Running" },
                          { label: "Random", value: "Random" },
                          { label: "Manual", value: "Manual" },
                        ]}
                        styles={colourStyles}
                        value={{
                          label:
                            interviewgroupingEdit.typetest === ""
                              ? "Please Select Type"
                              : interviewgroupingEdit.typetest,
                          value:
                            interviewgroupingEdit.typetest === ""
                              ? "Please Select Type"
                              : interviewgroupingEdit.typetest,
                        }}
                        onChange={(e) => {
                          setInterviewgroupingEdit({
                            ...interviewgroupingEdit,
                            typetest: e.value,
                            questioncount: "",
                            countfrom: "",
                            countto: "",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {["Running", "Random"]?.includes(
                    interviewgroupingEdit.typetest
                  ) ? (
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Total Questions <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlinedname"
                          type="text"
                          value={interviewgroupingEdit.questioncount}
                          onChange={(e) => {
                            setInterviewgroupingEdit({
                              ...interviewgroupingEdit,
                              questioncount:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value)
                                  : "",
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  ) : interviewgroupingEdit.typetest === "Manual" ? (
                    <>
                      <Grid item md={4} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Total Question Count From<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlinedname"
                            type="text"
                            value={interviewgroupingEdit.countfrom}
                            onChange={(e) => {
                              setInterviewgroupingEdit({
                                ...interviewgroupingEdit,
                                countfrom:
                                  Number(e.target.value) > 0
                                    ? Number(e.target.value)
                                    : "",
                                countto: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Total Question Count To <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlinedname"
                            type="text"
                            disabled={
                              interviewgroupingEdit.countfrom === "" ||
                              Number(interviewgroupingEdit.countfrom) === 0
                            }
                            value={interviewgroupingEdit.countto}
                            onChange={(e) => {
                              setInterviewgroupingEdit({
                                ...interviewgroupingEdit,
                                countto:
                                  Number(e.target.value) > 0
                                    ? Number(e.target.value)
                                    : "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Total Questions
                          </Typography>
                          <OutlinedInput
                            id="component-outlinedname"
                            type="text"
                            value={(Number(interviewgroupingEdit.countto) - Number(interviewgroupingEdit.countfrom) + 1)}

                            readOnly
                          />
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
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Category<b style={{ color: "red" }}>*</b>
                      </Typography>
                      {/* <Selects
                        options={categorys}
                        styles={colourStyles}
                        value={{
                          label: interviewgroupingEdit.category,
                          value: interviewgroupingEdit.category,
                        }}
                        onChange={(e) => {
                          setInterviewgroupingEdit({
                            ...interviewgroupingEdit,
                            category: e.value,
                            type: "Please Select Type",
                            subcategory: [],
                            subcategoryarray:[],
                            testname: "Please Select TestName",
                          });
                          setIsTestnames([]);
                          setSelectedOptionsCateEdit([]);
                          setValueCateEdit([]);
                          setSubcategorys(
                            e?.subcategoryname?.map((d) => ({
                              ...d,
                              label: d,
                              value: d,
                            }))
                          );
                        }}
                      /> */}
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Interview Question Type"
                        value={interviewgroupingEdit.category}
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Sub Category <b style={{ color: "red" }}>*</b>
                      </Typography>
                      {interviewgroupingEdit?.subcategoryarray?.length !== 0
                        ? interviewgroupingEdit?.subcategoryarray?.map((data, index) => (
                          <Typography>
                            {index + 1}.{data}
                          </Typography>
                        ))
                        : ""}
                      {/* <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Interview Question Type"
                        value={interviewgroupingEdit.subcategory}
                        readOnly
                      /> */}
                      {/* <Selects
                        options={subcategorys}
                        styles={colourStyles}
                        value={{
                          label: interviewgroupingEdit.subcategory,
                          value: interviewgroupingEdit.subcategory,
                        }}
                        onChange={(e) => {
                          fetchSubCategoryBasedDuration(
                            interviewgroupingEdit.category,
                            e.value
                          );
                          functionTotalCountEdit(
                            interviewgroupingEdit?.category,
                            e.value
                          );
                          setInterviewgroupingEdit({
                            ...interviewgroupingEdit,
                            subcategory: e.value,
                            testname: "Please Select TestName",
                          });
                        }}
                      /> */}
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        TestName <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Interview Question Type"
                        value={interviewgroupingEdit.testname}
                        readOnly
                      />
                      {/* <Selects
                        options={isTestNames}
                        styles={colourStyles}
                        value={{
                          label: interviewgroupingEdit.testname,
                          value: interviewgroupingEdit.testname,
                        }}
                        onChange={(e) => {
                          let redur = e?.durationhours?.split(":");
                          setInterviewgroupingEdit({
                            ...interviewgroupingEdit,
                            testname: e.value,
                            duration: `${redur[0]}:${redur[1]}`,
                          });
                          setHoursEdit(redur[0]);
                          setMinutesEdit(redur[1]);
                        }}
                      /> */}
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Type<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={[
                          { label: "Running", value: "Running" },
                          { label: "Random", value: "Random" },
                          { label: "Manual", value: "Manual" },
                        ]}
                        styles={colourStyles}
                        value={{
                          label: interviewgroupingEdit.typetest,
                          value: interviewgroupingEdit.typetest,
                        }}
                        onChange={(e) => {
                          setInterviewgroupingEdit({
                            ...interviewgroupingEdit,
                            typetest: e.value,
                            questioncount: "",
                            countfrom: "",
                            countto: "",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {["Running", "Random"]?.includes(
                    interviewgroupingEdit.typetest
                  ) ? (
                    <Grid item md={3} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Total Questions <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlinedname"
                          type="text"
                          value={interviewgroupingEdit.questioncount}
                          onChange={(e) => {
                            setInterviewgroupingEdit({
                              ...interviewgroupingEdit,
                              questioncount:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value)
                                  : "",
                              totalmarks:
                                Number(e.target.value) > 0
                                  ? Number(e.target.value)
                                  : "",
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  ) : interviewgroupingEdit.typetest === "Manual" ? (
                    <>
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Total Question Count From<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlinedname"
                            type="text"
                            value={interviewgroupingEdit.countfrom}
                            onChange={(e) => {
                              setInterviewgroupingEdit({
                                ...interviewgroupingEdit,
                                countfrom:
                                  Number(e.target.value) > 0
                                    ? Number(e.target.value)
                                    : "",
                                countto: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Total Question Count To <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlinedname"
                            type="text"
                            disabled={
                              interviewgroupingEdit.countfrom === "" ||
                              Number(interviewgroupingEdit.countfrom) === 0
                            }
                            value={interviewgroupingEdit.countto}
                            onChange={(e) => {
                              setInterviewgroupingEdit({
                                ...interviewgroupingEdit,
                                countto:
                                  Number(e.target.value) > 0
                                    ? Number(e.target.value)
                                    : "",
                                totalmarks:
                                  Number(e.target.value) > 0
                                    ? Number(e.target.value) >
                                      Number(interviewgroupingEdit.countfrom)
                                      ? Number(e.target.value) -
                                      Number(
                                        interviewgroupingEdit.countfrom
                                      ) +
                                      1
                                      : ""
                                    : "",
                              });
                              setEligibleMarksEdit(0);
                              setEligibleMarksEditLimit(0)
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Total Questions
                          </Typography>
                          <OutlinedInput
                            id="component-outlinedname"
                            type="text"
                            value={(Number(interviewgroupingEdit.countto) - Number(interviewgroupingEdit.countfrom) + 1)}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                    </>
                  ) : (
                    ""
                  )}
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>Total Marks</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={interviewgroupingEdit?.totalmarks}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Eligible Marks <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Eligible Marks"
                        value={eligibleMarksEdit}
                        onChange={(e) => {
                          const numericOnly = e.target.value.replace(
                            /[^0-9.;\s]/g,
                            ""
                          );
                          if (
                            Number(numericOnly) <=
                            Number(interviewgroupingEdit?.totalmarks)
                          )
                            setEligibleMarksEdit(numericOnly);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>
              )}

              {interviewgroupingEdit.mode == "Typing Test" && (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Retest Count <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Retest Count"
                        value={retestCountEdit}
                        onChange={(e) => {
                          const numericOnly = e.target.value
                            .replace(/[^0-9.;\s]/g, "")
                            .slice(0, 2);
                          setRetestCountEdit(numericOnly);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Retest Applicable For <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={[
                          {
                            label: "Eligible",
                            value: "Eligible",
                          },
                          {
                            label: "Not Eligible",
                            value: "Not Eligible",
                          },
                          {
                            label: "Both",
                            value: "Both",
                          },
                        ]}
                        styles={colourStyles}
                        value={{
                          label: retestForEdit,
                          value: retestForEdit,
                        }}
                        onChange={(e) => {
                          setRetestForEdit(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>
              )}

              <Grid item md={6} xs={12} sm={12}>
                <Typography>
                  Duration (HH:MM)<b style={{ color: "red" }}>*</b>
                </Typography>
                <Grid container spacing={1}>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Selects
                        maxMenuHeight={300}
                        options={hrsOption}
                        placeholder="Hrs"
                        value={{
                          label: `${hoursEdit}`,
                          value: `${hoursEdit}`,
                        }}
                        onChange={(e) => {
                          setHoursEdit(e.value);
                          setInterviewgroupingEdit({
                            ...interviewgroupingEdit,
                            duration: `${e.value}:${minutesEdit}`,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Selects
                        maxMenuHeight={300}
                        options={minsOption}
                        placeholder="Mins"
                        value={{
                          label: `${minutesEdit}`,
                          value: `${minutesEdit}`,
                        }}
                        onChange={(e) => {
                          setMinutesEdit(e.value);
                          setInterviewgroupingEdit({
                            ...interviewgroupingEdit,
                            duration: `${hoursEdit}:${e.value}`,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

            </Grid>
            <br />

            <br />

            <Grid container spacing={2}>
              <Grid item md={6} xs={6} sm={6}>
                <Button
                  variant="contained"
                  type="submit"
                  onClick={editSubmit}
                  sx={buttonStyles.buttonsubmit}
                >
                  Update
                </Button>
              </Grid>
              <Grid item md={6} xs={6} sm={6}>
                <Button
                  sx={buttonStyles.btncancel}
                  onClick={handleCloseModEdit}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("linterviewquestionsgrouping") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                {" "}
                List Interview Question Grouping Master
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
                    "excelinterviewquestionsgrouping"
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
                    "csvinterviewquestionsgrouping"
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
                    "printinterviewquestionsgrouping"
                  ) && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes(
                    "pdfinterviewquestionsgrouping"
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
                    "imageinterviewquestionsgrouping"
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
            {isUserRoleCompare?.includes("bdinterviewquestionsgrouping") && (
              <Button
                variant="contained"
                sx={buttonStyles.buttonbulkdelete}
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
            )}
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
              View Interview Question Grouping
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
                  <Typography>{Array?.isArray(interviewgroupingEdit.subcategory) && interviewgroupingEdit.subcategory?.length > 0 ? interviewgroupingEdit.subcategory?.join(",") : interviewgroupingEdit.subcategory}</Typography>
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
                        <Typography variant="h6">Total Questions</Typography>
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
                            Total Question Count From
                          </Typography>
                          <Typography>
                            {interviewgroupingEdit.countfrom}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={4} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">
                            Total Question Count To
                          </Typography>
                          <Typography>
                            {interviewgroupingEdit.countto}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={4} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">
                            Total Questions
                          </Typography>
                          <Typography>
                            {(Number(interviewgroupingEdit.countto) - Number(interviewgroupingEdit.countfrom) + 1)}                          </Typography>
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
                        <Typography variant="h6">Total Questions</Typography>
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
                            Total Question Count From
                          </Typography>
                          <Typography>
                            {interviewgroupingEdit.countfrom}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={4} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">
                            Total Question Count To
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
                            ?.map((item) => `${item}`)
                            .join(",")
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
      {/* bulk edit popup */}
      <Dialog
        open={openOverAllEditPopup}
        onClose={handleCloseOverallEditPopup}
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
            This Questions was used in Question Order Page, That may also change!. Are
            you sure? <br />
            <span style={{ color: "green", fontSize: "15px" }}>
              But Does not reflect for already Interview Scheduled Candidate.
            </span>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseOverallEditPopup}
            variant="outlined"
            sx={buttonStyles.btncancel}
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => sendEditRequest()}
            autoFocus
            variant="contained"
            color="error"
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
              {selectedRows?.length === 0 ? (
                <>
                  The Datas in the selected rows are already used in some pages,
                  you can't delete.
                </>
              ) : (
                <>
                  Are you sure? Only {selectedRows?.length} datas can be deleted
                  remaining are used in some pages.
                </>
              )}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseModcheckbox}
              sx={buttonStyles.btncancel}
            >
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delCheckpointticketcheckbox(e)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

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
        filename={"Interview Question Grouping"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Interview Question Grouping Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delCheckpointticket}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
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
    </Box>
  );
}

export default Interviewgroupingquestion;
