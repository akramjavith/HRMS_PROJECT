import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import moment from "moment-timezone";
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
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import PageHeading from "../../components/PageHeading";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

import { FaFileCsv, FaFileExcel } from "react-icons/fa";

import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import CandidateHistory from "./CandidatesHistory.js";

function InterviewRounOrder() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    // setSubmitLoader(false);
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

  let exportColumnNames = ["Designation", "Round",
    "Category",
    "Subcategory",
    "Mode",
    "Type",
    "Duration",
  ];
  let exportRowValues = ["designation", "round",
    "matchedRoundCategory",
    "matchedRoundSubcategory",
    "matchedRoundMode",
    "matchedRoundType",
    "matchedRoundDuration",
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

  const [interviewround, setInterviewround] = useState({
    designation: "Please Select Designation",
    round: "",
    question: "",
  });

  const [interviewgrouping, setInterviewgrouping] = useState({
    designation: "Please Select Designation",
    round: "Please Select Round",
    type: "Please Select Type",
    category: "Please Select Category",
    subcategory: "Please Select Subcategory",
    mode: "Please Select Mode",
    testname: "Please Select Test Name",
    question: "",
    totalmarks: "",
    eligiblemarks: "",
  });

  const [interviewroundEdit, setInterviewroundEdit] = useState({
    designation: "Please Select Designation",
    round: "",
    question: "",
  });

  const [interviewroundall, setInterviewroundall] = useState([]);

  // This line muliti select Round
  const [selectedOptionsRound, setSelectedOptionsRound] = useState([]);
  let [valueRound, setValueRound] = useState("");

  const handleRoundChange = (options) => {
    setValueRound(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsRound(options);
  };

  const customValueRendererRound = (valueRound, _skills) => {
    return valueRound.length
      ? valueRound.map(({ label }) => label).join(", ")
      : "Please Select Round";
  };

  useEffect(() => {
    getapi();
    fetchRoundmaster();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Interview Round Order"),
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

  //Edit multi select Skill
  const [selectedOptionsRoundEdit, setSelectedOptionsRoundEdit] = useState([]);

  const handleRoundChangeEdit = (options) => {
    console.log(options, "opt")
    setSelectedOptionsRoundEdit(options);
    setInterviewquestionallDragEditMatched(options);
    setInterviewquestionallDragEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
  };

  const customValueRendererRoundEdit = (valueRoundEdit, _skills) => {
    return valueRoundEdit.length
      ? valueRoundEdit.map(({ label }) => label).join(", ")
      : "Please Select Round";
  };

  useEffect(() => {
    fetchInterviewOrders();
    fetchInterviewQuestionOrders();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const {
    isUserRoleCompare,
    isUserRoleAccess,
    pageName,
    setPageName,
    buttonStyles,
    isAssignBranch
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);


  const accessbranch = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
    : isAssignBranch
      ?.filter((data) => {
        let fetfinalurl = [];

        if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.submodulenameurl;
        } else if (data?.modulenameurl?.length !== 0) {
          fetfinalurl = data.modulenameurl;
        } else {
          fetfinalurl = [];
        }

        const remove = [
          "interview/interviewroundorder",
          "/interview/interviewroundorder",
        ];
        return fetfinalurl?.some((item) => remove?.includes(item));
      })
      ?.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }));

  const [reasonmasterCheck, setReasonmastercheck] = useState(false);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [interviewquestionallDragEdit, setInterviewquestionallDragEdit] =
    useState([]);
  const [interviewquestionallDragOld, setInterviewquestionallDragOld] =
    useState([]);
  const [interviewquestionallDragEditMatched, setInterviewquestionallDragEditMatched] =
    useState([]);
  const formatDuration = (duration) => {
    const [hours, minutes] = duration.split(":");
    const formattedDuration =
      (hours !== "00" ? `${parseInt(hours)} Hrs` : "") +
      (minutes !== "00"
        ? `${hours !== "00" ? " " : ""}${parseInt(minutes)} Mins`
        : "");
    return formattedDuration;
  };
  const DraggableQuestion = ({
    valueRound,
    index,
    moveQuestion,
    updatedQuestions,
    setUpdatedQuestions,
    selectedOptionsRound
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
    const matchedRound = selectedOptionsRound?.find(data => data?.round === valueRound)
    const matchedRoundMaster = roundmasters?.find(data => data?.nameround === valueRound)
    const matchedRoundDuration = formatDuration(matchedRound?.duration || "00:00")
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {/* Main Value */}
          <span style={{ marginRight: "8px" }}>{valueRound}</span>

          {/* Matched Round Details */}
          {matchedRound && (
            <span
              style={{
                fontSize: "12px",
                color: "#555",
              }}
            >
              {matchedRound?.category} - {matchedRound?.subcategory} -{" "}
              {matchedRound?.mode} - {matchedRound?.type} - {matchedRoundDuration} - {`(${matchedRoundMaster?.description || "No Description"})`}
            </span>
          )}
        </div>
      </div>
    );
  };
  const roundNames = [
    "First Round", "Second Round", "Third Round", "Fourth Round",
    "Fifth Round", "Sixth Round", "Seventh Round", "Eighth Round",
    "Ninth Round", "Tenth Round", "Eleventh Round", "Twelfth Round",
    "Thirteenth Round", "Fourteenth Round", "Fifteenth Round",
    "Sixteenth Round", "Seventeenth Round", "Eighteenth Round",
    "Nineteenth Round", "Twentieth Round"
  ];
  const DragDropList = ({ valueRound, selectedOptionsRound }) => {
    const [orderedQuestions, setOrderedQuestions] = useState(valueRound);
    const [updatedQuestions, setUpdatedQuestions] = useState(valueRound);

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

      const isNameMatch = interviewroundall.some(
        (item) => item.designation === interviewround.designation
      );

      if (interviewround.designation === "Please Select Designation") {
        setPopupContentMalert("Please Select Designation!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (selectedOptionsRound.length === 0) {
        setPopupContentMalert("Please Select Round!");
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
        await axios.post(SERVICE.INTERVIEWROUNDORDER_CREATE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          designation: String(interviewround.designation),
          round: [...orderedQuestions],
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
        await fetchInterviewOrders();
        // setInterviewround({
        //   ...interviewround,
        // });
        setPopupContent("Added Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
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

        {updatedQuestions &&
          updatedQuestions.map((valueRound, index) => {
            const roundName = roundNames[index] || `Round ${index + 1}`; // Default to Round 1, 2, 3... if exceeds predefined names

            return (
              <div
                key={index}
                style={{
                  marginBottom: "8px", // Add spacing between each round
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                {/* Serial Number and Default Round Name */}
                <Typography variant="h6">
                  {index + 1}. {roundName}
                </Typography>

                {/* Your DraggableQuestion component */}
                <DraggableQuestion
                  valueRound={valueRound}
                  index={index}
                  moveQuestion={moveQuestion}
                  updatedQuestions={updatedQuestions}
                  setUpdatedQuestions={setUpdatedQuestions}
                  selectedOptionsRound={selectedOptionsRound}
                />
              </div>
            );
          })}

        {/* {updatedQuestions &&
          updatedQuestions.map((valueRound, index) => (
            <DraggableQuestion
              key={index}
              valueRound={valueRound}
              index={index}
              moveQuestion={moveQuestion}
              updatedQuestions={updatedQuestions}
              setUpdatedQuestions={setUpdatedQuestions}
              selectedOptionsRound={selectedOptionsRound}
            />
          ))} */}
        <Grid container spacing={2}>
          <Grid item md={12} xs={12} sm={12}></Grid>
          <Grid item md={12} xs={12} sm={12}></Grid>
          <Grid item md={2.5} xs={12} sm={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={buttonStyles.buttonsubmit}
            >
              Submit
            </Button>
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
    valueRoundEdit,
    index,
    moveQuestion,
    updatedQuestionsEdit,
    setUpdatedQuestionsEdit,
    interviewquestionallDragEditMatched
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
    const matchedRound = interviewquestionallDragEditMatched?.find(data => data?.round === valueRoundEdit)
    const matchedRoundMaster = roundmasters?.find(data => data?.nameround === valueRoundEdit)
    const matchedRoundDuration = formatDuration(matchedRound?.duration || "00:00")
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {/* Main Value */}
          <span style={{ marginRight: "8px" }}>{valueRoundEdit}</span>

          {/* Matched Round Details */}
          {matchedRound && (
            <span
              style={{
                fontSize: "12px",
                color: "#555",
              }}
            >
              {matchedRound?.category} - {matchedRound?.subcategory} -{" "}
              {matchedRound?.mode} - {matchedRound?.type} - {matchedRoundDuration}  - {`(${matchedRoundMaster?.description || "No Description"})`}
            </span>
          )}
        </div>
      </div>
    );
  };
  const DragDropListEdit = ({ interviewquestionallDragEdit, interviewquestionallDragEditMatched }) => {
    const [updateLoader, setUpdateLoader] = useState(false)
    const [orderedQuestionsEdit, setOrderedQuestionsEdit] = useState(
      interviewquestionallDragEdit
    );
    const [updatedQuestionsEdit, setUpdatedQuestionsEdit] = useState(
      interviewquestionallDragEdit
    );

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
        (item) => item.designation === interviewgroupingEdit.designation
      );

      if (interviewroundEdit.designation === "Please Select Designation") {
        setPopupContentMalert("Please Select Designation!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (selectedOptionsRoundEdit.length === 0) {
        setPopupContentMalert("Please Select Round!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (isNameMatch) {
        setPopupContentMalert("Interview Question Order already Exist!");
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
        setUpdateLoader(true)
        let candidatesDatas = await getCandidateHistory(interviewroundEdit.designation, interviewquestionallDragOld)
        if (candidatesDatas?.candidateHistoryCount > 0) {
          handleClickOpenHistory();
          setUpdateLoader(false)
        } else {
          await axios.put(
            `${SERVICE.INTERVIEWROUNDORDER_SINGLE}/${subprojectsid}`,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              designation: String(interviewroundEdit.designation),
              round: [...updatedQuestionsEdit],
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
          setUpdateLoader(false)
        }
      } catch (err) {
        setUpdateLoader(false)
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

        {updatedQuestionsEdit &&
          updatedQuestionsEdit.map((valueRoundEdit, index) => {
            const roundName = roundNames[index] || `Round ${index + 1}`; // Default to Round 1, 2, 3... if exceeds predefined names

            return (
              <div
                key={index}
                style={{
                  marginBottom: "8px", // Add spacing between each round
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                {/* Serial Number and Default Round Name */}
                <Typography variant="h6">
                  {index + 1}. {roundName}
                </Typography>

                {/* Your DraggableQuestion component */}
                <DraggableQuestionEdit
                  key={index}
                  valueRoundEdit={valueRoundEdit}
                  index={index}
                  moveQuestion={moveQuestion}
                  updatedQuestionsEdit={updatedQuestionsEdit}
                  setUpdatedQuestionsEdit={setUpdatedQuestionsEdit}
                  interviewquestionallDragEditMatched={interviewquestionallDragEditMatched}
                />
              </div>
            );
          })}
        {/* {updatedQuestionsEdit &&
          updatedQuestionsEdit?.map((valueRoundEdit, index) => (
            <DraggableQuestionEdit
              key={index}
              valueRoundEdit={valueRoundEdit}
              index={index}
              moveQuestion={moveQuestion}
              updatedQuestionsEdit={updatedQuestionsEdit}
              setUpdatedQuestionsEdit={setUpdatedQuestionsEdit}
              interviewquestionallDragEditMatched={interviewquestionallDragEditMatched}
            />
          ))} */}
        <Grid container spacing={2}>
          <Grid item md={12} xs={12} sm={12}></Grid>
          <Grid item md={6} xs={6} sm={6}>
            <LoadingButton
              variant="contained"
              type="submit"
              loading={updateLoader}
              onClick={editSubmit}
              sx={buttonStyles.buttonsubmit}
            >
              Update
            </LoadingButton>
          </Grid>
          <Grid item md={6} xs={6} sm={6}>
            <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
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
          saveAs(blob, "InterviewRoundOrder.png");
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
    setInterviewquestionallDragEditMatched([])
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
    type: true,
    category: true,
    subcategory: true,
    round: true,
    // question: true,
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
      let res = await axios.get(`${SERVICE.INTERVIEWROUNDORDER_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteCheckpointticket(res?.data?.sinterviewroundorder);
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

  const overallBulkdelete = async (ids) => {
    setPageName(!pageName);
    try {
      let overallcheck = await axios.post(
        `${SERVICE.INTERVIEWROUNDORDER_OVERALLBULKDELETE}`,
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

  // Alert delete popup
  let Checkpointticketsid = deleteCheckpointicket?._id;
  const delCheckpointticket = async () => {
    setPageName(!pageName);
    try {
      let candidatesDatas = await getCandidateHistory(deleteCheckpointicket.designation, deleteCheckpointicket?.round)
      if (candidatesDatas?.candidateHistoryCount > 0) {
        handleClickOpenHistory();

      } else {
        if (Checkpointticketsid) {
          let overallcheck = await axios.post(
            `${SERVICE.INTERVIEWROUNDORDER_OVERALLDELETE}`,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              designation: deleteCheckpointicket?.designation,
              round: deleteCheckpointicket?.round,
            }
          );
          if (overallcheck?.data?.mayidelete) {
            await axios.delete(
              `${SERVICE.INTERVIEWROUNDORDER_SINGLE}/${Checkpointticketsid}`,
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
              }
            );
            await fetchInterviewOrders();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
          }
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

  const delCheckpointticketcheckbox = async () => {
    setPageName(!pageName);
    try {
      if (selectedRows?.length > 0) {
        const deletePromises = selectedRows?.map((item) => {
          return axios.delete(`${SERVICE.INTERVIEWROUNDORDER_SINGLE}/${item}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
        });

        // Wait for all delete requests to complete
        await Promise.all(deletePromises);

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

  const [designation, setDesignation] = useState([]);

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

  const handleClear = (e) => {
    e.preventDefault();
    setInterviewround({
      designation: "Please Select Designation",
    });
    setValueRound([]);
    setSelectedOptionsRound([]);

    setInterviewgrouping({
      designation: "Please Select Designation",
      category: "Please Select Category",
      subcategory: "Please Select Subcategory",
      round: "Please Select Round",
      type: "Please Select Type",
      mode: "Please Select Mode",
      testname: "Please Select Test Name",
      totalmarks: "",
      eligiblemarks: "",
    });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };



  //candidate history model...
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const handleClickOpenHistory = () => {
    setIsHistoryOpen(true);
  };
  const handleCloseModHistory = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsHistoryOpen(false);
  };

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setInterviewquestionallDragEditMatched([])
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const [interviewgroupingEdit, setInterviewgroupingEdit] = useState({
    designation: "Please Select Designation",
    round: "Please Select Round",
    type: "Please Select Type",
    category: "Please Select Category",
    subcategory: "Please Select Subcategory",
    question: "",
  });

  //get single row to edit....
  const [candidateHistoryData, setCandidateHistoryData] = useState([]);
  const [candidateHistoryRounds, setCandidateHistoryRounds] = useState([]);
  const [candidateHistoryCount, setCandidateHistoryCount] = useState(0);
  const [roleName, setRoleName] = useState("");
  const [formerUsers, setFormerUsers] = useState([]);

  const fetchFormerUsers = async () => {
    setPageName(!pageName);
    try {
      let response = await axios.get(SERVICE.FORMERUSERS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setFormerUsers(
        response?.data?.formerusers?.map((data) => data?.companyname)
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
  const getCandidateHistory = async (designation, rounds) => {
    setPageName(!pageName);
    try {


      let responseCanddiate = await axios.post(`${SERVICE.CANDIDATES_HISTORY}`, {
        designation,
        rounds
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        }
      });


      let candidatesWithStatus = responseCanddiate?.data?.candidateHistory?.length > 0 ? responseCanddiate?.data?.candidateHistory[0]?.candidates : [];
      let Rounds = responseCanddiate?.data?.candidateHistory?.length > 0 ? responseCanddiate?.data?.candidateHistory[0]?.roundCandidatesCount : [];

      setCandidateHistoryData(candidatesWithStatus);


      setCandidateHistoryRounds(Rounds?.sort((a, b) => {
        const indexA = interviewquestionallDragOld.findIndex(
          (item) => item === a.roundname
        );
        const indexB = interviewquestionallDragOld.findIndex(
          (item) => item === b.roundname
        );

        // If not found, push unmatched items to the end
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;

        return indexA - indexB;
      }))
      setCandidateHistoryCount(responseCanddiate?.data?.totalcandidates);
      setRoleName(designation)
      return {
        candidateHistory: responseCanddiate?.data?.candidateHistory?.length > 0 ? responseCanddiate?.data?.candidateHistory[0]?.candidates : [],
        candidateHistoryRounds: responseCanddiate?.data?.candidateHistory?.length > 0 ? responseCanddiate?.data?.candidateHistory[0]?.roundCandidatesCount : [],
        candidateHistoryCount: responseCanddiate?.data?.totalcandidates
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
  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.INTERVIEWROUNDORDER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });


      setInterviewroundEdit(res?.data?.sinterviewroundorder);

      setInterviewgroupingEdit(res?.data?.sinterviewroundorder);

      setInterviewquestionallDragEdit(res?.data?.sinterviewroundorder?.round);
      setInterviewquestionallDragOld(res?.data?.sinterviewroundorder?.round);
      let matchedRounds = interviewQuestionOrder?.filter(data => res?.data?.sinterviewroundorder?.round?.includes(data?.round) && data?.designation === res?.data?.sinterviewroundorder?.designation)?.map(item => {
        const matchedRoundMaster = roundmasters?.find(data => data?.nameround === item.round)
        return { round: item.round, category: item?.category, description: matchedRoundMaster?.description || "No Description", subcategory: item?.subcategory?.join(","), mode: item?.mode, duration: item?.duration, type: item?.mode === "Questions" ? item?.type : item?.typetest }
      })
      setSelectedOptionsRoundEdit(
        matchedRounds?.map((item) => ({
          ...item,
          label: item?.round,
          value: item?.round,
        }))
      );


      setInterviewquestionallDragEditMatched(matchedRounds)
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
      let res = await axios.get(`${SERVICE.INTERVIEWROUNDORDER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setInterviewroundEdit(res?.data?.sinterviewroundorder);
      let matchedRounds = interviewQuestionOrder?.filter(data => res?.data?.sinterviewroundorder?.round?.includes(data?.round) && data?.designation === res?.data?.sinterviewroundorder?.designation)?.map(item => {
        const matchedRoundMaster = roundmasters?.find(data => data?.nameround === item.round)
        return { round: item.round, category: item?.category, description: matchedRoundMaster?.description || "No Description", subcategory: item?.subcategory?.join(","), mode: item?.mode, duration: item?.duration, type: item?.mode === "Questions" ? item?.type : item?.typetest }
      })
      setInterviewquestionallDragEditMatched(matchedRounds)
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
      let res = await axios.get(`${SERVICE.INTERVIEWROUNDORDER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setInterviewroundEdit(res?.data?.sinterviewroundorder);
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
    fetchDesignation();
    fetchFormerUsers();
  }, []);

  //Project updateby edit page...
  let updateby = interviewroundEdit?.updatedby;
  let addedby = interviewroundEdit?.addedby;

  let subprojectsid = interviewroundEdit?._id;

  const fetchInterviewOrders = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.INTERVIEWROUNDORDER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setReasonmastercheck(true);
      setInterviewroundall(res?.data?.interviewroundorders);
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
      let res_check = await axios.get(SERVICE.INTERVIEWROUNDORDER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      return res_check?.data?.interviewroundorders.filter(
        (item) => item._id !== interviewroundEdit._id
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

  const [interviewQuestionOrder, setInterviewQuestionOrder] = useState([]);
  const fetchInterviewQuestionOrders = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.INTERVIEWQUESTIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let res_vendor_order = await axios.get(SERVICE.INTERVIEWQUESTIONSORDER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });


      const orderData = res_vendor_order?.data?.interviewquestionsorders || [];
      const groupingData = res_vendor?.data?.interviewgroupingquestion || [];

      // Filter data based on conditions
      const filteredData = groupingData.filter((group) => {
        // Check if mode is "Questions" or "Verification/Administrative"
        if (group.mode === "Questions" || group.mode === "Verification/Administrative") {
          return orderData.some((order) => {
            return (
              order.designation === group.designation &&
              order.round === group.round &&
              order.category === group.category &&
              Array.isArray(order.subcategory) &&
              Array.isArray(group.subcategory) &&
              order.subcategory.some((sub) => group.subcategory.includes(sub)) && // Match any subcategory
              Array.isArray(order.question) &&
              Array.isArray(group.question) &&
              order.question.every((q) => group.question.includes(q)) // Match all questions
            );
          });
        }
        return true;
      });

      // Update state
      setInterviewQuestionOrder(filteredData);
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
  const fileName = "InterviewRoundOrder";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Interview Round Order",
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

    const itemsWithSerialNumber = interviewroundall?.map((item, index) => {
      // Filter and map matched rounds
      let matchedRounds = interviewQuestionOrder
        ?.filter(
          (data) =>
            item?.round?.includes(data?.round) &&
            data?.designation === item?.designation
        )
        ?.map((data) => ({
          round: data.round,
          category: data?.category,
          subcategory: data?.subcategory?.join(","),
          mode: data?.mode,
          duration: formatDuration(data?.duration),
          type: data?.mode === "Questions" ? data?.type : data?.typetest,
        }));


      // Create new values for matched round details
      let matchedRoundCategory = matchedRounds
        ?.map((round) => `${round.round} - ${round.category}`)
        .join(", ");
      let matchedRoundSubcategory = matchedRounds
        ?.map((round) => `${round.round} - ${round.subcategory}`)
        .join(", ");
      let matchedRoundMode = matchedRounds
        ?.map((round) => `${round.round} - ${round.mode}`)
        .join(", ");
      let matchedRoundType = matchedRounds
        ?.map((round) => `${round.round} - ${round.type}`)
        .join(", ");
      let matchedRoundDuration = matchedRounds
        ?.map((round) => `${round.round} - ${round.duration}`)
        .join(", ");
      return {
        ...item,
        serialNumber: index + 1,
        round: item.round.join(",").toString(),
        matchedRoundCategory,
        matchedRoundSubcategory,
        matchedRoundMode,
        matchedRoundType,
        matchedRoundDuration,
      }
    });
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [interviewroundall]);

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
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable?.length === 0) {
              // Do not allow checking when there are no rows
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

            // Update the "Select All" checkbox based on whether all rows are selected
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
      width: 180,
      hide: !columnVisibility.designation,
      headerClassName: "bold-header",
    },

    {
      field: "round",
      headerName: "Round",
      flex: 0,
      width: 450,
      hide: !columnVisibility.round,
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
          {isUserRoleCompare?.includes("einterviewroundorder") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getCode(params.row.id, params.row.name);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dinterviewroundorder") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vinterviewroundorder") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}

          {isUserRoleCompare?.includes("iinterviewroundorder") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getinfoCode(params.row.id);
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
      id: item._id,
      serialNumber: item.serialNumber,
      designation: item.designation,
      type: item.type,
      category: item.category,
      subcategory: item.subcategory,
      round: item.round,
      arrques: item.round,

      matchedRoundCategory: item?.matchedRoundCategory,
      matchedRoundSubcategory: item?.matchedRoundSubcategory,
      matchedRoundMode: item?.matchedRoundMode,
      matchedRoundType: item?.matchedRoundType,
      matchedRoundDuration: item?.matchedRoundDuration,


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

  const [roundmasters, setRoundmasters] = useState([])
  const fetchRoundmaster = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.ROUNDMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setRoundmasters(res_vendor?.data?.roundmasters);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
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
      <Headtitle title={"INTERVIEW ROUND ORDER"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Interview Round Order"
        modulename="Interview"
        submodulename="Interview Creation"
        mainpagename="Interview Round Order"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("ainterviewroundorder") && (
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Add Interview Round Order
                </Typography>
                <NotificationContainer />
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Designation<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={designation}
                    styles={colourStyles}
                    value={{
                      label: interviewround.designation,
                      value: interviewround.designation,
                    }}
                    onChange={(e) => {
                      setInterviewround({
                        ...interviewround,
                        designation: e.value,
                      });
                      setInterviewgrouping({
                        ...interviewgrouping,
                        type: "Please Select Type",
                        category: "Please Select Category",
                        subcategory: "Please Select Subcategory",
                        testname: "Please Select Test Name",
                        totalmarks: "",
                        eligiblemarks: "",
                      });
                      setSelectedOptionsRound([]);
                      setValueRound([]);
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  {" "}
                  Round<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <MultiSelect
                    options={[
                      ...new Set(
                        interviewQuestionOrder
                          ?.filter(
                            (data) =>
                              data.designation === interviewround.designation
                          )
                          ?.map((item) => ({ round: item.round, category: item?.category, subcategory: item?.subcategory?.join(","), mode: item?.mode, duration: item?.duration, type: item?.mode === "Questions" ? item?.type : item?.typetest }))
                      ),
                    ].map((data) => ({
                      ...data,
                      label: data?.round,
                      value: data?.round,
                    }))}
                    value={selectedOptionsRound}
                    onChange={(e) => {
                      handleRoundChange(e);
                    }}
                    valueRenderer={customValueRendererRound}
                    labelledBy="Please Select Round"
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <DndProvider backend={HTML5Backend}>
                  <DragDropList valueRound={valueRound} selectedOptionsRound={selectedOptionsRound} />
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
          sx={{
            // overflow: "visible",
            // "& .MuiPaper-root": {
            //   overflow: "visible",
            // },
            marginTop: "50px"
          }}
        >
          <Box sx={userStyle.dialogbox}>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Interview Round Order
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Designation<b style={{ color: "red" }}>*</b>
                  </Typography>

                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Designation"
                    value={interviewgroupingEdit.designation}
                    readOnly
                  />
                </FormControl>
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <Typography>Round<b style={{ color: "red" }}>*</b></Typography>
                <FormControl fullWidth size="small">
                  <MultiSelect
                    options={[
                      ...new Set(
                        interviewQuestionOrder
                          ?.filter(
                            (data) =>
                              data.designation ===
                              interviewgroupingEdit.designation
                          )
                          ?.map((item) => ({ round: item.round, category: item?.category, subcategory: item?.subcategory?.join(","), mode: item?.mode, duration: item?.duration, type: item?.mode === "Questions" ? item?.type : item?.typetest }))
                      ),
                    ].map((data) => ({
                      ...data,
                      label: data?.round,
                      value: data?.round,
                    }))}
                    value={selectedOptionsRoundEdit}
                    onChange={(e) => {
                      handleRoundChangeEdit(e);
                    }}
                    valueRenderer={customValueRendererRoundEdit}
                    labelledBy="Please Select Round"
                  />

                  {/* {selectedOptionsRoundEdit.length !== 0
                    ? selectedOptionsRoundEdit.map((data, index) => (
                      <Typography>
                        {index + 1}.{data.value}
                      </Typography>
                    ))
                    : ""} */}
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <DndProvider backend={HTML5Backend}>
                  <DragDropListEdit
                    interviewquestionallDragEdit={interviewquestionallDragEdit}
                    interviewquestionallDragEditMatched={interviewquestionallDragEditMatched}
                  />
                </DndProvider>
              </Grid>
            </Grid>
          </Box>
        </Dialog>
        {/* History  DIALOG */}
        <Dialog
          open={isHistoryOpen}
          onClose={handleCloseModHistory}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="xl"
          sx={{
            // overflow: "visible",
            // "& .MuiPaper-root": {
            //   overflow: "visible",
            // },
            marginTop: "50px"
          }}
        >
          <CandidateHistory candidateDatas={candidateHistoryData}
            candidateHistoryRounds={candidateHistoryRounds}
            candidateHistoryCount={candidateHistoryCount}
            formerUsers={formerUsers}
            roleName={roleName}
            handleCloseModHistory={handleCloseModHistory}
          />
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("linterviewroundorder") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                {" "}
                Interview Round Order List
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
                    {/* <MenuItem value={interviewroundall?.length}>All</MenuItem> */}
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
                  {isUserRoleCompare?.includes("excelinterviewroundorder") && (
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
                  {isUserRoleCompare?.includes("csvinterviewroundorder") && (
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
                  {isUserRoleCompare?.includes("printinterviewroundorder") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfinterviewroundorder") && (
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
                  {isUserRoleCompare?.includes("imageinterviewroundorder") && (
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
            {/* {isUserRoleCompare?.includes("bdinterviewroundorder") && (
              <Button
                variant="contained"
                color="error"
                onClick={handleClickOpenalert}
                sx={buttonStyles.buttonbulkdelete}
              >
                Bulk Delete
              </Button>
            )} */}
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
              View Interview Round Order
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Designation</Typography>
                  <Typography>{interviewroundEdit.designation}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Rounds</Typography>
                  <div>
                    {Array.isArray(interviewroundEdit?.round) &&
                      interviewroundEdit?.round.map((roundItem, index) => {
                        const item = interviewquestionallDragEditMatched.find(
                          (interviewItem) => interviewItem.round === roundItem
                        );

                        const roundName = roundNames[index] || `Round ${index + 1}`; // Default to Round 1, 2, 3... if exceeds predefined names

                        return item ? (
                          <div
                            key={index}
                            style={{
                              marginBottom: "8px", // Add spacing between each round
                              padding: "8px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              backgroundColor: "#f9f9f9",
                            }}
                          >
                            {/* Serial Number and Default Round Name */}
                            <Typography
                              variant="h6"
                              style={{ fontWeight: "bold", fontSize: "16px" }}
                            >
                              {index + 1}. {roundName}
                            </Typography>

                            {/* Round Name */}
                            <Typography
                              variant="body1"
                              style={{ fontWeight: "bold", fontSize: "16px" }}
                            >
                              Round Name - {item.round}
                            </Typography>

                            {/* Additional Details */}
                            <Typography
                              variant="body2"
                              style={{
                                fontSize: "14px",
                                color: "#555",
                                marginTop: "4px",
                                lineHeight: "1.5",
                              }}
                            >
                              {item.category} - {item.subcategory} - {item.mode} - {item.type} - {formatDuration(item.duration)} - {`(${item?.description})`}
                            </Typography>
                          </div>
                        ) : null;
                      })}
                  </div>

                </FormControl>
              </Grid>

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
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={items ?? []}
        filename={"InterviewRoundOrder"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Interview Round Order Info"
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

export default InterviewRounOrder;
