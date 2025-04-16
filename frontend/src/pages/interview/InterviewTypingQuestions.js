import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell,
  Select,
  Paper,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
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
import { userStyle, colourStyles } from "../../pageStyle";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import { handleApiError } from "../../components/Errorhandling";
import "jspdf-autotable";
import { FaPrint, FaFilePdf, FaPlus, FaEdit } from "react-icons/fa";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StyledDataGrid from "../../components/TableStyle";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import PageHeading from "../../components/PageHeading";
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
import Selects from "react-select";
import DoneIcon from "@mui/icons-material/Done";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MultiSelect } from "react-multi-select-component";
import LoadingButton from "@mui/lab/LoadingButton";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

function InterviewTypingQuestions() {
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
        rowDataTable.map((item, index) => {
          return {
            "S.No": index + 1,
            category: item.category,
            SubCategory: item.subcategory,
            Question: item.name,
            "Question Type": item.questiontype,
          };
        }),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        projmaster?.map((item, index) => ({
          "S.No": index + 1,
          category: item.category,
          SubCategory: item.subcategory,
          Question: item.name,
          "Question Type": item.questiontype,
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  // pdf.....
  const columns = [
    { title: "Category", field: "category" },
    { title: "Sub Category", field: "subcategory" },
    { title: "Question Name", field: "name" },
    { title: "Question Type", field: "questiontype" },
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
        ? rowDataTable.map((item, index) => {
            return {
              serialNumber: index + 1,
              category: item.category,
              subcategory: item.subcategory,
              name: item.name,
              questiontype: item.questiontype,
            };
          })
        : projmaster?.map((item, index) => ({
            serialNumber: index + 1,
            category: item.category,
            subcategory: item.subcategory,
            name: item.name,
            questiontype: item.questiontype,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("Interview Typing Test Master.pdf");
  };

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [btnSubmit, setBtnSubmit] = useState(false);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [typingTest, setTypingtest] = useState({
    typingtest: true,
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
              data: reader.result.split(",")[1],
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
              data: reader.result.split(",")[1],
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
              data: reader.result.split(",")[1],
              remark: "image file",
            },
          ],
        });
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
          files: [
            {
              filename: file.name,
              preview: reader.result,
              data: reader.result.split(",")[1],
              remark: "image file",
            },
          ],
        };
        setAllSubQuestionsEdit(updatedSingleSubQuestion);
      };
      reader.readAsDataURL(file);
    }
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

  const handleViewImageSubEdit = (data) => {
    const blob = dataURItoBlob(data.uploadedimage);
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl);
  };

  //create todo

  const [allSubQuestions, setAllSubQuestions] = useState([]);

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
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Sub Question Number"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (singleSubQuestionEdit.question === "") {
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
    } else if (
      singleSubQuestionEdit.doyouhaveextraquestion === "Please Select Yes/No"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Yes/No for Do You Have Extra Question"}
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
            {"Question Already Exist"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      singleSubQuestionEdit.question?.toLowerCase() ===
      projEdit?.name?.toLowerCase()
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Question Already Exist"}
          </p>
        </>
      );
      handleClickOpenerr();
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

    if (
      filteredTasks?.length <= 0 &&
      newTasks.length - 1 != index
      // ||
      //   newTasks[newTasks?.length - 1]?.subquestionnumber === checkdel)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {`You Can't Delete All the ${checkdel}`}
          </p>
        </>
      );
      handleClickOpenerr();
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
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Question Already Exist"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (isNameMatchMain) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Question Already Exist"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (newTasks[index]?.question === "") {
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
      } else {
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

  const testingtpeopt = [
    { label: "Numeric", value: "Numeric" },
    { label: "Alpha-Numeric", value: "Alpha-Numeric" },
    { label: "Alpha-Numeric with Image", value: "Alpha-Numeric with Image" },
  ];

  const [projEdit, setProjedit] = useState({
    name: "",
    doyouhaveextraquestion: "Please Select Yes/No",
    isuploadimage: false,
    uploadedimage: null,
    uploadedimagename: null,
  });
  const [projmaster, setProjmaster] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName } =
    useContext(UserRoleAccessContext);

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
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");

  const [canvasState, setCanvasState] = useState(false);

  //image

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "InterviewTypingQuestions.png");
        });
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

  //check delete model
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
    if (selectedRows.length == 0) {
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

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const username = isUserRoleAccess.username;

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
    category: true,
    subcategory: true,
    name: true,
    doyouhaveextraquestion: true,
    actions: true,
    typingtest: true,
    questiontype: true,
    testattendby: true,
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
          mode: "Typing Test",
        }
      );
      if (overallcheck?.data?.mayidelete) {
        await axios.delete(`${SERVICE.INTERVIEWQUESTION_SINGLE}/${projectid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchProjMaster();
        handleCloseMod();
        setSelectedRows([]);
        setPage(1);
        setShowAlert(
          <>
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "green" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              Deleted Successfully
            </p>
          </>
        );
        handleClickOpenerr();
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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

        // Wait for all delete requests to complete
        await Promise.all(deletePromises);

        await fetchProjMaster();

        setShowAlert(
          <>
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "green" }}
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
      await Promise.all(
        valueSubCategoryCat?.map(async (data) => {
          await axios.post(SERVICE.INTERVIEWQUESTION_CREATE, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            category: String(category),
            subcategory: String(data),
            name: String(projectmaster.name),
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
            files: projectmaster.files,
            testattendby: String(
              typingTest.typingtest ? "Candidate" : interviewAttendBy
            ),
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
      setAllSubQuestions([]);

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
      if (!typingTest.typingtest) {
        setTypingtest({
          typingtest: true,
          questiontype: "Please Select Question Type",
        });
        setCategory("Please Select Category");
        setValueSubCategoryCat([]);
        setSelectedOptionsSubCategory([]);
      }

      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "green" }} />
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
    let subcatopt = selectedOptionsSubCategory.map((item) => item.value);
    const isNameMatch = projmaster?.some(
      (item) =>
        item.name?.toLowerCase() === projectmaster.name?.toLowerCase() &&
        item?.category === category &&
        subcatopt?.includes(item?.subcategory)
    );

    const editStatus = allSubQuestions?.some(
      (item) => item.editstatus === true
    );
    if (category === "Please Select Category") {
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
    } else if (valueSubCategoryCat?.length === 0) {
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
    } else if (
      typingTest.typingtest &&
      typingTest.questiontype === "Please Select Question Type"
    ) {
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
    } else if (projectmaster.name === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Question Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      typingTest.typingtest &&
      typingTest.questiontype === "Alpha-Numeric with Image" &&
      projectmaster?.uploadedimage === null
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
    } else if (
      !typingTest.typingtest &&
      projectmaster.doyouhaveextraquestion === "Please Select Yes/No"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Yes/No for do you have sub question"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      !typingTest.typingtest &&
      projectmaster.doyouhaveextraquestion === "Yes" &&
      allSubQuestions.length === 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Add Sub Questions"}
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
            {"Question already Exist!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (editStatus) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Save all the Todo's and Submit"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      projectmaster.isuploadimage === true &&
      projectmaster.uploadedimage === null
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
    } else {
      sendRequest();
    }
  };

  const handleclear = (e) => {
    e.preventDefault();
    setAllSubQuestions([]);

    setTypingtest({
      typingtest: true,
      questiontype: "Please Select Question Type",
    });
    setShowAlert(
      <>
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "green" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          Cleared Successfully
        </p>
      </>
    );
    handleClickOpenerr();
    setCategory("Please Select Category");
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
      // setProjedit(res?.data?.sinterviewquestion);
      setProjedit({
        ...res?.data?.sinterviewquestion,
        testattendby: res?.data?.sinterviewquestion?.testattendby
          ? res?.data?.sinterviewquestion?.testattendby
          : "Both",
      });
      setAllSubQuestionsEdit(res?.data?.sinterviewquestion?.subquestions);
      setOldDatas(res?.data?.sinterviewquestion);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
          files: projEdit.files,
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
        mode: "Typing Test",
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
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "green" }} />
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
    let resdata = await fetchProjMasterAll();
    const isNameMatch = resdata?.some(
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
      projEdit?.subcategory === "" ||
      projEdit?.subcategory === "Please Select Sub Category" ||
      projEdit?.subcategory === undefined
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
    } else if (
      projEdit?.typingtest &&
      projEdit?.questiontype === "Please Select Question Type"
    ) {
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
    } else if (projEdit.name === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Question Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      projEdit?.typingtest &&
      projEdit?.questiontype === "Alpha-Numeric with Image" &&
      projEdit?.uploadedimage === null
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
    } else if (
      !projEdit?.typingtest &&
      projEdit.doyouhaveextraquestion === "Please Select Yes/No"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Yes/No for do you have sub question"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      !projEdit?.typingtest &&
      projEdit.doyouhaveextraquestion === "Yes" &&
      allSubQuestionsEdit.length === 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Add Sub Questions"}
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
            {"Question already Exist!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (editStatus) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Save all the Todo's and Submit"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      projEdit.isuploadimage === true &&
      projEdit.uploadedimage === null
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
    } else {
      // sendEditRequest();
      handleOpenOverallEditPopup();
      handleCloseModEdit();
    }
  };

  //get all project.
  const fetchProjMaster = async () => {
    setPageName(!pageName);
    try {
      setLoader(false);
      let res_project = await axios.get(SERVICE.INTERVIEWTYPINGQUESTION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProjmaster(res_project?.data?.interviewquestions);
      setLoader(true);
    } catch (err) {
      setLoader(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all project.
  const fetchProjMasterAll = async () => {
    setPageName(!pageName);
    try {
      // setLoader(false);
      let res_project = await axios.get(SERVICE.INTERVIEWTYPINGQUESTION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      return res_project?.data?.interviewquestions.filter(
        (item) => item._id !== projEdit._id
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Excel
  const fileName = "Interview Typing Test Master";
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Interview Typing Test Master",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = projmaster?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [projmaster]);
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

  useEffect(() => {
    fetchProjMaster();
    getCategory();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  const [category, setCategory] = useState("Please Select Category");
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
      let questions = response.data.interviewcategory?.filter(
        (item) => item?.mode === "Typing Test"
      );

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
      field: "name",
      headerName: "Question",
      flex: 0,
      width: 250,
      hide: !columnVisibility.name,
      headerClassName: "bold-header",
    },

    {
      field: "questiontype",
      headerName: "Question Type",
      flex: 0,
      width: 130,
      hide: !columnVisibility.questiontype,
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
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("einterviewtypingtestmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id, params.row.name);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}

          {isUserRoleCompare?.includes("dinterviewtypingtestmaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vinterviewtypingtestmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iinterviewtypingtestmaster") && (
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

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      category: item.category,
      subcategory: item.subcategory,
      name: item.name,
      typingtest: item?.typingtest ? "Yes" : "No",
      questiontype: item?.typingtest ? item?.questiontype : "",
      doyouhaveextraquestion: item.doyouhaveextraquestion,
      testattendby: item.testattendby,
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
      <Headtitle title={"Interview Typing Test Master"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Manage Interview Typing Test Master"
        modulename="Interview"
        submodulename="Interview Setup"
        mainpagename="Interview Typingtest Master"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("ainterviewtypingtestmaster") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Interview Typing Test Master
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
                      value="Typing Test"
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
                            item?.mode === "Typing Test"
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

                {typingTest.typingtest ? (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Question Type <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={testingtpeopt}
                          styles={colourStyles}
                          value={{
                            label: typingTest.questiontype,
                            value: typingTest.questiontype,
                          }}
                          onChange={(e) => {
                            setTypingtest({
                              ...typingTest,
                              questiontype: e.value,
                            });
                            setProjectmaster({
                              ...projectmaster,
                              name: "",
                            });
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
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={10} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Question Name <b style={{ color: "red" }}>*</b>
                        </Typography>

                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={5}
                          value={projectmaster.name}
                          disabled={
                            typingTest?.questiontype ===
                            "Please Select Question Type"
                          }
                          onChange={(e) => {
                            if (typingTest.questiontype === "Numeric") {
                              const numericOnly = e.target.value.replace(
                                /[^0-9.;\s]/g,
                                ""
                              );
                              setProjectmaster({
                                ...projectmaster,
                                name: numericOnly,
                              });
                            } else {
                              setProjectmaster({
                                ...projectmaster,
                                name: e.target.value,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    {typingTest.questiontype === "Alpha-Numeric with Image" && (
                      <Grid item md={6} xs={12} sm={6}>
                        <Button variant="contained" component="label">
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
                        {projectmaster.isuploadimage && (
                          <div>
                            {projectmaster.uploadedimage && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginTop: "-20px",
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
                    )}
                  </>
                ) : (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
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
                  </>
                )}
              </Grid>
              <br />
              <br />
              <Grid container>
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
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleclear}>
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
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Interview Typing Test Master
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
                      value="Typing Test"
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
                            item?.mode === "Typing Test"
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

                {projEdit?.typingtest ? (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Question Type <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={testingtpeopt}
                          styles={colourStyles}
                          value={{
                            label: projEdit?.questiontype,
                            value: projEdit?.questiontype,
                          }}
                          onChange={(e) => {
                            setProjedit({
                              ...projEdit,
                              questiontype: e.value,
                              name: "",
                              doyouhaveextraquestion: "Please Select Yes/No",
                              isuploadimage: false,
                              uploadedimage: null,
                              uploadedimagename: null,
                              files: [],
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={10} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Question Name <b style={{ color: "red" }}>*</b>
                        </Typography>

                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={5}
                          value={projEdit.name}
                          disabled={
                            projEdit?.questiontype ===
                            "Please Select Question Type"
                          }
                          onChange={(e) => {
                            if (projEdit?.questiontype === "Numeric") {
                              const numericOnly = e.target.value.replace(
                                /[^0-9.;\s]/g,
                                ""
                              );
                              setProjedit({
                                ...projEdit,
                                name: numericOnly,
                              });
                            } else {
                              setProjedit({
                                ...projEdit,
                                name: e.target.value,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    {projEdit?.questiontype === "Alpha-Numeric with Image" && (
                      <Grid item md={6} xs={12} sm={6}>
                        <Button variant="contained" component="label">
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
                        {projEdit.isuploadimage && (
                          <div>
                            {projEdit.uploadedimage && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginTop: "-20px",
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
                    )}
                  </>
                ) : (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
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
                    <Grid item md={8} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Question Name <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Question Name"
                          value={projEdit.name}
                          onChange={(e) => {
                            setProjedit({ ...projEdit, name: e.target.value });
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
                        <Grid item md={2.5} xs={12} sm={12}>
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
                              Question <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Please Enter Question"
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
                            onClick={addSubquestionTodoEdit}
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
                                            <Typography>Question</Typography>
                                            <OutlinedInput
                                              id="component-outlined"
                                              type="text"
                                              value={row.question}
                                              readOnly
                                            />
                                          </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Question</Typography>
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
                                                      handleViewImageSubEdit(
                                                        row
                                                      );
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
                                              onClick={() => {
                                                todoEditStatusEdit(index, true);
                                              }}
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
                                              onClick={() => {
                                                deleteReferenceTodoEdit(index);
                                              }}
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
                                                label:
                                                  row.doyouhaveextraquestion,
                                                value:
                                                  row.doyouhaveextraquestion,
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
                                                todoEditStatusEdit(
                                                  index,
                                                  false
                                                );
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
                )}
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" onClick={editSubmit}>
                    {" "}
                    Update
                  </Button>
                </Grid>
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
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
      {isUserRoleCompare?.includes("linterviewtypingtestmaster") && (
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
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  {" "}
                  List Interview Typing Test Master
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
                      {/* <MenuItem value={projmaster?.length}>All</MenuItem> */}
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
                      "excelinterviewtypingtestmaster"
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
                      "csvinterviewtypingtestmaster"
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
                        </Button>{" "}
                      </>
                    )}
                    {isUserRoleCompare?.includes(
                      "printinterviewtypingtestmaster"
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
                      "pdfinterviewtypingtestmaster"
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
                      "imageinterviewtypingtestmaster"
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
              <Button
                sx={userStyle.buttongrp}
                onClick={handleOpenManageColumns}
              >
                Manage Columns
              </Button>
              &ensp;
              {isUserRoleCompare?.includes("bdinterviewtypingtestmaster") && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleClickOpenalert}
                >
                  Bulk Delete
                </Button>
              )}
              <br />
              <br />
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
                  {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                  {filteredDatas?.length} entries
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
              {/* ****** Table End ****** */}
            </Box>
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
            <Button
              onClick={handleCloseMod}
              style={{
                backgroundColor: "#f4f4f4",
                color: "#444",
                boxShadow: "none",
                borderRadius: "3px",
                border: "1px solid #0000006b",
                "&:hover": {
                  "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                    backgroundColor: "#f4f4f4",
                  },
                },
              }}
            >
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delProject(projectid)}
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
                Interview Typing Test Master Info
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
                <TableCell> SI.No</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Sub Ctaegory</TableCell>
                <TableCell>Question Name</TableCell>
                <TableCell>Question Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.subcategory}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.questiontype}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer
          component={Paper}
          style={{
            display: canvasState === false ? "none" : "block",
          }}
        >
          <Table
            sx={{ minWidth: 700 }}
            aria-label="customized table"
            id="excelcanvastable"
            ref={gridRef}
          >
            <TableHead>
              <TableRow>
                <TableCell> SI.No</TableCell>
                <TableCell>Project Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {filteredData &&
                filteredData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
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
        maxWidth="lg"
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Interview Typing Test Master{" "}
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Mode</Typography>
                  <Typography>Typing Test</Typography>
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
              {projEdit?.typingtest && (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Question Type</Typography>
                      <Typography>{projEdit.questiontype}</Typography>
                    </FormControl>
                  </Grid>
                </>
              )}
              <Grid item md={9.5} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Question Name</Typography>
                  <Typography>{projEdit.name}</Typography>
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
            </Grid>
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
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
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

export default InterviewTypingQuestions;
