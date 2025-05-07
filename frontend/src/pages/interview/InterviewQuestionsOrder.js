import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import domtoimage from 'dom-to-image';
import { MultiSelect } from "react-multi-select-component";
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
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import LoadingButton from "@mui/lab/LoadingButton";
import { FaFileCsv, FaFileExcel } from "react-icons/fa";

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

function InterviewQuestionsOrder() {
  const [btnSubmit, setBtnSubmit] = useState(false);
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
    "Designation",
    "Round",
    "Type",
    "Category",
    "Subcategory",
    "Question",
  ];
  let exportRowValues = [
    "designation",
    "round",
    "type",
    "category",
    "subcategory",
    "question",
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
  const customValueRendererSubCate = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate?.map(({ label }) => label).join(", ")
      : "Please select Sub Category";
  };
  const [fileFormat, setFormat] = useState("");

  const [interviewgrouping, setInterviewgrouping] = useState({
    designation: "Please Select Designation",
    round: "Please Select Round",
    type: "Please Select Type",
    category: "Please Select Category",
    subcategory: [],
    subcategoryarray: [],
    question: "",
  });

  const [typeAvail, setTypeAvail] = useState("");
  const [typeAvailEdit, setTypeAvailEdit] = useState("");

  const [interviewgroupingEdit, setInterviewgroupingEdit] = useState({
    designation: "Please Select Designation",
    round: "Please Select Round",
    type: "Please Select Type",
    category: "Please Select Category",
    subcategory: [],
    subcategoryarray: [],
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
  const {
    isUserRoleCompare,
    isUserRoleAccess,
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
        item?.subcategory?.some((subCat) => interviewgrouping?.subcategoryarray?.includes(subCat))
    );
    console.log(interviewgrouping, "interviewgrouping")
    console.log(particularData, "particularData")
    console.log(interviewGroupingValues, "interviewGroupingValues")
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
    interviewgrouping?.subcategoryarray,
  ]);

  useEffect(() => {
    const particularData = interviewGroupingValues?.find(
      (item) =>
        item.designation === interviewgroupingEdit?.designation &&
        item.category === interviewgroupingEdit?.category &&
        (typeAvailEdit !== "" ? item.type === interviewgroupingEdit?.type : true) &&
        item.round === interviewgroupingEdit?.round &&
        item?.subcategory?.some((subCat) => interviewgroupingEdit?.subcategoryarray?.includes(subCat))
    );
    console.log(interviewgroupingEdit, "interviewgroupingEdit")
    console.log(particularData, "particularData")
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
    interviewgroupingEdit?.subcategoryarray,
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
      pagename: String("Interview Question Order"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.comapnyname),
          date: String(new Date()),
        },
      ],
    });
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
      setBtnSubmit(true);
      e.preventDefault();

      const isNameMatch = interviewgroupingall.some(
        (item) =>
          item.designation === interviewgrouping.designation &&
          item.round === interviewgrouping.round &&
          (typeAvail ? item.type === interviewgrouping.type : true) &&
          item.category === interviewgrouping.category &&
          interviewgrouping?.subcategoryarray?.includes(item?.subcategory)
      );

      if (interviewgrouping.designation === "Please Select Designation") {
        setPopupContentMalert("Please Select Designation!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (interviewgrouping.round === "Please Select Round") {
        setPopupContentMalert("Please Select Round!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (typeAvail && interviewgrouping.type === "Please Select Type") {
        setPopupContentMalert("Please Select Type!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (interviewgrouping.category === "Please Select Category") {
        setPopupContentMalert("Please Select Category!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (
        interviewgrouping.subcategory?.length === 0
      ) {
        setPopupContentMalert("Please Select Subcategory!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (orderedQuestions?.length === 0) {
        setPopupContentMalert("No Questions To Order!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (isNameMatch) {
        setPopupContentMalert("Interview Question Order Already Exist!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
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
          subcategory: interviewgrouping.subcategoryarray?.length > 0 ? interviewgrouping.subcategoryarray : [],
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
        // setInterviewgrouping({
        //   ...interviewgrouping,
        //   category: "Please Select Category",
        //   subcategory: "Please Select Subcategory",
        //   round: "Please Select Round",
        //   type: "Please Select Type",
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
          (typeAvailEdit !== "" ? item.type === interviewgroupingEdit?.type : true) &&
          item.category === interviewgroupingEdit.category &&
          interviewgroupingEdit.subcategoryarray?.includes(item.subcategory)
      );

      if (interviewgroupingEdit.designation === "Please Select Designation") {
        setPopupContentMalert("Please Select Designation!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (
        interviewgroupingEdit.round === "Please Select Round" ||
        interviewgroupingEdit.round === ""
      ) {
        setPopupContentMalert("Please Select Round!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (
        typeAvailEdit !== "" &&
        (interviewgroupingEdit.type === "Please Select Type" ||
          interviewgroupingEdit.type === "")
      ) {
        setPopupContentMalert("Please Select Type!");
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
      } else if (orderedQuestionsEdit?.length === 0) {
        setPopupContentMalert("No Questions To Order!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (isNameMatch) {
        setPopupContentMalert("Interview Question Order Already Exist!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
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
            subcategory: interviewgroupingEdit.subcategoryarray?.length > 0 ? interviewgroupingEdit.subcategoryarray : [],
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
            <Button onClick={handleCloseModEdit} sx={buttonStyles.btncancel}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  };

  //image
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const gridRefTableImg = useRef(null);
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "InterviewQuestionsOrder.png");
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
    if (selectedRows?.includes(params.row.id)) {
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
          await axios.delete(`${SERVICE.INTERVIEWQUESTIONSORDER_SINGLE}/${Checkpointticketsid}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
          setFilteredChanges(null)
          setFilteredRowData([]);
          await fetchInterviewOrders();
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
        setIsHandleChange(false);
        setFilteredChanges(null)
        setFilteredRowData([]);
        await fetchInterviewOrders();
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

  const handleClear = (e) => {
    e.preventDefault();
    setInterviewgrouping({
      designation: "Please Select Designation",
      category: "Please Select Category",
      subcategory: [],
      subcategoryarray: [],
      round: "Please Select Round",
      type: "Please Select Type",
    });
    setDuration("");
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
      // setInterviewgroupingEdit(res?.data?.sinterviewquestionsorder);
      setInterviewgroupingEdit({
        ...res?.data?.sinterviewquestionsorder,
        subcategory: Array.isArray(res?.data?.sinterviewquestionsorder?.subcategory) && res?.data?.sinterviewquestionsorder?.subcategory?.length > 0 ? res?.data?.sinterviewquestionsorder?.subcategory?.map(data => ({
          label: data,
          value: data
        })) : [{
          label: res?.data?.sinterviewquestionsorder?.subcategory,
          value: res?.data?.sinterviewquestionsorder?.subcategory
        }],
        subcategoryarray: Array.isArray(res?.data?.sinterviewquestionsorder?.subcategory) && res?.data?.sinterviewquestionsorder?.subcategory?.length > 0 ? res?.data?.sinterviewquestionsorder?.subcategory : [res?.data?.sinterviewquestionsorder?.subcategory]
      });
      setInterviewquestionallDragEdit(
        res?.data?.sinterviewquestionsorder?.question
      );
      setTypeAvailEdit(res?.data?.sinterviewquestionsorder?.type);
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
        `${SERVICE.INTERVIEWQUESTIONSORDER_SINGLE}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setInterviewgroupingEdit(res?.data?.sinterviewquestionsorder);
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
        `${SERVICE.INTERVIEWQUESTIONSORDER_SINGLE}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setInterviewgroupingEdit(res?.data?.sinterviewquestionsorder);
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
          return data.mode === "Questions" || data.mode === "Verification/Administrative";
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      const itemsWithSerialNumber = res_vendor?.data?.interviewquestionsorders?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        id: item._id,
        question: item.question.join(",").toString(),
        questionArray: item.question,
        subcategory: Array?.isArray(item.subcategory) && item.subcategory?.length > 0 ? item.subcategory?.join(",") : item.subcategory,
      }));
      setInterviewgroupingall(itemsWithSerialNumber);
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
      let res_check = await axios.get(SERVICE.INTERVIEWQUESTIONSORDER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      return res_check?.data?.interviewquestionsorders.filter(
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
      width: 280,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      //lockPinned: true,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("einterviewquestionsorder") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getCode(params.data.id, params.data.name);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dinterviewquestionsorder") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vinterviewquestionsorder") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iinterviewquestionsorder") && (
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

  const [round, setRound] = useState([]);

  const rowDataTable = filteredData?.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      designation: item.designation,
      type: item.type,
      round: item.round,
      category: item.category,
      subcategory: item.subcategory,
      question: item.question,
      arrques: item.question,
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
  const filteredColumns = columnDataTable.filter((column) =>
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
        title="Interview Questions Order"
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
                        subcategory: [],
                        subcategoryarray: [],
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
                        subcategory: [],
                        subcategoryarray: [],
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
                        subcategory: [],
                        subcategoryarray: [],
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
                  <MultiSelect
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
                          .flatMap((item) => item.subcategory)
                      )
                    ).map((subcategoryValue) => ({
                      label: subcategoryValue,
                      value: subcategoryValue,
                    }))}
                    value={interviewgrouping?.subcategory}
                    onChange={(e) => {
                      let valuesOnly = e?.map(data => data?.value)
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
                  /> */}
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
              {typeAvailEdit !== "" && (
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
                    value={interviewgroupingEdit?.subcategoryarray?.join(",")}
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
            {isUserRoleCompare?.includes("bdinterviewquestionsorder") && (
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
                  <Typography>{Array?.isArray(interviewgroupingEdit.subcategory) && interviewgroupingEdit.subcategory?.length > 0 ? interviewgroupingEdit.subcategory?.join(",") : interviewgroupingEdit.subcategory}</Typography>
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
                sx={buttonStyles.btncancel}
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
              sx={buttonStyles.buttonsubmit}
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
        filename={"Interview Question Order"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Interview Question Order Info"
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

export default InterviewQuestionsOrder;
