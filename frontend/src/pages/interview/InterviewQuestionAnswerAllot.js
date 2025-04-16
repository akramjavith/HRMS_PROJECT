import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
  TextareaAutosize,
} from "@mui/material";
import { colourStyles, userStyle } from "../../pageStyle";
import Selects from "react-select";
import { FaPrint, FaFilePdf, FaPlus, FaEdit } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import "jspdf-autotable";
import axios from "axios";
import jsPDF from "jspdf";
import { handleApiError } from "../../components/Errorhandling";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import { AiOutlineClose } from "react-icons/ai";
import StyledDataGrid from "../../components/TableStyle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MdOutlineDone } from "react-icons/md";
import LoadingButton from "@mui/lab/LoadingButton";
import PageHeading from "../../components/PageHeading";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

function InterviewQuestionAnswerAllot() {
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
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((item, index) => {
          return {
            "S.No": index + 1,
            Mode: item.mode,
            Category: item.category,
            Subcategory: item.subcategory,
            Question: item.question,
            "Question Type": item.type,
            Answers: item.options,
            "Sub Questions": item?.extraquestions,
            "Sub Questions Type": item?.subquestiontype,
            "Sub Question Answers": item?.subquestionanswers,
          };
        }),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        roundmasters?.map((item, index) => ({
          "S.No": index + 1,
          Mode: item.mode,
          Category: item.category,
          SubCategory: item.subcategory,
          Question: item.question,
          "Question Type": item.type,
          Answers:
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
          "Sub Questions": item?.secondarytodo
            ?.map((t, i) => `${i + 1 + ". "}` + t?.question)
            .toString(),
          "Sub Questions Type": item?.secondarytodo
            ?.map((t, i) => `${i + 1 + ". "}` + t?.type)
            .toString(),
          "Sub Question Answers": item?.secondarytodo
            .map((todo, index) => {
              return todo?.optionslist
                .map((option, optionIndex) => {
                  const optionChar = String.fromCharCode(65 + optionIndex);
                  return `${index + 1}.${optionChar}. ${option}`;
                })
                .join(", ");
            })
            .toString(),
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  // pdf.....
  const columns = [
    { title: "Mode", field: "mode" },
    { title: "Category", field: "category" },
    { title: "Sub Category", field: "subcategory" },
    { title: "Question", field: "question" },
    { title: "Question Type", field: "type" },
    { title: "Answers", field: "options" },
    { title: "Sub Questions", field: "extraquestions" },
    { title: "Sub Questions Type", field: "subquestiontype" },
    { title: "Sub Question Answers", field: "subquestionanswers" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable?.map((item, index) => {
            return {
              serialNumber: index + 1,
              mode: item.mode,
              category: item.category,
              subcategory: item.subcategory,
              question: item.question,
              type: item.type,
              options: item.options,
              extraquestions: item?.extraquestions,
              subquestiontype: item?.subquestiontype,
              subquestionanswers: item?.subquestionanswers,
            };
          })
        : roundmasters?.map((item, index) => ({
            serialNumber: index + 1,
            mode: item.mode,
            category: item.category,
            subcategory: item.subcategory,
            question: item.question,
            type: item.type,
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
                    return `${index + 1}.${optionChar}. ${option}`;
                  })
                  .join(", ");
              })
              .toString(),
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("Interview Answer Allot.pdf");
  };

  const [interview, setInterview] = useState([]);
  const [interviewQuestion, setInterviewQuestions] = useState([]);
  const [question, setQuestion] = useState("Please Select Question");
  const [yesOrNo, setyesOrNo] = useState("");
  const [subQuestionLength, setSubQuestionLength] = useState();
  const [subQuestionLengthEdit, setSubQuestionLengthEdit] = useState();
  const [yesOrNoEdit, setyesOrNoEdit] = useState("");
  const [type, setType] = useState("Please Select Type");
  const [typeBoolean, setTypeBoolean] = useState(false);
  const [typeBooleanEdit, setTypeBooleanEdit] = useState(false);
  const [status, setStatus] = useState("Please Select Status");
  const [todoSubmit, setTodoSubmit] = useState(false);
  const [todoSubmitEdit, setTodoSubmitEdit] = useState(false);
  const [btnSubmit, setBtnSubmit] = useState(false);
  const [editingIndexcheckEdit, setEditingIndexcheckEdit] = useState(-1);
  const [editingIndexcheck, setEditingIndexcheck] = useState(-1);

  const [createEditBefore, setCreateEditBefore] = useState({});
  const [createEditBeforeEdit, setCreateEditBeforeEdit] = useState({});

  const [extraQuestions, setExtraQuestions] = useState(
    "Please Select Sub Question"
  );
  const [extraOptions, setExtraOptions] = useState("Please Select Answers");
  const [extraQuestAdd, setExtraQuestAdd] = useState(
    "Please Select Sub Question"
  );
  const [extraOptionsType, setExtraOptionsType] = useState("");
  const [extratype, setExtraType] = useState("Please Select Extra Type");
  const [addReqTodo, setAddReqTodo] = useState([]);
  const [isTodoEdit, setIsTodoEdit] = useState(
    Array(addReqTodo.length).fill(false)
  );

  const [extraQuestionsEdit, setExtraQuestionsEdit] = useState(
    "Please Select Sub Question"
  );
  const [extraOptionsEdit, setExtraOptionsEdit] = useState(
    "Please Select Answers"
  );
  const [extraOptionsTypeEdit, setExtraOptionsTypeEdit] = useState("");
  const [extratypeEdit, setExtraTypeEdit] = useState(
    "Please Select Extra Type"
  );
  const [addReqTodoEdit, setAddReqTodoEdit] = useState([]);
  const [isTodoEditPage, setIsTodoEditPage] = useState(
    Array(addReqTodoEdit.length).fill(false)
  );
  const [optionstodoExtraEdit, setOptionstodoExtraEdit] = useState([]);

  const [statusAns, setStatusAns] = useState("Please Select Status");
  const [statusEdit, setStatusEdit] = useState("Please Select Status");
  const [answers, setAnswers] = useState("");
  const [options, setOptions] = useState("");
  const [description, setDescription] = useState("");
  const [optionsEdit, setOptionsEdit] = useState("");
  const [descriptionEdit, setDescriptionEdit] = useState("");
  const [optionstodo, setOptionstodo] = useState([]);
  const [optionstodoExtra, setOptionstodoExtra] = useState([]);
  const [optionstodoEdit, setOptionstodoEdit] = useState([]);
  const [date, setDate] = useState("");

  //typing test

  const [typingTestDetails, setTypingTestDetails] = useState({
    speed: "",
    accuracy: "",
    mistakes: "",
    duration: "00:00",
  });

  const [typingTestHours, setTypingTestHours] = useState("Mins");
  const [typingTestMinutes, setTypingTestMinutes] = useState("Sec");

  const [hrsOption, setHrsOption] = useState([]);
  const [minsOption, setMinsOption] = useState([]);
  //typing test

  const [typingTestDetailsEdit, setTypingTestDetailsEdit] = useState({
    speed: "",
    accuracy: "",
    mistakes: "",
    duration: "00:00",
  });

  const [typingTestHoursEdit, setTypingTestHoursEdit] = useState("Mins");
  const [typingTestMinutesEdit, setTypingTestMinutesEdit] = useState("Sec");

  useEffect(() => {
    generateHrsOptions();
    generateMinsOptions();
  }, []);

  //function to generate hrs
  const generateHrsOptions = () => {
    const hrsOpt = [];
    for (let i = 0; i <= 100; i++) {
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

  const [dateRange, setDateRange] = useState({
    fromdate: "",
    todate: "",
  });
  const [dateSub, setDateSub] = useState("");
  const [dateRangeSub, setDateRangeSub] = useState({
    fromdate: "",
    todate: "",
  });
  const [dateEdit, setDateEdit] = useState("");
  const [dateRangeEdit, setDateRangeEdit] = useState({
    fromdate: "",
    todate: "",
  });
  const [dateSubEdit, setDateSubEdit] = useState("");
  const [dateRangeSubEdit, setDateRangeSubEdit] = useState({
    fromdate: "",
    todate: "",
  });
  useEffect(() => {
    getCategory("Questions");
  }, []);

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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const addTodo = () => {
    const isSubNameMatch = optionstodo.some(
      (item) => item.options.toLowerCase() === options.toLowerCase()
    );
    if ((type === "Radio" || type === "MultipleChoice") && options === "") {
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
    } else if (isSubNameMatch) {
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
        options: options === "" ? "NOANSWER" : options,
        status: status,
        description: description,
      };
      setOptionstodo([...optionstodo, data]);
      setOptions("");
      setStatus("");
      setDescription("");
    }
  };

  const handleTodoEdit = (index, value, newValue) => {
    if (
      value === "options" &&
      optionstodo.some(
        (item) => item?.options.toLowerCase() === newValue?.toLowerCase()
      )
    ) {
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
      return;
    } else {
      const updatedTodos = [...optionstodo];
      if (value === "options") {
        if (type === "Text-Alpha") {
          const textOnly = newValue.replace(/[^a-zA-Z\s;]/g, "");
          updatedTodos[index].options = textOnly;
        } else if (type === "Text-Numeric") {
          const numericOnly = newValue.replace(/[^0-9.;\s]/g, "");
          updatedTodos[index].options = numericOnly;
        } else {
          updatedTodos[index].options = newValue;
        }
      }
      setOptionstodo(updatedTodos);
    }
  };

  const deleteTodo = (index) => {
    const updatedTodos = [...optionstodo];
    updatedTodos.splice(index, 1);
    setOptionstodo(updatedTodos);
    setAddReqTodo([]);
  };

  const addTodoExtra = () => {
    const isSubNameMatch = optionstodoExtra.some(
      (item) => item.toLowerCase() === extraOptionsType.toLowerCase()
    );
    if (
      (extratype === "Radio" || extratype === "MultipleChoice") &&
      extraOptionsType === ""
    ) {
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
    } else if (isSubNameMatch) {
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
      setOptionstodoExtra([
        ...optionstodoExtra,
        extraOptionsType === "" ? "NOANSWER" : extraOptionsType,
      ]);
      setExtraOptionsType("");
    }
  };

  const handleTodoEditExtra = (index, value, newValue) => {
    const isSubNameMatch = optionstodoExtra.some(
      (item) => item.toLowerCase() === newValue.toLowerCase()
    );
    if (isSubNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Already Added! Please Enter Another data"}
          </p>
        </>
      );
      handleClickOpenerr();
      return;
    } else {
      if (
        value === "options" &&
        optionstodo.some(
          (item) => item?.options.toLowerCase() === newValue?.toLowerCase()
        )
      ) {
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
        return;
      }
    }
    const updatedTodos = [...optionstodoExtra];
    if (extratype === "Text-Alpha") {
      const textOnly = newValue.replace(/[^a-zA-Z\s;]/g, "");
      updatedTodos[index] = textOnly;
    } else if (extratype === "Text-Numeric") {
      const numericOnly = newValue.replace(/[^0-9.;\s]/g, "");
      updatedTodos[index] = numericOnly;
    } else {
      updatedTodos[index] = newValue;
    }
    setOptionstodoExtra(updatedTodos);
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
    // Assuming addReqTodo is an array of objects
    const updatedTodos = addReqTodo.map((todo, i) => {
      if (i === index) {
        // Update the specific key-related value
        const updatedTodo = {
          ...todo,
          optionslist: [
            ...todo.optionslist.slice(0, ind),
            todo.type === "Text-Alpha"
              ? newValue.replace(/[^a-zA-Z\s;]/g, "")
              : todo.type === "Text-Numeric"
              ? newValue.replace(/[^0-9.;\s]/g, "")
              : newValue,
            ...todo.optionslist.slice(ind + 1),
          ],
        };
        return updatedTodo;
      }
      return todo;
    });

    setAddReqTodo(updatedTodos);
  };

  const deleteTodoExtra = (index) => {
    const updatedTodos = [...optionstodoExtra];
    updatedTodos.splice(index, 1);
    setOptionstodoExtra(updatedTodos);
  };

  const handleAddTodo = () => {
    const checkExtraQuestions = addReqTodo?.some(
      (data) => data?.question === extraQuestAdd
    );

    if (checkExtraQuestions) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Already Question Added"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (optionstodoExtra?.some((item) => item === "")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Fill All the Answers"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (extratype === "MultipleChoice" || extratype === "Radio") &&
      optionstodoExtra.length < 2
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Create More Than One Answers"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (extratype === "TextBox" ||
        extratype === "Text-Alpha" ||
        extratype === "Text-Numeric") &&
      optionstodoExtra.length < 1
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Create Atleast One Answer"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      extratype === "Date Range" &&
      (dateRangeSub?.fromdate === "" || dateRangeSub?.todate === "")
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Both From Date and To Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      const addRequired = {
        extraquestion: extraQuestions,
        options: extraOptions,
        question: extraQuestAdd,
        type: extratype,
        optionslist:
          extratype === "Date"
            ? [dateSub]
            : extratype === "Date Range"
            ? [dateRangeSub?.fromdate, dateRangeSub?.todate]
            : optionstodoExtra,
      };
      setAddReqTodo((prevTodos) => [...prevTodos, { ...addRequired }]);
      setIsTodoEdit(Array(addReqTodo.length).fill(false));
      setExtraQuestions("Please Select Sub Question");
      setExtraOptions("Please Select Answers");
      setExtraQuestAdd("Please Select Sub Question");
      setExtraType("Please Select Extra Type");
      setOptionstodoExtra([]);
      setDateSub("");
      setDateRangeSub({
        fromdate: "",
        todate: "",
      });
    }
  };

  //Edit Todo Page Functionality
  const addTodoExtraEdit = () => {
    const isSubNameMatch = optionstodoExtraEdit.some(
      (item) => item.toLowerCase() === extraOptionsTypeEdit.toLowerCase()
    );
    if (
      (extratypeEdit === "Radio" || extratypeEdit === "MultipleChoice") &&
      extraOptionsTypeEdit === ""
    ) {
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
    } else if (isSubNameMatch) {
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
      setOptionstodoExtraEdit([
        ...optionstodoExtraEdit,
        extraOptionsTypeEdit === "" ? "NOANSWER" : extraOptionsTypeEdit,
      ]);
      setExtraOptionsTypeEdit("");
    }
  };

  const handleTodoEditExtraEdit = (index, value, newValue) => {
    const isSubNameMatch = optionstodoExtraEdit.some(
      (item) => item.toLowerCase() === newValue.toLowerCase()
    );
    if (isSubNameMatch) {
      // Handle duplicate case, show an error message, and return early
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Already Added! Please Enter Another data"}
          </p>
        </>
      );
      handleClickOpenerr();
      return;
    } else {
      if (
        value === "options" &&
        optionstodoEdit.some(
          (item) => item?.options.toLowerCase() === newValue?.toLowerCase()
        )
      ) {
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
        return;
      }
    }
    const updatedTodos = [...optionstodoExtraEdit];
    if (extratypeEdit === "Text-Alpha") {
      const textOnly = newValue.replace(/[^a-zA-Z\s;]/g, "");
      updatedTodos[index] = textOnly;
    } else if (extratypeEdit === "Text-Numeric") {
      const numericOnly = newValue.replace(/[^0-9.;\s]/g, "");
      updatedTodos[index] = numericOnly;
    } else {
      updatedTodos[index] = newValue;
    }

    setOptionstodoExtraEdit(updatedTodos);
  };

  const deleteTodoExtraTodoEdit = (index) => {
    const updatedTodos = [...optionstodoExtraEdit];
    updatedTodos.splice(index, 1);
    setOptionstodoExtraEdit(updatedTodos);
  };

  const deleteTodoEditExtraOverallEdit = (index) => {
    const updatedTodos = [...addReqTodoEdit];
    updatedTodos.splice(index, 1);
    setAddReqTodoEdit(updatedTodos);
    setTodoSubmitEdit(false);
  };

  const handleAddTodoEdit = () => {
    const checkExtraQuestions = addReqTodoEdit?.some(
      (data) => data?.question === extraQuestionsEdit
    );

    if (checkExtraQuestions) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Already Question Added"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (extratypeEdit === "MultipleChoice" || extratypeEdit === "Radio") &&
      optionstodoExtraEdit.length < 2
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Create More Than One Answers"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (extratypeEdit === "TextBox" ||
        extratypeEdit === "Text-Alpha" ||
        extratypeEdit === "Text-Numeric") &&
      optionstodoExtraEdit.length < 1
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Create Atleast One Answer"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      extratypeEdit === "Date Range" &&
      (dateRangeSubEdit?.fromdate === "" || dateRangeSubEdit?.todate === "")
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Both From Date and To Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (optionstodoExtraEdit?.some((item) => item === "")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Fill All the Answers"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      const addRequired = {
        extraquestion: extraQuestionsEdit,
        options: extraOptionsEdit,
        question: extraQuestionsEdit,
        type: extratypeEdit,
        optionslist:
          extratypeEdit === "Date"
            ? [dateSubEdit]
            : extratypeEdit === "Date Range"
            ? [dateRangeSubEdit?.fromdate, dateRangeSubEdit?.todate]
            : optionstodoExtraEdit,
      };
      setAddReqTodoEdit((prevTodos) => [...prevTodos, { ...addRequired }]);
      setIsTodoEditPage(Array(addReqTodoEdit.length).fill(false));
      setExtraQuestionsEdit("Please Select Sub Question");
      setExtraOptionsEdit("Please Select Answers");
      setExtraTypeEdit("Please Select Extra Type");
      setOptionstodoExtraEdit([]);
      setDateSubEdit("");
      setDateRangeSubEdit({
        fromdate: "",
        todate: "",
      });
    }
  };
  const handleTodoEditOverallExtraOptionsEdit = (index, key, ind, newValue) => {
    // Assuming addReqTodo is an array of objects

    const updatedTodos = addReqTodoEdit.map((todo, i) => {
      if (i === index) {
        // Update the specific key-related value
        const updatedTodo = {
          ...todo,
          optionslist: [
            ...todo.optionslist.slice(0, ind),
            todo.type === "Text-Alpha"
              ? newValue.replace(/[^a-zA-Z\s;]/g, "")
              : todo.type === "Text-Numeric"
              ? newValue.replace(/[^0-9.;\s]/g, "")
              : newValue,
            ...todo.optionslist.slice(ind + 1),
          ],
        };
        return updatedTodo;
      }
      return todo;
    });

    setAddReqTodoEdit(updatedTodos);
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
    const isSubNameMatch = optionstodoEdit.some(
      (item) => item.options.toLowerCase() === optionsEdit.toLowerCase()
    );

    if (
      (roundmasterEdit?.type === "Radio" ||
        roundmasterEdit?.type === "MultipleChoice") &&
      optionsEdit === ""
    ) {
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
    } else if (isSubNameMatch) {
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
        options: optionsEdit === "" ? "NOANSWER" : optionsEdit,
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
    const isSubNameMatch = optionstodoEdit.some(
      (item) => item.options.toLowerCase() === optionsEdit.toLowerCase()
    );
    if (isSubNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Already Added! Please Enter Another data"}
          </p>
        </>
      );
      handleClickOpenerr();
      return;
    } else {
      if (
        value === "options" &&
        optionstodoEdit.some(
          (item) => item?.options.toLowerCase() === newValue?.toLowerCase()
        )
      ) {
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
        return;
      }
    }
    const updatedTodos = [...optionstodoEdit];
    if (value === "options") {
      if (roundmasterEdit?.type === "Text-Alpha") {
        const textOnly = newValue.replace(/[^a-zA-Z\s;]/g, "");
        updatedTodos[index].options = textOnly;
      } else if (roundmasterEdit?.type === "Text-Numeric") {
        const numericOnly = newValue.replace(/[^0-9.;\s]/g, "");
        updatedTodos[index].options = numericOnly;
      } else {
        updatedTodos[index].options = newValue;
      }
    }
    setOptionstodoEdit(updatedTodos);
    setAddReqTodoEdit([]);
  };

  const deleteTodoEdit = (index) => {
    const updatedTodos = [...optionstodoEdit];
    updatedTodos.splice(index, 1);
    setOptionstodoEdit(updatedTodos);
    setAddReqTodoEdit([]);
  };

  const deleteTodoEditExtra = (index) => {
    const updatedTodos = [...addReqTodo];

    if (updatedTodos[index]?.extraquestion === "Sub Question") {
      setAddReqTodo([]);
    } else if (updatedTodos[index]?.extraquestion === "Sub Question 1") {
      setAddReqTodo([]);
    } else {
      updatedTodos.splice(index, 1);
      setAddReqTodo(updatedTodos);
    }
  };

  const [roundmasterEdit, setRoundmasterEdit] = useState([]);
  const [roundmasters, setRoundmasters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allRoundmasteredit, setAllRoundmasteredit] = useState([]);

  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName } =
    useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [roundmasterCheck, setRoundmastercheck] = useState(false);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Interview Answer Allot.png");
        });
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
    setBtnSubmit(false);
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

  const fetchInterviewquestions = async () => {
    setPageName(!pageName);
    try {
      let res_priority = await axios.get(SERVICE.INTERVIEWQUESTION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const priorityall = res_priority?.data?.interviewquestions?.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setInterview(priorityall);
      setInterviewQuestions(res_priority?.data?.interviewquestions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchInterviewquestions();
  }, []);

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    question: true,
    type: true,
    options: true,
    extraquestions: true,
    subquestionanswers: true,
    subquestiontype: true,
    mode: true,
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
      let res = await axios.get(`${SERVICE.SINGLE_INT_FORM_ALLOT}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteRound(res?.data?.sinterviewformdesign);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Alert delete popup
  let Roundsid = deleteRound?._id;
  const delRound = async (e) => {
    setPageName(!pageName);
    try {
      if (Roundsid) {
        let overallcheck = await axios.post(
          `${SERVICE.INTERVIEWANSWERALLOT_OVERALLDELETE}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            category: deleteRound?.category,
            subcategory: deleteRound?.subcategory,
            question: deleteRound?.question,
            mode: deleteRound?.mode,
          }
        );
        if (overallcheck?.data?.mayidelete) {
          await axios.delete(`${SERVICE.SINGLE_INT_FORM_ALLOT}/${e}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
          await fetchRoundmaster();
          handleCloseMod();
          setSelectedRows([]);
          setPage(1);
          setShowAlert(
            <>
              <CheckCircleOutlineIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                Deleted Successfully
              </p>
            </>
          );
          handleClickOpenerr();
        }
      }
    } catch (err) {
      handleCloseMod();
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const overallBulkdelete = async (ids) => {
    setPageName(!pageName);
    try {
      let overallcheck = await axios.post(
        `${SERVICE.INTERVIEWANSWERALLOT_OVERALLBULKDELETE}`,
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const delRoundcheckbox = async () => {
    setPageName(!pageName);
    try {
      if (selectedRows?.length > 0) {
        const deletePromises = selectedRows?.map((item) => {
          return axios.delete(`${SERVICE.SINGLE_INT_FORM_ALLOT}/${item}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
        });

        // Wait for all delete requests to complete
        await Promise.all(deletePromises);

        await fetchRoundmaster();
        setShowAlert(
          <>
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              Deleted Successfully
            </p>
          </>
        );
        handleClickOpenerr();
      }
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    try {
      let subprojectscreate = await axios.post(SERVICE.CREATE_INT_FORM_ALLOT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        category: String(catAndSub?.category),
        subcategory: String(catAndSub?.subcategory),
        question: question,
        type: type,
        mode: mode,

        typingspeed: String(
          type === "Typing Test" ? typingTestDetails?.speed : ""
        ),
        typingaccuracy: String(
          type === "Typing Test" ? typingTestDetails?.accuracy : ""
        ),
        typingmistakes: String(
          type === "Typing Test" ? typingTestDetails?.mistakes : ""
        ),
        typingduration: String(
          type === "Typing Test" ? typingTestDetails?.duration : ""
        ),

        optionArr: optionstodo,
        answers: answers,
        statusAns: statusAns,
        secondarytodo: addReqTodo,
        status: status,
        yesorno: String(yesOrNo),
        subquestionlength: String(subQuestionLength),
        date: String(date),
        fromdate: String(dateRange?.fromdate),
        todate: String(dateRange?.todate),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchRoundmaster();
      setQuestion("Please Select Question");
      setType("Please Select Type");
      setTypeBoolean(false);
      setyesOrNo("No");
      setAnswers("");
      setOptions("");
      setDescription("");
      setOptionstodo([]);
      setAddReqTodo([]);
      setCatAndSub({
        category: "Please Select Category",
        subcategory: "Please Select Sub Category",
      });
      setTypingTestDetails({
        speed: "",
        accuracy: "",
        mistakes: "",
        duration: "00:00",
      });

      setTypingTestHours("Mins");
      setTypingTestMinutes("Sec");

      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Added Successfully
          </p>
        </>
      );
      handleClickOpenerr();
      setBtnSubmit(false);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //submit option for saving
  const handleSubmit = (e) => {
    setBtnSubmit(true);
    e.preventDefault();

    const isQuestionMatch = roundmasters?.some(
      (item) =>
        item.question?.toLowerCase() === question?.toLowerCase() &&
        item.category === catAndSub?.category &&
        item.mode === mode &&
        item.subcategory === catAndSub?.subcategory
    );
    if (isQuestionMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Question already exist!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (catAndSub?.category === "Please Select Category") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (catAndSub?.subcategory === "Please Select Sub Category") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Sub Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (question === "Please Select Question") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Question"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (type === "Please Select Type") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      type === "Typing Test" &&
      (typingTestDetails?.speed === "" || typingTestDetails?.speed === "0")
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Typing Speed"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      type === "Typing Test" &&
      (typingTestDetails?.accuracy === "" ||
        typingTestDetails?.accuracy === "0")
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Typing Accuracy"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (type === "Typing Test" && typingTestDetails?.mistakes === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter No.Of Mistakes Acceptable"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      type === "Typing Test" &&
      (typingTestDetails.duration === "00:00" ||
        typingTestDetails.duration.includes("Sec") ||
        typingTestDetails.duration.includes("Mins"))
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Typing Test Duration for this Question"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      type === "Date Range" &&
      (dateRange?.fromdate === "" || dateRange?.todate === "")
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Choose both From Date and To Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (type === "MultipleChoice" || type === "Radio") &&
      optionstodo.length < 2
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Create More Than One Answers"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (type === "TextBox" ||
        type === "Text-Alpha" ||
        type === "Text-Numeric") &&
      optionstodo.length < 1
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Create Atleast One Answer"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (type === "Radio" ||
        type === "MultipleChoice" ||
        type === "TextBox" ||
        type === "Text-Alpha" ||
        type === "Text-Numeric") &&
      optionstodo.some((item) => item.options.trim() === "")
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Fill All the Answers"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (todoSubmit) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Add the Todo and Submit!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      addReqTodo?.length != subQuestionLength &&
      type !== "Typing Test"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Give Answers for all the Sub Questions"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setMode("Questions");
    setQuestion("Please Select Question");
    setType("Please Select Type");
    setTypeBoolean(false);
    setAnswers("");
    setOptions("");
    setyesOrNo("");
    setDescription("");
    setOptionstodo([]);
    setAddReqTodo([]);
    setExtraQuestions("Please Select Sub Question");
    setExtraOptions("Please Select Answers");
    setExtraQuestAdd("Please Select Sub Question");
    setExtraOptionsType("");
    setExtraType("Please Select Extra Type");
    setDate("");
    setDateRange({
      fromdate: "",
      todate: "",
    });

    setCatAndSub({
      category: "Please Select Category",
      subcategory: "Please Select Sub Category",
    });

    setTypingTestDetails({
      speed: "",
      accuracy: "",
      mistakes: "",
      duration: "00:00",
    });

    setTypingTestHours("Mins");
    setTypingTestMinutes("Sec");

    setShowAlert(
      <>
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          Cleared Successfully
        </p>
      </>
    );
    handleClickOpenerr();
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
    setDateRangeSubEdit({
      fromddate: "",
      todate: "",
    });
    setDateSubEdit("");
    setExtraQuestionsEdit("Please Select Sub Questions");
    setExtraOptionsEdit("Please Select Answers");
    setExtraTypeEdit("Please Select Extra Type");
    setOptionstodoExtraEdit([]);

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

  const [oldDatas, setOldDatas] = useState({
    speed: "",
    accuracy: "",
    mistakes: "",
    duration: "",
  });
  //get single row to edit....
  const getCode = async (e, name) => {
    setPageName(!pageName);
    try {
      const [res, resLength] = await Promise.all([
        axios.get(`${SERVICE.SINGLE_INT_FORM_ALLOT}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(`${SERVICE.INTERVIEWQUESTION}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      let filteredquest = resLength?.data?.interviewquestions?.filter(
        (item) => item?.name === res?.data?.sinterviewformdesign?.question
      );
      setOldDatas({
        speed: res?.data?.sinterviewformdesign?.typingspeed,
        accuracy: res?.data?.sinterviewformdesign?.typingaccuracy,
        mistakes: res?.data?.sinterviewformdesign?.typingmistakes,
        duration: res?.data?.sinterviewformdesign?.typingduration,
      });

      setModeEdit(res?.data?.sinterviewformdesign?.mode);
      getCategoryEdit(res?.data?.sinterviewformdesign?.mode);

      setRoundmasterEdit(res?.data?.sinterviewformdesign);
      setTypeBooleanEdit(
        res?.data?.sinterviewformdesign?.type === "Typing Test" ? true : false
      );
      setyesOrNoEdit(res?.data?.sinterviewformdesign?.yesorno);
      setSubQuestionLengthEdit(filteredquest[0]?.subquestions?.length);
      setOptionstodoEdit(res?.data?.sinterviewformdesign?.optionArr);
      setAddReqTodoEdit(res?.data?.sinterviewformdesign?.secondarytodo);
      setDateEdit(res?.data?.sinterviewformdesign?.date);
      setDateRangeEdit({
        fromdate: res?.data?.sinterviewformdesign?.fromdate,
        todate: res?.data?.sinterviewformdesign?.todate,
      });

      setTypingTestDetailsEdit({
        speed: res?.data?.sinterviewformdesign?.typingspeed,
        accuracy: res?.data?.sinterviewformdesign?.typingaccuracy,
        mistakes: res?.data?.sinterviewformdesign?.typingmistakes,
        duration: res?.data?.sinterviewformdesign?.typingduration,
      });
      if (res?.data?.sinterviewformdesign?.type === "Typing Test") {
        const [hours, minutes] =
          res?.data?.sinterviewformdesign?.typingduration?.split(":");
        setTypingTestHoursEdit(hours);
        setTypingTestMinutesEdit(minutes);
      }

      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_INT_FORM_ALLOT}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRoundmasterEdit(res?.data?.sinterviewformdesign);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_INT_FORM_ALLOT}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRoundmasterEdit(res?.data?.sinterviewformdesign);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
        `${SERVICE.SINGLE_INT_FORM_ALLOT}/${subprojectsid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          category: roundmasterEdit.category,
          subcategory: roundmasterEdit.subcategory,
          question: roundmasterEdit.question,
          type: roundmasterEdit.type,
          mode: modeEdit,
          typingspeed: String(
            roundmasterEdit.type === "Typing Test"
              ? typingTestDetailsEdit?.speed
              : ""
          ),
          typingaccuracy: String(
            roundmasterEdit.type === "Typing Test"
              ? typingTestDetailsEdit?.accuracy
              : ""
          ),
          typingmistakes: String(
            roundmasterEdit.type === "Typing Test"
              ? typingTestDetailsEdit?.mistakes
              : ""
          ),
          typingduration: String(
            roundmasterEdit.type === "Typing Test"
              ? typingTestDetailsEdit?.duration
              : ""
          ),

          status: roundmasterEdit.status,
          statusAns: roundmasterEdit.statusAns,
          optionArr: optionstodoEdit,
          secondarytodo: addReqTodoEdit,
          answers: roundmasterEdit.answers,
          yesorno: String(yesOrNoEdit),
          subquestionlength: String(subQuestionLengthEdit),
          date: String(dateEdit),
          fromdate: String(dateRangeEdit?.fromdate),
          todate: String(dateRangeEdit?.todate),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      const isChanged = Object.keys(typingTestDetailsEdit).some(
        (key) => typingTestDetailsEdit[key] !== oldDatas[key]
      );

      if (isChanged && modeEdit === "Typing Test") {
        let res = await axios.put(`${SERVICE.INTERVIEWANSWERALLOT_OVERALL}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          category: roundmasterEdit.category,
          subcategory: roundmasterEdit.subcategory,
          question: roundmasterEdit.question,
          type: roundmasterEdit.type,
          mode: modeEdit,
          speed: String(typingTestDetailsEdit?.speed),
          accuracy: String(typingTestDetailsEdit?.accuracy),
          mistakes: String(typingTestDetailsEdit?.mistakes),
          duration: String(typingTestDetailsEdit?.duration),
        });
      }
      setyesOrNoEdit("No");
      setOptionsEdit("");
      await fetchRoundmaster();
      setOptionstodoEdit([]);
      handleCloseModEdit();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Updated Successfully
          </p>
        </>
      );
      handleClickOpenerr();
      handleCloseOverallEditPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
    const isQuestionMatch = allRoundmasteredit?.some(
      (item) =>
        item.question?.toLowerCase() ===
          roundmasterEdit?.question?.toLowerCase() &&
        item?.category === roundmasterEdit?.category &&
        item.mode === modeEdit &&
        item?.subcategory === roundmasterEdit?.subcategory
    );
    if (isQuestionMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Question already exist!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (!modeEdit) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Mode!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      roundmasterEdit?.category === "Please Select Category" ||
      roundmasterEdit?.category === "" ||
      roundmasterEdit?.category === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      roundmasterEdit?.subcategory === "Please Select Sub Category" ||
      roundmasterEdit?.subcategory === "" ||
      roundmasterEdit?.subcategory === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Sub Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (roundmasterEdit?.question === "Please Select Question") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Question"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (roundmasterEdit?.type === "Please Select Type") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      roundmasterEdit?.type === "Typing Test" &&
      (typingTestDetailsEdit?.speed === "" ||
        typingTestDetailsEdit?.speed === "0")
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Typing Speed"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      roundmasterEdit?.type === "Typing Test" &&
      (typingTestDetailsEdit?.accuracy === "" ||
        typingTestDetailsEdit?.accuracy === "0")
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Typing Accuracy"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      roundmasterEdit?.type === "Typing Test" &&
      typingTestDetailsEdit?.mistakes === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter No.Of Mistakes Acceptable"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      roundmasterEdit?.type === "Typing Test" &&
      (typingTestDetailsEdit.duration === "00:00" ||
        typingTestDetailsEdit.duration.includes("Sec") ||
        typingTestDetailsEdit.duration.includes("Mins"))
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Typing Test Duration for this Question"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      roundmasterEdit?.type === "Date Range" &&
      (dateRangeEdit?.fromdate === "" || dateRangeEdit?.todate === "")
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Choose both From Date and To Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (roundmasterEdit?.type === "MultipleChoice" ||
        roundmasterEdit?.type === "Radio") &&
      optionstodoEdit.length < 2
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Create More Than One Answers"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (roundmasterEdit?.type === "TextBox" ||
        roundmasterEdit?.type === "Text-Alpha" ||
        roundmasterEdit?.type === "Text-Numeric") &&
      optionstodoEdit.length < 1
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Create Atleast One Answer"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (roundmasterEdit?.type === "Radio" ||
        roundmasterEdit?.type === "MultipleChoice" ||
        roundmasterEdit?.type === "TextBox" ||
        roundmasterEdit?.type === "Text-Alpha" ||
        roundmasterEdit?.type === "Text-Numeric") &&
      optionstodoEdit.some((item) => item.options.trim() === "")
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Fill All the Answers"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (todoSubmitEdit) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Add the Todo and Submit!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      addReqTodoEdit?.length < subQuestionLengthEdit &&
      roundmasterEdit?.type !== "Typing Test"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Give Answers for all the Sub Questions"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      const isChanged = Object.keys(typingTestDetailsEdit).some(
        (key) => typingTestDetailsEdit[key] !== oldDatas[key]
      );

      if (isChanged && modeEdit === "Typing Test") {
        handleOpenOverallEditPopup();
        handleCloseModEdit();
      } else {
        sendEditRequest();
      }
    }
  };

  //get all Sub vendormasters.
  const fetchRoundmaster = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.GET_INT_FORM_ALLOT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRoundmastercheck(true);
      setRoundmasters(res_vendor?.data?.interviewformdesign);
    } catch (err) {
      setRoundmastercheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all Sub vendormasters.
  const fetchRoundmasterAll = async (e) => {
    setPageName(!pageName);
    try {
      let res_meet = await axios.get(SERVICE.GET_INT_FORM_ALLOT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllRoundmasteredit(
        res_meet?.data?.interviewformdesign.filter((item) => item._id !== e)
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Excel
  const fileName = "Interview Answer Allot";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Interview Answer Allot",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchRoundmaster();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = roundmasters?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      options: item.optionArr
        ?.map((t, i) => `${i + 1 + ". "}` + t.options)
        .toString(),
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
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
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllChecked) {
              setSelectedRows([]);
            } else {
              const allRowIds = rowDataTable.map((row) => row.id);
              setSelectedRows(allRowIds);
            }
            setSelectAllChecked(!selectAllChecked);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRows.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(
              updatedSelectedRows.length === filteredData.length
            );
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
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
      field: "mode",
      headerName: "Mode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.mode,
      headerClassName: "bold-header",
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
      width: 250,
      hide: !columnVisibility.question,
      headerClassName: "bold-header",
    },
    {
      field: "type",
      headerName: "Question Type",
      flex: 0,
      width: 150,
      hide: !columnVisibility.type,
      headerClassName: "bold-header",
    },
    {
      field: "options",
      headerName: "Answers",
      flex: 0,
      width: 250,
      hide: !columnVisibility.options,
      headerClassName: "bold-header",
    },

    {
      field: "extraquestions",
      headerName: "Sub Questions",
      flex: 0,
      width: 250,
      hide: !columnVisibility.extraquestions,
      headerClassName: "bold-header",
    },
    {
      field: "subquestiontype",
      headerName: "Sub Questions Type",
      flex: 0,
      width: 150,
      hide: !columnVisibility.subquestiontype,
      headerClassName: "bold-header",
    },
    {
      field: "subquestionanswers",
      headerName: "Sub Questions Answers",
      flex: 0,
      width: 250,
      hide: !columnVisibility.subquestionanswers,
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
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("einterviewanswerallot") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id, params.row.name);
                fetchRoundmasterAll(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dinterviewanswerallot") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vinterviewanswerallot") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenview();
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iinterviewanswerallot") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData?.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      question: item.question,
      category: item.category,
      mode: item.mode,
      subcategory: item.subcategory,
      type: item.type,
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
              return `${index + 1}.${optionChar}. ${option}`;
            })
            .join(", ");
        })
        .toString(),
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
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
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
      <Headtitle title={"INTERVIEW ANSWER ALLOT"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Manage Interview Answer Allot"
        modulename="Interview"
        submodulename="Interview Setup"
        mainpagename="Interview Answer Allot"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("ainterviewanswerallot") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Manage Interview Answer Allot
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
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
                        setQuestion("Please Select Question");
                        setType("Please Select Type");
                        setTypeBoolean(false);
                        setAnswers("");
                        setOptions("");
                        setDescription("");
                        setOptionstodo([]);
                        setAddReqTodo([]);
                        setExtraQuestions("Please Select Sub Question");
                        setExtraOptions("Please Select Answers");
                        setExtraQuestAdd("Please Select Sub Question");
                        setExtraOptionsType("");
                        setExtraType("Please Select Extra Type");
                        setTodoSubmit(false);
                        setCatAndSub({
                          ...catAndSub,
                          category: "Please Select Category",
                          subcategory: "Please Select Sub Category",
                        });
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
                        setQuestion("Please Select Question");
                        setType("Please Select Type");
                        setTypeBoolean(false);
                        setAnswers("");
                        setOptions("");
                        setDescription("");
                        setOptionstodo([]);
                        setAddReqTodo([]);
                        setExtraQuestions("Please Select Sub Question");
                        setExtraOptions("Please Select Answers");
                        setExtraQuestAdd("Please Select Sub Question");
                        setExtraOptionsType("");
                        setExtraType("Please Select Extra Type");
                        setTodoSubmit(false);
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
                        setQuestion("Please Select Question");
                        setType("Please Select Type");
                        setTypeBoolean(false);
                        setAnswers("");
                        setOptions("");
                        setDescription("");
                        setOptionstodo([]);
                        setAddReqTodo([]);
                        setExtraQuestions("Please Select Sub Question");
                        setExtraOptions("Please Select Answers");
                        setExtraQuestAdd("Please Select Sub Question");
                        setExtraOptionsType("");
                        setExtraType("Please Select Extra Type");
                        setTodoSubmit(false);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Interview question <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={interview?.filter(
                        (item) =>
                          item.category === catAndSub.category &&
                          item.subcategory === catAndSub.subcategory &&
                          (mode === "Typing Test"
                            ? item.typingtest
                            : !item.typingtest)
                      )}
                      styles={colourStyles}
                      value={{ label: question, value: question }}
                      onChange={(e) => {
                        setQuestion(e.value);
                        setyesOrNo(e.doyouhaveextraquestion);
                        setSubQuestionLength(e.subquestions?.length);
                        setType(
                          e?.typingtest ? "Typing Test" : "Please Select Type"
                        );
                        setTypeBoolean(e?.typingtest ? true : false);
                        setAnswers("");
                        setOptions("");
                        setDescription("");
                        setOptionstodo([]);
                        setAddReqTodo([]);
                        setExtraQuestions("Please Select Sub Question");
                        setExtraOptions("Please Select Answers");
                        setExtraQuestAdd("Please Select Sub Question");
                        setExtraOptionsType("");
                        setExtraType("Please Select Extra Type");
                        setTodoSubmit(false);
                        setTypingTestDetails({
                          speed: "",
                          accuracy: "",
                          mistakes: "",
                          duration: "00:00",
                        });
                        setTypingTestHours("Mins");
                        setTypingTestMinutes("Sec");
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    {typeBoolean ? (
                      <OutlinedInput
                        id="test-type"
                        type="text"
                        value={type}
                        readOnly
                      />
                    ) : (
                      <Selects
                        maxMenuHeight={300}
                        options={[
                          { label: "Radio", value: "Radio" },
                          { label: "TextBox", value: "TextBox" },
                          { label: "Text-Alpha", value: "Text-Alpha" },
                          { label: "Text-Numeric", value: "Text-Numeric" },
                          { label: "MultipleChoice", value: "MultipleChoice" },
                          { label: "Date", value: "Date" },
                          { label: "Date Range", value: "Date Range" },
                          { label: "Yes/No", value: "Yes/No" },
                          {
                            label: "Correct/In Correct",
                            value: "Correct/In Correct",
                          },
                        ]}
                        // styles={colourStyles}
                        value={{ label: type, value: type }}
                        onChange={(e) => {
                          setType(e.value);
                          setStatusAns("Please Select Status");
                          setAnswers("");
                          setOptionstodo([]);
                          setTodoSubmit(false);
                          setDate("");
                          setOptions("");
                          setDateRange({
                            fromdate: "",
                            todate: "",
                          });
                          setTypingTestDetails({
                            speed: "",
                            accuracy: "",
                            mistakes: "",
                            duration: "00:00",
                          });

                          setTypingTestHours("Mins");
                          setTypingTestMinutes("Sec");
                        }}
                      />
                    )}
                  </FormControl>
                </Grid>

                {type === "Date" && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Date</Typography>
                      <OutlinedInput
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => {
                          setDate(e.target.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}

                {type === "Typing Test" && (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Speed<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          placeholder="Please Enter Speed in WPM"
                          type="text"
                          value={typingTestDetails?.speed}
                          onChange={(e) => {
                            const numericOnly = e.target.value.replace(
                              /[^0-9.;\s]/g,
                              ""
                            );
                            setTypingTestDetails({
                              ...typingTestDetails,
                              speed: numericOnly,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Accuracy<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          placeholder="Please Enter Accuracy in Percentage"
                          type="text"
                          value={typingTestDetails?.accuracy}
                          onChange={(e) => {
                            const numericOnly = e.target.value.replace(
                              /[^0-9.;\s]/g,
                              ""
                            );
                            setTypingTestDetails({
                              ...typingTestDetails,
                              accuracy: numericOnly,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          No Of Mistakes<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          placeholder="Please Enter No.Of Mistakes Acceptable"
                          type="text"
                          value={typingTestDetails?.mistakes}
                          onChange={(e) => {
                            const numericOnly = e.target.value.replace(
                              /[^0-9.;\s]/g,
                              ""
                            );
                            setTypingTestDetails({
                              ...typingTestDetails,
                              mistakes: numericOnly,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <Typography>
                        Duration for this Question (MM:SS)
                        <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item md={6} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={hrsOption}
                              placeholder="Mins"
                              value={{
                                label: `${typingTestHours}`,
                                value: `${typingTestHours}`,
                              }}
                              onChange={(e) => {
                                setTypingTestHours(e.value);
                                setTypingTestDetails({
                                  ...typingTestDetails,
                                  duration: `${e.value}:${typingTestMinutes}`,
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
                              placeholder="Sec"
                              value={{
                                label: typingTestMinutes,
                                value: typingTestMinutes,
                              }}
                              onChange={(e) => {
                                setTypingTestMinutes(e.value);
                                setTypingTestDetails({
                                  ...typingTestDetails,
                                  duration: `${typingTestHours}:${e.value}`,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                )}
                {type === "Date Range" && (
                  <>
                    <Grid item md={2.5} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          From Date<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="from-date"
                          type="date"
                          value={dateRange?.fromdate}
                          onChange={(e) => {
                            setDateRange({
                              fromdate: e.target.value,
                              todate: "",
                            });
                            document.getElementById("to-date").min =
                              e.target.value;
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={2.5} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          To Date<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="to-date"
                          type="date"
                          value={dateRange?.todate}
                          onChange={(e) => {
                            setDateRange({
                              ...dateRange,
                              todate: e.target.value,
                            });
                          }}
                          min={dateRange.fromdate}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                {(type === "MultipleChoice" ||
                  type === "Radio" ||
                  type === "TextBox" ||
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
                          value={options}
                          onChange={(e) => {
                            if (type === "Text-Alpha") {
                              const textOnly = e.target.value.replace(
                                /[^a-zA-Z\s;]/g,
                                ""
                              );
                              setOptions(textOnly);
                            } else if (type === "Text-Numeric") {
                              const numericOnly = e.target.value.replace(
                                /[^0-9.;\s]/g,
                                ""
                              );
                              setOptions(numericOnly);
                            } else {
                              setOptions(e.target.value);
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
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
                      disabled={
                        optionstodo?.some(
                          (item) => item.options === "NOANSWER"
                        ) ||
                        (optionstodo?.length > 0 &&
                          ["TextBox", "Text-Alpha", "Text-Numeric"].includes(
                            type
                          ))
                      }
                    >
                      <FaPlus />
                    </Button>
                    &emsp;
                    <br />
                    {optionstodo.length > 0 && (
                      <Grid item md={3} xs={12} sm={12}>
                        <ul type="none">
                          {optionstodo.map((item, index) => {
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
                                      placeholder="No Answer"
                                      value={item.options}
                                      onChange={(e) => {
                                        // item.options !== "NOANSWER" &&
                                        handleTodoEdit(
                                          index,
                                          "options",
                                          e.target.value
                                        );
                                      }}
                                      readOnly={item.options === "NOANSWER"}
                                    />
                                  </FormControl>
                                  &emsp; &emsp;
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
              <br /> <br />
              <br /> <br />
              {!["Typing Test"].includes(type) &&
                //   optionstodo.length > 0 &&
                yesOrNo === "Yes" && (
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Sub Questions</Typography>
                        <Selects
                          options={interviewQuestion
                            .filter(
                              (item) =>
                                item.name === question &&
                                item.category === catAndSub?.category &&
                                item.subcategory === catAndSub?.subcategory
                            )
                            .flatMap((item) =>
                              (item.subquestions || []).map((subquestion) => ({
                                label: subquestion.question,
                                value: subquestion.question,
                              }))
                            )
                            .filter(
                              (subquestion) =>
                                !addReqTodo.some(
                                  (req) => req.question === subquestion.label
                                )
                            )}
                          styles={colourStyles}
                          value={{ label: extraQuestAdd, value: extraQuestAdd }}
                          onChange={(e) => setExtraQuestAdd(e.value)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Type</Typography>
                        <Selects
                          options={[
                            { label: "Radio", value: "Radio" },
                            { label: "TextBox", value: "TextBox" },
                            { label: "Text-Alpha", value: "Text-Alpha" },
                            { label: "Text-Numeric", value: "Text-Numeric" },
                            {
                              label: "MultipleChoice",
                              value: "MultipleChoice",
                            },
                            { label: "Date", value: "Date" },
                            { label: "Date Range", value: "Date Range" },
                            { label: "Yes/No", value: "Yes/No" },
                            {
                              label: "Correct/In Correct",
                              value: "Correct/In Correct",
                            },
                          ]}
                          styles={colourStyles}
                          value={{ label: extratype, value: extratype }}
                          onChange={(e) => {
                            setExtraType(e.value);
                            setExtraOptionsType("");
                            setOptionstodoExtra([]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    {[
                      "Radio",
                      "MultipleChoice",
                      "TextBox",
                      "Text-Alpha",
                      "Text-Numeric",
                    ].includes(extratype) &&
                      extraQuestAdd !== "Please Select Sub Question" && (
                        <>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Answers{" "}
                                {extratype !== "TextBox" &&
                                  extratype !== "Text-Alpha" &&
                                  extratype !== "Text-Numeric" && (
                                    <b style={{ color: "red" }}>*</b>
                                  )}
                              </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={extraOptionsType}
                                onChange={(e) => {
                                  if (extratype === "Text-Alpha") {
                                    const textOnly = e.target.value.replace(
                                      /[^a-zA-Z\s;]/g,
                                      ""
                                    );
                                    setExtraOptionsType(textOnly);
                                  } else if (extratype === "Text-Numeric") {
                                    const numericOnly = e.target.value.replace(
                                      /[^0-9.;\s]/g,
                                      ""
                                    );
                                    setExtraOptionsType(numericOnly);
                                  } else {
                                    setExtraOptionsType(e.target.value);
                                  }
                                }}
                              />
                            </FormControl>
                          </Grid>
                          &emsp;
                          <Button
                            variant="contained"
                            color="success"
                            onClick={addTodoExtra}
                            type="button"
                            sx={{
                              height: "30px",
                              minWidth: "30px",
                              marginTop: "40px",
                              padding: "6px 10px",
                            }}
                            disabled={
                              optionstodoExtra?.some(
                                (item) => item === "NOANSWER"
                              ) ||
                              (optionstodoExtra?.length > 0 &&
                                [
                                  "TextBox",
                                  "Text-Alpha",
                                  "Text-Numeric",
                                ].includes(extratype))
                            }
                          >
                            <FaPlus />
                          </Button>
                          <br />
                          &emsp;
                          {optionstodoExtra.length > 0 && (
                            <Grid item md={3} xs={12} sm={12}>
                              <ul type="none">
                                {optionstodoExtra.map((item, index) => {
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
                                            value={item}
                                            onChange={(e) =>
                                              handleTodoEditExtra(
                                                index,
                                                "options",
                                                e.target.value
                                              )
                                            }
                                            readOnly={item === "NOANSWER"}
                                          />
                                        </FormControl>
                                        &emsp;
                                        <Button
                                          variant="contained"
                                          color="error"
                                          type="button"
                                          onClick={(e) =>
                                            deleteTodoExtra(index)
                                          }
                                          sx={{
                                            height: "30px",
                                            minWidth: "30px",
                                            marginTop: "28px",
                                            padding: "6px 10px",
                                          }}
                                        >
                                          <AiOutlineClose />
                                        </Button>
                                      </Grid>
                                    </li>
                                  );
                                })}
                              </ul>
                            </Grid>
                          )}
                        </>
                      )}

                    {extratype === "Date" && (
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Date</Typography>
                          <OutlinedInput
                            id="date"
                            type="date"
                            value={dateSub}
                            onChange={(e) => {
                              setDateSub(e.target.value);
                            }}
                          />
                        </FormControl>
                      </Grid>
                    )}
                    {extratype === "Date Range" && (
                      <>
                        <Grid item md={2.5} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              From Date<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="from-date"
                              type="date"
                              value={dateRangeSub?.fromdate}
                              onChange={(e) => {
                                setDateRangeSub({
                                  fromdate: e.target.value,
                                  todate: "",
                                });
                                document.getElementById("to-datesub").min =
                                  e.target.value;
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={2.5} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              To Date<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="to-datesub"
                              type="date"
                              value={dateRangeSub?.todate}
                              onChange={(e) => {
                                setDateRangeSub({
                                  ...dateRangeSub,
                                  todate: e.target.value,
                                });
                              }}
                              min={dateRangeSub.fromdate}
                            />
                          </FormControl>
                        </Grid>
                      </>
                    )}
                    {/* <Grid item md={3} xs={12} sm={12}></Grid> */}
                    {(extratype === "Date" ||
                      extratype === "Date Range" ||
                      extratype === "Yes/No" ||
                      extratype === "Correct/In Correct" ||
                      optionstodoExtra.length > 0) && (
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
                                  <Typography>Sub Questions</Typography>
                                  <Selects
                                    options={interviewQuestion
                                      .filter(
                                        (item) =>
                                          item.name === question &&
                                          item.category ===
                                            catAndSub?.category &&
                                          item.subcategory ===
                                            catAndSub?.subcategory
                                      )
                                      .flatMap((item) =>
                                        (item.subquestions || []).map(
                                          (subquestion) => ({
                                            label: subquestion.question,
                                            value: subquestion.question,
                                          })
                                        )
                                      )}
                                    styles={colourStyles}
                                    value={{
                                      label: row?.question,
                                      value: row?.question,
                                    }}
                                    onChange={(e) => {
                                      handleTodoEditOverallExtra(
                                        index,
                                        "question",
                                        e.value
                                      );
                                    }}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography>Type</Typography>
                                  <OutlinedInput
                                    id="component-outlined"
                                    value={row?.type}
                                  />
                                </FormControl>
                              </Grid>

                              {row?.optionslist?.length > 0 ? (
                                <Grid item md={3} xs={12} sm={12}>
                                  <ul type="none">
                                    {row?.optionslist?.map((item, ind) => {
                                      return (
                                        <li key={ind}>
                                          <br />
                                          <Grid
                                            sx={{
                                              display: "flex",
                                              marginTop: "-15px",
                                            }}
                                          >
                                            <FormControl fullWidth size="small">
                                              <Typography>
                                                {" "}
                                                Answers List{" "}
                                              </Typography>
                                              {row.type === "Date" ||
                                              row.type === "Date Range" ? (
                                                <OutlinedInput
                                                  id="date"
                                                  type="date"
                                                  value={item}
                                                  onChange={(e) =>
                                                    handleTodoEditOverallExtraOptions(
                                                      index,
                                                      "optionslist",
                                                      ind,
                                                      e.target.value
                                                    )
                                                  }
                                                  min={row?.optionslist[0]}
                                                />
                                              ) : (
                                                <OutlinedInput
                                                  id="component-outlined"
                                                  placeholder="Please Enter SubCategory"
                                                  value={item}
                                                  onChange={(e) =>
                                                    handleTodoEditOverallExtraOptions(
                                                      index,
                                                      "optionslist",
                                                      ind,
                                                      e.target.value
                                                    )
                                                  }
                                                  readOnly={item === "NOANSWER"}
                                                />
                                              )}
                                            </FormControl>
                                            &emsp;
                                          </Grid>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </Grid>
                              ) : (
                                <Grid item md={3} xs={12} sm={12}></Grid>
                              )}
                              <br />
                              <br />
                            </>
                          ) : (
                            <>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography>Sub Question</Typography>
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
                              {row.optionslist?.length > 0 ? (
                                <Grid item md={3} xs={12} sm={12}>
                                  <FormControl fullWidth size="small">
                                    <Typography>Answers List</Typography>
                                    <OutlinedInput
                                      readOnly
                                      value={row.optionslist.map(
                                        (item) => item
                                      )}
                                    />
                                  </FormControl>
                                </Grid>
                              ) : (
                                <Grid item md={3} xs={12} sm={12}></Grid>
                              )}
                            </>
                          )}
                          <Grid item md={1} xs={12} sm={12}></Grid>
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
                                    row.optionslist.some((item) => item === "")
                                  ) {
                                    setShowAlert(
                                      <>
                                        <ErrorOutlineOutlinedIcon
                                          sx={{
                                            fontSize: "100px",
                                            color: "orange",
                                          }}
                                        />
                                        <p
                                          style={{
                                            fontSize: "20px",
                                            fontWeight: 900,
                                          }}
                                        >
                                          {
                                            "Fill All the Answers Field and Add Data"
                                          }
                                        </p>
                                      </>
                                    );
                                    handleClickOpenerr();
                                  } else if (
                                    row.optionslist
                                      .map((option) => option.toLowerCase()) // Convert all elements to lowercase
                                      .some(
                                        (option, index, array) =>
                                          array.indexOf(option) !== index
                                      )
                                  ) {
                                    setShowAlert(
                                      <>
                                        <ErrorOutlineOutlinedIcon
                                          sx={{
                                            fontSize: "100px",
                                            color: "orange",
                                          }}
                                        />
                                        <p
                                          style={{
                                            fontSize: "20px",
                                            fontWeight: 900,
                                          }}
                                        >
                                          {"This Option Already added!"}
                                        </p>
                                      </>
                                    );
                                    handleClickOpenerr();
                                  } else if (
                                    addReqTodo?.some(
                                      (data, inde) =>
                                        data?.question === row.question &&
                                        index !== inde
                                    )
                                  ) {
                                    setShowAlert(
                                      <>
                                        <ErrorOutlineOutlinedIcon
                                          sx={{
                                            fontSize: "100px",
                                            color: "orange",
                                          }}
                                        />
                                        <p
                                          style={{
                                            fontSize: "20px",
                                            fontWeight: 900,
                                          }}
                                        >
                                          {"Already Question Added"}
                                        </p>
                                      </>
                                    );
                                    handleClickOpenerr();
                                  } else if (
                                    addReqTodo?.some(
                                      (data, inde) =>
                                        data?.question === row.question &&
                                        index !== inde &&
                                        data?.type === row.type
                                    )
                                  ) {
                                    setShowAlert(
                                      <>
                                        <ErrorOutlineOutlinedIcon
                                          sx={{
                                            fontSize: "100px",
                                            color: "orange",
                                          }}
                                        />
                                        <p
                                          style={{
                                            fontSize: "20px",
                                            fontWeight: 900,
                                          }}
                                        >
                                          {"Already These Question Type Added"}
                                        </p>
                                      </>
                                    );
                                    handleClickOpenerr();
                                  } else if (
                                    row.type === "Radio" &&
                                    row.optionslist.length < 2
                                  ) {
                                    setShowAlert(
                                      <>
                                        <ErrorOutlineOutlinedIcon
                                          sx={{
                                            fontSize: "100px",
                                            color: "orange",
                                          }}
                                        />
                                        <p
                                          style={{
                                            fontSize: "20px",
                                            fontWeight: 900,
                                          }}
                                        >
                                          {
                                            "Please Create more than two options for radio"
                                          }
                                        </p>
                                      </>
                                    );
                                    handleClickOpenerr();
                                  } else if (
                                    row.type === "TextBox" &&
                                    row.optionslist.length < 1
                                  ) {
                                    setShowAlert(
                                      <>
                                        <ErrorOutlineOutlinedIcon
                                          sx={{
                                            fontSize: "100px",
                                            color: "orange",
                                          }}
                                        />
                                        <p
                                          style={{
                                            fontSize: "20px",
                                            fontWeight: 900,
                                          }}
                                        >
                                          {
                                            "Please Create atleast one option for textbox"
                                          }
                                        </p>
                                      </>
                                    );
                                    handleClickOpenerr();
                                  } else {
                                    const updatedIsTodoEdit = [...isTodoEdit];
                                    updatedIsTodoEdit[index] = false;
                                    setIsTodoEdit(updatedIsTodoEdit);
                                    setTodoSubmit(false);
                                    setEditingIndexcheck(-1);
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
                                <Button
                                  variant="contained"
                                  color="primary"
                                  sx={{
                                    height: "30px",
                                    minWidth: "30px",
                                    marginTop: "28px",
                                    padding: "6px 10px",
                                  }}
                                  disabled={
                                    editingIndexcheck !== index &&
                                    editingIndexcheck !== -1
                                  }
                                  onClick={() => {
                                    const updatedIsTodoEdit = [...isTodoEdit];
                                    updatedIsTodoEdit[index] = true;
                                    setIsTodoEdit(updatedIsTodoEdit);
                                    setTodoSubmit(true);
                                    setCreateEditBefore(addReqTodo[index]);
                                    setEditingIndexcheck(index);
                                  }}
                                >
                                  <FaEdit />
                                </Button>
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
                                  const updateOldvalue = [...addReqTodo];
                                  updateOldvalue[index] = createEditBefore;
                                  setAddReqTodo(updateOldvalue);
                                  setEditingIndexcheck(-1);
                                }}
                              >
                                <AiOutlineClose />
                              </Button>
                            ) : (
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
                                disabled={
                                  editingIndexcheck !== index &&
                                  editingIndexcheck !== -1
                                }
                                onClick={() => {
                                  deleteTodoEditExtra(index);
                                  setEditingIndexcheck(-1);
                                }}
                              >
                                <AiOutlineClose />
                              </Button>
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
                <Grid item md={3} xs={12} sm={6}>
                  <LoadingButton
                    sx={{
                      ...userStyle.buttonedit,
                      marginLeft: "10px",
                    }}
                    variant="contained"
                    loading={btnSubmit}
                    style={{ minWidth: "0px" }}
                    onClick={handleSubmit}
                  >
                    Submit
                  </LoadingButton>
                </Grid>
                <Grid item md={2.5} xs={12} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleClear}>
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
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <form onSubmit={editSubmit}>
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Interview Answer Allot
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Mode <b style={{ color: "red" }}>*</b>
                      </Typography>

                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={modeEdit}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Category <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={roundmasterEdit?.category}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Sub Category <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={roundmasterEdit?.subcategory}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Interview question <b style={{ color: "red" }}>*</b>
                      </Typography>
                      {/* <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={roundmasterEdit?.question}
                      /> */}
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={5}
                        value={roundmasterEdit?.question}
                        readOnly
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
                        value={roundmasterEdit?.type}
                        readOnly
                      />
                    </FormControl>
                  </Grid>

                  {roundmasterEdit?.type === "Typing Test" && (
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Speed<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            placeholder="Please Enter Speed in WPM"
                            type="text"
                            value={typingTestDetailsEdit?.speed}
                            onChange={(e) => {
                              const numericOnly = e.target.value.replace(
                                /[^0-9.;\s]/g,
                                ""
                              );
                              setTypingTestDetailsEdit({
                                ...typingTestDetailsEdit,
                                speed: numericOnly,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Accuracy<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            placeholder="Please Enter Accuracy in Percentage"
                            type="text"
                            value={typingTestDetailsEdit?.accuracy}
                            onChange={(e) => {
                              const numericOnly = e.target.value.replace(
                                /[^0-9.;\s]/g,
                                ""
                              );
                              setTypingTestDetailsEdit({
                                ...typingTestDetailsEdit,
                                accuracy: numericOnly,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            No Of Mistakes<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            placeholder="Please Enter No.Of Mistakes Acceptable"
                            type="text"
                            value={typingTestDetailsEdit?.mistakes}
                            onChange={(e) => {
                              const numericOnly = e.target.value.replace(
                                /[^0-9.;\s]/g,
                                ""
                              );
                              setTypingTestDetailsEdit({
                                ...typingTestDetailsEdit,
                                mistakes: numericOnly,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={6}>
                        <Typography>
                          Duration for this Question (MM:SS)
                          <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item md={6} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Selects
                                maxMenuHeight={300}
                                options={hrsOption}
                                placeholder="Mins"
                                value={{
                                  label: `${typingTestHoursEdit}`,
                                  value: `${typingTestHoursEdit}`,
                                }}
                                onChange={(e) => {
                                  setTypingTestHoursEdit(e.value);
                                  setTypingTestDetailsEdit({
                                    ...typingTestDetailsEdit,
                                    duration: `${e.value}:${typingTestMinutesEdit}`,
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
                                placeholder="Sec"
                                value={{
                                  label: `${typingTestMinutesEdit}`,
                                  value: `${typingTestMinutesEdit}`,
                                }}
                                onChange={(e) => {
                                  setTypingTestMinutesEdit(e.value);
                                  setTypingTestDetailsEdit({
                                    ...typingTestDetailsEdit,
                                    duration: `${typingTestHoursEdit}:${e.value}`,
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  )}
                  {roundmasterEdit?.type === "Date" && (
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Date</Typography>
                        <OutlinedInput
                          id="date"
                          type="date"
                          value={dateEdit}
                          // onChange={(e) => {
                          //   setDateEdit(e.target.value);
                          // }}
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                  )}
                  {roundmasterEdit?.type === "Date Range" && (
                    <>
                      <Grid item md={2.5} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            From Date<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="from-date"
                            type="date"
                            value={dateRangeEdit?.fromdate}
                            // onChange={(e) => {
                            //   setDateRangeEdit({
                            //     fromdate: e.target.value,
                            //     todate: "",
                            //   });
                            //   document.getElementById("to-dateedit").min =
                            //     e.target.value;
                            // }}
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
                            id="to-dateedit"
                            type="date"
                            value={dateRangeEdit?.todate}
                            // onChange={(e) => {
                            //   setDateRangeEdit({
                            //     ...dateRangeEdit,
                            //     todate: e.target.value,
                            //   });
                            // }}
                            readOnly
                            min={dateRangeEdit.fromdate}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                  {(roundmasterEdit?.type === "MultipleChoice" ||
                    roundmasterEdit?.type === "Radio" ||
                    roundmasterEdit?.type === "TextBox" ||
                    roundmasterEdit?.type === "Text-Alpha" ||
                    roundmasterEdit?.type === "Text-Numeric") && (
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Answers
                            {roundmasterEdit?.type !== "TextBox" &&
                              roundmasterEdit?.type !== "Text-Alpha" &&
                              roundmasterEdit?.type !== "Text-Numeric" && (
                                <b style={{ color: "red" }}>*</b>
                              )}
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={optionsEdit}
                            // onChange={(e) => {
                            //   if (roundmasterEdit?.type === "Text-Alpha") {
                            //     const textOnly = e.target.value.replace(
                            //       /[^a-zA-Z\s;]/g,
                            //       ""
                            //     );
                            //     setOptionsEdit(textOnly);
                            //   } else if (
                            //     roundmasterEdit?.type === "Text-Numeric"
                            //   ) {
                            //     const numericOnly = e.target.value.replace(
                            //       /[^0-9.;\s]/g,
                            //       ""
                            //     );
                            //     setOptionsEdit(numericOnly);
                            //   } else {
                            //     setOptionsEdit(e.target.value);
                            //   }
                            // }}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
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
                        // disabled={
                        //   optionstodoEdit?.some(
                        //     (item) => item.options === "NOANSWER"
                        //   ) ||
                        //   (optionstodoEdit?.length > 0 &&
                        //     ["TextBox", "Text-Alpha", "Text-Numeric"].includes(
                        //       roundmasterEdit?.type
                        //     ))
                        // }
                        disabled
                      >
                        <FaPlus />
                      </Button>
                      {optionstodoEdit?.length > 0 && (
                        <Grid item md={3} xs={12} sm={12}>
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
                                        // onChange={(e) =>
                                        //   handleTodoEditPage(
                                        //     index,
                                        //     "options",
                                        //     e.target.value
                                        //   )
                                        // }
                                        // readOnly={item.options === "NOANSWER"}
                                        readOnly
                                      />
                                    </FormControl>
                                    &emsp; &emsp;
                                    <Button
                                      variant="contained"
                                      color="error"
                                      type="button"
                                      // onClick={(e) => deleteTodoEdit(index)}
                                      disabled
                                      sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "28px",
                                        padding: "6px 10px",
                                      }}
                                    >
                                      <AiOutlineClose />
                                    </Button>
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
                <br /> <br />
                {addReqTodoEdit?.length > 0 && (
                  <ul type="none">
                    {addReqTodoEdit?.map((row, index) => {
                      return (
                        <li key={index}>
                          <Grid container spacing={2}>
                            <>
                              <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography>Sub Questions</Typography>
                                  <OutlinedInput
                                    readOnly
                                    value={row?.question}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography>Type</Typography>
                                  <OutlinedInput readOnly value={row?.type} />
                                </FormControl>
                              </Grid>
                              {row?.optionslist?.length > 0 ? (
                                <Grid item md={4} xs={12} sm={12}>
                                  <FormControl fullWidth size="small">
                                    <Typography>Answers List</Typography>
                                    <OutlinedInput
                                      readOnly
                                      value={row?.optionslist?.map(
                                        (item) => item
                                      )}
                                    />
                                  </FormControl>
                                </Grid>
                              ) : (
                                <Grid item md={4} xs={12} sm={12}></Grid>
                              )}
                            </>
                          </Grid>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <br /> <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button variant="contained" type="submit">
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      sx={userStyle.btncancel}
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
      {isUserRoleCompare?.includes("linterviewanswerallot") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Interview Answer Allot List
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
                    {/* <MenuItem value={roundmasters?.length}>All</MenuItem> */}
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
                  {isUserRoleCompare?.includes("excelinterviewanswerallot") && (
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
                  {isUserRoleCompare?.includes("csvinterviewanswerallot") && (
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
                  {isUserRoleCompare?.includes("printinterviewanswerallot") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfinterviewanswerallot") && (
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
                  {isUserRoleCompare?.includes("imageinterviewanswerallot") && (
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
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            <Button
              variant="contained"
              color="error"
              onClick={handleClickOpenalert}
            >
              Bulk Delete
            </Button>
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
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid
                    onClipboardCopy={(copiedString) =>
                      setCopiedData(copiedString)
                    }
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
                    {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                    {filteredDatas.length} entries
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
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpen}
          onClose={handleCloseMod}
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
            <Button onClick={handleCloseMod} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delRound(Roundsid)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>

        {/* this is info view details */}

        <Dialog
          open={openInfo}
          onClose={handleCloseinfo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={{ width: "550px", padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>
                Interview Answer Allot Info
              </Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">addedby</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"SNO"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"UserName"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"Date"}
                        </StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {addedby?.map((item, i) => (
                          <StyledTableRow>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {i + 1}.
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {" "}
                              {item.name}
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {" "}
                              {moment(item.date).format(
                                "DD-MM-YYYY hh:mm:ss a"
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Updated by</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"SNO"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"UserName"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"Date"}
                        </StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {updateby?.map((item, i) => (
                          <StyledTableRow>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {i + 1}.
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {" "}
                              {item.name}
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {" "}
                              {moment(item.date).format(
                                "DD-MM-YYYY hh:mm:ss a"
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <br />
              <Grid container spacing={2}>
                <Button variant="contained" onClick={handleCloseinfo}>
                  {" "}
                  Back{" "}
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>
        {/* print layout */}

        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table
            sx={{ minWidth: 700 }}
            aria-label="customized table"
            id="usertable"
            ref={componentRef}
          >
            <TableHead>
              <TableRow>
                <TableCell>S.no</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Sub Category</TableCell>
                <TableCell>Question</TableCell>
                <TableCell>Question Type</TableCell>
                <TableCell>Answers</TableCell>
                <TableCell>Sub Questions</TableCell>
                <TableCell>Sub Questions Type</TableCell>
                <TableCell>Sub Question Answers</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.mode}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.subcategory}</TableCell>
                    <TableCell>{row.question}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.options}</TableCell>
                    <TableCell>{row.extraquestions}</TableCell>
                    <TableCell>{row?.subquestiontype}</TableCell>
                    <TableCell>{row?.subquestionanswers}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Interview Answer Allot
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Mode</Typography>
                  <Typography>{roundmasterEdit.mode}</Typography>
                </FormControl>
              </Grid>
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
                      <Typography>{roundmasterEdit.typingspeed} wpm</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Accuracy</Typography>
                      <Typography>
                        {roundmasterEdit.typingaccuracy} %
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">
                        No.Of Mistakes Acceptable
                      </Typography>
                      <Typography>{roundmasterEdit.typingmistakes}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">
                        Duration for this Question
                      </Typography>
                      <Typography>
                        {roundmasterEdit.typingduration?.split(":")[0]} Mins{" "}
                        {roundmasterEdit.typingduration?.split(":")[1]} Sec
                      </Typography>
                    </FormControl>
                  </Grid>
                </>
              )}
              {roundmasterEdit.type === "Date" && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Date</Typography>
                    <Typography>
                      {roundmasterEdit?.date === ""
                        ? ""
                        : moment(roundmasterEdit?.date).format("DD-MM-YYYY")}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {roundmasterEdit.type === "Date Range" && (
                <>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">From Date</Typography>
                      <Typography>
                        {moment(roundmasterEdit?.fromdate).format("DD-MM-YYYY")}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">To Date</Typography>
                      <Typography>
                        {moment(roundmasterEdit?.todate).format("DD-MM-YYYY")}
                      </Typography>
                    </FormControl>
                  </Grid>
                </>
              )}
              {roundmasterEdit.type !== "Date Range" &&
                roundmasterEdit.type !== "Date" &&
                roundmasterEdit.type !== "Typing Test" && (
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Answers</Typography>
                      <Typography>
                        {roundmasterEdit.optionArr
                          ?.map((t, i) => `${i + 1 + ". "}` + t.options)
                          .toString()}
                      </Typography>
                    </FormControl>
                  </Grid>
                )}
            </Grid>
            <br /> <br /> <br />
            {Number(roundmasterEdit.subquestionlength) > 0 && (
              <>
                {roundmasterEdit?.secondarytodo?.length > 0 &&
                  roundmasterEdit?.secondarytodo?.map((data) => (
                    <>
                      <Grid container spacing={2}>
                        <Grid item md={4} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography variant="h6">Sub Questions </Typography>
                            <Typography>{data?.question}</Typography>
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography variant="h6">Type </Typography>
                            <Typography>{data?.type}</Typography>
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography variant="h6">Answers </Typography>
                            <Typography>
                              {data?.optionslist
                                ?.map((t, i) => `${i + 1 + ". "}` + t + " ")
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
            >
              ok
            </Button>
            <Button
              style={{
                backgroundColor: "#f4f4f4",
                color: "#444",
                boxShadow: "none",
                borderRadius: "3px",
                padding: "7px 13px",
                border: "1px solid #0000006b",
                "&:hover": {
                  "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                    backgroundColor: "#f4f4f4",
                  },
                },
              }}
              onClick={handleCloseerrpop}
            >
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
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/*Export XL Data  */}
      <Dialog
        open={isFilterOpen}
        onClose={handleCloseFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseFilterMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          {fileFormat === "csv" ? (
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
          ) : (
            <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
          )}
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("overall");
              // fetchProductionClientRateArray();
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog
        open={isPdfFilterOpen}
        onClose={handleClosePdfFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClosePdfFilterMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("filtered");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("overall");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
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
            If this Question used in any of the pages that may also edits. Are
            you sure? <br />
            <span style={{ color: "green", fontSize: "15px" }}>
              But Does not reflect for already Interview Scheduled Candidate.
            </span>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOverallEditPopup} variant="outlined">
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
    </Box>
  );
}

export default InterviewQuestionAnswerAllot;
