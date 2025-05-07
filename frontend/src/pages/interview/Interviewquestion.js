import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DoneIcon from "@mui/icons-material/Done";
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
  TextareaAutosize,
  MenuItem,
  OutlinedInput,
  Popover,
  Select,
  TextField,
  Typography, Radio, RadioGroup, FormControlLabel, InputAdornment, Tooltip,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaEdit, FaFilePdf, FaPlus, FaPrint, FaSearch } from "react-icons/fa";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
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
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";
import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import {
  candidatestatusOption,
  workmodeOption,
  question_preference
} from "../../components/Componentkeyword";

function Interviewquestion() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
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
    "category",
    "SubCategory",
    "Question",
    "Sub Questions",
    "Attend By",
    "Candidate Status",
    "Work Mode",
  ];
  let exportRowValues = [
    "category",
    "subcategory",
    "name",
    "doyouhaveextraquestion",
    "testattendby",
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


  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [btnSubmit, setBtnSubmit] = useState(false);

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [typingTest, setTypingtest] = useState({
    typingtest: false,
    questiontype: "Please Select Question Type",
  });

  const [loader, setLoader] = useState(true);

  const [projectmaster, setProjectmaster] = useState({
    name: "",
    doyouhaveextraquestion: "Please Select Yes/No",
    addedby: "",
    updatedby: "",
    isuploadimage: false,
    uploadedimage: null,
    uploadedimagename: null,
    files: [],

  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProjectmaster({
          ...projectmaster,
          isuploadimage: true,
          uploadedimage: reader.result,
          uploadedimagename: file.name,
          files: [
            {
              filename: file.name,
              preview: reader.result,
              // data: reader.result.split(",")[1],
              remark: "image file",
            },
          ],
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUploadEdit = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProjedit({
          ...projEdit,
          isuploadimage: true,
          uploadedimage: reader.result,
          uploadedimagename: file.name,
          files: [
            {
              filename: file.name,
              preview: reader.result,
              // data: reader.result.split(",")[1],
              remark: "image file",
            },
          ],
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setProjectmaster({
      ...projectmaster,
      isuploadimage: false,
      uploadedimage: null,
    });
  };

  const handleDeleteImageEdit = () => {
    setProjedit({
      ...projEdit,
      isuploadimage: false,
      uploadedimage: null,
    });
  };

  const handleViewImage = () => {
    const blob = dataURItoBlob(projectmaster.uploadedimage);
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl);
  };

  const handleViewImageEdit = () => {
    const blob = dataURItoBlob(projEdit.uploadedimage);
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl);
  };

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

  // for sub-----------------------------------------------
  const handleImageUploadSub = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSingleSubQuestion({
          ...singleSubQuestion,
          isuploadimage: true,
          uploadedimage: reader.result,
          uploadedimagename: file.name,
          files: [
            {
              filename: file.name,
              preview: reader.result,
              // data: reader.result.split(",")[1],
              remark: "image file",
            },
          ],
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUploadSubEditNew = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSingleSubQuestionEdit({
          ...singleSubQuestionEdit,
          isuploadimage: true,
          uploadedimage: reader.result,
          uploadedimagename: file.name,
          files: [
            {
              filename: file.name,
              preview: reader.result,
              // data: reader.result.split(",")[1],
              remark: "image file",
            },
          ],
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUploadSubEdit = (e, index) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const updatedSingleSubQuestion = [...allSubQuestions];

        updatedSingleSubQuestion[index] = {
          ...updatedSingleSubQuestion[index],
          isuploadimage: true,
          uploadedimage: reader.result,
          uploadedimagename: file.name,
          // files: [
          //   {
          //     filename: file.name,
          //     preview: reader.result,
          //     // data: reader.result.split(",")[1],
          //     remark: "image file",
          //   },
          // ],
        };
        setAllSubQuestions(updatedSingleSubQuestion);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUploadSubEditEdit = (e, index) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const updatedSingleSubQuestion = [...allSubQuestionsEdit];

        updatedSingleSubQuestion[index] = {
          ...updatedSingleSubQuestion[index],
          isuploadimage: true,
          uploadedimage: reader.result,
          uploadedimagename: file.name,
          // files: [
          //   {
          //     filename: file.name,
          //     preview: reader.result,
          //     // data: reader.result.split(",")[1],
          //     remark: "image file",
          //   },
          // ],
        };
        setAllSubQuestionsEdit(updatedSingleSubQuestion);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImageSub = (index) => {
    const updatedSingleSubQuestion = [...allSubQuestions];

    updatedSingleSubQuestion[index] = {
      ...updatedSingleSubQuestion[index],
      isuploadimage: false,
      uploadedimage: null,
      files: [],
    };

    setAllSubQuestions(updatedSingleSubQuestion);
  };

  const handleDeleteImageSubEdit = (index) => {
    const updatedSingleSubQuestion = [...allSubQuestionsEdit];

    updatedSingleSubQuestion[index] = {
      ...updatedSingleSubQuestion[index],
      isuploadimage: false,
      uploadedimage: null,
      files: [],
    };

    setAllSubQuestionsEdit(updatedSingleSubQuestion);
  };

  const handleViewImageSub = (data) => {
    const blob = dataURItoBlob(data.uploadedimage);
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl);
  };

  const handleViewImageSubEdit = (data) => {
    const blob = dataURItoBlob(data.uploadedimage);
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl);
  };

  //create todo

  const [allSubQuestions, setAllSubQuestions] = useState([]);
  const [singleSubQuestion, setSingleSubQuestion] = useState({
    subquestionnumber: "Please Select Sub Question Number",
    question: "",
    tamilquestion: "",
    doyouhaveextraquestion: "Please Select Yes/No",
    editstatus: false,
    isuploadimage: false,
    uploadedimage: null,
    uploadedimagename: null,
    files: [],

  });

  const [subquestionnumber, setsubquestionnumber] = useState([
    {
      label: "Sub Question",
      value: "Sub Question",
    },
  ]);
  const hasTamilWord = (sentence) => /[\u0B80-\u0BFF]+/.test(sentence);

  const addSubquestionTodo = () => {
    const isNameMatch = allSubQuestions?.some(
      (item) =>
        item.question.toLowerCase() === singleSubQuestion.question.toLowerCase()
    );
    if (
      singleSubQuestion.subquestionnumber ===
      "Please Select Sub Question Number"
    ) {
      setPopupContentMalert("Please Select Sub Question Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (singleSubQuestion.question === "") {
      setPopupContentMalert("Please Enter Question!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (singleSubQuestion.tamilquestion === "") {
    //   setPopupContentMalert("Please Enter Question in Tamil (கேள்வி)!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else if (singleSubQuestion.tamilquestion !== "" && !hasTamilWord(singleSubQuestion.tamilquestion)) {
      setPopupContentMalert("Please Enter Atleast One Word in Tamil (கேள்வி)!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      singleSubQuestion.doyouhaveextraquestion === "Please Select Yes/No"
    ) {
      setPopupContentMalert(
        "Please Select Yes/No for Do You Have Extra Question!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Question Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      singleSubQuestion.question?.toLowerCase() ===
      projectmaster?.name?.toLowerCase()
    ) {
      setPopupContentMalert("Question Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      singleSubQuestion?.isuploadimage === true &&
      singleSubQuestion?.uploadedimage == null
    ) {
      setPopupContentMalert("Please Upload Image!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleSubQuestion !== "") {
      setAllSubQuestions([...allSubQuestions, singleSubQuestion]);
      var subquesnum = [...allSubQuestions, singleSubQuestion];
      setSingleSubQuestion({
        subquestionnumber: "Please Select Sub Question Number",
        question: "",
        tamilquestion: "",
        doyouhaveextraquestion: "Please Select Yes/No",
        editstatus: false,
        isuploadimage: false,
        uploadedimage: null,
        uploadedimagename: null,
        files: [],
      });

      const numbers = subquesnum.map((obj) => {
        let lastdig = obj?.subquestionnumber?.split(" ");
        const number = parseInt(lastdig[lastdig?.length - 1]);
        return isNaN(number) ? 0 : number; // Convert non-numeric labels to 0
      });
      // Find the maximum value in the array of numbers
      const highestNumber = Math.max(...numbers);

      setsubquestionnumber([
        ...subquestionnumber,
        {
          label: `Sub Question ${highestNumber + 1}`,
          value: `Sub Question ${highestNumber + 1}`,
        },
      ]);
    }
  };
  const deleteReferenceTodo = (index) => {
    const newTasks = [...allSubQuestions];

    const checkdel = newTasks[index]?.subquestionnumber;

    const filteredTasks = newTasks.filter(
      (task, idx) => idx !== index && task.subquestionnumber === checkdel
    );

    if (filteredTasks?.length <= 0 && newTasks.length - 1 != index) {
      setPopupContentMalert(`You Can't Delete All the ${checkdel}!`);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      newTasks.splice(index, 1);
      setAllSubQuestions(newTasks);

      const numbers = newTasks?.map((obj) => {
        let lastdig = obj?.subquestionnumber?.split(" ");
        const number = parseInt(lastdig[lastdig?.length - 1]);
        return isNaN(number) ? 0 : number; // Convert non-numeric labels to 0
      });

      if (!numbers || numbers.length === 0) {
        setsubquestionnumber([
          {
            label: `Sub Question`,
            value: `Sub Question`,
          },
        ]);
        return [
          {
            label: `Sub Question`,
            value: `Sub Question`,
          },
        ];
      } else {
        const maxNumber = Math.max(...numbers);

        const newArray = numbers?.map((number, index) => ({
          label: number === 0 ? "Sub Question" : `Sub Question ${number}`,
          value: number === 0 ? "Sub Question" : `Sub Question ${number}`,
        }));

        newArray.push({
          label: `Sub Question ${maxNumber + 1}`,
          value: `Sub Question ${maxNumber + 1}`,
        });

        setsubquestionnumber(newArray);
      }
    }
  };
  const todoEditStatus = (index, bool) => {
    const newTasks = [...allSubQuestions];
    if (bool === true) {
      newTasks[index] = {
        ...newTasks[index],
        editstatus: bool,
      };

      setAllSubQuestions(newTasks);
    } else {
      const isNameMatch = newTasks
        ?.filter((_, i) => i !== index)
        ?.some(
          (item) =>
            item?.question.toLowerCase() ===
            newTasks[index]?.question.toLowerCase()
        );
      const isNameMatchMain =
        projectmaster?.name?.toLowerCase() ===
        newTasks[index]?.question.toLowerCase();

      if (isNameMatch) {
        setPopupContentMalert("Question Already Exist!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (isNameMatchMain) {
        setPopupContentMalert("Question Already Exist!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else if (newTasks[index]?.question === "") {
        setPopupContentMalert("Please Enter Question!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      // else if (newTasks[index]?.tamilquestion === "") {
      //   setPopupContentMalert("Please Enter Question in Tamil (கேள்வி)!");
      //   setPopupSeverityMalert("info");
      //   handleClickOpenPopupMalert();
      // }
      else if (newTasks[index]?.tamilquestion !== "" && !hasTamilWord(newTasks[index]?.tamilquestion)) {
        setPopupContentMalert("Please Enter Atleast One Word in Tamil (கேள்வி)!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else {
        newTasks[index] = {
          ...newTasks[index],
          editstatus: bool,
        };

        setAllSubQuestions(newTasks);
      }
    }
  };

  const handleCreateTodoEdit = (index, key, value) => {
    // Create a copy of the array
    const updatedArray = [...allSubQuestions];

    // Update the property value of the object at the specified index
    updatedArray[index] = {
      ...updatedArray[index],
      [key]: value,
    };

    // Set the state with the updated array
    setAllSubQuestions(updatedArray);

    const numbers = updatedArray.map((obj) => {
      let lastdig = obj?.subquestionnumber?.split(" ");
      const number = parseInt(lastdig[lastdig?.length - 1]);
      return isNaN(number) ? 0 : number; // Convert non-numeric labels to 0
    });

    // Find the maximum value in the array of numbers
    const highestNumber = Math.max(...numbers);

    setsubquestionnumber([
      ...subquestionnumber,
      {
        label: `Sub Question ${highestNumber + 1}`,
        value: `Sub Question ${highestNumber + 1}`,
      },
    ]);
  };

  //edit todo

  const [allSubQuestionsEdit, setAllSubQuestionsEdit] = useState([]);
  const [singleSubQuestionEdit, setSingleSubQuestionEdit] = useState({
    subquestionnumber: "Please Select Sub Question Number",
    question: "",
    doyouhaveextraquestion: "Please Select Yes/No",
    editstatus: false,
  });

  const [subquestionnumberEdit, setsubquestionnumberEdit] = useState([
    {
      label: "Sub Question",
      value: "Sub Question",
    },
  ]);

  const addSubquestionTodoEdit = () => {
    const isNameMatch = allSubQuestionsEdit?.some(
      (item) =>
        item.question.toLowerCase() ===
        singleSubQuestionEdit.question.toLowerCase()
    );
    if (
      singleSubQuestionEdit.subquestionnumber ===
      "Please Select Sub Question Number"
    ) {
      setPopupContentMalert("Please Select Sub Question Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (singleSubQuestionEdit.question === "") {
      setPopupContentMalert("Please Enter Question!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (singleSubQuestionEdit?.tamilquestion === "") {
    //   setPopupContentMalert("Please Enter Question in Tamil (கேள்வி)!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else if (singleSubQuestionEdit?.tamilquestion !== "" && !hasTamilWord(singleSubQuestionEdit?.tamilquestion)) {
      setPopupContentMalert("Please Enter Atleast One Word in Tamil (கேள்வி)!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      singleSubQuestionEdit.doyouhaveextraquestion === "Please Select Yes/No"
    ) {
      setPopupContentMalert(
        "Please Select Yes/No for Do You Have Extra Question!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Question Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      singleSubQuestionEdit.question?.toLowerCase() ===
      projEdit?.name?.toLowerCase()
    ) {
      setPopupContentMalert("Question Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleSubQuestionEdit !== "") {
      setAllSubQuestionsEdit([...allSubQuestionsEdit, singleSubQuestionEdit]);
      var subquesnumEdit = [...allSubQuestionsEdit, singleSubQuestionEdit];
      setSingleSubQuestionEdit({
        subquestionnumber: "Please Select Sub Question Number",
        question: "",
        doyouhaveextraquestion: "Please Select Yes/No",
        editstatus: false,
      });

      const numbers = subquesnumEdit.map((obj) => {
        let lastdig = obj?.subquestionnumber?.split(" ");
        const number = parseInt(lastdig[lastdig?.length - 1]);
        return isNaN(number) ? 0 : number; // Convert non-numeric labels to 0
      });
      // Find the maximum value in the array of numbers
      const highestNumber = Math.max(...numbers);

      setsubquestionnumberEdit([
        ...subquestionnumberEdit,
        {
          label: `Sub Question ${highestNumber + 1}`,
          value: `Sub Question ${highestNumber + 1}`,
        },
      ]);
    }
  };

  const deleteReferenceTodoEdit = (index) => {
    const newTasks = [...allSubQuestionsEdit];

    const checkdel = newTasks[index]?.subquestionnumber;

    const filteredTasks = newTasks.filter(
      (task, idx) => idx !== index && task.subquestionnumber === checkdel
    );

    if (filteredTasks?.length <= 0 && newTasks.length - 1 != index) {
      setPopupContentMalert(`You Can't Delete All the ${checkdel}`);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      newTasks.splice(index, 1);
      setAllSubQuestionsEdit(newTasks);

      const numbers = newTasks?.map((obj) => {
        let lastdig = obj?.subquestionnumber?.split(" ");
        const number = parseInt(lastdig[lastdig?.length - 1]);
        return isNaN(number) ? 0 : number; // Convert non-numeric labels to 0
      });

      if (!numbers || numbers.length === 0) {
        setsubquestionnumberEdit([
          {
            label: `Sub Question`,
            value: `Sub Question`,
          },
        ]);
        return [
          {
            label: `Sub Question`,
            value: `Sub Question`,
          },
        ];
      } else {
        const maxNumber = Math.max(...numbers);

        const newArray = numbers?.map((number, index) => ({
          label: number === 0 ? "Sub Question" : `Sub Question ${number}`,
          value: number === 0 ? "Sub Question" : `Sub Question ${number}`,
        }));

        newArray.push({
          label: `Sub Question ${maxNumber + 1}`,
          value: `Sub Question ${maxNumber + 1}`,
        });

        setsubquestionnumberEdit(newArray);
      }
    }
  };
  const todoEditStatusEdit = (index, bool) => {
    const newTasks = [...allSubQuestionsEdit];
    if (bool === true) {
      newTasks[index] = {
        ...newTasks[index],
        editstatus: bool,
      };

      setAllSubQuestionsEdit(newTasks);
    } else {
      const isNameMatch = newTasks
        ?.filter((_, i) => i !== index)
        ?.some(
          (item) =>
            item?.question.toLowerCase() ===
            newTasks[index]?.question.toLowerCase()
        );
      const isNameMatchMain =
        projEdit?.name?.toLowerCase() ===
        newTasks[index]?.question.toLowerCase();

      if (isNameMatch) {
        setPopupContentMalert("Question Already Exist!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (isNameMatchMain) {
        setPopupContentMalert("Question Already Exist!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else if (newTasks[index]?.question === "") {
        setPopupContentMalert("Please Enter Question!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      // else if (newTasks[index]?.tamilquestion === "") {
      //   setPopupContentMalert("Please Enter Question in Tamil (கேள்வி)!");
      //   setPopupSeverityMalert("info");
      //   handleClickOpenPopupMalert();
      // }
      else if (newTasks[index]?.tamilquestion !== "" && !hasTamilWord(newTasks[index]?.tamilquestion)) {
        setPopupContentMalert("Please Enter Atleast One Word in Tamil (கேள்வி)!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else {
        newTasks[index] = {
          ...newTasks[index],
          editstatus: bool,
        };

        setAllSubQuestionsEdit(newTasks);
      }
    }
  };

  const handleEditTodoEdit = (index, key, value) => {
    // Create a copy of the array
    const updatedArray = [...allSubQuestionsEdit];

    // Update the property value of the object at the specified index
    updatedArray[index] = {
      ...updatedArray[index],
      [key]: value,
    };

    // Set the state with the updated array
    setAllSubQuestionsEdit(updatedArray);

    const numbers = updatedArray.map((obj) => {
      let lastdig = obj?.subquestionnumber?.split(" ");
      const number = parseInt(lastdig[lastdig?.length - 1]);
      return isNaN(number) ? 0 : number; // Convert non-numeric labels to 0
    });

    // Find the maximum value in the array of numbers
    const highestNumber = Math.max(...numbers);

    setsubquestionnumberEdit([
      ...subquestionnumberEdit,
      {
        label: `Sub Question ${highestNumber + 1}`,
        value: `Sub Question ${highestNumber + 1}`,
      },
    ]);
  };

  const yesno = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  const [interviewAttendBy, setInterviewAttendBy] = useState("Both");
  const testattendby = [
    { label: "Candidate", value: "Candidate" },
    { label: "Interviewer", value: "Interviewer" },
    { label: "Both", value: "Both" },
  ];
  const [projEdit, setProjedit] = useState({
    name: "",
    doyouhaveextraquestion: "Please Select Yes/No",
    isuploadimage: false,
    uploadedimage: null,
    uploadedimagename: null,
  });
  const [projmaster, setProjmaster] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteproject, setDeleteproject] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [allProjectedit, setAllProjectedit] = useState([]);

  const [copiedData, setCopiedData] = useState("");

  const [canvasState, setCanvasState] = useState(false);

  //image

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Interview Question Master.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // Error Popup model

  const handleClickOpenerr = () => {
    setBtnSubmit(false);
    setLoader(true);
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
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

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    setIsHandleChange(true);
    if (selectedRows.length == 0) {
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

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
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

  const [allData, setAllData] = useState([]);
  const allQuestionData = async () => {
    setPageName(!pageName);
    try {
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
      setAllData(res_project?.data?.interviewquestions);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //get all project.
  const fetchProjMasterAll = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.ALLINTERVIEWQUESTION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      return res_project?.data?.interviewquestions.filter(
        (item) => item._id !== projEdit._id
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

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    category: true,
    subcategory: true,
    name: true,
    doyouhaveextraquestion: true,
    actions: true,
    typingtest: true,
    questiontype: true,
    testattendby: true,
    candidatestatusexp: true,
    workmode: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //set function to get particular row
  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.INTERVIEWQUESTION_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteproject(res?.data?.sinterviewquestion);
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
  let projectid = deleteproject._id;
  const delProject = async () => {
    setPageName(!pageName);
    try {
      let overallcheck = await axios.post(
        `${SERVICE.INTERVIEWQUESTION_OVERALLDELETE}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          category: deleteproject?.category,
          subcategory: deleteproject?.subcategory,
          question: deleteproject?.name,
          mode: "Questions",
        }
      );
      if (overallcheck?.data?.mayidelete) {
        await axios.delete(`${SERVICE.INTERVIEWQUESTION_SINGLE}/${projectid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });

        setFilteredChanges(null)
        setFilteredRowData([])
        await fetchProjMaster();
        await allQuestionData();
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
    } catch (err) {
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
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
        `${SERVICE.INTERVIEWQUESTION_OVERALLBULKDELETE}`,
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
  const delProjectcheckbox = async () => {
    setPageName(!pageName);
    try {
      if (selectedRows?.length > 0) {
        const deletePromises = selectedRows?.map((item) => {
          return axios.delete(`${SERVICE.INTERVIEWQUESTION_SINGLE}/${item}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
        });
        setFilteredChanges(null)
        setFilteredRowData([])
        // Wait for all delete requests to complete
        await Promise.all(deletePromises);
        setIsHandleChange(false);

        setFilteredChanges(null)
        setFilteredRowData([]);
        await fetchProjMaster();
        await allQuestionData();
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
      await Promise.all(
        valueSubCategoryCat?.map(async (data) => {
          await axios.post(SERVICE.INTERVIEWQUESTION_CREATE, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            category: String(category),
            subcategory: String(data),
            name: String(projectmaster.name),
            tamilquestion: String(filterState?.tamilquestion),
            tamilquestiondescription: String(filterState?.tamilquestiondescription),
            typingtest: Boolean(typingTest.typingtest),
            questiontype: String(typingTest.questiontype),
            doyouhaveextraquestion: String(
              typingTest.typingtest
                ? "No"
                : projectmaster.doyouhaveextraquestion
            ),
            subquestions: typingTest?.typingtest ? [] : allSubQuestions,
            isuploadimage:
              projectmaster.isuploadimage == undefined
                ? false
                : Boolean(projectmaster.isuploadimage),
            uploadedimage:
              projectmaster.uploadedimage == null
                ? ""
                : String(projectmaster.uploadedimage),
            uploadedimagename: String(projectmaster.uploadedimagename),
            // files: projectmaster.files,
            testattendby: String(
              typingTest.typingtest ? "Candidate" : interviewAttendBy
            ),
            candidatestatusexp: filterState?.candidatestatusexp?.length ? filterState?.candidatestatusexp?.map(data => data?.value) : [],
            workmode: filterState?.workmode?.length ? filterState?.workmode?.map(data => data?.value) : [],
            questionpreference: filterState?.questionpreference || "Default",
            questiondescription: filterState?.questiondescription || "",
            addedby: [
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          });
        })
      );
      await fetchProjMaster();
      await allQuestionData();
      // setAllSubQuestions([]);
      // setSingleSubQuestion({
      //   subquestionnumber: "Please Select Sub Question Number",
      //   question: "",
      //   doyouhaveextraquestion: "Please Select Yes/No",
      //   editstatus: false,
      // });
      // setsubquestionnumber([
      //   {
      //     label: `Sub Question`,
      //     value: `Sub Question`,
      //   },
      // ]);

      // setProjectmaster({
      //   name: "",
      //   doyouhaveextraquestion: "Please Select Yes/No",
      //   addedby: "",
      //   updatedby: "",
      //   isuploadimage: false,
      //   uploadedimage: null,
      //   uploadedimagename: null,
      //   files: [],
      // });
      if (!typingTest.typingtest) {
        setTypingtest({
          typingtest: false,
          questiontype: "Please Select Question Type",
        });
        // setCategory("Please Select Category");
        // setValueSubCategoryCat([]);
        // setSelectedOptionsSubCategory([]);
      }

      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();

      setBtnSubmit(false);
      setFilteredChanges(null)
      setFilteredRowData([])
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
    setBtnSubmit(true);
    e.preventDefault();
    let subcatopt = selectedOptionsSubCategory.map((item) => item.value);
    const isNameMatch = allData?.some(
      (item) =>
        item.name?.toLowerCase() === projectmaster.name?.toLowerCase() &&
        item?.category === category &&
        subcatopt?.includes(item?.subcategory)
    );
    const editStatus = allSubQuestions?.some(
      (item) => item.editstatus === true
    );
    if (category === "Please Select Category") {
      setPopupContentMalert("Please Select Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueSubCategoryCat?.length === 0) {
      setPopupContentMalert("Please Select Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      typingTest.typingtest &&
      typingTest.questiontype === "Please Select Question Type"
    ) {
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
    }
    // else if (
    //   filterState?.workmode === "" || !filterState?.workmode) {
    //   setPopupContentMalert("Please Select Work Mode!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // } 
    else if (projectmaster.name === "") {
      setPopupContentMalert("Please Enter Question!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (filterState.tamilquestion === "") {
    //   setPopupContentMalert("Please Enter Question in Tamil(கேள்வி)!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else if (filterState.tamilquestion !== "" && !hasTamilWord(filterState.tamilquestion)) {
      setPopupContentMalert("Please Enter Atleast One Word in Tamil(கேள்வி)!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (filterState.tamilquestiondescription !== "" && !hasTamilWord(filterState.tamilquestiondescription)) {
      setPopupContentMalert("Please Enter Atleast One Word in Tamil(கேள்வி விளக்கம்)!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      typingTest.typingtest &&
      typingTest.questiontype === "Alpha-Numeric with Image" &&
      projectmaster?.uploadedimage === null
    ) {
      setPopupContentMalert("Please Upload Image!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      !typingTest.typingtest &&
      projectmaster.doyouhaveextraquestion === "Please Select Yes/No"
    ) {
      setPopupContentMalert(
        "Please Select Yes/No for do you have sub question!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      !typingTest.typingtest &&
      projectmaster.doyouhaveextraquestion === "Yes" &&
      allSubQuestions.length === 0
    ) {
      setPopupContentMalert("Please Add Sub Questions!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Question already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editStatus) {
      setPopupContentMalert("Please Save all the Todo's and Submit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      projectmaster.isuploadimage === true &&
      projectmaster.uploadedimage === null
    ) {
      setPopupContentMalert("Please Upload Image!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleclear = (e) => {
    e.preventDefault();
    setAllSubQuestions([]);
    setSingleSubQuestion({
      subquestionnumber: "Please Select Sub Question Number",
      question: "",
      tamilquestion: "",
      doyouhaveextraquestion: "Please Select Yes/No",
      editstatus: false,
    });
    setsubquestionnumber([
      {
        label: `Sub Question`,
        value: `Sub Question`,
      },
    ]);
    setTypingtest({
      typingtest: false,
      questiontype: "Please Select Question Type",
    });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();

    setCategory("Please Select Category");
    setFilterState({
      candidatestatusexp: [],
      workmode: [],
      questionpreference: "Default",
      questiondescription: "",
      tamilquestion: "",
      tamilquestiondescription: "",
    });
    setValueSubCategoryCat([]);
    setSelectedOptionsSubCategory([]);

    setProjectmaster({
      name: "",
      doyouhaveextraquestion: "Please Select Yes/No",
      addedby: "",
      updatedby: "",
      isuploadimage: false,
      uploadedimage: null,
      uploadedimagename: null,
      files: [],
    });
  };

  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setSingleSubQuestionEdit({
      subquestionnumber: "Please Select Sub Question Number",
      question: "",
      doyouhaveextraquestion: "Please Select Yes/No",
      editstatus: false,
    });
  };
  const [oldDatas, setOldDatas] = useState({});
  //get single row to edit....
  const getCode = async (e, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.INTERVIEWQUESTION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProjedit({
        ...res?.data?.sinterviewquestion,
        testattendby: res?.data?.sinterviewquestion?.testattendby
          ? res?.data?.sinterviewquestion?.testattendby
          : "Both",
      });
      setAllSubQuestionsEdit(res?.data?.sinterviewquestion?.subquestions);
      setOldDatas(res?.data?.sinterviewquestion);
      setEditDetails({

        candidatestatusexp: res?.data?.sinterviewquestion?.candidatestatusexp?.length > 0 ? res?.data?.sinterviewquestion?.candidatestatusexp?.map(data => ({
          label: data,
          value: data,
        })) : [],
        workmode: res?.data?.sinterviewquestion?.workmode?.length > 0 ? res?.data?.sinterviewquestion?.workmode?.map(data => ({
          label: data,
          value: data,
        })) : [],
        questionpreference: res?.data?.sinterviewquestion?.questionpreference || "Default",
        questiondescription: res?.data?.sinterviewquestion?.questiondescription || "",
        tamilquestiondescription: res?.data?.sinterviewquestion?.tamilquestiondescription || "",
        tamilquestion: res?.data?.sinterviewquestion?.tamilquestion || "",
      });
      const numbers = res?.data?.sinterviewquestion?.subquestions?.map(
        (obj) => {
          let lastdig = obj?.subquestionnumber?.split(" ");
          const number = parseInt(lastdig[lastdig?.length - 1]);
          return isNaN(number) ? 0 : number; // Convert non-numeric labels to 0
        }
      );

      const maxNumber = Math.max(...numbers);

      const newArray = numbers?.map((number, index) => ({
        label: number === 0 ? "Sub Question" : `Sub Question ${number}`,
        value: number === 0 ? "Sub Question" : `Sub Question ${number}`,
      }));

      newArray.push({
        label: `Sub Question ${maxNumber + 1}`,
        value: `Sub Question ${maxNumber + 1}`,
      });

      setsubquestionnumberEdit(newArray);

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
      let res = await axios.get(`${SERVICE.INTERVIEWQUESTION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProjedit(res?.data?.sinterviewquestion);
      setAllSubQuestionsEdit(res?.data?.sinterviewquestion?.subquestions);
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
      let res = await axios.get(`${SERVICE.INTERVIEWQUESTION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProjedit(res?.data?.sinterviewquestion);
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
  let updateby = projEdit.updatedby;
  let addedby = projEdit.addedby;

  let projectsid = projEdit._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.INTERVIEWQUESTION_SINGLE}/${projectsid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          category: String(projEdit.category),
          subcategory: String(projEdit.subcategory),
          name: String(projEdit.name),
          typingtest: Boolean(
            projEdit?.typingtest == undefined ? "" : projEdit?.typingtest
          ),
          testattendby: String(
            projEdit.typingtest ? "Candidate" : projEdit?.testattendby
          ),
          questiontype: String(
            projEdit?.questiontype == undefined ? "" : projEdit?.questiontype
          ),
          doyouhaveextraquestion: String(
            projEdit?.typingtest ? "No" : projEdit.doyouhaveextraquestion
          ),
          subquestions: projEdit?.typingtest ? [] : allSubQuestionsEdit,
          isuploadimage:
            projEdit.isuploadimage == undefined
              ? false
              : Boolean(projEdit.isuploadimage),
          uploadedimage:
            projEdit.uploadedimage == null
              ? ""
              : String(projEdit.uploadedimage),
          uploadedimagename: String(projEdit.uploadedimagename),
          // files: projEdit.files,
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
      let subarray = allSubQuestionsEdit?.map((item) => item.question);
      let oldsubarray = oldDatas?.subquestions?.map((item) => item.question);
      await axios.put(`${SERVICE.INTERVIEWQUESTION_OVERALLEDIT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldcategory: oldDatas?.category,
        newcategory: projEdit.category,
        oldsubcategory: oldDatas?.subcategory,
        newsubcategory: projEdit.subcategory,
        oldquestion: oldDatas?.name,
        newquestion: projEdit.name,
        oldsubquestion: oldsubarray,
        newsubquestion: subarray,
        mode: "Questions",
      });

      handleCloseModEdit();
      handleCloseOverallEditPopup();
      setProjedit(res.data);
      await fetchProjMaster();

      setSingleSubQuestionEdit({
        subquestionnumber: "Please Select Sub Question Number",
        question: "",
        doyouhaveextraquestion: "Please Select Yes/No",
        editstatus: false,
      });
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await allQuestionData();
      setFilteredChanges(null)
      setFilteredRowData([])
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
  const editSubmit = async (e) => {
    e.preventDefault();
    // let resdata = await fetchProjMasterAll();
    const isNameMatch = allData?.filter(
      (item) => item._id !== projEdit._id
    )?.some(
      (item) =>
        item.name?.toLowerCase() === projEdit.name?.toLowerCase() &&
        item?.category === projEdit?.category &&
        item?.subcategory === projEdit?.subcategory
    );

    const editStatus = allSubQuestionsEdit?.some(
      (item) => item.editstatus === true
    );
    if (
      projEdit?.category === "" ||
      projEdit?.category === "Please Select Category" ||
      projEdit?.category === undefined
    ) {
      setPopupContentMalert("Please Select Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      projEdit?.subcategory === "" ||
      projEdit?.subcategory === "Please Select Sub Category" ||
      projEdit?.subcategory === undefined
    ) {
      setPopupContentMalert("Please Select Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      projEdit?.typingtest &&
      projEdit?.questiontype === "Please Select Question Type"
    ) {
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
    // else if (
    //   editDetails?.workmode === "" || !editDetails?.workmode) {
    //   setPopupContentMalert("Please Select Work Mode!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // } 
    else if (projEdit.name === "") {
      setPopupContentMalert("Please Enter Question!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (editDetails.tamilquestion === "") {
    //   setPopupContentMalert("Please Enter Question in Tamil (கேள்வி)!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else if (editDetails.tamilquestion !== "" && !hasTamilWord(editDetails.tamilquestion)) {
      setPopupContentMalert("Please Enter Atleast One Word in Tamil (கேள்வி)!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (editDetails.tamilquestiondescription !== "" && !hasTamilWord(editDetails.tamilquestiondescription)) {
      setPopupContentMalert("Please Enter Atleast One Word in Tamil (கேள்வி விளக்கம்)!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      projEdit?.typingtest &&
      projEdit?.questiontype === "Alpha-Numeric with Image" &&
      projEdit?.uploadedimage === null
    ) {
      setPopupContentMalert("Please Upload Image!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      !projEdit?.typingtest &&
      projEdit.doyouhaveextraquestion === "Please Select Yes/No"
    ) {
      setPopupContentMalert(
        "Please Select Yes/No for do you have sub question!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      !projEdit?.typingtest &&
      projEdit.doyouhaveextraquestion === "Yes" &&
      allSubQuestionsEdit.length === 0
    ) {
      setPopupContentMalert("Please Add Sub Questions!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Question already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editStatus) {
      setPopupContentMalert("Please Save all the Todo's and Submit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      projEdit.isuploadimage === true &&
      projEdit.uploadedimage === null
    ) {
      setPopupContentMalert("Please Upload Image!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      handleOpenOverallEditPopup();
      handleCloseModEdit();
    }
  };
  const [advancedFilter, setAdvancedFilter] = useState(null);


  const [logicOperator, setLogicOperator] = useState("AND");

  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("Contains");
  const [filterValue, setFilterValue] = useState("");
  const [additionalFilters, setAdditionalFilters] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions
  const [totalPages, setTotalPages] = useState(0);
  const [totalDatas, setTotalDatas] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalProjectsData, setTotalProjectsData] = useState([]);
  // Search bar
  const [anchorElSearch, setAnchorElSearch] = React.useState(null);
  const handleClickSearch = (event) => {
    setAnchorElSearch(event.currentTarget);
    localStorage.removeItem("filterModel");
  };
  const handleCloseSearch = () => {
    setAnchorElSearch(null);
    setSearchQuery("");
  };

  const openSearch = Boolean(anchorElSearch);
  const idSearch = openSearch ? 'simple-popover' : undefined;

  const handleAddFilter = () => {
    if (selectedColumn && filterValue || ["Blank", "Not Blank"].includes(selectedCondition)) {
      setAdditionalFilters([
        ...additionalFilters,
        { column: selectedColumn, condition: selectedCondition, value: filterValue }
      ]);
      setSelectedColumn("");
      setSelectedCondition("Contains");
      setFilterValue("");
    }
  };
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  // Show filtered combination in the search bar
  const getSearchDisplay = () => {
    if (advancedFilter && advancedFilter.length > 0) {
      return advancedFilter.map((filter, index) => {
        let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
        return `${showname} ${filter.condition} "${filter.value}"`;
      }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
    }
    return searchQuery;
  };

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery); // Update debounced query after the timeout
    }, 300); // Debounce delay in milliseconds (adjust as needed)

    return () => {
      clearTimeout(handler); // Clear the timeout if searchQuery changes within the delay
    };
  }, [searchQuery]);
  const [filterClicked, setFilterClicked] = useState(false)

  useEffect(() => {
    fetchProjMaster();
  }, [page, pageSize, debouncedQuery]);

  const handleResetSearch = async () => {
    setPageName(!pageName)
    setLoader(false);

    // Reset all filters and pagination state
    setAdvancedFilter(null);
    setAdditionalFilters([]);
    setSearchQuery("");
    setIsSearchActive(false);
    setSelectedColumn("");
    setSelectedCondition("Contains");
    setFilterValue("");
    setLogicOperator("AND");
    setFilteredChanges(null);

    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
    };

    const allFilters = [];

    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (debouncedQuery) {
      queryParams.searchQuery = debouncedQuery;  // Use searchQuery for regular search
    }


    try {
      let res = await axios.post(SERVICE.SKIPPED_INTERVIEWQUESTIONS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        ...queryParams,
      });


      const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        id: item._id,
        typingtest: item?.typingtest ? "Yes" : "No",
        questiontype: item?.typingtest ? item?.questiontype : "",
        candidatestatusexp: item?.candidatestatusexp?.length > 0 ? item?.candidatestatusexp?.join(",") : "",
        workmode: item?.workmode?.length > 0 ? item?.workmode?.join(",") : "",
      }));
      setProjmaster(itemsWithSerialNumber);
      setTotalProjectsData(res?.data?.totalProjectsDatas?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        id: item._id,
        typingtest: item?.typingtest ? "Yes" : "No",
        questiontype: item?.typingtest ? item?.questiontype : "",
      })))
      setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
      setTotalDatas(ans?.length > 0 ? res?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
      setPageSize((data) => {
        return ans?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return ans?.length > 0 ? data : 1;
      });

      setLoader(true);

    } catch (err) {
      setLoader(true); handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }

  }

  //get all project.
  const fetchProjMaster = async () => {
    setPageName(!pageName);
    try {
      setLoader(false);

      const queryParams = {
        page: Number(page),
        pageSize: Number(pageSize),
      };

      const allFilters = [
        ...additionalFilters,
        { column: selectedColumn, condition: selectedCondition, value: filterValue }
      ];

      // Only include advanced filters if they exist, otherwise just use regular searchQuery
      if (allFilters.length > 0 && selectedColumn !== "") {

        queryParams.allFilters = allFilters
        queryParams.logicOperator = logicOperator;
      } else if (debouncedQuery) {
        queryParams.searchQuery = debouncedQuery;  // Use searchQuery for regular search
      }

      let res = await axios.post(SERVICE.SKIPPED_INTERVIEWQUESTIONS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        ...queryParams,
      });

      const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        id: item._id,
        typingtest: item?.typingtest ? "Yes" : "No",
        questiontype: item?.typingtest ? item?.questiontype : "",
        candidatestatusexp: item?.candidatestatusexp?.length > 0 ? item?.candidatestatusexp?.join(",") : "",
        workmode: item?.workmode?.length > 0 ? item?.workmode?.join(",") : "",
      }));
      setProjmaster(itemsWithSerialNumber);
      setTotalProjectsData(res?.data?.totalProjectsDatas?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        id: item._id,
        typingtest: item?.typingtest ? "Yes" : "No",
        questiontype: item?.typingtest ? item?.questiontype : "",
      })))
      setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
      setTotalDatas(ans?.length > 0 ? res?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
      setPageSize((data) => {
        return ans?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return ans?.length > 0 ? data : 1;
      });

      setLoader(true);
    } catch (err) {
      setLoader(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // Excel
  const fileName = "Interview Question Masters";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Interview Question Masters",
    pageStyle: "print",
  });

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

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(projmaster);
  }, [projmaster]);

  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    fetchProjMaster();
    getCategory();
    allQuestionData();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  const [category, setCategory] = useState("Please Select Category");
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
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [catDatas, setCatDatas] = useState([]);
  const getCategory = async () => {
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.CATEGORYINTERVIEW}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let questions = response?.data?.interviewcategory?.filter(
        (item) => item?.mode === "Questions"
      );

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

  //sub category multiselect
  const [selectedOptionsSubCategory, setSelectedOptionsSubCategory] = useState(
    []
  );
  let [valueSubCategoryCat, setValueSubCategoryCat] = useState([]);

  const handleSubCategoryChange = (options) => {
    setValueSubCategoryCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsSubCategory(options);
  };

  const customValueRendererSubCategory = (
    valueSubCategoryCat,
    _categoryname
  ) => {
    return valueSubCategoryCat?.length
      ? valueSubCategoryCat.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Category";
  };

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

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
      pagename: String("Interview Question Master"),
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
      field: "category",
      headerName: "Category",
      flex: 0,
      width: 120,
      hide: !columnVisibility.category,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "subcategory",
      headerName: "Sub Category",
      flex: 0,
      width: 150,
      hide: !columnVisibility.subcategory,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.name,
      headerClassName: "bold-header",
    },
    {
      field: "doyouhaveextraquestion",
      headerName: "Sub Questions",
      flex: 0,
      width: 100,
      hide: !columnVisibility.doyouhaveextraquestion,
      headerClassName: "bold-header",
    },

    {
      field: "testattendby",
      headerName: "Attend By",
      flex: 0,
      width: 130,
      hide: !columnVisibility.testattendby,
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
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      //lockPinned: true,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("einterviewquestionmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id, params.data.name);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}

          {isUserRoleCompare?.includes("dinterviewquestionmaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vinterviewquestionmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iinterviewquestionmaster") && (
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
  const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");

  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      serialNumber: item.serialNumber,
      category: item.category,
      subcategory: item.subcategory,
      name: item.name,
      id: item.id,
      typingtest: item?.typingtest,
      questiontype: item?.questiontype,
      doyouhaveextraquestion: item.doyouhaveextraquestion,
      testattendby: item.testattendby,
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

  return (
    <Box>
      <Headtitle title={"INTERVIEW QUESTION MASTER"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Interview Question Master"
        modulename="Interview"
        submodulename="Interview Setup"
        mainpagename="Interview Question Master"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("ainterviewquestionmaster") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Interview Question Masters
                  </Typography>
                </Grid>
              </Grid>
              <br />

              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Mode</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value="Questions"
                      readOnly
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
                        label: category,
                        value: category,
                      }}
                      onChange={(e) => {
                        setCategory(e.value);
                        setValueSubCategoryCat([]);
                        setSelectedOptionsSubCategory([]);
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
                      options={catDatas
                        .filter(
                          (item) =>
                            item.categoryname === category &&
                            item?.mode === "Questions"
                        )
                        .map((item) => {
                          return item.subcategoryname.map((subCatName) => ({
                            label: subCatName,
                            value: subCatName,
                          }));
                        })
                        .flat()}
                      value={selectedOptionsSubCategory}
                      onChange={handleSubCategoryChange}
                      valueRenderer={customValueRendererSubCategory}
                      labelledBy="Please Select Sub Category"
                    />
                  </FormControl>
                </Grid>

                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Attend By <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={testattendby}
                        styles={colourStyles}
                        value={{
                          label: interviewAttendBy,
                          value: interviewAttendBy,
                        }}
                        onChange={(e) => {
                          setInterviewAttendBy(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={6} xs={12}>
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
                  <Grid item md={3} sm={6} xs={12}>
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
                  <Grid item md={3} sm={12} xs={12}>    </Grid>


                </>
                {!typingTest.typingtest && (
                  <>
                    <Grid item md={8} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Question <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={5}
                          value={projectmaster.name}
                          onChange={(e) => {
                            setProjectmaster({
                              ...projectmaster,
                              name: e.target.value,
                            });
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
                            const inputValue = e.target.value;
                            // if (questionType === "Numeric") {

                            //   // Allow only numbers, periods, semicolons, and spaces
                            //   const numericOnly = inputValue.replace(/[^0-9.;\s]/g, "");
                            //   setQuestionTamil(numericOnly);
                            // } else {
                            // Allow only Tamil characters and spaces
                            const tamilOnly = inputValue;
                            // const tamilOnly = inputValue.replace(/[^\u0B80-\u0BFF0-9\s?.!,;:'"-]/g, "");

                            setFilterState((prev) => ({
                              ...prev,
                              tamilquestion: tamilOnly,
                            }))
                            // }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          கேள்வி விளக்கம்
                        </Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={5}
                          value={filterState?.tamilquestiondescription}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            // if (questionType === "Numeric") {

                            //   // Allow only numbers, periods, semicolons, and spaces
                            //   const numericOnly = inputValue.replace(/[^0-9.;\s]/g, "");
                            //   setQuestionTamil(numericOnly);
                            // } else {
                            // Allow only Tamil characters and spaces
                            // const tamilOnly = inputValue.replace(/[^\u0B80-\u0BFF0-9\s?.!,;:'"-]/g, "");
                            const tamilOnly = inputValue;

                            setFilterState((prev) => ({
                              ...prev,
                              tamilquestiondescription: tamilOnly,
                            }))
                            // }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Do You Have Sub Question{" "}
                          <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={yesno}
                          styles={colourStyles}
                          value={{
                            label: projectmaster.doyouhaveextraquestion,
                            value: projectmaster.doyouhaveextraquestion,
                          }}
                          onChange={(e) => {
                            setProjectmaster({
                              ...projectmaster,
                              doyouhaveextraquestion: e.value,
                            });
                            setAllSubQuestions([]);
                            setSingleSubQuestion({
                              subquestionnumber:
                                "Please Select Sub Question Number",
                              question: "",
                              tamilquestion: "",
                              doyouhaveextraquestion: "Please Select Yes/No",
                              editstatus: false,
                            });
                            setsubquestionnumber([
                              {
                                label: `Sub Question`,
                                value: `Sub Question`,
                              },
                            ]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={6}>
                      <Typography>
                        Do you want to upload Image?{" "}
                        <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Grid
                        item
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Checkbox
                          sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                          checked={projectmaster.isuploadimage}
                          value={projectmaster.isuploadimage}
                          onChange={(e) => {
                            setProjectmaster({
                              ...projectmaster,
                              isuploadimage: !projectmaster.isuploadimage,
                              uploadedimage: null,
                              uploadedimagename: null,
                            });
                          }}
                        />
                        <Typography>
                          {projectmaster.isuploadimage ? (
                            <span>Yes</span>
                          ) : (
                            <span>No</span>
                          )}
                        </Typography>

                        <Button
                          variant="contained"
                          component="label"
                          sx={buttonStyles.buttonsubmit}
                          disabled={
                            !projectmaster.isuploadimage ||
                            projectmaster.uploadedimage !== null
                          }
                        >
                          Upload
                          <input
                            accept="image/*"
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              handleImageUpload(e);
                            }}
                          />
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid item md={6} xs={12} sm={6}>
                      {projectmaster.isuploadimage && (
                        <div>
                          {projectmaster.uploadedimage && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "4%",
                              }}
                            >
                              <Typography>
                                {projectmaster.uploadedimagename}
                              </Typography>
                              <IconButton
                                aria-label="view"
                                onClick={handleViewImage}
                              >
                                <VisibilityOutlinedIcon
                                  sx={{ color: "#0B7CED" }}
                                />
                              </IconButton>
                              <IconButton
                                aria-label="delete"
                                onClick={handleDeleteImage}
                              >
                                <DeleteOutlineOutlinedIcon
                                  sx={{ color: "red" }}
                                />
                              </IconButton>
                            </div>
                          )}
                        </div>
                      )}
                    </Grid>
                    <Grid item md={12} xs={12} sm={12}></Grid>
                  </>
                )}
                <br />
                <br />
                <br />

                {projectmaster.doyouhaveextraquestion === "Yes" && (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Sub Question Number<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={Array.from(
                            new Set(subquestionnumber.map((obj) => obj.label))
                          ).map((label) =>
                            subquestionnumber.find((obj) => obj.label === label)
                          )}
                          styles={colourStyles}
                          value={{
                            label: singleSubQuestion.subquestionnumber,
                            value: singleSubQuestion.subquestionnumber,
                          }}
                          onChange={(e) => {
                            setSingleSubQuestion({
                              ...singleSubQuestion,
                              subquestionnumber: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>



                    <Grid item md={2.5} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Do You Have Extra Question
                          <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={yesno}
                          styles={colourStyles}
                          value={{
                            label: singleSubQuestion.doyouhaveextraquestion,
                            value: singleSubQuestion.doyouhaveextraquestion,
                          }}
                          onChange={(e) => {
                            setSingleSubQuestion({
                              ...singleSubQuestion,
                              doyouhaveextraquestion: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={3} xs={12} sm={6}>
                      <Typography>
                        Do you want to upload Image?{" "}
                        <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Grid
                        item
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "0",
                        }}
                      >
                        <Checkbox
                          sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                          checked={singleSubQuestion.isuploadimage || false} // Ensure a default value if undefined
                          onChange={(e) => {
                            setSingleSubQuestion({
                              ...singleSubQuestion,
                              isuploadimage: e.target.checked, // Use e.target.checked to get the new state
                              uploadedimage: null,
                              uploadedimagename: null,
                            });
                          }}
                        />

                        <Typography>
                          {singleSubQuestion.isuploadimage ? (
                            <span>Yes</span>
                          ) : (
                            <span>No</span>
                          )}
                        </Typography>

                        <Button
                          variant="contained"
                          component="label"
                          disabled={!singleSubQuestion.isuploadimage}
                          sx={buttonStyles.buttonsubmit}
                        >
                          Upload
                          <input
                            accept="image/*"
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              handleImageUploadSub(e);
                            }}
                          />
                        </Button>

                      </Grid>
                    </Grid>
                    <Grid item md={2} xs={12} sm={12}>
                      {singleSubQuestion.isuploadimage && (
                        <div>
                          {singleSubQuestion.uploadedimage && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "10%",
                              }}
                            >
                              <Typography>
                                {singleSubQuestion.uploadedimagename}
                              </Typography>
                              <IconButton
                                aria-label="view"
                                onClick={() => {
                                  handleViewImageSub(singleSubQuestion);
                                }}
                              >
                                <VisibilityOutlinedIcon
                                  sx={{ color: "#0B7CED" }}
                                />
                              </IconButton>
                            </div>
                          )}
                        </div>
                      )}
                    </Grid>
                    <Grid item md={5.5} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Question <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Question"
                          value={singleSubQuestion.question}
                          onChange={(e) => {
                            setSingleSubQuestion({
                              ...singleSubQuestion,
                              question: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={5.5} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          கேள்வி
                          {/* <b style={{ color: "red" }}>*</b> */}
                        </Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={5}
                          value={singleSubQuestion?.tamilquestion}
                          onChange={(e) => {
                            const inputValue = e.target.value;

                            // const tamilOnly = inputValue.replace(/[^\u0B80-\u0BFF0-9\s?.!,;:'"-]/g, "");
                            const tamilOnly = inputValue;
                            setSingleSubQuestion({
                              ...singleSubQuestion,
                              tamilquestion: tamilOnly,
                            });

                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={1} sm={6} xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        style={{
                          height: "30px",
                          minWidth: "20px",
                          padding: "19px 13px",
                          marginTop: "32px",
                        }}
                        onClick={addSubquestionTodo}
                      >
                        <FaPlus />
                      </Button>
                    </Grid>

                    <br />
                    <br />
                    <Grid item md={12} sm={6} xs={12}>
                      <Grid container spacing={2}>
                        {allSubQuestions?.length > 0 &&
                          allSubQuestions
                            ?.sort((a, b) => {
                              // Extract the numeric part of subquestionnumber
                              const numA =
                                parseInt(
                                  a.subquestionnumber.replace(/\D/g, ""),
                                  10
                                ) || 0;
                              const numB =
                                parseInt(
                                  b.subquestionnumber.replace(/\D/g, ""),
                                  10
                                ) || 0;

                              // Compare the numeric parts
                              if (numA === numB) {
                                // If numeric parts are equal, compare the entire string
                                return a.subquestionnumber.localeCompare(
                                  b.subquestionnumber
                                );
                              } else {
                                return numA - numB;
                              }
                            })
                            ?.map((row, index) => (
                              <>
                                {row.editstatus === false ? (
                                  <>
                                    <Grid item md={2} xs={12} sm={12}>
                                      <FormControl fullWidth size="small">
                                        <Typography>
                                          Sub Question Number
                                        </Typography>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          value={row.subquestionnumber}
                                          readOnly
                                        />
                                      </FormControl>
                                    </Grid>
                                    <Grid item md={4.5} xs={12} sm={12}>
                                      <FormControl fullWidth size="small">
                                        <Typography>Question</Typography>
                                        <TextareaAutosize
                                          aria-label="minimum height"
                                          minRows={5}
                                          value={row.question}
                                          readOnly
                                        />
                                      </FormControl>
                                    </Grid>
                                    <Grid item md={4.5} xs={12} sm={12}>
                                      <FormControl fullWidth size="small">
                                        <Typography>கேள்வி</Typography>
                                        <TextareaAutosize
                                          aria-label="minimum height"
                                          minRows={5}
                                          value={row?.tamilquestion || ""}
                                          readOnly
                                        />

                                      </FormControl>
                                    </Grid>
                                    <Grid item md={1} xs={12} sm={12}>
                                      <FormControl fullWidth size="small">
                                        <Typography>
                                          {" "}
                                          Do You Have Extra Question
                                        </Typography>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          value={row.doyouhaveextraquestion}
                                          readOnly
                                        />
                                      </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12} sm={6}>
                                      {row.isuploadimage && (
                                        <div>
                                          {row.uploadedimage && (
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginTop: "10%",
                                              }}
                                            >
                                              <Typography>
                                                {row.uploadedimagename}
                                              </Typography>
                                              <IconButton
                                                aria-label="view"
                                                onClick={() => {
                                                  handleViewImageSub(row);
                                                }}
                                              >
                                                <VisibilityOutlinedIcon
                                                  sx={{ color: "#0B7CED" }}
                                                />
                                              </IconButton>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </Grid>
                                    <Grid item md={1} xs={12} sm={12}>
                                      <FormControl fullWidth size="small">
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
                                            todoEditStatus(index, true);
                                          }}
                                        >
                                          <FaEdit />
                                        </Button>
                                      </FormControl>
                                    </Grid>

                                    {/* {index == allSubQuestions?.length - 1 && ( */}
                                    <Grid item md={3} xs={12} sm={12}>
                                      <FormControl fullWidth size="small">
                                        <Typography>&nbsp;</Typography>
                                        <CloseIcon
                                          sx={{
                                            color: "red",
                                            cursor: "pointer",
                                            marginTop: "7px",
                                          }}
                                          onClick={() => {
                                            deleteReferenceTodo(index);
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                    {/* )} */}
                                  </>
                                ) : (
                                  <>
                                    <Grid item md={2} xs={12} sm={12}>
                                      <FormControl fullWidth size="small">
                                        <Typography>
                                          Sub Question Number
                                          {/* <b style={{ color: "red" }}>*</b> */}
                                        </Typography>
                                        {/* <Selects
                                        options={Array.from(
                                          new Set(
                                            subquestionnumber.map(
                                              (obj) => obj.label
                                            )
                                          )
                                        ).map((label) =>
                                          subquestionnumber.find(
                                            (obj) => obj.label === label
                                          )
                                        )}
                                        styles={colourStyles}
                                        value={{
                                          label: row.subquestionnumber,
                                          value: row.subquestionnumber,
                                        }}
                                        onChange={(e) => {
                                          handleCreateTodoEdit(
                                            index,
                                            "subquestionnumber",
                                            e.value
                                          );
                                        }}
                                      /> */}
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          value={row.subquestionnumber}
                                          readOnly
                                        />
                                      </FormControl>
                                    </Grid>

                                    <Grid item md={5} xs={12} sm={12}>
                                      <FormControl fullWidth size="small">
                                        <Typography>
                                          Question{" "}
                                          <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <TextareaAutosize
                                          aria-label="minimum height"
                                          minRows={5}
                                          value={row.question}
                                          onChange={(e) => {
                                            handleCreateTodoEdit(
                                              index,
                                              "question",
                                              e.target.value
                                            );
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                    <Grid item md={5} xs={12} sm={12}>
                                      <FormControl fullWidth size="small">
                                        <Typography>
                                          கேள்வி{" "}
                                          {/* <b style={{ color: "red" }}>*</b> */}
                                        </Typography>
                                        <TextareaAutosize
                                          aria-label="minimum height"
                                          minRows={5}
                                          value={row.tamilquestion}
                                          onChange={(e) => {
                                            const inputValue = e.target.value;
                                            // const tamilOnly = inputValue.replace(/[^\u0B80-\u0BFF0-9\s?.!,;:'"-]/g, "");
                                            const tamilOnly = inputValue;
                                            handleCreateTodoEdit(
                                              index,
                                              "tamilquestion",
                                              tamilOnly
                                            );
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={12}>
                                      <FormControl fullWidth size="small">
                                        <Typography>
                                          Do You Have Extra Question
                                          <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                          options={yesno}
                                          styles={colourStyles}
                                          value={{
                                            label: row.doyouhaveextraquestion,
                                            value: row.doyouhaveextraquestion,
                                          }}
                                          onChange={(e) => {
                                            handleCreateTodoEdit(
                                              index,
                                              "doyouhaveextraquestion",
                                              e.value
                                            );
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                      <div>
                                        {row.uploadedimage ? (
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              marginTop: "10%",
                                            }}
                                          >
                                            <Typography>
                                              {row.uploadedimagename}
                                            </Typography>

                                            <IconButton
                                              aria-label="delete"
                                              onClick={() =>
                                                handleDeleteImageSub(index)
                                              }
                                            >
                                              <DeleteOutlineOutlinedIcon
                                                sx={{ color: "red" }}
                                              />
                                            </IconButton>
                                          </div>
                                        ) : (
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              marginTop: "10%",
                                            }}
                                          >
                                            <Button
                                              variant="contained"
                                              component="label"
                                              sx={buttonStyles.buttonsubmit}
                                            >
                                              Upload
                                              <input
                                                accept="image/*"
                                                type="file"
                                                style={{ display: "none" }}
                                                onChange={(e) => {
                                                  handleImageUploadSubEdit(
                                                    e,
                                                    index
                                                  );
                                                }}
                                              />
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    </Grid>

                                    <Grid item md={2} xs={12} sm={12}>
                                      <FormControl fullWidth size="small">
                                        <Typography>&nbsp;</Typography>

                                        <DoneIcon
                                          variant="outlined"
                                          style={{
                                            fontSize: "28px",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            marginTop: "7px",
                                            color: "green",
                                          }}
                                          onClick={() => {
                                            // handleCreateTodoEdit(
                                            //   index,
                                            //   "editstatus",
                                            //   false
                                            // );
                                            todoEditStatus(index, false);
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                    {/* {index == allSubQuestions?.length - 1 && ( */}
                                    <Grid item md={2} xs={12} sm={12}>
                                      <FormControl fullWidth size="small">
                                        <Typography>&nbsp;</Typography>
                                        <CloseIcon
                                          sx={{
                                            color: "red",
                                            cursor: "pointer",
                                            marginTop: "7px",
                                          }}
                                          onClick={() => {
                                            deleteReferenceTodo(index);
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                    {/* )} */}
                                  </>
                                )}
                              </>
                            ))}
                      </Grid>
                    </Grid>
                  </>
                )}
              </Grid>
              <br />
              <br />
              <Grid container>
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
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
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
          maxWidth="lg"
          fullWidth={true}
          sx={{ marginTop: "50px" }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Interview Question Master
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Mode</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value="Questions"
                      readOnly
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
                        label:
                          projEdit?.category === "" ||
                            projEdit?.category === undefined
                            ? "Please Select Category"
                            : projEdit?.category,
                        value:
                          projEdit?.category === "" ||
                            projEdit?.category === undefined
                            ? "Please Select Category"
                            : projEdit?.category,
                      }}
                      onChange={(e) => {
                        setProjedit({
                          ...projEdit,
                          category: e.value,
                          subcategory: "Please Select Sub Category",
                        });
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
                            item.categoryname === projEdit?.category &&
                            item?.mode === "Questions"
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
                        label:
                          projEdit?.subcategory === "" ||
                            projEdit?.subcategory === undefined
                            ? "Please Select Sub Category"
                            : projEdit?.subcategory,
                        value:
                          projEdit?.subcategory === "" ||
                            projEdit?.subcategory === undefined
                            ? "Please Select Sub Category"
                            : projEdit?.subcategory,
                      }}
                      onChange={(e) => {
                        setProjedit({ ...projEdit, subcategory: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>

                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Attend By <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={testattendby}
                        styles={colourStyles}
                        value={{
                          label: projEdit?.testattendby,
                          value: projEdit?.testattendby,
                        }}
                        onChange={(e) => {
                          setProjedit({
                            ...projEdit,
                            testattendby: e.value,
                          });
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
                  <Grid item md={3} sm={12} xs={12}> </Grid>

                  <Grid item md={9} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Question <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={5}
                        placeholder="Please Enter Question Name"
                        value={projEdit.name}
                        onChange={(e) => {
                          setProjedit({ ...projEdit, name: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
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
                  <Grid item md={9} xs={12} sm={12}>
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
                          const inputValue = e.target.value;
                          // const tamilOnly = inputValue.replace(/[^\u0B80-\u0BFF0-9\s?.!,;:'"-]/g, "");
                          const tamilOnly = inputValue;
                          setEditDetails((prev) => ({
                            ...prev,
                            tamilquestion: tamilOnly,
                          }))
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        கேள்வி விளக்கம்</Typography>

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
                        Do You Have Sub Question{" "}
                        <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={yesno}
                        styles={colourStyles}
                        value={{
                          label: projEdit.doyouhaveextraquestion,
                          value: projEdit.doyouhaveextraquestion,
                        }}
                        onChange={(e) => {
                          setProjedit({
                            ...projEdit,
                            doyouhaveextraquestion: e.value,
                          });
                          setAllSubQuestionsEdit([]);
                          setSingleSubQuestionEdit({
                            subquestionnumber:
                              "Please Select Sub Question Number",
                            question: "",
                            doyouhaveextraquestion: "Please Select Yes/No",
                            editstatus: false,
                          });
                          setsubquestionnumberEdit([
                            {
                              label: `Sub Question`,
                              value: `Sub Question`,
                            },
                          ]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <Typography>
                      Do you want to upload Image?{" "}
                      <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Grid
                      item
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                        checked={projEdit.isuploadimage}
                        value={projEdit.isuploadimage}
                        onChange={(e) => {
                          setProjedit({
                            ...projEdit,
                            isuploadimage: !projEdit.isuploadimage,
                            uploadedimage: null,
                            uploadedimagename: null,
                          });
                        }}
                      />
                      <Typography>
                        {projEdit.isuploadimage ? (
                          <span>Yes</span>
                        ) : (
                          <span>No</span>
                        )}
                      </Typography>

                      <Button
                        variant="contained"
                        component="label"
                        sx={buttonStyles.buttonsubmit}
                        disabled={
                          !projEdit.isuploadimage ||
                          projEdit.uploadedimage !== null
                        }
                      >
                        Upload
                        <input
                          accept="image/*"
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            handleImageUploadEdit(e);
                          }}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid item md={6} xs={12} sm={6}>
                    {projEdit.isuploadimage && (
                      <div>
                        {projEdit.uploadedimage && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "4%",
                            }}
                          >
                            <Typography>
                              {projEdit.uploadedimagename}
                            </Typography>
                            <IconButton
                              aria-label="view"
                              onClick={handleViewImageEdit}
                            >
                              <VisibilityOutlinedIcon
                                sx={{ color: "#0B7CED" }}
                              />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              onClick={handleDeleteImageEdit}
                            >
                              <DeleteOutlineOutlinedIcon
                                sx={{ color: "red" }}
                              />
                            </IconButton>
                          </div>
                        )}
                      </div>
                    )}
                  </Grid>
                  <Grid item md={12} xs={12} sm={12}></Grid>

                  {projEdit.doyouhaveextraquestion === "Yes" && (
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Sub Question Number
                            <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={Array.from(
                              new Set(
                                subquestionnumberEdit.map((obj) => obj.label)
                              )
                            ).map((label) =>
                              subquestionnumberEdit.find(
                                (obj) => obj.label === label
                              )
                            )}
                            styles={colourStyles}
                            value={{
                              label: singleSubQuestionEdit.subquestionnumber,
                              value: singleSubQuestionEdit.subquestionnumber,
                            }}
                            onChange={(e) => {
                              setSingleSubQuestionEdit({
                                ...singleSubQuestionEdit,
                                subquestionnumber: e.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>



                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Do You Have Extra Question
                            <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={yesno}
                            styles={colourStyles}
                            value={{
                              label:
                                singleSubQuestionEdit.doyouhaveextraquestion,
                              value:
                                singleSubQuestionEdit.doyouhaveextraquestion,
                            }}
                            onChange={(e) => {
                              setSingleSubQuestionEdit({
                                ...singleSubQuestionEdit,
                                doyouhaveextraquestion: e.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={6}>
                        <Typography>
                          Do you want to upload Image?{" "}
                          <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Grid
                          item
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "0",
                          }}
                        >
                          <Checkbox
                            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                            checked={
                              singleSubQuestionEdit.isuploadimage || false
                            } // Ensure a default value if undefined
                            onChange={(e) => {
                              setSingleSubQuestionEdit({
                                ...singleSubQuestionEdit,
                                isuploadimage: e.target.checked, // Use e.target.checked to get the new state
                                uploadedimage: null,
                                uploadedimagename: null,
                              });
                            }}
                          />

                          <Typography>
                            {singleSubQuestionEdit.isuploadimage ? (
                              <span>Yes</span>
                            ) : (
                              <span>No</span>
                            )}
                          </Typography>

                          <Button
                            variant="contained"
                            component="label"
                            disabled={!singleSubQuestionEdit.isuploadimage}
                            sx={buttonStyles.buttonsubmit}
                          >
                            Upload
                            <input
                              accept="image/*"
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                handleImageUploadSubEditNew(e);
                              }}
                            />
                          </Button>
                        </Grid>
                      </Grid>
                      <Grid item md={5.5} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Question <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <TextareaAutosize
                            aria-label="minimum height"
                            minRows={5}
                            value={singleSubQuestionEdit.question}
                            onChange={(e) => {
                              setSingleSubQuestionEdit({
                                ...singleSubQuestionEdit,
                                question: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={5.5} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            கேள்வி
                            {/* <b style={{ color: "red" }}>*</b> */}
                          </Typography>
                          <TextareaAutosize
                            aria-label="minimum height"
                            minRows={5}
                            value={singleSubQuestionEdit?.tamilquestion}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              // const tamilOnly = inputValue.replace(/[^\u0B80-\u0BFF0-9\s?.!,;:'"-]/g, "");
                              const tamilOnly = inputValue;
                              setSingleSubQuestionEdit({
                                ...singleSubQuestionEdit,
                                tamilquestion: tamilOnly,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={0.5} sm={6} xs={12}>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{
                            height: "30px",
                            minWidth: "20px",
                            padding: "19px 13px",
                            marginTop: "25px",
                          }}
                          // onClick={addSubquestionTodoEdit}
                          disabled
                        >
                          <FaPlus />
                        </Button>
                      </Grid>

                      <br />
                      <br />
                      <Grid item md={12} sm={6} xs={12}>
                        <Grid container spacing={2}>
                          {allSubQuestionsEdit?.length > 0 &&
                            allSubQuestionsEdit
                              ?.sort((a, b) => {
                                // Extract the numeric part of subquestionnumber
                                const numA =
                                  parseInt(
                                    a.subquestionnumber.replace(/\D/g, ""),
                                    10
                                  ) || 0;
                                const numB =
                                  parseInt(
                                    b.subquestionnumber.replace(/\D/g, ""),
                                    10
                                  ) || 0;

                                // Compare the numeric parts
                                if (numA === numB) {
                                  // If numeric parts are equal, compare the entire string
                                  return a.subquestionnumber.localeCompare(
                                    b.subquestionnumber
                                  );
                                } else {
                                  return numA - numB;
                                }
                              })
                              ?.map((row, index) => (
                                <>
                                  {row.editstatus === false ? (
                                    <>
                                      <Grid item md={2} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            Sub Question Number
                                          </Typography>
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={row.subquestionnumber}
                                            readOnly
                                          />
                                        </FormControl>
                                      </Grid>

                                      <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Do You Have Extra Question</Typography>
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={row.doyouhaveextraquestion}
                                            readOnly
                                          />
                                        </FormControl>
                                      </Grid>

                                      <Grid item md={2.5} xs={12} sm={6}>
                                        {row.isuploadimage && (
                                          <div>
                                            {row.uploadedimage && (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  justifyContent: "center",
                                                  alignItems: "center",
                                                  marginTop: "10%",
                                                }}
                                              >
                                                <Typography>
                                                  {row.uploadedimagename}
                                                </Typography>
                                                <IconButton
                                                  aria-label="view"
                                                  onClick={() => {
                                                    handleViewImageSubEdit(row);
                                                  }}
                                                >
                                                  <VisibilityOutlinedIcon
                                                    sx={{ color: "#0B7CED" }}
                                                  />
                                                </IconButton>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </Grid>
                                      <Grid item md={5} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Question</Typography>
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={row.question}
                                            readOnly
                                          />
                                        </FormControl>
                                      </Grid>
                                      <Grid item md={5} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            கேள்வி</Typography>
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={row?.tamilquestion}
                                            readOnly
                                          />
                                        </FormControl>
                                      </Grid>
                                      <Grid item md={0.5} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                              height: "30px",
                                              minWidth: "30px",
                                              marginTop: "28px",
                                              padding: "6px 10px",
                                            }}
                                            // onClick={() => {
                                            //   todoEditStatusEdit(index, true);
                                            // }}
                                            disabled
                                          >
                                            <FaEdit />
                                          </Button>
                                        </FormControl>
                                      </Grid>
                                      <Grid item md={0.5} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>&nbsp;</Typography>
                                          <CloseIcon
                                            sx={{
                                              color: "red",
                                              cursor: "pointer",
                                              marginTop: "7px",
                                            }}
                                            // onClick={() => {
                                            //   deleteReferenceTodoEdit(index);
                                            // }}
                                            disabled
                                          />
                                        </FormControl>
                                      </Grid>
                                    </>
                                  ) : (
                                    <>
                                      <Grid item md={2.5} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            Sub Question Number
                                          </Typography>

                                          <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={row.subquestionnumber}
                                            readOnly
                                          />
                                        </FormControl>
                                      </Grid>

                                      <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            Question{" "}
                                            <b style={{ color: "red" }}>*</b>
                                          </Typography>
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Question"
                                            value={row.question}
                                            onChange={(e) => {
                                              handleEditTodoEdit(
                                                index,
                                                "question",
                                                e.target.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>

                                      <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            Do You Have Extra Question
                                            <b style={{ color: "red" }}>*</b>
                                          </Typography>
                                          <Selects
                                            options={yesno}
                                            styles={colourStyles}
                                            value={{
                                              label: row.doyouhaveextraquestion,
                                              value: row.doyouhaveextraquestion,
                                            }}
                                            onChange={(e) => {
                                              handleEditTodoEdit(
                                                index,
                                                "doyouhaveextraquestion",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                      <Grid item md={2.5} xs={12} sm={6}>
                                        <div>
                                          {row.uploadedimage ? (
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginTop: "10%",
                                              }}
                                            >
                                              <Typography>
                                                {row.uploadedimagename}
                                              </Typography>

                                              <IconButton
                                                aria-label="delete"
                                                onClick={() =>
                                                  handleDeleteImageSubEdit(
                                                    index
                                                  )
                                                }
                                              >
                                                <DeleteOutlineOutlinedIcon
                                                  sx={{ color: "red" }}
                                                />
                                              </IconButton>
                                            </div>
                                          ) : (
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginTop: "10%",
                                              }}
                                            >
                                              <Button
                                                variant="contained"
                                                component="label"
                                                sx={buttonStyles.buttonsubmit}
                                              >
                                                Upload
                                                <input
                                                  accept="image/*"
                                                  type="file"
                                                  style={{ display: "none" }}
                                                  onChange={(e) => {
                                                    handleImageUploadSubEditEdit(
                                                      e,
                                                      index
                                                    );
                                                  }}
                                                />
                                              </Button>
                                            </div>
                                          )}
                                        </div>
                                      </Grid>
                                      <Grid item md={0.5} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>&nbsp;</Typography>

                                          <DoneIcon
                                            variant="outlined"
                                            style={{
                                              fontSize: "28px",
                                              fontWeight: "bold",
                                              cursor: "pointer",
                                              marginTop: "7px",
                                              color: "green",
                                            }}
                                            onClick={() => {
                                              // handleEditTodoEdit(
                                              //   index,
                                              //   "editstatus",
                                              //   false
                                              // );
                                              todoEditStatusEdit(index, false);
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                      {/* {index == allSubQuestions?.length - 1 && ( */}
                                      <Grid item md={0.5} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>&nbsp;</Typography>
                                          <CloseIcon
                                            sx={{
                                              color: "red",
                                              cursor: "pointer",
                                              marginTop: "7px",
                                            }}
                                            onClick={() => {
                                              deleteReferenceTodoEdit(index);
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                      {/* )} */}
                                    </>
                                  )}
                                </>
                              ))}
                        </Grid>
                      </Grid>
                    </>
                  )}
                </>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
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
                <Grid item md={6} xs={12} sm={12}>
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

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("linterviewquestionmaster") && (
        <>
          {!loader ? (
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
              <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    {" "}
                    List Interview Question Masters
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
                      {isUserRoleCompare?.includes(
                        "excelinterviewquestionmaster"
                      ) && (
                          <>
                            <Button
                              onClick={(e) => {
                                setIsFilterOpen(true);
                                // fetchProductionClientRateArray();
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
                        "csvinterviewquestionmaster"
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
                        "printinterviewquestionmaster"
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
                        "pdfinterviewquestionmaster"
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
                        "imageinterviewquestionmaster"
                      ) && (
                          <>
                            <Button
                              sx={userStyle.buttongrp}
                              onClick={handleCaptureImage}
                            >
                              {" "}
                              <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                              &ensp;Image&ensp;{" "}
                            </Button>
                          </>
                        )}
                    </Box>
                  </Grid>
                  <Grid item md={2} xs={12} sm={12}>
                    {/* <AggregatedSearchBar
                    columnDataTable={columnDataTable}
                    setItems={setItems}
                    addSerialNumber={addSerialNumber}
                    setPage={setPage}
                    maindatas={projmaster}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    paginated={true}
                    totalDatas={totalProjectsData}
                  /> */}

                    <FormControl fullWidth size="small">
                      <OutlinedInput size="small"
                        id="outlined-adornment-weight"
                        startAdornment={
                          <InputAdornment position="start">
                            <FaSearch />
                          </InputAdornment>
                        }
                        endAdornment={
                          <InputAdornment position="end">
                            {advancedFilter && (
                              <IconButton onClick={handleResetSearch}>
                                <MdClose />
                              </IconButton>
                            )}
                            <Tooltip title="Show search options">
                              <span>
                                <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearch} />
                              </span>
                            </Tooltip>
                          </InputAdornment>}
                        aria-describedby="outlined-weight-helper-text"
                        inputProps={{ 'aria-label': 'weight', }}
                        type="text"
                        value={getSearchDisplay()}
                        onChange={handleSearchChange}
                        placeholder="Type to search..."
                        disabled={!!advancedFilter}
                      />
                    </FormControl>



                  </Grid>
                </Grid>

                <br />
                <Button
                  sx={userStyle.buttongrp}
                  onClick={() => setColumnVisibility(initialColumnVisibility)}
                >
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
                {isUserRoleCompare?.includes("bdinterviewquestionmaster") && (
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
                {/* <AggridTable
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
                itemsList={totalProjectsData}
              /> */}

                <AggridTableForPaginationTable
                  rowDataTable={rowDataTable}
                  columnDataTable={columnDataTable}
                  columnVisibility={columnVisibility}
                  page={page}
                  setPage={setPage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  setColumnVisibility={setColumnVisibility}

                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  gridRefTable={gridRefTable}


                  totalDatas={totalDatas}

                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={totalProjectsData}
                />
                {/* ****** Table End ****** */}
              </Box>

            </>

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
      <Popover
        id={idSearch}
        open={openSearch}
        anchorEl={anchorElSearch}
        onClose={handleCloseSearch}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
      >
        <Box style={{ padding: "10px", maxWidth: '450px' }}>
          <Typography variant="h6">Advance Search</Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseSearch}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent sx={{ width: "100%" }}>
            <Box sx={{
              width: '350px',
              maxHeight: '400px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <Box sx={{
                maxHeight: '300px',
                overflowY: 'auto',
                // paddingRight: '5px'
              }}>
                <Grid container spacing={1}>
                  <Grid item md={12} sm={12} xs={12}>
                    <Typography>Columns</Typography>
                    <Select fullWidth size="small"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: "auto",
                          },
                        },
                      }}
                      style={{ minWidth: 150 }}
                      value={selectedColumn}
                      onChange={(e) => setSelectedColumn(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Select Column</MenuItem>
                      {filteredSelectedColumn.map((col) => (
                        <MenuItem key={col.field} value={col.field}>
                          {col.headerName}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <Typography>Operator</Typography>
                    <Select fullWidth size="small"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: "auto",
                          },
                        },
                      }}
                      style={{ minWidth: 150 }}
                      value={selectedCondition}
                      onChange={(e) => setSelectedCondition(e.target.value)}
                      disabled={!selectedColumn}
                    >
                      {conditions.map((condition) => (
                        <MenuItem key={condition} value={condition}>
                          {condition}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <Typography>Value</Typography>
                    <TextField fullWidth size="small"
                      value={["Blank", "Not Blank"].includes(selectedCondition) ? "" : filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      disabled={["Blank", "Not Blank"].includes(selectedCondition)}
                      placeholder={["Blank", "Not Blank"].includes(selectedCondition) ? "Disabled" : "Enter value"}
                      sx={{
                        '& .MuiOutlinedInput-root.Mui-disabled': {
                          backgroundColor: 'rgb(0 0 0 / 26%)',
                        },
                        '& .MuiOutlinedInput-input.Mui-disabled': {
                          cursor: 'not-allowed',
                        },
                      }}
                    />
                  </Grid>
                  {additionalFilters.length > 0 && (
                    <>
                      <Grid item md={12} sm={12} xs={12}>
                        <RadioGroup
                          row
                          value={logicOperator}
                          onChange={(e) => setLogicOperator(e.target.value)}
                        >
                          <FormControlLabel value="AND" control={<Radio />} label="AND" />
                          <FormControlLabel value="OR" control={<Radio />} label="OR" />
                        </RadioGroup>
                      </Grid>
                    </>
                  )}
                  {additionalFilters.length === 0 && (
                    <Grid item md={4} sm={12} xs={12} >
                      <Button variant="contained" onClick={handleAddFilter} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                        Add Filter
                      </Button>
                    </Grid>
                  )}

                  <Grid item md={2} sm={12} xs={12}>
                    <Button variant="contained" onClick={() => {
                      fetchProjMaster();
                      handleCloseSearch();
                      setIsSearchActive(true);
                      setAdvancedFilter([
                        ...additionalFilters,
                        { column: selectedColumn, condition: selectedCondition, value: filterValue }
                      ])
                    }} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </DialogContent>
        </Box>
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
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Interview Question Master{" "}
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Mode</Typography>
                  <Typography>Questions</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Category</Typography>
                  <Typography>{projEdit?.category}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Sub Category</Typography>
                  <Typography>{projEdit?.subcategory}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Attend By</Typography>
                  <Typography>{projEdit?.testattendby}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Candidate Status</Typography>
                  <Typography>{projEdit?.candidatestatusexp?.length > 0 ? projEdit?.candidatestatusexp?.join(",") : ""}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Work Mode</Typography>
                  <Typography>{projEdit?.workmode?.length > 0 ? projEdit?.workmode?.join(",") : ""}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Question Preference</Typography>
                  <Typography>{projEdit?.questionpreference || "Default"}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={3} xs={12} sm={12}> </Grid>

              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Question</Typography>
                  <Typography>{projEdit.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Question Description</Typography>
                  <Typography>{projEdit?.questiondescription || ""}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">கேள்வி</Typography>
                  <Typography>{projEdit?.tamilquestion || ""}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    கேள்வி விளக்கம்</Typography>
                  <Typography>{projEdit?.tamilquestiondescription || ""}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3.5} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Do You Have Sub Question</Typography>
                  <Typography>{projEdit.doyouhaveextraquestion}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={2.5} xs={12} sm={6}>
                {projEdit.uploadedimage && (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "10%",
                      }}
                    >
                      <Typography>{projEdit.uploadedimagename}</Typography>
                      <IconButton
                        aria-label="view"
                        onClick={() => {
                          handleViewImageSubEdit(projEdit);
                        }}
                      >
                        <VisibilityOutlinedIcon sx={{ color: "#0B7CED" }} />
                      </IconButton>
                    </div>
                  </div>
                )}
              </Grid>

              {projEdit.doyouhaveextraquestion === "Yes" && (
                <>
                  <br />
                  <br />
                  <Grid item md={12} sm={6} xs={12}>
                    <Grid container spacing={2}>
                      {allSubQuestionsEdit?.length > 0 &&
                        allSubQuestionsEdit?.map((row, index) => (
                          <>
                            <Grid item md={2} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Sub Question Number
                                </Typography>
                                {/* <OutlinedInput
                                  id="component-outlined"
                                  type="text"
                                  placeholder="Please Enter Project Name"
                                  value={row.subquestionnumber}
                                  readOnly
                                /> */}
                                <Typography>{row.subquestionnumber}</Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Question</Typography>
                                {/* <OutlinedInput
                                  id="component-outlined"
                                  type="text"
                                  placeholder="Please Enter Project Name"
                                  value={row.question}
                                  readOnly
                                /> */}
                                <Typography>{row.question}</Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">கேள்வி</Typography>
                                {/* <OutlinedInput
                                  id="component-outlined"
                                  type="text"
                                  placeholder="Please Enter Project Name"
                                  value={row.question}
                                  readOnly
                                /> */}
                                <Typography>{row?.tamilquestion || ""}</Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography
                                  variant="h6"
                                  style={{ fontSize: "18px" }}
                                >
                                  Do You Have Extra Question
                                </Typography>
                                {/* <OutlinedInput
                                  id="component-outlined"
                                  type="text"
                                  placeholder="Please Enter Project Name"
                                  value={row.doyouhaveextraquestion}
                                  readOnly
                                /> */}
                                <Typography>
                                  {row.doyouhaveextraquestion}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={2} xs={12} sm={6}>
                              {row.isuploadimage && (
                                <div>
                                  {row.uploadedimage && (
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: "10%",
                                      }}
                                    >
                                      <Typography>
                                        {row.uploadedimagename}
                                      </Typography>
                                      <IconButton
                                        aria-label="view"
                                        onClick={() => {
                                          handleViewImageSubEdit(row);
                                        }}
                                      >
                                        <VisibilityOutlinedIcon
                                          sx={{ color: "#0B7CED" }}
                                        />
                                      </IconButton>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Grid>
                          </>
                        ))}
                    </Grid>
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
              sx={buttonStyles.buttonsubmit}
            >
              ok
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
              onClick={delProjectcheckbox}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
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
              you sure?
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
        itemsTwo={totalProjectsData ?? []}
        filename={"Interview Question Master"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Interview Question Master Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delProject}
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

export default Interviewquestion;
