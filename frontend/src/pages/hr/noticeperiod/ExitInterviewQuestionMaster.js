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
import { colourStyles, userStyle } from "../../../pageStyle";
import Selects from "react-select";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingButton from "@mui/lab/LoadingButton";
import { FaPrint, FaFilePdf, FaPlus } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import { handleApiError } from "../../../components/Errorhandling";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import StyledDataGrid from "../../../components/TableStyle";
import { useReactToPrint } from "react-to-print";
import { AiOutlineClose } from "react-icons/ai";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
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
import { MultiSelect } from "react-multi-select-component";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

function ExitInterviewQuestionMaster() {
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
        filteredData?.map((item, index) => ({
          SNo: index + 1,
          Category: item?.category,
          Subcategory: item.subcategory,
          QuestionType: item.questiontype,
          Question: item.question,
          Type: item.type,
          Options: item.options,

        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items?.map((item, index) => ({
          SNo: index + 1,
          Category: item?.category,
          Subcategory: item.subcategory,
          QuestionType: item.questiontype,
          Question: item.question,
          Type: item.type,
          Options: item.options,
      
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  // pdf.....
  const columns = [
    { title: "Category", field: "category" },
    { title: "SubCategory", field: "subcategory" },
    { title: "Question Type", field: "questiontype" },
    { title: "Question", field: "question" },
    { title: "Type", field: "type" },
    { title: "Options", field: "options" },
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
        ? filteredData?.map((item, index) => ({
            serialNumber: index + 1,
            category: item?.category,
            subcategory: item.subcategory,
            questiontype: item.questiontype,
            question: item.question,
            type: item.type,
            options: item.options,
            status: item.status,
            answers: item.answers,
          }))
        : items?.map((item, index) => ({
            serialNumber: index + 1,
            category: item?.category,
            subcategory: item.subcategory,
            questiontype: item.questiontype,
            question: item.question,
            type: item.type,
            options: item.options,
            status: item.status,
            answers: item.answers,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("Exit Interview Question Master.pdf");
  };

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
  const [optionsText, setOptionsText] = useState("");
  const [optionsTextEdit, setOptionsTextEdit] = useState("");
  const [optionsEdit, setOptionsEdit] = useState("");
  const [optionstodo, setOptionstodo] = useState([]);
  const [optionstodoEdit, setOptionstodoEdit] = useState([]);

  const testingtpeopt = [
    { label: "Numeric", value: "Numeric" },
    { label: "Alpha-Numeric", value: "Alpha-Numeric" },
    { label: "Alpha-Numeric with Image", value: "Alpha-Numeric with Image" },
  ];

  const addTodo = () => {
    console.log("inside")
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
            {"Please Enter Options"}
          </p>
        </>
      );
      handleClickOpenerr();
    } 
    // else if (
    //   (type === "Radio" || type === "MultipleChoice") &&
    //   status === "Please Select Status"
    // ) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {"Please Select Status"}
    //       </p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // } 
    // else if (
    //   (status === "Please Select Status" || status === "") &&
    //   type !== "Yes/No" &&
    //   type !== "Correct/In Correct"
    // ) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {"Please Select Status"}
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
            {"Already Added ! Please Enter Another Options "}
          </p>
        </>
      );
      handleClickOpenerr();
    } 
    else {
      if (type === "Radio" || type === "MultipleChoice") {
        const data = {
          options: options,
          status: status,
          type: type,
        };
        setOptionstodo([...optionstodo, data]);
        setOptions("");
        setStatus("Please Select Status");
      } 
      else if (type === "Yes/No") {
        const data = [
          {
            options: "Yes",
            type: type,
            status: "Eligible",
          },
          {
            options: "No",
            status: "Not-Eligible",
            type: type,
          },
        ];
        setOptionstodo(data);
        setOptions("");
        setStatus("Please Select Status");
      } 
      else if (type === "Correct/In Correct") {
        const data = [
          {
            options: "Correct",
            status: "Eligible",
            type: type,
          },
          {
            options: "In Correct",
            status: "Not-Eligible",
            type: type,
          },
        ];
        setOptionstodo(data);
        setOptions("");
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
              {"Already Added ! Please Enter Another Options "}
            </p>
          </>
        );
        handleClickOpenerr();
        return;
      }
    }
    const updatedTodos = [...optionstodo];
    if (value === "options") {
      updatedTodos[index].options = newValue;
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
          data: reader.result.split(",")[1],
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
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Options"}
          </p>
        </>
      );
      handleClickOpenerr();
    } 
    // else if (
    //   (typeEdit === "Radio" || typeEdit === "MultipleChoice") &&
    //   statusEdit === "Please Select Status"
    // ) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {"Please Select Status"}
    //       </p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // } else if (
    //   statusEdit === "Please Select Status" &&
    //   typeEdit !== "Yes/No" &&
    //   typeEdit !== "Correct/In Correct"
    // ) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {"Please Select Status"}
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
            {"Already Added ! Please Enter Another Options "}
          </p>
        </>
      );
      handleClickOpenerr();
    } 
    else {
      if (typeEdit === "Radio" || typeEdit === "MultipleChoice") {
        const data = {
          options: optionsEdit,
          status: statusEdit,
          type: typeEdit,
        };
        setOptionstodoEdit([...optionstodoEdit, data]);
        setOptionsEdit("");
        setStatusEdit("Please Select Status");
      } else if (typeEdit === "Yes/No") {
        const data = [
          {
            options: "Yes",
            type: typeEdit,
            status: "Eligible",
          },
          {
            options: "No",
            status: "Not-Eligible",
            type: typeEdit,
          },
        ];
        setOptionstodoEdit(data);
        setOptionsEdit("");
        setStatusEdit("Please Select Status");
      } else if (typeEdit === "Correct/In Correct") {
        const data = [
          {
            options: "Correct",
            status: "Eligible",
            type: typeEdit,
          },
          {
            options: "In Correct",
            status: "Not-Eligible",
            type: typeEdit,
          },
        ];
        setOptionstodoEdit(data);
        setOptionsEdit("");
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
              {"Already Added ! Please Enter Another Options "}
            </p>
          </>
        );
        handleClickOpenerr();
        return;
      }
    }
    const updatedTodos = [...optionstodoEdit];
    if (value === "options") {
      updatedTodos[index].options = newValue;
    } else if (value === "description") {
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
          saveAs(blob, "Exit Interview Question Master.png");
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
        ...res.data.interviewcategory
          ?.filter((data) => data?.mode === "Exit Interview")
          ?.map((d) => ({
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
        .filter(
          (data) =>
            data?.mode === "Exit Interview" && data.categoryname === e
        )
        .flatMap((d) => d.subcategoryname);
      setSubCategoryOption(
        catall?.map((data) => ({ label: data, value: data }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
        .filter(
          (data) =>
            data?.mode === "Exit Interview" && data.categoryname === e
        )
        .flatMap((d) => d.subcategoryname);
      setSubCategoryOptionEdit(
        catall?.map((data) => ({ label: data, value: data }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
        `${SERVICE.SINGLEEXITINTERVIEWQUESTION}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setDeleteRound(res?.data?.sexitinterviewquestion);
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
        await axios.delete(`${SERVICE.SINGLEEXITINTERVIEWQUESTION}/${e}`, {
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
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const delRoundcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLEEXITINTERVIEWQUESTION}/${item}`, {
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

      await fetchRoundmaster();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Deleted Successfully
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //add function
  const sendRequest = async (data) => {
    setPageName(!pageName);
    try {
      await axios.post(SERVICE.CREATEEXITINTERVIEWQUESTION, {
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
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchRoundmaster();
      setQuestion("");
      setType("Please Select Type");
      setOptionstodo([]);
      setOptions("");
      setStatus("Please Select Status");
      setDate("");
      setOptionsText("");

      setdocumentFiles([]);
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Added Successfully
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = roundmasters.some(
      (item) =>
        item?.category?.toLowerCase() === category.toLowerCase() &&
        valueSubCategory.includes(item.subcategory) &&
        item.question.toLowerCase() === question.toLowerCase()
    );
    if (category === "" || category === "Please Select Category") {
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
    } else if (selectedSubCategoryOptions?.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select SubCategory"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (questionType === "Please Select Question Type") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Question Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (question === "" || question === undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Question"}
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
      (type === "Radio" ||
        type === "MultipleChoice" ||
        type === "Yes/No" ||
        type === "Correct/In Correct") &&
      optionstodo?.length < 1
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {`Please Create Options for ${type}`}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (type === "Radio" ||
        type === "MultipleChoice" ||
        type === "Yes/No" ||
        type === "Correct/In Correct") &&
      optionstodo?.length > 0 &&
      optionstodo?.length < 2
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {`Please Add Atleast Two Options`}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (type === "Radio" || type === "MultipleChoice") &&
      optionstodo?.some((item) => item.options.trim() === "")
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Fill All the Options"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      questionType === "Alpha-Numeric with Image" &&
      documentFiles?.length === 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Upload Image"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Data already Exist!"}
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
    } else {
      if (valueSubCategory.length > 0) {
        valueSubCategory?.map((data) => {
          sendRequest(data);
        });
      }
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
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

    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
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
      let res = await axios.get(`${SERVICE.SINGLEEXITINTERVIEWQUESTION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRoundmasterEdit(res?.data?.sexitinterviewquestion);
      setCategoryEdit(res?.data?.sexitinterviewquestion?.category);
      setSubCategoryEdit(res?.data?.sexitinterviewquestion?.subcategory);
      fetchSubCategoryEdit(res?.data?.sexitinterviewquestion?.category);
      setTypeEdit(res?.data?.sexitinterviewquestion?.type);
      setdocumentFilesEdit(res?.data?.sexitinterviewquestion?.documentFiles);
      setOptionsTextEdit(res?.data?.sexitinterviewquestion?.answers);
      setDateEdit(res?.data?.sexitinterviewquestion?.date);
      setQuestionTypeEdit(
        res?.data?.sexitinterviewquestion?.questiontype
          ? res?.data?.sexitinterviewquestion?.questiontype
          : "Please Select Question Type"
      );

      setOptionstodoEdit(res?.data?.sexitinterviewquestion?.optionArr);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLEEXITINTERVIEWQUESTION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRoundmasterEdit(res?.data?.sexitinterviewquestion);
      setdocumentFilesEdit(res?.data?.sexitinterviewquestion?.documentFiles);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLEEXITINTERVIEWQUESTION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRoundmasterEdit(res?.data?.sexitinterviewquestion);
      handleClickOpeninfo();
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
        `${SERVICE.SINGLEEXITINTERVIEWQUESTION}/${subprojectsid}`,
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
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Updated Successfully
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      subCategoryEdit === "" ||
      subCategoryEdit === "Please Select SubCategory" ||
      subCategoryEdit === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select SubCategory"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (questionTypeEdit === "Please Select Question Type") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Question Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      roundmasterEdit?.question === "" ||
      roundmasterEdit?.question === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Question"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (typeEdit === "Please Select Type") {
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
      (typeEdit === "Radio" ||
        typeEdit === "MultipleChoice" ||
        typeEdit === "Yes/No" ||
        typeEdit === "Correct/In Correct") &&
      optionstodoEdit?.length < 1
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {`Please Create Options for ${type}`}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (typeEdit === "Radio" ||
        typeEdit === "MultipleChoice" ||
        typeEdit === "Yes/No" ||
        typeEdit === "Correct/In Correct") &&
      optionstodoEdit?.length > 0 &&
      optionstodoEdit?.length < 2
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {`Please Add Atleast Two Options`}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (typeEdit === "Radio" || typeEdit === "MultipleChoice") &&
      optionstodoEdit?.some((item) => item.options.trim() === "")
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Fill All the Options"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      questionTypeEdit === "Alpha-Numeric with Image" &&
      documentFilesEdit?.length === 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Upload Image"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Data already Exist!"}
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
    } else {
      sendEditRequest();
    }
  };

  //get all Sub vendormasters.
  const fetchRoundmaster = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.ALLEXITINTERVIEWQUESTIONS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setRoundmasters(res_vendor?.data?.exitquestions);
      setRoundmastercheck(true);
    } catch (err) {
      setRoundmastercheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all Sub vendormasters.
  const fetchRoundmasterAll = async (e) => {
    setPageName(!pageName);
    try {
      let res_meet = await axios.get(SERVICE.ALLEXITINTERVIEWQUESTIONS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllRoundmasteredit(
        res_meet?.data?.exitquestions.filter((item) => item._id !== e)
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Excel
  const fileName = "Exit Interview Question Master";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Exit Interview Question Master",
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

  const addSerialNumber = () => {
    const itemsWithSerialNumber = roundmasters?.map((item, index) => ({
      serialNumber: index + 1,
      id: item._id,
      question: item.question,
      category: item?.category,
      subcategory: item.subcategory,
      type: item.type,
      answers: item.answers,
      questiontype: item.questiontype,
      dateRange:
        item?.dateRangefrom && item.dateRangeto
          ? `${moment(item?.dateRangefrom).format("DD-MM-YYYY")} - ${moment(
              item.dateRangeto
            ).format("DD-MM-YYYY")}`
          : "",
      date: item.date ? moment(item.date).format("DD-MM-YYYY") : "",
      options: item.optionArr
        ?.map((t, i) => `${i + 1 + ". "}` + t.options)
        .toString(),
      status: item.optionArr
        ?.map((t, i) => `${i + 1 + ". "}` + t.status)
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
      width: 75,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0,
      width: 150,
      hide: !columnVisibility.category,
      headerClassName: "bold-header",
    },
    {
      field: "subcategory",
      headerName: "SubCategory",
      flex: 0,
      width: 150,
      hide: !columnVisibility.subcategory,
      headerClassName: "bold-header",
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
    // {
    //   field: "status",
    //   headerName: "Status",
    //   flex: 0,
    //   width: 200,
    //   hide: !columnVisibility.status,
    //   headerClassName: "bold-header",
    // },
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
          {isUserRoleCompare?.includes("eexitinterviewquestionmaster") && (
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

          {isUserRoleCompare?.includes("dexitinterviewquestionmaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vexitinterviewquestionmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iexitinterviewquestionmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
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
      <Headtitle title={"EXIT INTERVIEW QUESTION MASTER"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Exit Interview Question Master"
        modulename="Interview"
        submodulename="Exit Interview"
        mainpagename="Exit Interview Question Master"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aexitinterviewquestionmaster") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Exit Interview Question Master
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
                      value="Exit Interview"
                      readOnly
                    />
                  </FormControl>
                </Grid>

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
                        {/* <Grid item md={3} xs={12} sm={12}>
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
                        </Grid> */}
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
                                  {/* <FormControl fullWidth size="small">
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
                                  </FormControl> */}
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
                {/* {(type === "TextBox" ||
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
                )} */}

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
                      Edit Exit Interview Question Master
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
                        value="Exit Interview "
                        readOnly
                      />
                    </FormControl>
                  </Grid>
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
                          if (questionType === "Numeric") {
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
                          {/* <Grid item md={3} xs={12} sm={12}>
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
                          </Grid> */}
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
                                    {/* <FormControl fullWidth size="small">
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
                                    </FormControl> */}
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
                  {/* {(typeEdit === "TextBox" ||
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
                  )} */}

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
      {isUserRoleCompare?.includes("lexitinterviewquestionmaster") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Exit Interview Question Master List
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
                  {isUserRoleCompare?.includes(
                    "excelexitinterviewquestionmaster"
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
                    "csvexitinterviewquestionmaster"
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
                    "printexitinterviewquestionmaster"
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
                    "pdfexitinterviewquestionmaster"
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
                    "imageexitinterviewquestionmaster"
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
                Exit Interview Question Master Info
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
                <TableCell>Category</TableCell>
                <TableCell>SubCategory</TableCell>
                <TableCell>Question Type</TableCell>
                <TableCell>Question</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Options</TableCell>
                {/* <TableCell>Status</TableCell>
                <TableCell>Answers</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {filteredData &&
                filteredData?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.subcategory}</TableCell>
                    <TableCell>{row.questiontype}</TableCell>
                    <TableCell>{row.question}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.options}</TableCell>
                    {/* <TableCell>{row.status}</TableCell>
                    <TableCell>{row.answers}</TableCell> */}
                    {/* <TableCell>{row.dateRange}</TableCell>
                    <TableCell>{row.date}</TableCell> */}
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
              View Exit Interview Question Master
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Mode</Typography>
                  <Typography>Exit Interview </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Category</Typography>
                  <Typography>{roundmasterEdit.category}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Sub Category</Typography>
                  <Typography>{roundmasterEdit.subcategory}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Question Type</Typography>
                  <Typography>{roundmasterEdit.questiontype}</Typography>
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
                  {/* <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Status</Typography>
                      <Typography>
                        {roundmasterEdit.optionArr
                          ?.map((t, i) => `${i + 1 + ". "}` + t.status)
                          .toString()}
                      </Typography>
                    </FormControl>
                  </Grid> */}
                </>
              )}
              {/* {["TextBox", "Text-Alpha", "Text-Numeric"].includes(
                roundmasterEdit.type
              ) && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Answers</Typography>
                    <Typography>{roundmasterEdit.answers}</Typography>
                  </FormControl>
                </Grid>
              )} */}
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
              Are you sure?
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
    </Box>
  );
}

export default ExitInterviewQuestionMaster;
