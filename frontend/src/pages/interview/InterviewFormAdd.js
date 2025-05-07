import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
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
  FaEdit,
  FaFileCsv,
  FaFileExcel,
  FaFilePdf,
  FaPrint,
} from "react-icons/fa";
import { MdOutlineDone } from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import {
  statusOption,
  statusOptiontyping,
  validationOptions,
} from "../../components/Componentkeyword";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import domtoimage from 'dom-to-image';
import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import LoadingButton from "@mui/lab/LoadingButton";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import { useLocation, useParams } from "react-router-dom";
function Roundmaster() {
  const location = useLocation();
  const statusallotid = location?.state?.statusallotid;
  const answerallotdetails = location?.state?.answerallotdetails;
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const [btnSubmit, setBtnSubmit] = useState(false);
  const handleClickOpenPopupMalert = () => {
    // setSubmitLoader(false);
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
    "Mode",
    "Category",
    "Subcategory",
    "Question",
    "Question Type",
    "Answers",
    "Status",
    "Sub Questions",
    "Sub Questions Type",
    "Sub Question Answers",
    "Sub Question Answers Status",
  ];
  let exportRowValues = [
    "designation",
    "mode",
    "category",
    "subcategory",
    "question",
    "type",
    "options",
    "status",
    "extraquestions",
    "subquestiontype",
    "subquestionanswers",
    "subquestionanswersstatus",
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
      pagename: String("Interview Status Allot"),
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

  const [interview, setInterview] = useState([]);
  const [interviewQuestion, setInterviewQuestions] = useState([]);
  const [interviewQuestionBefore, setInterviewQuestionsBefore] = useState([]);
  const [interviewQuestionAns, setInterviewQuestionsAns] = useState([]);
  const [question, setQuestion] = useState("Please Select Question");
  const [yesOrNo, setyesOrNo] = useState("");
  const [informReason, setInformReason] = useState("");
  const [questionDatas, setQuestionDatas] = useState({
    yesorno: "",
    type: "",
    subquestionlength: "",
    options: "",
    date: "",
    fromdate: "",
    todate: "",

    typingspeed: "",
    typingaccuracy: "",
    typingmistakes: "",
    typingduration: "",

    secondarytodo: [],
  });
  const [typingTestValidation, setTypingTestValidation] = useState({
    speedvalidation: "Please Select Validation",
    speedstatus: "Please Select Status",
    speedfrom: "",
    speedto: "",
    speeddescription: "",

    accuracyvalidation: "Please Select Validation",
    accuracystatus: "Please Select Status",
    accuracyfrom: "",
    accuracyto: "",
    accuracydescription: "",

    mistakesvalidation: "Please Select Validation",
    mistakesstatus: "Please Select Status",
    mistakesfrom: "",
    mistakesto: "",
    mistakesdescription: "",
  });

  const [questionDatasEdit, setQuestionDatasEdit] = useState({
    yesorno: "",
    type: "",
    subquestionlength: "",
    options: "",
    date: "",
    fromdate: "",
    todate: "",
    typingspeed: "",
    typingaccuracy: "",
    typingmistakes: "",
    typingduration: "",
    secondarytodo: [],
  });
  const [type, setType] = useState("Please Select Type");

  const [dateStatus, setDateStatus] = useState("Please Select Status");
  const [dateDescription, setDateDescription] = useState("");
  const [status, setStatus] = useState("Please Select Status");
  const [dateStatusEdit, setDateStatusEdit] = useState("Please Select Status");
  const [dateDescriptionEdit, setDateDescriptionEdit] = useState("");
  const [statusEdit, setStatusEdit] = useState("Please Select Status");
  const [todoSubmit, setTodoSubmit] = useState(false);
  const [backUpCreate, setBackUpCreate] = useState([]);
  const [backUpCreateEdit, setBackUpCreateEdit] = useState([]);
  const [todoSubmitEdit, setTodoSubmitEdit] = useState(false);

  const [extraQuestions, setExtraQuestions] = useState(
    "Please Select Type Questions"
  );
  const [extraOptions, setExtraOptions] = useState("Please Select Answers");
  const [interviewViewQuestions, setInterviewViewQuestions] = useState("");
  const [interviewViewQuestionsEdit, setInterviewViewQuestionsEdit] =
    useState("");
  const [extraQuestAdd, setExtraQuestAdd] = useState(
    "Please Select Extra Questions"
  );
  const [extratype, setExtraType] = useState("");
  const [addReqTodo, setAddReqTodo] = useState([]);
  const [isTodoEdit, setIsTodoEdit] = useState(
    Array(addReqTodo.length).fill(false)
  );
  const [extraQuestionsEdit, setExtraQuestionsEdit] = useState(
    "Please Select Type Questions"
  );
  const [extraOptionsEdit, setExtraOptionsEdit] = useState(
    "Please Select Answers"
  );
  const [extraQuestAddEdit, setExtraQuestAddEdit] = useState(
    "Please Select Extra Questions"
  );
  const [extratypeEdit, setExtraTypeEdit] = useState(
    "Please Select Extra Type"
  );
  const [addReqTodoEdit, setAddReqTodoEdit] = useState([]);
  const [isTodoEditPage, setIsTodoEditPage] = useState(
    Array(addReqTodoEdit.length).fill(false)
  );
  const [optionstodoExtraEdit, setOptionstodoExtraEdit] = useState([]);

  const [statusAns, setStatusAns] = useState("Please Select Status");
  const [answers, setAnswers] = useState("");
  const [options, setOptions] = useState("");
  const [description, setDescription] = useState("");
  const [optionsEdit, setOptionsEdit] = useState("");
  const [descriptionEdit, setDescriptionEdit] = useState("");
  const [optionstodo, setOptionstodo] = useState([]);
  const [optionstodoExtra, setOptionstodoExtra] = useState([]);
  const [optionstodoEdit, setOptionstodoEdit] = useState([]);

  const [designation, setDesignation] = useState([]);
  // designation multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);
  const [selectedCompanyOptionsCateEdit, setSelectedCompanyOptionsCateEdit] =
    useState([]);
  const [companyValueCateEdit, setCompanyValueCateEdit] = useState("");

  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Designation";
  };

  const handleCompanyChangeEdit = (options) => {
    setCompanyValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCompanyOptionsCateEdit(options);
  };
  const customValueRendererCompanyEdit = (
    companyValueCateEdit,
    _employeename
  ) => {
    return companyValueCateEdit?.length
      ? companyValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Designation";
  };

  const handleTodoEdit = (index, value, newValue) => {
    const isSubNameMatch = optionstodo?.some(
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
        optionstodo?.some(
          (item) => item?.options.toLowerCase() === newValue?.toLowerCase()
        )
      ) {
        setPopupContentMalert("Already Added ! Please Enter Another Answers!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        return;
      }
    }
    const updatedTodos = [...optionstodo];
    if (value === "options") {
      updatedTodos[index].options = newValue;
    } else if (value === "description") {
      updatedTodos[index].description = newValue;
    } else if (value === "validation") {
      updatedTodos[index].validation = newValue;
    } else if (value === "betweenfrom") {
      const numericOnly = newValue?.replace(/[^0-9.;\s]/g, "");
      updatedTodos[index].betweenfrom = numericOnly;
    } else if (value === "betweento") {
      const numericOnly = newValue?.replace(/[^0-9.;\s]/g, "");
      updatedTodos[index].betweento = numericOnly;
    } else {
      updatedTodos[index].status = newValue;
      updatedTodos[index].description = "";
    }
    setOptionstodo(updatedTodos);
    setAddReqTodo([]);
  };

  const handleTodoEditExtra = (index, value, newValue) => {
    if (value === "status") {
      const updatedTodos = [...optionstodoExtra];
      updatedTodos[index].status = newValue;
      updatedTodos[index].description = "";
      setOptionstodoExtra(updatedTodos);
    } else if (value === "description") {
      const updatedTodos = [...optionstodoExtra];
      updatedTodos[index].description = newValue;
      setOptionstodoExtra(updatedTodos);
    } else if (value === "betweenfrom") {
      const updatedTodos = [...optionstodoExtra];
      const numericOnly = newValue?.replace(/[^0-9.;\s]/g, "");
      updatedTodos[index].betweenfrom = numericOnly;
      setOptionstodoExtra(updatedTodos);
    } else if (value === "betweento") {
      const updatedTodos = [...optionstodoExtra];
      const numericOnly = newValue?.replace(/[^0-9.;\s]/g, "");
      updatedTodos[index].betweento = numericOnly;
      setOptionstodoExtra(updatedTodos);
    } else if (value === "validation") {
      const updatedTodos = [...optionstodoExtra];
      updatedTodos[index].validation = newValue;
      setOptionstodoExtra(updatedTodos);
    }
  };

  const handleTodoEditOverallExtra = (index, key, newValue) => {
    // Assuming addReqTodo is an array of objects
    const updatedTodos = addReqTodo.map((todo, i) => {
      if (i === index) {
        // Update the specific key-related value
        const updatedTodo = { ...todo, [key]: newValue };
        return updatedTodo;
      }
      return todo;
    });

    setAddReqTodo(updatedTodos);
  };
  const handleTodoEditOverallExtraOptions = (index, key, ind, newValue) => {
    if (key === "status") {
      const updatedTodos = [...backUpCreate];
      updatedTodos[ind].status = newValue;
      updatedTodos[ind].description = "";
      setBackUpCreate(updatedTodos);
    } else if (key === "description") {
      const updatedTodos = [...backUpCreate];
      updatedTodos[ind].description = newValue;
      setBackUpCreate(updatedTodos);
    } else if (key === "validation") {
      const updatedTodos = [...backUpCreate];
      updatedTodos[ind].validation = newValue;
      setBackUpCreate(updatedTodos);
    } else if (key === "betweenfrom") {
      const updatedTodos = [...backUpCreate];
      const numericOnly = newValue?.replace(/[^0-9.;\s]/g, "");
      updatedTodos[index].betweenfrom = numericOnly;
      setBackUpCreate(updatedTodos);
    } else if (key === "betweento") {
      const updatedTodos = [...backUpCreate];
      const numericOnly = newValue?.replace(/[^0-9.;\s]/g, "");
      updatedTodos[index].betweento = numericOnly;
      setBackUpCreate(updatedTodos);
    }
  };

  const handleAddTodo = () => {
    const prevSub =
      extraQuestions === "Sub Question 1"
        ? "Sub Question"
        : extraQuestions.replace(/\d+/, (match) => match - 1);

    const filteredQuestions = addReqTodo?.filter((question) => {
      return (
        question.extraquestion === prevSub &&
        question.optionslist?.some((option) =>
          (option.answer === extraOptions) === "" ? "NODATE" : extraOptions
        )
      );
    });

    const questionString =
      filteredQuestions.length > 0 ? filteredQuestions[0].question : "";

    const hasExtraQuestion = interviewQuestion?.some((item) => {
      return item.subquestions?.some((sub) => {
        if (
          sub.subquestionnumber === prevSub &&
          sub.question === questionString
        ) {
          return sub?.doyouhaveextraquestion === "Yes"
            ? true
            : sub?.doyouhaveextraquestion === "No"
              ? false
              : true;
        } else {
          return true;
        }
      });
    });

    const findYesOrNo =
      hasExtraQuestion === true
        ? false
        : hasExtraQuestion === false
          ? true
          : false;

    const checkExtraQuestions = addReqTodo?.some(
      (data) =>
        data?.extraquestion === extraQuestions &&
        // &&
        data.question === extraQuestAdd &&
        data.options === extraOptions
    );

    const isInvalid = optionstodoExtra?.some((item) => {
      return (
        item.validation === "Between" &&
        item.answer !== "NOANSWER" &&
        item.betweenfrom !== "" &&
        Number(item.answer) !== Number(item.betweenfrom) &&
        item.betweento !== "" &&
        Number(item.answer) !== Number(item.betweento)
      );
    });
    const samebetween = optionstodoExtra?.some((item) => {
      return (
        item.validation === "Between" &&
        item.answer !== "NOANSWER" &&
        item.betweenfrom !== "" &&
        item.betweento !== "" &&
        Number(item.betweenfrom) === Number(item.betweento)
      );
    });

    if (checkExtraQuestions) {
      setPopupContentMalert("Already Question Added!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      optionstodoExtra?.some(
        (item) =>
          extratype === "Text-Numeric" &&
          item?.answer !== "NOANSWER" &&
          item.validation === "Please Select Validation"
      )
    ) {
      setPopupContentMalert("Please Select Validation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      extratype === "Text-Numeric" &&
      optionstodoExtra?.some(
        (item) =>
          item.validation === "Between" &&
          (item.betweenfrom === "" || item.betweento === "")
      )
    ) {
      setPopupContentMalert("Please Enter Both From and To Values!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (extratype === "Text-Numeric" && isInvalid) {
      setPopupContentMalert("Please Enter Valid Between Values!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (samebetween) {
      setPopupContentMalert("Both From Value and To value can not be same!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      optionstodoExtra?.some((item) => item?.status === "Please Select Status")
    ) {
      setPopupContentMalert("Please Select Status for all the answers!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (
    //   optionstodoExtra?.some(
    //     (item) =>

    //       item.description === ""
    //   )
    // ) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {"Please Enter Description"}
    //       </p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else if (findYesOrNo) {
      setPopupContentMalert("Can Not Add Sub Question For the Choosed Option!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      const addRequired = {
        extraquestion: extraQuestions,
        options: extraOptions,
        question: extraQuestAdd,
        type: extratype,
        optionslist: optionstodoExtra,
        prequestionview: interviewViewQuestions,
      };
      setAddReqTodo((prevTodos) => [...prevTodos, { ...addRequired }]);
      setIsTodoEdit(Array(addReqTodo.length).fill(false));
      setExtraQuestions("Please Select Type Questions");
      setExtraOptions("Please Select Answers");
      setExtraQuestAdd("Please Select Extra Questions");
      setExtraType("");
      setOptionstodoExtra([]);
    }
  };

  const handleTodoEditExtraEdit = (index, value, newValue) => {
    console.log(index, value, newValue, "index, value, newValue")
    if (value === "status") {
      const updatedTodos = [...optionstodoExtraEdit];
      updatedTodos[index].status = newValue;
      updatedTodos[index].description = "";
      setOptionstodoExtraEdit(updatedTodos);
    } else if (value === "description") {
      const updatedTodos = [...optionstodoExtraEdit];
      updatedTodos[index].description = newValue;
      setOptionstodoExtraEdit(updatedTodos);
    } else if (value === "betweenfrom") {
      const updatedTodos = [...optionstodoExtraEdit];
      const numericOnly = newValue?.replace(/[^0-9.;\s]/g, "");
      updatedTodos[index].betweenfrom = numericOnly;
      setOptionstodoExtraEdit(updatedTodos);
    } else if (value === "betweento") {
      const updatedTodos = [...optionstodoExtraEdit];
      const numericOnly = newValue?.replace(/[^0-9.;\s]/g, "");
      updatedTodos[index].betweento = numericOnly;
      setOptionstodoExtraEdit(updatedTodos);
    } else if (value === "validation") {
      const updatedTodos = [...optionstodoExtraEdit];
      updatedTodos[index].validation = newValue;
      setOptionstodoExtraEdit(updatedTodos);
    }
  };

  const deleteTodoEditExtraEdit = (index) => {
    const updatedTodos = [...addReqTodoEdit];
    updatedTodos.splice(index, 1);
    setAddReqTodoEdit(updatedTodos);
  };

  const handleAddTodoEdit = () => {
    const prevSub =
      extraQuestionsEdit === "Sub Question 1"
        ? "Sub Question"
        : extraQuestionsEdit.replace(/\d+/, (match) => match - 1);
    const filteredQuestions = addReqTodoEdit?.filter((question) => {
      return (
        question.extraquestion === prevSub &&
        question.optionslist?.some(
          (option) =>
            option.answer ===
            (extraOptionsEdit === "" ? "NODATE" : extraOptionsEdit)
        )
      );
    });
    const questionString =
      filteredQuestions.length > 0 ? filteredQuestions[0].question : "";

    const hasExtraQuestion = interviewQuestion?.some((item) => {
      return item.subquestions?.some((sub) => {
        if (
          sub.subquestionnumber === prevSub &&
          sub.question === questionString
        ) {
          return sub?.doyouhaveextraquestion === "Yes"
            ? true
            : sub?.doyouhaveextraquestion === "No"
              ? false
              : true;
        } else {
          return true;
        }
      });
    });

    const findYesOrNo =
      hasExtraQuestion === true
        ? false
        : hasExtraQuestion === false
          ? true
          : false;

    const checkExtraQuestions = addReqTodoEdit?.some(
      (data) =>
        data?.extraquestion === extraQuestionsEdit &&
        data?.question === extraQuestAddEdit &&
        data.options === extraOptionsEdit
    );

    const isInvalid = optionstodoExtraEdit?.some((item) => {
      return (
        item.validation === "Between" &&
        item.answer !== "NOANSWER" &&
        item.betweenfrom !== "" &&
        Number(item.answer) !== Number(item.betweenfrom) &&
        item.betweento !== "" &&
        Number(item.answer) !== Number(item.betweento)
      );
    });
    const samebetween = optionstodoExtraEdit?.some((item) => {
      return (
        item.validation === "Between" &&
        item.answer !== "NOANSWER" &&
        item.betweenfrom !== "" &&
        item.betweento !== "" &&
        Number(item.betweenfrom) === Number(item.betweento)
      );
    });

    if (checkExtraQuestions) {
      setPopupContentMalert("Already Question Added!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      optionstodoExtraEdit?.some(
        (item) =>
          extratypeEdit === "Text-Numeric" &&
          item?.answer !== "NOANSWER" &&
          item.validation === "Please Select Validation"
      )
    ) {
      setPopupContentMalert("Please Select Validation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      extratypeEdit === "Text-Numeric" &&
      optionstodoExtraEdit?.some(
        (item) =>
          item.validation === "Between" &&
          (item.betweenfrom === "" || item.betweento === "")
      )
    ) {
      setPopupContentMalert("Please Enter Both From and To Values!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (extratypeEdit === "Text-Numeric" && isInvalid) {
      setPopupContentMalert("Please Enter Valid Between Values!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (samebetween) {
      setPopupContentMalert("Both From Value and To value can not be same!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      optionstodoExtraEdit?.some(
        (item) => item?.status === "Please Select Status"
      )
    ) {
      setPopupContentMalert("Please Select Status for all the answers!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (
    //   optionstodoExtraEdit?.some(
    //     (item) =>

    //       item.description === ""
    //   )
    // ) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {"Please Enter Description"}
    //       </p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else if (findYesOrNo) {
      setPopupContentMalert("Can Not Add Sub Question For the Choosed Option!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      const addRequired = {
        extraquestion: extraQuestionsEdit,
        options: extraOptionsEdit,
        question: extraQuestAddEdit,
        type: extratypeEdit,
        optionslist: optionstodoExtraEdit,
        prequestionview: interviewViewQuestionsEdit,
      };
      setAddReqTodoEdit((prevTodos) => [...prevTodos, { ...addRequired }]);
      setIsTodoEditPage(Array(addReqTodoEdit.length).fill(false));
      setExtraQuestionsEdit("Please Select Type Questions");
      setExtraOptionsEdit("Please Select Answers");
      setExtraQuestAddEdit("Please Select Extra Questions");
      setExtraTypeEdit("Please Select Extra Type");
      setOptionstodoExtraEdit([]);
    }
  };
  const handleTodoEditOverallExtraOptionsEdit = (index, key, ind, newValue) => {
    // Assuming addReqTodo is an array of objects
    // const updatedTodos = addReqTodoEdit.map((todo, i) => {
    //   if (i === index) {
    //     // Update the specific key-related value
    //     const updatedTodo = {
    //       ...todo,
    //       optionslist: [
    //         ...todo.optionslist.slice(0, ind),
    //         newValue,
    //         ...todo.optionslist.slice(ind + 1),
    //       ],
    //     };
    //     return updatedTodo;
    //   }
    //   return todo;
    // });

    // setAddReqTodoEdit(updatedTodos);

    if (key === "status") {
      // const updatedTodos = [...addReqTodo];
      const updatedTodos = [...backUpCreateEdit];
      // updatedTodos[index].optionslist[ind].status = newValue;
      // updatedTodos[index].optionslist[ind].description = "";
      updatedTodos[ind].status = newValue;
      updatedTodos[ind].description = "";
      setBackUpCreateEdit(updatedTodos);
      // setAddReqTodo(updatedTodos);
    } else if (key === "description") {
      // const updatedTodos = [...addReqTodo];
      const updatedTodos = [...backUpCreateEdit];
      // updatedTodos[index].optionslist[ind].description = newValue;

      // setAddReqTodo(updatedTodos);
      updatedTodos[ind].description = newValue;
      setBackUpCreateEdit(updatedTodos);
    } else if (key === "validation") {
      // const updatedTodos = [...addReqTodo];
      const updatedTodos = [...backUpCreateEdit];
      // updatedTodos[index].optionslist[ind].description = newValue;

      // setAddReqTodo(updatedTodos);
      updatedTodos[ind].validation = newValue;
      setBackUpCreateEdit(updatedTodos);
    } else if (key === "betweenfrom") {
      const updatedTodos = [...backUpCreateEdit];
      const numericOnly = newValue?.replace(/[^0-9.;\s]/g, "");
      updatedTodos[index].betweenfrom = numericOnly;
      setBackUpCreateEdit(updatedTodos);
    } else if (key === "betweento") {
      const updatedTodos = [...backUpCreateEdit];
      const numericOnly = newValue?.replace(/[^0-9.;\s]/g, "");
      updatedTodos[index].betweento = numericOnly;
      setBackUpCreateEdit(updatedTodos);
    }
  };
  const handleTodoEditOverallExtraEdit = (index, key, newValue) => {
    // Assuming addReqTodo is an array of objects
    const updatedTodos = addReqTodoEdit.map((todo, i) => {
      if (i === index) {
        // Update the specific key-related value
        const updatedTodo = { ...todo, [key]: newValue };
        return updatedTodo;
      }
      return todo;
    });

    setAddReqTodoEdit(updatedTodos);
  };

  const addTodoEdit = () => {
    const isSubNameMatch = optionstodoEdit?.some(
      (item) =>
        item.options.toLowerCase() === optionsEdit.toLowerCase() &&
        item.status.toLowerCase() === statusEdit.toLowerCase() &&
        item.description.toLowerCase() === descriptionEdit.toLowerCase()
    );
    if (optionsEdit === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Answers"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (statusEdit === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Status"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    // else if (
    //   (statusEdit === "Not-Eligible" ||
    //     statusEdit === "Hold" ||
    //     statusEdit === "Manual Decision") &&
    //   descriptionEdit === ""
    // ) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {"Please Enter Description"}
    //       </p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else if (isSubNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Already Added ! Please Enter Another Answers "}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      const data = {
        options: optionsEdit,
        status: statusEdit,
        description: descriptionEdit,
      };
      setOptionstodoEdit([...optionstodoEdit, data]);
      setOptionsEdit("");
      setDescriptionEdit("");
      setStatusEdit("");
    }
  };

  const handleTodoEditPage = (index, value, newValue) => {
    console.log(index, value, newValue, "index, value, newValue")
    const isSubNameMatch = optionstodoEdit?.some(
      (item) =>
        item.options.toLowerCase() === optionsEdit.toLowerCase() &&
        item.status.toLowerCase() === statusEdit.toLowerCase()
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
        optionstodoEdit?.some(
          (item) => item?.options.toLowerCase() === newValue?.toLowerCase()
        )
      ) {
        setPopupContentMalert("Already Added ! Please Enter Another Answers!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        return;
      }
      // else if (value === "status" && optionstodo?.some((item) => item?.status.toLowerCase() === newValue?.toLowerCase())) {
      //     setShowAlert(
      //         <>
      //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
      //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Already Added ! Please Enter Another Status "}</p>
      //         </>
      //     );
      //     handleClickOpenerr();
      //     return;
      // }
    }
    const updatedTodos = [...optionstodoEdit];
    if (value === "options") {
      updatedTodos[index].options = newValue;
    } else if (value === "description") {
      updatedTodos[index].description = newValue;
    } else if (value === "validation") {
      updatedTodos[index].validation = newValue;
    } else if (value === "betweenfrom") {
      const numericOnly = newValue?.replace(/[^0-9.;\s]/g, "");
      updatedTodos[index].betweenfrom = numericOnly;
    } else if (value === "betweento") {
      const numericOnly = newValue?.replace(/[^0-9.;\s]/g, "");
      updatedTodos[index].betweento = numericOnly;
    } else {
      updatedTodos[index].status = newValue;
      updatedTodos[index].description = "";
    }
    setOptionstodoEdit(updatedTodos);
    // setAddReqTodoEdit([]);
  };

  const deleteTodoEdit = (index) => {
    const updatedTodos = [...optionstodoEdit];
    updatedTodos.splice(index, 1);
    setOptionstodoEdit(updatedTodos);
    setAddReqTodoEdit([]);
  };

  const deleteTodoEditExtra = (index) => {
    const updatedTodos = [...addReqTodo];

    updatedTodos.splice(index, 1);
    setAddReqTodo(updatedTodos);
  };

  const [roundmasterEdit, setRoundmasterEdit] = useState([]);
  const [roundmasters, setRoundmasters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allRoundmasteredit, setAllRoundmasteredit] = useState([]);

  const {
    isUserRoleCompare,
    isUserRoleAccess,
    alldesignation,
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

  //image

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Interview Status Allot.png");
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

  const handleClickOpenalert = () => {
    setIsHandleChange(true);
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      overallBulkdelete(selectedRows);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

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

  const fetchInterviewquestionsAns = async () => {
    setPageName(!pageName);
    try {
      let res_priority = await axios.get(SERVICE.GET_INT_FORM_ALLOT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const priorityall = res_priority?.data?.interviewformdesign?.map((d) => ({
        ...d,
        label: d.question,
        value: d.question,
      }));
      setInterview(priorityall);
      setInterviewQuestionsAns(res_priority?.data?.interviewformdesign);
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
      let res_priority = await axios.get(SERVICE.INTERVIEWQUESTION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setInterviewQuestionsBefore(res_priority?.data?.interviewquestions);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const fetchInterviewquestionsOnchange = async (cat, subcat) => {
    setInterviewQuestions(
      interviewQuestionBefore?.filter(
        (item) => item.category === cat && item.subcategory === subcat
      )
    );
  };

  useEffect(() => {
    fetchInterviewquestionsAns();
    fetchInterviewquestions();
  }, []);

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    designation: true,
    mode: true,
    question: true,
    type: true,
    options: true,
    status: true,
    extraquestions: true,
    subquestionanswers: true,
    subquestionanswersstatus: true,
    subquestiontype: true,
    actions: true,
    category: true,
    subcategory: true,
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

  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_INT_FORM_DESIGN}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteRound(res?.data?.sinterviewformdesign);
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
        let overallcheck = await axios.post(
          `${SERVICE.INTERVIEWSTATUSALLOT_OVERALLDELETE}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            category: deleteRound?.category,
            subcategory: deleteRound?.subcategory,
            question: deleteRound?.question,
            mode: deleteRound?.mode,
            designation: deleteRound?.designation,
          }
        );
        if (overallcheck?.data?.mayidelete) {
          await axios.delete(`${SERVICE.SINGLE_INT_FORM_DESIGN}/${Roundsid}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
          handleCloseMod();
          setSelectedRows([]);
          setPage(1);

          setFilteredChanges(null)
          setFilteredRowData([]);
          await fetchRoundmaster();
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
        `${SERVICE.INTERVIEWSTATUSALLOT_OVERALLBULKDELETE}`,
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

  const delRoundcheckbox = async () => {
    setPageName(!pageName);
    try {
      if (selectedRows?.length > 0) {
        const deletePromises = selectedRows?.map((item) => {
          return axios.delete(`${SERVICE.SINGLE_INT_FORM_DESIGN}/${item}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
        });

        // Wait for all delete requests to complete
        await Promise.all(deletePromises);
        setFilteredChanges(null)
        setFilteredRowData([]);
        await fetchRoundmaster();
        setIsHandleChange(false);
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
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

  //add function
  const sendRequest = async () => {

    setPageName(!pageName);
    try {
      await axios.post(SERVICE.CREATE_INT_FORM_DESIGN, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        designation: [...valueCompanyCat],
        category: String(catAndSub?.category),
        subcategory: String(catAndSub?.subcategory),
        question: question,
        informreason: questionDatas?.type !== "Typing Test" ? informReason : "",
        type: type,
        mode: mode,
        typingspeed: String(
          type === "Typing Test" ? questionDatas?.typingspeed : ""
        ),
        typingspeedvalidation: String(
          type === "Typing Test" ? typingTestValidation?.speedvalidation : ""
        ),
        typingspeedfrom: String(
          type === "Typing Test" &&
            typingTestValidation?.speedvalidation === "Between"
            ? typingTestValidation?.speedfrom
            : ""
        ),
        typingspeedto: String(
          type === "Typing Test" &&
            typingTestValidation?.speedvalidation === "Between"
            ? typingTestValidation?.speedto
            : ""
        ),
        typingspeedstatus: String(
          type === "Typing Test" ? typingTestValidation?.speedstatus : ""
        ),

        typingaccuracy: String(
          type === "Typing Test" ? questionDatas?.typingaccuracy : ""
        ),
        typingaccuracyvalidation: String(
          type === "Typing Test" ? typingTestValidation?.accuracyvalidation : ""
        ),
        typingaccuracyfrom: String(
          type === "Typing Test" &&
            typingTestValidation?.accuracyvalidation === "Between"
            ? typingTestValidation?.accuracyfrom
            : ""
        ),
        typingaccuracyto: String(
          type === "Typing Test" &&
            typingTestValidation?.accuracyvalidation === "Between"
            ? typingTestValidation?.accuracyto
            : ""
        ),
        typingaccuracystatus: String(
          type === "Typing Test" ? typingTestValidation?.accuracystatus : ""
        ),

        typingmistakes: String(
          type === "Typing Test" ? questionDatas?.typingmistakes : ""
        ),
        typingmistakesvalidation: String(
          type === "Typing Test" ? typingTestValidation?.mistakesvalidation : ""
        ),
        typingmistakesfrom: String(
          type === "Typing Test" &&
            typingTestValidation?.mistakesvalidation === "Between"
            ? typingTestValidation?.mistakesfrom
            : ""
        ),
        typingmistakesto: String(
          type === "Typing Test" &&
            typingTestValidation?.mistakesvalidation === "Between"
            ? typingTestValidation?.mistakesto
            : ""
        ),
        typingmistakesstatus: String(
          type === "Typing Test" ? typingTestValidation?.mistakesstatus : ""
        ),

        typingduration: String(
          type === "Typing Test" ? questionDatas?.typingduration : ""
        ),

        optionArr: optionstodo,
        answers: answers,
        statusAns: statusAns,
        secondarytodo: addReqTodo,
        status: status,
        yesorno: String(yesOrNo),
        subquestionlength: String(questionDatas?.subquestionlength),
        date: String(questionDatas?.date),
        fromdate: String(questionDatas?.fromdate),
        todate: String(questionDatas?.todate),
        datestatus: String(dateStatus),
        datedescription: String(dateDescription),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchRoundmaster();
      // setQuestion("Please Select Question");
      // setType("Please Select Type");
      // setAnswers("");
      // setOptions("");
      // setDescription("");
      // setOptionstodo([]);
      // setAddReqTodo([]);
      // setyesOrNo("");
      // setValueCompanyCat([]);
      // setSelectedOptionsCompany([]);
      // setQuestionDatas({
      //   yesorno: "",
      //   type: "",
      //   subquestionlength: "",
      //   options: "",
      //   date: "",
      //   fromdate: "",
      //   todate: "",
      //   typingspeed: "",
      //   typingaccuracy: "",
      //   typingmistakes: "",
      //   typingduration: "",
      //   secondarytodo: [],
      // });
      // setCatAndSub({
      //   category: "Please Select Category",
      //   subcategory: "Please Select Sub Category",
      // });
      // setTypingTestValidation({
      //   speedvalidation: "Please Select Validation",
      //   speedstatus: "Please Select Status",
      //   speedfrom: "",
      //   speedto: "",
      //   speeddescription: "",

      //   accuracyvalidation: "Please Select Validation",
      //   accuracystatus: "Please Select Status",
      //   accuracyfrom: "",
      //   accuracyto: "",
      //   accuracydescription: "",

      //   mistakesvalidation: "Please Select Validation",
      //   mistakesstatus: "Please Select Status",
      //   mistakesfrom: "",
      //   mistakesto: "",
      //   mistakesdescription: "",
      // });

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

    const duplicateCheck = addReqTodo?.some(
      (data) => data.extraquestion === "Sub Question"
    );

    let compopt = selectedOptionsCompany.map((item) => item.value);
    const isQuestionMatch = roundmasters?.some(
      (item) =>
        item.designationArray?.some((data) => compopt.includes(data)) &&
        item.question?.toLowerCase() === question?.toLowerCase() &&
        item.category === catAndSub?.category &&
        item.subcategory === catAndSub?.subcategory
    );

    const isInvalid = optionstodo?.some((item) => {
      return (
        item.validation === "Between" &&
        item.options !== "NOANSWER" &&
        item.betweenfrom !== "" &&
        Number(item.options) !== Number(item.betweenfrom) &&
        item.betweento !== "" &&
        Number(item.options) !== Number(item.betweento)
      );
    });
    const samebetween = optionstodo?.some((item) => {
      return (
        item.validation === "Between" &&
        item.options !== "NOANSWER" &&
        item.betweenfrom !== "" &&
        item.betweento !== "" &&
        Number(item.betweenfrom) === Number(item.betweento)
      );
    });

    if (isQuestionMatch) {
      setPopupContentMalert("Question already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueCompanyCat?.length === 0) {
      setPopupContentMalert("Please Select Designation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (catAndSub?.category === "Please Select Category") {
      setPopupContentMalert("Please Select Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (catAndSub?.subcategory === "Please Select Sub Category") {
      setPopupContentMalert("Please Select Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (question === "Please Select Question") {
      setPopupContentMalert("Please Select Question!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (type === "Please Select Type") {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      type === "Typing Test" &&
      typingTestValidation?.speedvalidation === "Please Select Validation"
    ) {
      setPopupContentMalert("Please Select Speed Validation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      type === "Typing Test" &&
      typingTestValidation?.speedvalidation === "Between" &&
      (typingTestValidation?.speedfrom === "" ||
        typingTestValidation?.speedto === "")
    ) {
      setPopupContentMalert("Please Enter Both From and To Speed!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      type === "Typing Test" &&
      typingTestValidation?.speedstatus === "Please Select Status"
    ) {
      setPopupContentMalert("Please Select Speed Status!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      type === "Typing Test" &&
      typingTestValidation?.accuracyvalidation === "Please Select Validation"
    ) {
      setPopupContentMalert("Please Select Accuracy Validation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      type === "Typing Test" &&
      typingTestValidation?.accuracyvalidation === "Between" &&
      (typingTestValidation?.accuracyfrom === "" ||
        typingTestValidation?.accuracyto === "")
    ) {
      setPopupContentMalert("Please Enter Both From and To Accuracy!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      type === "Typing Test" &&
      typingTestValidation?.accuracystatus === "Please Select Status"
    ) {
      setPopupContentMalert("Please Select Accuracy Status!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      type === "Typing Test" &&
      typingTestValidation?.mistakesvalidation === "Please Select Validation"
    ) {
      setPopupContentMalert("Please Select Mistakes Validation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      type === "Typing Test" &&
      typingTestValidation?.mistakesvalidation === "Between" &&
      (typingTestValidation?.mistakesfrom === "" ||
        typingTestValidation?.mistakesto === "")
    ) {
      setPopupContentMalert("Please Enter Both From and To Mistakes!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      type === "Typing Test" &&
      typingTestValidation?.mistakesstatus === "Please Select Status"
    ) {
      setPopupContentMalert("Please Select Mistakes Status!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      (type === "Date" || type === "Date Range") &&
      dateStatus === "Please Select Status"
    ) {
      setPopupContentMalert("Please Select Status For All The Answers!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      (type === "Date" || type === "Date Range") &&
      dateDescription === ""
    ) {
      setPopupContentMalert("Please Enter Description!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      type === "Text-Numeric" &&
      optionstodo?.some(
        (item) =>
          item.options !== "NOANSWER" &&
          item.validation === "Please Select Validation"
      )
    ) {
      setPopupContentMalert("Please Select Validation For All The Answers!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      type === "Text-Numeric" &&
      optionstodo?.some(
        (item) =>
          item.validation === "Between" &&
          (item.betweenfrom === "" || item.betweento === "")
      )
    ) {
      setPopupContentMalert("Please Enter Both From and To Values!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (type === "Text-Numeric" && isInvalid) {
      setPopupContentMalert("Please Enter Valid Between Values!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (samebetween) {
      setPopupContentMalert("Both From Value and To value can not be same!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (questionDatas?.type !== "Typing Test" && informReason === "") {
      setPopupContentMalert("Please Enter Inform Reason or Not");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      (type === "Radio" ||
        type === "MultipleChoice" ||
        type === "TextBox" ||
        type === "Text-Alpha" ||
        type === "Text-Numeric" ||
        type === "Yes/No" ||
        type === "Correct/In Correct") &&
      optionstodo?.some((item) => item.status === "Please Select Status")
    ) {
      setPopupContentMalert("Please Select Status For All The Answers!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      (type === "Radio" ||
        type === "MultipleChoice" ||
        type === "TextBox" ||
        type === "Text-Alpha" ||
        type === "Text-Numeric" ||
        type === "Yes/No" ||
        type === "Correct/In Correct") &&
      optionstodo?.some((item) => item.description === "" || !item.description)
    ) {
      setPopupContentMalert("Please Enter Description For All The Answers!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (addReqTodo?.length > 0 && !duplicateCheck) {
      setPopupContentMalert("Please Add Sub Question in Todo!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (todoSubmit) {
      setPopupContentMalert("Please Add the Todo and Submit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setMode("Questions");
    setQuestion("Please Select Question");
    setAnswers("");
    setOptions("");
    setInformReason("");
    setyesOrNo("");
    setQuestionDatas({});
    setDescription("");
    setOptionstodo([]);
    setAddReqTodo([]);
    setExtraQuestions("Please Select Type Questions");
    setExtraOptions("Please Select Answers");
    setExtraQuestAdd("Please Select Extra Questions");
    setExtraType("");
    setDateStatus("Please Select Status");
    setDateDescription("");
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setQuestionDatas({
      yesorno: "",
      type: "",
      subquestionlength: "",
      options: "",
      date: "",
      fromdate: "",
      todate: e.todate,
      typingspeed: "",
      typingaccuracy: "",
      typingmistakes: "",
      typingduration: "",
      secondarytodo: [],
    });
    setTypingTestValidation({
      speedvalidation: "Please Select Validation",
      speedstatus: "Please Select Status",
      speedfrom: "",
      speedto: "",
      speeddescription: "",
      accuracyvalidation: "Please Select Validation",
      accuracystatus: "Please Select Status",
      accuracyfrom: "",
      accuracyto: "",
      accuracydescription: "",
      mistakesvalidation: "Please Select Validation",
      mistakesstatus: "Please Select Status",
      mistakesfrom: "",
      mistakesto: "",
      mistakesdescription: "",
    });
    setCatAndSub({
      category: "Please Select Category",
      subcategory: "Please Select Sub Category",
    });

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

    setOptionsEdit("");
    setIsTodoEditPage(Array(addReqTodoEdit.length).fill(false));
    setTodoSubmitEdit(false);

    setExtraQuestionsEdit("Please Select Type Questions");
    setExtraOptionsEdit("Please Select Answers");
    setExtraQuestAddEdit("Please Select Sub Question");
    setExtraTypeEdit("Please Select Extra Type");
    setOptionstodoExtraEdit([]);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  useEffect(() => {
    if (statusallotid && roundmasterCheck) {
      getCode(statusallotid)
    }
  }, [roundmasterCheck, statusallotid])
  const [editable, setEditable] = useState(false);
  const [findedQuestionGrouping, setFindedQuestionGrouping] = useState({})
  //get single row to edit....
  const getCode = async (e, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_INT_FORM_DESIGN}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });



      let statusAllot = res?.data?.sinterviewformdesign;
      let findedQuestionGrouping = questionGroupingValues?.find(data =>
        data?.mode === statusAllot?.mode &&
        data?.category === statusAllot?.category &&
        data?.subcategory?.includes(statusAllot?.subcategory) &&
        statusAllot?.designation?.includes(data?.designation) &&
        data?.question?.includes(statusAllot?.question)
      )
      setFindedQuestionGrouping(findedQuestionGrouping);
      setEditable(findedQuestionGrouping ? true : false);
      // if (answerallotdetails) {
      //   await fetchInterviewquestionsAns();
      //   await fetchInterviewquestions();
      // }
      // if (answerallotdetails) {
      //   console.log(answerallotdetails, "answerallotdetails");
      //   setRoundmasterEdit({
      //     ...res?.data?.sinterviewformdesign,
      //     informreason: res?.data?.sinterviewformdesign?.informreason || "",
      //     speedvalidation: res?.data?.sinterviewformdesign?.typingspeedvalidation,
      //     speedfrom: res?.data?.sinterviewformdesign?.typingspeedfrom,
      //     speedto: res?.data?.sinterviewformdesign?.typingspeedto,
      //     speedstatus: res?.data?.sinterviewformdesign?.typingspeedstatus,

      //     accuracyvalidation:
      //       res?.data?.sinterviewformdesign?.typingaccuracyvalidation,
      //     accuracyfrom: res?.data?.sinterviewformdesign?.typingaccuracyfrom,
      //     accuracyto: res?.data?.sinterviewformdesign?.typingaccuracyto,
      //     accuracystatus: res?.data?.sinterviewformdesign?.typingaccuracystatus,

      //     mistakesvalidation:
      //       res?.data?.sinterviewformdesign?.typingmistakesvalidation,
      //     mistakesfrom: res?.data?.sinterviewformdesign?.typingmistakesfrom,
      //     mistakesto: res?.data?.sinterviewformdesign?.typingmistakesto,
      //     mistakesstatus: res?.data?.sinterviewformdesign?.typingmistakesstatus,
      //   });
      //   setOptionstodoEdit(answerallotdetails?.optionArr || res?.data?.sinterviewformdesign?.optionArr);
      //   setModeEdit(answerallotdetails?.mode || res?.data?.sinterviewformdesign?.mode);
      //   getCategoryEdit(answerallotdetails?.mode || res?.data?.sinterviewformdesign?.mode);
      //   setAddReqTodoEdit(answerallotdetails?.secondarytodo || res?.data?.sinterviewformdesign?.secondarytodo);
      //   fetchInterviewquestionsOnchange(
      //     answerallotdetails?.category || res?.data?.sinterviewformdesign?.category,
      //     answerallotdetails?.subcategory || res?.data?.sinterviewformdesign?.subcategory
      //   );
      //   setCompanyValueCateEdit(res?.data?.sinterviewformdesign?.designation);
      //   setSelectedCompanyOptionsCateEdit([
      //     ...res?.data?.sinterviewformdesign?.designation.map((t) => ({
      //       ...t,
      //       label: t,
      //       value: t,
      //     })),
      //   ]);

      //   setQuestionDatasEdit({
      //     yesorno: answerallotdetails?.yesorno || res?.data?.sinterviewformdesign?.yesorno,
      //     type: answerallotdetails?.type || res?.data?.sinterviewformdesign?.type,
      //     subquestionlength: answerallotdetails?.subquestionlength || res?.data?.sinterviewformdesign?.subquestionlength,
      //     options: answerallotdetails?.optionArr || res?.data?.sinterviewformdesign?.optionArr,
      //     date: answerallotdetails?.date || res?.data?.sinterviewformdesign?.date,
      //     fromdate: answerallotdetails?.fromdate || res?.data?.sinterviewformdesign?.fromdate,
      //     todate: answerallotdetails?.todate || res?.data?.sinterviewformdesign?.todate,
      //     secondarytodo: answerallotdetails?.secondarytodo || res?.data?.sinterviewformdesign?.secondarytodo,
      //     typingspeed: answerallotdetails?.typingspeed || res?.data?.sinterviewformdesign?.typingspeed,
      //     typingaccuracy: answerallotdetails?.typingaccuracy || res?.data?.sinterviewformdesign?.typingaccuracy,
      //     typingmistakes: answerallotdetails?.typingmistakes || res?.data?.sinterviewformdesign?.typingmistakes,
      //     typingduration: answerallotdetails?.typingduration || res?.data?.sinterviewformdesign?.typingduration,
      //   });
      //   setDateStatusEdit(res?.data?.sinterviewformdesign?.datestatus);
      //   setDateDescriptionEdit(res?.data?.sinterviewformdesign?.datedescription);
      // } else {
      setRoundmasterEdit({
        ...res?.data?.sinterviewformdesign,
        informreason: res?.data?.sinterviewformdesign?.informreason || "",
        speedvalidation: res?.data?.sinterviewformdesign?.typingspeedvalidation,
        speedfrom: res?.data?.sinterviewformdesign?.typingspeedfrom,
        speedto: res?.data?.sinterviewformdesign?.typingspeedto,
        speedstatus: res?.data?.sinterviewformdesign?.typingspeedstatus,

        accuracyvalidation:
          res?.data?.sinterviewformdesign?.typingaccuracyvalidation,
        accuracyfrom: res?.data?.sinterviewformdesign?.typingaccuracyfrom,
        accuracyto: res?.data?.sinterviewformdesign?.typingaccuracyto,
        accuracystatus: res?.data?.sinterviewformdesign?.typingaccuracystatus,

        mistakesvalidation:
          res?.data?.sinterviewformdesign?.typingmistakesvalidation,
        mistakesfrom: res?.data?.sinterviewformdesign?.typingmistakesfrom,
        mistakesto: res?.data?.sinterviewformdesign?.typingmistakesto,
        mistakesstatus: res?.data?.sinterviewformdesign?.typingmistakesstatus,
      });
      setOptionstodoEdit(res?.data?.sinterviewformdesign?.optionArr);
      setModeEdit(res?.data?.sinterviewformdesign?.mode);
      await getCategoryEdit(res?.data?.sinterviewformdesign?.mode);
      setAddReqTodoEdit(res?.data?.sinterviewformdesign?.secondarytodo);
      await fetchInterviewquestionsOnchange(
        res?.data?.sinterviewformdesign?.category,
        res?.data?.sinterviewformdesign?.subcategory
      );
      setCompanyValueCateEdit(res?.data?.sinterviewformdesign?.designation);
      setSelectedCompanyOptionsCateEdit([
        ...res?.data?.sinterviewformdesign?.designation.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);

      setQuestionDatasEdit({
        yesorno: res?.data?.sinterviewformdesign?.yesorno,
        type: res?.data?.sinterviewformdesign?.type,
        subquestionlength: res?.data?.sinterviewformdesign?.subquestionlength,
        options: res?.data?.sinterviewformdesign?.optionArr,
        date: res?.data?.sinterviewformdesign?.date,
        fromdate: res?.data?.sinterviewformdesign?.fromdate,
        todate: res?.data?.sinterviewformdesign?.todate,
        secondarytodo: res?.data?.sinterviewformdesign?.secondarytodo,
        typingspeed: res?.data?.sinterviewformdesign?.typingspeed,
        typingaccuracy: res?.data?.sinterviewformdesign?.typingaccuracy,
        typingmistakes: res?.data?.sinterviewformdesign?.typingmistakes,
        typingduration: res?.data?.sinterviewformdesign?.typingduration,
      });
      setDateStatusEdit(res?.data?.sinterviewformdesign?.datestatus);
      setDateDescriptionEdit(res?.data?.sinterviewformdesign?.datedescription);
      // }
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
      let res = await axios.get(`${SERVICE.SINGLE_INT_FORM_DESIGN}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRoundmasterEdit(res?.data?.sinterviewformdesign);
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
      let res = await axios.get(`${SERVICE.SINGLE_INT_FORM_DESIGN}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRoundmasterEdit(res?.data?.sinterviewformdesign);
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

  const [catAndSub, setCatAndSub] = useState({
    category: "Please Select Category",
    subcategory: "Please Select Sub Category",
  });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [catDatas, setCatDatas] = useState([]);
  const [categoryOptionsEdit, setCategoryOptionsEdit] = useState([]);
  const [catDatasEdit, setCatDatasEdit] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const getCategory = async (mode) => {
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.CATEGORYINTERVIEW}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let questions = response.data.interviewcategory?.filter(
        (item) => item?.mode === mode
      );
      setAllCategory(response.data.interviewcategory);
      setCatDatas(questions);
      setCategoryOptions(
        questions?.map((item) => ({
          label: item.categoryname,
          value: item.categoryname,
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
  const getCategoryOnChange = async (mode) => {
    setPageName(!pageName);
    try {
      let questions = allCategory?.filter((item) => item?.mode === mode);
      setCatDatas(questions);
      setCategoryOptions(
        questions?.map((item) => ({
          label: item.categoryname,
          value: item.categoryname,
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
  const getCategoryEdit = async (mode) => {
    setPageName(!pageName);
    try {
      let questions = allCategory?.filter((item) => item?.mode === mode);
      setCatDatasEdit(questions);
      setCategoryOptionsEdit(
        questions?.map((item) => ({
          label: item.categoryname,
          value: item.categoryname,
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

  //Project updateby edit page...
  let updateby = roundmasterEdit?.updatedby;
  let addedby = roundmasterEdit?.addedby;

  let subprojectsid = roundmasterEdit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      await axios.put(`${SERVICE.SINGLE_INT_FORM_DESIGN}/${subprojectsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        designation: companyValueCateEdit,
        category: roundmasterEdit.category,
        subcategory: roundmasterEdit.subcategory,
        question: roundmasterEdit.question,
        type: roundmasterEdit.type,
        mode: modeEdit,
        optionArr: optionstodoEdit,
        answers: roundmasterEdit.answers,
        statusAns: roundmasterEdit.statusAns,
        informreason: roundmasterEdit?.type !== "Typing Test" ? roundmasterEdit.informreason : "",
        secondarytodo: addReqTodoEdit,
        status: roundmasterEdit.status,
        yesorno: String(roundmasterEdit.yesorno),
        subquestionlength: String(questionDatasEdit?.subquestionlength),
        date: String(questionDatasEdit?.date),
        fromdate: String(questionDatasEdit?.fromdate),
        todate: String(questionDatasEdit?.todate),
        datestatus: String(dateStatusEdit),
        datedescription: String(dateDescriptionEdit),

        typingspeed: String(
          roundmasterEdit?.type === "Typing Test"
            ? questionDatasEdit?.typingspeed
            : ""
        ),
        typingspeedvalidation: String(
          roundmasterEdit?.type === "Typing Test"
            ? roundmasterEdit?.speedvalidation
            : ""
        ),
        typingspeedfrom: String(
          roundmasterEdit?.type === "Typing Test" &&
            roundmasterEdit?.speedvalidation === "Between"
            ? roundmasterEdit?.speedfrom
            : ""
        ),
        typingspeedto: String(
          roundmasterEdit?.type === "Typing Test" &&
            roundmasterEdit?.speedvalidation === "Between"
            ? roundmasterEdit?.speedto
            : ""
        ),
        typingspeedstatus: String(
          roundmasterEdit?.type === "Typing Test"
            ? roundmasterEdit?.speedstatus
            : ""
        ),

        typingaccuracy: String(
          roundmasterEdit?.type === "Typing Test"
            ? questionDatasEdit?.typingaccuracy
            : ""
        ),
        typingaccuracyvalidation: String(
          roundmasterEdit?.type === "Typing Test"
            ? roundmasterEdit?.accuracyvalidation
            : ""
        ),
        typingaccuracyfrom: String(
          roundmasterEdit?.type === "Typing Test" &&
            roundmasterEdit?.accuracyvalidation === "Between"
            ? roundmasterEdit?.accuracyfrom
            : ""
        ),
        typingaccuracyto: String(
          roundmasterEdit?.type === "Typing Test" &&
            roundmasterEdit?.accuracyvalidation === "Between"
            ? roundmasterEdit?.accuracyto
            : ""
        ),
        typingaccuracystatus: String(
          roundmasterEdit?.type === "Typing Test"
            ? roundmasterEdit?.accuracystatus
            : ""
        ),

        typingmistakes: String(
          roundmasterEdit?.type === "Typing Test"
            ? questionDatasEdit?.typingmistakes
            : ""
        ),
        typingmistakesvalidation: String(
          roundmasterEdit?.type === "Typing Test"
            ? roundmasterEdit?.mistakesvalidation
            : ""
        ),
        typingmistakesfrom: String(
          roundmasterEdit?.type === "Typing Test" &&
            roundmasterEdit?.mistakesvalidation === "Between"
            ? roundmasterEdit?.mistakesfrom
            : ""
        ),
        typingmistakesto: String(
          roundmasterEdit?.type === "Typing Test" &&
            roundmasterEdit?.mistakesvalidation === "Between"
            ? roundmasterEdit?.mistakesto
            : ""
        ),
        typingmistakesstatus: String(
          roundmasterEdit?.type === "Typing Test"
            ? roundmasterEdit?.mistakesstatus
            : ""
        ),

        typingduration: String(
          roundmasterEdit?.type === "Typing Test"
            ? questionDatasEdit?.typingduration
            : ""
        ),

        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      let res = await axios.put(`${SERVICE.INTERVIEWSTATUSALLOT_OVERALLEDIT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        question: roundmasterEdit?.question,
        type: roundmasterEdit?.type,
        statusAllotId: subprojectsid,
        optionArr: optionstodoEdit,
        answers: roundmasterEdit.answers,
        date: questionDatasEdit?.date,
        fromdate: questionDatasEdit?.fromdate,
        todate: questionDatasEdit?.todate,
        datestatus: dateStatusEdit,
        informreason: roundmasterEdit?.type !== "Typing Test" ? roundmasterEdit.informreason : "",
        datedescription: dateDescriptionEdit,
        secondarytodo: addReqTodoEdit,
        subquestionlength: questionDatasEdit?.subquestionlength,
        yesorno: roundmasterEdit.yesorno,
        statusAns: roundmasterEdit.statusAns,
        typingspeedvalidation: String(
          roundmasterEdit?.type === "Typing Test"
            ? roundmasterEdit?.speedvalidation
            : ""
        ),
        typingspeedfrom: String(
          roundmasterEdit?.type === "Typing Test" &&
            roundmasterEdit?.speedvalidation === "Between"
            ? roundmasterEdit?.speedfrom
            : ""
        ),
        typingspeedto: String(
          roundmasterEdit?.type === "Typing Test" &&
            roundmasterEdit?.speedvalidation === "Between"
            ? roundmasterEdit?.speedto
            : ""
        ),
        typingspeedstatus: String(
          roundmasterEdit?.type === "Typing Test"
            ? roundmasterEdit?.speedstatus
            : ""
        ),

        typingaccuracy: String(
          roundmasterEdit?.type === "Typing Test"
            ? questionDatasEdit?.typingaccuracy
            : ""
        ),
        typingaccuracyvalidation: String(
          roundmasterEdit?.type === "Typing Test"
            ? roundmasterEdit?.accuracyvalidation
            : ""
        ),
        typingaccuracyfrom: String(
          roundmasterEdit?.type === "Typing Test" &&
            roundmasterEdit?.accuracyvalidation === "Between"
            ? roundmasterEdit?.accuracyfrom
            : ""
        ),
        typingaccuracyto: String(
          roundmasterEdit?.type === "Typing Test" &&
            roundmasterEdit?.accuracyvalidation === "Between"
            ? roundmasterEdit?.accuracyto
            : ""
        ),
        typingaccuracystatus: String(
          roundmasterEdit?.type === "Typing Test"
            ? roundmasterEdit?.accuracystatus
            : ""
        ),

        typingmistakes: String(
          roundmasterEdit?.type === "Typing Test"
            ? questionDatasEdit?.typingmistakes
            : ""
        ),
        typingmistakesvalidation: String(
          roundmasterEdit?.type === "Typing Test"
            ? roundmasterEdit?.mistakesvalidation
            : ""
        ),
        typingmistakesfrom: String(
          roundmasterEdit?.type === "Typing Test" &&
            roundmasterEdit?.mistakesvalidation === "Between"
            ? roundmasterEdit?.mistakesfrom
            : ""
        ),
        typingmistakesto: String(
          roundmasterEdit?.type === "Typing Test" &&
            roundmasterEdit?.mistakesvalidation === "Between"
            ? roundmasterEdit?.mistakesto
            : ""
        ),
        typingmistakesstatus: String(
          roundmasterEdit?.type === "Typing Test"
            ? roundmasterEdit?.mistakesstatus
            : ""
        ),

        typingduration: String(
          roundmasterEdit?.type === "Typing Test"
            ? questionDatasEdit?.typingduration
            : ""
        ),
      });
      await fetchRoundmaster();
      setOptionsEdit("");
      setDescriptionEdit("");
      setOptionstodoEdit([]);
      setAddReqTodoEdit([]);
      setQuestionDatasEdit({
        yesorno: "",
        type: "",
        subquestionlength: "",
        options: "",
        date: "",
        fromdate: "",
        todate: "",
        typingspeed: "",
        typingaccuracy: "",
        typingmistakes: "",
        typingduration: "",
        secondarytodo: [],
      });

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
  const handleOpenOverallEditPopup = () => {
    setOpenOverAllEditPopup(true);
  };
  const handleCloseOverallEditPopup = () => {
    setOpenOverAllEditPopup(false);
  };

  const editSubmit = (e) => {
    e.preventDefault();
    const duplicateCheck = addReqTodoEdit?.some(
      (data) => data.extraquestion === "Sub Question"
    );

    let compopt = selectedCompanyOptionsCateEdit.map((item) => item.value);
    const isQuestionMatch = allRoundmasteredit?.some(
      (item) =>
        item.designationArray?.some((data) => compopt.includes(data)) &&
        item.question?.toLowerCase() ===
        roundmasterEdit?.question?.toLowerCase() &&
        item?.mode === modeEdit &&
        item?.category === roundmasterEdit?.category &&
        item?.subcategory === roundmasterEdit?.subcategory
    );

    const isInvalid = optionstodoEdit?.some((item) => {
      return (
        item.validation === "Between" &&
        item.options !== "NOANSWER" &&
        item.betweenfrom !== "" &&
        Number(item.options) !== Number(item.betweenfrom) &&
        item.betweento !== "" &&
        Number(item.options) !== Number(item.betweento)
      );
    });
    const samebetween = optionstodoEdit?.some((item) => {
      return (
        item.validation === "Between" &&
        item.options !== "NOANSWER" &&
        item.betweenfrom !== "" &&
        item.betweento !== "" &&
        Number(item.betweenfrom) === Number(item.betweento)
      );
    });

    if (isQuestionMatch) {
      setPopupContentMalert("Question already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (companyValueCateEdit?.length === 0) {
      setPopupContentMalert("Please Select Designation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (!modeEdit) {
      setPopupContentMalert("Please Select Mode!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      roundmasterEdit?.category === "Please Select Category" ||
      roundmasterEdit?.category === "" ||
      roundmasterEdit?.category === undefined
    ) {
      setPopupContentMalert("Please Select Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      roundmasterEdit?.subcategory === "Please Select Sub Category" ||
      roundmasterEdit?.subcategory === "" ||
      roundmasterEdit?.subcategory === undefined
    ) {
      setPopupContentMalert("Please Select Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (roundmasterEdit?.question === "Please Select Question") {
      setPopupContentMalert("Please Select Question!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (roundmasterEdit?.type === "Please Select Type") {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (roundmasterEdit?.type === "Date" || roundmasterEdit?.type === "Date Range") &&
      dateDescriptionEdit === ""
    ) {
      setPopupContentMalert("Please Enter Description!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      roundmasterEdit?.type === "Typing Test" &&
      roundmasterEdit?.speedvalidation === "Please Select Validation"
    ) {
      setPopupContentMalert("Please Select Speed Validation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      roundmasterEdit?.type === "Typing Test" &&
      roundmasterEdit?.speedvalidation === "Between" &&
      (roundmasterEdit?.speedfrom === "" || roundmasterEdit?.speedto === "")
    ) {
      setPopupContentMalert("Please Enter Both From and To Speed!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      roundmasterEdit?.type === "Typing Test" &&
      roundmasterEdit?.speedstatus === "Please Select Status"
    ) {
      setPopupContentMalert("Please Select Speed Status!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      roundmasterEdit?.type === "Typing Test" &&
      roundmasterEdit?.accuracyvalidation === "Please Select Validation"
    ) {
      setPopupContentMalert("Please Select Accuracy Validation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      roundmasterEdit?.type === "Typing Test" &&
      roundmasterEdit?.accuracyvalidation === "Between" &&
      (roundmasterEdit?.accuracyfrom === "" ||
        roundmasterEdit?.accuracyto === "")
    ) {
      setPopupContentMalert("Please Enter Both From and To Accuracy!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      roundmasterEdit?.type === "Typing Test" &&
      roundmasterEdit?.accuracystatus === "Please Select Status"
    ) {
      setPopupContentMalert("Please Select Accuracy Status!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      roundmasterEdit?.type === "Typing Test" &&
      roundmasterEdit?.mistakesvalidation === "Please Select Validation"
    ) {
      setPopupContentMalert("Please Select Mistakes Validation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      roundmasterEdit?.type === "Typing Test" &&
      roundmasterEdit?.mistakesvalidation === "Between" &&
      (roundmasterEdit?.mistakesfrom === "" ||
        roundmasterEdit?.mistakesto === "")
    ) {
      setPopupContentMalert("Please Enter Both From and To Mistakes!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      roundmasterEdit?.type === "Typing Test" &&
      roundmasterEdit?.mistakesstatus === "Please Select Status"
    ) {
      setPopupContentMalert("Please Select Mistakes Status!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (roundmasterEdit?.type === "Date" ||
        roundmasterEdit?.type === "Date Range") &&
      dateStatusEdit === "Please Select Status"
    ) {
      setPopupContentMalert("Please Select Status For All The Answers!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      roundmasterEdit?.type === "Text-Numeric" &&
      optionstodoEdit?.some(
        (item) =>
          item.options !== "NOANSWER" &&
          item.validation === "Please Select Validation"
      )
    ) {
      setPopupContentMalert("Please Select Validation For All The Answers!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      roundmasterEdit?.type === "Text-Numeric" &&
      optionstodoEdit?.some(
        (item) =>
          item.validation === "Between" &&
          (item.betweenfrom === "" || item.betweento === "")
      )
    ) {
      setPopupContentMalert("Please Enter Both From and To Values!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (roundmasterEdit?.type === "Text-Numeric" && isInvalid) {
      setPopupContentMalert("Please Enter Valid Between Values!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (samebetween) {
      setPopupContentMalert("Both From Value and To value can not be same!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (roundmasterEdit?.type !== "Typing Test" && !roundmasterEdit.informreason) {
      setPopupContentMalert("Please Enter Inform Reason or Not!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      (roundmasterEdit?.type === "Radio" ||
        roundmasterEdit?.type === "MultipleChoice" ||
        roundmasterEdit?.type === "TextBox" ||
        roundmasterEdit?.type === "Text-Alpha" ||
        roundmasterEdit?.type === "Text-Numeric" ||
        roundmasterEdit?.type === "Yes/No" ||
        roundmasterEdit?.type === "Correct/In Correct") &&
      optionstodoEdit?.some((item) => item.status === "Please Select Status")
    ) {
      setPopupContentMalert("Please Select Status For All The Answers!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      (roundmasterEdit?.type === "Radio" ||
        roundmasterEdit?.type === "MultipleChoice" ||
        roundmasterEdit?.type === "TextBox" ||
        roundmasterEdit?.type === "Text-Alpha" ||
        roundmasterEdit?.type === "Text-Numeric" ||
        roundmasterEdit?.type === "Yes/No" ||
        roundmasterEdit?.type === "Correct/In Correct") &&
      optionstodoEdit?.some((item) => item.description === "" || !item.description)
    ) {
      setPopupContentMalert("Please Enter Description For All The Answers!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (addReqTodoEdit?.length > 0 && !duplicateCheck) {
      setPopupContentMalert("Please Add Sub Question in Todo!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (todoSubmitEdit) {
      setPopupContentMalert("Please Add the Todo and Submit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    else {
      handleOpenOverallEditPopup();
      handleCloseModEdit();
      // sendEditRequest();
    }
  };


  const [questionGroupingValues, setQuestionGroupingValues] = useState([]);
  useEffect(() => {
    fetchQuestionGrouping();
  }, [])
  const fetchQuestionGrouping = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.INTERVIEWQUESTIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setQuestionGroupingValues(res_vendor?.data?.interviewgroupingquestion);
      return res_vendor?.data?.interviewgroupingquestion;

    } catch (err) {

      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  //get all Sub vendormasters.
  const fetchRoundmaster = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.GET_INT_FORM_DESIGN, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setRoundmasters(res_vendor?.data?.interviewformdesign?.map((item, index) => ({
        ...item, id: item._id,
        serialNumber: index + 1,
        designationArray: item.designation,
        designation: item.designation
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .toString(),
        options:
          item.type === "Date"
            ? item?.date !== ""
              ? moment(item?.date).format("DD-MM-YYYY")
              : ""
            : item.type === "Date Range"
              ? `${moment(item?.fromdate).format("DD-MM-YYYY")} to ${moment(
                item?.todate
              ).format("DD-MM-YYYY")}`
              : item.optionArr
                ?.map((t, i) => `${i + 1 + ". "}` + t.options)
                .toString(),
        status:
          item.type === "Date"
            ? item.datestatus
            : item.type === "Date Range"
              ? item.datestatus
              : item.optionArr
                ?.map((t, i) => `${i + 1 + ". "}` + t.status)
                .toString(),
        extraquestions: item?.secondarytodo
          ?.map((t, i) => `${i + 1 + ". "}` + t?.question)
          .toString(),
        subquestiontype: item?.secondarytodo
          ?.map((t, i) => `${i + 1 + ". "}` + t?.type)
          .toString(),
        subquestionanswers: item?.secondarytodo
          .map((todo, index) => {
            return todo?.optionslist
              .map((option, optionIndex) => {
                const optionChar = String.fromCharCode(65 + optionIndex);
                return `${index + 1}.${optionChar}. ${option.answer}`;
              })
              .join(", ");
          })
          .join("; "), // Joining the array into a string
        subquestionanswersstatus: item?.secondarytodo
          .map((todo, index) => {
            return todo?.optionslist
              .map((option, optionIndex) => {
                const optionChar = String.fromCharCode(65 + optionIndex);
                return `${index + 1}.${optionChar}. ${option.status}`;
              })
              .join(", ");
          })
          .join("; "),
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
      let res_meet = await axios.get(SERVICE.GET_INT_FORM_DESIGN, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllRoundmasteredit(
        res_meet?.data?.interviewformdesign.filter((item) => item._id !== e)
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
  const fileName = "Interview Status Allot";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Interview Status Allot",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchRoundmaster();
    getCategory("Questions");
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
    addSerialNumber(roundmasters);
  }, [roundmasters]);
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
      //lockPinned: true,
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 200,
      hide: !columnVisibility.designation,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "mode",
      headerName: "Mode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.mode,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0,
      width: 120,
      hide: !columnVisibility.category,
      headerClassName: "bold-header",
    },
    {
      field: "subcategory",
      headerName: "Sub Category",
      flex: 0,
      width: 150,
      hide: !columnVisibility.subcategory,
      headerClassName: "bold-header",
    },
    {
      field: "question",
      headerName: "Question",
      flex: 0,
      width: 200,
      hide: !columnVisibility.question,
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
      field: "options",
      headerName: "Answers",
      flex: 0,
      width: 200,
      hide: !columnVisibility.options,
      headerClassName: "bold-header",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 100,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
    },
    {
      field: "extraquestions",
      headerName: "Sub Question",
      flex: 0,
      width: 250,
      hide: !columnVisibility.extraquestions,
      headerClassName: "bold-header",
    },
    {
      field: "subquestiontype",
      headerName: "Sub Question Type",
      flex: 0,
      width: 150,
      hide: !columnVisibility.subquestiontype,
      headerClassName: "bold-header",
    },
    {
      field: "subquestionanswers",
      headerName: "Sub Question Answers",
      flex: 0,
      width: 250,
      hide: !columnVisibility.subquestionanswers,
      headerClassName: "bold-header",
    },

    {
      field: "subquestionanswersstatus",
      headerName: "Sub Question Answers Status",
      flex: 0,
      width: 250,
      hide: !columnVisibility.subquestionanswersstatus,
      headerClassName: "bold-header",
    },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 400,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      //lockPinned: true,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("einterviewstatusallot") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getCode(params.data.id, params.data.name);
                fetchRoundmasterAll(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />{" "}
            </Button>
          )}
          {isUserRoleCompare?.includes("dinterviewstatusallot") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vinterviewstatusallot") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iinterviewstatusallot") && (
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
      category: item.category,
      subcategory: item.subcategory,
      mode: item.mode,
      designation: item.designation,
      type: item.type,
      options: item.options,
      status: item.status,
      extraquestions: item?.extraquestions,
      subquestiontype: item?.subquestiontype,
      subquestionanswers: item?.subquestionanswers, // Joining the array into a string
      subquestionanswersstatus: item?.subquestionanswersstatus,
      answers: item.answers,
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
              // secondary={column.headerName }
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

  let modeOptions = [
    {
      label: "Questions",
      value: "Questions",
    },
    {
      label: "Typing Test",
      value: "Typing Test",
    },
  ];
  const [mode, setMode] = useState("Questions");
  const [modeEdit, setModeEdit] = useState("Questions");

  return (
    <Box>
      <Headtitle title={"INTERVIEW STATUS ALLOT"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Interview Status Allot"
        modulename="Interview"
        submodulename="Interview Setup"
        mainpagename="Interview Status Allot"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("ainterviewstatusallot") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Interview Status Allot
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Designation <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
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
                      value={selectedOptionsCompany}
                      onChange={(e) => {
                        handleCompanyChange(e);



                        setMode("Questions");
                        setCatAndSub({
                          ...catAndSub,
                          category: "Please Select Category",
                          subcategory: "Please Select Sub Category",
                        });
                        setOptionstodo([]);
                        setQuestionDatas({
                          yesorno: "",
                          type: "",
                          subquestionlength: "",
                          options: "",
                          date: "",
                          fromdate: "",
                          todate: e.todate,
                          typingspeed: "",
                          typingaccuracy: "",
                          typingmistakes: "",
                          typingduration: "",
                          secondarytodo: [],
                        });
                        setQuestion("Please Select Question");
                        setType("Please Select Type");
                        setAnswers("");
                        setOptions("");
                        setDescription("");
                        setAddReqTodo([]);
                        setExtraQuestions("Please Select Type Questions");
                        setExtraOptions("Please Select Answers");
                        setExtraQuestAdd("Please Select Extra Questions");
                        setExtraType("");
                        setTodoSubmit(false);
                        setDateStatus("Please Select Status");
                        setDateDescription("");
                      }}
                      valueRenderer={customValueRendererCompany}
                      labelledBy="Please Select Designation"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Mode <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={modeOptions}
                      styles={colourStyles}
                      value={{
                        label: mode,
                        value: mode,
                      }}
                      onChange={(e) => {
                        setMode(e.value);
                        getCategoryOnChange(e.value);
                        setCatAndSub({
                          ...catAndSub,
                          category: "Please Select Category",
                          subcategory: "Please Select Sub Category",
                        });
                        setOptionstodo([]);
                        setQuestionDatas({
                          yesorno: "",
                          type: "",
                          subquestionlength: "",
                          options: "",
                          date: "",
                          fromdate: "",
                          todate: e.todate,
                          typingspeed: "",
                          typingaccuracy: "",
                          typingmistakes: "",
                          typingduration: "",
                          secondarytodo: [],
                        });
                        setQuestion("Please Select Question");
                        setType("Please Select Type");
                        setAnswers("");
                        setOptions("");
                        setDescription("");
                        setAddReqTodo([]);
                        setExtraQuestions("Please Select Type Questions");
                        setExtraOptions("Please Select Answers");
                        setExtraQuestAdd("Please Select Extra Questions");
                        setExtraType("");
                        setTodoSubmit(false);
                        setDateStatus("Please Select Status");
                        setDateDescription("");
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={categoryOptions}
                      styles={colourStyles}
                      value={{
                        label: catAndSub.category,
                        value: catAndSub.category,
                      }}
                      onChange={(e) => {
                        setCatAndSub({
                          ...catAndSub,
                          category: e.value,
                          subcategory: "Please Select Sub Category",
                        });
                        setOptionstodo([]);
                        setQuestionDatas({
                          yesorno: "",
                          type: "",
                          subquestionlength: "",
                          options: "",
                          date: "",
                          fromdate: "",
                          todate: e.todate,
                          typingspeed: "",
                          typingaccuracy: "",
                          typingmistakes: "",
                          typingduration: "",
                          secondarytodo: [],
                        });
                        setQuestion("Please Select Question");
                        setType("Please Select Type");
                        setAnswers("");
                        setOptions("");
                        setDescription("");
                        setAddReqTodo([]);
                        setExtraQuestions("Please Select Type Questions");
                        setExtraOptions("Please Select Answers");
                        setExtraQuestAdd("Please Select Extra Questions");
                        setExtraType("");
                        setTodoSubmit(false);
                        setDateStatus("Please Select Status");
                        setDateDescription("");
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Category <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={catDatas
                        .filter(
                          (item) =>
                            item.categoryname === catAndSub.category &&
                            item?.mode === mode
                        )
                        .map((item) => {
                          return item.subcategoryname.map((subCatName) => ({
                            label: subCatName,
                            value: subCatName,
                          }));
                        })
                        .flat()}
                      styles={colourStyles}
                      value={{
                        label: catAndSub.subcategory,
                        value: catAndSub.subcategory,
                      }}
                      onChange={(e) => {
                        setCatAndSub({
                          ...catAndSub,
                          subcategory: e.value,
                        });
                        fetchInterviewquestionsOnchange(
                          catAndSub.category,
                          e.value
                        );
                        setOptionstodo([]);
                        setQuestionDatas({
                          yesorno: "",
                          type: "",
                          subquestionlength: "",
                          options: "",
                          date: "",
                          fromdate: "",
                          todate: e.todate,
                          typingspeed: "",
                          typingaccuracy: "",
                          typingmistakes: "",
                          typingduration: "",
                          secondarytodo: [],
                        });
                        setQuestion("Please Select Question");
                        setType("Please Select Type");
                        setAnswers("");
                        setOptions("");
                        setDescription("");
                        setAddReqTodo([]);
                        setExtraQuestions("Please Select Type Questions");
                        setExtraOptions("Please Select Answers");
                        setExtraQuestAdd("Please Select Extra Questions");
                        setExtraType("");
                        setTodoSubmit(false);
                        setDateStatus("Please Select Status");
                        setDateDescription("");
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Interview Question <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={interview?.filter(
                        (item) =>
                          item.category === catAndSub.category &&
                          item.subcategory === catAndSub.subcategory &&
                          !roundmasters.some((q) => item.category === q.category &&
                            item.subcategory === q.subcategory && q.question === item.value && q?.designationArray?.some(des => valueCompanyCat?.includes(des))) &&
                          item.mode === mode
                      )}

                      styles={colourStyles}
                      value={{ label: question, value: question }}
                      onChange={(e) => {
                        setQuestion(e.value);
                        setyesOrNo(e.yesorno);
                        setQuestionDatas({
                          yesorno: e.yesorno,
                          type: e.type,
                          subquestionlength: e.subquestionlength,
                          options: e.optionArr,
                          date: e.date,
                          fromdate: e.fromdate,
                          todate: e.todate,
                          typingspeed: e?.typingspeed,
                          typingaccuracy: e?.typingaccuracy,
                          typingmistakes: e?.typingmistakes,
                          typingduration: e?.typingduration,
                          secondarytodo: e.secondarytodo,
                        });
                        setTypingTestValidation({
                          speedvalidation: "Please Select Validation",
                          speedstatus: "Please Select Status",
                          speedfrom: "",
                          speedto: "",
                          speeddescription: "",

                          accuracyvalidation: "Please Select Validation",
                          accuracystatus: "Please Select Status",
                          accuracyfrom: "",
                          accuracyto: "",
                          accuracydescription: "",

                          mistakesvalidation: "Please Select Validation",
                          mistakesstatus: "Please Select Status",
                          mistakesfrom: "",
                          mistakesto: "",
                          mistakesdescription: "",
                        });
                        setType(e.type);
                        if (e.type === "Yes/No") {
                          setOptionstodo([
                            {
                              options: "Yes",
                              tamiloptions: "ஆம்",
                              status: "Please Select Status",
                              validation: "Please Select Validation",
                              description: "",
                              betweenfrom: "",
                              betweento: "",
                            },
                            {
                              options: "No",
                              tamiloptions: "இல்லை",
                              status: "Please Select Status",
                              validation: "Please Select Validation",
                              description: "",
                              betweenfrom: "",
                              betweento: "",
                            },
                          ]);
                        } else if (e.type === "Correct/In Correct") {
                          setOptionstodo([
                            {
                              options: "Correct",
                              tamiloptions: "சரி",
                              status: "Please Select Status",
                              validation: "Please Select Validation",
                              description: "",
                              betweenfrom: "",
                              betweento: "",
                            },
                            {
                              options: "In Correct",
                              tamiloptions: "தவறு",
                              status: "Please Select Status",
                              validation: "Please Select Validation",
                              description: "",
                              betweenfrom: "",
                              betweento: "",
                            },
                          ]);
                        } else {
                          setOptionstodo(
                            e.optionArr?.map((item) => ({
                              options: item.options,
                              tamiloptions: item?.tamiloptions || "",
                              status: "Please Select Status",
                              validation: "Please Select Validation",
                              description: "",
                              betweenfrom: "",
                              betweento: "",
                            }))
                          );
                        }

                        setAnswers("");
                        setOptions("");
                        setDescription("");
                        setAddReqTodo([]);
                        setExtraQuestions("Please Select Type Questions");
                        setExtraOptions("Please Select Answers");
                        setExtraQuestAdd("Please Select Extra Questions");
                        setExtraType("");
                        setTodoSubmit(false);
                        setDateStatus("Please Select Status");
                        setDateDescription("");
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Interview Question Type"
                      value={questionDatas?.type}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                {questionDatas?.type !== "Typing Test" &&
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Inform Reason or Not<b style={{ color: "red" }}>*</b>
                      </Typography>

                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={2.5}
                        value={informReason}
                        onChange={(e) =>
                          setInformReason(e.target.value)
                        }
                      />
                    </FormControl>
                  </Grid>}
                {questionDatas?.type === "Typing Test" && (
                  <>
                    <Grid item md={6} xs={12} sm={12}>
                      {" "}
                    </Grid>
                    <Grid item md={2} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Speed</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={`${questionDatas?.typingspeed} wpm`}
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Validation
                          <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={validationOptions}
                          styles={colourStyles}
                          value={{
                            label: typingTestValidation?.speedvalidation,
                            value: typingTestValidation?.speedvalidation,
                          }}
                          onChange={(e) =>
                            setTypingTestValidation({
                              ...typingTestValidation,
                              speedvalidation: e.value,
                              speedfrom: "",
                              speedto: "",
                              speed: "",
                            })
                          }
                        />
                      </FormControl>
                    </Grid>
                    {typingTestValidation?.speedvalidation === "Between" && (
                      <Grid item md={3} xs={12} sm={12}>
                        <Grid container spacing={2}>
                          <Grid item md={6} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                {" "}
                                From <b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={typingTestValidation?.speedfrom}
                                onChange={(e) => {
                                  const numericOnly = e.target.value.replace(
                                    /[^0-9.;\s]/g,
                                    ""
                                  );
                                  setTypingTestValidation({
                                    ...typingTestValidation,
                                    speedfrom: numericOnly,
                                    speedto: "",
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={6} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                {" "}
                                To <b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={typingTestValidation?.speedto}
                                onChange={(e) => {
                                  const numericOnly = e.target.value.replace(
                                    /[^0-9.;\s]/g,
                                    ""
                                  );
                                  setTypingTestValidation({
                                    ...typingTestValidation,
                                    speedto: numericOnly,
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}

                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Status<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={statusOptiontyping}
                          styles={colourStyles}
                          value={{
                            label: typingTestValidation?.speedstatus,
                            value: typingTestValidation?.speedstatus,
                          }}
                          onChange={(e) =>
                            setTypingTestValidation({
                              ...typingTestValidation,
                              speedstatus: e.value,
                              speeddescription: "",
                            })
                          }
                        />
                      </FormControl>
                    </Grid>
                    {typingTestValidation?.speedvalidation !== "Between" && (
                      <Grid item md={3} xs={12} sm={12}></Grid>
                    )}
                    <Grid item md={2} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Accuracy</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={`${questionDatas?.typingaccuracy} %`}
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Validation
                          <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={validationOptions}
                          styles={colourStyles}
                          value={{
                            label: typingTestValidation?.accuracyvalidation,
                            value: typingTestValidation?.accuracyvalidation,
                          }}
                          onChange={(e) =>
                            setTypingTestValidation({
                              ...typingTestValidation,
                              accuracyvalidation: e.value,
                              accuracyfrom: "",
                              accuracyto: "",
                            })
                          }
                        />
                      </FormControl>
                    </Grid>
                    {typingTestValidation?.accuracyvalidation === "Between" && (
                      <Grid item md={3} xs={12} sm={12}>
                        <Grid container spacing={2}>
                          <Grid item md={6} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                {" "}
                                From <b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={typingTestValidation?.accuracyfrom}
                                onChange={(e) => {
                                  const numericOnly = e.target.value.replace(
                                    /[^0-9.;\s]/g,
                                    ""
                                  );
                                  setTypingTestValidation({
                                    ...typingTestValidation,
                                    accuracyfrom: numericOnly,
                                    accuracyto: "",
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={6} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                {" "}
                                To <b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={typingTestValidation?.accuracyto}
                                onChange={(e) => {
                                  const numericOnly = e.target.value.replace(
                                    /[^0-9.;\s]/g,
                                    ""
                                  );
                                  setTypingTestValidation({
                                    ...typingTestValidation,
                                    accuracyto: numericOnly,
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}

                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Status<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={statusOptiontyping}
                          styles={colourStyles}
                          value={{
                            label: typingTestValidation?.accuracystatus,
                            value: typingTestValidation?.accuracystatus,
                          }}
                          onChange={(e) =>
                            setTypingTestValidation({
                              ...typingTestValidation,
                              accuracystatus: e.value,
                              accuracydescription: "",
                            })
                          }
                        />
                      </FormControl>
                    </Grid>
                    {typingTestValidation?.accuracyvalidation !== "Between" && (
                      <Grid item md={3} xs={12} sm={12}></Grid>
                    )}
                    <Grid item md={2} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>No.Of Mistakes Acceptable</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={`${questionDatas?.typingmistakes}`}
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Validation
                          <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={validationOptions}
                          styles={colourStyles}
                          value={{
                            label: typingTestValidation?.mistakesvalidation,
                            value: typingTestValidation?.mistakesvalidation,
                          }}
                          onChange={(e) =>
                            setTypingTestValidation({
                              ...typingTestValidation,
                              mistakesvalidation: e.value,
                              mistakesfrom: "",
                              mistakesto: "",
                            })
                          }
                        />
                      </FormControl>
                    </Grid>
                    {typingTestValidation?.mistakesvalidation === "Between" && (
                      <Grid item md={3} xs={12} sm={12}>
                        <Grid container spacing={2}>
                          <Grid item md={6} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                {" "}
                                From <b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={typingTestValidation?.mistakesfrom}
                                onChange={(e) => {
                                  const numericOnly = e.target.value.replace(
                                    /[^0-9.;\s]/g,
                                    ""
                                  );
                                  setTypingTestValidation({
                                    ...typingTestValidation,
                                    mistakesfrom: numericOnly,
                                    mistakesto: "",
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={6} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                {" "}
                                To <b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={typingTestValidation?.mistakesto}
                                onChange={(e) => {
                                  const numericOnly = e.target.value.replace(
                                    /[^0-9.;\s]/g,
                                    ""
                                  );
                                  setTypingTestValidation({
                                    ...typingTestValidation,
                                    mistakesto: numericOnly,
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}

                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Status<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={statusOptiontyping}
                          styles={colourStyles}
                          value={{
                            label: typingTestValidation?.mistakesstatus,
                            value: typingTestValidation?.mistakesstatus,
                          }}
                          onChange={(e) =>
                            setTypingTestValidation({
                              ...typingTestValidation,
                              mistakesstatus: e.value,
                              mistakesdescription: "",
                            })
                          }
                        />
                      </FormControl>
                    </Grid>
                    {typingTestValidation?.mistakesvalidation !== "Between" && (
                      <Grid item md={3} xs={12} sm={12}></Grid>
                    )}
                  </>
                )}

                {questionDatas?.type === "Date" && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Date</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={
                          questionDatas?.date === ""
                            ? ""
                            : moment(questionDatas?.date).format("DD-MM-YYYY")
                        }
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                )}
                {questionDatas?.type === "Date Range" && (
                  <>
                    <Grid item md={2.5} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>From Date</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={moment(questionDatas?.fromdate).format(
                            "DD-MM-YYYY"
                          )}
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={2.5} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          To Date<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={moment(questionDatas?.todate).format(
                            "DD-MM-YYYY"
                          )}
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}

                {(questionDatas?.type === "Date" ||
                  questionDatas?.type === "Date Range") && (
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Status<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={statusOption}
                            styles={colourStyles}
                            value={{
                              label: dateStatus,
                              value: dateStatus,
                            }}
                            onChange={(e) => setDateStatus(e.value)}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Description
                            <b style={{ color: "red" }}>*</b>
                          </Typography>

                          <TextareaAutosize
                            aria-label="minimum height"
                            minRows={2.5}
                            value={dateDescription}
                            onChange={(e) =>
                              setDateDescription(
                                e.target.value
                              )
                            }
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                {(questionDatas?.type === "MultipleChoice" ||
                  questionDatas?.type === "Radio" ||
                  questionDatas?.type === "TextBox" ||
                  questionDatas?.type === "Text-Alpha" ||
                  questionDatas?.type === "Yes/No" ||
                  questionDatas?.type === "Correct/In Correct" ||
                  questionDatas?.type === "Text-Alpha" ||
                  questionDatas?.type === "Text-Numeric") && (
                    <>
                      <Grid item md={3} xs={12} sm={12}></Grid>
                      <br />
                      {optionstodo.length > 0 && (
                        <Grid item md={9} xs={12} sm={12}>
                          <ul type="none">
                            {optionstodo?.map((item, index) => {
                              return (
                                <li key={index}>
                                  <br />
                                  <Grid sx={{ display: "flex" }}>
                                    <FormControl fullWidth size="small">
                                      <Typography> Answers List</Typography>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={item.options}
                                        readOnly
                                      />
                                    </FormControl>
                                    &emsp;
                                    {item.options !== "NOANSWER" &&
                                      questionDatas?.type === "Text-Numeric" && (
                                        <>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              Validation
                                              <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                              options={[
                                                {
                                                  label: `Less Than`,
                                                  value: `Less Than`,
                                                },
                                                {
                                                  label: `Less Than or Equal to`,
                                                  value: `Less Than or Equal to`,
                                                },
                                                {
                                                  label: `Greater Than`,
                                                  value: `Greater Than`,
                                                },
                                                {
                                                  label: `Greater Than or Equal to`,
                                                  value: `Greater Than or Equal to`,
                                                },
                                                {
                                                  label: `Equal to`,
                                                  value: `Equal to`,
                                                },
                                                {
                                                  label: `Between`,
                                                  value: `Between`,
                                                },
                                              ]}
                                              styles={colourStyles}
                                              value={{
                                                label: item.validation,
                                                value: item.validation,
                                              }}
                                              onChange={(e) =>
                                                handleTodoEdit(
                                                  index,
                                                  "validation",
                                                  e.value
                                                )
                                              }
                                            />
                                          </FormControl>
                                          &emsp;
                                          {item.validation === "Between" && (
                                            <>
                                              <FormControl fullWidth size="small">
                                                <Typography>
                                                  {" "}
                                                  From{" "}
                                                  <b style={{ color: "red" }}>
                                                    *
                                                  </b>
                                                </Typography>
                                                <OutlinedInput
                                                  id="component-outlined"
                                                  type="text"
                                                  value={item.betweenfrom}
                                                  onChange={(e) =>
                                                    handleTodoEdit(
                                                      index,
                                                      "betweenfrom",
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              </FormControl>
                                              &emsp;
                                              <FormControl fullWidth size="small">
                                                <Typography>
                                                  {" "}
                                                  To{" "}
                                                  <b style={{ color: "red" }}>
                                                    *
                                                  </b>
                                                </Typography>
                                                <OutlinedInput
                                                  id="component-outlined"
                                                  type="text"
                                                  value={item.betweento}
                                                  onChange={(e) =>
                                                    handleTodoEdit(
                                                      index,
                                                      "betweento",
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              </FormControl>
                                            </>
                                          )}
                                        </>
                                      )}
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
                                        onChange={(e) =>
                                          handleTodoEdit(index, "status", e.value)
                                        }
                                      />
                                    </FormControl>
                                    &emsp;

                                    <FormControl fullWidth size="small">
                                      <Typography>
                                        Description
                                        <b style={{ color: "red" }}>*</b>
                                      </Typography>

                                      <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={2.5}
                                        value={item.description}
                                        onChange={(e) =>
                                          handleTodoEdit(
                                            index,
                                            "description",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </FormControl>
                                  </Grid>
                                </li>
                              );
                            })}
                          </ul>
                        </Grid>
                      )}
                    </>
                  )}

                {/* {type === "TextBox" && (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Answers <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Give answers separated by ;"
                          value={answers}
                          onChange={(e) => {
                            setAnswers(e.target.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={2} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Status<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={[
                            { label: "Eligible", value: "Eligible" },
                            { label: "Not-Eligible", value: "Not-Eligible" },
                            { label: "Hold", value: "Hold" },
                            {
                              label: "Manual Decision",
                              value: "Manual Decision",
                            },
                          ]}
                          styles={colourStyles}
                          value={{ label: statusAns, value: statusAns }}
                          onChange={(e) => setStatusAns(e.value)}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                {type === "Text-Alpha" && (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Answers <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Answers Only in Alphabets"
                          value={answers}
                          onChange={(e) => {
                            const textOnly = e.target.value.replace(
                              /[^a-zA-Z\s;]/g,
                              ""
                            );
                            setAnswers(textOnly);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={2} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Status<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={[
                            { label: "Eligible", value: "Eligible" },
                            { label: "Not-Eligible", value: "Not-Eligible" },
                            { label: "Hold", value: "Hold" },
                            {
                              label: "Manual Decision",
                              value: "Manual Decision",
                            },
                          ]}
                          styles={colourStyles}
                          value={{ label: statusAns, value: statusAns }}
                          onChange={(e) => setStatusAns(e.value)}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                {type === "Text-Numeric" && (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Answers <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Answers Only in Numbers"
                          value={answers}
                          onChange={(e) => {
                            const numericOnly = e.target.value.replace(
                              /[^0-9.;\s]/g,
                              ""
                            );
                            setAnswers(numericOnly);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={2} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Status<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={[
                            { label: "Eligible", value: "Eligible" },
                            { label: "Not-Eligible", value: "Not-Eligible" },
                            { label: "Hold", value: "Hold" },
                            {
                              label: "Manual Decision",
                              value: "Manual Decision",
                            },
                          ]}
                          styles={colourStyles}
                          value={{ label: statusAns, value: statusAns }}
                          onChange={(e) => setStatusAns(e.value)}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )} */}
              </Grid>
              <br /> <br />
              <br /> <br />
              {!["Typing Test"].includes(type) && yesOrNo === "Yes" && (
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Do You Need Extra Question</Typography>
                      <Selects
                        options={interviewQuestion
                          ?.filter((item) => item?.name === question)
                          ?.map((item) => {
                            return item?.subquestions
                              ?.map((item) => ({
                                label: item?.subquestionnumber,
                                value: item?.subquestionnumber,
                              }))
                              .filter(
                                (value, index, self) =>
                                  self.findIndex(
                                    (v) => v.value === value.value
                                  ) === index
                              );
                          })
                          .flat()}
                        styles={colourStyles}
                        value={{
                          label: extraQuestions,
                          value: extraQuestions,
                        }}
                        onChange={(e) => {
                          setExtraQuestions(e.value);
                          setExtraOptions("Please Select Answers");
                          setExtraQuestAdd("Please Select Extra Questions");
                          setExtraType("");
                          setOptionstodoExtra([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={2} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {extraQuestions === "Sub Question"
                          ? "Primary Answers"
                          : extraQuestions === "Sub Question 1"
                            ? "Sub Question Answers"
                            : extraQuestions === "Please Select Type Questions"
                              ? "Answers"
                              : extraQuestions.replace(
                                /\d+/,
                                (match) => match - 1
                              ) + " Answers"}
                      </Typography>
                      <Selects
                        options={
                          extraQuestions == "Sub Question" &&
                            !["Date", "Date Range"].includes(type)
                            ? optionstodo.map((data) => ({
                              label: data.options,
                              value: data.options,
                              question: question,
                            }))
                            : extraQuestions == "Sub Question" &&
                              type === "Date" &&
                              questionDatas?.date !== ""
                              ? [
                                {
                                  label: moment(questionDatas?.date).format(
                                    "DD-MM-YYYY"
                                  ),
                                  value: moment(questionDatas?.date).format(
                                    "DD-MM-YYYY"
                                  ),
                                },
                              ]
                              : extraQuestions == "Sub Question" &&
                                type === "Date" &&
                                questionDatas?.date === ""
                                ? [
                                  {
                                    label: "NODATE",
                                    value: "NODATE",
                                    question: question,
                                  },
                                ]
                                : extraQuestions == "Sub Question" &&
                                  type === "Date Range"
                                  ? [
                                    {
                                      label: `${moment(
                                        questionDatas?.fromdate
                                      ).format("DD-MM-YYYY")} - ${moment(
                                        questionDatas?.todate
                                      ).format("DD-MM-YYYY")}`,
                                      value: `${moment(
                                        questionDatas?.fromdate
                                      ).format("DD-MM-YYYY")} - ${moment(
                                        questionDatas?.todate
                                      ).format("DD-MM-YYYY")}`,
                                      question: question,
                                    },
                                  ]
                                  : extraQuestions === "Sub Question 1"
                                    ? addReqTodo?.flatMap((item) => {
                                      if (
                                        item?.extraquestion === "Sub Question" &&
                                        item?.type === "Date Range"
                                      ) {
                                        return [
                                          {
                                            label: `${moment(
                                              item.optionslist[0]?.answer
                                            ).format("DD-MM-YYYY")} - ${moment(
                                              item.optionslist[1].answer
                                            ).format("DD-MM-YYYY")}`,
                                            value: `${moment(
                                              item.optionslist[0]?.answer
                                            ).format("DD-MM-YYYY")} - ${moment(
                                              item.optionslist[1]?.answer
                                            ).format("DD-MM-YYYY")}`,
                                            question: item.question,
                                          },
                                        ];
                                      }

                                      if (
                                        item?.extraquestion === "Sub Question" &&
                                        item?.type === "Date"
                                      ) {
                                        return [
                                          {
                                            label:
                                              item.optionslist[0]?.answer === ""
                                                ? "NODATE"
                                                : `${moment(
                                                  item.optionslist[0]?.answer
                                                ).format("DD-MM-YYYY")}`,
                                            value:
                                              item.optionslist[0]?.answer === ""
                                                ? "NODATE"
                                                : `${moment(
                                                  item.optionslist[0]?.answer
                                                ).format("DD-MM-YYYY")}`,
                                            question: item.question,
                                          },
                                        ];
                                      }

                                      if (
                                        item?.extraquestion === "Sub Question" &&
                                        item?.type !== "Date" &&
                                        item?.type !== "Date Range"
                                      ) {
                                        return item?.optionslist.map((data) => ({
                                          label: data.answer,
                                          value: data.answer,
                                          question: item.question,
                                        }));
                                      }
                                      return [];
                                    })
                                    : addReqTodo?.flatMap((item) => {
                                      if (
                                        item.extraquestion ===
                                        extraQuestions?.replace(
                                          /\d+/,
                                          (match) => match - 1
                                        ) &&
                                        item?.type === "Date Range"
                                      ) {
                                        return [
                                          {
                                            label: `${moment(
                                              item.optionslist[0]?.answer
                                            ).format("DD-MM-YYYY")} - ${moment(
                                              item.optionslist[1]?.answer
                                            ).format("DD-MM-YYYY")}`,
                                            value: `${moment(
                                              item.optionslist[0]?.answer
                                            ).format("DD-MM-YYYY")} - ${moment(
                                              item.optionslist[1]?.answer
                                            ).format("DD-MM-YYYY")}`,
                                            question: item.question,
                                          },
                                        ];
                                      }

                                      if (
                                        item.extraquestion ===
                                        extraQuestions.replace(
                                          /\d+/,
                                          (match) => match - 1
                                        ) &&
                                        item?.type === "Date"
                                      ) {
                                        return [
                                          {
                                            label:
                                              item.optionslist[0].answer === ""
                                                ? "NODATE"
                                                : `${moment(
                                                  item.optionslist[0].answer
                                                ).format("DD-MM-YYYY")}`,
                                            value:
                                              item.optionslist[0].answer === ""
                                                ? "NODATE"
                                                : `${moment(
                                                  item.optionslist[0].answer
                                                ).format("DD-MM-YYYY")}`,
                                            question: item.question,
                                          },
                                        ];
                                      }

                                      if (
                                        item.extraquestion ===
                                        extraQuestions.replace(
                                          /\d+/,
                                          (match) => match - 1
                                        ) &&
                                        item?.type !== "Date" &&
                                        item?.type !== "Date Range"
                                      ) {
                                        return item?.optionslist.map((data) => ({
                                          label: data.answer,
                                          value: data.answer,
                                          question: item.question,
                                        }));
                                      }

                                      // Ensure that the callback always returns an array
                                      return [];
                                    })
                        }
                        styles={colourStyles}
                        value={{ label: extraOptions, value: extraOptions }}
                        onChange={(e) => {
                          setExtraOptions(e.value);
                          setInterviewViewQuestions(e?.question);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {`${extraQuestions === "Sub Question 1"
                          ? "Sub Question 1"
                          : extraQuestions === "Sub Question 2"
                            ? "Sub Question 2"
                            : extraQuestions === "Please Select Type Questions"
                              ? "Questions"
                              : extraQuestions
                          }`}
                      </Typography>
                      <Selects
                        options={interviewQuestion
                          ?.filter(
                            (item) =>
                              item?.name === question &&
                              item?.subquestions?.some(
                                (subquestion) =>
                                  subquestion?.subquestionnumber ===
                                  extraQuestions
                              )
                          )
                          ?.flatMap((item) =>
                            item?.subquestions
                              ?.filter(
                                (subquestion) =>
                                  subquestion?.subquestionnumber ===
                                  extraQuestions
                              )
                              ?.map((subquestion) => ({
                                label: subquestion?.question,
                                value: subquestion?.question,
                              }))
                              .filter(
                                (subquestion) =>
                                  !addReqTodo?.some(
                                    (req) =>
                                      req.question === subquestion.label &&
                                      req?.extraquestion === extraQuestions
                                  )
                              )
                          )}
                        styles={colourStyles}
                        value={{ label: extraQuestAdd, value: extraQuestAdd }}
                        onChange={(e) => {
                          setExtraQuestAdd(e.value);
                          const extraType = interviewQuestionAns
                            ?.filter(
                              (item) =>
                                item?.question === question &&
                                item.category === catAndSub.category &&
                                item.subcategory === catAndSub.subcategory &&
                                item?.secondarytodo?.some(
                                  (subquestion) =>
                                    subquestion?.question === e.value
                                )
                            )
                            ?.flatMap((item) =>
                              item.secondarytodo
                                ?.filter(
                                  (subquestion) =>
                                    subquestion?.question === e.value
                                )
                                ?.map((subquestion) => subquestion?.type)
                            )
                            ?.join(", ");
                          setExtraType(extraType);

                          if (extraType === "Yes/No") {
                            setOptionstodoExtra([
                              {
                                answer: "Yes",
                                tamilanswer: "ஆம்",
                                status: "Please Select Status",
                                validation: "Please Select Validation",
                                description: "",
                                betweenfrom: "",
                                betweento: "",
                              },
                              {
                                answer: "No",
                                tamilanswer: "இல்லை",
                                status: "Please Select Status",
                                validation: "Please Select Validation",
                                description: "",
                                betweenfrom: "",
                                betweento: "",
                              },
                            ]);
                          } else if (extraType === "Correct/In Correct") {
                            setOptionstodoExtra([
                              {
                                answer: "Correct",
                                tamilanswer: "சரி",
                                status: "Please Select Status",
                                validation: "Please Select Validation",
                                description: "",
                                betweenfrom: "",
                                betweento: "",
                              },
                              {
                                answer: "In Correct",
                                tamilanswer: "தவறு",
                                status: "Please Select Status",
                                validation: "Please Select Validation",
                                description: "",
                                betweenfrom: "",
                                betweento: "",
                              },
                            ]);
                          } else {
                            const extraOptionList = interviewQuestionAns
                              ?.filter(
                                (item) =>
                                  item.question === question &&
                                  item.category === catAndSub.category &&
                                  item.subcategory === catAndSub.subcategory &&
                                  item.secondarytodo?.some(
                                    (subquestion) =>
                                      subquestion.question === e.value
                                  )
                              )
                              .flatMap((item) =>
                                item.secondarytodo
                                  ?.filter(
                                    (subquestion) =>
                                      subquestion.question === e.value
                                  )
                                  ?.map(
                                    (subquestion) => subquestion?.optionslist
                                  )
                              );
                            const extraTamilOptionList = interviewQuestionAns
                              ?.filter(
                                (item) =>
                                  item.question === question &&
                                  item.category === catAndSub.category &&
                                  item.subcategory === catAndSub.subcategory &&
                                  item.secondarytodo?.some(
                                    (subquestion) => subquestion.question === e.value
                                  )
                              )
                              .flatMap((item) =>
                                item.secondarytodo
                                  ?.filter((subquestion) => subquestion.question === e.value)
                                  ?.map((subquestion) => subquestion?.tamiloptionslist || [])
                              );
                            const answers = extraOptionList?.flat() || [];
                            const tamilanswers = extraTamilOptionList?.flat() || [];
                            setOptionstodoExtra(
                              answers?.map((item, index) => ({
                                answer: item,
                                tamilanswer: tamilanswers[index] || "",
                                status: "Please Select Status",
                                validation: "Please Select Validation",
                                description: "",
                                betweenfrom: "",
                                betweento: "",
                              }))
                            );
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {extraQuestions === "Sub Question"
                          ? "Primary Answers Type"
                          : extraQuestions === "Sub Question 1"
                            ? "Sub Question Answers Type"
                            : extraQuestions === "Please Select Type Questions"
                              ? "Answers Type"
                              : extraQuestions.replace(
                                /\d+/,
                                (match) => match - 1
                              ) + " Answers Type"}
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        placeholder="Please Enter SubCategory"
                        value={extratype}
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                  {extraOptions !== "Please Select Answers" &&
                    extraQuestAdd !== "Please Select Extra Questions" && (
                      <>
                        <br />
                        &emsp;
                        {optionstodoExtra?.length > 0 && (
                          <Grid item md={9} xs={12} sm={12}>
                            <ul type="none">
                              {optionstodoExtra?.map((item, index) => {
                                return (
                                  <li key={index}>
                                    <br />
                                    <Grid sx={{ display: "flex" }}>
                                      <FormControl fullWidth size="small">
                                        <Typography> Answers List </Typography>
                                        <OutlinedInput
                                          id="component-outlined"
                                          placeholder="Please Enter SubCategory"
                                          value={item.answer}
                                          readOnly
                                        />
                                      </FormControl>
                                      &emsp;
                                      {item.answer !== "NOANSWER" &&
                                        extratype === "Text-Numeric" && (
                                          <>
                                            <FormControl fullWidth size="small">
                                              <Typography>
                                                Validation
                                                <b style={{ color: "red" }}>
                                                  *
                                                </b>
                                              </Typography>
                                              <Selects
                                                options={[
                                                  {
                                                    label: `Less Than`,
                                                    value: `Less Than`,
                                                  },
                                                  {
                                                    label: `Less Than or Equal to`,
                                                    value: `Less Than or Equal to`,
                                                  },
                                                  {
                                                    label: `Greater Than`,
                                                    value: `Greater Than`,
                                                  },
                                                  {
                                                    label: `Greater Than or Equal to`,
                                                    value: `Greater Than or Equal to`,
                                                  },
                                                  {
                                                    label: `Equal to`,
                                                    value: `Equal to`,
                                                  },
                                                  {
                                                    label: `Between`,
                                                    value: `Between`,
                                                  },
                                                ]}
                                                styles={colourStyles}
                                                value={{
                                                  label: item.validation,
                                                  value: item.validation,
                                                }}
                                                onChange={(e) =>
                                                  handleTodoEditExtra(
                                                    index,
                                                    "validation",
                                                    e.value
                                                  )
                                                }
                                              />
                                            </FormControl>
                                            &emsp;
                                            {item.validation === "Between" && (
                                              <>
                                                <FormControl
                                                  fullWidth
                                                  size="small"
                                                >
                                                  <Typography>
                                                    {" "}
                                                    From{" "}
                                                    <b style={{ color: "red" }}>
                                                      *
                                                    </b>
                                                  </Typography>
                                                  <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={item.betweenfrom}
                                                    onChange={(e) =>
                                                      handleTodoEditExtra(
                                                        index,
                                                        "betweenfrom",
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                </FormControl>
                                                &emsp;
                                                <FormControl
                                                  fullWidth
                                                  size="small"
                                                >
                                                  <Typography>
                                                    {" "}
                                                    To{" "}
                                                    <b style={{ color: "red" }}>
                                                      *
                                                    </b>
                                                  </Typography>
                                                  <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={item.betweento}
                                                    onChange={(e) =>
                                                      handleTodoEditExtra(
                                                        index,
                                                        "betweento",
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                </FormControl>
                                              </>
                                            )}
                                          </>
                                        )}
                                      &emsp;
                                      <FormControl fullWidth size="small">
                                        <Typography>
                                          Status
                                          <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                          options={statusOption}
                                          styles={colourStyles}
                                          value={{
                                            label: item.status,
                                            value: item.status,
                                          }}
                                          onChange={(e) =>
                                            handleTodoEditExtra(
                                              index,
                                              "status",
                                              e.value
                                            )
                                          }
                                        />
                                      </FormControl>
                                      &emsp;
                                    </Grid>
                                  </li>
                                );
                              })}
                            </ul>
                          </Grid>
                        )}
                      </>
                    )}
                  <Grid item md={2} xs={12} sm={12}></Grid>
                  {optionstodoExtra.length > 0 && (
                    <Grid item md={1} xs={12} sm={12}>
                      <Button
                        variant="contained"
                        onClick={handleAddTodo}
                        sx={{
                          marginTop: "28px",
                          padding: "6px 10px",
                        }}
                      >
                        {" "}
                        Add{" "}
                      </Button>
                    </Grid>
                  )}
                </Grid>
              )}
              <br /> <br />
              {addReqTodo?.length > 0 && (
                <ul type="none">
                  {addReqTodo?.map((row, index) => {
                    return (
                      <li key={index}>
                        <Grid container spacing={2}>
                          {isTodoEdit[index] ? (
                            // index == 0
                            <>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography>
                                    {`Extra Question - (${row?.prequestionview})`}
                                  </Typography>

                                  <OutlinedInput
                                    id="component-outlined"
                                    placeholder="Please Enter SubCategory"
                                    value={row?.extraquestion}
                                    readOnly
                                  />
                                </FormControl>
                              </Grid>

                              <Grid item md={2} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography>
                                    {row?.extraquestion === "Sub Question"
                                      ? "Primary Answers"
                                      : row?.extraquestion === "Sub Question 1"
                                        ? "Sub Question Answers"
                                        : row?.extraquestion ===
                                          "Please Select Type Questions"
                                          ? "Answers"
                                          : row?.extraquestion.replace(
                                            /\d+/,
                                            (match) => match - 1
                                          ) + " Answers"}
                                  </Typography>
                                  <Selects
                                    options={
                                      row?.extraquestion == "Sub Question" &&
                                        !["Date", "Date Range"].includes(type)
                                        ? optionstodo.map((data) => ({
                                          label: data.options,
                                          value: data.options,
                                          question: question,
                                        }))
                                        : row?.extraquestion ==
                                          "Sub Question" &&
                                          type === "Date" &&
                                          questionDatas?.date !== ""
                                          ? [
                                            {
                                              label: moment(
                                                questionDatas?.date
                                              ).format("DD-MM-YYYY"),
                                              value: moment(
                                                questionDatas?.date
                                              ).format("DD-MM-YYYY"),
                                              question: question,
                                            },
                                          ]
                                          : row?.extraquestion ==
                                            "Sub Question" &&
                                            type === "Date" &&
                                            questionDatas?.date === ""
                                            ? [
                                              {
                                                label: "NODATE",
                                                value: "NODATE",
                                                question: question,
                                              },
                                            ]
                                            : row?.extraquestion ==
                                              "Sub Question" &&
                                              type === "Date Range"
                                              ? [
                                                {
                                                  label: `${moment(
                                                    questionDatas?.fromdate
                                                  ).format(
                                                    "DD-MM-YYYY"
                                                  )} - ${moment(
                                                    questionDatas?.todate
                                                  ).format("DD-MM-YYYY")}`,
                                                  value: `${moment(
                                                    questionDatas?.fromdate
                                                  ).format(
                                                    "DD-MM-YYYY"
                                                  )} - ${moment(
                                                    questionDatas?.todate
                                                  ).format("DD-MM-YYYY")}`,
                                                  question: question,
                                                },
                                              ]
                                              : row?.extraquestion ===
                                                "Sub Question 1"
                                                ? addReqTodo?.flatMap((item) => {
                                                  if (
                                                    item.extraquestion ===
                                                    "Sub Question" &&
                                                    item?.type === "Date Range"
                                                  ) {
                                                    return [
                                                      {
                                                        label: `${moment(
                                                          item.optionslist[0].answer
                                                        ).format(
                                                          "DD-MM-YYYY"
                                                        )} - ${moment(
                                                          item.optionslist[1].answer
                                                        ).format("DD-MM-YYYY")}`,
                                                        value: `${moment(
                                                          item.optionslist[0].answer
                                                        ).format(
                                                          "DD-MM-YYYY"
                                                        )} - ${moment(
                                                          item.optionslist[1].answer
                                                        ).format("DD-MM-YYYY")}`,
                                                        question: item.question,
                                                      },
                                                    ];
                                                  }

                                                  if (
                                                    item.extraquestion ===
                                                    "Sub Question" &&
                                                    item?.type === "Date"
                                                  ) {
                                                    return [
                                                      {
                                                        label:
                                                          item.optionslist[0]
                                                            .answer === ""
                                                            ? "NODATE"
                                                            : `${moment(
                                                              item.optionslist[0]
                                                                .answer
                                                            ).format(
                                                              "DD-MM-YYYY"
                                                            )}`,
                                                        value:
                                                          item.optionslist[0]
                                                            .answer === ""
                                                            ? "NODATE"
                                                            : `${moment(
                                                              item.optionslist[0]
                                                                .answer
                                                            ).format(
                                                              "DD-MM-YYYY"
                                                            )}`,
                                                        question: item.question,
                                                      },
                                                    ];
                                                  }

                                                  if (
                                                    item.extraquestion ===
                                                    "Sub Question" &&
                                                    item?.type !== "Date" &&
                                                    item?.type !== "Date Range"
                                                  ) {
                                                    return item?.optionslist.map(
                                                      (data) => ({
                                                        label: data.answer,
                                                        value: data.answer,
                                                        question: item.question,
                                                      })
                                                    );
                                                  }

                                                  return [];
                                                })
                                                : addReqTodo?.flatMap((item) => {
                                                  if (
                                                    item.extraquestion ===
                                                    row?.extraquestion?.replace(
                                                      /\d+/,
                                                      (match) => match - 1
                                                    ) &&
                                                    item?.type === "Date Range"
                                                  ) {
                                                    return [
                                                      {
                                                        label: `${moment(
                                                          item.optionslist[0]?.answer
                                                        ).format(
                                                          "DD-MM-YYYY"
                                                        )} - ${moment(
                                                          item.optionslist[1]?.answer
                                                        ).format("DD-MM-YYYY")}`,
                                                        value: `${moment(
                                                          item.optionslist[0]?.answer
                                                        ).format(
                                                          "DD-MM-YYYY"
                                                        )} - ${moment(
                                                          item.optionslist[1]?.answer
                                                        ).format("DD-MM-YYYY")}`,
                                                        question: item.question,
                                                      },
                                                    ];
                                                  }

                                                  if (
                                                    item.extraquestion ===
                                                    row?.extraquestion.replace(
                                                      /\d+/,
                                                      (match) => match - 1
                                                    ) &&
                                                    item?.type === "Date"
                                                  ) {
                                                    return [
                                                      {
                                                        label:
                                                          item.optionslist[0]
                                                            .answer === ""
                                                            ? "NODATE"
                                                            : `${moment(
                                                              item.optionslist[0]
                                                                .answer
                                                            ).format(
                                                              "DD-MM-YYYY"
                                                            )}`,
                                                        value:
                                                          item.optionslist[0]
                                                            .answer === ""
                                                            ? "NODATE"
                                                            : `${moment(
                                                              item.optionslist[0]
                                                                .answer
                                                            ).format(
                                                              "DD-MM-YYYY"
                                                            )}`,
                                                        question: item.question,
                                                      },
                                                    ];
                                                  }

                                                  if (
                                                    item.extraquestion ===
                                                    row?.extraquestion.replace(
                                                      /\d+/,
                                                      (match) => match - 1
                                                    ) &&
                                                    item?.type !== "Date" &&
                                                    item?.type !== "Date Range"
                                                  ) {
                                                    return item?.optionslist.map(
                                                      (data) => ({
                                                        label: data.answer,
                                                        value: data.answer,
                                                        question: item.question,
                                                      })
                                                    );
                                                  }

                                                  // Ensure that the callback always returns an array
                                                  return [];
                                                })
                                    }
                                    styles={colourStyles}
                                    value={{
                                      label: row?.options,
                                      value: row?.options,
                                    }}
                                    onChange={(e) => {
                                      handleTodoEditOverallExtra(
                                        index,
                                        "options",
                                        e.value
                                      );
                                    }}
                                  />
                                  {/* "ans edit" */}
                                </FormControl>
                              </Grid>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography>
                                    {`${row.extraquestion === "Sub Question 1"
                                      ? "Sub Question 1"
                                      : row.extraquestion === "Sub Question 2"
                                        ? "Sub Question 2"
                                        : row.extraquestion ===
                                          "Please Select Type Questions"
                                          ? "Questions"
                                          : row.extraquestion
                                      }`}
                                  </Typography>

                                  <OutlinedInput
                                    id="component-outlined"
                                    placeholder="Please Enter SubCategory"
                                    value={row?.question}
                                    readOnly
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography>
                                    {`${row?.extraquestion} type`}
                                  </Typography>

                                  <OutlinedInput
                                    id="component-outlined"
                                    placeholder="Please Enter SubCategory"
                                    value={row.type}
                                    readOnly
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={9} xs={12} sm={12}>
                                {row?.optionslist?.length > 0 && (
                                  <ul type="none">
                                    {row?.optionslist?.map((item, ind) => {
                                      return (
                                        <li key={ind}>
                                          <br />
                                          <Grid sx={{ display: "flex" }}>
                                            <FormControl fullWidth size="small">
                                              <Typography>
                                                {" "}
                                                Answers List{" "}
                                              </Typography>
                                              <OutlinedInput
                                                id="component-outlined"
                                                placeholder="Please Enter SubCategory"
                                                value={item.answer}
                                                readOnly
                                              />
                                            </FormControl>
                                            &emsp;
                                            {item.answer !== "NOANSWER" &&
                                              row.type === "Text-Numeric" && (
                                                <>
                                                  <FormControl
                                                    fullWidth
                                                    size="small"
                                                  >
                                                    <Typography>
                                                      Validation
                                                      <b
                                                        style={{ color: "red" }}
                                                      >
                                                        *
                                                      </b>
                                                    </Typography>
                                                    <Selects
                                                      options={[
                                                        {
                                                          label: `Less Than`,
                                                          value: `Less Than`,
                                                        },
                                                        {
                                                          label: `Less Than or Equal to`,
                                                          value: `Less Than or Equal to`,
                                                        },
                                                        {
                                                          label: `Greater Than`,
                                                          value: `Greater Than`,
                                                        },
                                                        {
                                                          label: `Greater Than or Equal to`,
                                                          value: `Greater Than or Equal to`,
                                                        },
                                                        {
                                                          label: `Equal to`,
                                                          value: `Equal to`,
                                                        },
                                                        {
                                                          label: `Between`,
                                                          value: `Between`,
                                                        },
                                                      ]}
                                                      styles={colourStyles}
                                                      value={{
                                                        label:
                                                          backUpCreate[ind]
                                                            .validation,
                                                        value:
                                                          backUpCreate[ind]
                                                            .validation,
                                                      }}
                                                      onChange={(e) =>
                                                        handleTodoEditOverallExtraOptions(
                                                          index,
                                                          "validation",
                                                          ind,
                                                          e.value
                                                        )
                                                      }
                                                    />
                                                  </FormControl>
                                                  &emsp;
                                                  {backUpCreate[ind]
                                                    .validation ===
                                                    "Between" && (
                                                      <>
                                                        <FormControl
                                                          fullWidth
                                                          size="small"
                                                        >
                                                          <Typography>
                                                            {" "}
                                                            From{" "}
                                                            <b
                                                              style={{
                                                                color: "red",
                                                              }}
                                                            >
                                                              *
                                                            </b>
                                                          </Typography>
                                                          <OutlinedInput
                                                            id="component-outlined"
                                                            type="text"
                                                            value={
                                                              backUpCreate[ind]
                                                                .betweenfrom
                                                            }
                                                            onChange={(e) =>
                                                              handleTodoEditOverallExtraOptions(
                                                                index,
                                                                "betweenfrom",
                                                                ind,
                                                                e.target.value
                                                              )
                                                            }
                                                          />
                                                        </FormControl>
                                                        &emsp;
                                                        <FormControl
                                                          fullWidth
                                                          size="small"
                                                        >
                                                          <Typography>
                                                            {" "}
                                                            To{" "}
                                                            <b
                                                              style={{
                                                                color: "red",
                                                              }}
                                                            >
                                                              *
                                                            </b>
                                                          </Typography>
                                                          <OutlinedInput
                                                            id="component-outlined"
                                                            type="text"
                                                            value={
                                                              backUpCreate[ind]
                                                                .betweento
                                                            }
                                                            onChange={(e) =>
                                                              handleTodoEditOverallExtraOptions(
                                                                index,
                                                                "betweento",
                                                                ind,
                                                                e.target.value
                                                              )
                                                            }
                                                          />
                                                        </FormControl>
                                                      </>
                                                    )}
                                                </>
                                              )}
                                            &emsp;
                                            <FormControl fullWidth size="small">
                                              <Typography>
                                                Status
                                                <b style={{ color: "red" }}>
                                                  *
                                                </b>
                                              </Typography>
                                              <Selects
                                                options={statusOption}
                                                styles={colourStyles}
                                                value={{
                                                  label:
                                                    backUpCreate[ind].status,
                                                  value:
                                                    backUpCreate[ind].status,
                                                }}
                                                onChange={(e) =>
                                                  handleTodoEditOverallExtraOptions(
                                                    index,
                                                    "status",
                                                    ind,
                                                    e.value
                                                  )
                                                }
                                              />
                                            </FormControl>
                                            &emsp;
                                          </Grid>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                )}
                                <br />
                                <br />
                                <br />
                                <br />
                              </Grid>
                            </>
                          ) : (
                            <>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography>
                                    {`Extra Question - (${row.prequestionview} - ${row.options})`}
                                  </Typography>
                                  <OutlinedInput
                                    readOnly
                                    value={row.extraquestion}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography>Answers</Typography>
                                  <OutlinedInput readOnly value={row.options} />
                                  {/* "extra answers view" */}
                                </FormControl>
                              </Grid>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography>Question</Typography>
                                  <OutlinedInput
                                    readOnly
                                    value={row.question}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography>Type</Typography>
                                  <OutlinedInput readOnly value={row.type} />
                                </FormControl>
                              </Grid>
                              {row?.optionslist?.length > 0 && (
                                <Grid item md={9} xs={12} sm={12}>
                                  <ul type="none">
                                    {row?.optionslist?.map((item, ind) => {
                                      return (
                                        <li key={ind}>
                                          <br />
                                          <Grid sx={{ display: "flex" }}>
                                            <FormControl fullWidth size="small">
                                              <Typography>
                                                {" "}
                                                Answers List{" "}
                                              </Typography>
                                              <OutlinedInput
                                                id="component-outlined"
                                                placeholder="Please Enter SubCategory"
                                                value={item.answer}
                                                readOnly
                                              />
                                            </FormControl>
                                            &emsp;
                                            {row.type === "Text-Numeric" &&
                                              item.answer !== "NOANSWER" && (
                                                <>
                                                  <FormControl
                                                    fullWidth
                                                    size="small"
                                                  >
                                                    <Typography>
                                                      {" "}
                                                      Validation{" "}
                                                    </Typography>
                                                    <OutlinedInput
                                                      id="component-outlined"
                                                      placeholder="status"
                                                      value={item.validation}
                                                      readOnly
                                                    />
                                                  </FormControl>
                                                  &emsp;
                                                  {item.validation ===
                                                    "Between" && (
                                                      <FormControl
                                                        fullWidth
                                                        size="small"
                                                      >
                                                        <Typography>
                                                          {" "}
                                                          Between{" "}
                                                        </Typography>
                                                        <OutlinedInput
                                                          id="component-outlined"
                                                          placeholder="status"
                                                          value={`${item.betweenfrom} to ${item.betweento}`}
                                                          readOnly
                                                        />
                                                      </FormControl>
                                                    )}
                                                </>
                                              )}
                                            &emsp;
                                            <FormControl fullWidth size="small">
                                              <Typography> Status </Typography>
                                              <OutlinedInput
                                                id="component-outlined"
                                                placeholder="status"
                                                value={item.status}
                                                readOnly
                                              />
                                            </FormControl>
                                            &emsp; &emsp;
                                          </Grid>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                  <br />
                                  <br />
                                  <br />
                                  <br />
                                </Grid>
                              )}
                            </>
                          )}

                          <Grid item md={1} xs={12} sm={12}>
                            {isTodoEdit[index] ? (
                              <Button
                                variant="contained"
                                color="success"
                                sx={{
                                  height: "30px",
                                  minWidth: "30px",
                                  marginTop: "47px",
                                  padding: "6px 10px",
                                }}
                                onClick={() => {
                                  if (
                                    addReqTodo?.some(
                                      (data, inde) =>
                                        data?.question === row.question &&
                                        index !== inde
                                    )
                                  ) {
                                    setPopupContentMalert(
                                      "Already Question Added!"
                                    );
                                    setPopupSeverityMalert("info");
                                    handleClickOpenPopupMalert();
                                  } else if (
                                    addReqTodo?.some(
                                      (data, inde) =>
                                        data?.extraquestion ===
                                        row.extraquestion &&
                                        index !== inde &&
                                        data?.options === row.options &&
                                        data?.question === row.question
                                    )
                                  ) {
                                    setPopupContentMalert(
                                      "Already These Question Type Added!"
                                    );
                                    setPopupSeverityMalert("info");
                                    handleClickOpenPopupMalert();
                                  } else if (
                                    row.type === "Text-Numeric" &&
                                    backUpCreate?.some(
                                      (item) =>
                                        item.validation === "Between" &&
                                        (item.betweenfrom === "" ||
                                          item.betweento === "")
                                    )
                                  ) {
                                    setPopupContentMalert(
                                      "Please Enter Both From and To Values!"
                                    );
                                    setPopupSeverityMalert("info");
                                    handleClickOpenPopupMalert();
                                  } else if (
                                    row.type === "Text-Numeric" &&
                                    backUpCreate?.some((item) => {
                                      return (
                                        item.validation === "Between" &&
                                        item.answer !== "NOANSWER" &&
                                        item.betweenfrom !== "" &&
                                        Number(item.answer) !==
                                        Number(item.betweenfrom) &&
                                        item.betweento !== "" &&
                                        Number(item.answer) !==
                                        Number(item.betweento)
                                      );
                                    })
                                  ) {
                                    setPopupContentMalert(
                                      "Please Enter Valid Between Values!"
                                    );
                                    setPopupSeverityMalert("info");
                                    handleClickOpenPopupMalert();
                                  } else if (
                                    backUpCreate?.some((item) => {
                                      return (
                                        item.validation === "Between" &&
                                        item.answer !== "NOANSWER" &&
                                        item.betweenfrom !== "" &&
                                        item.betweento !== "" &&
                                        Number(item.betweenfrom) ===
                                        Number(item.betweento)
                                      );
                                    })
                                  ) {
                                    setPopupContentMalert(
                                      "Both From Value and To value can not be same!"
                                    );
                                    setPopupSeverityMalert("info");
                                    handleClickOpenPopupMalert();
                                  } else {
                                    const updatedIsTodoEdit = [...isTodoEdit];
                                    updatedIsTodoEdit[index] = false;
                                    setIsTodoEdit(updatedIsTodoEdit);
                                    setTodoSubmit(false);

                                    const updateOldvalue = [...addReqTodo];
                                    updateOldvalue[index].optionslist =
                                      backUpCreate;
                                    setAddReqTodo(updateOldvalue);
                                  }
                                }}
                              >
                                <MdOutlineDone
                                  style={{
                                    fontSize: "17px",
                                    fontWeight: "bold",
                                  }}
                                />
                                {/* tick1 */}
                              </Button>
                            ) : (
                              <>
                                {isTodoEdit?.some((item) => item === true) ? (
                                  <></>
                                ) : (
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                      height: "30px",
                                      minWidth: "30px",
                                      marginTop: "28px",
                                      padding: "6px 10px",
                                    }}
                                    onClick={() => {
                                      const updatedIsTodoEdit = [...isTodoEdit];
                                      updatedIsTodoEdit[index] = true;
                                      setIsTodoEdit(updatedIsTodoEdit);
                                      setTodoSubmit(true);
                                      // Deep copy of addReqTodo[index].optionslist
                                      const deepCopyOptionsList = JSON.parse(
                                        JSON.stringify(
                                          addReqTodo[index].optionslist
                                        )
                                      );
                                      setBackUpCreate(deepCopyOptionsList);
                                    }}
                                  >
                                    <FaEdit />
                                    {/* edit1 */}
                                  </Button>
                                )}
                              </>
                            )}
                          </Grid>
                          <Grid item md={1} xs={12} sm={12}>
                            {isTodoEdit[index] ? (
                              <Button
                                variant="contained"
                                color="error"
                                type="button"
                                sx={{
                                  height: "30px",
                                  minWidth: "30px",
                                  marginTop: "47px",
                                  padding: "6px 10px",
                                }}
                                onClick={() => {
                                  const updatedIsTodoEdit = [...isTodoEdit];
                                  updatedIsTodoEdit[index] = false;
                                  setIsTodoEdit(updatedIsTodoEdit);
                                  setTodoSubmit(false);
                                }}
                              >
                                <AiOutlineClose />
                              </Button>
                            ) : (
                              <>
                                {index == addReqTodo?.length - 1 && (
                                  <Button
                                    variant="contained"
                                    color="error"
                                    type="button"
                                    sx={{
                                      height: "30px",
                                      minWidth: "30px",
                                      marginTop: "28px",
                                      padding: "6px 10px",
                                    }}
                                    onClick={() => {
                                      deleteTodoEditExtra(index);
                                    }}
                                  >
                                    <AiOutlineClose />
                                  </Button>
                                )}
                              </>
                            )}
                          </Grid>
                          <Grid item md={2}></Grid>
                        </Grid>
                      </li>
                    );
                  })}
                </ul>
              )}
              <br />
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={6}>

                  <LoadingButton
                    sx={buttonStyles.buttonsubmit}
                    variant="contained"
                    loading={btnSubmit}
                    style={{ minWidth: "0px" }}
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
          <Box sx={{ padding: "20px", }}>
            <>
              <form onSubmit={editSubmit}>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Interview Status Allot
                      &nbsp;&nbsp;
                      {answerallotdetails && statusallotid &&
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => {
                            let questionvalue = interview?.find(
                              (item) =>
                                item.category === roundmasterEdit.category &&
                                item.subcategory === roundmasterEdit.subcategory &&
                                item.mode === modeEdit &&
                                item.question === roundmasterEdit.question
                            )
                            setRoundmasterEdit({
                              ...roundmasterEdit,
                              question: questionvalue.value,
                              type: questionvalue.type,
                              speedvalidation: "Please Select Validation",
                              speedstatus: "Please Select Status",
                              speedfrom: "",
                              speedto: "",
                              speeddescription: "",

                              accuracyvalidation: "Please Select Validation",
                              accuracystatus: "Please Select Status",
                              accuracyfrom: "",
                              accuracyto: "",
                              accuracydescription: "",

                              mistakesvalidation: "Please Select Validation",
                              mistakesstatus: "Please Select Status",
                              mistakesfrom: "",
                              mistakesto: "",
                              mistakesdescription: "",
                            });
                            setAddReqTodoEdit([]);
                            setQuestionDatasEdit({
                              yesorno: questionvalue.yesorno,
                              type: questionvalue.type,
                              subquestionlength: questionvalue.subquestionlength,
                              options: questionvalue.optionArr,
                              date: questionvalue.date,
                              fromdate: questionvalue.fromdate,
                              todate: questionvalue.todate,
                              typingspeed: questionvalue?.typingspeed,
                              typingaccuracy: questionvalue?.typingaccuracy,
                              typingmistakes: questionvalue?.typingmistakes,
                              typingduration: questionvalue?.typingduration,
                              secondarytodo: questionvalue.secondarytodo,
                            });
                            if (questionvalue.type === "Yes/No") {
                              setOptionstodoEdit([
                                {
                                  options: "Yes",
                                  tamiloptions: "ஆம்",
                                  status: "Please Select Status",
                                  validation: "Please Select Validation",
                                  description: "",
                                  betweenfrom: "",
                                  betweento: "",
                                },
                                {
                                  options: "No",
                                  tamiloptions: "இல்லை",
                                  status: "Please Select Status",
                                  validation: "Please Select Validation",
                                  description: "",
                                  betweenfrom: "",
                                  betweento: "",
                                },
                              ]);
                            } else if (questionvalue.type === "Correct/In Correct") {
                              setOptionstodoEdit([
                                {
                                  options: "Correct",
                                  tamiloptions: "சரி",
                                  status: "Please Select Status",
                                  validation: "Please Select Validation",
                                  description: "",
                                  betweenfrom: "",
                                  betweento: "",
                                },
                                {
                                  options: "In Correct",
                                  tamiloptions: "தவறு",
                                  status: "Please Select Status",
                                  validation: "Please Select Validation",
                                  description: "",
                                  betweenfrom: "",
                                  betweento: "",
                                },
                              ]);
                            } else {
                              setOptionstodoEdit(
                                questionvalue.optionArr?.map((item) => ({
                                  options: item.options,
                                  tamiloptions: item?.tamiloptions || "",
                                  status: "Please Select Status",
                                  validation: "Please Select Validation",
                                  description: "",
                                  betweenfrom: "",
                                  betweento: "",
                                }))
                              );
                            }



                            setDescriptionEdit("");
                            setStatusEdit("Please Select Status");

                            setExtraQuestionsEdit("Please Select Sub Question");

                            setTodoSubmitEdit(false);
                          }}
                        >
                          Update Answer Allot
                        </Button>}
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
                      {editable ? <>

                        {selectedCompanyOptionsCateEdit.length !== 0
                          ? selectedCompanyOptionsCateEdit.map((data, index) => (
                            <Typography>
                              {index + 1}.{data.value}
                            </Typography>
                          ))
                          : ""}
                      </> :

                        <MultiSelect
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
                          value={selectedCompanyOptionsCateEdit}
                          onChange={(e) => {
                            handleCompanyChangeEdit(e);



                            setModeEdit("Questions");
                            getCategoryEdit("Questions");
                            setRoundmasterEdit({
                              ...roundmasterEdit,
                              category: "Please Select Category",
                              subcategory: "Please Select Sub Category",
                              question: "Please Select Question",
                              type: "Please Select Type",
                            });
                            setQuestionDatasEdit({
                              yesorno: "",
                              type: "",
                              subquestionlength: "",
                              options: "",
                              date: "",
                              fromdate: "",
                              todate: "",
                              typingspeed: "",
                              typingaccuracy: "",
                              typingmistakes: "",
                              typingduration: "",
                              secondarytodo: [],
                            });
                            setDescriptionEdit("");
                            setStatusEdit("Please Select Status");
                            setOptionstodoEdit([]);
                            setExtraQuestionsEdit("Please Select Sub Question");
                            setAddReqTodoEdit([]);
                            setTodoSubmitEdit(false);
                          }}
                          valueRenderer={customValueRendererCompanyEdit}
                          labelledBy="Please Select Designation"
                        />
                      }
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Mode <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={modeOptions}
                        styles={colourStyles}
                        value={{
                          label: modeEdit || "Please Select Mode",
                          value: modeEdit || "Please Select Mode",
                        }}
                        isDisabled={(answerallotdetails && statusallotid) || editable}
                        onChange={(e) => {
                          setModeEdit(e.value);
                          getCategoryEdit(e.value);
                          setRoundmasterEdit({
                            ...roundmasterEdit,
                            category: "Please Select Category",
                            subcategory: "Please Select Sub Category",
                            question: "Please Select Question",
                            type: "Please Select Type",
                          });
                          setQuestionDatasEdit({
                            yesorno: "",
                            type: "",
                            subquestionlength: "",
                            options: "",
                            date: "",
                            fromdate: "",
                            todate: "",
                            typingspeed: "",
                            typingaccuracy: "",
                            typingmistakes: "",
                            typingduration: "",
                            secondarytodo: [],
                          });
                          setDescriptionEdit("");
                          setStatusEdit("Please Select Status");
                          setOptionstodoEdit([]);
                          setExtraQuestionsEdit("Please Select Sub Question");
                          setAddReqTodoEdit([]);
                          setTodoSubmitEdit(false);
                        }}
                      />
                      {/* <OutlinedInput
                        id="test-type"
                        type="text"
                        value={modeEdit}
                        readOnly
                      /> */}
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Category <b style={{ color: "red" }}>*</b>
                      </Typography>
                      {/* <OutlinedInput
                        id="test-type"
                        type="text"
                        value={roundmasterEdit?.category}
                        readOnly
                      /> */}
                      <Selects
                        options={categoryOptionsEdit}
                        styles={colourStyles}
                        value={{
                          label:
                            roundmasterEdit?.category === "" ||
                              roundmasterEdit?.category === undefined
                              ? "Please Select Category"
                              : roundmasterEdit?.category,
                          value:
                            roundmasterEdit?.category === "" ||
                              roundmasterEdit?.category === undefined
                              ? "Please Select Category"
                              : roundmasterEdit?.category,
                        }}
                        isDisabled={(answerallotdetails && statusallotid) || editable}
                        onChange={(e) => {
                          setRoundmasterEdit({
                            ...roundmasterEdit,
                            category: e.value,
                            subcategory: "Please Select Sub Category",
                            question: "Please Select Question",
                            type: "Please Select Type",
                          });
                          setQuestionDatasEdit({
                            yesorno: "",
                            type: "",
                            subquestionlength: "",
                            options: "",
                            date: "",
                            fromdate: "",
                            todate: "",
                            typingspeed: "",
                            typingaccuracy: "",
                            typingmistakes: "",
                            typingduration: "",
                            secondarytodo: [],
                          });
                          setDescriptionEdit("");
                          setStatusEdit("Please Select Status");
                          setOptionstodoEdit([]);
                          setExtraQuestionsEdit("Please Select Sub Question");
                          setAddReqTodoEdit([]);
                          setTodoSubmitEdit(false);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Sub Category <b style={{ color: "red" }}>*</b>
                      </Typography>
                      {/* <OutlinedInput
                        id="test-type"
                        type="text"
                        value={roundmasterEdit?.subcategory}
                        readOnly
                      /> */}
                      <Selects
                        options={catDatasEdit
                          .filter(
                            (item) =>
                              item.categoryname === roundmasterEdit?.category &&
                              item?.mode === modeEdit
                          )
                          .map((item) => {
                            return item.subcategoryname.map((subCatName) => ({
                              label: subCatName,
                              value: subCatName,
                            }));
                          })
                          .flat()}
                        styles={colourStyles}
                        isDisabled={(answerallotdetails && statusallotid) || editable}
                        value={{
                          label:
                            roundmasterEdit?.subcategory === "" ||
                              roundmasterEdit?.subcategory === undefined
                              ? "Please Select Sub Category"
                              : roundmasterEdit?.subcategory,
                          value:
                            roundmasterEdit?.subcategory === "" ||
                              roundmasterEdit?.subcategory === undefined
                              ? "Please Select Sub Category"
                              : roundmasterEdit?.subcategory,
                        }}
                        onChange={(e) => {
                          setRoundmasterEdit({
                            ...roundmasterEdit,
                            subcategory: e.value,
                            question: "Please Select Question",
                            type: "Please Select Type",
                          });
                          setQuestionDatasEdit({
                            yesorno: "",
                            type: "",
                            subquestionlength: "",
                            options: "",
                            date: "",
                            fromdate: "",
                            todate: "",
                            typingspeed: "",
                            typingaccuracy: "",
                            typingmistakes: "",
                            typingduration: "",
                            secondarytodo: [],
                          });
                          fetchInterviewquestionsOnchange(
                            roundmasterEdit.category,
                            e.value
                          );
                          setDescriptionEdit("");
                          setStatusEdit("Please Select Status");
                          setOptionstodoEdit([]);
                          setExtraQuestionsEdit("Please Select Sub Question");
                          setAddReqTodoEdit([]);
                          setTodoSubmitEdit(false);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Interview Question <b style={{ color: "red" }}>*</b>
                      </Typography>
                      {/* <TextareaAutosize
                        aria-label="minimum height"
                        minRows={5}
                        value={roundmasterEdit?.question}
                        readOnly
                      /> */}
                      <Selects
                        options={interview?.filter(
                          (item) =>
                            item.category === roundmasterEdit.category &&
                            item.subcategory === roundmasterEdit.subcategory &&
                            item.mode === modeEdit
                        )}
                        styles={colourStyles}
                        isDisabled={(answerallotdetails && statusallotid) || editable}
                        value={{
                          label: roundmasterEdit?.question,
                          value: roundmasterEdit?.question,
                        }}
                        onChange={(e) => {
                          setRoundmasterEdit({
                            ...roundmasterEdit,
                            question: e.value,
                            type: e.type,
                            speedvalidation: "Please Select Validation",
                            speedstatus: "Please Select Status",
                            speedfrom: "",
                            speedto: "",
                            speeddescription: "",

                            accuracyvalidation: "Please Select Validation",
                            accuracystatus: "Please Select Status",
                            accuracyfrom: "",
                            accuracyto: "",
                            accuracydescription: "",

                            mistakesvalidation: "Please Select Validation",
                            mistakesstatus: "Please Select Status",
                            mistakesfrom: "",
                            mistakesto: "",
                            mistakesdescription: "",
                          });
                          setAddReqTodoEdit([]);
                          setQuestionDatasEdit({
                            yesorno: e.yesorno,
                            type: e.type,
                            subquestionlength: e.subquestionlength,
                            options: e.optionArr,
                            date: e.date,
                            fromdate: e.fromdate,
                            todate: e.todate,
                            typingspeed: e?.typingspeed,
                            typingaccuracy: e?.typingaccuracy,
                            typingmistakes: e?.typingmistakes,
                            typingduration: e?.typingduration,
                            secondarytodo: e.secondarytodo,
                          });
                          if (e.type === "Yes/No") {
                            setOptionstodoEdit([
                              {
                                options: "Yes",
                                status: "Please Select Status",
                                validation: "Please Select Validation",
                                description: "",
                                betweenfrom: "",
                                betweento: "",
                              },
                              {
                                options: "No",
                                status: "Please Select Status",
                                validation: "Please Select Validation",
                                description: "",
                                betweenfrom: "",
                                betweento: "",
                              },
                            ]);
                          } else if (e.type === "Correct/In Correct") {
                            setOptionstodoEdit([
                              {
                                options: "Correct",
                                status: "Please Select Status",
                                validation: "Please Select Validation",
                                description: "",
                                betweenfrom: "",
                                betweento: "",
                              },
                              {
                                options: "In Correct",
                                status: "Please Select Status",
                                validation: "Please Select Validation",
                                description: "",
                                betweenfrom: "",
                                betweento: "",
                              },
                            ]);
                          } else {
                            setOptionstodoEdit(
                              e.optionArr?.map((item) => ({
                                options: item.options,
                                tamiloptions: item?.tamiloptions || "",
                                status: "Please Select Status",
                                validation: "Please Select Validation",
                                description: "",
                                betweenfrom: "",
                                betweento: "",
                              }))
                            );
                          }



                          setDescriptionEdit("");
                          setStatusEdit("Please Select Status");

                          setExtraQuestionsEdit("Please Select Sub Question");

                          setTodoSubmitEdit(false);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Type<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Interview Question Type"
                        value={roundmasterEdit?.type}
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                  {roundmasterEdit?.type !== "Typing Test" &&
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Inform Reason or Not<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={2.5}
                          value={roundmasterEdit?.informreason}
                          onChange={(e) =>
                            setRoundmasterEdit({
                              ...roundmasterEdit,
                              informreason: e.target.value,
                            })
                          }
                        />

                      </FormControl>
                    </Grid>}

                  {questionDatasEdit?.type === "Typing Test" && (
                    <>
                      <Grid item md={2} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Speed</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={`${questionDatasEdit?.typingspeed} wpm`}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Validation
                            <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={validationOptions}
                            styles={colourStyles}
                            value={{
                              label: roundmasterEdit?.speedvalidation,
                              value: roundmasterEdit?.speedvalidation,
                            }}
                            onChange={(e) =>
                              setRoundmasterEdit({
                                ...roundmasterEdit,
                                speedvalidation: e.value,
                                speedfrom: "",
                                speedto: "",
                                speed: "",
                              })
                            }
                          />
                        </FormControl>
                      </Grid>
                      {roundmasterEdit?.speedvalidation === "Between" && (
                        <Grid item md={3} xs={12} sm={12}>
                          <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography>
                                  {" "}
                                  From <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput
                                  id="component-outlined"
                                  type="text"
                                  value={roundmasterEdit?.speedfrom}
                                  onChange={(e) => {
                                    const numericOnly = e.target.value.replace(
                                      /[^0-9.;\s]/g,
                                      ""
                                    );
                                    setRoundmasterEdit({
                                      ...roundmasterEdit,
                                      speedfrom: numericOnly,
                                      speedto: "",
                                    });
                                  }}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography>
                                  {" "}
                                  To <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput
                                  id="component-outlined"
                                  type="text"
                                  value={roundmasterEdit?.speedto}
                                  onChange={(e) => {
                                    const numericOnly = e.target.value.replace(
                                      /[^0-9.;\s]/g,
                                      ""
                                    );
                                    setRoundmasterEdit({
                                      ...roundmasterEdit,
                                      speedto: numericOnly,
                                    });
                                  }}
                                />
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>
                      )}

                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Status<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={statusOptiontyping}
                            styles={colourStyles}
                            value={{
                              label: roundmasterEdit?.speedstatus,
                              value: roundmasterEdit?.speedstatus,
                            }}
                            onChange={(e) =>
                              setRoundmasterEdit({
                                ...roundmasterEdit,
                                speedstatus: e.value,
                                speeddescription: "",
                              })
                            }
                          />
                        </FormControl>
                      </Grid>
                      {roundmasterEdit?.speedvalidation !== "Between" && (
                        <Grid item md={3} xs={12} sm={12}></Grid>
                      )}
                      <Grid item md={2} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Accuracy</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={`${questionDatasEdit?.typingaccuracy} %`}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Validation
                            <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={validationOptions}
                            styles={colourStyles}
                            value={{
                              label: roundmasterEdit?.accuracyvalidation,
                              value: roundmasterEdit?.accuracyvalidation,
                            }}
                            onChange={(e) =>
                              setRoundmasterEdit({
                                ...roundmasterEdit,
                                accuracyvalidation: e.value,
                                accuracyfrom: "",
                                accuracyto: "",
                              })
                            }
                          />
                        </FormControl>
                      </Grid>
                      {roundmasterEdit?.accuracyvalidation === "Between" && (
                        <Grid item md={3} xs={12} sm={12}>
                          <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography>
                                  {" "}
                                  From <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput
                                  id="component-outlined"
                                  type="text"
                                  value={roundmasterEdit?.accuracyfrom}
                                  onChange={(e) => {
                                    const numericOnly = e.target.value.replace(
                                      /[^0-9.;\s]/g,
                                      ""
                                    );
                                    setRoundmasterEdit({
                                      ...roundmasterEdit,
                                      accuracyfrom: numericOnly,
                                      accuracyto: "",
                                    });
                                  }}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography>
                                  {" "}
                                  To <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput
                                  id="component-outlined"
                                  type="text"
                                  value={roundmasterEdit?.accuracyto}
                                  onChange={(e) => {
                                    const numericOnly = e.target.value.replace(
                                      /[^0-9.;\s]/g,
                                      ""
                                    );
                                    setRoundmasterEdit({
                                      ...roundmasterEdit,
                                      accuracyto: numericOnly,
                                    });
                                  }}
                                />
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>
                      )}

                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Status<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={statusOptiontyping}
                            styles={colourStyles}
                            value={{
                              label: roundmasterEdit?.accuracystatus,
                              value: roundmasterEdit?.accuracystatus,
                            }}
                            onChange={(e) =>
                              setRoundmasterEdit({
                                ...roundmasterEdit,
                                accuracystatus: e.value,
                                accuracydescription: "",
                              })
                            }
                          />
                        </FormControl>
                      </Grid>
                      {roundmasterEdit?.accuracyvalidation !== "Between" && (
                        <Grid item md={3} xs={12} sm={12}></Grid>
                      )}
                      <Grid item md={2} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>No.Of Mistakes Acceptable</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={`${questionDatasEdit?.typingmistakes}`}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Validation
                            <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={validationOptions}
                            styles={colourStyles}
                            value={{
                              label: roundmasterEdit?.mistakesvalidation,
                              value: roundmasterEdit?.mistakesvalidation,
                            }}
                            onChange={(e) =>
                              setRoundmasterEdit({
                                ...roundmasterEdit,
                                mistakesvalidation: e.value,
                                mistakesfrom: "",
                                mistakesto: "",
                              })
                            }
                          />
                        </FormControl>
                      </Grid>
                      {roundmasterEdit?.mistakesvalidation === "Between" && (
                        <Grid item md={3} xs={12} sm={12}>
                          <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography>
                                  {" "}
                                  From <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput
                                  id="component-outlined"
                                  type="text"
                                  value={roundmasterEdit?.mistakesfrom}
                                  onChange={(e) => {
                                    const numericOnly = e.target.value.replace(
                                      /[^0-9.;\s]/g,
                                      ""
                                    );
                                    setRoundmasterEdit({
                                      ...roundmasterEdit,
                                      mistakesfrom: numericOnly,
                                      mistakesto: "",
                                    });
                                  }}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography>
                                  {" "}
                                  To <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput
                                  id="component-outlined"
                                  type="text"
                                  value={roundmasterEdit?.mistakesto}
                                  onChange={(e) => {
                                    const numericOnly = e.target.value.replace(
                                      /[^0-9.;\s]/g,
                                      ""
                                    );
                                    setRoundmasterEdit({
                                      ...roundmasterEdit,
                                      mistakesto: numericOnly,
                                    });
                                  }}
                                />
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>
                      )}

                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Status<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={statusOptiontyping}
                            styles={colourStyles}
                            value={{
                              label: roundmasterEdit?.mistakesstatus,
                              value: roundmasterEdit?.mistakesstatus,
                            }}
                            onChange={(e) =>
                              setRoundmasterEdit({
                                ...roundmasterEdit,
                                mistakesstatus: e.value,
                                mistakesdescription: "",
                              })
                            }
                          />
                        </FormControl>
                      </Grid>
                      {typingTestValidation?.mistakesvalidation !==
                        "Between" && <Grid item md={3} xs={12} sm={12}></Grid>}
                    </>
                  )}

                  {questionDatasEdit?.type === "Date" && (
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Date</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={
                            questionDatasEdit?.date === ""
                              ? ""
                              : moment(questionDatasEdit?.date).format(
                                "DD-MM-YYYY"
                              )
                          }
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                  )}
                  {questionDatasEdit?.type === "Date Range" && (
                    <>
                      <Grid item md={2.5} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>From Date</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={moment(questionDatasEdit?.fromdate).format(
                              "DD-MM-YYYY"
                            )}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={2.5} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            To Date<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={moment(questionDatasEdit?.todate).format(
                              "DD-MM-YYYY"
                            )}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}

                  {(questionDatasEdit?.type === "Date" ||
                    questionDatasEdit?.type === "Date Range") && (
                      <>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Status<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <Selects
                              options={statusOption}
                              styles={colourStyles}
                              value={{
                                label: dateStatusEdit,
                                value: dateStatusEdit,
                              }}
                              onChange={(e) => setDateStatusEdit(e.value)}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Description
                              <b style={{ color: "red" }}>*</b>
                            </Typography>

                            <TextareaAutosize
                              aria-label="minimum height"
                              minRows={2.5}
                              value={dateDescriptionEdit}
                              onChange={(e) =>
                                setDateDescriptionEdit(
                                  e.target.value
                                )
                              }
                            />
                          </FormControl>
                        </Grid>
                      </>
                    )}

                  {(roundmasterEdit?.type === "MultipleChoice" ||
                    roundmasterEdit?.type === "Radio" ||
                    roundmasterEdit?.type === "TextBox" ||
                    roundmasterEdit?.type === "Text-Alpha" ||
                    roundmasterEdit?.type === "Yes/No" ||
                    roundmasterEdit?.type === "Correct/In Correct" ||
                    roundmasterEdit?.type === "Text-Alpha" ||
                    roundmasterEdit?.type === "Text-Numeric") && (
                      <>
                        {/* <Grid item md={3} xs={12} sm={12}></Grid> */}

                        <br />
                        {optionstodoEdit?.length > 0 && (
                          <Grid item md={12} xs={12} sm={12}>
                            <ul type="none">
                              {optionstodoEdit.map((item, index) => {
                                return (
                                  <li key={index}>
                                    <br />
                                    <Grid sx={{ display: "flex" }}>
                                      <FormControl fullWidth size="small">
                                        <Typography>
                                          {" "}
                                          Answers List{" "}
                                          <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                          id="component-outlined"
                                          placeholder="Please Enter SubCategory"
                                          value={item.options}
                                          readOnly
                                        />
                                      </FormControl>
                                      &emsp;
                                      {item.options !== "NOANSWER" &&
                                        questionDatasEdit?.type ===
                                        "Text-Numeric" && (
                                          <>
                                            <FormControl fullWidth size="small">
                                              <Typography>
                                                Validation
                                                <b style={{ color: "red" }}>*</b>
                                              </Typography>
                                              <Selects
                                                options={[
                                                  {
                                                    label: `Less Than`,
                                                    value: `Less Than`,
                                                  },
                                                  {
                                                    label: `Less Than or Equal to`,
                                                    value: `Less Than or Equal to`,
                                                  },
                                                  {
                                                    label: `Greater Than`,
                                                    value: `Greater Than`,
                                                  },
                                                  {
                                                    label: `Greater Than or Equal to`,
                                                    value: `Greater Than or Equal to`,
                                                  },
                                                  {
                                                    label: `Equal to`,
                                                    value: `Equal to`,
                                                  },
                                                  {
                                                    label: `Between`,
                                                    value: `Between`,
                                                  },
                                                ]}
                                                styles={colourStyles}
                                                value={{
                                                  label: item.validation,
                                                  value: item.validation,
                                                }}
                                                onChange={(e) =>
                                                  handleTodoEditPage(
                                                    index,
                                                    "validation",
                                                    e.value
                                                  )
                                                }
                                              />
                                            </FormControl>
                                            &emsp;
                                            {item.validation === "Between" && (
                                              <>
                                                <FormControl
                                                  fullWidth
                                                  size="small"
                                                >
                                                  <Typography>
                                                    {" "}
                                                    From{" "}
                                                    <b style={{ color: "red" }}>
                                                      *
                                                    </b>
                                                  </Typography>
                                                  <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={item.betweenfrom}
                                                    onChange={(e) =>
                                                      handleTodoEditPage(
                                                        index,
                                                        "betweenfrom",
                                                        e.target.value
                                                      )
                                                    }

                                                  />
                                                </FormControl>
                                                &emsp;
                                                <FormControl
                                                  fullWidth
                                                  size="small"
                                                >
                                                  <Typography>
                                                    {" "}
                                                    To{" "}
                                                    <b style={{ color: "red" }}>
                                                      *
                                                    </b>
                                                  </Typography>
                                                  <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={item.betweento}
                                                    onChange={(e) =>
                                                      handleTodoEditPage(
                                                        index,
                                                        "betweento",
                                                        e.target.value
                                                      )
                                                    }

                                                  />
                                                </FormControl>
                                              </>
                                            )}
                                          </>
                                        )}
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
                                          onChange={(e) =>
                                            handleTodoEditPage(
                                              index,
                                              "status",
                                              e.value
                                            )
                                          }
                                        />
                                      </FormControl>
                                      &emsp;
                                      <FormControl fullWidth size="small">
                                        <Typography>
                                          Description
                                        </Typography>
                                        <TextareaAutosize
                                          aria-label="minimum height"
                                          minRows={2.5}
                                          value={item.description}
                                          onChange={(e) =>
                                            handleTodoEditPage(
                                              index,
                                              "description",
                                              e.target.value
                                            )
                                          }
                                        />

                                      </FormControl>
                                      &emsp;
                                    </Grid>
                                  </li>
                                );
                              })}
                            </ul>
                          </Grid>
                        )}
                      </>
                    )}
                </Grid>
                <br />
                <br />
                {!["Typing Test"].includes(roundmasterEdit?.type) &&
                  questionDatasEdit.yesorno === "Yes" && (
                    // optionstodoEdit?.length > 0
                    // &&
                    <Grid container spacing={2}>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Do You Need Extra Question</Typography>
                          <Selects
                            options={interviewQuestion
                              ?.filter(
                                (item) =>
                                  item?.name === roundmasterEdit?.question
                              )
                              ?.map((item) => {
                                return item?.subquestions
                                  ?.map((item) => ({
                                    label: item?.subquestionnumber,
                                    value: item?.subquestionnumber,
                                  }))
                                  .filter(
                                    (value, index, self) =>
                                      self.findIndex(
                                        (v) => v.value === value.value
                                      ) === index
                                  );
                              })
                              .flat()}
                            styles={colourStyles}
                            value={{
                              label: extraQuestionsEdit,
                              value: extraQuestionsEdit,
                            }}
                            onChange={(e) => {
                              setExtraQuestionsEdit(e.value);
                              setExtraOptionsEdit("Please Select Answers");
                              setExtraQuestAddEdit(
                                "Please Select Extra Questions"
                              );
                              setExtraTypeEdit("");
                              setOptionstodoExtraEdit([]);
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={2} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            {extraQuestionsEdit === "Sub Question"
                              ? "Primary Answers"
                              : extraQuestionsEdit === "Sub Question 1"
                                ? "Sub Question Answers"
                                : extraQuestionsEdit ===
                                  "Please Select Type Questions"
                                  ? "Answers"
                                  : extraQuestionsEdit.replace(
                                    /\d+/,
                                    (match) => match - 1
                                  ) + " Answers"}
                          </Typography>
                          <Selects
                            options={
                              extraQuestionsEdit == "Sub Question" &&
                                !["Date", "Date Range"].includes(
                                  roundmasterEdit?.type
                                )
                                ? optionstodoEdit.map((data) => ({
                                  label: data.options,
                                  value: data.options,
                                  question: roundmasterEdit?.question,
                                }))
                                : extraQuestionsEdit == "Sub Question" &&
                                  roundmasterEdit?.type === "Date" &&
                                  questionDatas?.date !== ""
                                  ? [
                                    {
                                      label: moment(questionDatas?.date).format(
                                        "DD-MM-YYYY"
                                      ),
                                      value: moment(questionDatas?.date).format(
                                        "DD-MM-YYYY"
                                      ),
                                      question: roundmasterEdit?.question,
                                    },
                                  ]
                                  : extraQuestionsEdit == "Sub Question" &&
                                    roundmasterEdit?.type === "Date" &&
                                    questionDatas?.date === ""
                                    ? [
                                      {
                                        label: "NODATE",
                                        value: "NODATE",
                                        question: roundmasterEdit?.question,
                                      },
                                    ]
                                    : extraQuestionsEdit == "Sub Question" &&
                                      roundmasterEdit?.type === "Date Range"
                                      ? [
                                        {
                                          label: `${moment(
                                            questionDatas?.fromdate
                                          ).format("DD-MM-YYYY")} - ${moment(
                                            questionDatas?.todate
                                          ).format("DD-MM-YYYY")}`,
                                          value: `${moment(
                                            questionDatas?.fromdate
                                          ).format("DD-MM-YYYY")} - ${moment(
                                            questionDatas?.todate
                                          ).format("DD-MM-YYYY")}`,
                                          question: roundmasterEdit?.question,
                                        },
                                      ]
                                      : extraQuestionsEdit === "Sub Question 1"
                                        ? addReqTodoEdit?.flatMap((item) => {
                                          if (
                                            item?.extraquestion === "Sub Question" &&
                                            item?.type === "Date Range"
                                          ) {
                                            return [
                                              {
                                                label: `${moment(
                                                  item.optionslist[0]?.answer
                                                ).format("DD-MM-YYYY")} - ${moment(
                                                  item.optionslist[1].answer
                                                ).format("DD-MM-YYYY")}`,
                                                value: `${moment(
                                                  item.optionslist[0]?.answer
                                                ).format("DD-MM-YYYY")} - ${moment(
                                                  item.optionslist[1]?.answer
                                                ).format("DD-MM-YYYY")}`,
                                                question: item.question,
                                              },
                                            ];
                                          }

                                          if (
                                            item?.extraquestion === "Sub Question" &&
                                            item?.type === "Date"
                                          ) {
                                            return [
                                              {
                                                label:
                                                  item.optionslist[0]?.answer === ""
                                                    ? "NODATE"
                                                    : `${moment(
                                                      item.optionslist[0]?.answer
                                                    ).format("DD-MM-YYYY")}`,
                                                value:
                                                  item.optionslist[0]?.answer === ""
                                                    ? "NODATE"
                                                    : `${moment(
                                                      item.optionslist[0]?.answer
                                                    ).format("DD-MM-YYYY")}`,
                                                question: item.question,
                                              },
                                            ];
                                          }

                                          if (
                                            item?.extraquestion === "Sub Question" &&
                                            item?.type !== "Date" &&
                                            item?.type !== "Date Range"
                                          ) {
                                            return item?.optionslist.map((data) => ({
                                              label: data.answer,
                                              value: data.answer,
                                              question: item.question,
                                            }));
                                          }
                                          return [];
                                        })
                                        : addReqTodoEdit?.flatMap((item) => {
                                          if (
                                            item.extraquestion ===
                                            extraQuestionsEdit?.replace(
                                              /\d+/,
                                              (match) => match - 1
                                            ) &&
                                            item?.type === "Date Range"
                                          ) {
                                            return [
                                              {
                                                label: `${moment(
                                                  item.optionslist[0]?.answer
                                                ).format("DD-MM-YYYY")} - ${moment(
                                                  item.optionslist[1]?.answer
                                                ).format("DD-MM-YYYY")}`,
                                                value: `${moment(
                                                  item.optionslist[0]?.answer
                                                ).format("DD-MM-YYYY")} - ${moment(
                                                  item.optionslist[1]?.answer
                                                ).format("DD-MM-YYYY")}`,
                                                question: item.question,
                                              },
                                            ];
                                          }

                                          if (
                                            item.extraquestion ===
                                            extraQuestionsEdit.replace(
                                              /\d+/,
                                              (match) => match - 1
                                            ) &&
                                            item?.type === "Date"
                                          ) {
                                            return [
                                              {
                                                label:
                                                  item.optionslist[0].answer === ""
                                                    ? "NODATE"
                                                    : `${moment(
                                                      item.optionslist[0].answer
                                                    ).format("DD-MM-YYYY")}`,
                                                value:
                                                  item.optionslist[0].answer === ""
                                                    ? "NODATE"
                                                    : `${moment(
                                                      item.optionslist[0].answer
                                                    ).format("DD-MM-YYYY")}`,
                                                question: item.question,
                                              },
                                            ];
                                          }

                                          if (
                                            item.extraquestion ===
                                            extraQuestionsEdit.replace(
                                              /\d+/,
                                              (match) => match - 1
                                            ) &&
                                            item?.type !== "Date" &&
                                            item?.type !== "Date Range"
                                          ) {
                                            return item?.optionslist.map((data) => ({
                                              label: data.answer,
                                              value: data.answer,
                                              question: item.question,
                                            }));
                                          }

                                          // Ensure that the callback always returns an array
                                          return [];
                                        })
                            }
                            styles={colourStyles}
                            value={{
                              label: extraOptionsEdit,
                              value: extraOptionsEdit,
                            }}
                            onChange={(e) => {
                              setExtraOptionsEdit(e.value);
                              setInterviewViewQuestionsEdit(e?.question);
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            {`${extraQuestionsEdit === "Sub Question 1"
                              ? "Sub Question 1"
                              : extraQuestionsEdit === "Sub Question 2"
                                ? "Sub Question 2"
                                : extraQuestionsEdit ===
                                  "Please Select Type Questions"
                                  ? "Questions"
                                  : extraQuestionsEdit
                              }`}
                          </Typography>
                          <Selects
                            options={interviewQuestion
                              ?.filter(
                                (item) =>
                                  item?.name === roundmasterEdit?.question &&
                                  item?.subquestions?.some(
                                    (subquestion) =>
                                      subquestion?.subquestionnumber ===
                                      extraQuestionsEdit
                                  )
                              )
                              ?.flatMap((item) =>
                                item?.subquestions
                                  ?.filter(
                                    (subquestion) =>
                                      subquestion?.subquestionnumber ===
                                      extraQuestionsEdit
                                  )
                                  ?.map((subquestion) => ({
                                    label: subquestion?.question,
                                    value: subquestion?.question,
                                  }))
                              )
                              .filter(
                                (subquestion) =>
                                  !addReqTodoEdit?.some(
                                    (req) =>
                                      req.question === subquestion.label &&
                                      req?.extraquestion === extraQuestionsEdit
                                  )
                              )}
                            styles={colourStyles}
                            value={{
                              label: extraQuestAddEdit,
                              value: extraQuestAddEdit,
                            }}
                            onChange={(e) => {
                              setExtraQuestAddEdit(e.value);
                              const extraType = interviewQuestionAns
                                ?.filter(
                                  (item) =>
                                    item?.question ===
                                    roundmasterEdit?.question &&
                                    item.category ===
                                    roundmasterEdit.category &&
                                    item.subcategory ===
                                    roundmasterEdit.subcategory &&
                                    item?.secondarytodo?.some(
                                      (subquestion) =>
                                        subquestion?.question === e.value
                                    )
                                )
                                ?.flatMap((item) =>
                                  item.secondarytodo
                                    ?.filter(
                                      (subquestion) =>
                                        subquestion?.question === e.value
                                    )
                                    ?.map((subquestion) => subquestion?.type)
                                )
                                ?.join(", ");
                              setExtraTypeEdit(extraType);

                              if (extraType === "Yes/No") {
                                setOptionstodoExtraEdit([
                                  {
                                    answer: "Yes",
                                    tamilanswer: "ஆம்",
                                    status: "Please Select Status",
                                    validation: "Please Select Validation",
                                    description: "",
                                    betweenfrom: "",
                                    betweento: "",
                                  },
                                  {
                                    answer: "No",
                                    tamilanswer: "இல்லை",
                                    status: "Please Select Status",
                                    validation: "Please Select Validation",
                                    description: "",
                                    betweenfrom: "",
                                    betweento: "",
                                  },
                                ]);
                              } else if (extraType === "Correct/In Correct") {
                                setOptionstodoExtraEdit([
                                  {
                                    answer: "Correct",
                                    tamilanswer: "சரி",
                                    status: "Please Select Status",
                                    validation: "Please Select Validation",
                                    description: "",
                                    betweenfrom: "",
                                    betweento: "",
                                  },
                                  {
                                    answer: "In Correct",
                                    tamilanswer: "தவறு",
                                    status: "Please Select Status",
                                    validation: "Please Select Validation",
                                    description: "",
                                    betweenfrom: "",
                                    betweento: "",
                                  },
                                ]);
                              } else {
                                const extraOptionList = interviewQuestionAns
                                  ?.filter(
                                    (item) =>
                                      item.question ===
                                      roundmasterEdit?.question &&
                                      item.category ===
                                      roundmasterEdit.category &&
                                      item.subcategory ===
                                      roundmasterEdit.subcategory &&
                                      item.secondarytodo?.some(
                                        (subquestion) =>
                                          subquestion.question === e.value
                                      )
                                  )
                                  .flatMap((item) =>
                                    item.secondarytodo
                                      ?.filter(
                                        (subquestion) =>
                                          subquestion.question === e.value
                                      )
                                      ?.map(
                                        (subquestion) =>
                                          subquestion?.optionslist
                                      )
                                  );

                                const extraTamilOptionList = interviewQuestionAns
                                  ?.filter(
                                    (item) =>
                                      item.question ===
                                      roundmasterEdit?.question &&
                                      item.category ===
                                      roundmasterEdit.category &&
                                      item.subcategory ===
                                      roundmasterEdit.subcategory &&
                                      item.secondarytodo?.some(
                                        (subquestion) =>
                                          subquestion.question === e.value
                                      )
                                  )
                                  .flatMap((item) =>
                                    item.secondarytodo
                                      ?.filter(
                                        (subquestion) =>
                                          subquestion.question === e.value
                                      )
                                      ?.map((subquestion) => subquestion?.tamiloptionslist || [])
                                  );
                                const answers = extraOptionList?.flat() || [];
                                const tamilanswers = extraTamilOptionList?.flat() || [];
                                setOptionstodoExtraEdit(
                                  answers?.map((item, index) => ({
                                    answer: item,
                                    tamilanswer: tamilanswers[index] || "",
                                    status: "Please Select Status",
                                    validation: "Please Select Validation",
                                    description: "",
                                    betweenfrom: "",
                                    betweento: "",
                                  }))
                                );
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            {extraQuestionsEdit === "Sub Question"
                              ? "Primary Answers Type"
                              : extraQuestionsEdit === "Sub Question 1"
                                ? "Sub Question Answers Type"
                                : extraQuestionsEdit ===
                                  "Please Select Type Questions"
                                  ? "Answers Type"
                                  : extraQuestionsEdit.replace(
                                    /\d+/,
                                    (match) => match - 1
                                  ) + " Answers Type"}
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            placeholder="Please Enter SubCategory"
                            value={extratypeEdit}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                      {extraOptionsEdit !== "Please Select Answers" &&
                        extraQuestAddEdit !==
                        "Please Select Extra Questions" && (
                          <>
                            <br />
                            &emsp;
                            {optionstodoExtraEdit.length > 0 && (
                              <Grid item md={9} xs={12} sm={12}>
                                <ul type="none">
                                  {optionstodoExtraEdit.map((item, index) => {
                                    return (
                                      <li key={index}>
                                        <br />
                                        <Grid sx={{ display: "flex" }}>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              {" "}
                                              Answers List{" "}
                                            </Typography>
                                            <OutlinedInput
                                              id="component-outlined"
                                              placeholder="Please Enter SubCategory"
                                              value={item.answer}
                                              readOnly
                                            />
                                          </FormControl>
                                          &emsp;
                                          {item.answer !== "NOANSWER" &&
                                            extratypeEdit ===
                                            "Text-Numeric" && (
                                              <>
                                                <FormControl
                                                  fullWidth
                                                  size="small"
                                                >
                                                  <Typography>
                                                    Validation
                                                    <b style={{ color: "red" }}>
                                                      *
                                                    </b>
                                                  </Typography>
                                                  <Selects
                                                    options={[
                                                      {
                                                        label: `Less Than`,
                                                        value: `Less Than`,
                                                      },
                                                      {
                                                        label: `Less Than or Equal to`,
                                                        value: `Less Than or Equal to`,
                                                      },
                                                      {
                                                        label: `Greater Than`,
                                                        value: `Greater Than`,
                                                      },
                                                      {
                                                        label: `Greater Than or Equal to`,
                                                        value: `Greater Than or Equal to`,
                                                      },
                                                      {
                                                        label: `Equal to`,
                                                        value: `Equal to`,
                                                      },
                                                      {
                                                        label: `Between`,
                                                        value: `Between`,
                                                      },
                                                    ]}
                                                    styles={colourStyles}
                                                    value={{
                                                      label: item.validation,
                                                      value: item.validation,
                                                    }}
                                                    onChange={(e) =>
                                                      handleTodoEditExtraEdit(
                                                        index,
                                                        "validation",
                                                        e.value
                                                      )
                                                    }
                                                  />
                                                </FormControl>
                                                &emsp;
                                                {item.validation ===
                                                  "Between" && (
                                                    <>
                                                      <FormControl
                                                        fullWidth
                                                        size="small"
                                                      >
                                                        <Typography>
                                                          {" "}
                                                          From{" "}
                                                          <b
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            *
                                                          </b>
                                                        </Typography>
                                                        <OutlinedInput
                                                          id="component-outlined"
                                                          type="text"
                                                          value={item.betweenfrom}
                                                          onChange={(e) =>
                                                            handleTodoEditExtraEdit(
                                                              index,
                                                              "betweenfrom",
                                                              e.target.value
                                                            )
                                                          }
                                                        />
                                                      </FormControl>
                                                      &emsp;
                                                      <FormControl
                                                        fullWidth
                                                        size="small"
                                                      >
                                                        <Typography>
                                                          {" "}
                                                          To{" "}
                                                          <b
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            *
                                                          </b>
                                                        </Typography>
                                                        <OutlinedInput
                                                          id="component-outlined"
                                                          type="text"
                                                          value={item.betweento}
                                                          onChange={(e) =>
                                                            handleTodoEditExtraEdit(
                                                              index,
                                                              "betweento",
                                                              e.target.value
                                                            )
                                                          }
                                                        />
                                                      </FormControl>
                                                    </>
                                                  )}
                                              </>
                                            )}
                                          &emsp;
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              Status
                                              <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                              options={statusOption}
                                              styles={colourStyles}
                                              value={{
                                                label: item.status,
                                                value: item.status,
                                              }}
                                              onChange={(e) =>
                                                handleTodoEditExtraEdit(
                                                  index,
                                                  "status",
                                                  e.value
                                                )
                                              }
                                            />
                                          </FormControl>
                                          &emsp;
                                        </Grid>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </Grid>
                            )}
                          </>
                        )}
                      {optionstodoExtraEdit.length > 0 && (
                        <Grid item md={3} xs={12} sm={12}>
                          <Button
                            variant="contained"
                            onClick={handleAddTodoEdit}
                            sx={{
                              marginTop: "28px",
                              padding: "6px 10px",
                            }}
                          >
                            {" "}
                            Add{" "}
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  )}
                <br /> <br />
                {addReqTodoEdit?.length > 0 && (
                  <ul type="none">
                    {addReqTodoEdit?.map((row, index) => {
                      return (
                        <li key={index}>
                          <Grid container spacing={2}>
                            {isTodoEditPage[index] ? (
                              // index == 0
                              <>
                                <Grid item md={3} xs={12} sm={12}>
                                  <FormControl fullWidth size="small">
                                    <Typography>
                                      {`Extra Question - (${row?.prequestionview})`}
                                    </Typography>

                                    <OutlinedInput
                                      id="component-outlined"
                                      placeholder="Please Enter SubCategory"
                                      value={row?.extraquestion}
                                      readOnly
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                  <FormControl fullWidth size="small">
                                    <Typography>
                                      {row?.extraquestion === "Sub Question"
                                        ? "Primary Answers"
                                        : row?.extraquestion ===
                                          "Sub Question 1"
                                          ? "Sub Question Answers"
                                          : row?.extraquestion ===
                                            "Please Select Type Questions"
                                            ? "Answers"
                                            : row?.extraquestion.replace(
                                              /\d+/,
                                              (match) => match - 1
                                            ) + " Answers"}
                                    </Typography>
                                    <Selects
                                      options={
                                        row?.extraquestion == "Sub Question" &&
                                          !["Date", "Date Range"].includes(
                                            roundmasterEdit?.type
                                          )
                                          ? optionstodoEdit.map((data) => ({
                                            label: data.options,
                                            value: data.options,
                                          }))
                                          : row?.extraquestion ==
                                            "Sub Question" &&
                                            roundmasterEdit?.type === "Date" &&
                                            questionDatas?.date !== ""
                                            ? [
                                              {
                                                label: moment(
                                                  questionDatas?.date
                                                ).format("DD-MM-YYYY"),
                                                value: moment(
                                                  questionDatas?.date
                                                ).format("DD-MM-YYYY"),
                                              },
                                            ]
                                            : row?.extraquestion ==
                                              "Sub Question" &&
                                              roundmasterEdit?.type === "Date" &&
                                              questionDatas?.date === ""
                                              ? [
                                                {
                                                  label: "NODATE",
                                                  value: "NODATE",
                                                },
                                              ]
                                              : row?.extraquestion ==
                                                "Sub Question" &&
                                                roundmasterEdit?.type ===
                                                "Date Range"
                                                ? [
                                                  {
                                                    label: `${moment(
                                                      questionDatas?.fromdate
                                                    ).format(
                                                      "DD-MM-YYYY"
                                                    )} - ${moment(
                                                      questionDatas?.todate
                                                    ).format("DD-MM-YYYY")}`,
                                                    value: `${moment(
                                                      questionDatas?.fromdate
                                                    ).format(
                                                      "DD-MM-YYYY"
                                                    )} - ${moment(
                                                      questionDatas?.todate
                                                    ).format("DD-MM-YYYY")}`,
                                                  },
                                                ]
                                                : row?.extraquestion ===
                                                  "Sub Question 1"
                                                  ? addReqTodoEdit?.flatMap((item) => {
                                                    if (
                                                      item.extraquestion ===
                                                      "Sub Question" &&
                                                      item?.type === "Date Range"
                                                    ) {
                                                      return [
                                                        {
                                                          label: `${moment(
                                                            item.optionslist[0].answer
                                                          ).format(
                                                            "DD-MM-YYYY"
                                                          )} - ${moment(
                                                            item.optionslist[1].answer
                                                          ).format("DD-MM-YYYY")}`,
                                                          value: `${moment(
                                                            item.optionslist[0].answer
                                                          ).format(
                                                            "DD-MM-YYYY"
                                                          )} - ${moment(
                                                            item.optionslist[1].answer
                                                          ).format("DD-MM-YYYY")}`,
                                                        },
                                                      ];
                                                    }

                                                    if (
                                                      item.extraquestion ===
                                                      "Sub Question" &&
                                                      item?.type === "Date"
                                                    ) {
                                                      return [
                                                        {
                                                          label:
                                                            item.optionslist[0]
                                                              .answer === ""
                                                              ? "NODATE"
                                                              : `${moment(
                                                                item.optionslist[0]
                                                                  .answer
                                                              ).format(
                                                                "DD-MM-YYYY"
                                                              )}`,
                                                          value:
                                                            item.optionslist[0]
                                                              .answer === ""
                                                              ? "NODATE"
                                                              : `${moment(
                                                                item.optionslist[0]
                                                                  .answer
                                                              ).format(
                                                                "DD-MM-YYYY"
                                                              )}`,
                                                        },
                                                      ];
                                                    }

                                                    if (
                                                      item.extraquestion ===
                                                      "Sub Question" &&
                                                      item?.type !== "Date" &&
                                                      item?.type !== "Date Range"
                                                    ) {
                                                      return item?.optionslist.map(
                                                        (data) => ({
                                                          label: data.answer,
                                                          value: data.answer,
                                                        })
                                                      );
                                                    }

                                                    return [];
                                                  })
                                                  : addReqTodoEdit?.flatMap((item) => {
                                                    if (
                                                      item.extraquestion ===
                                                      row?.extraquestion?.replace(
                                                        /\d+/,
                                                        (match) => match - 1
                                                      ) &&
                                                      item?.type === "Date Range"
                                                    ) {
                                                      return [
                                                        {
                                                          label: `${moment(
                                                            item.optionslist[0]
                                                              ?.answer
                                                          ).format(
                                                            "DD-MM-YYYY"
                                                          )} - ${moment(
                                                            item.optionslist[1]
                                                              ?.answer
                                                          ).format("DD-MM-YYYY")}`,
                                                          value: `${moment(
                                                            item.optionslist[0]
                                                              ?.answer
                                                          ).format(
                                                            "DD-MM-YYYY"
                                                          )} - ${moment(
                                                            item.optionslist[1]
                                                              ?.answer
                                                          ).format("DD-MM-YYYY")}`,
                                                        },
                                                      ];
                                                    }

                                                    if (
                                                      item.extraquestion ===
                                                      row?.extraquestion.replace(
                                                        /\d+/,
                                                        (match) => match - 1
                                                      ) &&
                                                      item?.type === "Date"
                                                    ) {
                                                      return [
                                                        {
                                                          label:
                                                            item.optionslist[0]
                                                              .answer === ""
                                                              ? "NODATE"
                                                              : `${moment(
                                                                item.optionslist[0]
                                                                  .answer
                                                              ).format(
                                                                "DD-MM-YYYY"
                                                              )}`,
                                                          value:
                                                            item.optionslist[0]
                                                              .answer === ""
                                                              ? "NODATE"
                                                              : `${moment(
                                                                item.optionslist[0]
                                                                  .answer
                                                              ).format(
                                                                "DD-MM-YYYY"
                                                              )}`,
                                                        },
                                                      ];
                                                    }

                                                    if (
                                                      item.extraquestion ===
                                                      row?.extraquestion.replace(
                                                        /\d+/,
                                                        (match) => match - 1
                                                      ) &&
                                                      item?.type !== "Date" &&
                                                      item?.type !== "Date Range"
                                                    ) {
                                                      return item?.optionslist.map(
                                                        (data) => ({
                                                          label: data.answer,
                                                          value: data.answer,
                                                        })
                                                      );
                                                    }

                                                    return [];
                                                  })
                                      }
                                      styles={colourStyles}
                                      value={{
                                        label: row?.options,
                                        value: row?.options,
                                      }}
                                      onChange={(e) => {
                                        handleTodoEditOverallExtraEdit(
                                          index,
                                          "options",
                                          e?.value
                                        );
                                      }}
                                    />
                                    {/* <OutlinedInput
                                      id="test-type"
                                      type="text"
                                      value={row?.options}
                                      readOnly
                                    /> */}
                                  </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                  <FormControl fullWidth size="small">
                                    <Typography>
                                      {`${row.extraquestion === "Sub Question 1"
                                        ? "Sub Question 1"
                                        : row.extraquestion ===
                                          "Sub Question 2"
                                          ? "Sub Question 2"
                                          : row.extraquestion ===
                                            "Please Select Type Questions"
                                            ? "Questions"
                                            : row.extraquestion
                                        }`}
                                    </Typography>

                                    <OutlinedInput
                                      id="component-outlined"
                                      placeholder="Please Enter SubCategory"
                                      value={row?.question}
                                      readOnly
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                  <FormControl fullWidth size="small">
                                    <Typography>
                                      {`${row?.extraquestion} type`}
                                    </Typography>
                                    <OutlinedInput
                                      id="component-outlined"
                                      placeholder="Please Enter SubCategory"
                                      value={row.type}
                                      readOnly
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12}>
                                  {row?.optionslist?.length > 0 && (
                                    <ul type="none">
                                      {row?.optionslist?.map((item, ind) => {
                                        return (
                                          <li key={ind}>
                                            <br />
                                            <Grid sx={{ display: "flex" }}>
                                              <FormControl
                                                fullWidth
                                                size="small"
                                              >
                                                <Typography>
                                                  {" "}
                                                  Answers List{" "}
                                                </Typography>
                                                <OutlinedInput
                                                  id="component-outlined"
                                                  placeholder="Please Enter SubCategory"
                                                  value={item.answer}
                                                  readOnly
                                                />
                                              </FormControl>
                                              &emsp;
                                              {item.answer !== "NOANSWER" &&
                                                row.type === "Text-Numeric" && (
                                                  <>
                                                    <FormControl
                                                      fullWidth
                                                      size="small"
                                                    >
                                                      <Typography>
                                                        Validation
                                                        <b
                                                          style={{
                                                            color: "red",
                                                          }}
                                                        >
                                                          *
                                                        </b>
                                                      </Typography>
                                                      <Selects
                                                        options={[
                                                          {
                                                            label: `Less Than`,
                                                            value: `Less Than`,
                                                          },
                                                          {
                                                            label: `Less Than or Equal to`,
                                                            value: `Less Than or Equal to`,
                                                          },
                                                          {
                                                            label: `Greater Than`,
                                                            value: `Greater Than`,
                                                          },
                                                          {
                                                            label: `Greater Than or Equal to`,
                                                            value: `Greater Than or Equal to`,
                                                          },
                                                          {
                                                            label: `Equal to`,
                                                            value: `Equal to`,
                                                          },
                                                          {
                                                            label: `Between`,
                                                            value: `Between`,
                                                          },
                                                        ]}
                                                        styles={colourStyles}
                                                        value={{
                                                          label:
                                                            backUpCreateEdit[
                                                              ind
                                                            ].validation,
                                                          value:
                                                            backUpCreateEdit[
                                                              ind
                                                            ].validation,
                                                        }}
                                                        onChange={(e) =>
                                                          handleTodoEditOverallExtraOptionsEdit(
                                                            index,
                                                            "validation",
                                                            ind,
                                                            e.value
                                                          )
                                                        }
                                                      />
                                                      {/* <OutlinedInput
                                                        id="test-type"
                                                        type="text"
                                                        value={
                                                          backUpCreateEdit[ind]
                                                            .validation
                                                        }
                                                        readOnly
                                                      /> */}
                                                    </FormControl>
                                                    &emsp;
                                                    {backUpCreateEdit[ind]
                                                      .validation ===
                                                      "Between" && (
                                                        <>
                                                          <FormControl
                                                            fullWidth
                                                            size="small"
                                                          >
                                                            <Typography>
                                                              {" "}
                                                              From{" "}
                                                              <b
                                                                style={{
                                                                  color: "red",
                                                                }}
                                                              >
                                                                *
                                                              </b>
                                                            </Typography>
                                                            <OutlinedInput
                                                              id="component-outlined"
                                                              type="text"
                                                              value={
                                                                backUpCreateEdit[
                                                                  ind
                                                                ].betweenfrom
                                                              }
                                                              onChange={(e) =>
                                                                handleTodoEditOverallExtraOptionsEdit(
                                                                  index,
                                                                  "betweenfrom",
                                                                  ind,
                                                                  e.target.value
                                                                )
                                                              }
                                                            // readOnly
                                                            />
                                                          </FormControl>
                                                          &emsp;
                                                          <FormControl
                                                            fullWidth
                                                            size="small"
                                                          >
                                                            <Typography>
                                                              {" "}
                                                              To{" "}
                                                              <b
                                                                style={{
                                                                  color: "red",
                                                                }}
                                                              >
                                                                *
                                                              </b>
                                                            </Typography>
                                                            <OutlinedInput
                                                              id="component-outlined"
                                                              type="text"
                                                              value={
                                                                backUpCreateEdit[
                                                                  ind
                                                                ].betweento
                                                              }
                                                              onChange={(e) =>
                                                                handleTodoEditOverallExtraOptionsEdit(
                                                                  index,
                                                                  "betweento",
                                                                  ind,
                                                                  e.target.value
                                                                )
                                                              }
                                                            // readOnly
                                                            />
                                                          </FormControl>
                                                        </>
                                                      )}
                                                  </>
                                                )}
                                              &emsp;
                                              <FormControl
                                                fullWidth
                                                size="small"
                                              >
                                                <Typography>
                                                  Status
                                                  <b style={{ color: "red" }}>
                                                    *
                                                  </b>
                                                </Typography>
                                                <Selects
                                                  options={statusOption}
                                                  styles={colourStyles}
                                                  value={{
                                                    label:
                                                      backUpCreateEdit[ind]
                                                        .status,
                                                    value:
                                                      backUpCreateEdit[ind]
                                                        .status,
                                                  }}
                                                  onChange={(e) =>
                                                    handleTodoEditOverallExtraOptionsEdit(
                                                      index,
                                                      "status",
                                                      ind,
                                                      e.value
                                                    )
                                                  }
                                                />
                                              </FormControl>
                                              &emsp;
                                            </Grid>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  )}
                                  <br />
                                  <br />
                                  <br />
                                  <br />
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                  {" "}
                                </Grid>
                              </>
                            ) : (
                              <>
                                <Grid item md={3} xs={12} sm={12}>
                                  <FormControl fullWidth size="small">
                                    <Typography>{`Extra Question - (${row.prequestionview} - ${row.options})`}</Typography>
                                    <OutlinedInput
                                      readOnly
                                      value={row?.extraquestion}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                  <FormControl fullWidth size="small">
                                    <Typography>Answers</Typography>
                                    <OutlinedInput
                                      readOnly
                                      value={row?.options}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                  <FormControl fullWidth size="small">
                                    <Typography>Question</Typography>
                                    <OutlinedInput
                                      readOnly
                                      value={row?.question}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                  <FormControl fullWidth size="small">
                                    <Typography>Type</Typography>
                                    <OutlinedInput readOnly value={row?.type} />
                                  </FormControl>
                                </Grid>
                                {row?.optionslist?.length > 0 && (
                                  <Grid item md={9} xs={12} sm={12}>
                                    <ul type="none">
                                      {row?.optionslist?.map((item, ind) => {
                                        return (
                                          <li key={ind}>
                                            <br />
                                            <Grid sx={{ display: "flex" }}>
                                              <FormControl
                                                fullWidth
                                                size="small"
                                              >
                                                <Typography>
                                                  {" "}
                                                  Answers List{" "}
                                                </Typography>
                                                <OutlinedInput
                                                  id="component-outlined"
                                                  placeholder="Please Enter SubCategory"
                                                  value={item.answer}
                                                  readOnly
                                                />
                                              </FormControl>
                                              &emsp;
                                              {row.type === "Text-Numeric" &&
                                                item.answer !== "NOANSWER" && (
                                                  <>
                                                    <FormControl
                                                      fullWidth
                                                      size="small"
                                                    >
                                                      <Typography>
                                                        {" "}
                                                        Validation{" "}
                                                      </Typography>
                                                      <OutlinedInput
                                                        id="component-outlined"
                                                        placeholder="status"
                                                        value={item.validation}
                                                        readOnly
                                                      />
                                                    </FormControl>
                                                    &emsp;
                                                    {item.validation ===
                                                      "Between" && (
                                                        <FormControl
                                                          fullWidth
                                                          size="small"
                                                        >
                                                          <Typography>
                                                            {" "}
                                                            Between{" "}
                                                          </Typography>
                                                          <OutlinedInput
                                                            id="component-outlined"
                                                            placeholder="status"
                                                            value={`${item.betweenfrom} to ${item.betweento}`}
                                                            readOnly
                                                          />
                                                        </FormControl>
                                                      )}
                                                  </>
                                                )}
                                              &emsp;
                                              <FormControl
                                                fullWidth
                                                size="small"
                                              >
                                                <Typography>
                                                  {" "}
                                                  Status{" "}
                                                </Typography>
                                                <OutlinedInput
                                                  id="component-outlined"
                                                  placeholder="status"
                                                  value={item.status}
                                                  readOnly
                                                />
                                              </FormControl>
                                              &emsp; &emsp;
                                            </Grid>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                  </Grid>
                                )}
                              </>
                            )}
                            <Grid item md={1} xs={12} sm={12}>
                              {isTodoEditPage[index] ? (
                                <Button
                                  variant="contained"
                                  color="success"
                                  sx={{
                                    height: "30px",
                                    minWidth: "30px",
                                    marginTop: "47px",
                                    padding: "6px 10px",
                                  }}
                                  onClick={() => {
                                    if (
                                      addReqTodoEdit?.some(
                                        (data, inde) =>
                                          data?.question === row?.question &&
                                          index !== inde
                                      )
                                    ) {
                                      setPopupContentMalert(
                                        "Already Question Added!"
                                      );
                                      setPopupSeverityMalert("info");
                                      handleClickOpenPopupMalert();
                                    } else if (
                                      addReqTodoEdit?.some(
                                        (data, inde) =>
                                          data?.extraquestion ===
                                          row?.extraquestion &&
                                          index !== inde &&
                                          data?.options === row.options &&
                                          data?.question === row.question
                                      )
                                    ) {
                                      setPopupContentMalert(
                                        "Already These Question Type Added!"
                                      );
                                      setPopupSeverityMalert("info");
                                      handleClickOpenPopupMalert();
                                    } else if (
                                      row.type === "Text-Numeric" &&
                                      backUpCreateEdit?.some(
                                        (item) =>
                                          item.validation === "Between" &&
                                          (item.betweenfrom === "" ||
                                            item.betweento === "")
                                      )
                                    ) {
                                      setPopupContentMalert(
                                        "Please Enter Both From and To Values!"
                                      );
                                      setPopupSeverityMalert("info");
                                      handleClickOpenPopupMalert();
                                    } else if (
                                      row.type === "Text-Numeric" &&
                                      backUpCreateEdit?.some((item) => {
                                        return (
                                          item.validation === "Between" &&
                                          item.answer !== "NOANSWER" &&
                                          item.betweenfrom !== "" &&
                                          Number(item.answer) !==
                                          Number(item.betweenfrom) &&
                                          item.betweento !== "" &&
                                          Number(item.answer) !==
                                          Number(item.betweento)
                                        );
                                      })
                                    ) {
                                      setPopupContentMalert(
                                        "Please Enter Valid Between Values!"
                                      );
                                      setPopupSeverityMalert("info");
                                      handleClickOpenPopupMalert();
                                    } else if (
                                      backUpCreateEdit?.some((item) => {
                                        return (
                                          item.validation === "Between" &&
                                          item.answer !== "NOANSWER" &&
                                          item.betweenfrom !== "" &&
                                          item.betweento !== "" &&
                                          Number(item.betweenfrom) ===
                                          Number(item.betweento)
                                        );
                                      })
                                    ) {
                                      setPopupContentMalert(
                                        "Both From Value and To value can not be same!"
                                      );
                                      setPopupSeverityMalert("info");
                                      handleClickOpenPopupMalert();
                                    } else {
                                      const updatedIsTodoEdit = [
                                        ...isTodoEditPage,
                                      ];
                                      updatedIsTodoEdit[index] = false;
                                      setIsTodoEditPage(updatedIsTodoEdit);
                                      setTodoSubmitEdit(false);

                                      const updateOldvalue = [
                                        ...addReqTodoEdit,
                                      ];
                                      updateOldvalue[index].optionslist =
                                        backUpCreateEdit;
                                      setAddReqTodoEdit(updateOldvalue);
                                    }
                                  }}
                                >
                                  <MdOutlineDone
                                    style={{
                                      fontSize: "17px",
                                      fontWeight: "bold",
                                    }}
                                  />
                                </Button>
                              ) : (
                                <>
                                  {isTodoEditPage?.some(
                                    (item) => item === true
                                  ) ? (
                                    <></>
                                  ) : (
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                      }}
                                      onClick={() => {
                                        const updatedIsTodoEdit = [
                                          ...isTodoEditPage,
                                        ];
                                        updatedIsTodoEdit[index] = true;
                                        setIsTodoEditPage(updatedIsTodoEdit);
                                        setTodoSubmitEdit(true);
                                        // Deep copy of addReqTodo[index].optionslist
                                        const deepCopyOptionsList = JSON.parse(
                                          JSON.stringify(
                                            addReqTodoEdit[index].optionslist
                                          )
                                        );
                                        setBackUpCreateEdit(
                                          deepCopyOptionsList
                                        );
                                      }}
                                    >
                                      <FaEdit />
                                    </Button>
                                  )}
                                </>
                              )}
                            </Grid>
                            <Grid item md={1} xs={12} sm={12}>
                              {isTodoEditPage[index] ? (
                                <Button
                                  variant="contained"
                                  color="error"
                                  type="button"
                                  sx={{
                                    height: "30px",
                                    minWidth: "30px",
                                    marginTop: "47px",
                                    padding: "6px 10px",
                                  }}
                                  onClick={() => {
                                    const updatedIsTodoEdit = [
                                      ...isTodoEditPage,
                                    ];
                                    updatedIsTodoEdit[index] = false;
                                    setIsTodoEditPage(updatedIsTodoEdit);
                                    setTodoSubmitEdit(false);
                                  }}
                                >
                                  <AiOutlineClose />
                                </Button>
                              ) : (
                                <>
                                  {" "}
                                  {index == addReqTodoEdit?.length - 1 && (
                                    <Button
                                      variant="contained"
                                      color="error"
                                      type="button"
                                      sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                      }}
                                      onClick={() => {
                                        deleteTodoEditExtraEdit(index);
                                      }}
                                    // disabled
                                    >
                                      <AiOutlineClose />
                                    </Button>
                                  )}
                                </>
                              )}
                            </Grid>
                            <Grid item md={2}></Grid>
                          </Grid>
                        </li>
                      );
                    })}
                  </ul>
                )}
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
      {isUserRoleCompare?.includes("linterviewstatusallot") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Interview Status Allot List
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
                  {isUserRoleCompare?.includes("excelinterviewstatusallot") && (
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
                  {isUserRoleCompare?.includes("csvinterviewstatusallot") && (
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
                  {isUserRoleCompare?.includes("printinterviewstatusallot") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfinterviewstatusallot") && (
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
                  {isUserRoleCompare?.includes("imageinterviewstatusallot") && (
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
            {isUserRoleCompare?.includes("bdinterviewstatusallot") && (

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
              View Interview Status Allot
            </Typography>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Designation</Typography>
                  <Typography>
                    {roundmasterEdit.designation
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Mode</Typography>
                  <Typography>{roundmasterEdit.mode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Category</Typography>
                  <Typography>{roundmasterEdit.category}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Sub Category</Typography>
                  <Typography>{roundmasterEdit.subcategory}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Inform Reason or Not</Typography>
                  <Typography>{roundmasterEdit?.informreason || ""}</Typography>
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
                  <Typography variant="h6">Type</Typography>
                  <Typography>{roundmasterEdit.type}</Typography>
                </FormControl>
              </Grid>
              {roundmasterEdit.type === "Typing Test" && (
                <>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Speed</Typography>
                      {roundmasterEdit.typingspeedvalidation !== "Between" ? (
                        <Typography>{`${roundmasterEdit.typingspeedvalidation} ${roundmasterEdit.typingspeed} wpm - ${roundmasterEdit.typingspeedstatus}`}</Typography>
                      ) : (
                        <Typography>{`${roundmasterEdit.typingspeedvalidation} ${roundmasterEdit.typingspeedfrom} wpm to ${roundmasterEdit.typingspeedto} wpm - ${roundmasterEdit.typingspeedstatus}`}</Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Accuracy</Typography>
                      {roundmasterEdit.typingaccuracyvalidation !==
                        "Between" ? (
                        <Typography>{`${roundmasterEdit.typingaccuracyvalidation} ${roundmasterEdit.typingaccuracy} % - ${roundmasterEdit.typingaccuracystatus}`}</Typography>
                      ) : (
                        <Typography>{`${roundmasterEdit.typingaccuracyvalidation} ${roundmasterEdit.typingaccuracyfrom} % to ${roundmasterEdit.typingaccuracyto} % - ${roundmasterEdit.typingaccuracystatus}`}</Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Mistakes</Typography>
                      {roundmasterEdit.typingmistakesvalidation !==
                        "Between" ? (
                        <Typography>{`${roundmasterEdit.typingmistakesvalidation} ${roundmasterEdit.typingmistakes} - ${roundmasterEdit.typingmistakesstatus}`}</Typography>
                      ) : (
                        <Typography>{`${roundmasterEdit.typingmistakesvalidation} ${roundmasterEdit.typingmistakesfrom} to ${roundmasterEdit.typingmistakesto} - ${roundmasterEdit.typingmistakesstatus}`}</Typography>
                      )}
                    </FormControl>
                  </Grid>
                </>
              )}
              {roundmasterEdit.type === "Date" && (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Date</Typography>
                      <Typography>
                        {roundmasterEdit?.date === ""
                          ? ""
                          : moment(roundmasterEdit?.date).format("DD-MM-YYYY")}
                      </Typography>
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Status</Typography>
                      <Typography>{roundmasterEdit.datestatus}</Typography>
                    </FormControl>
                  </Grid>
                </>
              )}
              {roundmasterEdit.type === "Date Range" && (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">From Date</Typography>
                      <Typography>
                        {moment(roundmasterEdit?.fromdate).format("DD-MM-YYYY")}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">To Date</Typography>
                      <Typography>
                        {moment(roundmasterEdit?.todate).format("DD-MM-YYYY")}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Status</Typography>
                      <Typography>{roundmasterEdit.datestatus}</Typography>
                    </FormControl>
                  </Grid>
                </>
              )}
              {roundmasterEdit.type !== "Date Range" &&
                roundmasterEdit.type !== "Date" &&
                roundmasterEdit.type !== "Typing Test" && (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Answers</Typography>
                        <Typography>
                          {roundmasterEdit.optionArr
                            ?.map((t, i) => `${i + 1 + ". "}` + t.options)
                            .toString()}
                        </Typography>
                      </FormControl>
                    </Grid>
                    {roundmasterEdit.type === "Text-Numeric" &&
                      roundmasterEdit.optionArr?.some(
                        (item) => item.options !== "NOANSWER"
                      ) && (
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography variant="h6">Validation</Typography>
                            <Typography>
                              {roundmasterEdit.optionArr
                                ?.map(
                                  (t, i) => `${i + 1 + ". "}` + t.validation
                                )
                                .toString()}
                            </Typography>
                          </FormControl>
                        </Grid>
                      )}
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Status</Typography>
                        <Typography>
                          {roundmasterEdit.optionArr
                            ?.map((t, i) => `${i + 1 + ". "}` + t.status)
                            .toString()}
                        </Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Description</Typography>
                        <Typography>
                          {roundmasterEdit.optionArr
                            ?.map((t, i) => `${i + 1 + ". "}` + t.description)
                            .toString()}
                        </Typography>
                      </FormControl>
                    </Grid>
                  </>
                )}
            </Grid>
            <br /> <br /> <br />
            {Number(roundmasterEdit.subquestionlength) > 0 && (
              <>
                {roundmasterEdit?.secondarytodo?.length > 0 &&
                  roundmasterEdit?.secondarytodo?.map((data) => (
                    <>
                      <Grid container spacing={2}>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography variant="h6">Sub Questions </Typography>
                            <Typography>{data?.question}</Typography>
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography variant="h6">Type </Typography>
                            <Typography>{data?.type}</Typography>
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography variant="h6">Answers </Typography>
                            <Typography>
                              {data?.optionslist
                                ?.map((t, i) =>
                                  `${i + 1 + ". "}` + data?.type ===
                                    "Date Range"
                                    ? moment(t.answer).format("DD-MM-YYYY")
                                    : t.answer + " "
                                )
                                .toString()}
                            </Typography>
                          </FormControl>
                        </Grid>
                        {data?.type === "Text-Numeric" &&
                          data?.optionslist?.some(
                            (item) => item.answer !== "NOANSWER"
                          ) && (
                            <Grid item md={3} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Validation{" "}
                                </Typography>
                                <Typography>
                                  {data?.optionslist
                                    ?.map(
                                      (t, i) =>
                                        `${i + 1 + ". "}` + t.validation + " "
                                    )
                                    .toString()}
                                </Typography>
                              </FormControl>
                            </Grid>
                          )}

                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography variant="h6">Status </Typography>
                            <Typography>
                              {data?.optionslist
                                ?.map(
                                  (t, i) => `${i + 1 + ". "}` + t.status + " "
                                )
                                .toString()}
                            </Typography>
                          </FormControl>
                        </Grid>
                        <Grid item md={12} xs={12} sm={12}></Grid>
                      </Grid>
                    </>
                  ))}
              </>
            )}
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
              onClick={() => {
                sendEditRequest();
                handleCloseerrpop();
              }}
              sx={buttonStyles.buttonsubmit}
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
              onClick={(e) => delRoundcheckbox(e)}
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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

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
            If this Question used in any of the pages that may also edits. Are
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
        filename={"Interview Status Allot"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Interview Status Allot Info"
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

export default Roundmaster;
