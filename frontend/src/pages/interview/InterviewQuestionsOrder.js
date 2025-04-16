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
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import { handleApiError } from "../../components/Errorhandling";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import StyledDataGrid from "../../components/TableStyle";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import PageHeading from "../../components/PageHeading";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

function InterviewQuestionsOrder() {
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
            Designation: item.designation,
            Round: item.round,
            Type: item.type,
            Category: item.category,
            Subcategory: item.subcategory,
            Question: item.question,
          };
        }),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        interviewgroupingall?.map((item, index) => ({
          "S.No": index + 1,
          Designation: item.designation,
          Round: item.round,
          Type: item.type,
          Category: item.category,
          Subcategory: item.subcategory,
          Question: item.question.join(",").toString(),
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  // pdf.....
  const columns = [
    { title: "Designation", field: "designation" },
    { title: "Round", field: "round" },
    { title: "Type", field: "type" },
    { title: "Category", field: "category" },
    { title: "Subcategory", field: "subcategory" },
    { title: "Question", field: "question" },
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
              designation: item.designation,
              round: item.round,
              type: item.type,
              category: item.category,
              subcategory: item.subcategory,
              question: item.question,
            };
          })
        : interviewgroupingall?.map((item, index) => ({
            serialNumber: index + 1,
            designation: item.designation,
            round: item.round,
            type: item.type,
            category: item.category,
            subcategory: item.subcategory,
            question: item.question.join(",").toString(),
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("InterviewQuestionsOrder.pdf");
  };

  const [interviewgrouping, setInterviewgrouping] = useState({
    designation: "Please Select Designation",
    round: "Please Select Round",
    type: "Please Select Type",
    category: "Please Select Category",
    subcategory: "Please Select Subcategory",
    question: "",
  });

  const [typeAvail, setTypeAvail] = useState("");
  const [typeAvailEdit, setTypeAvailEdit] = useState("");

  const [interviewgroupingEdit, setInterviewgroupingEdit] = useState({
    designation: "Please Select Designation",
    round: "Please Select Round",
    type: "Please Select Type",
    category: "Please Select Category",
    subcategory: "Please Select Subcategory",
    question: "",
  });

  const [interviewgroupingall, setInterviewgroupingall] = useState([]);
  const [interviewGroupingValues, setInterviewGroupingValues] = useState([]);
  const [designation, setDesignation] = useState([]);
  useEffect(() => {
    fetchInterviewgrouping();
    fetchInterviewOrders();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName } =
    useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [reasonmasterCheck, setReasonmastercheck] = useState(false);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [interviewquestionsall, setInterviewquestionall] = useState([]);
  const [interviewquestionsallCheck, setInterviewquestionallCheck] = useState(
    []
  );
  const [interviewquestionsallCheckEdit, setInterviewquestionallCheckEdit] =
    useState([]);
  const [interviewquestionallDragEdit, setInterviewquestionallDragEdit] =
    useState([]);

  const [duration, setDuration] = useState("");
  const [durationEdit, setDurationEdit] = useState("");

  const [marksDetails, setMarksDetails] = useState({
    totalmarks: 0,
    eligiblemarks: 0,
    comparisontype: "",
  });
  const [marksDetailsEdit, setMarksDetailsEdit] = useState({
    totalmarks: 0,
    eligiblemarks: 0,
    comparisontype: "",
  });

  useEffect(() => {
    const particularData = interviewGroupingValues?.find(
      (item) =>
        item.designation === interviewgrouping?.designation &&
        item.round === interviewgrouping?.round &&
        (typeAvail ? item.type === interviewgrouping?.type : true) &&
        item.category === interviewgrouping?.category &&
        item.subcategory === interviewgrouping?.subcategory
    );
    setInterviewquestionall(particularData?.question ?? []);
    setInterviewquestionallCheck(particularData?.interviewForm ?? []);

    setDuration(particularData?.duration ?? "");
    setMarksDetails({
      totalmarks: particularData?.totalmarks,
      eligiblemarks: particularData?.eligiblemarks,
      comparisontype: particularData?.markcomparison,
    });
  }, [
    interviewgrouping?.designation,
    interviewgrouping?.round,
    interviewgrouping?.type,
    interviewgrouping?.category,
    interviewgrouping?.subcategory,
  ]);

  useEffect(() => {
    const particularData = interviewGroupingValues?.find(
      (item) =>
        item.designation === interviewgroupingEdit?.designation &&
        item.category === interviewgroupingEdit?.category &&
        (typeAvailEdit ? item.type === interviewgroupingEdit?.type : true) &&
        item.round === interviewgroupingEdit?.round &&
        item.subcategory === interviewgroupingEdit?.subcategory
    );

    setDurationEdit(particularData?.duration ?? "");
    setInterviewquestionallCheckEdit(particularData?.interviewForm ?? []);
    setInterviewquestionallDragEdit(particularData?.question ?? []);

    setMarksDetailsEdit({
      totalmarks: particularData?.totalmarks,
      eligiblemarks: particularData?.eligiblemarks,
      comparisontype: particularData?.markcomparison,
    });
  }, [
    interviewgroupingEdit?.designation,
    interviewgroupingEdit?.round,
    interviewgroupingEdit?.type,
    interviewgroupingEdit?.category,
    interviewgroupingEdit?.subcategory,
  ]);

  const DraggableQuestion = ({
    question,
    index,
    moveQuestion,
    updatedQuestions,
    setUpdatedQuestions,
  }) => {
    const [, ref] = useDrag({
      type: "QUESTION",
      item: { index },
    });

    const [, drop] = useDrop({
      accept: "QUESTION",
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          moveQuestion(draggedItem.index, index);
          draggedItem.index = index;
          setUpdatedQuestions(updatedQuestions);
        }
      },
    });

    return (
      <div
        ref={(node) => ref(drop(node))}
        style={{
          padding: "8px",
          border: "1px solid #ccc",
          marginBottom: "4px",
          cursor: "grab",
          ":active": {
            cursor: "grabbing",
          },
        }}
      >
        {question}
      </div>
    );
  };
  const DragDropList = ({ questions, answerTodo }) => {
    const [orderedQuestions, setOrderedQuestions] = useState(questions);
    const [updatedQuestions, setUpdatedQuestions] = useState(questions);

    useEffect(() => {
      setUpdatedQuestions(orderedQuestions);
    }, [orderedQuestions]);
    const moveQuestion = (fromIndex, toIndex) => {
      const updatedQuestionsCopy = [...orderedQuestions];
      const [movedQuestion] = updatedQuestionsCopy.splice(fromIndex, 1);
      updatedQuestionsCopy.splice(toIndex, 0, movedQuestion);
      setOrderedQuestions(updatedQuestionsCopy);
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      const isNameMatch = interviewgroupingall.some(
        (item) =>
          item.designation === interviewgrouping.designation &&
          item.round === interviewgrouping.round &&
          (typeAvail ? item.type === interviewgrouping.type : true) &&
          item.category === interviewgrouping.category &&
          item.subcategory === interviewgrouping.subcategory
      );

      if (interviewgrouping.designation === "Please Select Designation") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Designation"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (interviewgrouping.round === "Please Select Round") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Round"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (typeAvail && interviewgrouping.type === "Please Select Type") {
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
      } else if (interviewgrouping.category === "Please Select Category") {
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
        interviewgrouping.subcategory === "Please Select Subcategory"
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Subcategory"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (orderedQuestions?.length === 0) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"No Questions To Order"}
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
              {"Interview Question Order Already Exist!"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else {
        sendRequest();
      }
    };

    const sendRequest = async () => {
      setPageName(!pageName);
      try {
        await axios.post(SERVICE.INTERVIEWQUESTIONSORDER_CREATE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          designation: String(interviewgrouping.designation),
          category: String(interviewgrouping.category),
          subcategory: String(interviewgrouping.subcategory),
          round: String(interviewgrouping.round),

          totalmarks: Number(marksDetails?.totalmarks),
          eligiblemarks: Number(marksDetails?.eligiblemarks),
          markcomparison: String(marksDetails?.comparisontype),

          type: String(
            interviewgrouping.type === "Please Select Type"
              ? ""
              : interviewgrouping.type
          ),
          duration: String(duration),
          question: [...orderedQuestions],
          interviewForm: answerTodo,
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
        await fetchInterviewOrders();
        setInterviewgrouping({
          ...interviewgrouping,
          category: "Please Select Category",
          subcategory: "Please Select Subcategory",
          round: "Please Select Round",
          type: "Please Select Type",
        });
        setShowAlert(
          <>
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Added Successfully👍"}
            </p>
          </>
        );
        handleClickOpenerr();
      } catch (err) {
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    };

    return (
      <div>
        {updatedQuestions?.map((question, index) => (
          <DraggableQuestion
            key={index}
            question={question}
            index={index}
            moveQuestion={moveQuestion}
            updatedQuestions={updatedQuestions}
            setUpdatedQuestions={setUpdatedQuestions}
          />
        ))}
        <Grid container spacing={2}>
          <Grid item md={12} xs={12} sm={12}></Grid>
          <Grid item md={12} xs={12} sm={12}></Grid>
          <Grid item md={2.5} xs={12} sm={6}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
          <Grid item md={2.5} xs={12} sm={6}>
            <Button sx={userStyle.btncancel} onClick={handleClear}>
              Clear
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  };
  const DraggableQuestionEdit = ({
    question,
    index,
    moveQuestion,
    updatedQuestionsEdit,
    setUpdatedQuestionsEdit,
  }) => {
    const [, ref] = useDrag({
      type: "QUESTION",
      item: { index },
    });

    const [, drop] = useDrop({
      accept: "QUESTION",
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          moveQuestion(draggedItem.index, index);
          draggedItem.index = index;
          setUpdatedQuestionsEdit(updatedQuestionsEdit);
        }
      },
    });

    return (
      <div
        ref={(node) => ref(drop(node))}
        style={{
          padding: "8px",
          border: "1px solid #ccc",
          marginBottom: "4px",
          cursor: "grab",
          ":active": {
            cursor: "grabbing",
          },
        }}
      >
        {question}
      </div>
    );
  };
  const DragDropListEdit = ({ questions, answerTodo }) => {
    const [orderedQuestionsEdit, setOrderedQuestionsEdit] = useState(questions);
    const [updatedQuestionsEdit, setUpdatedQuestionsEdit] = useState(questions);

    useEffect(() => {
      setUpdatedQuestionsEdit(orderedQuestionsEdit);
    }, [orderedQuestionsEdit]);
    const moveQuestion = (fromIndex, toIndex) => {
      const updatedQuestionsCopy = [...orderedQuestionsEdit];
      const [movedQuestion] = updatedQuestionsCopy.splice(fromIndex, 1);
      updatedQuestionsCopy.splice(toIndex, 0, movedQuestion);
      setOrderedQuestionsEdit(updatedQuestionsCopy);
    };

    const editSubmit = async (e) => {
      e.preventDefault();
      let resdata = await fetchInterviewgroupingall();
      const isNameMatch = resdata.some(
        (item) =>
          item.designation === interviewgroupingEdit.designation &&
          item.round === interviewgroupingEdit.round &&
          (typeAvailEdit ? item.type === interviewgroupingEdit?.type : true) &&
          item.category === interviewgroupingEdit.category &&
          item.subcategory === interviewgroupingEdit.subcategory
      );

      if (interviewgroupingEdit.designation === "Please Select Designation") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Designation"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (
        interviewgroupingEdit.round === "Please Select Round" ||
        interviewgroupingEdit.round === ""
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Round"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (
        (typeAvailEdit &&
          interviewgroupingEdit.type === "Please Select Type") ||
        interviewgroupingEdit.type === ""
      ) {
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
      } else if (interviewgroupingEdit.category === "Please Select Category") {
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
        interviewgroupingEdit.subcategory === "Please Select Subcategory"
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Subcategory"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (orderedQuestionsEdit?.length === 0) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"No Questions To Order"}
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
              {"Interview Question Order already Exist!"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else {
        sendEditRequest();
      }
    };

    //editing the single data...
    const sendEditRequest = async () => {
      setPageName(!pageName);
      try {
        let res = await axios.put(
          `${SERVICE.INTERVIEWQUESTIONSORDER_SINGLE}/${subprojectsid}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            totalmarks: Number(marksDetailsEdit?.totalmarks),
            eligiblemarks: Number(marksDetailsEdit?.eligiblemarks),
            markcomparison: String(marksDetailsEdit?.comparisontype),
            designation: String(interviewgroupingEdit.designation),
            category: String(interviewgroupingEdit.category),
            round: String(interviewgroupingEdit.round),
            type: String(
              interviewgroupingEdit.type === "Please Select Type"
                ? ""
                : interviewgroupingEdit.type
            ),
            subcategory: String(interviewgroupingEdit.subcategory),
            duration: String(durationEdit),
            question: [...updatedQuestionsEdit],
            interviewForm: answerTodo,
            updatedby: [
              ...updateby,
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          }
        );
        await fetchInterviewOrders();
        handleCloseModEdit();
        setShowAlert(
          <>
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Updated Successfully👍"}
            </p>
          </>
        );
        handleClickOpenerr();
      } catch (err) {
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    };

    return (
      <div>
        {updatedQuestionsEdit?.map((question, index) => (
          <DraggableQuestionEdit
            key={index}
            question={question}
            index={index}
            moveQuestion={moveQuestion}
            updatedQuestionsEdit={updatedQuestionsEdit}
            setUpdatedQuestionsEdit={setUpdatedQuestionsEdit}
          />
        ))}
        <Grid container spacing={2}>
          <Grid item md={12} xs={12} sm={12}></Grid>
          <Grid item md={6} xs={6} sm={6}>
            <Button variant="contained" type="submit" onClick={editSubmit}>
              Update
            </Button>
          </Grid>
          <Grid item md={6} xs={6} sm={6}>
            <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "InterviewQuestionsOrder.png");
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
    if (selectedRows?.length === 0) {
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

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    designation: true,
    category: true,
    subcategory: true,
    question: true,
    round: true,
    type: true,
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
        `${SERVICE.INTERVIEWQUESTIONSORDER_SINGLE}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setDeleteCheckpointticket(res?.data?.sinterviewquestionsorder);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Alert delete popup
  let Checkpointticketsid = deleteCheckpointicket?._id;
  const delCheckpointticket = async (e) => {
    setPageName(!pageName);
    try {
      if (Checkpointticketsid) {
        let overallcheck = await axios.post(
          `${SERVICE.INTERVIEWQUESTIONSORDER_OVERALLDELETE}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            designation: deleteCheckpointicket?.designation,
            round: deleteCheckpointicket?.round,
          }
        );
        if (overallcheck?.data?.mayidelete) {
          await axios.delete(`${SERVICE.INTERVIEWQUESTIONSORDER_SINGLE}/${e}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
          await fetchInterviewOrders();
          handleCloseMod();
          setSelectedRows([]);
          setPage(1);
          setShowAlert(
            <>
              <CheckCircleOutlineIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {"Deleted Successfully👍"}
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
        `${SERVICE.INTERVIEWQUESTIONSORDER_OVERALLBULKDELETE}`,
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
  const delCheckpointticketcheckbox = async () => {
    setPageName(!pageName);
    try {
      if (selectedRows?.length > 0) {
        const deletePromises = selectedRows?.map((item) => {
          return axios.delete(
            `${SERVICE.INTERVIEWQUESTIONSORDER_SINGLE}/${item}`,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            }
          );
        });

        // Wait for all delete requests to complete
        await Promise.all(deletePromises);

        await fetchInterviewOrders();
        setShowAlert(
          <>
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Deleted Successfully👍"}
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

  const handleClear = (e) => {
    e.preventDefault();
    setInterviewgrouping({
      designation: "Please Select Designation",
      category: "Please Select Category",
      subcategory: "Please Select Subcategory",
      round: "Please Select Round",
      type: "Please Select Type",
    });
    setDuration("");
    setShowAlert(
      <>
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully👍"}
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
  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(
        `${SERVICE.INTERVIEWQUESTIONSORDER_SINGLE}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setInterviewgroupingEdit(res?.data?.sinterviewquestionsorder);
      setInterviewquestionallDragEdit(
        res?.data?.sinterviewquestionsorder?.question
      );
      setTypeAvailEdit(res?.data?.sinterviewquestionsorder?.type);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(
        `${SERVICE.INTERVIEWQUESTIONSORDER_SINGLE}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setInterviewgroupingEdit(res?.data?.sinterviewquestionsorder);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(
        `${SERVICE.INTERVIEWQUESTIONSORDER_SINGLE}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setInterviewgroupingEdit(res?.data?.sinterviewquestionsorder);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //Project updateby edit page...
  let updateby = interviewgroupingEdit?.updatedby;
  let addedby = interviewgroupingEdit?.addedby;

  let subprojectsid = interviewgroupingEdit?._id;

  //get all Sub vendormasters.
  const fetchInterviewgrouping = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.INTERVIEWQUESTIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let res = res_vendor?.data?.interviewgroupingquestion.filter(
        (data, index) => {
          return data.mode === "Questions";
        }
      );

      setInterviewGroupingValues(res);

      const roundall = [
        ...res.map((d) => ({
          ...d,
          label: d.round,
          value: d.round,
        })),
      ];

      const designationall = [
        ...res?.map((d) => ({
          ...d,
          label: d.designation,
          value: d.designation,
        })),
      ];

      const desuniqueArray = designationall.filter((item, index, self) => {
        return (
          self.findIndex(
            (i) => i.label === item.label && i.value === item.value
          ) === index
        );
      });

      setDesignation(desuniqueArray);
      setRound(roundall);
    } catch (err) {
      setReasonmastercheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchInterviewOrders = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.INTERVIEWQUESTIONSORDER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setReasonmastercheck(true);
      setInterviewgroupingall(res_vendor?.data?.interviewquestionsorders);
    } catch (err) {
      setReasonmastercheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all Sub vendormasters.
  const fetchInterviewgroupingall = async () => {
    setPageName(!pageName);
    try {
      let res_check = await axios.get(SERVICE.INTERVIEWQUESTIONSORDER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      return res_check?.data?.interviewquestionsorders.filter(
        (item) => item._id !== interviewgroupingEdit._id
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Excel
  const fileName = "InterviewQuestionsOrder";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Interview Questions Order",
    pageStyle: "print",
  });

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = interviewgroupingall?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [interviewgroupingall]);

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
        fontWeight: "bold",
      },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable?.length === 0) {
              return;
            }
            if (selectAllChecked) {
              setSelectedRows([]);
            } else {
              const allRowIds = rowDataTable?.map((row) => row.id);
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
            setSelectAllChecked(
              updatedSelectedRows?.length === filteredData?.length
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
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 160,
      hide: !columnVisibility.designation,
      headerClassName: "bold-header",
    },
    {
      field: "round",
      headerName: "Round",
      flex: 0,
      width: 160,
      hide: !columnVisibility.round,
      headerClassName: "bold-header",
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
      field: "question",
      headerName: "Question",
      flex: 0,
      width: 220,
      hide: !columnVisibility.question,
      headerClassName: "bold-header",
    },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 600,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("einterviewquestionsorder") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenEdit();
                getCode(params.row.id, params.row.name);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dinterviewquestionsorder") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vinterviewquestionsorder") && (
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
          {isUserRoleCompare?.includes("iinterviewquestionsorder") && (
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

  const [round, setRound] = useState([]);

  const rowDataTable = filteredData?.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      designation: item.designation,
      type: item.type,
      round: item.round,
      category: item.category,
      subcategory: item.subcategory,
      question: item.question.join(",").toString(),
      arrques: item.question,
    };
  });

  const rowsWithCheckboxes = rowDataTable?.map((row) => ({
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
      <Headtitle title={"INTERVIEW QUESTIONS ORDER"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Manage Interview Questions Order"
        modulename="Interview"
        submodulename="Interview Creation"
        mainpagename="Interview Questions Order"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("ainterviewquestionsorder") && (
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Add Interview Questions Order
                </Typography>
                <NotificationContainer />
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
                    options={designation}
                    styles={colourStyles}
                    value={{
                      label: interviewgrouping.designation,
                      value: interviewgrouping.designation,
                    }}
                    onChange={(e) => {
                      setInterviewgrouping({
                        ...interviewgrouping,
                        designation: e.value,
                        category: "Please Select Category",
                        subcategory: "Please Select Subcategory",
                        round: "Please Select Round",
                        type: "Please Select Type",
                      });
                      setInterviewquestionall([]);
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
                    options={Array.from(
                      new Set(
                        round
                          ?.filter(
                            (item) =>
                              item.designation ===
                              interviewgrouping?.designation
                          )
                          .map((item) => item.round)
                      )
                    ).map((roundValue) => ({
                      label: roundValue,
                      value: roundValue,
                    }))}
                    styles={colourStyles}
                    value={{
                      label: interviewgrouping.round,
                      value: interviewgrouping.round,
                    }}
                    onChange={(e) => {
                      setInterviewgrouping({
                        ...interviewgrouping,
                        round: e.value,
                        category: "Please Select Category",
                        subcategory: "Please Select Subcategory",
                        type: "Please Select Type",
                      });
                      setTypeAvail(
                        round?.find(
                          (data) =>
                            data?.designation ===
                              interviewgrouping?.designation &&
                            data?.round === e.value
                        )?.type
                      );
                    }}
                  />
                </FormControl>
              </Grid>
              {typeAvail && (
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={Array.from(
                        new Set(
                          round
                            ?.filter(
                              (item) =>
                                item.designation ===
                                  interviewgrouping?.designation &&
                                item.round === interviewgrouping.round
                            )
                            .map((item) => item.type)
                        )
                      ).map((typeValue) => ({
                        label: typeValue,
                        value: typeValue,
                      }))}
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
                          subcategory: "Please Select Subcategory",
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
                    options={Array.from(
                      new Set(
                        round
                          ?.filter(
                            (item) =>
                              item.designation ===
                                interviewgrouping?.designation &&
                              item.round === interviewgrouping.round &&
                              (typeAvail
                                ? item?.type === interviewgrouping.type
                                : true)
                          )
                          .map((item) => item.category)
                      )
                    ).map((categoryValue) => ({
                      label: categoryValue,
                      value: categoryValue,
                    }))}
                    styles={colourStyles}
                    value={{
                      label: interviewgrouping.category,
                      value: interviewgrouping.category,
                    }}
                    onChange={(e) => {
                      setInterviewgrouping({
                        ...interviewgrouping,
                        category: e.value,
                        subcategory: "Please Select Subcategory",
                      });
                      // fetchCategoryBased(e);
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
                    options={Array.from(
                      new Set(
                        round
                          ?.filter(
                            (item) =>
                              item.designation ===
                                interviewgrouping?.designation &&
                              item.round === interviewgrouping.round &&
                              (typeAvail
                                ? item?.type === interviewgrouping.type
                                : true) &&
                              item?.category === interviewgrouping.category
                          )
                          .map((item) => item.subcategory)
                      )
                    ).map((subcategoryValue) => ({
                      label: subcategoryValue,
                      value: subcategoryValue,
                    }))}
                    styles={colourStyles}
                    value={{
                      label: interviewgrouping.subcategory,
                      value: interviewgrouping.subcategory,
                    }}
                    onChange={(e) => {
                      setInterviewgrouping({
                        ...interviewgrouping,
                        subcategory: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item md={12} xs={12} sm={12}>
                <DndProvider backend={HTML5Backend}>
                  <DragDropList
                    questions={interviewquestionsall}
                    answerTodo={interviewquestionsallCheck}
                  />
                </DndProvider>
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
          maxWidth="md"
        >
          <Box sx={userStyle.dialogbox}>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Interview Questions Order
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Designation</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Designation"
                    value={interviewgroupingEdit.designation}
                    readOnly
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Round</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Round"
                    value={interviewgroupingEdit.round}
                    readOnly
                  />
                </FormControl>
              </Grid>
              {typeAvailEdit && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Type</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Type"
                      value={interviewgroupingEdit.type}
                      readOnly
                    />
                  </FormControl>
                </Grid>
              )}

              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Category</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Category"
                    value={interviewgroupingEdit.category}
                    readOnly
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Sub Category</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Sub Category"
                    value={interviewgroupingEdit.subcategory}
                    readOnly
                  />
                </FormControl>
              </Grid>

              <Grid item md={12} xs={12} sm={12}>
                <DndProvider backend={HTML5Backend}>
                  <DragDropListEdit
                    questions={interviewquestionallDragEdit}
                    answerTodo={interviewquestionsallCheckEdit}
                  />
                </DndProvider>
              </Grid>
            </Grid>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("linterviewquestionsorder") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                {" "}
                List Interview Questions Order
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
                    {/* <MenuItem value={interviewgroupingall?.length}>
                      All
                    </MenuItem> */}
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
                    "excelinterviewquestionsorder"
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
                    "csvinterviewquestionsorder"
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
                    "printinterviewquestionsorder"
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
                    "pdfinterviewquestionsorder"
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
                    "imageinterviewquestionsorder"
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
            {isUserRoleCompare?.includes("bdinterviewquestionsorder") && (
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
                    {filteredData?.length > 0 ? (page - 1) * pageSize + 1 : 0}{" "}
                    to {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
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
              onClick={(e) => delCheckpointticket(Checkpointticketsid)}
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
                Interview Questions Order Info
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
                <TableCell> Designation</TableCell>
                <TableCell> Round</TableCell>
                <TableCell> Type</TableCell>
                <TableCell> Category</TableCell>
                <TableCell>Subcategory</TableCell>
                <TableCell>Question</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.designation}</TableCell>
                    <TableCell>{row.round}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.subcategory}</TableCell>
                    <TableCell>{row.question}</TableCell>
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
              View Interview Questions Order
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Designation</Typography>
                  <Typography>{interviewgroupingEdit.designation}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Round</Typography>
                  <Typography>{interviewgroupingEdit.round}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Type</Typography>
                  <Typography>{interviewgroupingEdit.type}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Category</Typography>
                  <Typography>{interviewgroupingEdit.category}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Subcategory</Typography>
                  <Typography>{interviewgroupingEdit.subcategory}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Question</Typography>
                  <Typography>
                    {Array.isArray(interviewgroupingEdit?.question)
                      ? interviewgroupingEdit?.question
                          ?.map((item, index) => `${index + 1}${"."}${item}`)
                          .join(" ")
                      : ""}
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            {interviewgroupingEdit?.interviewForm?.length > 0 &&
              interviewgroupingEdit?.interviewForm?.map((data) => {
                return data?.secondarytodo?.map((item) => (
                  <>
                    <Grid container spacing={2}>
                      <Grid item md={2} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">Extra Question</Typography>
                          <Typography>{item?.extraquestion}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={2} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">Options </Typography>
                          <Typography>{item?.options}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">Questions </Typography>
                          <Typography>{item?.question}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={2} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">Type </Typography>
                          <Typography>{item?.type}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={2} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">Options </Typography>
                          <Typography>
                            {item?.optionslist
                              ?.map(
                                (t, i) => `${i + 1 + ". "}` + t.answer + " "
                              )
                              .toString()}
                          </Typography>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </>
                ));
              })}
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
              onClick={(e) => delCheckpointticketcheckbox(e)}
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

export default InterviewQuestionsOrder;
