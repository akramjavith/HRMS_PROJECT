import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
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
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
  FaFileCsv,
  FaFileExcel,
  FaFilePdf,
  FaPlus,
  FaPrint,
} from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
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
import domtoimage from 'dom-to-image';
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import {
  candidatestatusOption,
  workmodeOption,
  question_preference
} from "../../components/Componentkeyword";

function OnlineQuestionTest() {
  const [submitLoader, setSubmitLoader] = useState(false);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setSubmitLoader(false);
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setSubmitLoader(false);
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  let exportColumnNames = [
    "Category",
    "Subcategory",
    "QuestionType",
    "Question",
    "Type",
    "Options",
    "Status",
    "Answers",
    "Candidate Status",
    "Work Mode",
  ];
  let exportRowValues = [
    "category",
    "subcategory",
    "questiontype",
    "question",
    "type",
    "options",
    "status",
    "answers",
    "candidatestatusexp",
    "workmode",
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

  const [questionType, setQuestionType] = useState(
    "Please Select Question Type"
  );
  const [questionTypeEdit, setQuestionTypeEdit] = useState(
    "Please Select Question Type"
  );

  const [type, setType] = useState("Please Select Type");
  const [category, setCategory] = useState("Please Select Category");
  const [categoryEdit, setCategoryEdit] = useState("Please Select SubCategory");
  const [subCategoryEdit, setSubCategoryEdit] = useState(
    "Please Select Category"
  );
  const [categoryOption, setCategoryOption] = useState([]);
  const [subCategoryOption, setSubCategoryOption] = useState([]);
  const [selectedSubCategoryOptions, setSelectedSubCategoryOptions] = useState(
    []
  );
  let [valueSubCategory, setValueSubCategory] = useState([]);
  const [subCategoryOptionEdit, setSubCategoryOptionEdit] = useState([]);
  const [typeEdit, setTypeEdit] = useState("Please Select Type");
  const [date, setDate] = useState("");
  const [dateEdit, setDateEdit] = useState("");
  const [documentFiles, setdocumentFiles] = useState([]);
  const [documentFilesEdit, setdocumentFilesEdit] = useState([]);
  const [status, setStatus] = useState("Please Select Status");
  const [todoSubmit, setTodoSubmit] = useState(false);
  const [statusEdit, setStatusEdit] = useState("Please Select Status");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState("");
  const [tamilOptions, setTamilOptions] = useState("");
  const [optionsText, setOptionsText] = useState("");
  const [optionsTextEdit, setOptionsTextEdit] = useState("");
  const [optionsEdit, setOptionsEdit] = useState("");
  const [tamilOptionsEdit, setTamilOptionsEdit] = useState("");
  const [optionstodo, setOptionstodo] = useState([]);
  const [optionstodoEdit, setOptionstodoEdit] = useState([]);

  const testingtpeopt = [
    { label: "Numeric", value: "Numeric" },
    { label: "Alpha-Numeric", value: "Alpha-Numeric" },
    { label: "Alpha-Numeric with Image", value: "Alpha-Numeric with Image" },
  ];
  const hasTamilWord = (sentence) => /[\u0B80-\u0BFF]+/.test(sentence);

  const addTodo = () => {
    const isSubNameMatch = optionstodo.some(
      (item) => item.options.toLowerCase() === options.toLowerCase()
    );
    if ((type === "Radio" || type === "MultipleChoice") && options === "") {
      setPopupContentMalert("Please Enter Options!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if ((type === "Radio" || type === "MultipleChoice") && tamilOptions === "") {
    //   setPopupContentMalert("Please Enter Options in Tamil (விருப்பங்கள்)!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else if ((type === "Radio" || type === "MultipleChoice") && tamilOptions !== "" && !hasTamilWord(tamilOptions)) {
      setPopupContentMalert("Please Enter atleast one word in Tamil (விருப்பங்கள்)!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      (type === "Radio" || type === "MultipleChoice") &&
      status === "Please Select Status"
    ) {
      setPopupContentMalert("Please Select Status!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (status === "Please Select Status" || status === "") &&
      type !== "Yes/No" &&
      type !== "Correct/In Correct"
    ) {
      setPopupContentMalert("Please Select Status!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isSubNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another Options!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      if (type === "Radio" || type === "MultipleChoice") {
        const data = {
          options: options,
          tamiloptions: tamilOptions,
          status: status,
          type: type,
        };
        setOptionstodo([...optionstodo, data]);
        setOptions("");
        setTamilOptions("");
        setStatus("Please Select Status");
      } else if (type === "Yes/No") {
        const data = [
          {
            options: "Yes",
            type: type,
            tamiloptions: "ஆம்",
            status: "Eligible",
          },
          {
            options: "No",
            tamiloptions: "இல்லை ",
            status: "Not-Eligible",
            type: type,
          },
        ];
        setOptionstodo(data);
        setOptions("");
        setTamilOptions("");
        setStatus("Please Select Status");
      } else if (type === "Correct/In Correct") {
        const data = [
          {
            options: "Correct",
            status: "Eligible",
            tamiloptions: "சரி",
            type: type,
          },
          {
            options: "In Correct",
            status: "Not-Eligible",
            tamiloptions: "தவறு",
            type: type,
          },
        ];
        setOptionstodo(data);
        setOptions("");
        setTamilOptions("");
        setStatus("Please Select Status");
      }
    }
  };

  const statusOption = [
    {
      label: "Eligible",
      value: "Eligible",
    },
    {
      label: "Not-Eligible",
      value: "Not-Eligible",
    },
    {
      label: "Manual Decision",
      value: "Manual Decision",
    },
  ];

  const handleTodoEdit = (index, value, newValue) => {
    const isSubNameMatch = optionstodo.some(
      (item) =>
        item.options.toLowerCase() === options.toLowerCase() &&
        item.status.toLowerCase() === status.toLowerCase()
    );
    if (isSubNameMatch) {
      // Handle duplicate case, show an error message, and return early

      setPopupContentMalert("Already Added! Please Enter Another data!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    } else {
      if (
        value === "options" &&
        optionstodo.some(
          (item) => item?.options.toLowerCase() === newValue?.toLowerCase()
        )
      ) {
        setPopupContentMalert("Already Added ! Please Enter Another Options!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        return;
      }
    }
    const updatedTodos = [...optionstodo];
    if (value === "options") {
      updatedTodos[index].options = newValue;
    } else if (value === "tamiloptions") {
      updatedTodos[index].tamiloptions = newValue;
    } else if (value === "description") {
      updatedTodos[index].description = newValue;
    } else {
      updatedTodos[index].status = newValue;
    }
    setOptionstodo(updatedTodos);
  };

  const deleteTodo = (index) => {
    const updatedTodos = [...optionstodo];
    updatedTodos.splice(index, 1);
    setOptionstodo(updatedTodos);
  };

  const handleResumeUpload = (event) => {
    const resume = event.target.files;

    const reader = new FileReader();
    const file = resume[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
      setdocumentFiles([
        {
          name: file.name,
          preview: reader.result,
          // data: reader.result.split(",")[1],
          remark: "Question Image",
        },
      ]);
    };
  };

  //Rendering File
  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const handleFileDelete = (index) => {
    setdocumentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const addTodoEdit = () => {
    const isSubNameMatch = optionstodoEdit.some(
      (item) => item.options.toLowerCase() === optionsEdit.toLowerCase()
    );
    if (
      (typeEdit === "Radio" || typeEdit === "MultipleChoice") &&
      optionsEdit === ""
    ) {
      setPopupContentMalert("Please Enter Options!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (
    //   (typeEdit === "Radio" || typeEdit === "MultipleChoice") &&
    //   tamilOptionsEdit === ""
    // ) {
    //   setPopupContentMalert("Please Enter Options in Tamil (விருப்பங்கள்)!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else if (
      (typeEdit === "Radio" || typeEdit === "MultipleChoice") &&
      tamilOptionsEdit !== "" && !hasTamilWord(tamilOptionsEdit)
    ) {
      setPopupContentMalert("Please Enter Atleast One Word in Tamil (விருப்பங்கள்)!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      (typeEdit === "Radio" || typeEdit === "MultipleChoice") &&
      statusEdit === "Please Select Status"
    ) {
      setPopupContentMalert("Please Select Status!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      statusEdit === "Please Select Status" &&
      typeEdit !== "Yes/No" &&
      typeEdit !== "Correct/In Correct"
    ) {
      setPopupContentMalert("Please Select Status!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isSubNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another Options!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      if (typeEdit === "Radio" || typeEdit === "MultipleChoice") {
        const data = {
          options: optionsEdit,
          tamiloptions: tamilOptionsEdit,
          status: statusEdit,
          type: typeEdit,
        };
        setOptionstodoEdit([...optionstodoEdit, data]);
        setOptionsEdit("");
        setTamilOptionsEdit("");
        setStatusEdit("Please Select Status");
      } else if (typeEdit === "Yes/No") {
        const data = [
          {
            options: "Yes",
            tamiloptions: "ஆம்",
            type: typeEdit,
            status: "Eligible",
          },
          {
            options: "No",
            tamiloptions: "இல்லை ",
            status: "Not-Eligible",
            type: typeEdit,
          },
        ];
        setOptionstodoEdit(data);
        setOptionsEdit("");
        setTamilOptionsEdit("");
        setStatusEdit("Please Select Status");
      } else if (typeEdit === "Correct/In Correct") {
        const data = [
          {
            options: "Correct",
            tamiloptions: "சரி",
            status: "Eligible",
            type: typeEdit,
          },
          {
            options: "In Correct",
            tamiloptions: "தவறு",
            status: "Not-Eligible",
            type: typeEdit,
          },
        ];
        setOptionstodoEdit(data);
        setOptionsEdit("");
        setTamilOptionsEdit("");
        setStatusEdit("Please Select Status");
      }
    }
  };

  const handleTodoEditPage = (index, value, newValue) => {
    const isSubNameMatch = optionstodoEdit.some(
      (item) =>
        item.options.toLowerCase() === optionsEdit.toLowerCase() &&
        item.status.toLowerCase() === statusEdit.toLowerCase()
    );
    if (isSubNameMatch) {
      // Handle duplicate case, show an error message, and return early

      setPopupContentMalert("Already Added ! Please Enter Another data!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    } else {
      if (
        value === "options" &&
        optionstodoEdit.some(
          (item) => item?.options.toLowerCase() === newValue?.toLowerCase()
        )
      ) {
        setPopupContentMalert("Already Added ! Please Enter Another Options!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        return;
      }
    }
    const updatedTodos = [...optionstodoEdit];
    if (value === "options") {
      updatedTodos[index].options = newValue;
    }
    else if (value === "tamiloptions") {
      updatedTodos[index].tamiloptions = newValue;
    }
    else if (value === "description") {
      updatedTodos[index].description = newValue;
    } else {
      updatedTodos[index].status = newValue;
    }
    setOptionstodoEdit(updatedTodos);
  };

  const deleteTodoEdit = (index) => {
    const updatedTodos = [...optionstodoEdit];
    updatedTodos.splice(index, 1);
    setOptionstodoEdit(updatedTodos);
  };

  const handleResumeUploadEdit = (event) => {
    const resume = event.target.files;

    const reader = new FileReader();
    const file = resume[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
      setdocumentFilesEdit([
        {
          name: file.name,
          preview: reader.result,
          data: reader.result.split(",")[1],
          remark: "Question Image",
        },
      ]);
    };
  };

  const renderFilePreviewEdit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const handleFileDeleteEdit = (index) => {
    setdocumentFilesEdit((prevFiles) =>
      prevFiles.filter((_, i) => i !== index)
    );
  };

  const [roundmasterEdit, setRoundmasterEdit] = useState([]);
  const [roundmasters, setRoundmasters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allRoundmasteredit, setAllRoundmasteredit] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [roundmasterCheck, setRoundmastercheck] = useState(false);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");



  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Online/Interview Test Master.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };
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
      pagename: String("Online/Interview Test Master"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess.companyname),
          date: String(new Date()),
        },
      ],
    });
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();

  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
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
  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
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
    question: true,
    category: true,
    subcategory: true,
    type: true,
    options: true,
    answers: true,
    dateRange: true,
    date: true,
    status: true,
    questiontype: true,
    actions: true,
    candidatestatusexp: true,
    workmode: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [deleteRound, setDeleteRound] = useState("");
  const fetchCategory = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.CATEGORYINTERVIEW, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const catall = [
        ...res.data.interviewcategory?.filter(data => data?.mode === "Online or Interview Test")
          .map((d) => ({
            ...d,
            label: d.categoryname,
            value: d.categoryname,
          }))
          .filter((item, index, self) => {
            return (
              self.findIndex(
                (i) => i.label === item.label && i.value === item.value
              ) === index
            );
          }),
      ];
      setCategoryOption(catall);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const fetchSubCategory = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.CATEGORYINTERVIEW, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const catall = res.data.interviewcategory
        .filter((data) => data.categoryname === e)
        .flatMap((d) => d.subcategoryname);
      setSubCategoryOption(
        catall?.map((data) => ({ label: data, value: data }))
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
  const fetchSubCategoryEdit = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.CATEGORYINTERVIEW, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const catall = res.data.interviewcategory
        .filter((data) => data.categoryname === e)
        .flatMap((d) => d.subcategoryname);
      setSubCategoryOptionEdit(
        catall?.map((data) => ({ label: data, value: data }))
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

  const handleSubCategoryChange = (options) => {
    setValueSubCategory(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedSubCategoryOptions(options);
  };

  const customValueRendererCate = (valueCate, _days) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Sub-Category";
  };

  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(
        `${SERVICE.SINGLE_ONLINE_TEST_QUESTION}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setDeleteRound(res?.data?.sonlinetestquestions);
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

  // Alert delete popup
  let Roundsid = deleteRound?._id;
  const delRound = async () => {
    setPageName(!pageName);
    try {
      if (Roundsid) {
        await axios.delete(
          `${SERVICE.SINGLE_ONLINE_TEST_QUESTION}/${Roundsid}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
        handleCloseMod();
        setSelectedRows([]);
        setPage(1);
        setFilteredChanges(null)
        setFilteredRowData([]);
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        await fetchRoundmaster();

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

  const delRoundcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_ONLINE_TEST_QUESTION}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      setFilteredChanges(null)
      setFilteredRowData([]);

      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchRoundmaster();

    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //add function
  const sendRequest = async (data) => {
    setPageName(!pageName);
    try {
      await axios.post(SERVICE.CREATE_ONLINE_TEST_QUESTION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        question: question,
        category: category,
        subcategory: data,
        type: type,
        questiontype: String(questionType),
        optionArr:
          type === "Radio" ||
            type === "MultipleChoice" ||
            type === "Yes/No" ||
            type === "Correct/In Correct"
            ? optionstodo
            : [],
        answers:
          type === "TextBox" || type === "Text-Alpha" || type === "Text-Numeric"
            ? optionsText === ""
              ? "No Answer"
              : optionsText
            : "",
        documentFiles: documentFiles,
        candidatestatusexp: filterState?.candidatestatusexp?.length ? filterState?.candidatestatusexp?.map(data => data?.value) : [],
        workmode: filterState?.workmode?.length ? filterState?.workmode?.map(data => data?.value) : [],
        questionpreference: filterState?.questionpreference || "Default",
        questiondescription: filterState?.questiondescription || "",
        tamilquestion: filterState?.tamilquestion || "",
        tamilquestiondescription: filterState?.tamilquestiondescription || "",
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchRoundmaster();
      // setQuestion("");
      // setType("Please Select Type");
      // setOptionstodo([]);
      // setOptions("");
      // setStatus("Please Select Status");
      // setDate("");
      // setOptionsText("");

      // setdocumentFiles([]);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setSubmitLoader(false);
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
  //submit option for saving
  const handleSubmit = (e) => {
    setSubmitLoader(true);
    e.preventDefault();
    const isNameMatch = roundmasters.some(
      (item) =>
        item?.category?.toLowerCase() === category.toLowerCase() &&
        valueSubCategory.includes(item.subcategory) &&
        item.question.toLowerCase() === question.toLowerCase()
    );
    if (category === "" || category === "Please Select Category") {
      setPopupContentMalert("Please Select Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedSubCategoryOptions?.length < 1) {
      setPopupContentMalert("Please Select SubCategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (questionType === "Please Select Question Type") {
      setPopupContentMalert("Please Select Question Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.candidatestatusexp?.length === 0) {
      setPopupContentMalert("Please Select Candidate Status!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      filterState?.workmode?.length === 0) {
      setPopupContentMalert("Please Select Work Mode!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (question === "" || question === undefined) {
      setPopupContentMalert("Please Enter Question!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      filterState?.tamilquestion?.trim() !== "" && !hasTamilWord(filterState?.tamilquestion?.trim())
    ) {
      setPopupContentMalert("Please Enter Atleast One Word in Tamil (கேள்வி)!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      filterState?.tamilquestiondescription?.trim() !== "" && !hasTamilWord(filterState?.tamilquestiondescription?.trim())
    ) {
      setPopupContentMalert("Please Enter Atleast One Word in Tamil (கேள்வி விளக்கம்)!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (type === "Please Select Type") {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (type === "Radio" ||
        type === "MultipleChoice" ||
        type === "Yes/No" ||
        type === "Correct/In Correct") &&
      optionstodo?.length < 1
    ) {
      setPopupContentMalert(`Please Create Options for ${type}`);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (type === "Radio" ||
        type === "MultipleChoice" ||
        type === "Yes/No" ||
        type === "Correct/In Correct") &&
      optionstodo?.length > 0 &&
      optionstodo?.length < 2
    ) {
      setPopupContentMalert("Please Add Atleast Two Options!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (type === "Radio" || type === "MultipleChoice") &&
      optionstodo?.some((item) => item.options.trim() === "")
    ) {
      setPopupContentMalert("Please Fill All the Options!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      optionstodo?.some(item => item?.tamiloptions?.trim() !== "" && !/[\u0B80-\u0BFF]+/.test(item.tamiloptions))
    ) {
      setPopupContentMalert("Please Enter Atleast One Word for Every Options in Tamil(விருப்பங்கள் பட்டியல்)!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      questionType === "Alpha-Numeric with Image" &&
      documentFiles?.length === 0
    ) {
      setPopupContentMalert("Please Upload Image!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (todoSubmit) {
      setPopupContentMalert("Please Add the Todo and Submit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      if (valueSubCategory.length > 0) {
        valueSubCategory?.map((data) => {
          sendRequest(data);
        });
      }
    }
  };
  const [filterState, setFilterState] = useState({
    candidatestatusexp: [],
    workmode: [],
    questionpreference: "Default",
    questiondescription: "",
    tamilquestion: "",
    tamilquestiondescription: "",
  });
  const [editDetails, setEditDetails] = useState({});
  const customValueRendererQuestions = (valueQuestionsCat) => {
    return valueQuestionsCat?.length
      ? valueQuestionsCat?.map(({ label }) => label)?.join(", ")
      : "Please Select Candidate Status";
  };
  const customValueRendererWorkMode = (valueQuestionsCat) => {
    return valueQuestionsCat?.length
      ? valueQuestionsCat?.map(({ label }) => label)?.join(", ")
      : "Please Select Work Mode";
  };
  const handleClear = (e) => {
    e.preventDefault();
    setFilterState({
      candidatestatusexp: [],
      workmode: [],
      questionpreference: "Default",
      questiondescription: "",
      tamilquestion: "",
      tamilquestiondescription: "",
    });
    setQuestion("");
    setType("Please Select Type");
    setOptions("");
    setOptionstodo([]);
    setDate("");
    setCategory("Please Select Category");
    setSelectedSubCategoryOptions([]);
    setValueSubCategory([]);
    setSubCategoryOption([]);
    setdocumentFiles([]);
    setOptionsText("");

    setQuestionType("Please Select Question Type");

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
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

  //get single row to edit....
  const getCode = async (e, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_ONLINE_TEST_QUESTION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRoundmasterEdit(res?.data?.sonlinetestquestions);
      setCategoryEdit(res?.data?.sonlinetestquestions?.category);
      setSubCategoryEdit(res?.data?.sonlinetestquestions?.subcategory);
      fetchSubCategoryEdit(res?.data?.sonlinetestquestions?.category);
      setTypeEdit(res?.data?.sonlinetestquestions?.type);
      setdocumentFilesEdit(res?.data?.sonlinetestquestions?.documentFiles);
      setOptionsTextEdit(res?.data?.sonlinetestquestions?.answers);
      setDateEdit(res?.data?.sonlinetestquestions?.date);
      setQuestionTypeEdit(
        res?.data?.sonlinetestquestions?.questiontype
          ? res?.data?.sonlinetestquestions?.questiontype
          : "Please Select Question Type"
      );
      setEditDetails({
        candidatestatusexp: res?.data?.sonlinetestquestions?.candidatestatusexp?.length > 0 ? res?.data?.sonlinetestquestions?.candidatestatusexp?.map(data => ({
          label: data,
          value: data,
        })) : [],
        workmode: res?.data?.sonlinetestquestions?.workmode?.length > 0 ? res?.data?.sonlinetestquestions?.workmode?.map(data => ({
          label: data,
          value: data,
        })) : [],
        questionpreference: res?.data?.sonlinetestquestions?.questionpreference || "Default",
        questiondescription: res?.data?.sonlinetestquestions?.questiondescription || "",
        tamilquestiondescription: res?.data?.sonlinetestquestions?.tamilquestiondescription || "",
        tamilquestion: res?.data?.sonlinetestquestions?.tamilquestion || "",
      });
      setOptionstodoEdit(res?.data?.sonlinetestquestions?.optionArr);
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
      let res = await axios.get(`${SERVICE.SINGLE_ONLINE_TEST_QUESTION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRoundmasterEdit(res?.data?.sonlinetestquestions);
      setdocumentFilesEdit(res?.data?.sonlinetestquestions?.documentFiles);
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
      let res = await axios.get(`${SERVICE.SINGLE_ONLINE_TEST_QUESTION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRoundmasterEdit(res?.data?.sonlinetestquestions);
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
  let updateby = roundmasterEdit?.updatedby;
  let addedby = roundmasterEdit?.addedby;

  let subprojectsid = roundmasterEdit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_ONLINE_TEST_QUESTION}/${subprojectsid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          question: roundmasterEdit.question,
          category: categoryEdit,
          subcategory: subCategoryEdit,
          questiontype: String(questionTypeEdit),
          type: typeEdit,
          optionArr:
            typeEdit === "Radio" ||
              typeEdit === "MultipleChoice" ||
              typeEdit === "Yes/No" ||
              typeEdit === "Correct/In Correct"
              ? optionstodoEdit
              : [],
          answers:
            typeEdit === "TextBox" ||
              typeEdit === "Text-Alpha" ||
              typeEdit === "Text-Numeric"
              ? optionsTextEdit === "" || optionsTextEdit === undefined
                ? "No Answer"
                : optionsTextEdit
              : "",
          documentFiles: documentFilesEdit,
          candidatestatusexp: editDetails?.candidatestatusexp?.length ? editDetails?.candidatestatusexp?.map(data => data?.value) : [],
          workmode: editDetails?.workmode?.length ? editDetails?.workmode?.map(data => data?.value) : [],
          questionpreference: editDetails?.questionpreference || "Default",
          questiondescription: editDetails?.questiondescription || "",
          tamilquestiondescription: editDetails?.tamilquestiondescription || "",
          tamilquestion: editDetails?.tamilquestion || "",
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchRoundmaster();
      setOptionstodoEdit([]);
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setFilteredChanges(null)
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

  const editSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = allRoundmasteredit.some(
      (item) =>
        item?.category.toLowerCase() === categoryEdit?.toLowerCase() &&
        item?.subcategory?.toLowerCase() === subCategoryEdit?.toLowerCase() &&
        item?.question?.toLowerCase() ===
        roundmasterEdit?.question?.toLowerCase()
    );

    if (
      categoryEdit === "" ||
      categoryEdit === "Please Select Category" ||
      categoryEdit === undefined
    ) {
      setPopupContentMalert("Please Select Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      subCategoryEdit === "" ||
      subCategoryEdit === "Please Select SubCategory" ||
      subCategoryEdit === undefined
    ) {
      setPopupContentMalert("Please Select SubCategory!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (questionTypeEdit === "Please Select Question Type") {
      setPopupContentMalert("Please Select Question Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      editDetails?.candidatestatusexp?.length === 0) {
      setPopupContentMalert("Please Select Candidate Status!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      editDetails?.workmode?.length === 0) {
      setPopupContentMalert("Please Select Work Mode!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      roundmasterEdit?.question === "" ||
      roundmasterEdit?.question === undefined
    ) {
      setPopupContentMalert("Please Enter Question!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (
    //   editDetails?.tamilquestion === "" ||
    //   editDetails?.tamilquestion === undefined
    // ) {
    //   setPopupContentMalert("Please Enter Question in Tamil (கேள்வி)!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else if (
      editDetails?.tamilquestion !== "" && !hasTamilWord(editDetails?.tamilquestion)
    ) {
      setPopupContentMalert("Please Enter Atleast One Word in Tamil (கேள்வி)!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      editDetails?.tamilquestiondescription?.trim() !== "" && !hasTamilWord(editDetails?.tamilquestiondescription?.trim())
    ) {
      setPopupContentMalert("Please Enter Atleast One Word in Tamil (கேள்வி விளக்கம்)!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (typeEdit === "Please Select Type") {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (typeEdit === "Radio" ||
        typeEdit === "MultipleChoice" ||
        typeEdit === "Yes/No" ||
        typeEdit === "Correct/In Correct") &&
      optionstodoEdit?.length < 1
    ) {
      setPopupContentMalert(`Please Create Options for ${type}`);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (typeEdit === "Radio" ||
        typeEdit === "MultipleChoice" ||
        typeEdit === "Yes/No" ||
        typeEdit === "Correct/In Correct") &&
      optionstodoEdit?.length > 0 &&
      optionstodoEdit?.length < 2
    ) {
      setPopupContentMalert("Please Add Atleast Two Options!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (typeEdit === "Radio" || typeEdit === "MultipleChoice") &&
      optionstodoEdit?.some((item) => item.options.trim() === "")
    ) {
      setPopupContentMalert("Please Fill All the Options!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      optionstodoEdit?.some(item => item?.tamiloptions?.trim() !== "" && !/[\u0B80-\u0BFF]+/.test(item.tamiloptions))
    ) {
      setPopupContentMalert("Please Enter Atleast One Word for Every Options in Tamil(விருப்பங்கள் பட்டியல்)!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      questionTypeEdit === "Alpha-Numeric with Image" &&
      documentFilesEdit?.length === 0
    ) {
      setPopupContentMalert("Please Upload Image!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (todoSubmit) {
      setPopupContentMalert("Please Add the Todo and Submit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  //get all Sub vendormasters.
  const fetchRoundmaster = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.ALL_ONLINE_TEST_QUESTION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setRoundmasters(res_vendor?.data?.onlinetestquestions?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        id: item._id,
        dateRange:
          item?.dateRangefrom && item.dateRangeto
            ? `${moment(item?.dateRangefrom).format("DD-MM-YYYY")} - ${moment(
              item.dateRangeto
            ).format("DD-MM-YYYY")}`
            : "",
        date: item.date ? moment(item.date).format("DD-MM-YYYY") : "",
        candidatestatusexp: item?.candidatestatusexp?.length > 0 ? item?.candidatestatusexp?.join(",") : "",
        workmode: item?.workmode?.length > 0 ? item?.workmode?.join(",") : "",
        options: item.optionArr
          ?.map((t, i) => `${i + 1 + ". "}` + t.options)
          .toString(),
        status: item.optionArr
          ?.map((t, i) => `${i + 1 + ". "}` + t.status)
          .toString(),
      })));
      setRoundmastercheck(true);
    } catch (err) {
      setRoundmastercheck(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //get all Sub vendormasters.
  const fetchRoundmasterAll = async (e) => {
    setPageName(!pageName);
    try {
      let res_meet = await axios.get(SERVICE.ALL_ONLINE_TEST_QUESTION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllRoundmasteredit(
        res_meet?.data?.onlinetestquestions.filter((item) => item._id !== e)
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
  const fileName = "Online Test Question";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Online Test Question",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchRoundmaster();
    fetchCategory();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = (roundmasters) => {

    setItems(roundmasters);
  };

  useEffect(() => {
    addSerialNumber(roundmasters);
  }, [roundmasters]);

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
      width: 75,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0,
      width: 150,
      hide: !columnVisibility.category,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "subcategory",
      headerName: "SubCategory",
      flex: 0,
      width: 150,
      hide: !columnVisibility.subcategory,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "questiontype",
      headerName: "Question Type",
      flex: 0,
      width: 150,
      hide: !columnVisibility.questiontype,
      headerClassName: "bold-header",
    },
    {
      field: "question",
      headerName: "Question",
      flex: 0,
      width: 250,
      hide: !columnVisibility.question,
      headerClassName: "bold-header",
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0,
      width: 100,
      hide: !columnVisibility.type,
      headerClassName: "bold-header",
    },
    {
      field: "options",
      headerName: "Options",
      flex: 0,
      width: 200,
      hide: !columnVisibility.options,
      headerClassName: "bold-header",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 200,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
    },
    {
      field: "answers",
      headerName: "Answers",
      flex: 0,
      width: 150,
      hide: !columnVisibility.answers,
      headerClassName: "bold-header",
    },
    {
      field: "candidatestatusexp",
      headerName: "Candidate Status",
      flex: 0,
      width: 150,
      hide: !columnVisibility.candidatestatusexp,
      headerClassName: "bold-header",
    },
    {
      field: "workmode",
      headerName: "Work Mode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.workmode,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      //lockPinned: true,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eonline/interviewtestmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id, params.data.name);
                fetchRoundmasterAll(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}

          {isUserRoleCompare?.includes("donline/interviewtestmaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vonline/interviewtestmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ionline/interviewtestmaster") && (
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
      question: item.question,
      category: item?.category,
      subcategory: item.subcategory,
      type: item.type,
      answers: item.answers,
      dateRange: item.dateRange,
      date: item.date,
      options: item.options,
      status: item.status,
      questiontype: item.questiontype,
      candidatestatusexp: item?.candidatestatusexp,
      workmode: item?.workmode,
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

  return (
    <Box>
      <Headtitle title={"ONLINE/INTERVIEW TEST MASTER"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Online/Interview Test Master"
        modulename="Interview"
        submodulename="Interview Setup"
        mainpagename="Online/Interview Test Master"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aonline/interviewtestmaster") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Online Test Question
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={categoryOption}
                      placeholder="Please Select Category"
                      value={{ label: category, value: category }}
                      onChange={(e) => {
                        setCategory(e.value);
                        fetchSubCategory(e.value);
                        setSelectedSubCategoryOptions([]);
                        setValueSubCategory([]);
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
                      size="small"
                      options={subCategoryOption}
                      value={selectedSubCategoryOptions}
                      onChange={handleSubCategoryChange}
                      valueRenderer={customValueRendererCate}
                      labelledBy="Please Select Sub-Category"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Question Type <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={testingtpeopt}
                      styles={colourStyles}
                      value={{
                        label: questionType,
                        value: questionType,
                      }}
                      onChange={(e) => {
                        setQuestionType(e.value);
                        setQuestion("");
                        setdocumentFiles([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Candidate Status<b style={{ color: "red" }}>*</b></Typography>

                    <MultiSelect
                      options={candidatestatusOption}

                      value={filterState?.candidatestatusexp}
                      onChange={(e) => {
                        setFilterState((prev) => ({
                          ...prev,
                          candidatestatusexp: e,
                        }))
                      }}
                      valueRenderer={customValueRendererQuestions}
                      labelledBy="Please Select Questions"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Work Mode<b style={{ color: "red" }}>*</b></Typography>
                    <MultiSelect
                      options={workmodeOption}

                      value={filterState?.workmode}
                      onChange={(e) => {
                        setFilterState((prev) => ({
                          ...prev,
                          workmode: e,
                        }))
                      }}
                      valueRenderer={customValueRendererWorkMode}
                      labelledBy="Please Select Work Mode"
                    />
                    {/* <Selects
                      options={workmodeOption}
                      value={{
                        label: filterState?.workmode ? filterState?.workmode : "Please Select Work Mode",
                        value: filterState?.workmode ? filterState?.workmode : "Please Select Work Mode",
                      }}

                      onChange={(e) => {
                        setFilterState((prev) => ({
                          ...prev,
                          workmode: e.value,
                        }))
                      }}
                    /> */}
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Question Preference</Typography>

                    <Selects
                      options={question_preference}
                      value={{
                        label: filterState?.questionpreference ? filterState?.questionpreference : "Please Select Question Preference",
                        value: filterState?.questionpreference ? filterState?.questionpreference : "Please Select Question Preference",
                      }}

                      onChange={(e) => {
                        setFilterState((prev) => ({
                          ...prev,
                          questionpreference: e.value,
                        }))
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>   </Grid>

                <Grid item md={8} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Question <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      value={question}
                      onChange={(e) => {
                        if (questionType === "Numeric") {
                          const numericOnly = e.target.value.replace(
                            /[^0-9.;\s]/g,
                            ""
                          );
                          setQuestion(numericOnly);
                        } else {
                          setQuestion(e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Question Description</Typography>

                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      value={filterState?.questiondescription}
                      onChange={(e) => {
                        setFilterState((prev) => ({
                          ...prev,
                          questiondescription: e.target.value,
                        }))
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={8} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      கேள்வி
                      {/* <b style={{ color: "red" }}>*</b> */}
                    </Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      value={filterState?.tamilquestion}
                      onChange={(e) => {
                        if (questionType === "Numeric") {
                          const numericOnly = e.target.value.replace(
                            /[^0-9.;\s]/g,
                            ""
                          );
                          setFilterState((prev) => ({
                            ...prev,
                            tamilquestion: numericOnly,
                          }))
                        } else {
                          const inputValue = e.target.value;
                          // const tamilOnly = inputValue.replace(/[^\u0B80-\u0BFF0-9\s?.!,;:'"-]/g, "");
                          const tamilOnly = inputValue;
                          setFilterState((prev) => ({
                            ...prev,
                            tamilquestion: tamilOnly,
                          }))
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>கேள்வி விளக்கம்</Typography>

                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      value={filterState?.tamilquestiondescription}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        // const tamilOnly = inputValue.replace(/[^\u0B80-\u0BFF0-9\s?.!,;:'"-]/g, "");
                        const tamilOnly = inputValue;
                        setFilterState((prev) => ({
                          ...prev,
                          tamilquestiondescription: tamilOnly,
                        }))
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={[
                        { label: "Radio", value: "Radio" },
                        { label: "TextBox", value: "TextBox" },
                        { label: "Text-Alpha", value: "Text-Alpha" },
                        { label: "Text-Numeric", value: "Text-Numeric" },
                        { label: "MultipleChoice", value: "MultipleChoice" },
                        { label: "Yes/No", value: "Yes/No" },
                        {
                          label: "Correct/In Correct",
                          value: "Correct/In Correct",
                        },
                      ]}
                      styles={colourStyles}
                      value={{ label: type, value: type }}
                      onChange={(e) => {
                        setType(e.value);
                        setOptionstodo([]);
                        setOptions("");
                        setStatus("Please Select Status");

                        setDate("");
                        setOptionsText("");
                      }}
                    />
                  </FormControl>
                </Grid>
                {(type === "MultipleChoice" ||
                  type === "Radio" ||
                  type === "Yes/No" ||
                  type === "Correct/In Correct") && (
                    <>
                      {(type === "MultipleChoice" || type === "Radio") && (
                        <>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Options<b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={options}
                                onChange={(e) => setOptions(e.target.value)}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>

                                விருப்பங்கள்
                                {/* <b style={{ color: "red" }}>*</b> */}
                              </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={tamilOptions}
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  // const tamilOnly = inputValue.replace(/[^\u0B80-\u0BFF0-9\s?.!,;:'"-]/g, "");
                                  const tamilOnly = inputValue;
                                  setTamilOptions(tamilOnly)
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Status<b style={{ color: "red" }}>*</b>
                              </Typography>
                              <Selects
                                options={statusOption}
                                styles={colourStyles}
                                value={{ label: status, value: status }}
                                onChange={(e) => setStatus(e.value)}
                              />
                            </FormControl>
                          </Grid>
                        </>
                      )}
                      &emsp;
                      <Button
                        variant="contained"
                        color="success"
                        onClick={addTodo}
                        type="button"
                        sx={{
                          height: "30px",
                          minWidth: "30px",
                          marginTop: "40px",
                          padding: "6px 10px",
                        }}
                      >
                        <FaPlus />
                      </Button>
                      {(status === "Eligible" ||
                        status === "Please Select Status") && (
                          <Grid item md={3} xs={12} sm={12}></Grid>
                        )}
                      <br />
                      <Grid item md={8} xs={12} sm={12}>
                        {optionstodo?.length > 0 && (
                          <ul type="none">
                            {optionstodo?.map((item, index) => {
                              return (
                                <li key={index}>
                                  <br />
                                  <Grid sx={{ display: "flex" }}>
                                    <FormControl fullWidth size="small">
                                      <Typography>
                                        {" "}
                                        Options List{" "}
                                        <b style={{ color: "red" }}>*</b>
                                      </Typography>
                                      <OutlinedInput
                                        id="component-outlined"
                                        placeholder="Please Enter SubCategory"
                                        disabled={[
                                          "Yes/No",
                                          "Correct/In Correct",
                                        ].includes(item?.type)}
                                        value={item.options}
                                        onChange={(e) =>
                                          handleTodoEdit(
                                            index,
                                            "options",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </FormControl>
                                    &emsp;
                                    <FormControl fullWidth size="small">
                                      <Typography>
                                        {" "}
                                        விருப்பங்கள் பட்டியல்{" "}
                                        {/* <b style={{ color: "red" }}>*</b> */}
                                      </Typography>
                                      <OutlinedInput
                                        id="component-outlined"
                                        disabled={[
                                          "Yes/No",
                                          "Correct/In Correct",
                                        ].includes(item?.type)}
                                        value={item.tamiloptions}
                                        onChange={(e) => {
                                          const inputValue = e.target.value;
                                          // const tamilOnly = inputValue.replace(/[^\u0B80-\u0BFF0-9\s?.!,;:'"-]/g, "");
                                          const tamilOnly = inputValue;
                                          handleTodoEdit(
                                            index,
                                            "tamiloptions",
                                            tamilOnly
                                          )
                                        }
                                        }
                                      />
                                    </FormControl>
                                    &emsp;
                                    <FormControl fullWidth size="small">
                                      <Typography>
                                        Status<b style={{ color: "red" }}>*</b>
                                      </Typography>
                                      <Selects
                                        options={statusOption}
                                        styles={colourStyles}
                                        value={{
                                          label: item.status,
                                          value: item.status,
                                        }}
                                        disabled={[
                                          "Yes/No",
                                          "Correct/In Correct",
                                        ].includes(item?.type)}
                                        onChange={(e) =>
                                          handleTodoEdit(index, "status", e.value)
                                        }
                                      />
                                    </FormControl>
                                    &emsp; &emsp;
                                    {!["Yes/No", "Correct/In Correct"].includes(
                                      item?.type
                                    ) && (
                                        <Button
                                          variant="contained"
                                          color="error"
                                          type="button"
                                          onClick={(e) => deleteTodo(index)}
                                          sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                          }}
                                        >
                                          <AiOutlineClose />
                                        </Button>
                                      )}
                                  </Grid>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </Grid>
                    </>
                  )}
                {(type === "TextBox" ||
                  type === "Text-Alpha" ||
                  type === "Text-Numeric") && (
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Answers
                            {type !== "TextBox" &&
                              type !== "Text-Alpha" &&
                              type !== "Text-Numeric" && (
                                <b style={{ color: "red" }}>*</b>
                              )}
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={optionsText}
                            onChange={(e) => {
                              if (type === "Text-Alpha") {
                                const textOnly = e.target.value.replace(
                                  /[^a-zA-Z\s;]/g,
                                  ""
                                );
                                setOptionsText(textOnly);
                              } else if (type === "Text-Numeric") {
                                const numericOnly = e.target.value.replace(
                                  /[^0-9.;\s]/g,
                                  ""
                                );
                                setOptionsText(numericOnly);
                              } else {
                                setOptionsText(e.target.value);
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      &emsp;
                    </>
                  )}

                {questionType === "Alpha-Numeric with Image" && (
                  <Grid item md={12} sm={12} xs={12}>
                    <br /> <br /> <br /> <br />
                    <Typography variant="h6">Upload Image</Typography>
                    <Grid marginTop={2}>
                      <Button
                        variant="contained"
                        size="small"
                        component="label"
                        sx={{
                          "@media only screen and (max-width:550px)": {
                            marginY: "5px",
                          },
                        }}
                      >
                        Upload
                        <input
                          type="file"
                          id="resume"
                          accept="image/*"
                          name="file"
                          hidden
                          onChange={(e) => {
                            handleResumeUpload(e);
                          }}
                        />
                      </Button>
                      <br />
                      <br />
                      {documentFiles?.length > 0 &&
                        documentFiles?.map((file, index) => (
                          <>
                            <Grid container spacing={2}>
                              <Grid item lg={3} md={3} sm={6} xs={6}>
                                <Typography>{file.name}</Typography>
                              </Grid>
                              <Grid item lg={1} md={1} sm={1} xs={1}>
                                <VisibilityOutlinedIcon
                                  style={{
                                    fontsize: "large",
                                    color: "#357AE8",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => renderFilePreview(file)}
                                />
                              </Grid>
                              <Grid item lg={1} md={1} sm={1} xs={1}>
                                <Button
                                  style={{
                                    fontsize: "large",
                                    color: "#357AE8",
                                    cursor: "pointer",
                                    marginTop: "-5px",
                                  }}
                                  onClick={() => handleFileDelete(index)}
                                >
                                  <DeleteIcon />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ))}
                    </Grid>
                  </Grid>
                )}
              </Grid>
              <br /> <br />
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={6}>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={buttonStyles.buttonsubmit}
                    loading={submitLoader}
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
        </>
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
          <Box sx={{ padding: "20px" }}>
            <>
              <form onSubmit={editSubmit}>
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Online Test Question
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Category<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={categoryOption}
                        placeholder="Please Select Category"
                        value={{ label: categoryEdit, value: categoryEdit }}
                        onChange={(e) => {
                          setCategoryEdit(e.value);
                          fetchSubCategoryEdit(e.value);
                          setSubCategoryEdit("Please Select SubCategory");
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Sub Category<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={subCategoryOptionEdit}
                        placeholder="Please Select Category"
                        value={{
                          label: subCategoryEdit,
                          value: subCategoryEdit,
                        }}
                        onChange={(e) => {
                          setSubCategoryEdit(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Question Type <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={testingtpeopt}
                        styles={colourStyles}
                        value={{
                          label: questionTypeEdit,
                          value: questionTypeEdit,
                        }}
                        onChange={(e) => {
                          setQuestionTypeEdit(e.value);
                          setRoundmasterEdit({
                            ...roundmasterEdit,
                            question: "",
                          });
                          setdocumentFilesEdit([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Candidate Status<b style={{ color: "red" }}>*</b></Typography>

                      <MultiSelect
                        options={candidatestatusOption}

                        value={editDetails?.candidatestatusexp}
                        onChange={(e) => {
                          setEditDetails((prev) => ({
                            ...prev,
                            candidatestatusexp: e,
                          }))
                        }}
                        valueRenderer={customValueRendererQuestions}
                        labelledBy="Please Select Questions"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Work Mode<b style={{ color: "red" }}>*</b></Typography>
                      <MultiSelect
                        options={workmodeOption}

                        value={editDetails?.workmode}
                        onChange={(e) => {
                          setEditDetails((prev) => ({
                            ...prev,
                            workmode: e,
                          }))
                        }}
                        valueRenderer={customValueRendererWorkMode}
                        labelledBy="Please Select Work Mode"
                      />
                      {/* <Selects
                        options={workmodeOption}
                        value={{
                          label: editDetails?.workmode ? editDetails?.workmode : "Please Select Work Mode",
                          value: editDetails?.workmode ? editDetails?.workmode : "Please Select Work Mode",
                        }}

                        onChange={(e) => {
                          setEditDetails((prev) => ({
                            ...prev,
                            workmode: e.value,
                          }))
                        }}
                      /> */}
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Question Preference</Typography>

                      <Selects
                        options={question_preference}
                        value={{
                          label: editDetails?.questionpreference ? editDetails?.questionpreference : "Please Select Question Preference",
                          value: editDetails?.questionpreference ? editDetails?.questionpreference : "Please Select Question Preference",
                        }}

                        onChange={(e) => {
                          setEditDetails((prev) => ({
                            ...prev,
                            questionpreference: e.value,
                          }))
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}> </Grid>

                  <Grid item md={8} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Question<b style={{ color: "red" }}>*</b>
                      </Typography>

                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={5}
                        value={roundmasterEdit?.question}
                        onChange={(e) => {
                          if (questionTypeEdit === "Numeric") {
                            const numericOnly = e.target.value.replace(
                              /[^0-9.;\s]/g,
                              ""
                            );
                            setRoundmasterEdit({
                              ...roundmasterEdit,
                              question: numericOnly,
                            });
                          } else {
                            setRoundmasterEdit({
                              ...roundmasterEdit,
                              question: e.target?.value,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Question Description</Typography>

                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={5}
                        value={editDetails?.questiondescription}
                        onChange={(e) => {
                          setEditDetails((prev) => ({
                            ...prev,
                            questiondescription: e.target.value,
                          }))
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={8} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        கேள்வி
                        {/* <b style={{ color: "red" }}>*</b> */}
                      </Typography>

                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={5}
                        value={editDetails?.tamilquestion}
                        onChange={(e) => {
                          if (questionTypeEdit === "Numeric") {
                            const numericOnly = e.target.value.replace(
                              /[^0-9.;\s]/g,
                              ""
                            );

                            setEditDetails((prev) => ({
                              ...prev,
                              tamilquestion: numericOnly,
                            }))
                          } else {
                            const inputValue = e.target.value;
                            // const tamilOnly = inputValue.replace(/[^\u0B80-\u0BFF0-9\s?.!,;:'"-]/g, "");
                            const tamilOnly = inputValue;
                            setEditDetails((prev) => ({
                              ...prev,
                              tamilquestion: tamilOnly,
                            }))
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>கேள்வி விளக்கம்
                      </Typography>

                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={5}
                        value={editDetails?.tamilquestiondescription}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          // const tamilOnly = inputValue.replace(/[^\u0B80-\u0BFF0-9\s?.!,;:'"-]/g, "");
                          const tamilOnly = inputValue;
                          setEditDetails((prev) => ({
                            ...prev,
                            tamilquestiondescription: tamilOnly,
                          }))
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Type<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={[
                          { label: "Radio", value: "Radio" },
                          { label: "TextBox", value: "TextBox" },
                          { label: "Text-Alpha", value: "Text-Alpha" },
                          { label: "Text-Numeric", value: "Text-Numeric" },
                          { label: "MultipleChoice", value: "MultipleChoice" },
                          { label: "Yes/No", value: "Yes/No" },
                          {
                            label: "Correct/In Correct",
                            value: "Correct/In Correct",
                          },
                        ]}
                        styles={colourStyles}
                        value={{ label: typeEdit, value: typeEdit }}
                        onChange={(e) => {
                          setTypeEdit(e.value);
                          setOptionstodoEdit([]);
                          setOptionsEdit("");
                          setTamilOptionsEdit("");
                          setStatusEdit("Please Select Status");
                          setDateEdit("");
                          setOptionsTextEdit("");
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {(typeEdit === "MultipleChoice" ||
                    typeEdit === "Radio" ||
                    typeEdit === "Yes/No" ||
                    typeEdit === "Correct/In Correct") && (
                      <>
                        {(typeEdit === "MultipleChoice" ||
                          typeEdit === "Radio") && (
                            <>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography>
                                    Options<b style={{ color: "red" }}>*</b>
                                  </Typography>
                                  <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={optionsEdit}
                                    onChange={(e) => setOptionsEdit(e.target.value)}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography>
                                    விருப்பங்கள்
                                    {/* <b style={{ color: "red" }}>*</b> */}
                                  </Typography>
                                  <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={tamilOptionsEdit}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      // const tamilOnly = inputValue.replace(/[^\u0B80-\u0BFF0-9\s?.!,;:'"-]/g, "");
                                      const tamilOnly = inputValue;
                                      setTamilOptionsEdit(tamilOnly)
                                    }}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography>
                                    Status<b style={{ color: "red" }}>*</b>
                                  </Typography>
                                  <Selects
                                    options={statusOption}
                                    styles={colourStyles}
                                    value={{ label: statusEdit, value: statusEdit }}
                                    onChange={(e) => setStatusEdit(e.value)}
                                  />
                                </FormControl>
                              </Grid>
                            </>
                          )}
                        &emsp;
                        <Button
                          variant="contained"
                          color="success"
                          onClick={addTodoEdit}
                          type="button"
                          sx={{
                            height: "30px",
                            minWidth: "30px",
                            marginTop: "40px",
                            padding: "6px 10px",
                          }}
                        >
                          <FaPlus />
                        </Button>
                        {(statusEdit === "Eligible" ||
                          statusEdit === "Please Select Status") && (
                            <Grid item md={3} xs={12} sm={12}></Grid>
                          )}
                        <br />
                        <Grid item md={8} xs={12} sm={12}>
                          {optionstodoEdit.length > 0 && (
                            <ul type="none">
                              {optionstodoEdit.map((item, index) => {
                                return (
                                  <li key={index}>
                                    <br />
                                    <Grid sx={{ display: "flex" }}>
                                      <FormControl fullWidth size="small">
                                        <Typography>
                                          {" "}
                                          Options List{" "}
                                          <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                          id="component-outlined"
                                          placeholder="Please Enter SubCategory"
                                          disabled={[
                                            "Yes/No",
                                            "Correct/In Correct",
                                          ].includes(item?.type)}
                                          value={item.options}
                                          onChange={(e) =>
                                            handleTodoEditPage(
                                              index,
                                              "options",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </FormControl>
                                      &emsp;
                                      <FormControl fullWidth size="small">
                                        <Typography>
                                          {" "}
                                          விருப்பங்கள் பட்டியல்{" "}
                                          {/* <b style={{ color: "red" }}>*</b> */}
                                        </Typography>
                                        <OutlinedInput
                                          id="component-outlined"
                                          disabled={[
                                            "Yes/No",
                                            "Correct/In Correct",
                                          ].includes(item?.type)}
                                          value={item.tamiloptions}
                                          onChange={(e) => {
                                            const inputValue = e.target.value;
                                            // const tamilOnly = inputValue.replace(/[^\u0B80-\u0BFF0-9\s?.!,;:'"-]/g, "");
                                            const tamilOnly = inputValue;
                                            handleTodoEditPage(
                                              index,
                                              "tamiloptions",
                                              tamilOnly
                                            )
                                          }
                                          }
                                        />
                                      </FormControl>
                                      &emsp;
                                      <FormControl fullWidth size="small">
                                        <Typography>
                                          Status<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                          options={statusOption}
                                          styles={colourStyles}
                                          value={{
                                            label: item.status,
                                            value: item.status,
                                          }}
                                          disabled={[
                                            "Yes/No",
                                            "Correct/In Correct",
                                          ].includes(item?.type)}
                                          onChange={(e) =>
                                            handleTodoEditPage(
                                              index,
                                              "status",
                                              e.value
                                            )
                                          }
                                        />
                                      </FormControl>
                                      &emsp; &emsp;
                                      {!["Yes/No", "Correct/In Correct"].includes(
                                        item?.type
                                      ) && (
                                          <Button
                                            variant="contained"
                                            color="error"
                                            type="button"
                                            onClick={(e) => deleteTodoEdit(index)}
                                            sx={{
                                              height: "30px",
                                              minWidth: "30px",
                                              marginTop: "28px",
                                              padding: "6px 10px",
                                            }}
                                          >
                                            <AiOutlineClose />
                                          </Button>
                                        )}
                                    </Grid>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </Grid>
                      </>
                    )}
                  {(typeEdit === "TextBox" ||
                    typeEdit === "Text-Alpha" ||
                    typeEdit === "Text-Numeric") && (
                      <>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Answers
                              {typeEdit !== "TextBox" &&
                                typeEdit !== "Text-Alpha" &&
                                typeEdit !== "Text-Numeric" && (
                                  <b style={{ color: "red" }}>*</b>
                                )}
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              value={optionsTextEdit}
                              onChange={(e) => {
                                if (typeEdit === "Text-Alpha") {
                                  const textOnly = e.target.value.replace(
                                    /[^a-zA-Z\s;]/g,
                                    ""
                                  );
                                  setOptionsTextEdit(textOnly);
                                } else if (typeEdit === "Text-Numeric") {
                                  const numericOnly = e.target.value.replace(
                                    /[^0-9.;\s]/g,
                                    ""
                                  );
                                  setOptionsTextEdit(numericOnly);
                                } else {
                                  setOptionsTextEdit(e.target.value);
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                        &emsp;
                      </>
                    )}

                  {questionTypeEdit === "Alpha-Numeric with Image" && (
                    <Grid item md={12} sm={12} xs={12}>
                      <br /> <br /> <br /> <br />
                      <Typography variant="h6">Upload Image</Typography>
                      <Grid marginTop={2}>
                        <Button
                          variant="contained"
                          size="small"
                          component="label"
                          sx={{
                            "@media only screen and (max-width:550px)": {
                              marginY: "5px",
                            },
                          }}
                        >
                          Upload
                          <input
                            type="file"
                            id="resume"
                            accept="image/*"
                            name="file"
                            hidden
                            onChange={(e) => {
                              handleResumeUploadEdit(e);
                            }}
                          />
                        </Button>
                        <br />
                        <br />
                        {documentFilesEdit?.length > 0 &&
                          documentFilesEdit?.map((file, index) => (
                            <>
                              <Grid container spacing={2}>
                                <Grid item lg={3} md={3} sm={6} xs={6}>
                                  <Typography>{file.name}</Typography>
                                </Grid>
                                <Grid item lg={1} md={1} sm={1} xs={1}>
                                  <VisibilityOutlinedIcon
                                    style={{
                                      fontsize: "large",
                                      color: "#357AE8",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => renderFilePreviewEdit(file)}
                                  />
                                </Grid>
                                <Grid item lg={1} md={1} sm={1} xs={1}>
                                  <Button
                                    style={{
                                      fontsize: "large",
                                      color: "#357AE8",
                                      cursor: "pointer",
                                      marginTop: "-5px",
                                    }}
                                    onClick={() => handleFileDeleteEdit(index)}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </Grid>
                              </Grid>
                            </>
                          ))}
                      </Grid>
                    </Grid>
                  )}
                </Grid>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      variant="contained"
                      type="submit"
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
                {/* </DialogContent> */}
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lonline/interviewtestmaster") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Online Test Question List
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
                    <MenuItem value={roundmasters?.length}>All</MenuItem>
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
                    "excelonline/interviewtestmaster"
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
                    "csvonline/interviewtestmaster"
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
                    "printonline/interviewtestmaster"
                  ) && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes(
                    "pdfonline/interviewtestmaster"
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
                    "imageonline/interviewtestmaster"
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
                  maindatas={roundmasters}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={roundmasters}
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
            {isUserRoleCompare?.includes("bdonline/interviewtestmaster") && (
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
            {!roundmasterCheck ? (
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
                  itemsList={roundmasters}
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
        fullWidth={true}
        maxWidth="lg"
        sx={{ marginTop: "50px" }}

      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Online Test Question
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Category</Typography>
                  <Typography>{roundmasterEdit.category}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Sub Category</Typography>
                  <Typography>{roundmasterEdit.subcategory}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Question Type</Typography>
                  <Typography>{roundmasterEdit.questiontype}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Candidate Status</Typography>
                  <Typography>{roundmasterEdit?.candidatestatusexp?.length > 0 ? roundmasterEdit?.candidatestatusexp?.join(",") : ""}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Work Mode</Typography>
                  <Typography>{roundmasterEdit?.workmode?.length > 0 ? roundmasterEdit?.workmode?.join(",") : ""}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Question</Typography>
                  <Typography>{roundmasterEdit.question}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Question Description</Typography>
                  <Typography>{roundmasterEdit?.questiondescription || ""}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    கேள்வி</Typography>
                  <Typography>{roundmasterEdit?.tamilquestion || ""}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">கேள்வி விளக்கம்</Typography>
                  <Typography>{roundmasterEdit?.tamilquestiondescription || ""}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Question Preference</Typography>
                  <Typography>{roundmasterEdit?.questionpreference || "Default"}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Type</Typography>
                  <Typography>{roundmasterEdit.type}</Typography>
                </FormControl>
              </Grid>
              {(roundmasterEdit.type === "MultipleChoice" ||
                roundmasterEdit.type === "Radio" ||
                roundmasterEdit?.type === "Yes/No" ||
                roundmasterEdit?.type === "Correct/In Correct") && (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Options</Typography>
                        <Typography>
                          {roundmasterEdit.optionArr
                            ?.map((t, i) => `${i + 1 + ". "}` + t.options)
                            .toString()}
                        </Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">
                          விருப்பங்கள் </Typography>
                        <Typography>
                          {roundmasterEdit.optionArr
                            ?.map((t, i) => `${i + 1 + ". "}` + t?.tamiloptions || "")
                            .toString()}
                        </Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Status</Typography>
                        <Typography>
                          {roundmasterEdit.optionArr
                            ?.map((t, i) => `${i + 1 + ". "}` + t.status)
                            .toString()}
                        </Typography>
                      </FormControl>
                    </Grid>
                  </>
                )}
              {["TextBox", "Text-Alpha", "Text-Numeric"].includes(
                roundmasterEdit.type
              ) && (
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Answers</Typography>
                      <Typography>{roundmasterEdit.answers}</Typography>
                    </FormControl>
                  </Grid>
                )}
            </Grid>
            <br /> <br />
            {documentFilesEdit?.length > 0 &&
              documentFilesEdit?.map((file, index) => (
                <>
                  {" "}
                  <Typography variant="h6">Image</Typography>
                  <Grid container spacing={2}>
                    <Grid item lg={3} md={3} sm={6} xs={6}>
                      <Typography>{file.name}</Typography>
                    </Grid>
                    <Grid item lg={1} md={1} sm={1} xs={1}>
                      <VisibilityOutlinedIcon
                        style={{
                          fontsize: "large",
                          color: "#357AE8",
                          cursor: "pointer",
                        }}
                        onClick={() => renderFilePreviewEdit(file)}
                      />
                    </Grid>
                  </Grid>
                </>
              ))}
            <br /> <br /> <br />
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
          open={isErrorOpenpop}
          onClose={handleCloseerrpop}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              sx={buttonStyles.buttonsubmit}
              onClick={() => {
                sendEditRequest();
                handleCloseerrpop();
              }}
            >
              ok
            </Button>
            <Button sx={buttonStyles.btncancel} onClick={handleCloseerrpop}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

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
              Are you sure?
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
              onClick={(e) => delRoundcheckbox(e)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpenalert}
          onClose={handleCloseModalert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "70px", color: "orange" }}
            />
            <Typography
              variant="h6"
              sx={{ color: "black", textAlign: "center" }}
            >
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={handleCloseModalert}
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
        itemsTwo={roundmasters ?? []}
        filename={"Online/Interview Test Master"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Online/Interview Test Master Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delRound}
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

export default OnlineQuestionTest;
