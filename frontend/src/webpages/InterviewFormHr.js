import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  FormGroup,
  Checkbox,
  Backdrop,
  InputLabel,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import { handleApiError } from "../components/Errorhandling";
import ScreenshotInterviewRounds from "../components/ScreenshotInterviewRounds";
import InfoIcon from "@mui/icons-material/Info";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RadioGroup from "@mui/material/RadioGroup";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import { userStyle } from "../pageStyle";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Headtitle from "../components/Headtitle";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import hilifelogo from "../login/hilifelogo.png";
import moment from "moment-timezone";
import "../App.css";
import { off } from "process";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { Fab, DialogTitle, TextField, Tooltip, FormLabel } from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import BlockIcon from '@mui/icons-material/Block';


import LanguageIcon from '@mui/icons-material/Language';
import Select from "react-select";


function InterviewFormHr() {
  const idGen = useParams().id;
  const startedby = useParams()?.from;
  const usename = useParams()?.username;
  const pass = useParams()?.password;
  const roundids = useParams()?.roundid;
  const candidateid = useParams()?.candidateid;
  const hrid = useParams()?.hrid;


  const [userData, setUserData] = useState({});
  useEffect(() => {
    getUserDetails();
  }, [hrid]);
  const getUserDetails = async () => {
    let single_user = await axios.get(
      `${SERVICE.USER_SINGLE}/${hrid}`
    );
    setUserData(single_user?.data?.suser)
  }

  const [interviewGet, setInterviewGet] = useState([]);
  const [interviewGetForm, setInterviewGetForm] = useState([]);
  const [secondaryTodo, setSecondaryTodo] = useState([]);
  const [sub1todo, setSub1todo] = useState([]);
  const [subNext, setSubNext] = useState(false);
  const [sub2Todo, setSub2Todo] = useState([]);
  const [sub3Todo, setSub3Todo] = useState([]);
  const [sub4Todo, setSub4Todo] = useState([]);
  const [indexViewQuest, setIndexViewQuest] = useState(0);
  const [onGetStatus, setOnGetStatus] = useState(false);
  const [onDescStatus, setOnDescStatus] = useState(false);
  const [startStatus, setStartStatus] = useState(false);
  const [nextButton, setNextButton] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [phonenum, setPhonenum] = useState("");
  const [typingtestInput, setTypingTestInput] = useState("");
  const [typingtestDatas, setTypingTestDatas] = useState({
    typingspeed: "",
    typingspeedvalidation: "",
    typingspeedfrom: "",
    typingspeedto: "",
    typingspeedstatus: "",

    typingaccuracy: "",
    typingaccuracyvalidation: "",
    typingaccuracyfrom: "",
    typingaccuracyto: "",
    typingaccuracystatus: "",

    typingmistakes: "",
    typingmistakesvalidation: "",
    typingmistakesfrom: "",
    typingmistakesto: "",
    typingmistakesstatus: "",
  });
  const [errors, setErrors] = useState({});
  const [designationReqView, setDesignationReqView] = useState([]);
  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  const convertToNumberedList = (htmlContent) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;

    const listItems = Array.from(tempElement.querySelectorAll("li"));
    listItems.forEach((li, index) => {
      li.innerHTML = `\u2022 ${li.innerHTML}\n`;
    });

    return tempElement.innerText;
  };

  const additionalInfoStyle = {
    position: "absolute",
    top: 8,
    right: 12,
    fontSize: "13px",
    minWidth: "auto",
    padding: "2px 6px",
    textTransform: "none",
    background: "none",
    boxShadow: "none",
    color: "#1976d2",
    "&:hover": {
      background: "none",
      textDecoration: "underline",
    },
  }

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  // Description Final Popup model
  const [isDescFinalOpen, setIsDescFinalOpen] = useState(false);
  const [showDescFinalAlert, setShowDescFinalAlert] = useState();
  const handleClickOpenerrDescFinal = () => {
    setIsDescFinalOpen(true);
  };
  const handleCloseerrDescFinal = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsDescFinalOpen(false);
  };
  // Description Popup model
  const [isDescOpen, setIsDescOpen] = useState(false);
  const [showDescAlert, setShowDescAlert] = useState();
  const handleClickOpenerrDesc = () => {
    setIsDescOpen(true);
  };

  //password visibility
  const [showLivePassword, setShowLivePassword] = useState(false);
  const handleClickShowLivePassword = () =>
    setShowLivePassword((show) => !show);
  const handleMouseDownLivePassword = (event) => {
    event.preventDefault();
  };

  const handleCloseerrDesc = () => {
    setIsDescOpen(false);
    const answer = interviewGetForm
      // .filter((data) => data.userans)
      .map((item) => {
        return {
          ...item,
          question: item.question,
          userans: item.userans,
          type: item.type,
          secondarytodo: item.secondarytodo,
          answers: item.answers,
          statusAns: item.statusAns,
          typingspeedans: item?.typingspeedans,
          typingaccuracyans: item?.typingaccuracyans,
          typingmistakesans: item?.typingmistakesans,
          useransstatus: item?.useransstatus,
          optionArr: item.optionArr,
          attendby: item.attendby ? item.attendby : "Interviewer",
        };
      });
    sendRequest(answer);
  };

  const LoadingBackdrop = ({ open }) => {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <div className="pulsating-circle">
          <CircularProgress color="inherit" className="loading-spinner" />
        </div>
        <Typography
          variant="h6"
          sx={{ marginLeft: 2, color: "#fff", fontWeight: "bold" }}
        >
          Please Wait...
        </Typography>
      </Backdrop>
    );
  };

  const [isLoading, setIsLoading] = useState(true);

  const [selectedRadioSecondary, setSelectedRadioSecondary] = useState([]);
  const [selectedRadioSub1Page, setSelectedRadioSub1Page] = useState([]);
  const [selectedRadioSub2Page, setSelectedRadioSub2Page] = useState([]);

  // const handleRadioSecondary = (options) => {
  //   setSelectedRadioSecondary(options);
  // };
  const handleRadioSecondary = (newValue, index) => {
    setSelectedRadioSecondary((prevState) => {
      const updatedValues = [...prevState];
      updatedValues[index] = newValue; // Update the value at the specified index
      return updatedValues;
    });
  };
  const handleRadioSub1Page = (newValue, index) => {
    setSelectedRadioSub1Page((prevState) => {
      const updatedValues = [...prevState];
      updatedValues[index] = newValue; // Update the value at the specified index
      return updatedValues;
    });
  };

  const [selectedSubPageName, setSelectedSubPageName] = useState([]);
  const handleSubPageChange = (options) => {
    setSelectedSubPageName(options);
  };

  const [selectedSecondaryName, setSelectedSecondaryName] = useState([]);
  const handleSecondaryNameChange = (event, ind) => {
    const { checked, value } = event.target;

    setSelectedSecondaryName((prevState) => {
      const updatedValues = [...prevState];

      if (checked) {
        if (!updatedValues[ind]) {
          updatedValues[ind] = [];
        }
        updatedValues[ind].push(value);
      } else {
        updatedValues[ind] = updatedValues[ind].filter((val) => val !== value);
      }

      return updatedValues;
    });
  };

  const handleSecondaryNameChangePre = (values, ind) => {
    setSelectedSecondaryName((prevState) => {
      const updatedValues = [...prevState];

      if (!updatedValues[ind]) {
        updatedValues[ind] = [];
      }

      values.forEach((value) => {
        if (!updatedValues[ind].includes(value)) {
          updatedValues[ind].push(value);
        }
      });

      return updatedValues;
    });
  };
  const [selectedSub1PageName, setSelectedSub1PageName] = useState([]);
  const handleSub1PageChange = (event, ind) => {
    const { checked, value } = event.target;

    setSelectedSub1PageName((prevState) => {
      const updatedValues = [...prevState];

      if (checked) {
        if (!updatedValues[ind]) {
          updatedValues[ind] = [];
        }
        updatedValues[ind].push(value);
      } else {
        updatedValues[ind] = updatedValues[ind].filter((val) => val !== value);
      }

      return updatedValues;
    });
  };

  const handleSub1PageChangePre = (values, ind) => {
    setSelectedSub1PageName((prevState) => {
      const updatedValues = [...prevState];

      if (!updatedValues[ind]) {
        updatedValues[ind] = [];
      }

      values.forEach((value) => {
        if (!updatedValues[ind].includes(value)) {
          updatedValues[ind].push(value);
        }
      });

      return updatedValues;
    });
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const [islogin, setislogin] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [candidateRoundId, setCandidateRoundId] = useState("");

  const interviewLogin = async () => {
    try {
      const res = await axios.post(SERVICE.INTERVIEW_LOGIN, {
        username: String(userName),
        password: String(password),
        linkid: String(idGen),
        by: "CANDIDATE",
      });

      if (res?.data?.loginstatus === true) {
        setStartStatus(true);
        await testStatusUpdate(res?.data?.candidateroundid, "On Progress");
        setCandidateRoundId(res?.data?.candidateroundid);
      }
    } catch (err) {
      setislogin(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const testStatusUpdate = async (id, status) => {
    try {
      let subprojectscreate = await axios.put(
        `${SERVICE.UPDATE_INTERVIEWROUNDSTATUS}/${id}`,
        {
          roundstatus: String(status),
        }
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const testAnswerUpdate = async (id, answer) => {
    try {

      let allquestions = answer;
      let ignoredquestions = answer?.filter(data => data?.ignored);
      let attendedquestions = answer?.filter(data => !data?.ignored);

      let totMarks = Number(totalMarks || "0");
      let eligMarks = Number(eligibleMarks || "0");
      let eqLen = allquestions?.length === attendedquestions?.length;
      let lenDiff = allquestions?.length - attendedquestions?.length;
      // Ensure values do not go negative

      let finalTotalMarks = Math.max(eqLen ? totMarks : (totMarks - lenDiff), 0);

      let totalQuestions = finalTotalMarks || 0;
      let percentage = totMarks > 0 ? (eligMarks / totMarks) * 100 : 0;
      let eligibleMark = totalQuestions > 0 ? Math.round((percentage / 100) * totalQuestions) : 0;
      let finalEligibleMarks = Math.max(eqLen ? eligMarks : eligibleMark, 0);
      console.table({
        allquestions,
        ignoredquestions,
        attendedquestions,
        totMarks,
        eligMarks,
        eqLen,
        lenDiff,
        finalTotalMarks,
        totalQuestions,
        percentage,
        eligibleMark,
        finalEligibleMarks,
      })

      let byyy = startedby === "autologin" ? true : false;
      let subprojectscreate = await axios.put(
        `${SERVICE.UPDATE_INTERVIEWROUNDSTATUS}/${id}`,
        {
          roundstatus: "Completed",
          //   roundstatus:
          //     remainingQuestionArray?.length > 0 && byyy
          //       ? "Hr Completed"
          //       : remainingQuestionArray?.length > 0 && !byyy
          //       ? "Candidate Completed"
          //       : "Completed",
          interviewForm: answer,
          totalmarks: ignoredquestions?.length > 0 ? String(finalTotalMarks) : String(totalMarks),
          eligiblemarks: ignoredquestions?.length > 0 ? String(finalEligibleMarks) : String(eligibleMarks),
        }
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //add function
  const sendRequest = async (answer) => {
    try {
      // let finalAnswer = await concordiateArrays(
      //   allQuestionArray,
      //   remainingQuestionArray,
      //   answer
      // );
      // let subprojectscreate = await axios.post(SERVICE.CREATE_USER_RESPONSE, {
      //   username: userName,
      //   password: password,
      //   // phonenumber: String(phonenum),
      //   testcategory: String(testCategory),
      //   testsubcategory: String(testSubCategory),
      //   questionId: idGen,
      //   interviewForm: answer,
      //   addedby: [
      //     {
      //       name: String(userName),
      //       date: String(new Date()),
      //     },
      //   ],
      // });

      await testAnswerUpdate(candidateRoundId, answer);
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Submitted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
      setUserName("");
      setPassword("");
      setPhonenum("");
      localStorage.removeItem("timerDuration");
      localStorage.removeItem("formFilled");
      backPage(
        `/interview/interviewendpage/questions/${candidateid}/${roundids}`
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [isValidEmail, setIsValidEmail] = useState(false);
  const backPage = useNavigate();
  const nextStep = () => {
    const newErrors = {};
    // Check the validity of field1
    if (!userName) {
      newErrors.userName = (
        <Typography style={{ color: "red" }}>
          Username must be required
        </Typography>
      );
    }
    if (!password) {
      newErrors.password = (
        <Typography style={{ color: "red" }}>
          Password must be required
        </Typography>
      );
    }
    //  else if (!isValidEmail) {
    //   newErrors.email = (
    //     <Typography style={{ color: "red" }}>
    //       Please enter valid email
    //     </Typography>
    //   );
    // }
    // if (!phonenum) {
    //   newErrors.phonenum = (
    //     <Typography style={{ color: "red" }}>
    //       Phone no must be required
    //     </Typography>
    //   );
    // }
    setErrors(newErrors);
  };
  const handleStart = async (e) => {
    const newErrors = {};
    // Check the validity of field1
    if (!userName) {
      newErrors.userName = (
        <Typography style={{ color: "red" }}>
          Username must be required
        </Typography>
      );
    }
    if (!password) {
      newErrors.password = (
        <Typography style={{ color: "red" }}>
          Password must be required
        </Typography>
      );
    }
    // else if (!isValidEmail) {
    //   newErrors.email = (
    //     <Typography style={{ color: "red" }}>
    //       Please enter valid email
    //     </Typography>
    //   );
    // }
    // if (!phonenum) {
    //   newErrors.phonenum = (
    //     <Typography style={{ color: "red" }}>
    //       Phone number must be required
    //     </Typography>
    //   );
    // } else if (phonenum?.length < 10) {
    //   newErrors.phonenum = (
    //     <Typography style={{ color: "red" }}>
    //       Please enter valid phone number
    //     </Typography>
    //   );
    // }

    setErrors(newErrors);
    if (Object.keys(newErrors)?.length === 0) {
      await interviewLogin();
    }
  };
  //submit option for saving
  const handleSubmit = (e, ignore) => {
    e.preventDefault();
    // let primaryAnswer = interviewGetForm[indexViewQuest]?.userans;
    // let firstCheckArray = Array.isArray(primaryAnswer) && primaryAnswer?.length === 0;
    // let firstCheckStr = ((typeof primaryAnswer) === "string") && (primaryAnswer === "");



    // let secondaryAnswer = (interviewGetForm[indexViewQuest]?.secondarytodo?.length > 0 && secondaryTodo?.length > 0) ? interviewGetForm[indexViewQuest]?.secondarytodo[0]?.userans : "";
    // let secondaryCheckArray = secondaryTodo?.length > 0 && Array.isArray(secondaryAnswer) && secondaryAnswer?.length === 0;
    // let secondaryCheckStr = secondaryTodo?.length > 0 && ((typeof secondaryAnswer) === "string") && (secondaryAnswer === "");

    // let secondaryLoopAnswer = (interviewGetForm[indexViewQuest]?.secondarytodo?.length > 0 && sub1todo?.length > 0) ? interviewGetForm[indexViewQuest]?.secondarytodo[sub1todo?.length]?.userans : "";
    // let secondaryLoopCheckArray = sub1todo?.length > 0 && Array.isArray(secondaryLoopAnswer) && secondaryLoopAnswer?.length === 0;
    // let secondaryLoopCheckStr = sub1todo?.length > 0 && ((typeof secondaryLoopAnswer) === "string") && (secondaryLoopAnswer === "");

    // if (!ignore && (!primaryAnswer || firstCheckArray || firstCheckStr)) {
    //   // setShowEmptyAlert();
    //   console.log("log1")
    //   handleClickOpenerrEmpty();
    //   return;
    // }
    // else if (!ignore && ((secondaryTodo?.length > 0 && secondaryAnswer === "") || secondaryCheckArray || secondaryCheckStr)) {
    //   console.log("log2")
    //   handleClickOpenerrEmpty();
    //   return;
    // }
    // else if (!ignore && ((sub1todo?.length > 0 && secondaryLoopAnswer === "") || secondaryLoopCheckArray || secondaryLoopCheckStr)) {
    //   console.log("log3")
    //   handleClickOpenerrEmpty();
    //   return;
    // }
    // nextStep();
    let updatedForm = interviewGetForm;
    if (ignore) {
      updatedForm = interviewGetForm.map((item, index) =>
        index === indexViewQuest ? { ...item, userans: null, ignored: true } : item
      );

      setInterviewGetForm(updatedForm);
    }

    const answer = updatedForm
      // .filter((data) => data.userans)
      .map((item) => {
        return {
          ...item,
          question: item.question,
          userans: item.userans,
          type: item.type,
          secondarytodo: item.secondarytodo,
          answers: item.answers,
          statusAns: item.statusAns,
          typingspeedans: item?.typingspeedans,
          typingaccuracyans: item?.typingaccuracyans,
          typingmistakesans: item?.typingmistakesans,
          useransstatus: item?.useransstatus,
          optionArr: item.optionArr,
          attendby: item.attendby ? item.attendby : "Interviewer",
        };
      });
    if (userName === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Username"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (password === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Password"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    // else if (phonenum === "") {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {"Please Enter Phone Number"}
    //       </p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else if (answer?.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Answer Ay One of the Questions"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest(answer);
    }
  };

  const handleIgnore = (from, event) => {
    setInterviewGetForm(prevForm =>
      prevForm.map((item, index) =>
        index === indexViewQuest ? { ...item, userans: null, ignored: true } : item
      )
    );

    if (from === "next") {
      handleConditionCheck(true)
    } else {
      handleSubmit(event, true)
    }

  }

  //empty answer
  const [isEmptyOpen, setIsEmptyOpen] = useState(false);
  const [showEmptyAlert, setShowEmptyAlert] = useState(
    <>
      <ErrorOutlineOutlinedIcon
        sx={{ fontSize: "100px", color: "orange" }}
      />
      <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Give Answer for this Question!"}</p>
    </>
  );
  const handleClickOpenerrEmpty = () => {
    setIsEmptyOpen(true);
  };
  const handleCloseerrEmpty = () => {
    setIsEmptyOpen(false);
  };

  const [additionalOpen, setAdditionalOpen] = useState(false);
  const handleConditionCheck = (ignore) => {


    setSub1todo([]);
    setSecondaryTodo([]);
    setSub2Todo([]);
    setSub3Todo([]);
    setSub4Todo([]);
    setSelectedSecondaryName([]);
    setSelectedSub1PageName([]);
    setSelectedSubPageName([]);
    setQuote("");
    setStartTime(null);
    if (true && startStatus === true) {
      setIndexViewQuest(indexViewQuest + 1);
      if (
        interviewGetForm[indexViewQuest + 1]?.attendby &&
        interviewGetForm[indexViewQuest + 1]?.questionattended
      ) {
        setSecondaryTodo(
          interviewGetForm[indexViewQuest + 1]?.secondarytodo?.slice(0, 1) ?? []
        );

        if (
          interviewGetForm[indexViewQuest + 1]?.type === "MultipleChoice" &&
          interviewGetForm[indexViewQuest + 1]?.userans?.length > 0
        ) {
          handleSubPageChange(
            interviewGetForm[indexViewQuest + 1]?.userans?.map((data) => ({
              label: data,
              value: data,
            }))
          );
        }

        if (
          interviewGetForm[indexViewQuest + 1]?.secondarytodo[0]?.type ===
          "MultipleChoice" &&
          interviewGetForm[indexViewQuest + 1]?.secondarytodo[0]?.userans
            ?.length > 0
        ) {
          handleSecondaryNameChangePre(
            interviewGetForm[indexViewQuest + 1]?.secondarytodo[0]?.userans,
            0
          );
        }

        let exceptzero =
          interviewGetForm[indexViewQuest + 1]?.secondarytodo?.slice(1);
        setSub1todo(exceptzero ?? []);

        handleRadioSecondary(
          interviewGetForm[indexViewQuest + 1]?.secondarytodo[0]?.userans[0],
          0
        );

        exceptzero &&
          exceptzero?.map((data, index) => {
            if (data?.type !== "MultipleChoice") {
              handleRadioSub1Page(data?.userans[0], index);
            }
          });

        exceptzero &&
          exceptzero?.map((data, index) => {
            if (data?.type === "MultipleChoice") {
              handleSub1PageChangePre(data?.userans, index);
            }
          });
      } else if (
        !interviewGetForm[indexViewQuest + 1]?.attendby &&
        interviewGetForm[indexViewQuest + 1]?.questionattended
      ) {
        if (
          interviewGetForm[indexViewQuest + 1]?.secondarytodo[0]
            ?.questionattended
        ) {
          setSecondaryTodo(
            interviewGetForm[indexViewQuest + 1]?.secondarytodo?.slice(0, 1) ??
            []
          );

          handleRadioSecondary(
            interviewGetForm[indexViewQuest + 1]?.secondarytodo[0]?.userans,
            0
          );
        }

        if (
          interviewGetForm[indexViewQuest + 1]?.type === "MultipleChoice" &&
          interviewGetForm[indexViewQuest + 1]?.questionattended &&
          interviewGetForm[indexViewQuest + 1]?.userans?.length > 0
        ) {
          handleSubPageChange(
            interviewGetForm[indexViewQuest + 1]?.userans?.map((data) => ({
              label: data,
              value: data,
            }))
          );
        }

        if (
          interviewGetForm[indexViewQuest + 1]?.secondarytodo[0]?.type ===
          "MultipleChoice" &&
          interviewGetForm[indexViewQuest + 1]?.questionattended &&
          interviewGetForm[indexViewQuest + 1]?.secondarytodo[0]?.userans
            ?.length > 0
        ) {
          handleSecondaryNameChangePre(
            interviewGetForm[indexViewQuest + 1]?.secondarytodo[0]?.userans,
            0
          );
        }

        let exceptzero =
          interviewGetForm[indexViewQuest + 1]?.secondarytodo?.slice(1);
        let attendedQuestions = exceptzero?.filter(
          (data) => data?.questionattended
        );
        setSub1todo(attendedQuestions ?? []);

        exceptzero &&
          exceptzero?.map((data, index) => {
            if (data?.type !== "MultipleChoice" && data?.questionattended) {
              handleRadioSub1Page(data?.userans, index);
            }
          });

        exceptzero &&
          exceptzero?.map((data, index) => {
            if (data?.type === "MultipleChoice" && data?.questionattended) {
              handleSub1PageChangePre(data?.userans, index);
            }
          });
      }
      setNextButton(false);
    } else if (
      startStatus === true &&
      onGetStatus === false &&
      onDescStatus === true
    ) {
      const answer = interviewGetForm
        // .filter((data) => data.userans)
        .map((item) => {
          return {
            question: item.question,
            userans: item.userans,
            type: item.type,
            typingspeed: item?.typingspeed,
            typingaccuracy: item?.typingaccuracy,
            typingmistakes: item?.typingmistakes,
            answers: item.answers,
            statusAns: item.statusAns,
            optionArr: item.optionArr,
          };
        });
      const lastObject = answer[answer?.length - 1];

      const matchingObject = lastObject.optionArr.find(
        (obj) => obj.options === lastObject.userans
      );
      const descriptions = matchingObject ? matchingObject.description : null;
      setShowDescAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{descriptions}</p>
        </>
      );
      handleClickOpenerrDesc();
    } else {
      const answer = interviewGetForm
        // .filter((data) => data.userans)
        .map((item) => {
          return {
            ...item,
            question: item.question,
            userans: item.userans,
            type: item.type,
            typingspeedans: item?.typingspeedans,
            typingaccuracyans: item?.typingaccuracyans,
            typingmistakesans: item?.typingmistakesans,
            useransstatus: item?.useransstatus,
            secondarytodo: item.secondarytodo,
            answers: item.answers,
            statusAns: item.statusAns,
            optionArr: item.optionArr,
            attendby: item.attendby ? item.attendby : "Interviewer",
          };
        });
      sendRequest(answer);
    }
  };

  const handlePreviousButton = () => {
    let prevInd = indexViewQuest - 1;
    setIndexViewQuest(indexViewQuest - 1);

    if (
      interviewGetForm[prevInd]?.attendby &&
      interviewGetForm[prevInd]?.questionattended
    ) {
      setSecondaryTodo(
        interviewGetForm[prevInd]?.secondarytodo?.slice(0, 1) ?? []
      );

      if (
        interviewGetForm[prevInd]?.type === "MultipleChoice" &&
        interviewGetForm[prevInd]?.userans?.length > 0
      ) {
        handleSubPageChange(
          interviewGetForm[prevInd]?.userans?.map((data) => ({
            label: data,
            value: data,
          }))
        );
      }

      if (
        interviewGetForm[prevInd]?.secondarytodo[0]?.type ===
        "MultipleChoice" &&
        interviewGetForm[prevInd]?.secondarytodo[0]?.userans?.length > 0
      ) {
        handleSecondaryNameChangePre(
          interviewGetForm[prevInd]?.secondarytodo[0]?.userans,
          0
        );
      }

      let exceptzero = interviewGetForm[prevInd]?.secondarytodo?.slice(1);
      setSub1todo(exceptzero ?? []);

      handleRadioSecondary(
        interviewGetForm[prevInd]?.secondarytodo[0]?.userans[0],
        0
      );

      exceptzero &&
        exceptzero?.map((data, index) => {
          if (data?.type !== "MultipleChoice") {
            handleRadioSub1Page(data?.userans[0], index);
          }
        });

      exceptzero &&
        exceptzero?.map((data, index) => {
          if (data?.type === "MultipleChoice") {
            handleSub1PageChangePre(data?.userans, index);
          }
        });
    } else if (
      !interviewGetForm[prevInd]?.attendby &&
      interviewGetForm[prevInd]?.questionattended
    ) {
      setSecondaryTodo(
        interviewGetForm[prevInd]?.secondarytodo?.slice(0, 1) ?? []
      );

      if (
        interviewGetForm[prevInd]?.type === "MultipleChoice" &&
        interviewGetForm[prevInd]?.userans?.length > 0
      ) {
        handleSubPageChange(
          interviewGetForm[prevInd]?.userans?.map((data) => ({
            label: data,
            value: data,
          }))
        );
      }

      if (
        interviewGetForm[prevInd]?.secondarytodo[0]?.type ===
        "MultipleChoice" &&
        interviewGetForm[prevInd]?.secondarytodo[0]?.userans?.length > 0
      ) {
        handleSecondaryNameChangePre(
          interviewGetForm[prevInd]?.secondarytodo[0]?.userans,
          0
        );
      }

      let exceptzero = interviewGetForm[prevInd]?.secondarytodo?.slice(1);
      setSub1todo(exceptzero ?? []);

      handleRadioSecondary(
        interviewGetForm[prevInd]?.secondarytodo[0]?.userans,
        0
      );

      exceptzero &&
        exceptzero?.map((data, index) => {
          if (data?.type !== "MultipleChoice") {
            handleRadioSub1Page(data?.userans, index);
          }
        });

      exceptzero &&
        exceptzero?.map((data, index) => {
          if (data?.type === "MultipleChoice") {
            handleSub1PageChangePre(data?.userans, index);
          }
        });
    }
  };

  useEffect(() => {
    if (startedby === "autologin") {
      setStartStatus(true);
      setCandidateRoundId(roundids);
      setUserName(usename);
      setPassword(pass);
    }
  }, [startedby, usename, pass, roundids]);

  const [duration, setDuration] = useState("");
  const [durationInitial, setDurationInitial] = useState("");
  useEffect(() => {
    const storedDuration = localStorage.getItem("timerDuration");
    const storedFormData = localStorage.getItem("formFilled");
    if (storedDuration && storedFormData) {
      setDuration(storedDuration);
    } else {
      fetchInterviewGenerateHr();
    }
  }, []);

  useEffect(() => {
    if (duration !== durationInitial) {
      localStorage.setItem("timerDuration", duration);
    }
  }, [duration]);

  useEffect(() => {
    if (
      interviewGetForm?.length > 0 &&
      userName !== "" &&
      password !== "" &&
      startStatus
    ) {
      localStorage.setItem("formFilled", true);
    }
  }, [interviewGetForm, userName, password, startStatus]);

  const intervalIdRef = useRef(null);
  useEffect(() => {
    const allFilled = localStorage.getItem("formFilled");
    if (allFilled) {
      intervalIdRef.current = setInterval(() => {
        setDuration((prevTime) => {
          const newTime = reduceTime(prevTime);
          if (newTime === "00:00:00") {
            setShowDescAlert(
              <>
                <ErrorOutlineOutlinedIcon
                  sx={{ fontSize: "100px", color: "orange" }}
                />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                  "Time Up! Click OK to Submit your form"
                </p>
              </>
            );
            handleClickOpenerrDesc();
            clearInterval(intervalIdRef.current);
          }
          return newTime;
        });
      }, 1000);

      return () => {
        clearInterval(intervalIdRef.current);
      };
    }
  }, [interviewGetForm, userName, password, startStatus]);

  const reduceTime = (currentTime) => {
    const [hours, minutes, seconds] = currentTime?.split(":");
    let currentHours = parseInt(hours, 10);
    let currentMinutes = parseInt(minutes, 10);
    let currentSeconds = parseInt(seconds, 10);

    currentSeconds -= 1;

    if (currentSeconds < 0) {
      currentMinutes -= 1;
      currentSeconds = 59;

      if (currentMinutes < 0) {
        currentHours -= 1;
        currentMinutes = 59;

        if (currentHours < 0) {
          return "00:00:00";
        }
      }
    }

    return `${String(currentHours).padStart(2, "0")}:${String(
      currentMinutes
    ).padStart(2, "0")}:${String(currentSeconds).padStart(2, "0")}`;
  };
  const [testCategory, setTestCategory] = useState("");
  const [testSubCategory, setTestSubCategory] = useState("");

  const [allQuestionArray, setAllQuestionArray] = useState([]);
  const [remainingQuestionArray, setRemainingQuestionArray] = useState([]);

  const concordiateArrays = (mainArray, subarray1, subarray2) => {
    const result = [];

    mainArray.forEach((obj) => {
      const objInSubarray1 = subarray1.find((item) => item._id === obj._id);
      if (objInSubarray1) {
        result.push(objInSubarray1);
      }
      const objInSubarray2 = subarray2.find((item) => item._id === obj._id);
      if (objInSubarray2) {
        result.push(objInSubarray2);
      }
    });

    return result.filter((obj) => obj !== null);
  };
  const [canidateDetails, setCandidateDetails] = useState([])
  const getCandidateDetails = async () => {
    try {
      let single_cand = await axios.get(
        `${SERVICE.CANDIDATES_SINGLE}/${candidateid}`
      );
      setCandidateDetails(single_cand.data.scandidates);
      return single_cand.data.scandidates;
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [totalMarks, setTotalMarks] = useState(0);
  const [eligibleMarks, setEligibleMarks] = useState(0);
  const [roundDetails, setRoundDetails] = useState({
    roundname: "",
  })
  //get all Sub vendormasters.
  const fetchInterviewGenerateHr = async () => {
    try {
      let single_round = await axios.post(
        `${SERVICE.INTERVIEW_ROUND}/${candidateid}/${roundids}`
      );
      let res_vendor = await axios.get(
        `${SERVICE.INTERVIEWQUESTIONSORDER_SINGLE}/${idGen}`
      );
      let verificationMaster = await axios.get(
        `${SERVICE.ALL_INTERVIEW_VERIFICATION}`
      );
      const verificationDetails = verificationMaster?.data?.allInterviewVerification;
      setDuration(`${res_vendor.data.sinterviewquestionsorder.duration}:00`);
      setDurationInitial(
        `${res_vendor.data.sinterviewquestionsorder.duration}:00`
      );
      setInterviewGet(res_vendor.data.sinterviewquestionsorder);


      let cat = res_vendor.data.sinterviewquestionsorder?.category;
      let subcat = res_vendor.data.sinterviewquestionsorder?.subcategory;

      setTestCategory(cat);
      setTestSubCategory(subcat);


      let res = await axios.post(SERVICE.DYNAMIC_INTERVIEWQUESTION, {
        pipeline: [
          {
            $match: {
              typingtest: false,
              category: cat,
              subcategory: { $in: subcat },
            }
          },

        ]
      });

      let byyy = startedby === "autologin" ? true : false;

      let intQues = res?.data?.interviewquestions?.filter(
        (data) =>
          data.category === cat &&
          subcat?.includes(data.subcategory) &&
          !data?.typingtest
      );
      let verifyQues = verificationDetails?.filter(
        (data) =>
          data.category === cat &&
          subcat?.includes(data.subcategory)
      );

      let exceptTyping = single_round?.data?.interviewRound?.interviewForm;
      setAllQuestionArray(exceptTyping);
      setRoundDetails({
        roundname: single_round?.data?.interviewRound?.roundname || "",
      })


      let singleCandidate = await getCandidateDetails();

      // Check if both values exist
      const hasWorkMode = !!singleCandidate?.workmode;
      const hasStatusExp = !!singleCandidate?.candidatestatusexp;

      const sortedQuestions = exceptTyping.filter((questionObj) => {

        let matchedIntQues;
        if (single_round?.data?.interviewRound?.mode === "Verification/Administrative") {

          matchedIntQues = verifyQues?.find((item) => item?.question == questionObj?.question);
        } else {
          matchedIntQues = intQues?.find((item) => item?.name == questionObj?.question);

        }

        if (!matchedIntQues) return false; // Skip if no matching question

        const { workmode = [], candidatestatusexp = [] } = matchedIntQues;

        if ((!hasWorkMode || !hasStatusExp) || (workmode?.length === 0 && candidatestatusexp?.length === 0) || singleCandidate?.workmode === "Please Select Work Mode" || singleCandidate?.candidatestatusexp === "Please Select Candidate Status") {
          // If any required value is missing, return the question
          return true;
        }

        // Check if singleCandidate's values exist in intQues arrays
        return workmode.includes(singleCandidate.workmode) && candidatestatusexp.includes(singleCandidate.candidatestatusexp);
      });

      let totMarks = Number(single_round?.data?.interviewRound?.totalmarks || "0");
      let eligMarks = Number(single_round?.data?.interviewRound?.eligiblemarks || "0");
      let eqLen = exceptTyping?.length === sortedQuestions?.length;
      let lenDiff = exceptTyping?.length - sortedQuestions?.length;
      // Ensure values do not go negative

      let finalTotalMarks = Math.max(eqLen ? totMarks : (totMarks - lenDiff), 0);

      let totalQuestions = finalTotalMarks || 0;
      let percentage = totMarks > 0 ? (eligMarks / totMarks) * 100 : 0;
      let eligibleMark = totalQuestions > 0 ? Math.round((percentage / 100) * totalQuestions) : 0;
      let finalEligibleMarks = Math.max(eqLen ? eligMarks : eligibleMark, 0);

      setTotalMarks(finalTotalMarks);
      setEligibleMarks(finalEligibleMarks);
      // let mainSame = single_round?.data?.interviewRound?.interviewForm;

      let mainSame = sortedQuestions?.map((data) => {
        let foundData;
        if (single_round?.data?.interviewRound?.mode === "Verification/Administrative") {

          foundData = verifyQues?.find((item) => item?.question == data?.question);
        } else {
          foundData = intQues?.find((item) => item?.name == data?.question);

        }
        if (foundData) {
          let subsame = data?.secondarytodo?.map((data1) => {
            let foundSubsame = foundData?.subquestions?.find(
              (item1) => item1?.question == data1?.question
            );
            if (foundSubsame) {
              return {
                ...data1,
                uploadedimage: foundSubsame?.uploadedimage || "",
                uploadedimagename: foundSubsame?.uploadedimagename || "",
                tamilquestion: foundSubsame?.tamilquestion || "",
                data: foundSubsame?.files[0]?.data || "",
              };
            } else {
              return {
                ...data1,
                uploadedimage: "",
                uploadedimagename: "",
                tamilquestion: "",
                data: "",
              };
            }
          });
          return {
            ...data,
            uploadedimage: foundData?.uploadedimage || "",
            uploadedimagename: foundData?.uploadedimagename || "",
            data: foundData?.files?.length > 0 ? foundData?.files[0]?.data : "",
            typingtesttype: foundData?.questiontype || "",
            questionpreference: foundData?.questionpreference || "Default",
            questiondescription: foundData?.questiondescription || "",
            tamilquestion: foundData?.tamilquestion || "",
            tamilquestiondescription: foundData?.tamilquestiondescription || "",
            secondarytodo: subsame,
          };
        } else {
          return {
            ...data,
            uploadedimage: "",
            uploadedimagename: "",
            data: "",
            questionpreference: foundData?.questionpreference || "Default",
            tamilquestion: "",
            tamilquestiondescription: "",
            questiondescription: foundData?.questiondescription || "",
            secondarytodo: (data?.secondarytodo || []).map((subsame) => ({
              ...subsame,
              uploadedimage: "",
              uploadedimagename: "",
              data: "",
            })),
          };
        }
      });

      const questionOrder = res_vendor?.data.sinterviewquestionsorder?.question;
      const rearrangedMainSame = mainSame.sort((a, b) => {
        const indexA = questionOrder.indexOf(a.question);
        const indexB = questionOrder.indexOf(b.question);

        // If either question is not found, we could optionally handle it
        if (indexA === -1 || indexB === -1) return 0;

        return indexA - indexB;
      });

      setInterviewGetForm(rearrangedMainSame);

      setRemainingQuestionArray(
        single_round?.data?.interviewRound?.interviewForm
      );

      if (
        mainSame[0]?.type === "MultipleChoice" &&
        mainSame[0]?.userans?.length > 0
      ) {
        handleSubPageChange(
          mainSame[0]?.userans?.map((data) => ({
            label: data,
            value: data,
          }))
        );
      }

      if (mainSame[0]?.attendby) {
        setSecondaryTodo(mainSame[0]?.secondarytodo?.slice(0, 1) ?? []);

        if (
          mainSame[0]?.secondarytodo[0]?.type === "MultipleChoice" &&
          mainSame[0]?.secondarytodo[0]?.userans?.length > 0
        ) {
          handleSecondaryNameChangePre(
            mainSame[0]?.secondarytodo[0]?.userans,
            0
          );
        }

        let exceptzero = mainSame[0]?.secondarytodo?.slice(1);
        setSub1todo(exceptzero ? exceptzero : []);

        handleRadioSecondary(mainSame[0]?.secondarytodo[0]?.userans[0], 0);
        exceptzero &&
          exceptzero?.map((data, index) => {
            if (data?.type !== "MultipleChoice") {
              handleRadioSub1Page(data?.userans[0], index);
            }
          });

        exceptzero &&
          exceptzero?.map((data, index) => {
            if (data?.type === "MultipleChoice") {
              handleSub1PageChangePre(data?.userans, index);
            }
          });
      }
      setNextButton(true);
      setOnGetStatus(true);
    } catch (err) {
      setIsLoading(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    } finally {
      setIsLoading(false);
    }
  };

  const [allInterviewQuestions, setAllInterviewQuestions] = useState([]);

  //get all Sub vendormasters.
  const fetchInterviewQuestions = async () => {
    try {
      let res = await axios.post(SERVICE.DYNAMIC_INTERVIEWQUESTION, {
        pipeline: [
          {
            $match: {
              typingtest: false
            }
          },

        ]
      });

      setAllInterviewQuestions(res?.data?.interviewquestions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // useEffect(() => {
  //   fetchInterviewQuestions();
  // }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [quote, setQuote] = useState("");
  const [startSingleStatus, setStartSingleStatus] = useState("");
  const [time, setTime] = useState(null);
  const [timeInitial, setTimeInitial] = useState();
  const [timer, setTimer] = useState(null);
  const [mistakes, setMistakes] = useState(0);

  const userInputRef = React.createRef();
  const [startTime, setStartTime] = useState(null);
  const [finalDescription, setFinaDescription] = useState("");
  const handleRadioButtonChange = (data, index, value, from) => {


    setSecondaryTodo([]);
    setSub1todo([]);
    setSub2Todo([]);
    setSub3Todo([]);
    setSub4Todo([]);
    setSelectedSecondaryName([]);
    setSelectedSub1PageName([]);
    if (
      data?.type === "Radio" ||
      data?.type === "Yes/No" ||
      data?.type === "Correct/In Correct"
    ) {
      let ans = interviewGetForm[index]?.optionArr?.find((item) => {
        if (item?.options === value) {
          return item;
        }
      });

      const answerSecondary = data?.secondarytodo?.filter(
        (item) =>
          item?.options === value && item?.extraquestion === "Sub Question"
      );
      answerSecondary?.length > 0 ? setNextButton(false) : setNextButton(true);
      setSecondaryTodo(answerSecondary?.length > 0 ? answerSecondary : []);
      interviewGetForm[index].userans = value;
      interviewGetForm[index].questionattended = true;
      interviewGetForm[index].status = ans?.status;

      if (
        ans?.status === "Eligible" ||
        ans?.status === "Informative" ||
        ans?.status === "Manual Decision"
      ) {
        // interviewGetForm[index].status = ans?.status;
        setOnGetStatus(true);
        setOnDescStatus(false);
      } else if (ans?.status === "Not-Eligible" || ans?.status === "Hold") {
        setOnDescStatus(true);
        setOnGetStatus(false);
      } else {
        setOnGetStatus(false);
        setOnDescStatus(false);
      }
    }
    if (data?.type === "MultipleChoice") {
      // const answer = value?.map((options) => options?.value);
      const updatedUserAns = value.target.checked
        ? [...(interviewGetForm[index].userans || []), value.target.value]
        : interviewGetForm[index].userans.filter(
          (ans) => ans !== value.target.value
        );

      const answer = updatedUserAns;
      let ans = interviewGetForm[index]?.optionArr?.filter((data) =>
        answer?.includes(data?.options)
      );
      const answerSecondary = data?.secondarytodo?.filter(
        (item) =>
          answer?.includes(item?.options) &&
          item?.extraquestion === "Sub Question"
      );
      setSecondaryTodo(answerSecondary?.length > 0 ? answerSecondary : []);
      let check = ans?.some((data) => data?.status === "Not-Eligible");
      let checkAns = ans?.filter((data) => data?.status !== "Not-Eligible");
      let checkFail = ans?.filter((data) => data?.status === "Not-Eligible");
      setOnGetStatus(
        checkAns?.length > checkFail?.length ||
        checkAns?.length === checkFail?.length
      );
      interviewGetForm[index].userans = answer;
      interviewGetForm[index].questionattended = true;
      interviewGetForm[index].status =
        checkAns?.length > checkFail?.length ||
          checkAns?.length === checkFail?.length
          ? "Eligible"
          : "Not-Eligible";
      if (updatedUserAns?.length !== 0) {
        answerSecondary?.length > 0
          ? setNextButton(false)
          : setNextButton(true);
      } else {
        setNextButton(false);
      }
    }
    if (data?.type === "TextBox") {
      let checkNoAnswer = interviewGetForm[index]?.optionArr?.some(
        (item) => item.options === "NOANSWER"
      );

      let ans = interviewGetForm[index]?.optionArr?.some(
        (item) => item?.options?.toLowerCase() === value?.toLowerCase()
      );
      let ansStatus = interviewGetForm[index]?.optionArr?.find(
        (item) => item?.options?.toLowerCase() === value?.toLowerCase()
      );

      checkNoAnswer ? setOnGetStatus(true) : setOnGetStatus(ans);

      const answerSecondary = data?.secondarytodo?.filter(
        (item) =>
          (item?.options === "NOANSWER" ||
            item?.options.toLowerCase() === value.toLowerCase()) &&
          item?.extraquestion === "Sub Question"
      );

      setSecondaryTodo(answerSecondary?.length > 0 ? answerSecondary : []);

      interviewGetForm[index].userans = value;
      interviewGetForm[index].questionattended = true;
      interviewGetForm[index].status = checkNoAnswer
        ? "Eligible"
        : interviewGetForm[index]?.optionArr[0].status;
      // : ansStatus?.status;
      if (value !== "") {
        answerSecondary?.length > 0
          ? setNextButton(false)
          : setNextButton(true);
      } else {
        setNextButton(false);
      }
    }
    if (data?.type === "Date") {
      let checkNoAnswer =
        data?.date === "" || data?.date === "NODATE" ? true : false;

      let ans = data?.date === value;

      checkNoAnswer ? setOnGetStatus(true) : setOnGetStatus(ans);

      const answerSecondary = checkNoAnswer
        ? data?.secondarytodo?.filter(
          (item) =>
            (item?.options === "NODATE" || item?.options === "") &&
            item?.extraquestion === "Sub Question"
        )
        : ans
          ? data?.secondarytodo?.filter(
            (item) =>
              moment(item?.options, "DD-MM-YYYY").format("YYYY-MM-DD") ===
              value && item?.extraquestion === "Sub Question"
          )
          : [];

      setSecondaryTodo(answerSecondary?.length > 0 ? answerSecondary : []);

      interviewGetForm[index].userans = value;
      interviewGetForm[index].questionattended = true;
      interviewGetForm[index].status = checkNoAnswer
        ? "Eligible"
        : data?.datestatus;
      if (value !== "") {
        answerSecondary?.length > 0
          ? setNextButton(false)
          : setNextButton(true);
      } else {
        setNextButton(false);
      }
    }

    if (data?.type === "Date Range") {
      const isValid =
        value === data?.fromdate ||
        value === data?.todate ||
        (value >= data?.fromdate && value <= data?.todate);

      setOnGetStatus(isValid);

      const answerSecondary = isValid
        ? data?.secondarytodo?.filter((obj) => {
          if (
            obj.options.includes(" - ") &&
            obj?.extraquestion === "Sub Question"
          ) {
            const [fromDateStr, toDateStr] = obj.options.split(" - ");
            const fromDate = new Date(
              moment(fromDateStr, "DD-MM-YYYY").format("YYYY-MM-DD")
            );
            const toDate = new Date(
              moment(toDateStr, "DD-MM-YYYY").format("YYYY-MM-DD")
            );
            const userDate = new Date(value);

            return userDate >= fromDate && userDate <= toDate;
          } else {
            return false;
          }
        })
        : [];

      setSecondaryTodo(answerSecondary?.length > 0 ? answerSecondary : []);

      interviewGetForm[index].userans = value;
      interviewGetForm[index].questionattended = true;
      interviewGetForm[index].status = data?.datestatus;
      if (value !== "") {
        answerSecondary?.length > 0
          ? setNextButton(false)
          : setNextButton(true);
      } else {
        setNextButton(false);
      }
    }

    if (data?.type === "Text-Alpha") {
      const textOnly = value.replace(/[^a-zA-Z\s;]/g, "");

      let checkNoAnswer = interviewGetForm[index]?.optionArr?.some(
        (item) => item?.options === "NOANSWER"
      );

      let ans = interviewGetForm[index]?.optionArr?.some(
        (item) => item?.options.toLowerCase() === textOnly?.toLowerCase()
      );
      let ansStatus = interviewGetForm[index]?.optionArr?.find(
        (item) => item?.options.toLowerCase() === textOnly?.toLowerCase()
      );

      checkNoAnswer ? setOnGetStatus(true) : setOnGetStatus(ans);

      const answerSecondary = data?.secondarytodo?.filter(
        (item) =>
          (item?.options === "NOANSWER" ||
            item?.options.toLowerCase() === textOnly.toLowerCase()) &&
          item?.extraquestion === "Sub Question"
      );

      setSecondaryTodo(answerSecondary?.length > 0 ? answerSecondary : []);

      interviewGetForm[index].userans = textOnly;
      interviewGetForm[index].questionattended = true;
      interviewGetForm[index].status = checkNoAnswer
        ? "Eligible"
        : // : ansStatus?.status;
        interviewGetForm[index]?.optionArr[0].status;
      if (textOnly !== "") {
        answerSecondary?.length > 0
          ? setNextButton(false)
          : setNextButton(true);
      } else {
        setNextButton(false);
      }
    }
    if (data?.type === "Text-Numeric") {
      const numericOnly = value.replace(/[^0-9.;\s]/g, "");

      let checkNoAnswer = interviewGetForm[index]?.optionArr?.some(
        (item) => item.options === "NOANSWER"
      );

      let ans = interviewGetForm[index]?.optionArr?.some(
        (item) => item.options == numericOnly
      );
      // let ansStatus = interviewGetForm[index]?.optionArr?.find(
      //   (item) => item.options == numericOnly
      // );

      let isValid = false;
      let validations = interviewGetForm[index]?.optionArr[0].validation;
      let validationsOptions = interviewGetForm[index]?.optionArr[0].options;

      if (validations === "Less Than") {
        if (Number(numericOnly) < Number(validationsOptions)) {
          isValid = true;
        }
      } else if (validations === "Less Than or Equal to") {
        if (Number(numericOnly) <= Number(validationsOptions)) {
          isValid = true;
        }
      } else if (validations === "Greater Than") {
        if (Number(numericOnly) > Number(validationsOptions)) {
          isValid = true;
        }
      } else if (validations === "Greater Than or Equal to") {
        if (Number(numericOnly) >= Number(validationsOptions)) {
          isValid = true;
        }
      } else if (validations === "Equal to") {
        if (Number(numericOnly) === Number(validationsOptions)) {
          isValid = true;
        }
      } else if (validations === "Between") {
        if (
          Number(numericOnly) >=
          interviewGetForm[index]?.optionArr[0].betweenfrom &&
          Number(numericOnly) <= interviewGetForm[index]?.optionArr[0].betweento
        ) {
          isValid = true;
        }
      }

      checkNoAnswer ? setOnGetStatus(true) : setOnGetStatus(isValid);

      const answerSecondary = checkNoAnswer
        ? data.secondarytodo?.filter(
          (item) =>
            (item?.options == validationsOptions ||
              item?.options === "NOANSWER") &&
            item?.extraquestion === "Sub Question"
        )
        : isValid
          ? data.secondarytodo?.filter(
            (item) =>
              item?.options == validationsOptions &&
              item?.extraquestion === "Sub Question"
          )
          : [];

      setSecondaryTodo(answerSecondary?.length > 0 ? answerSecondary : []);

      interviewGetForm[index].userans = numericOnly;
      interviewGetForm[index].questionattended = true;
      interviewGetForm[index].status = checkNoAnswer
        ? "Eligible"
        : (isValid ? "Eligible" : "Not-Eligible");
      // : interviewGetForm[index]?.optionArr[0].status;

      if (numericOnly !== "") {
        answerSecondary?.length > 0
          ? setNextButton(false)
          : setNextButton(true);
      } else {
        setNextButton(false);
      }
    }
    const updatedArray = interviewGetForm?.map((item, indexVal) => {
      if (index === indexVal) {
        if (item?.secondarytodo?.length > 0) {
          const updatedSecondaryTodo = item?.secondarytodo?.map(
            (subItem, index) => {
              return {
                ...subItem,
                userans: "",
                questionattended: false,
              };
            }
          );

          return {
            ...item,
            secondarytodo: updatedSecondaryTodo,
          };
        }
      }

      return item;
    });
    setInterviewGetForm(updatedArray);
    setSelectedRadioSecondary([]);
    setSelectedRadioSub1Page([]);
    setSelectedRadioSub2Page([]);
  };

  window.addEventListener("beforeunload", function (event) {
    // Clear local storage
    localStorage.removeItem("timerDuration");
    localStorage.removeItem("formFilled");
  });

  const handleRadioButtonChangeSecondary = (data, index, ind, value) => {
    const ans =
      sub1todo?.length > 0
        ? sub1todo?.map((item) => {
          if (item?.userans) {
            item.userans = [];
            return item;
          }
          return item;
        })
        : [];
    setSub1todo(ans);
    // setSub1todo((prevState) => {
    //   const updatedValues = [...prevState.slice(0, ind + 1)];
    //   return updatedValues;
    // });
    setSub2Todo([]);
    setSub3Todo([]);
    setSub4Todo([]);
    if (
      data?.type === "Radio" ||
      data?.type === "Yes/No" ||
      data?.type === "Correct/In Correct"
    ) {
      let subindex;
      const updatedArray = interviewGetForm?.map((item, indexVal) => {
        if (index === indexVal) {
          if (item?.secondarytodo?.length > 0) {
            const updatedSecondaryTodo = item?.secondarytodo?.map(
              (subItem, index) => {
                if (subItem?.question === data?.question) {
                  subindex = index;
                  return {
                    ...subItem,
                    userans: value,
                    questionattended: true,
                  };
                }
                if (
                  [
                    "Sub Question 1",
                    "Sub Question 2",
                    "Sub Question 3",
                    "Sub Question 4",
                  ]?.includes(subItem?.extraquestion)
                ) {
                  return {
                    ...subItem,
                    userans: "",
                    questionattended: false,
                  };
                }
                return subItem;
              }
            );

            return {
              ...item,
              secondarytodo: updatedSecondaryTodo,
            };
          }
        }

        return item;
      });

      let newFind = updatedArray.find((item, inds) => inds === index);
      let eligibileorNotData = newFind.secondarytodo[
        subindex
      ]?.optionslist.find((item) => item.answer === value);
      eligibileorNotData?.status === "Eligible" ||
        eligibileorNotData?.status === "Informative" ||
        ans?.status === "Manual Decision"
        ? setOnGetStatus(true)
        : setOnGetStatus(false);

      setInterviewGetForm(updatedArray);
      const answerSecondary = interviewGetForm[index]?.secondarytodo?.filter(
        (item) =>
          item?.options === value && item?.extraquestion === "Sub Question 1"
      );
      answerSecondary?.length > 0 ? setNextButton(false) : setNextButton(true);
      // setSub1todo(answerSecondary?.length > 0 ? answerSecondary : []);
      setSub1todo((prevSub1todo) => {
        const uniqueIds = new Set(prevSub1todo.map((item) => item._id));
        const newItems = answerSecondary.filter(
          (item) => !uniqueIds.has(item._id)
        );
        const newValue = [...prevSub1todo, ...newItems];
        return newValue;
      });
    } else if (data?.type === "TextBox") {
      let subindex;
      const updatedArray = interviewGetForm?.map((item, indexVal) => {
        if (index === indexVal) {
          if (item?.secondarytodo?.length > 0) {
            const updatedSecondaryTodo = item?.secondarytodo?.map(
              (subItem, index) => {
                if (subItem?.question === data?.question) {
                  subindex = index;
                  return {
                    ...subItem,
                    userans: value,
                    questionattended: true,
                  };
                }
                if (
                  [
                    "Sub Question 1",
                    "Sub Question 2",
                    "Sub Question 3",
                    "Sub Question 4",
                  ]?.includes(subItem?.extraquestion)
                ) {
                  return {
                    ...subItem,
                    userans: "",
                    questionattended: false,
                  };
                }
                return subItem;
              }
            );

            return {
              ...item,
              secondarytodo: updatedSecondaryTodo,
            };
          }
        }

        return item;
      });

      let newFind = updatedArray.find((item, inds) => inds === index);
      let eligibileorNotData = newFind.secondarytodo[subindex].optionslist[0];
      let eligibileorNot =
        eligibileorNotData?.answer === "" ||
          eligibileorNotData?.answer === "NOANSWER"
          ? true
          : false;
      eligibileorNot
        ? setOnGetStatus(true)
        : eligibileorNotData?.answer.toLowerCase() === value.toLowerCase()
          ? setOnGetStatus(true)
          : setOnGetStatus(false);
      setInterviewGetForm(updatedArray);
      const answerSecondary = interviewGetForm[index]?.secondarytodo?.filter(
        (item) =>
          (item?.options.toLowerCase() === value.toLowerCase() ||
            item?.options === "NOANSWER") &&
          item?.extraquestion === "Sub Question 1"
      );
      // setSub1todo(answerSecondary?.length > 0 ? answerSecondary : []);
      setSub1todo((prevSub1todo) => {
        const uniqueIds = new Set(prevSub1todo.map((item) => item._id));
        const newItems = answerSecondary.filter(
          (item) => !uniqueIds.has(item._id)
        );
        const newValue = [...prevSub1todo, ...newItems];
        return newValue;
      });

      if (value !== "") {
        answerSecondary?.length > 0
          ? setNextButton(false)
          : setNextButton(true);
      } else {
        setNextButton(false);
      }
    } else if (data?.type === "Text-Alpha") {
      let subindex;
      const updatedArray = interviewGetForm?.map((item, indexVal) => {
        if (index === indexVal) {
          if (item?.secondarytodo?.length > 0) {
            const updatedSecondaryTodo = item?.secondarytodo?.map(
              (subItem, index) => {
                if (subItem?.question === data?.question) {
                  subindex = index;
                  return {
                    ...subItem,
                    userans: value,
                    questionattended: true,
                  };
                }
                if (
                  [
                    "Sub Question 1",
                    "Sub Question 2",
                    "Sub Question 3",
                    "Sub Question 4",
                  ]?.includes(subItem?.extraquestion)
                ) {
                  return {
                    ...subItem,
                    userans: "",
                    questionattended: false,
                  };
                }
                return subItem;
              }
            );

            return {
              ...item,
              secondarytodo: updatedSecondaryTodo,
            };
          }
        }

        return item;
      });

      let newFind = updatedArray.find((item, inds) => inds === index);
      let eligibileorNotData = newFind.secondarytodo[subindex].optionslist[0];
      let eligibileorNot =
        eligibileorNotData?.answer === "" ||
          eligibileorNotData?.answer === "NOANSWER"
          ? true
          : false;

      eligibileorNot
        ? setOnGetStatus(true)
        : eligibileorNotData?.answer.toLowerCase() === value.toLowerCase()
          ? setOnGetStatus(true)
          : setOnGetStatus(false);

      setInterviewGetForm(updatedArray);
      const answerSecondary = interviewGetForm[index]?.secondarytodo?.filter(
        (item) =>
          (item?.options.toLowerCase() === value.toLowerCase() ||
            item?.options === "NOANSWER") &&
          item?.extraquestion === "Sub Question 1"
      );
      // setSub1todo(answerSecondary?.length > 0 ? answerSecondary : []);
      setSub1todo((prevSub1todo) => {
        const uniqueIds = new Set(prevSub1todo.map((item) => item._id));
        const newItems = answerSecondary.filter(
          (item) => !uniqueIds.has(item._id)
        );
        const newValue = [...prevSub1todo, ...newItems];
        return newValue;
      });

      if (value !== "") {
        answerSecondary?.length > 0
          ? setNextButton(false)
          : setNextButton(true);
      } else {
        setNextButton(false);
      }
    } else if (data?.type === "Text-Numeric") {
      let subindex;
      const updatedArray = interviewGetForm?.map((item, indexVal) => {
        if (index === indexVal) {
          if (item?.secondarytodo?.length > 0) {
            const updatedSecondaryTodo = item?.secondarytodo?.map(
              (subItem, index) => {
                if (subItem?.question === data?.question) {
                  subindex = index;
                  return {
                    ...subItem,
                    userans: value,
                    questionattended: true,
                  };
                }
                if (
                  [
                    "Sub Question 1",
                    "Sub Question 2",
                    "Sub Question 3",
                    "Sub Question 4",
                  ]?.includes(subItem?.extraquestion)
                ) {
                  return {
                    ...subItem,
                    userans: "",
                    questionattended: false,
                  };
                }
                return subItem;
              }
            );

            return {
              ...item,
              secondarytodo: updatedSecondaryTodo,
            };
          }
        }

        return item;
      });

      let newFind = updatedArray.find((item, inds) => inds === index);
      let eligibileorNotData = newFind.secondarytodo[subindex].optionslist[0];
      let eligibileorNot =
        eligibileorNotData?.answer === "" ||
          eligibileorNotData?.answer === "NOANSWER"
          ? true
          : false;

      let isValid = false;
      let validations = eligibileorNotData?.validation;
      let validationsOptions = eligibileorNotData?.answer;

      if (!eligibileorNot && validations === "Less Than") {
        if (Number(value) < Number(validationsOptions)) {
          isValid = true;
        }
      } else if (!eligibileorNot && validations === "Less Than or Equal to") {
        if (Number(value) <= Number(validationsOptions)) {
          isValid = true;
        }
      } else if (!eligibileorNot && validations === "Greater Than") {
        if (Number(value) > Number(validationsOptions)) {
          isValid = true;
        }
      } else if (
        !eligibileorNot &&
        validations === "Greater Than or Equal to"
      ) {
        if (Number(value) >= Number(validationsOptions)) {
          isValid = true;
        }
      } else if (!eligibileorNot && validations === "Equal to") {
        if (Number(value) === Number(validationsOptions)) {
          isValid = true;
        }
      } else if (!eligibileorNot && validations === "Between") {
        if (
          Number(value) >= Number(eligibileorNotData.betweenfrom) &&
          Number(value) <= Number(eligibileorNotData.betweento)
        ) {
          isValid = true;
        }
      }

      eligibileorNot ? setOnGetStatus(true) : setOnGetStatus(isValid);

      setInterviewGetForm(updatedArray);
      const answerSecondary =
        !eligibileorNot && isValid
          ? interviewGetForm[index]?.secondarytodo?.filter(
            (item) =>
              (item?.options == validationsOptions ||
                item?.options === "NOANSWER") &&
              item?.extraquestion === "Sub Question 1"
          )
          : [];
      // setSub1todo(answerSecondary?.length > 0 ? answerSecondary : []);
      setSub1todo((prevSub1todo) => {
        const uniqueIds = new Set(prevSub1todo.map((item) => item._id));
        const newItems = answerSecondary.filter(
          (item) => !uniqueIds.has(item._id)
        );
        const newValue = [...prevSub1todo, ...newItems];
        return newValue;
      });
      if (value !== "") {
        answerSecondary?.length > 0
          ? setNextButton(false)
          : setNextButton(true);
      } else {
        setNextButton(false);
      }
    } else if (data?.type === "Date") {
      let subindex;
      const updatedArray = interviewGetForm?.map((item, indexVal) => {
        if (index === indexVal) {
          if (item?.secondarytodo?.length > 0) {
            const updatedSecondaryTodo = item?.secondarytodo?.map(
              (subItem, index) => {
                if (subItem?.question === data?.question) {
                  subindex = index;
                  return {
                    ...subItem,
                    userans: value,
                    questionattended: true,
                  };
                }
                if (
                  [
                    "Sub Question 1",
                    "Sub Question 2",
                    "Sub Question 3",
                    "Sub Question 4",
                  ]?.includes(subItem?.extraquestion)
                ) {
                  return {
                    ...subItem,
                    userans: "",
                    questionattended: false,
                  };
                }
                return subItem;
              }
            );

            return {
              ...item,
              secondarytodo: updatedSecondaryTodo,
            };
          }
        }

        return item;
      });
      let newFind = updatedArray.find((item, inds) => inds === index);
      let eligibileorNotData = newFind.secondarytodo[subindex].optionslist[0];
      let eligibileorNot =
        eligibileorNotData?.answer === "" ||
          eligibileorNotData?.answer === "NODATE"
          ? true
          : false;

      eligibileorNot
        ? setOnGetStatus(true)
        : eligibileorNotData?.answer === value
          ? setOnGetStatus(true)
          : setOnGetStatus(false);

      setInterviewGetForm(updatedArray);
      const answerSecondary = interviewGetForm[index]?.secondarytodo?.filter(
        (item) =>
          (moment(item?.options, "DD-MM-YYYY").format("YYYY-MM-DD") === value ||
            item?.options === "NODATE") &&
          item?.extraquestion === "Sub Question 1"
      );
      // setSub1todo(answerSecondary?.length > 0 ? answerSecondary : []);
      setSub1todo((prevSub1todo) => {
        const uniqueIds = new Set(prevSub1todo.map((item) => item._id));
        const newItems = answerSecondary.filter(
          (item) => !uniqueIds.has(item._id)
        );
        const newValue = [...prevSub1todo, ...newItems];
        return newValue;
      });
      if (value !== "") {
        answerSecondary?.length > 0
          ? setNextButton(false)
          : setNextButton(true);
      } else {
        setNextButton(false);
      }
    } else if (data?.type === "Date Range") {
      let subindex;
      const updatedArray = interviewGetForm?.map((item, indexVal) => {
        if (index === indexVal) {
          if (item?.secondarytodo?.length > 0) {
            const updatedSecondaryTodo = item?.secondarytodo?.map(
              (subItem, index) => {
                if (subItem?.question === data?.question) {
                  subindex = index;
                  return {
                    ...subItem,
                    userans: value,
                    questionattended: true,
                  };
                }
                if (
                  [
                    "Sub Question 1",
                    "Sub Question 2",
                    "Sub Question 3",
                    "Sub Question 4",
                  ]?.includes(subItem?.extraquestion)
                ) {
                  return {
                    ...subItem,
                    userans: "",
                    questionattended: false,
                  };
                }
                return subItem;
              }
            );

            return {
              ...item,
              secondarytodo: updatedSecondaryTodo,
            };
          }
        }

        return item;
      });
      let newFind = updatedArray.find((item, inds) => inds === index);
      let fromdate = newFind.secondarytodo[subindex].optionslist[0].answer;
      let todate = newFind.secondarytodo[subindex].optionslist[1].answer;

      const isValid =
        value === fromdate ||
        value === todate ||
        (value >= fromdate && value <= todate);

      const answerSecondary = isValid
        ? interviewGetForm[index]?.secondarytodo?.filter((obj) => {
          if (
            obj.options.includes(" - ") &&
            obj?.extraquestion === "Sub Question 1"
          ) {
            const [fromDateStr, toDateStr] = obj.options.split(" - ");

            const fromDate = new Date(
              moment(fromDateStr, "DD-MM-YYYY").format("YYYY-MM-DD")
            );
            const toDate = new Date(
              moment(toDateStr, "DD-MM-YYYY").format("YYYY-MM-DD")
            );
            const userDate = new Date(value);

            return userDate >= fromDate && userDate <= toDate;
          } else {
            return false;
          }
        })
        : [];

      isValid ? setOnGetStatus(true) : setOnGetStatus(false);

      setInterviewGetForm(updatedArray);

      // setSub1todo(answerSecondary?.length > 0 ? answerSecondary : []);
      setSub1todo((prevSub1todo) => {
        const uniqueIds = new Set(prevSub1todo.map((item) => item._id));
        const newItems = answerSecondary.filter(
          (item) => !uniqueIds.has(item._id)
        );
        const newValue = [...prevSub1todo, ...newItems];
        return newValue;
      });
      if (value !== "") {
        answerSecondary?.length > 0
          ? setNextButton(false)
          : setNextButton(true);
      } else {
        setNextButton(false);
      }
    } else if (data?.type === "MultipleChoice") {
      setSelectedSub1PageName([]);
      let subindex;
      // const answer = value?.map((options) => options?.value);

      const updatedArray = interviewGetForm?.map((item, indexVal) => {
        if (index === indexVal) {
          if (item?.secondarytodo?.length > 0) {
            const updatedSecondaryTodo = item?.secondarytodo?.map(
              (subItem, index) => {
                if (subItem?.question === data?.question) {
                  subindex = index;

                  const updatedUserAnsSecondary = value.target.checked
                    ? [...(subItem?.userans || []), value.target.value]
                    : subItem?.userans.filter(
                      (ans) => ans !== value.target.value
                    );

                  let ans = subItem?.optionslist?.filter((data) =>
                    updatedUserAnsSecondary.includes(data?.answer)
                  );

                  let checkAns = ans?.filter(
                    (data) => data?.status !== "Not-Eligible"
                  );
                  let checkFail = ans?.filter(
                    (data) => data?.status === "Not-Eligible"
                  );
                  setOnGetStatus(
                    checkAns?.length > checkFail?.length ||
                    checkAns?.length === checkFail?.length
                  );

                  const answerSecondary = item?.secondarytodo?.filter(
                    (secItem) =>
                      updatedUserAnsSecondary.includes(secItem?.options) &&
                      secItem?.extraquestion === "Sub Question 1"
                  );

                  setSub1todo((prevSub1todo) => {
                    const uniqueIds = new Set(
                      prevSub1todo?.map((item) => item._id)
                    );
                    const newItems = answerSecondary.filter(
                      (secItem) => !uniqueIds.has(secItem._id)
                    );
                    const newValue = [...prevSub1todo, ...newItems];
                    return newValue;
                  });

                  if (updatedUserAnsSecondary?.length !== 0) {
                    answerSecondary?.length > 0
                      ? setNextButton(false)
                      : setNextButton(true);
                  } else {
                    setNextButton(false);
                  }

                  return {
                    ...subItem,
                    userans: updatedUserAnsSecondary,
                    questionattended: true,
                  };
                }
                if (
                  [
                    "Sub Question 1",
                    "Sub Question 2",
                    "Sub Question 3",
                    "Sub Question 4",
                  ]?.includes(subItem?.extraquestion)
                ) {
                  return {
                    ...subItem,
                    userans: [],
                    questionattended: false,
                  };
                }
                return subItem;
              }
            );

            return {
              ...item,
              secondarytodo: updatedSecondaryTodo,
            };
          }
        }

        return item;
      });

      setInterviewGetForm(updatedArray);
    }

    setSelectedRadioSub1Page([]);
    setSelectedRadioSub2Page([]);
    setSelectedSub1PageName([]);
  };

  let autoSubquestion = "Sub Question 1";
  const handleRadioButtonChangeSub1 = (data, index, ind, value, whatques) => {
    // setSub1todo((prevState) => {
    //   const updatedValues = [...prevState.slice(0, ind + 1)];
    //   return updatedValues;
    // });
    let number = parseInt(whatques.match(/\d+/)[0]);
    let upcomingquestions = [];
    for (let i = number; i <= 100; i++) {
      upcomingquestions.push(`Sub Question ${i}`);
    }
    // const ans =
    //   interviewGetForm?.length > 0
    //     ? sub2Todo?.map((item) => {
    //         if (item?.userans) {
    //           item.userans = "";
    //           return item;
    //         }
    //         return item;
    //       })
    //     : [];

    // setSub2Todo(ans);
    // setSub3Todo([]);
    // setSub4Todo([]);
    if (
      data?.type === "Radio" ||
      data?.type === "Yes/No" ||
      data?.type === "Correct/In Correct"
    ) {
      setSelectedRadioSub1Page((prevState) => {
        const updatedValues = [...prevState.slice(0, ind + 1)];
        updatedValues[ind] = value;
        return updatedValues;
      });
      let subindex;
      const updatedArray = interviewGetForm?.map((item, indexVal) => {
        if (index === indexVal) {
          if (item?.secondarytodo?.length > 0) {
            const updatedSecondaryTodo = item?.secondarytodo.map(
              (subItem, index) => {
                if (subItem?.question === data?.question) {
                  subindex = index;
                  return {
                    ...subItem,
                    userans: value,
                    questionattended: true,
                  };
                }
                if (upcomingquestions?.includes(subItem?.extraquestion)) {
                  return {
                    ...subItem,
                    userans: "",
                    questionattended: false,
                  };
                }
                return subItem;
              }
            );

            return {
              ...item,
              secondarytodo: updatedSecondaryTodo,
            };
          }
        }

        return item;
      });

      let newFind = updatedArray.find((item, inds) => inds === index);
      let eligibileorNotData = newFind.secondarytodo[subindex].optionslist.find(
        (item) => item.answer === value
      );
      eligibileorNotData?.status === "Eligible" ||
        eligibileorNotData?.status === "Informative" ||
        eligibileorNotData?.status === "Manual Decision"
        ? setOnGetStatus(true)
        : setOnGetStatus(false);

      setInterviewGetForm(updatedArray);
      const answerSecondary = interviewGetForm[index]?.secondarytodo?.filter(
        (item) =>
          item?.options === value && item.extraquestion === String(whatques)
      );
      answerSecondary?.length > 0 ? setNextButton(false) : setNextButton(true);
      setSub1todo((prevSub1todo) => {
        const uniqueIds = new Set(prevSub1todo.map((item) => item._id));
        const newItems = answerSecondary.filter(
          (item) => !uniqueIds.has(item._id)
        );
        const newValue = [...prevSub1todo, ...newItems];
        return newValue;
      });
    } else if (data?.type === "TextBox") {
      setSelectedRadioSub1Page((prevState) => {
        const updatedValues = [...prevState.slice(0, ind + 1)];
        updatedValues[ind] = value;
        return updatedValues;
      });
      let subindex;
      const updatedArray = interviewGetForm?.map((item, indexVal) => {
        if (index === indexVal) {
          if (item?.secondarytodo?.length > 0) {
            const updatedSecondaryTodo = item?.secondarytodo?.map(
              (subItem, index) => {
                if (subItem?.question === data?.question) {
                  subindex = index;
                  return {
                    ...subItem,
                    userans: value,
                    questionattended: true,
                  };
                }
                if (upcomingquestions?.includes(subItem?.extraquestion)) {
                  return {
                    ...subItem,
                    userans: "",
                    questionattended: false,
                  };
                }
                return subItem;
              }
            );

            return {
              ...item,
              secondarytodo: updatedSecondaryTodo,
            };
          }
        }

        return item;
      });

      let newFind = updatedArray.find((item, inds) => inds === index);
      let eligibileorNotData = newFind.secondarytodo[subindex].optionslist[0];
      let eligibileorNot =
        eligibileorNotData?.answer === "" ||
          eligibileorNotData?.answer === "NOANSWER"
          ? true
          : false;

      eligibileorNot
        ? setOnGetStatus(true)
        : eligibileorNotData?.answer.toLowerCase() === value.toLowerCase()
          ? setOnGetStatus(true)
          : setOnGetStatus(false);
      setInterviewGetForm(updatedArray);
      const answerSecondary = interviewGetForm[index]?.secondarytodo?.filter(
        (item) =>
          (item?.options.toLowerCase() === value.toLowerCase() ||
            item?.options === "NOANSWER") &&
          item?.extraquestion === String(whatques)
      );
      setSub1todo((prevSub1todo) => {
        const uniqueIds = new Set(prevSub1todo.map((item) => item._id));
        const newItems = answerSecondary.filter(
          (item) => !uniqueIds.has(item._id)
        );
        const newValue = [...prevSub1todo, ...newItems];
        return newValue;
      });

      if (value !== "") {
        answerSecondary?.length > 0
          ? setNextButton(false)
          : setNextButton(true);
      } else {
        setNextButton(false);
      }
    } else if (data?.type === "Text-Alpha") {
      setSelectedRadioSub1Page((prevState) => {
        const updatedValues = [...prevState.slice(0, ind + 1)];
        updatedValues[ind] = value;
        return updatedValues;
      });
      let subindex;
      const updatedArray = interviewGetForm?.map((item, indexVal) => {
        if (index === indexVal) {
          if (item?.secondarytodo?.length > 0) {
            const updatedSecondaryTodo = item?.secondarytodo?.map(
              (subItem, index) => {
                if (subItem?.question === data?.question) {
                  subindex = index;
                  return {
                    ...subItem,
                    userans: value,
                    questionattended: true,
                  };
                }
                if (upcomingquestions?.includes(subItem?.extraquestion)) {
                  return {
                    ...subItem,
                    userans: "",
                    questionattended: false,
                  };
                }
                return subItem;
              }
            );

            return {
              ...item,
              secondarytodo: updatedSecondaryTodo,
            };
          }
        }

        return item;
      });

      let newFind = updatedArray.find((item, inds) => inds === index);
      let eligibileorNotData = newFind.secondarytodo[subindex].optionslist[0];
      let eligibileorNot =
        eligibileorNotData?.answer === "" ||
          eligibileorNotData?.answer === "NOANSWER"
          ? true
          : false;

      eligibileorNot
        ? setOnGetStatus(true)
        : eligibileorNotData?.answer.toLowerCase() === value.toLowerCase()
          ? setOnGetStatus(true)
          : setOnGetStatus(false);

      setInterviewGetForm(updatedArray);
      const answerSecondary = interviewGetForm[index]?.secondarytodo?.filter(
        (item) =>
          (item?.options.toLowerCase() === value.toLowerCase() ||
            item?.options === "NOANSWER") &&
          item?.extraquestion === String(whatques)
      );
      setSub1todo((prevSub1todo) => {
        const uniqueIds = new Set(prevSub1todo.map((item) => item._id));
        const newItems = answerSecondary.filter(
          (item) => !uniqueIds.has(item._id)
        );
        const newValue = [...prevSub1todo, ...newItems];
        return newValue;
      });
      if (value !== "") {
        answerSecondary?.length > 0
          ? setNextButton(false)
          : setNextButton(true);
      } else {
        setNextButton(false);
      }
    } else if (data?.type === "Text-Numeric") {
      let subindex;
      const updatedArray = interviewGetForm?.map((item, indexVal) => {
        if (index === indexVal) {
          if (item?.secondarytodo?.length > 0) {
            const updatedSecondaryTodo = item?.secondarytodo?.map(
              (subItem, index) => {
                if (subItem?.question === data?.question) {
                  subindex = index;
                  return {
                    ...subItem,
                    userans: value,
                    questionattended: true,
                  };
                }
                if (upcomingquestions?.includes(subItem?.extraquestion)) {
                  return {
                    ...subItem,
                    userans: "",
                    questionattended: false,
                  };
                }
                return subItem;
              }
            );

            return {
              ...item,
              secondarytodo: updatedSecondaryTodo,
            };
          }
        }

        return item;
      });

      let newFind = updatedArray.find((item, inds) => inds === index);
      let eligibileorNotData = newFind.secondarytodo[subindex].optionslist[0];
      let eligibileorNot =
        eligibileorNotData?.answer === "" ||
          eligibileorNotData?.answer === "NOANSWER"
          ? true
          : false;

      let isValid = false;
      let validations = eligibileorNotData?.validation;
      let validationsOptions = eligibileorNotData?.answer;

      if (!eligibileorNot && validations === "Less Than") {
        if (Number(value) < Number(validationsOptions)) {
          isValid = true;
        }
      } else if (!eligibileorNot && validations === "Less Than or Equal to") {
        if (Number(value) <= Number(validationsOptions)) {
          isValid = true;
        }
      } else if (!eligibileorNot && validations === "Greater Than") {
        if (Number(value) > Number(validationsOptions)) {
          isValid = true;
        }
      } else if (
        !eligibileorNot &&
        validations === "Greater Than or Equal to"
      ) {
        if (Number(value) >= Number(validationsOptions)) {
          isValid = true;
        }
      } else if (!eligibileorNot && validations === "Equal to") {
        if (Number(value) === Number(validationsOptions)) {
          isValid = true;
        }
      } else if (!eligibileorNot && validations === "Between") {
        if (
          Number(value) >= Number(eligibileorNotData.betweenfrom) &&
          Number(value) <= Number(eligibileorNotData.betweento)
        ) {
          isValid = true;
        }
      }

      eligibileorNot ? setOnGetStatus(true) : setOnGetStatus(isValid);

      setInterviewGetForm(updatedArray);
      const answerSecondary =
        !eligibileorNot && isValid
          ? interviewGetForm[index]?.secondarytodo?.filter(
            (item) =>
              (item?.options == validationsOptions ||
                item?.options === "NOANSWER") &&
              item?.extraquestion === String(whatques)
          )
          : [];
      setSub1todo((prevSub1todo) => {
        const uniqueIds = new Set(prevSub1todo.map((item) => item._id));
        const newItems = answerSecondary.filter(
          (item) => !uniqueIds.has(item._id)
        );
        const newValue = [...prevSub1todo, ...newItems];
        return newValue;
      });
      if (value !== "") {
        answerSecondary?.length > 0
          ? setNextButton(false)
          : setNextButton(true);
      } else {
        setNextButton(false);
      }
    } else if (data?.type === "Date") {
      setSelectedRadioSub1Page((prevState) => {
        const updatedValues = [...prevState.slice(0, ind + 1)];
        updatedValues[ind] = value;
        return updatedValues;
      });
      let subindex;
      const updatedArray = interviewGetForm?.map((item, indexVal) => {
        if (index === indexVal) {
          if (item?.secondarytodo?.length > 0) {
            const updatedSecondaryTodo = item?.secondarytodo?.map(
              (subItem, index) => {
                if (subItem?.question === data?.question) {
                  subindex = index;
                  return {
                    ...subItem,
                    userans: value,
                    questionattended: true,
                  };
                }
                if (upcomingquestions?.includes(subItem?.extraquestion)) {
                  return {
                    ...subItem,
                    userans: "",
                    questionattended: false,
                  };
                }
                return subItem;
              }
            );

            return {
              ...item,
              secondarytodo: updatedSecondaryTodo,
            };
          }
        }

        return item;
      });
      let newFind = updatedArray.find((item, inds) => inds === index);
      let eligibileorNotData = newFind.secondarytodo[subindex].optionslist[0];
      let eligibileorNot =
        eligibileorNotData?.answer === "" ||
          eligibileorNotData?.answer === "NODATE"
          ? true
          : false;

      eligibileorNot
        ? setOnGetStatus(true)
        : eligibileorNotData?.answer === value
          ? setOnGetStatus(true)
          : setOnGetStatus(false);

      setInterviewGetForm(updatedArray);
      const answerSecondary = interviewGetForm[index]?.secondarytodo?.filter(
        (item) =>
          (moment(item?.options, "DD-MM-YYYY").format("YYYY-MM-DD") === value ||
            item?.options === "NODATE") &&
          item?.extraquestion === String(whatques)
      );
      setSub1todo((prevSub1todo) => {
        const uniqueIds = new Set(prevSub1todo.map((item) => item._id));
        const newItems = answerSecondary.filter(
          (item) => !uniqueIds.has(item._id)
        );
        const newValue = [...prevSub1todo, ...newItems];
        return newValue;
      });
      if (value !== "") {
        answerSecondary?.length > 0
          ? setNextButton(false)
          : setNextButton(true);
      } else {
        setNextButton(false);
      }
    } else if (data?.type === "Date Range") {
      setSelectedRadioSub1Page((prevState) => {
        const updatedValues = [...prevState.slice(0, ind + 1)];
        updatedValues[ind] = value;
        return updatedValues;
      });
      let subindex;
      const updatedArray = interviewGetForm?.map((item, indexVal) => {
        if (index === indexVal) {
          if (item?.secondarytodo?.length > 0) {
            const updatedSecondaryTodo = item?.secondarytodo?.map(
              (subItem, index) => {
                if (subItem?.question === data?.question) {
                  subindex = index;
                  return {
                    ...subItem,
                    userans: value,
                    questionattended: true,
                  };
                }
                if (upcomingquestions?.includes(subItem?.extraquestion)) {
                  return {
                    ...subItem,
                    userans: "",
                    questionattended: false,
                  };
                }
                return subItem;
              }
            );

            return {
              ...item,
              secondarytodo: updatedSecondaryTodo,
            };
          }
        }

        return item;
      });
      let newFind = updatedArray.find((item, inds) => inds === index);
      let fromdate = newFind.secondarytodo[subindex].optionslist[0].answer;
      let todate = newFind.secondarytodo[subindex].optionslist[1].answer;

      const isValid =
        value === fromdate ||
        value === todate ||
        (value >= fromdate && value <= todate);

      const answerSecondary = isValid
        ? interviewGetForm[index]?.secondarytodo?.filter((obj) => {
          if (
            obj.options.includes(" - ") &&
            obj?.extraquestion === String(whatques)
          ) {
            const [fromDateStr, toDateStr] = obj?.options.split(" - ");
            const fromDate = new Date(
              moment(fromDateStr, "DD-MM-YYYY").format("YYYY-MM-DD")
            );
            const toDate = new Date(
              moment(toDateStr, "DD-MM-YYYY").format("YYYY-MM-DD")
            );
            const userDate = new Date(value);

            return userDate >= fromDate && userDate <= toDate;
          } else {
            return false;
          }
        })
        : [];

      isValid ? setOnGetStatus(true) : setOnGetStatus(false);

      setInterviewGetForm(updatedArray);
      setSub1todo((prevSub1todo) => {
        const uniqueIds = new Set(prevSub1todo.map((item) => item._id));
        const newItems = answerSecondary.filter(
          (item) => !uniqueIds.has(item._id)
        );
        const newValue = [...prevSub1todo, ...newItems];
        return newValue;
      });
      if (value !== "") {
        answerSecondary?.length > 0
          ? setNextButton(false)
          : setNextButton(true);
      } else {
        setNextButton(false);
      }
    } else if (data?.type === "MultipleChoice") {
      // setSelectedSub1PageName((prevState) => {
      //   const updatedValues = [...prevState.slice(0, ind + 1)];
      //   updatedValues[ind] = value.target.value;
      //   return updatedValues;
      // });

      let subindex;
      const updatedArray = interviewGetForm?.map((item, indexVal) => {
        if (index === indexVal) {
          if (item?.secondarytodo?.length > 0) {
            const updatedSecondaryTodo = item?.secondarytodo?.map(
              (subItem, indexss) => {
                if (subItem?.question === data?.question) {
                  subindex = indexss;

                  const updatedUserAnsSecondary = value.target.checked
                    ? [...(subItem?.userans || []), value.target.value]
                    : subItem?.userans.filter(
                      (ans) => ans !== value.target.value
                    );
                  let ans = interviewGetForm[index]?.secondarytodo[
                    subindex
                  ].optionslist?.filter((data) =>
                    updatedUserAnsSecondary?.includes(data?.answer)
                  );

                  let checkAns = ans?.filter(
                    (data) => data?.status !== "Not-Eligible"
                  );
                  let checkFail = ans?.filter(
                    (data) => data?.status === "Not-Eligible"
                  );
                  setOnGetStatus(
                    checkAns?.length > checkFail?.length ||
                    checkAns?.length === checkFail?.length
                  );

                  const answerSecondary = interviewGetForm[
                    index
                  ]?.secondarytodo?.filter(
                    (item) =>
                      updatedUserAnsSecondary.includes(item?.options) &&
                      item?.extraquestion === String(whatques)
                  );

                  setSub1todo((prevSub1todo) => {
                    const uniqueIds = new Set(
                      prevSub1todo.map((item) => item._id)
                    );
                    const newItems = answerSecondary.filter(
                      (item) => !uniqueIds.has(item._id)
                    );
                    const newValue = [...prevSub1todo, ...newItems];
                    return newValue;
                  });

                  if (updatedUserAnsSecondary?.length !== 0) {
                    answerSecondary?.length > 0
                      ? setNextButton(false)
                      : setNextButton(true);
                  } else {
                    setNextButton(false);
                  }

                  return {
                    ...subItem,
                    userans: updatedUserAnsSecondary,
                    questionattended: true,
                  };
                }
                if (upcomingquestions?.includes(subItem?.extraquestion)) {
                  return {
                    ...subItem,
                    userans: [],
                    questionattended: false,
                  };
                }
                return subItem;
              }
            );

            return {
              ...item,
              secondarytodo: updatedSecondaryTodo,
            };
          }
        }

        return item;
      });

      setInterviewGetForm(updatedArray);
    }

    setSelectedRadioSub2Page([]);
  };

  const durationParts = duration.split(":");
  const hours = durationParts[0];
  const minutes = durationParts[1];
  const seconds = durationParts[2];

  const TimerComponent = () => {
    return (
      <Grid item xs={12} md={4}>
        <Grid container spacing={0} justifyContent="flex-end">
          <Grid item xs={4}>
            <Box
              style={{
                border: "2px solid lightgray",
                backgroundColor: "#ecf0f1",
                padding: "20%",
                borderRadius: "5px",
                fontSize: "2vw",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {" "}
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              >
                {hours}
              </div>{" "}
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              style={{
                border: "2px solid lightgray",
                backgroundColor: "#ecf0f1",
                padding: "20%",
                borderRadius: "5px",
                fontSize: "2vw",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {" "}
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              >
                {minutes}
              </div>{" "}
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              style={{
                border: "2px solid lightgray",
                backgroundColor: "#ecf0f1",
                padding: "20%",
                borderRadius: "5px",
                fontSize: "2vw",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {" "}
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              >
                {seconds}
              </div>{" "}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const box1 = {
    display: "flex",
    alignItems: "center",
    border: "2px solid lightgray",
    borderRadius: "5px",
    padding: "3%",
    width: "100%",
    marginLeft: "-15px",
    backgroundColor: "#ecf0f1",
    fontSize: "1.3rem",
    fontWeight: "bold",
    fontFamily: "'Noto Sans Tirhuta', sans-serif",
  };

  const paper1 = {
    border: "2px solid lightgray",
    boxShadow: "0px 0px 20px #00000029",
    padding: "5px",
    borderRadius: "5px",
    width: "100%",
    fontWeight: "bold",
  };

  const typography1 = {
    fontSize: "18px",
    fontWeight: "600",
    fontFamily: "Arial, Helvetica, sans-serif",
  };

  const list1 = {
    border: "2px solid lightgray",
    padding: "15px",
    borderRadius: "5px",
    width: "100%",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const list2 = {
    border: "2px solid lightgray",
    padding: "5px",
    borderRadius: "5px",
    width: "100%",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const list3 = {
    border: "2px solid lightgray",
    padding: "15px",
    borderRadius: "5px",
    width: "100%",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const textboxstyle = {
    width: "100%",
    maxWidth: "500px",
    boxSizing: "border-box",
  };
  const languageOptions = [
    { value: "English", label: "English" },
    { value: "தமிழ்", label: "தமிழ்" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState({ value: 'English', label: 'English' }); // Default to English

  const handleChange = (selectedOption) => {
    setSelectedLanguage(selectedOption);

  };
  return (
    <div style={{ backgroundColor: "white" }}>
      <LoadingBackdrop open={isLoading} />
      <div className="interviewFormContainer">
        <Headtitle title={"INTERVIEW FORM"} />
        <div style={{ position: "relative", backgroundColor: "#000" }}>
          {/* Header Section */}
          <div
            style={{
              padding: "10px 20px",
              position: "absolute",
              top: 0,
              left: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              backgroundColor: "black",
              zIndex: 1,
            }}
          >
            {/* Logo and Title */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={hilifelogo}
                alt="Logo"
                style={{ height: "50px", width: "auto", marginRight: "10px" }}
              />
              <h2 style={{ color: "white", fontSize: "1.5rem", margin: 0 }} onClick={console.log(selectedLanguage)}>HIHRMS</h2>
            </div>

            {/* Language Selector */}
            {/* <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span><LanguageIcon sx={{ color: "white" }} /></span>
              <Select
                options={languageOptions}
                value={selectedLanguage}
                onChange={handleChange}
                placeholder="Choose Language"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: "white",
                    color: "black",
                    minWidth: "150px",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    color: "black",
                  }),
                }}
              />
            </div> */}
          </div>

          {/* Main Content Placeholder */}
          {/* <div style={{ paddingTop: "80px" }}> */}
          {/* Your main content goes here */}
          {/* </div> */}
        </div>
        <br />
        <>
          <div
            style={{
              width: "100%",
              padding: "5%",
            }}
            className="interviewFormOuterBox"
          >
            <div className="interviewFormInnerBox">
              {interviewGetForm?.length > 0 &&
                userName !== "" &&
                password !== "" &&
                startStatus &&
                interviewGetForm?.map((data, index) => {
                  if (index === indexViewQuest) {
                    if (
                      data?.type === "Radio" ||
                      data?.type === "Yes/No" ||
                      data?.type === "Correct/In Correct"
                    ) {
                      return (
                        <>
                          <List component="nav" aria-label="quiz question">
                            <ListItem
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Grid
                                container
                                spacing={2}
                                style={{
                                  marginBottom: "2%",
                                }}
                              >
                                <Grid item xs={12} md={5}>
                                  <Box style={box1}>
                                    <ListItemIcon>
                                      <InfoIcon
                                        style={{
                                          color: "black",
                                          fontSize: "2rem",
                                        }}
                                      />
                                    </ListItemIcon>
                                    <Box
                                      style={{
                                        color: "black",
                                        marginLeft: "5px",
                                      }}
                                    >{selectedLanguage?.value === "English" ? `Question No.${index + 1} of ${interviewGetForm?.length
                                      }` : `கேள்வி எண்.${index + 1} of ${interviewGetForm?.length
                                      }`}</Box>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={3}></Grid>
                                <TimerComponent />
                              </Grid>
                            </ListItem>
                            <Paper style={{ ...paper1, position: "relative" }}>
                              <ListItem>
                                <ListItemText
                                  primary={
                                    <Typography style={typography1} variant="h6">
                                      {`Q. ${selectedLanguage?.value === "English" ? data?.question : (data?.tamilquestion || data?.question)}`}
                                    </Typography>
                                  }
                                  secondary={
                                    (data?.tamilquestiondescription !== "" || data?.questiondescription !== "") && (
                                      <Typography variant="body2" style={{ fontSize: '0.8rem' }}>
                                        {selectedLanguage?.value === "English" ? data?.questiondescription : (data?.tamilquestiondescription || data?.questiondescription)}                                      </Typography>
                                    )
                                  }
                                />
                                {/* Language toggle + Additional Info button */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 1,
                                    padding: "8px 16px 4px",
                                    // borderTop: "1px solid #eee",
                                    marginTop: "4px",
                                  }}
                                >
                                  <RadioGroup
                                    row
                                    value={selectedLanguage?.value}
                                    onChange={(e) =>
                                      handleChange({ value: e.target.value, label: e.target.value })
                                    }
                                  >
                                    <FormControlLabel
                                      value="English"
                                      control={<Radio size="small" />}
                                      label="English"
                                    />
                                    <FormControlLabel
                                      value="Tamil"
                                      control={<Radio size="small" />}
                                      label="Tamil"
                                    />
                                  </RadioGroup>

                                  <Button
                                    onClick={() => setAdditionalOpen(true)}
                                    sx={{
                                      fontSize: "0.75rem",
                                      padding: "4px 8px",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    Additional Information
                                  </Button>
                                </Box>
                                {/* <Button
                                  onClick={() => setAdditionalOpen(true)}
                                  sx={additionalInfoStyle}
                                >
                                  Additional Information
                                </Button> */}
                              </ListItem>
                            </Paper>
                            <ListItem>
                              {data && data.uploadedimage && (
                                <img
                                  src={data.uploadedimage}
                                  alt="Uploaded Image"
                                  style={{
                                    maxWidth: "100%",
                                    height: "auto",
                                    display: "block",
                                    margin: "0 0",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                  }}
                                />
                              )}
                            </ListItem>
                            <ListItem>
                              <ListItemText>
                                <Typography
                                  variant="h6"
                                  style={{ marginLeft: "-12px" }}
                                >
                                  {selectedLanguage?.value === "English" ? "Please choose one of the following answers:" : "பின்வரும் பதில்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்:"}                                </Typography>
                              </ListItemText>
                            </ListItem>
                            <Divider />
                            <br />
                            <List style={list1}>
                              <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                name="radio-buttons-group"
                                value={data?.userans}
                                onChange={(e) =>
                                  handleRadioButtonChange(
                                    data,
                                    index,
                                    e.target.value
                                  )
                                }
                              >
                                {data.optionArr.map((item, i) => (
                                  <FormControlLabel
                                    key={i}
                                    value={`${item.options}`}
                                    control={<Radio />}
                                    label={selectedLanguage?.value === "English" ? `${item.options}` : `${item.tamiloptions || item?.options}`}
                                    style={{ marginLeft: "10px" }}
                                  />
                                ))}
                              </RadioGroup>
                            </List>
                            <br />
                            <Divider />
                            {/* Seocndary Todo from Primary Questions */}

                            {secondaryTodo?.length > 0 &&
                              secondaryTodo?.map((item, ind) => {
                                if (
                                  item.type === "Radio" ||
                                  item.type === "Yes/No" ||
                                  item.type === "Correct/In Correct"
                                ) {
                                  return (
                                    <>
                                      <br />
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >

                                            {selectedLanguage?.value === "English" ? "Please choose one of the following answers:" : "பின்வரும் பதில்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்:"}                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />
                                      <List style={list1}>
                                        <RadioGroup
                                          aria-labelledby="demo-radio-buttons-group-label"
                                          name="radio-buttons-group"
                                          value={selectedRadioSecondary[ind]}
                                          onChange={(e) => {
                                            handleRadioSecondary(
                                              e.target.value,
                                              ind
                                            );
                                            handleRadioButtonChangeSecondary(
                                              item,
                                              index,
                                              ind,
                                              e.target.value
                                            );
                                          }}
                                        >
                                          {item?.optionslist?.map((item, i) => (
                                            <FormControlLabel
                                              key={i}
                                              value={`${item?.answer}`}
                                              control={<Radio />}
                                              label={selectedLanguage?.value === "English" ? `${item?.answer}` : `${item?.tamilanswer || item?.answer}`}
                                              style={{ marginLeft: "10px" }}
                                            />
                                          ))}
                                        </RadioGroup>
                                      </List>
                                      <br />
                                      <Divider />
                                    </>
                                  );
                                } else if (item?.type === "MultipleChoice") {
                                  return (
                                    <>
                                      <List
                                        component="nav"
                                        aria-label="quiz question"
                                      >
                                        <Paper style={paper1}>
                                          <ListItem>
                                            <ListItemText>
                                              <Typography
                                                style={{
                                                  fontSize: "18px",
                                                  fontWeight: "600",
                                                  fontFamily:
                                                    "Arial, Helvetica, sans-serif",
                                                }}
                                                variant="h6"
                                              >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                            </ListItemText>
                                          </ListItem>
                                        </Paper>
                                        <ListItem>
                                          {item && item.uploadedimage && (
                                            <img
                                              src={item.uploadedimage}
                                              alt="Uploaded Image"
                                              style={{
                                                maxWidth: "100%",
                                                height: "auto",
                                                display: "block",
                                                margin: "0 0",
                                                borderRadius: "8px",
                                                boxShadow:
                                                  "0 2px 4px rgba(0, 0, 0, 0.1)",
                                              }}
                                            />
                                          )}
                                        </ListItem>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              variant="h6"
                                              style={{ marginLeft: "-12px" }}
                                            >
                                              {selectedLanguage?.value === "English" ? "Multiple Choice:" : "பல தேர்வு:"}
                                            </Typography>
                                          </ListItemText>
                                        </ListItem>
                                        <Divider />
                                        <br />

                                        <List style={list1}>
                                          <Grid
                                            container
                                            style={{
                                              width: "100%",
                                              boxSizing: "border-box",
                                              // border: "1px solid red",
                                            }}
                                          >
                                            <Grid
                                              items
                                              lg={6}
                                              md={6}
                                              sx={12}
                                              sm={12}
                                            >
                                              <FormControl component="fieldset">
                                                <FormGroup>
                                                  {item?.optionslist?.map(
                                                    (option) => (
                                                      <FormControlLabel
                                                        key={option._id}
                                                        control={
                                                          <Checkbox
                                                            checked={
                                                              selectedSecondaryName[
                                                                ind
                                                              ]?.includes(
                                                                option.answer
                                                              ) || false
                                                            }
                                                            onChange={(e) => {
                                                              handleSecondaryNameChange(
                                                                e,
                                                                ind
                                                              );
                                                              handleRadioButtonChangeSecondary(
                                                                item,
                                                                index,
                                                                ind,
                                                                e
                                                              );
                                                            }}
                                                            value={
                                                              option.answer
                                                            }
                                                          />
                                                        }
                                                        label={selectedLanguage?.value === "English" ? `${option?.answer}` : `${option?.tamilanswer || option?.answer}`}
                                                      />
                                                    )
                                                  )}
                                                </FormGroup>
                                              </FormControl>
                                            </Grid>
                                          </Grid>
                                        </List>
                                        <br />
                                        <Divider />
                                      </List>
                                    </>
                                  );
                                } else if (item?.type === "TextBox") {
                                  return (
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          placeholder="Please Enter Answer"
                                          style={textboxstyle}
                                          value={selectedRadioSecondary[ind]}
                                          onChange={(e) => {
                                            handleRadioSecondary(
                                              e.target.value,
                                              ind
                                            );
                                            handleRadioButtonChangeSecondary(
                                              item,
                                              index,
                                              ind,
                                              e.target.value
                                            );
                                          }}
                                        />
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  );
                                } else if (item?.type === "Text-Alpha") {
                                  return (
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          placeholder="Please Enter Answer In Alphabets"
                                          style={textboxstyle}
                                          value={selectedRadioSecondary[ind]}
                                          onChange={(e) => {
                                            const textOnly =
                                              e.target.value.replace(
                                                /[^a-zA-Z\s;]/g,
                                                ""
                                              );
                                            handleRadioSecondary(textOnly, ind);
                                            handleRadioButtonChangeSecondary(
                                              item,
                                              index,
                                              ind,
                                              textOnly
                                            );
                                          }}
                                        />
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  );
                                } else if (item?.type === "Text-Numeric") {
                                  return (
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          placeholder="Please Enter Answer In Number"
                                          style={textboxstyle}
                                          value={selectedRadioSecondary[ind]}
                                          onChange={(e) => {
                                            const numericOnly =
                                              e.target.value.replace(
                                                /[^0-9.;\s]/g,
                                                ""
                                              );
                                            handleRadioSecondary(
                                              numericOnly,
                                              ind
                                            );
                                            handleRadioButtonChangeSecondary(
                                              item,
                                              index,
                                              ind,
                                              numericOnly
                                            );
                                          }}
                                        />
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  );
                                } else if (item?.type === "Date") {
                                  return (
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="date"
                                          placeholder="Please Enter Answer"
                                          style={textboxstyle}
                                          value={selectedRadioSecondary[ind]}
                                          onChange={(e) => {
                                            handleRadioSecondary(
                                              e.target.value,
                                              ind
                                            );
                                            handleRadioButtonChangeSecondary(
                                              item,
                                              index,
                                              ind,
                                              e.target.value
                                            );
                                          }}
                                        />
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  );
                                } else if (item?.type == "Date Range") {
                                  return (
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="date"
                                          placeholder="Please Enter Answer"
                                          style={textboxstyle}
                                          value={selectedRadioSecondary[ind]}
                                          onChange={(e) => {
                                            handleRadioSecondary(
                                              e.target.value,
                                              ind
                                            );
                                            handleRadioButtonChangeSecondary(
                                              item,
                                              index,
                                              ind,
                                              e.target.value
                                            );
                                          }}
                                        />
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  );
                                }
                              })}
                            {/* SubQuestions 1 Todo from Seocndary Questions */}

                            {sub1todo?.length > 0 &&
                              sub1todo?.map((item, ind) => {
                                if (
                                  item?.type === "Radio" ||
                                  item.type === "Yes/No" ||
                                  item.type === "Correct/In Correct"
                                ) {
                                  return (
                                    <>
                                      <br />
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please choose one of the following answers:" : "பின்வரும் பதில்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />
                                      <List style={list1}>
                                        <RadioGroup
                                          aria-labelledby="demo-radio-buttons-group-label"
                                          name="radio-buttons-group"
                                          value={selectedRadioSub1Page[ind]}
                                          onChange={(e) => {
                                            handleRadioSub1Page(
                                              e.target.value,
                                              ind
                                            );
                                            handleRadioButtonChangeSub1(
                                              item,
                                              index,
                                              ind,
                                              e.target.value,
                                              ind === 0
                                                ? autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) => Number(match) + 1
                                                )
                                                : autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) =>
                                                    Number(match) + (ind + 1)
                                                )
                                            );
                                          }}
                                        >
                                          {item?.optionslist?.map((item, i) => (
                                            <FormControlLabel
                                              key={i}
                                              value={`${item?.answer}`}
                                              control={<Radio />}
                                              label={selectedLanguage?.value === "English" ? `${item?.answer}` : `${item?.tamilanswer || item?.answer}`}
                                              style={{ marginLeft: "10px" }}
                                            />
                                          ))}
                                        </RadioGroup>
                                      </List>
                                      <br />
                                      <Divider />
                                    </>
                                  );
                                } else if (item?.type === "MultipleChoice") {
                                  return (
                                    <>
                                      <List
                                        component="nav"
                                        aria-label="quiz question"
                                      >
                                        <Paper style={paper1}>
                                          <ListItem>
                                            <ListItemText>
                                              <Typography
                                                style={{
                                                  fontSize: "18px",
                                                  fontWeight: "600",
                                                  fontFamily:
                                                    "Arial, Helvetica, sans-serif",
                                                }}
                                                variant="h6"
                                              >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                            </ListItemText>
                                          </ListItem>
                                        </Paper>
                                        <ListItem>
                                          {item && item.uploadedimage && (
                                            <img
                                              src={item.uploadedimage}
                                              alt="Uploaded Image"
                                              style={{
                                                maxWidth: "100%",
                                                height: "auto",
                                                display: "block",
                                                margin: "0 0",
                                                borderRadius: "8px",
                                                boxShadow:
                                                  "0 2px 4px rgba(0, 0, 0, 0.1)",
                                              }}
                                            />
                                          )}
                                        </ListItem>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              variant="h6"
                                              style={{ marginLeft: "-12px" }}
                                            >
                                              {selectedLanguage?.value === "English" ? "Multiple Choice:" : "பல தேர்வு:"}
                                            </Typography>
                                          </ListItemText>
                                        </ListItem>
                                        <Divider />
                                        <br />

                                        <List style={list1}>
                                          <Grid
                                            container
                                            style={{
                                              width: "100%",
                                              boxSizing: "border-box",
                                              // border: "1px solid red",
                                            }}
                                          >
                                            <Grid
                                              items
                                              lg={6}
                                              md={6}
                                              sx={12}
                                              sm={12}
                                            >
                                              <FormControl component="fieldset">
                                                <FormGroup>
                                                  {item?.optionslist?.map(
                                                    (option) => (
                                                      <FormControlLabel
                                                        key={option._id}
                                                        control={
                                                          <Checkbox
                                                            checked={
                                                              selectedSub1PageName[
                                                                ind
                                                              ]?.includes(
                                                                option.answer
                                                              ) || false
                                                            }
                                                            onChange={(e) => {
                                                              handleSub1PageChange(
                                                                e,
                                                                ind
                                                              );
                                                              handleRadioButtonChangeSub1(
                                                                item,
                                                                index,
                                                                ind,
                                                                e,
                                                                ind === 0
                                                                  ? autoSubquestion.replace(
                                                                    /\d+/,
                                                                    (match) =>
                                                                      Number(
                                                                        match
                                                                      ) + 1
                                                                  )
                                                                  : autoSubquestion.replace(
                                                                    /\d+/,
                                                                    (match) =>
                                                                      Number(
                                                                        match
                                                                      ) +
                                                                      (ind +
                                                                        1)
                                                                  )
                                                              );
                                                            }}
                                                            value={
                                                              option.answer
                                                            }
                                                          />
                                                        }
                                                        label={selectedLanguage?.value === "English" ? `${option?.answer}` : `${option?.tamilanswer || option?.answer}`}
                                                      />
                                                    )
                                                  )}
                                                </FormGroup>
                                              </FormControl>
                                            </Grid>
                                          </Grid>
                                        </List>
                                        <br />
                                        <Divider />
                                      </List>
                                    </>
                                  );
                                } else if (item?.type === "TextBox") {
                                  return (
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          placeholder="Please Enter Answer"
                                          style={textboxstyle}
                                          value={selectedRadioSub1Page[ind]}
                                          onChange={(e) => {
                                            handleRadioSub1Page(
                                              e.target.value,
                                              ind
                                            );
                                            handleRadioButtonChangeSub1(
                                              item,
                                              index,
                                              ind,
                                              e.target.value,
                                              ind === 0
                                                ? autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) => Number(match) + 1
                                                )
                                                : autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) =>
                                                    Number(match) + (ind + 1)
                                                )
                                            );
                                          }}
                                        />
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  );
                                } else if (item?.type === "Text-Alpha") {
                                  return (
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          placeholder="Please Enter Answer In Alphabets"
                                          style={textboxstyle}
                                          value={selectedRadioSub1Page[ind]}
                                          onChange={(e) => {
                                            const textOnly =
                                              e.target.value.replace(
                                                /[^a-zA-Z\s;]/g,
                                                ""
                                              );
                                            handleRadioSub1Page(textOnly, ind);
                                            handleRadioButtonChangeSub1(
                                              item,
                                              index,
                                              ind,
                                              textOnly,
                                              ind === 0
                                                ? autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) => Number(match) + 1
                                                )
                                                : autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) =>
                                                    Number(match) + (ind + 1)
                                                )
                                            );
                                          }}
                                        />
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  );
                                } else if (item?.type === "Text-Numeric") {
                                  return (
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          placeholder="Please Enter Answer In Numbers"
                                          style={textboxstyle}
                                          value={selectedRadioSub1Page[ind]}
                                          onChange={(e) => {
                                            const numericOnly =
                                              e.target.value.replace(
                                                /[^0-9.;\s]/g,
                                                ""
                                              );
                                            handleRadioSub1Page(
                                              numericOnly,
                                              ind
                                            );

                                            handleRadioButtonChangeSub1(
                                              item,
                                              index,
                                              ind,
                                              numericOnly,
                                              ind === 0
                                                ? autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) => Number(match) + 1
                                                )
                                                : autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) =>
                                                    Number(match) + (ind + 1)
                                                )
                                            );
                                          }}
                                        />
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  );
                                } else if (item?.type === "Date") {
                                  return (
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="date"
                                          placeholder="Please Enter Answer"
                                          style={textboxstyle}
                                          value={selectedRadioSub1Page[ind]}
                                          onChange={(e) => {
                                            handleRadioSub1Page(
                                              e.target.value,
                                              ind
                                            );
                                            handleRadioButtonChangeSub1(
                                              item,
                                              index,
                                              ind,
                                              e.target.value,
                                              ind === 0
                                                ? autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) => Number(match) + 1
                                                )
                                                : autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) =>
                                                    Number(match) + (ind + 1)
                                                )
                                            );
                                          }}
                                        />
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  );
                                } else if (item?.type == "Date Range") {
                                  return (
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="date"
                                          placeholder="Please Enter Answer"
                                          style={textboxstyle}
                                          value={selectedRadioSub1Page[ind]}
                                          onChange={(e) => {
                                            handleRadioSub1Page(
                                              e.target.value,
                                              ind
                                            );
                                            handleRadioButtonChangeSub1(
                                              item,
                                              index,
                                              ind,
                                              e.target.value,
                                              ind === 0
                                                ? autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) => Number(match) + 1
                                                )
                                                : autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) =>
                                                    Number(match) + (ind + 1)
                                                )
                                            );
                                          }}
                                        />
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  );
                                }
                              })}
                          </List>
                        </>
                      );
                    } else if (data?.type === "TextBox") {
                      return (
                        <List component="nav" aria-label="quiz question">
                          <ListItem
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Grid
                              container
                              spacing={2}
                              style={{
                                marginBottom: "2%",
                              }}
                            >
                              <Grid item xs={12} md={5}>
                                <Box style={box1}>
                                  <ListItemIcon>
                                    <InfoIcon
                                      style={{
                                        color: "black",
                                        fontSize: "2rem",
                                      }}
                                    />
                                  </ListItemIcon>
                                  <Box
                                    style={{
                                      color: "black",
                                      marginLeft: "5px",
                                    }}
                                  >{selectedLanguage?.value === "English" ? `Question No.${index + 1} of ${interviewGetForm?.length
                                    }` : `கேள்வி எண்.${index + 1} of ${interviewGetForm?.length
                                    }`}</Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3}></Grid>
                              <TimerComponent />
                            </Grid>
                          </ListItem>
                          <Paper style={{ ...paper1, position: "relative" }}>
                            <ListItem>
                              <ListItemText
                                primary={
                                  <Typography style={typography1} variant="h6">
                                    {`Q. ${selectedLanguage?.value === "English" ? data?.question : (data?.tamilquestion || data?.question)}`}
                                  </Typography>
                                }
                                secondary={
                                  (data?.tamilquestiondescription !== "" || data?.questiondescription !== "") && (
                                    <Typography variant="body2" style={{ fontSize: '0.8rem' }}>
                                      {selectedLanguage?.value === "English" ? data?.questiondescription : (data?.tamilquestiondescription || data?.questiondescription)}                                      </Typography>
                                  )
                                }
                              />
                              {/* Language toggle + Additional Info button */}
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: 1,
                                  padding: "8px 16px 4px",
                                  // borderTop: "1px solid #eee",
                                  marginTop: "4px",
                                }}
                              >
                                <RadioGroup
                                  row
                                  value={selectedLanguage?.value}
                                  onChange={(e) =>
                                    handleChange({ value: e.target.value, label: e.target.value })
                                  }
                                >
                                  <FormControlLabel
                                    value="English"
                                    control={<Radio size="small" />}
                                    label="English"
                                  />
                                  <FormControlLabel
                                    value="Tamil"
                                    control={<Radio size="small" />}
                                    label="Tamil"
                                  />
                                </RadioGroup>

                                <Button
                                  onClick={() => setAdditionalOpen(true)}
                                  sx={{
                                    fontSize: "0.75rem",
                                    padding: "4px 8px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  Additional Information
                                </Button>
                              </Box>
                              {/* <Button
                                onClick={() => setAdditionalOpen(true)}
                                sx={additionalInfoStyle}
                              >
                                Additional Information
                              </Button> */}
                            </ListItem>
                          </Paper>
                          <ListItem>
                            {data && data.uploadedimage && (
                              <img
                                src={data.uploadedimage}
                                alt="Uploaded Image"
                                style={{
                                  maxWidth: "100%",
                                  height: "auto",
                                  display: "block",
                                  margin: "0 0",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                }}
                              />
                            )}
                          </ListItem>
                          <ListItem>
                            <ListItemText>
                              <Typography
                                variant="h6"
                                style={{ marginLeft: "-12px" }}
                              >
                                {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                              </Typography>
                            </ListItemText>
                          </ListItem>
                          <Divider />
                          <br />

                          <List style={list1}>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Please Enter Answer"
                              style={{
                                width: "100%",
                                maxWidth: "500px",
                                boxSizing: "border-box",
                              }}
                              value={data?.userans}
                              onChange={(e) => {
                                handleRadioButtonChange(
                                  data,
                                  index,
                                  e.target.value
                                );
                              }}
                            />
                          </List>
                          <br />
                          <Divider />
                          <br />
                          {/* Seocndary Todo from Primary Questions */}

                          {secondaryTodo?.length > 0 &&
                            secondaryTodo?.map((item, ind) => {
                              if (
                                item.type === "Radio" ||
                                item.type === "Yes/No" ||
                                item.type === "Correct/In Correct"
                              ) {
                                return (
                                  <>
                                    <br />
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please choose one of the following answers:" : "பின்வரும் பதில்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />
                                    <List style={list1}>
                                      <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="radio-buttons-group"
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          handleRadioSecondary(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            e.target.value
                                          );
                                        }}
                                      >
                                        {item?.optionslist?.map((item, i) => (
                                          <FormControlLabel
                                            key={i}
                                            value={`${item?.answer}`}
                                            control={<Radio />}
                                            label={selectedLanguage?.value === "English" ? `${item?.answer}` : `${item?.tamilanswer || item?.answer}`}
                                            style={{ marginLeft: "10px" }}
                                          />
                                        ))}
                                      </RadioGroup>
                                    </List>
                                    <br />
                                    <Divider />
                                  </>
                                );
                              } else if (item?.type === "MultipleChoice") {
                                return (
                                  <>
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={{
                                                fontSize: "18px",
                                                fontWeight: "600",
                                                fontFamily:
                                                  "Arial, Helvetica, sans-serif",
                                              }}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Multiple Choice:" : "பல தேர்வு:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <Grid
                                          container
                                          style={{
                                            width: "100%",
                                            boxSizing: "border-box",
                                            // border: "1px solid red",
                                          }}
                                        >
                                          <Grid
                                            items
                                            lg={6}
                                            md={6}
                                            sx={12}
                                            sm={12}
                                          >
                                            <FormControl component="fieldset">
                                              <FormGroup>
                                                {item?.optionslist?.map(
                                                  (option) => (
                                                    <FormControlLabel
                                                      key={option._id}
                                                      control={
                                                        <Checkbox
                                                          checked={
                                                            selectedSecondaryName[
                                                              ind
                                                            ]?.includes(
                                                              option.answer
                                                            ) || false
                                                          }
                                                          onChange={(e) => {
                                                            handleSecondaryNameChange(
                                                              e,
                                                              ind
                                                            );
                                                            handleRadioButtonChangeSecondary(
                                                              item,
                                                              index,
                                                              ind,
                                                              e
                                                            );
                                                          }}
                                                          value={option.answer}
                                                        />
                                                      }
                                                      label={selectedLanguage?.value === "English" ? `${option?.answer}` : `${option?.tamilanswer || option?.answer}`}
                                                    />
                                                  )
                                                )}
                                              </FormGroup>
                                            </FormControl>
                                          </Grid>
                                        </Grid>
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  </>
                                );
                              } else if (item?.type === "TextBox") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          handleRadioSecondary(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Text-Alpha") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer In Alphabets"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          const textOnly =
                                            e.target.value.replace(
                                              /[^a-zA-Z\s;]/g,
                                              ""
                                            );
                                          handleRadioSecondary(textOnly, ind);
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            textOnly
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Text-Numeric") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer In Number"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          const numericOnly =
                                            e.target.value.replace(
                                              /[^0-9.;\s]/g,
                                              ""
                                            );
                                          handleRadioSecondary(
                                            numericOnly,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            numericOnly
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Date") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          handleRadioSecondary(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type == "Date Range") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          handleRadioSecondary(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              }
                            })}
                          {/* SubQuestions 1 Todo from Seocndary Questions */}

                          {sub1todo?.length > 0 &&
                            sub1todo?.map((item, ind) => {
                              if (
                                item?.type === "Radio" ||
                                item.type === "Yes/No" ||
                                item.type === "Correct/In Correct"
                              ) {
                                return (
                                  <>
                                    <br />
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please choose one of the following answers:" : "பின்வரும் பதில்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />
                                    <List style={list1}>
                                      <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="radio-buttons-group"
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          handleRadioSub1Page(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            e.target.value,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      >
                                        {item?.optionslist?.map((item, i) => (
                                          <FormControlLabel
                                            key={i}
                                            value={`${item?.answer}`}
                                            control={<Radio />}
                                            label={selectedLanguage?.value === "English" ? `${item?.answer}` : `${item?.tamilanswer || item?.answer}`}
                                            style={{ marginLeft: "10px" }}
                                          />
                                        ))}
                                      </RadioGroup>
                                    </List>
                                    <br />
                                    <Divider />
                                  </>
                                );
                              } else if (item?.type === "MultipleChoice") {
                                return (
                                  <>
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={{
                                                fontSize: "18px",
                                                fontWeight: "600",
                                                fontFamily:
                                                  "Arial, Helvetica, sans-serif",
                                              }}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Multiple Choice:" : "பல தேர்வு:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <Grid
                                          container
                                          style={{
                                            width: "100%",
                                            boxSizing: "border-box",
                                            // border: "1px solid red",
                                          }}
                                        >
                                          <Grid
                                            items
                                            lg={6}
                                            md={6}
                                            sx={12}
                                            sm={12}
                                          >
                                            <FormControl component="fieldset">
                                              <FormGroup>
                                                {item?.optionslist?.map(
                                                  (option) => (
                                                    <FormControlLabel
                                                      key={option._id}
                                                      control={
                                                        <Checkbox
                                                          checked={
                                                            selectedSub1PageName[
                                                              ind
                                                            ]?.includes(
                                                              option.answer
                                                            ) || false
                                                          }
                                                          onChange={(e) => {
                                                            handleSub1PageChange(
                                                              e,
                                                              ind
                                                            );
                                                            handleRadioButtonChangeSub1(
                                                              item,
                                                              index,
                                                              ind,
                                                              e,
                                                              ind === 0
                                                                ? autoSubquestion.replace(
                                                                  /\d+/,
                                                                  (match) =>
                                                                    Number(
                                                                      match
                                                                    ) + 1
                                                                )
                                                                : autoSubquestion.replace(
                                                                  /\d+/,
                                                                  (match) =>
                                                                    Number(
                                                                      match
                                                                    ) +
                                                                    (ind + 1)
                                                                )
                                                            );
                                                          }}
                                                          value={option.answer}
                                                        />
                                                      }
                                                      label={selectedLanguage?.value === "English" ? `${option?.answer}` : `${option?.tamilanswer || option?.answer}`}
                                                    />
                                                  )
                                                )}
                                              </FormGroup>
                                            </FormControl>
                                          </Grid>
                                        </Grid>
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  </>
                                );
                              } else if (item?.type === "TextBox") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          handleRadioSub1Page(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            e.target.value,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Text-Alpha") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer In Alphabets"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          const textOnly =
                                            e.target.value.replace(
                                              /[^a-zA-Z\s;]/g,
                                              ""
                                            );
                                          handleRadioSub1Page(textOnly, ind);
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            textOnly,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Text-Numeric") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer In Numbers"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          const numericOnly =
                                            e.target.value.replace(
                                              /[^0-9.;\s]/g,
                                              ""
                                            );
                                          handleRadioSub1Page(numericOnly, ind);
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            numericOnly,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Date") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          handleRadioSub1Page(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            e.target.value,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type == "Date Range") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          handleRadioSub1Page(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            e.target.value,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              }
                            })}
                        </List>
                      );
                    } else if (data?.type === "Text-Alpha") {
                      return (
                        <List component="nav" aria-label="quiz question">
                          <ListItem
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Grid
                              container
                              spacing={2}
                              style={{
                                marginBottom: "2%",
                              }}
                            >
                              <Grid item xs={12} md={5}>
                                <Box style={box1}>
                                  <ListItemIcon>
                                    <InfoIcon
                                      style={{
                                        color: "black",
                                        fontSize: "2rem",
                                      }}
                                    />
                                  </ListItemIcon>
                                  <Box
                                    style={{
                                      color: "black",
                                      marginLeft: "5px",
                                    }}
                                  >{selectedLanguage?.value === "English" ? `Question No.${index + 1} of ${interviewGetForm?.length
                                    }` : `கேள்வி எண்.${index + 1} of ${interviewGetForm?.length
                                    }`}</Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3}></Grid>
                              <TimerComponent />
                            </Grid>
                          </ListItem>
                          <Paper style={{ ...paper1, position: "relative" }}>
                            <ListItem>
                              <ListItemText
                                primary={
                                  <Typography style={typography1} variant="h6">
                                    {`Q. ${selectedLanguage?.value === "English" ? data?.question : (data?.tamilquestion || data?.question)}`}
                                  </Typography>
                                }
                                secondary={
                                  (data?.tamilquestiondescription !== "" || data?.questiondescription !== "") && (
                                    <Typography variant="body2" style={{ fontSize: '0.8rem' }}>
                                      {selectedLanguage?.value === "English" ? data?.questiondescription : (data?.tamilquestiondescription || data?.questiondescription)}                                      </Typography>
                                  )
                                }
                              />
                              {/* Language toggle + Additional Info button */}
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: 1,
                                  padding: "8px 16px 4px",
                                  // borderTop: "1px solid #eee",
                                  marginTop: "4px",
                                }}
                              >
                                <RadioGroup
                                  row
                                  value={selectedLanguage?.value}
                                  onChange={(e) =>
                                    handleChange({ value: e.target.value, label: e.target.value })
                                  }
                                >
                                  <FormControlLabel
                                    value="English"
                                    control={<Radio size="small" />}
                                    label="English"
                                  />
                                  <FormControlLabel
                                    value="Tamil"
                                    control={<Radio size="small" />}
                                    label="Tamil"
                                  />
                                </RadioGroup>

                                <Button
                                  onClick={() => setAdditionalOpen(true)}
                                  sx={{
                                    fontSize: "0.75rem",
                                    padding: "4px 8px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  Additional Information
                                </Button>
                              </Box>
                              {/* <Button
                                onClick={() => setAdditionalOpen(true)}
                                sx={additionalInfoStyle}
                              >
                                Additional Information
                              </Button> */}
                            </ListItem>
                          </Paper>
                          <ListItem>
                            {data && data.uploadedimage && (
                              <img
                                src={data.uploadedimage}
                                alt="Uploaded Image"
                                style={{
                                  maxWidth: "100%",
                                  height: "auto",
                                  display: "block",
                                  margin: "0 0",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                }}
                              />
                            )}
                          </ListItem>
                          <ListItem>
                            <ListItemText>
                              <Typography
                                variant="h6"
                                style={{ marginLeft: "-12px" }}
                              >
                                {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                              </Typography>
                            </ListItemText>
                          </ListItem>
                          <Divider />
                          <br />

                          <List style={list1}>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Please Enter Answer"
                              style={{
                                width: "100%",
                                maxWidth: "500px",
                                boxSizing: "border-box",
                              }}
                              value={data?.userans}
                              onChange={(e) => {
                                handleRadioButtonChange(
                                  data,
                                  index,
                                  e.target.value
                                );
                              }}
                            />
                          </List>
                          <br />
                          <Divider />
                          <br />
                          {/* Seocndary Todo from Primary Questions */}
                          {secondaryTodo?.length > 0 &&
                            secondaryTodo?.map((item, ind) => {
                              if (
                                item.type === "Radio" ||
                                item.type === "Yes/No" ||
                                item.type === "Correct/In Correct"
                              ) {
                                return (
                                  <>
                                    <br />
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please choose one of the following answers:" : "பின்வரும் பதில்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />
                                    <List style={list1}>
                                      <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="radio-buttons-group"
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          handleRadioSecondary(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            e.target.value
                                          );
                                        }}
                                      >
                                        {item?.optionslist?.map((item, i) => (
                                          <FormControlLabel
                                            key={i}
                                            value={`${item?.answer}`}
                                            control={<Radio />}
                                            label={selectedLanguage?.value === "English" ? `${item?.answer}` : `${item?.tamilanswer || item?.answer}`}
                                            style={{ marginLeft: "10px" }}
                                          />
                                        ))}
                                      </RadioGroup>
                                    </List>
                                    <br />
                                    <Divider />
                                  </>
                                );
                              } else if (item?.type === "MultipleChoice") {
                                return (
                                  <>
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={{
                                                fontSize: "18px",
                                                fontWeight: "600",
                                                fontFamily:
                                                  "Arial, Helvetica, sans-serif",
                                              }}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Multiple Choice:" : "பல தேர்வு:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <Grid
                                          container
                                          style={{
                                            width: "100%",
                                            boxSizing: "border-box",
                                            // border: "1px solid red",
                                          }}
                                        >
                                          <Grid
                                            items
                                            lg={6}
                                            md={6}
                                            sx={12}
                                            sm={12}
                                          >
                                            <FormControl component="fieldset">
                                              <FormGroup>
                                                {item?.optionslist?.map(
                                                  (option) => (
                                                    <FormControlLabel
                                                      key={option._id}
                                                      control={
                                                        <Checkbox
                                                          checked={
                                                            selectedSecondaryName[
                                                              ind
                                                            ]?.includes(
                                                              option.answer
                                                            ) || false
                                                          }
                                                          onChange={(e) => {
                                                            handleSecondaryNameChange(
                                                              e,
                                                              ind
                                                            );
                                                            handleRadioButtonChangeSecondary(
                                                              item,
                                                              index,
                                                              ind,
                                                              e
                                                            );
                                                          }}
                                                          value={option.answer}
                                                        />
                                                      }
                                                      label={selectedLanguage?.value === "English" ? `${option?.answer}` : `${option?.tamilanswer || option?.answer}`}
                                                    />
                                                  )
                                                )}
                                              </FormGroup>
                                            </FormControl>
                                          </Grid>
                                        </Grid>
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  </>
                                );
                              } else if (item?.type === "TextBox") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          handleRadioSecondary(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Text-Alpha") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer In Alphabets"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          const textOnly =
                                            e.target.value.replace(
                                              /[^a-zA-Z\s;]/g,
                                              ""
                                            );
                                          handleRadioSecondary(textOnly, ind);
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            textOnly
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Text-Numeric") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer In Number"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          const numericOnly =
                                            e.target.value.replace(
                                              /[^0-9.;\s]/g,
                                              ""
                                            );
                                          handleRadioSecondary(
                                            numericOnly,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            numericOnly
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Date") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          handleRadioSecondary(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type == "Date Range") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          handleRadioSecondary(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              }
                            })}
                          {/* SubQuestions 1 Todo from Seocndary Questions */}

                          {sub1todo?.length > 0 &&
                            sub1todo?.map((item, ind) => {
                              if (
                                item?.type === "Radio" ||
                                item.type === "Yes/No" ||
                                item.type === "Correct/In Correct"
                              ) {
                                return (
                                  <>
                                    <br />
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please choose one of the following answers:" : "பின்வரும் பதில்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />
                                    <List style={list1}>
                                      <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="radio-buttons-group"
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          handleRadioSub1Page(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            e.target.value,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      >
                                        {item?.optionslist?.map((item, i) => (
                                          <FormControlLabel
                                            key={i}
                                            value={`${item?.answer}`}
                                            control={<Radio />}
                                            label={selectedLanguage?.value === "English" ? `${item?.answer}` : `${item?.tamilanswer || item?.answer}`}
                                            style={{ marginLeft: "10px" }}
                                          />
                                        ))}
                                      </RadioGroup>
                                    </List>
                                    <br />
                                    <Divider />
                                  </>
                                );
                              } else if (item?.type === "MultipleChoice") {
                                return (
                                  <>
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={{
                                                fontSize: "18px",
                                                fontWeight: "600",
                                                fontFamily:
                                                  "Arial, Helvetica, sans-serif",
                                              }}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Multiple Choice:" : "பல தேர்வு:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <Grid
                                          container
                                          style={{
                                            width: "100%",
                                            boxSizing: "border-box",
                                            // border: "1px solid red",
                                          }}
                                        >
                                          <Grid
                                            items
                                            lg={6}
                                            md={6}
                                            sx={12}
                                            sm={12}
                                          >
                                            <FormControl component="fieldset">
                                              <FormGroup>
                                                {item?.optionslist?.map(
                                                  (option) => (
                                                    <FormControlLabel
                                                      key={option._id}
                                                      control={
                                                        <Checkbox
                                                          checked={
                                                            selectedSub1PageName[
                                                              ind
                                                            ]?.includes(
                                                              option.answer
                                                            ) || false
                                                          }
                                                          onChange={(e) => {
                                                            handleSub1PageChange(
                                                              e,
                                                              ind
                                                            );
                                                            handleRadioButtonChangeSub1(
                                                              item,
                                                              index,
                                                              ind,
                                                              e,
                                                              ind === 0
                                                                ? autoSubquestion.replace(
                                                                  /\d+/,
                                                                  (match) =>
                                                                    Number(
                                                                      match
                                                                    ) + 1
                                                                )
                                                                : autoSubquestion.replace(
                                                                  /\d+/,
                                                                  (match) =>
                                                                    Number(
                                                                      match
                                                                    ) +
                                                                    (ind + 1)
                                                                )
                                                            );
                                                          }}
                                                          value={option.answer}
                                                        />
                                                      }
                                                      label={selectedLanguage?.value === "English" ? `${option?.answer}` : `${option?.tamilanswer || option?.answer}`}
                                                    />
                                                  )
                                                )}
                                              </FormGroup>
                                            </FormControl>
                                          </Grid>
                                        </Grid>
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  </>
                                );
                              } else if (item?.type === "TextBox") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          handleRadioSub1Page(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            e.target.value,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Text-Alpha") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer In Alphabets"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          const textOnly =
                                            e.target.value.replace(
                                              /[^a-zA-Z\s;]/g,
                                              ""
                                            );
                                          handleRadioSub1Page(textOnly, ind);
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            textOnly,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Text-Numeric") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer In Numbers"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          const numericOnly =
                                            e.target.value.replace(
                                              /[^0-9.;\s]/g,
                                              ""
                                            );
                                          handleRadioSub1Page(numericOnly, ind);
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            numericOnly,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Date") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          handleRadioSub1Page(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            e.target.value,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type == "Date Range") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          handleRadioSub1Page(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            e.target.value,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              }
                            })}
                        </List>
                      );
                    } else if (data?.type === "Text-Numeric") {
                      return (
                        <List component="nav" aria-label="quiz question">
                          <ListItem
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Grid
                              container
                              spacing={2}
                              style={{
                                marginBottom: "2%",
                              }}
                            >
                              <Grid item xs={12} md={5}>
                                <Box style={box1}>
                                  <ListItemIcon>
                                    <InfoIcon
                                      style={{
                                        color: "black",
                                        fontSize: "2rem",
                                      }}
                                    />
                                  </ListItemIcon>
                                  <Box
                                    style={{
                                      color: "black",
                                      marginLeft: "5px",
                                    }}
                                  >{selectedLanguage?.value === "English" ? `Question No.${index + 1} of ${interviewGetForm?.length
                                    }` : `கேள்வி எண்.${index + 1} of ${interviewGetForm?.length
                                    }`}</Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3}></Grid>
                              <TimerComponent />
                            </Grid>
                          </ListItem>
                          <Paper style={{ ...paper1, position: "relative" }}>
                            <ListItem>
                              <ListItemText
                                primary={
                                  <Typography style={typography1} variant="h6">
                                    {`Q. ${selectedLanguage?.value === "English" ? data?.question : (data?.tamilquestion || data?.question)}`}
                                  </Typography>
                                }
                                secondary={
                                  (data?.tamilquestiondescription !== "" || data?.questiondescription !== "") && (
                                    <Typography variant="body2" style={{ fontSize: '0.8rem' }}>
                                      {selectedLanguage?.value === "English" ? data?.questiondescription : (data?.tamilquestiondescription || data?.questiondescription)}                                      </Typography>
                                  )
                                }
                              />
                              {/* Language toggle + Additional Info button */}
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: 1,
                                  padding: "8px 16px 4px",
                                  // borderTop: "1px solid #eee",
                                  marginTop: "4px",
                                }}
                              >
                                <RadioGroup
                                  row
                                  value={selectedLanguage?.value}
                                  onChange={(e) =>
                                    handleChange({ value: e.target.value, label: e.target.value })
                                  }
                                >
                                  <FormControlLabel
                                    value="English"
                                    control={<Radio size="small" />}
                                    label="English"
                                  />
                                  <FormControlLabel
                                    value="Tamil"
                                    control={<Radio size="small" />}
                                    label="Tamil"
                                  />
                                </RadioGroup>

                                <Button
                                  onClick={() => setAdditionalOpen(true)}
                                  sx={{
                                    fontSize: "0.75rem",
                                    padding: "4px 8px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  Additional Information
                                </Button>
                              </Box>
                              {/* <Button
                                onClick={() => setAdditionalOpen(true)}
                                sx={additionalInfoStyle}
                              >
                                Additional Information
                              </Button> */}
                            </ListItem>
                          </Paper>

                          <ListItem>
                            {data && data.uploadedimage && (
                              <img
                                src={data.uploadedimage}
                                alt="Uploaded Image"
                                style={{
                                  maxWidth: "100%",
                                  height: "auto",
                                  display: "block",
                                  margin: "0 0",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                }}
                              />
                            )}
                          </ListItem>
                          <ListItem>
                            <ListItemText>
                              <Typography
                                variant="h6"
                                style={{ marginLeft: "-12px" }}
                              >
                                {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                              </Typography>
                            </ListItemText>
                          </ListItem>
                          <Divider />
                          <br />

                          <List style={list1}>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Please Enter Answer"
                              style={{
                                width: "100%",
                                maxWidth: "500px",
                                boxSizing: "border-box",
                              }}
                              value={data?.userans}
                              onChange={(e) => {
                                handleRadioButtonChange(
                                  data,
                                  index,
                                  e.target.value
                                );
                              }}
                            />
                          </List>
                          <br />
                          <Divider />
                          <br />
                          {/* Seocndary Todo from Primary Questions */}

                          {secondaryTodo?.length > 0 &&
                            secondaryTodo?.map((item, ind) => {
                              if (
                                item.type === "Radio" ||
                                item.type === "Yes/No" ||
                                item.type === "Correct/In Correct"
                              ) {
                                return (
                                  <>
                                    <br />
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please choose one of the following answers:" : "பின்வரும் பதில்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />
                                    <List style={list1}>
                                      <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="radio-buttons-group"
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          handleRadioSecondary(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            e.target.value
                                          );
                                        }}
                                      >
                                        {item?.optionslist?.map((item, i) => (
                                          <FormControlLabel
                                            key={i}
                                            value={`${item?.answer}`}
                                            control={<Radio />}
                                            label={selectedLanguage?.value === "English" ? `${item?.answer}` : `${item?.tamilanswer || item?.answer}`}
                                            style={{ marginLeft: "10px" }}
                                          />
                                        ))}
                                      </RadioGroup>
                                    </List>
                                    <br />
                                    <Divider />
                                  </>
                                );
                              } else if (item?.type === "MultipleChoice") {
                                return (
                                  <>
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={{
                                                fontSize: "18px",
                                                fontWeight: "600",
                                                fontFamily:
                                                  "Arial, Helvetica, sans-serif",
                                              }}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Multiple Choice:" : "பல தேர்வு:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <Grid
                                          container
                                          style={{
                                            width: "100%",
                                            boxSizing: "border-box",
                                            // border: "1px solid red",
                                          }}
                                        >
                                          <Grid
                                            items
                                            lg={6}
                                            md={6}
                                            sx={12}
                                            sm={12}
                                          >
                                            <FormControl component="fieldset">
                                              <FormGroup>
                                                {item?.optionslist?.map(
                                                  (option) => (
                                                    <FormControlLabel
                                                      key={option._id}
                                                      control={
                                                        <Checkbox
                                                          checked={
                                                            selectedSecondaryName[
                                                              ind
                                                            ]?.includes(
                                                              option.answer
                                                            ) || false
                                                          }
                                                          onChange={(e) => {
                                                            handleSecondaryNameChange(
                                                              e,
                                                              ind
                                                            );
                                                            handleRadioButtonChangeSecondary(
                                                              item,
                                                              index,
                                                              ind,
                                                              e
                                                            );
                                                          }}
                                                          value={option.answer}
                                                        />
                                                      }
                                                      label={selectedLanguage?.value === "English" ? `${option?.answer}` : `${option?.tamilanswer || option?.answer}`}
                                                    />
                                                  )
                                                )}
                                              </FormGroup>
                                            </FormControl>
                                          </Grid>
                                        </Grid>
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  </>
                                );
                              } else if (item?.type === "TextBox") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          handleRadioSecondary(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Text-Alpha") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer In Alphabets"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          const textOnly =
                                            e.target.value.replace(
                                              /[^a-zA-Z\s;]/g,
                                              ""
                                            );
                                          handleRadioSecondary(textOnly, ind);
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            textOnly
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Text-Numeric") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer In Number"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          const numericOnly =
                                            e.target.value.replace(
                                              /[^0-9.;\s]/g,
                                              ""
                                            );
                                          handleRadioSecondary(
                                            numericOnly,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            numericOnly
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Date") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          handleRadioSecondary(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type == "Date Range") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          handleRadioSecondary(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              }
                            })}
                          {/* SubQuestions 1 Todo from Seocndary Questions */}

                          {sub1todo?.length > 0 &&
                            sub1todo?.map((item, ind) => {
                              if (
                                item?.type === "Radio" ||
                                item.type === "Yes/No" ||
                                item.type === "Correct/In Correct"
                              ) {
                                return (
                                  <>
                                    <br />
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please choose one of the following answers:" : "பின்வரும் பதில்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />
                                    <List style={list1}>
                                      <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="radio-buttons-group"
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          handleRadioSub1Page(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            e.target.value,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      >
                                        {item?.optionslist?.map((item, i) => (
                                          <FormControlLabel
                                            key={i}
                                            value={`${item?.answer}`}
                                            control={<Radio />}
                                            label={selectedLanguage?.value === "English" ? `${item?.answer}` : `${item?.tamilanswer || item?.answer}`}
                                            style={{ marginLeft: "10px" }}
                                          />
                                        ))}
                                      </RadioGroup>
                                    </List>
                                    <br />
                                    <Divider />
                                  </>
                                );
                              } else if (item?.type === "MultipleChoice") {
                                return (
                                  <>
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={{
                                                fontSize: "18px",
                                                fontWeight: "600",
                                                fontFamily:
                                                  "Arial, Helvetica, sans-serif",
                                              }}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Multiple Choice:" : "பல தேர்வு:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <Grid
                                          container
                                          style={{
                                            width: "100%",
                                            boxSizing: "border-box",
                                            // border: "1px solid red",
                                          }}
                                        >
                                          <Grid
                                            items
                                            lg={6}
                                            md={6}
                                            sx={12}
                                            sm={12}
                                          >
                                            <FormControl component="fieldset">
                                              <FormGroup>
                                                {item?.optionslist?.map(
                                                  (option) => (
                                                    <FormControlLabel
                                                      key={option._id}
                                                      control={
                                                        <Checkbox
                                                          checked={
                                                            selectedSub1PageName[
                                                              ind
                                                            ]?.includes(
                                                              option.answer
                                                            ) || false
                                                          }
                                                          onChange={(e) => {
                                                            handleSub1PageChange(
                                                              e,
                                                              ind
                                                            );
                                                            handleRadioButtonChangeSub1(
                                                              item,
                                                              index,
                                                              ind,
                                                              e,
                                                              ind === 0
                                                                ? autoSubquestion.replace(
                                                                  /\d+/,
                                                                  (match) =>
                                                                    Number(
                                                                      match
                                                                    ) + 1
                                                                )
                                                                : autoSubquestion.replace(
                                                                  /\d+/,
                                                                  (match) =>
                                                                    Number(
                                                                      match
                                                                    ) +
                                                                    (ind + 1)
                                                                )
                                                            );
                                                          }}
                                                          value={option.answer}
                                                        />
                                                      }
                                                      label={selectedLanguage?.value === "English" ? `${option?.answer}` : `${option?.tamilanswer || option?.answer}`}
                                                    />
                                                  )
                                                )}
                                              </FormGroup>
                                            </FormControl>
                                          </Grid>
                                        </Grid>
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  </>
                                );
                              } else if (item?.type === "TextBox") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          handleRadioSub1Page(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            e.target.value,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Text-Alpha") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer In Alphabets"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          const textOnly =
                                            e.target.value.replace(
                                              /[^a-zA-Z\s;]/g,
                                              ""
                                            );
                                          handleRadioSub1Page(textOnly, ind);
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            textOnly,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Text-Numeric") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer In Numbers"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          const numericOnly =
                                            e.target.value.replace(
                                              /[^0-9.;\s]/g,
                                              ""
                                            );
                                          handleRadioSub1Page(numericOnly, ind);
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            numericOnly,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Date") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          handleRadioSub1Page(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            e.target.value,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type == "Date Range") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          handleRadioSub1Page(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            e.target.value,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              }
                            })}
                        </List>
                      );
                    } else if (data?.type === "Date") {
                      return (
                        <List component="nav" aria-label="quiz question">
                          <ListItem
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Grid
                              container
                              spacing={2}
                              style={{
                                marginBottom: "2%",
                              }}
                            >
                              <Grid item xs={12} md={5}>
                                <Box style={box1}>
                                  <ListItemIcon>
                                    <InfoIcon
                                      style={{
                                        color: "black",
                                        fontSize: "2rem",
                                      }}
                                    />
                                  </ListItemIcon>
                                  <Box
                                    style={{
                                      color: "black",
                                      marginLeft: "5px",
                                    }}
                                  >{selectedLanguage?.value === "English" ? `Question No.${index + 1} of ${interviewGetForm?.length
                                    }` : `கேள்வி எண்.${index + 1} of ${interviewGetForm?.length
                                    }`}</Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3}></Grid>
                              <TimerComponent />
                            </Grid>
                          </ListItem>
                          <Paper style={{ ...paper1, position: "relative" }}>
                            <ListItem>
                              <ListItemText
                                primary={
                                  <Typography style={typography1} variant="h6">
                                    {`Q. ${selectedLanguage?.value === "English" ? data?.question : (data?.tamilquestion || data?.question)}`}
                                  </Typography>
                                }
                                secondary={
                                  (data?.tamilquestiondescription !== "" || data?.questiondescription !== "") && (
                                    <Typography variant="body2" style={{ fontSize: '0.8rem' }}>
                                      {selectedLanguage?.value === "English" ? data?.questiondescription : (data?.tamilquestiondescription || data?.questiondescription)}                                      </Typography>
                                  )
                                }
                              />
                              {/* Language toggle + Additional Info button */}
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: 1,
                                  padding: "8px 16px 4px",
                                  // borderTop: "1px solid #eee",
                                  marginTop: "4px",
                                }}
                              >
                                <RadioGroup
                                  row
                                  value={selectedLanguage?.value}
                                  onChange={(e) =>
                                    handleChange({ value: e.target.value, label: e.target.value })
                                  }
                                >
                                  <FormControlLabel
                                    value="English"
                                    control={<Radio size="small" />}
                                    label="English"
                                  />
                                  <FormControlLabel
                                    value="Tamil"
                                    control={<Radio size="small" />}
                                    label="Tamil"
                                  />
                                </RadioGroup>

                                <Button
                                  onClick={() => setAdditionalOpen(true)}
                                  sx={{
                                    fontSize: "0.75rem",
                                    padding: "4px 8px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  Additional Information
                                </Button>
                              </Box>
                              {/* <Button
                                onClick={() => setAdditionalOpen(true)}
                                sx={additionalInfoStyle}
                              >
                                Additional Information
                              </Button> */}
                            </ListItem>
                          </Paper>
                          <ListItem>
                            {data && data.uploadedimage && (
                              <img
                                src={data.uploadedimage}
                                alt="Uploaded Image"
                                style={{
                                  maxWidth: "100%",
                                  height: "auto",
                                  display: "block",
                                  margin: "0 0",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                }}
                              />
                            )}
                          </ListItem>
                          <ListItem>
                            <ListItemText>
                              <Typography
                                variant="h6"
                                style={{ marginLeft: "-12px" }}
                              >
                                {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                              </Typography>
                            </ListItemText>
                          </ListItem>
                          <Divider />
                          <br />

                          <List style={list1}>
                            <OutlinedInput
                              id="component-outlined"
                              type="date"
                              placeholder="Please Enter Answer"
                              style={{
                                width: "100%",
                                maxWidth: "500px",
                                boxSizing: "border-box",
                              }}
                              value={data?.userans}
                              onChange={(e) => {
                                handleRadioButtonChange(
                                  data,
                                  index,
                                  e.target.value
                                );
                              }}
                            />
                          </List>
                          <br />
                          <Divider />
                          <br />
                          {/* Seocndary Todo from Primary Questions */}

                          {secondaryTodo?.length > 0 &&
                            secondaryTodo?.map((item, ind) => {
                              if (
                                item.type === "Radio" ||
                                item.type === "Yes/No" ||
                                item.type === "Correct/In Correct"
                              ) {
                                return (
                                  <>
                                    <br />
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please choose one of the following answers:" : "பின்வரும் பதில்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />
                                    <List style={list1}>
                                      <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="radio-buttons-group"
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          handleRadioSecondary(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            e.target.value
                                          );
                                        }}
                                      >
                                        {item?.optionslist?.map((item, i) => (
                                          <FormControlLabel
                                            key={i}
                                            value={`${item?.answer}`}
                                            control={<Radio />}
                                            label={selectedLanguage?.value === "English" ? `${item?.answer}` : `${item?.tamilanswer || item?.answer}`}
                                            style={{ marginLeft: "10px" }}
                                          />
                                        ))}
                                      </RadioGroup>
                                    </List>
                                    <br />
                                    <Divider />
                                  </>
                                );
                              } else if (item?.type === "MultipleChoice") {
                                return (
                                  <>
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={{
                                                fontSize: "18px",
                                                fontWeight: "600",
                                                fontFamily:
                                                  "Arial, Helvetica, sans-serif",
                                              }}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Multiple Choice:" : "பல தேர்வு:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <Grid
                                          container
                                          style={{
                                            width: "100%",
                                            boxSizing: "border-box",
                                            // border: "1px solid red",
                                          }}
                                        >
                                          <Grid
                                            items
                                            lg={6}
                                            md={6}
                                            sx={12}
                                            sm={12}
                                          >
                                            <FormControl component="fieldset">
                                              <FormGroup>
                                                {item?.optionslist?.map(
                                                  (option) => (
                                                    <FormControlLabel
                                                      key={option._id}
                                                      control={
                                                        <Checkbox
                                                          checked={
                                                            selectedSecondaryName[
                                                              ind
                                                            ]?.includes(
                                                              option.answer
                                                            ) || false
                                                          }
                                                          onChange={(e) => {
                                                            handleSecondaryNameChange(
                                                              e,
                                                              ind
                                                            );
                                                            handleRadioButtonChangeSecondary(
                                                              item,
                                                              index,
                                                              ind,
                                                              e
                                                            );
                                                          }}
                                                          value={option.answer}
                                                        />
                                                      }
                                                      label={selectedLanguage?.value === "English" ? `${option?.answer}` : `${option?.tamilanswer || option?.answer}`}
                                                    />
                                                  )
                                                )}
                                              </FormGroup>
                                            </FormControl>
                                          </Grid>
                                        </Grid>
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  </>
                                );
                              } else if (item?.type === "TextBox") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          handleRadioSecondary(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Text-Alpha") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer In Alphabets"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          const textOnly =
                                            e.target.value.replace(
                                              /[^a-zA-Z\s;]/g,
                                              ""
                                            );
                                          handleRadioSecondary(textOnly, ind);
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            textOnly
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Text-Numeric") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer In Number"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          const numericOnly =
                                            e.target.value.replace(
                                              /[^0-9.;\s]/g,
                                              ""
                                            );
                                          handleRadioSecondary(
                                            numericOnly,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            numericOnly
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Date") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          handleRadioSecondary(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type == "Date Range") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          handleRadioSecondary(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              }
                            })}
                          {/* SubQuestions 1 Todo from Seocndary Questions */}

                          {sub1todo?.length > 0 &&
                            sub1todo?.map((item, ind) => {
                              if (
                                item?.type === "Radio" ||
                                item.type === "Yes/No" ||
                                item.type === "Correct/In Correct"
                              ) {
                                return (
                                  <>
                                    <br />
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please choose one of the following answers:" : "பின்வரும் பதில்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />
                                    <List style={list1}>
                                      <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="radio-buttons-group"
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          handleRadioSub1Page(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            e.target.value,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      >
                                        {item?.optionslist?.map((item, i) => (
                                          <FormControlLabel
                                            key={i}
                                            value={`${item?.answer}`}
                                            control={<Radio />}
                                            label={selectedLanguage?.value === "English" ? `${item?.answer}` : `${item?.tamilanswer || item?.answer}`}
                                            style={{ marginLeft: "10px" }}
                                          />
                                        ))}
                                      </RadioGroup>
                                    </List>
                                    <br />
                                    <Divider />
                                  </>
                                );
                              } else if (item?.type === "MultipleChoice") {
                                return (
                                  <>
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={{
                                                fontSize: "18px",
                                                fontWeight: "600",
                                                fontFamily:
                                                  "Arial, Helvetica, sans-serif",
                                              }}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Multiple Choice:" : "பல தேர்வு:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <Grid
                                          container
                                          style={{
                                            width: "100%",
                                            boxSizing: "border-box",
                                            // border: "1px solid red",
                                          }}
                                        >
                                          <Grid
                                            items
                                            lg={6}
                                            md={6}
                                            sx={12}
                                            sm={12}
                                          >
                                            <FormControl component="fieldset">
                                              <FormGroup>
                                                {item?.optionslist?.map(
                                                  (option) => (
                                                    <FormControlLabel
                                                      key={option._id}
                                                      control={
                                                        <Checkbox
                                                          checked={
                                                            selectedSub1PageName[
                                                              ind
                                                            ]?.includes(
                                                              option.answer
                                                            ) || false
                                                          }
                                                          onChange={(e) => {
                                                            handleSub1PageChange(
                                                              e,
                                                              ind
                                                            );
                                                            handleRadioButtonChangeSub1(
                                                              item,
                                                              index,
                                                              ind,
                                                              e,
                                                              ind === 0
                                                                ? autoSubquestion.replace(
                                                                  /\d+/,
                                                                  (match) =>
                                                                    Number(
                                                                      match
                                                                    ) + 1
                                                                )
                                                                : autoSubquestion.replace(
                                                                  /\d+/,
                                                                  (match) =>
                                                                    Number(
                                                                      match
                                                                    ) +
                                                                    (ind + 1)
                                                                )
                                                            );
                                                          }}
                                                          value={option.answer}
                                                        />
                                                      }
                                                      label={selectedLanguage?.value === "English" ? `${option?.answer}` : `${option?.tamilanswer || option?.answer}`}
                                                    />
                                                  )
                                                )}
                                              </FormGroup>
                                            </FormControl>
                                          </Grid>
                                        </Grid>
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  </>
                                );
                              } else if (item?.type === "TextBox") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          handleRadioSub1Page(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            e.target.value,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Text-Alpha") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer In Alphabets"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          const textOnly =
                                            e.target.value.replace(
                                              /[^a-zA-Z\s;]/g,
                                              ""
                                            );
                                          handleRadioSub1Page(textOnly, ind);
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            textOnly,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Text-Numeric") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer In Numbers"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          const numericOnly =
                                            e.target.value.replace(
                                              /[^0-9.;\s]/g,
                                              ""
                                            );
                                          handleRadioSub1Page(numericOnly, ind);
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            numericOnly,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Date") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          handleRadioSub1Page(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            e.target.value,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type == "Date Range") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          handleRadioSub1Page(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            e.target.value,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              }
                            })}
                        </List>
                      );
                    } else if (data?.type === "Date Range") {
                      return (
                        <List component="nav" aria-label="quiz question">
                          <ListItem
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Grid
                              container
                              spacing={2}
                              style={{
                                marginBottom: "2%",
                              }}
                            >
                              <Grid item xs={12} md={5}>
                                <Box style={box1}>
                                  <ListItemIcon>
                                    <InfoIcon
                                      style={{
                                        color: "black",
                                        fontSize: "2rem",
                                      }}
                                    />
                                  </ListItemIcon>
                                  <Box
                                    style={{
                                      color: "black",
                                      marginLeft: "5px",
                                    }}
                                  >{selectedLanguage?.value === "English" ? `Question No.${index + 1} of ${interviewGetForm?.length
                                    }` : `கேள்வி எண்.${index + 1} of ${interviewGetForm?.length
                                    }`}</Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3}></Grid>
                              <TimerComponent />
                            </Grid>
                          </ListItem>
                          <Paper style={{ ...paper1, position: "relative" }}>
                            <ListItem>
                              <ListItemText
                                primary={
                                  <Typography style={typography1} variant="h6">
                                    {`Q. ${selectedLanguage?.value === "English" ? data?.question : (data?.tamilquestion || data?.question)}`}
                                  </Typography>
                                }
                                secondary={
                                  (data?.tamilquestiondescription !== "" || data?.questiondescription !== "") && (
                                    <Typography variant="body2" style={{ fontSize: '0.8rem' }}>
                                      {selectedLanguage?.value === "English" ? data?.questiondescription : (data?.tamilquestiondescription || data?.questiondescription)}                                      </Typography>
                                  )
                                }
                              />
                              {/* Language toggle + Additional Info button */}
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: 1,
                                  padding: "8px 16px 4px",
                                  // borderTop: "1px solid #eee",
                                  marginTop: "4px",
                                }}
                              >
                                <RadioGroup
                                  row
                                  value={selectedLanguage?.value}
                                  onChange={(e) =>
                                    handleChange({ value: e.target.value, label: e.target.value })
                                  }
                                >
                                  <FormControlLabel
                                    value="English"
                                    control={<Radio size="small" />}
                                    label="English"
                                  />
                                  <FormControlLabel
                                    value="Tamil"
                                    control={<Radio size="small" />}
                                    label="Tamil"
                                  />
                                </RadioGroup>

                                <Button
                                  onClick={() => setAdditionalOpen(true)}
                                  sx={{
                                    fontSize: "0.75rem",
                                    padding: "4px 8px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  Additional Information
                                </Button>
                              </Box>
                              {/* <Button
                                onClick={() => setAdditionalOpen(true)}
                                sx={additionalInfoStyle}
                              >
                                Additional Information
                              </Button> */}
                            </ListItem>
                          </Paper>
                          <ListItem>
                            {data && data.uploadedimage && (
                              <img
                                src={data.uploadedimage}
                                alt="Uploaded Image"
                                style={{
                                  maxWidth: "100%",
                                  height: "auto",
                                  display: "block",
                                  margin: "0 0",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                }}
                              />
                            )}
                          </ListItem>
                          <ListItem>
                            <ListItemText>
                              <Typography
                                variant="h6"
                                style={{ marginLeft: "-12px" }}
                              >
                                {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                              </Typography>
                            </ListItemText>
                          </ListItem>
                          <Divider />
                          <br />

                          <List style={list1}>
                            <OutlinedInput
                              id="component-outlined"
                              type="date"
                              placeholder="Please Enter Answer"
                              style={{
                                width: "100%",
                                maxWidth: "500px",
                                boxSizing: "border-box",
                              }}
                              value={data?.userans}
                              onChange={(e) => {
                                handleRadioButtonChange(
                                  data,
                                  index,
                                  e.target.value,
                                  "todate"
                                );
                              }}
                            />
                          </List>
                          <br />
                          <Divider />
                          <br />
                          {/* Seocndary Todo from Primary Questions */}

                          {secondaryTodo?.length > 0 &&
                            secondaryTodo?.map((item, ind) => {
                              if (
                                item.type === "Radio" ||
                                item.type === "Yes/No" ||
                                item.type === "Correct/In Correct"
                              ) {
                                return (
                                  <>
                                    <br />
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please choose one of the following answers:" : "பின்வரும் பதில்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />
                                    <List style={list1}>
                                      <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="radio-buttons-group"
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          handleRadioSecondary(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            e.target.value
                                          );
                                        }}
                                      >
                                        {item?.optionslist?.map((item, i) => (
                                          <FormControlLabel
                                            key={i}
                                            value={`${item?.answer}`}
                                            control={<Radio />}
                                            label={selectedLanguage?.value === "English" ? `${item?.answer}` : `${item?.tamilanswer || item?.answer}`}
                                            style={{ marginLeft: "10px" }}
                                          />
                                        ))}
                                      </RadioGroup>
                                    </List>
                                    <br />
                                    <Divider />
                                  </>
                                );
                              } else if (item?.type === "MultipleChoice") {
                                return (
                                  <>
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={{
                                                fontSize: "18px",
                                                fontWeight: "600",
                                                fontFamily:
                                                  "Arial, Helvetica, sans-serif",
                                              }}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Multiple Choice:" : "பல தேர்வு:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <Grid
                                          container
                                          style={{
                                            width: "100%",
                                            boxSizing: "border-box",
                                            // border: "1px solid red",
                                          }}
                                        >
                                          <Grid
                                            items
                                            lg={6}
                                            md={6}
                                            sx={12}
                                            sm={12}
                                          >
                                            <FormControl component="fieldset">
                                              <FormGroup>
                                                {item?.optionslist?.map(
                                                  (option) => (
                                                    <FormControlLabel
                                                      key={option._id}
                                                      control={
                                                        <Checkbox
                                                          checked={
                                                            selectedSecondaryName[
                                                              ind
                                                            ]?.includes(
                                                              option.answer
                                                            ) || false
                                                          }
                                                          onChange={(e) => {
                                                            handleSecondaryNameChange(
                                                              e,
                                                              ind
                                                            );
                                                            handleRadioButtonChangeSecondary(
                                                              item,
                                                              index,
                                                              ind,
                                                              e
                                                            );
                                                          }}
                                                          value={option.answer}
                                                        />
                                                      }
                                                      label={selectedLanguage?.value === "English" ? `${option?.answer}` : `${option?.tamilanswer || option?.answer}`}
                                                    />
                                                  )
                                                )}
                                              </FormGroup>
                                            </FormControl>
                                          </Grid>
                                        </Grid>
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  </>
                                );
                              } else if (item?.type === "TextBox") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          handleRadioSecondary(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Text-Alpha") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer In Alphabets"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          const textOnly =
                                            e.target.value.replace(
                                              /[^a-zA-Z\s;]/g,
                                              ""
                                            );
                                          handleRadioSecondary(textOnly, ind);
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            textOnly
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Text-Numeric") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer In Number"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          const numericOnly =
                                            e.target.value.replace(
                                              /[^0-9.;\s]/g,
                                              ""
                                            );
                                          handleRadioSecondary(
                                            numericOnly,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            numericOnly
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Date") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          handleRadioSecondary(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type == "Date Range") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSecondary[ind]}
                                        onChange={(e) => {
                                          handleRadioSecondary(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSecondary(
                                            item,
                                            index,
                                            ind,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              }
                            })}
                          {/* SubQuestions 1 Todo from Seocndary Questions */}

                          {sub1todo?.length > 0 &&
                            sub1todo?.map((item, ind) => {
                              if (
                                item?.type === "Radio" ||
                                item.type === "Yes/No" ||
                                item.type === "Correct/In Correct"
                              ) {
                                return (
                                  <>
                                    <br />
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please choose one of the following answers:" : "பின்வரும் பதில்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />
                                    <List style={list1}>
                                      <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="radio-buttons-group"
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          handleRadioSub1Page(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            e.target.value,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      >
                                        {item?.optionslist?.map((item, i) => (
                                          <FormControlLabel
                                            key={i}
                                            value={`${item?.answer}`}
                                            control={<Radio />}
                                            label={selectedLanguage?.value === "English" ? `${item?.answer}` : `${item?.tamilanswer || item?.answer}`}
                                            style={{ marginLeft: "10px" }}
                                          />
                                        ))}
                                      </RadioGroup>
                                    </List>
                                    <br />
                                    <Divider />
                                  </>
                                );
                              } else if (item?.type === "MultipleChoice") {
                                return (
                                  <>
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={{
                                                fontSize: "18px",
                                                fontWeight: "600",
                                                fontFamily:
                                                  "Arial, Helvetica, sans-serif",
                                              }}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Multiple Choice:" : "பல தேர்வு:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <Grid
                                          container
                                          style={{
                                            width: "100%",
                                            boxSizing: "border-box",
                                            // border: "1px solid red",
                                          }}
                                        >
                                          <Grid
                                            items
                                            lg={6}
                                            md={6}
                                            sx={12}
                                            sm={12}
                                          >
                                            <FormControl component="fieldset">
                                              <FormGroup>
                                                {item?.optionslist?.map(
                                                  (option) => (
                                                    <FormControlLabel
                                                      key={option._id}
                                                      control={
                                                        <Checkbox
                                                          checked={
                                                            selectedSub1PageName[
                                                              ind
                                                            ]?.includes(
                                                              option.answer
                                                            ) || false
                                                          }
                                                          onChange={(e) => {
                                                            handleSub1PageChange(
                                                              e,
                                                              ind
                                                            );
                                                            handleRadioButtonChangeSub1(
                                                              item,
                                                              index,
                                                              ind,
                                                              e,
                                                              ind === 0
                                                                ? autoSubquestion.replace(
                                                                  /\d+/,
                                                                  (match) =>
                                                                    Number(
                                                                      match
                                                                    ) + 1
                                                                )
                                                                : autoSubquestion.replace(
                                                                  /\d+/,
                                                                  (match) =>
                                                                    Number(
                                                                      match
                                                                    ) +
                                                                    (ind + 1)
                                                                )
                                                            );
                                                          }}
                                                          value={option.answer}
                                                        />
                                                      }
                                                      label={selectedLanguage?.value === "English" ? `${option?.answer}` : `${option?.tamilanswer || option?.answer}`}
                                                    />
                                                  )
                                                )}
                                              </FormGroup>
                                            </FormControl>
                                          </Grid>
                                        </Grid>
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  </>
                                );
                              } else if (item?.type === "TextBox") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          handleRadioSub1Page(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            e.target.value,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Text-Alpha") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer In Alphabets"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          const textOnly =
                                            e.target.value.replace(
                                              /[^a-zA-Z\s;]/g,
                                              ""
                                            );
                                          handleRadioSub1Page(textOnly, ind);
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            textOnly,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Text-Numeric") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Answer In Numbers"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          const numericOnly =
                                            e.target.value.replace(
                                              /[^0-9.;\s]/g,
                                              ""
                                            );
                                          handleRadioSub1Page(numericOnly, ind);
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            numericOnly,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type === "Date") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          handleRadioSub1Page(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            e.target.value,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              } else if (item?.type == "Date Range") {
                                return (
                                  <List
                                    component="nav"
                                    aria-label="quiz question"
                                  >
                                    <Paper style={paper1}>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            style={typography1}
                                            variant="h6"
                                          >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                        </ListItemText>
                                      </ListItem>
                                    </Paper>
                                    <ListItem>
                                      {item && item.uploadedimage && (
                                        <img
                                          src={item.uploadedimage}
                                          alt="Uploaded Image"
                                          style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: "0 0",
                                            borderRadius: "8px",
                                            boxShadow:
                                              "0 2px 4px rgba(0, 0, 0, 0.1)",
                                          }}
                                        />
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText>
                                        <Typography
                                          variant="h6"
                                          style={{ marginLeft: "-12px" }}
                                        >
                                          {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                        </Typography>
                                      </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <br />

                                    <List style={list1}>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        placeholder="Please Enter Answer"
                                        style={textboxstyle}
                                        value={selectedRadioSub1Page[ind]}
                                        onChange={(e) => {
                                          handleRadioSub1Page(
                                            e.target.value,
                                            ind
                                          );
                                          handleRadioButtonChangeSub1(
                                            item,
                                            index,
                                            ind,
                                            e.target.value,
                                            ind === 0
                                              ? autoSubquestion.replace(
                                                /\d+/,
                                                (match) => Number(match) + 1
                                              )
                                              : autoSubquestion.replace(
                                                /\d+/,
                                                (match) =>
                                                  Number(match) + (ind + 1)
                                              )
                                          );
                                        }}
                                      />
                                    </List>
                                    <br />
                                    <Divider />
                                  </List>
                                );
                              }
                            })}
                        </List>
                      );
                    } else if (data?.type === "MultipleChoice") {
                      return (
                        <>
                          <List component="nav" aria-label="quiz question">
                            <ListItem
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Grid
                                container
                                spacing={2}
                                style={{
                                  marginBottom: "2%",
                                }}
                              >
                                <Grid item xs={12} md={5}>
                                  <Box style={box1}>
                                    <ListItemIcon>
                                      <InfoIcon
                                        style={{
                                          color: "black",
                                          fontSize: "2rem",
                                        }}
                                      />
                                    </ListItemIcon>
                                    <Box
                                      style={{
                                        color: "black",
                                        marginLeft: "5px",
                                      }}
                                    >{selectedLanguage?.value === "English" ? `Question No.${index + 1} of ${interviewGetForm?.length
                                      }` : `கேள்வி எண்.${index + 1} of ${interviewGetForm?.length
                                      }`}</Box>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={3}></Grid>
                                <TimerComponent />
                              </Grid>
                            </ListItem>
                            <Paper style={{ ...paper1, position: "relative" }}>
                              <ListItem>
                                <ListItemText
                                  primary={
                                    <Typography style={typography1} variant="h6">
                                      {`Q. ${selectedLanguage?.value === "English" ? data?.question : (data?.tamilquestion || data?.question)}`}
                                    </Typography>
                                  }
                                  secondary={
                                    (data?.tamilquestiondescription !== "" || data?.questiondescription !== "") && (
                                      <Typography variant="body2" style={{ fontSize: '0.8rem' }}>
                                        {selectedLanguage?.value === "English" ? data?.questiondescription : (data?.tamilquestiondescription || data?.questiondescription)}                                      </Typography>
                                    )
                                  }
                                />
                                {/* Language toggle + Additional Info button */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 1,
                                    padding: "8px 16px 4px",
                                    // borderTop: "1px solid #eee",
                                    marginTop: "4px",
                                  }}
                                >
                                  <RadioGroup
                                    row
                                    value={selectedLanguage?.value}
                                    onChange={(e) =>
                                      handleChange({ value: e.target.value, label: e.target.value })
                                    }
                                  >
                                    <FormControlLabel
                                      value="English"
                                      control={<Radio size="small" />}
                                      label="English"
                                    />
                                    <FormControlLabel
                                      value="Tamil"
                                      control={<Radio size="small" />}
                                      label="Tamil"
                                    />
                                  </RadioGroup>

                                  <Button
                                    onClick={() => setAdditionalOpen(true)}
                                    sx={{
                                      fontSize: "0.75rem",
                                      padding: "4px 8px",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    Additional Information
                                  </Button>
                                </Box>
                                {/* <Button
                                  onClick={() => setAdditionalOpen(true)}
                                  sx={additionalInfoStyle}
                                >
                                  Additional Information
                                </Button> */}
                              </ListItem>
                            </Paper>
                            <ListItem>
                              {data && data.uploadedimage && (
                                <img
                                  src={data.uploadedimage}
                                  alt="Uploaded Image"
                                  style={{
                                    maxWidth: "100%",
                                    height: "auto",
                                    display: "block",
                                    margin: "0 0",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                  }}
                                />
                              )}
                            </ListItem>
                            <ListItem>
                              <ListItemText>
                                <Typography
                                  variant="h6"
                                  style={{ marginLeft: "-12px" }}
                                >
                                  {selectedLanguage?.value === "English" ? "Multiple Choice:" : "பல தேர்வு:"}
                                </Typography>
                              </ListItemText>
                            </ListItem>
                            <Divider />
                            <br />

                            <List style={list1}>
                              <Grid
                                container
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  // border: "1px solid red",
                                }}
                              >
                                <Grid items lg={6} md={6} sx={12} sm={12}>
                                  <FormControl component="fieldset">
                                    <FormGroup>
                                      {data?.optionArr?.map((option) => (
                                        <FormControlLabel
                                          key={option._id}
                                          control={
                                            <Checkbox
                                              checked={data?.userans?.includes(
                                                option.options
                                              )}
                                              onChange={(e) => {
                                                handleRadioButtonChange(
                                                  data,
                                                  index,
                                                  e
                                                );
                                              }}
                                              value={option.options}
                                            />
                                          }
                                          label={selectedLanguage?.value === "English" ? `${option?.options}` : `${option?.tamiloptions || option?.options}`}
                                        />
                                      ))}
                                    </FormGroup>
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </List>
                            <br />
                            <Divider />
                            <br />
                            {/* Seocndary Todo from Primary Questions */}

                            {secondaryTodo?.length > 0 &&
                              secondaryTodo?.map((item, ind) => {
                                if (
                                  item.type === "Radio" ||
                                  item.type === "Yes/No" ||
                                  item.type === "Correct/In Correct"
                                ) {
                                  return (
                                    <>
                                      <br />
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please choose one of the following answers:" : "பின்வரும் பதில்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />
                                      <List style={list1}>
                                        <RadioGroup
                                          aria-labelledby="demo-radio-buttons-group-label"
                                          name="radio-buttons-group"
                                          value={selectedRadioSecondary[ind]}
                                          onChange={(e) => {
                                            handleRadioSecondary(
                                              e.target.value,
                                              ind
                                            );
                                            handleRadioButtonChangeSecondary(
                                              item,
                                              index,
                                              ind,
                                              e.target.value
                                            );
                                          }}
                                        >
                                          {item?.optionslist?.map((item, i) => (
                                            <FormControlLabel
                                              key={i}
                                              value={`${item?.answer}`}
                                              control={<Radio />}
                                              label={selectedLanguage?.value === "English" ? `${item?.answer}` : `${item?.tamilanswer || item?.answer}`}
                                              style={{ marginLeft: "10px" }}
                                            />
                                          ))}
                                        </RadioGroup>
                                      </List>
                                      <br />
                                      <Divider />
                                    </>
                                  );
                                } else if (item?.type === "MultipleChoice") {
                                  return (
                                    <>
                                      <List
                                        component="nav"
                                        aria-label="quiz question"
                                      >
                                        <Paper style={paper1}>
                                          <ListItem>
                                            <ListItemText>
                                              <Typography
                                                style={{
                                                  fontSize: "18px",
                                                  fontWeight: "600",
                                                  fontFamily:
                                                    "Arial, Helvetica, sans-serif",
                                                }}
                                                variant="h6"
                                              >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                            </ListItemText>
                                          </ListItem>
                                        </Paper>
                                        <ListItem>
                                          {item && item.uploadedimage && (
                                            <img
                                              src={item.uploadedimage}
                                              alt="Uploaded Image"
                                              style={{
                                                maxWidth: "100%",
                                                height: "auto",
                                                display: "block",
                                                margin: "0 0",
                                                borderRadius: "8px",
                                                boxShadow:
                                                  "0 2px 4px rgba(0, 0, 0, 0.1)",
                                              }}
                                            />
                                          )}
                                        </ListItem>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              variant="h6"
                                              style={{ marginLeft: "-12px" }}
                                            >
                                              {selectedLanguage?.value === "English" ? "Multiple Choice:" : "பல தேர்வு:"}
                                            </Typography>
                                          </ListItemText>
                                        </ListItem>
                                        <Divider />
                                        <br />

                                        <List style={list1}>
                                          <Grid
                                            container
                                            style={{
                                              width: "100%",
                                              boxSizing: "border-box",
                                              // border: "1px solid red",
                                            }}
                                          >
                                            <Grid
                                              items
                                              lg={6}
                                              md={6}
                                              sx={12}
                                              sm={12}
                                            >
                                              <FormControl component="fieldset">
                                                <FormGroup>
                                                  {item?.optionslist?.map(
                                                    (option) => (
                                                      <FormControlLabel
                                                        key={option._id}
                                                        control={
                                                          <Checkbox
                                                            checked={
                                                              selectedSecondaryName[
                                                                ind
                                                              ]?.includes(
                                                                option.answer
                                                              ) || false
                                                            }
                                                            onChange={(e) => {
                                                              handleSecondaryNameChange(
                                                                e,
                                                                ind
                                                              );
                                                              handleRadioButtonChangeSecondary(
                                                                item,
                                                                index,
                                                                ind,
                                                                e
                                                              );
                                                            }}
                                                            value={
                                                              option.answer
                                                            }
                                                          />
                                                        }
                                                        label={selectedLanguage?.value === "English" ? `${option?.answer}` : `${option?.tamilanswer || option?.answer}`}
                                                      />
                                                    )
                                                  )}
                                                </FormGroup>
                                              </FormControl>
                                            </Grid>
                                          </Grid>
                                        </List>
                                        <br />
                                        <Divider />
                                      </List>
                                    </>
                                  );
                                } else if (item?.type === "TextBox") {
                                  return (
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          placeholder="Please Enter Answer"
                                          style={textboxstyle}
                                          value={selectedRadioSecondary[ind]}
                                          onChange={(e) => {
                                            handleRadioSecondary(
                                              e.target.value,
                                              ind
                                            );
                                            handleRadioButtonChangeSecondary(
                                              item,
                                              index,
                                              ind,
                                              e.target.value
                                            );
                                          }}
                                        />
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  );
                                } else if (item?.type === "Text-Alpha") {
                                  return (
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          placeholder="Please Enter Answer In Alphabets"
                                          style={textboxstyle}
                                          value={selectedRadioSecondary[ind]}
                                          onChange={(e) => {
                                            const textOnly =
                                              e.target.value.replace(
                                                /[^a-zA-Z\s;]/g,
                                                ""
                                              );
                                            handleRadioSecondary(textOnly, ind);
                                            handleRadioButtonChangeSecondary(
                                              item,
                                              index,
                                              ind,
                                              textOnly
                                            );
                                          }}
                                        />
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  );
                                } else if (item?.type === "Text-Numeric") {
                                  return (
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          placeholder="Please Enter Answer In Number"
                                          style={textboxstyle}
                                          value={selectedRadioSecondary[ind]}
                                          onChange={(e) => {
                                            const numericOnly =
                                              e.target.value.replace(
                                                /[^0-9.;\s]/g,
                                                ""
                                              );
                                            handleRadioSecondary(
                                              numericOnly,
                                              ind
                                            );
                                            handleRadioButtonChangeSecondary(
                                              item,
                                              index,
                                              ind,
                                              numericOnly
                                            );
                                          }}
                                        />
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  );
                                } else if (item?.type === "Date") {
                                  return (
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="date"
                                          placeholder="Please Enter Answer"
                                          style={textboxstyle}
                                          value={selectedRadioSecondary[ind]}
                                          onChange={(e) => {
                                            handleRadioSecondary(
                                              e.target.value,
                                              ind
                                            );
                                            handleRadioButtonChangeSecondary(
                                              item,
                                              index,
                                              ind,
                                              e.target.value
                                            );
                                          }}
                                        />
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  );
                                } else if (item?.type == "Date Range") {
                                  return (
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="date"
                                          placeholder="Please Enter Answer"
                                          style={textboxstyle}
                                          value={selectedRadioSecondary[ind]}
                                          onChange={(e) => {
                                            handleRadioSecondary(
                                              e.target.value,
                                              ind
                                            );
                                            handleRadioButtonChangeSecondary(
                                              item,
                                              index,
                                              ind,
                                              e.target.value
                                            );
                                          }}
                                        />
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  );
                                }
                              })}
                            {/* SubQuestions 1 Todo from Seocndary Questions */}

                            {sub1todo?.length > 0 &&
                              sub1todo?.map((item, ind) => {
                                if (
                                  item?.type === "Radio" ||
                                  item.type === "Yes/No" ||
                                  item.type === "Correct/In Correct"
                                ) {
                                  return (
                                    <>
                                      <br />
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please choose one of the following answers:" : "பின்வரும் பதில்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />
                                      <List style={list1}>
                                        <RadioGroup
                                          aria-labelledby="demo-radio-buttons-group-label"
                                          name="radio-buttons-group"
                                          value={selectedRadioSub1Page[ind]}
                                          onChange={(e) => {
                                            handleRadioSub1Page(
                                              e.target.value,
                                              ind
                                            );
                                            handleRadioButtonChangeSub1(
                                              item,
                                              index,
                                              ind,
                                              e.target.value,
                                              ind === 0
                                                ? autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) => Number(match) + 1
                                                )
                                                : autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) =>
                                                    Number(match) + (ind + 1)
                                                )
                                            );
                                          }}
                                        >
                                          {item?.optionslist?.map((item, i) => (
                                            <FormControlLabel
                                              key={i}
                                              value={`${item?.answer}`}
                                              control={<Radio />}
                                              label={selectedLanguage?.value === "English" ? `${item?.answer}` : `${item?.tamilanswer || item?.answer}`}
                                              style={{ marginLeft: "10px" }}
                                            />
                                          ))}
                                        </RadioGroup>
                                      </List>
                                      <br />
                                      <Divider />
                                    </>
                                  );
                                } else if (item?.type === "MultipleChoice") {
                                  return (
                                    <>
                                      <List
                                        component="nav"
                                        aria-label="quiz question"
                                      >
                                        <Paper style={paper1}>
                                          <ListItem>
                                            <ListItemText>
                                              <Typography
                                                style={{
                                                  fontSize: "18px",
                                                  fontWeight: "600",
                                                  fontFamily:
                                                    "Arial, Helvetica, sans-serif",
                                                }}
                                                variant="h6"
                                              >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                            </ListItemText>
                                          </ListItem>
                                        </Paper>
                                        <ListItem>
                                          {item && item.uploadedimage && (
                                            <img
                                              src={item.uploadedimage}
                                              alt="Uploaded Image"
                                              style={{
                                                maxWidth: "100%",
                                                height: "auto",
                                                display: "block",
                                                margin: "0 0",
                                                borderRadius: "8px",
                                                boxShadow:
                                                  "0 2px 4px rgba(0, 0, 0, 0.1)",
                                              }}
                                            />
                                          )}
                                        </ListItem>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              variant="h6"
                                              style={{ marginLeft: "-12px" }}
                                            >
                                              {selectedLanguage?.value === "English" ? "Multiple Choice:" : "பல தேர்வு:"}
                                            </Typography>
                                          </ListItemText>
                                        </ListItem>
                                        <Divider />
                                        <br />

                                        <List style={list1}>
                                          <Grid
                                            container
                                            style={{
                                              width: "100%",
                                              boxSizing: "border-box",
                                              // border: "1px solid red",
                                            }}
                                          >
                                            <Grid
                                              items
                                              lg={6}
                                              md={6}
                                              sx={12}
                                              sm={12}
                                            >
                                              <FormControl component="fieldset">
                                                <FormGroup>
                                                  {item?.optionslist?.map(
                                                    (option) => (
                                                      <FormControlLabel
                                                        key={option._id}
                                                        control={
                                                          <Checkbox
                                                            checked={
                                                              selectedSub1PageName[
                                                                ind
                                                              ]?.includes(
                                                                option.answer
                                                              ) || false
                                                            }
                                                            onChange={(e) => {
                                                              handleSub1PageChange(
                                                                e,
                                                                ind
                                                              );
                                                              handleRadioButtonChangeSub1(
                                                                item,
                                                                index,
                                                                ind,
                                                                e,
                                                                ind === 0
                                                                  ? autoSubquestion.replace(
                                                                    /\d+/,
                                                                    (match) =>
                                                                      Number(
                                                                        match
                                                                      ) + 1
                                                                  )
                                                                  : autoSubquestion.replace(
                                                                    /\d+/,
                                                                    (match) =>
                                                                      Number(
                                                                        match
                                                                      ) +
                                                                      (ind +
                                                                        1)
                                                                  )
                                                              );
                                                            }}
                                                            value={
                                                              option.answer
                                                            }
                                                          />
                                                        }
                                                        label={selectedLanguage?.value === "English" ? `${option?.answer}` : `${option?.tamilanswer || option?.answer}`}
                                                      />
                                                    )
                                                  )}
                                                </FormGroup>
                                              </FormControl>
                                            </Grid>
                                          </Grid>
                                        </List>
                                        <br />
                                        <Divider />
                                      </List>
                                    </>
                                  );
                                } else if (item?.type === "TextBox") {
                                  return (
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          placeholder="Please Enter Answer"
                                          style={textboxstyle}
                                          value={selectedRadioSub1Page[ind]}
                                          onChange={(e) => {
                                            handleRadioSub1Page(
                                              e.target.value,
                                              ind
                                            );
                                            handleRadioButtonChangeSub1(
                                              item,
                                              index,
                                              ind,
                                              e.target.value,
                                              ind === 0
                                                ? autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) => Number(match) + 1
                                                )
                                                : autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) =>
                                                    Number(match) + (ind + 1)
                                                )
                                            );
                                          }}
                                        />
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  );
                                } else if (item?.type === "Text-Alpha") {
                                  return (
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          placeholder="Please Enter Answer In Alphabets"
                                          style={textboxstyle}
                                          value={selectedRadioSub1Page[ind]}
                                          onChange={(e) => {
                                            const textOnly =
                                              e.target.value.replace(
                                                /[^a-zA-Z\s;]/g,
                                                ""
                                              );
                                            handleRadioSub1Page(textOnly, ind);
                                            handleRadioButtonChangeSub1(
                                              item,
                                              index,
                                              ind,
                                              textOnly,
                                              ind === 0
                                                ? autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) => Number(match) + 1
                                                )
                                                : autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) =>
                                                    Number(match) + (ind + 1)
                                                )
                                            );
                                          }}
                                        />
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  );
                                } else if (item?.type === "Text-Numeric") {
                                  return (
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please Fill The Below Text Box:" : "கீழே உள்ள உரை பெட்டியை நிரப்பவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          placeholder="Please Enter Answer In Numbers"
                                          style={textboxstyle}
                                          value={selectedRadioSub1Page[ind]}
                                          onChange={(e) => {
                                            const numericOnly =
                                              e.target.value.replace(
                                                /[^0-9.;\s]/g,
                                                ""
                                              );
                                            handleRadioSub1Page(
                                              numericOnly,
                                              ind
                                            );
                                            handleRadioButtonChangeSub1(
                                              item,
                                              index,
                                              ind,
                                              numericOnly,
                                              ind === 0
                                                ? autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) => Number(match) + 1
                                                )
                                                : autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) =>
                                                    Number(match) + (ind + 1)
                                                )
                                            );
                                          }}
                                        />
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  );
                                } else if (item?.type === "Date") {
                                  return (
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="date"
                                          placeholder="Please Enter Answer"
                                          style={textboxstyle}
                                          value={selectedRadioSub1Page[ind]}
                                          onChange={(e) => {
                                            handleRadioSub1Page(
                                              e.target.value,
                                              ind
                                            );
                                            handleRadioButtonChangeSub1(
                                              item,
                                              index,
                                              ind,
                                              e.target.value,
                                              ind === 0
                                                ? autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) => Number(match) + 1
                                                )
                                                : autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) =>
                                                    Number(match) + (ind + 1)
                                                )
                                            );
                                          }}
                                        />
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  );
                                } else if (item?.type == "Date Range") {
                                  return (
                                    <List
                                      component="nav"
                                      aria-label="quiz question"
                                    >
                                      <Paper style={paper1}>
                                        <ListItem>
                                          <ListItemText>
                                            <Typography
                                              style={typography1}
                                              variant="h6"
                                            >{`Q. ${selectedLanguage?.value === "English" ? item?.question : (item?.tamilquestion || item?.question)}`}</Typography>
                                          </ListItemText>
                                        </ListItem>
                                      </Paper>
                                      <ListItem>
                                        {item && item.uploadedimage && (
                                          <img
                                            src={item.uploadedimage}
                                            alt="Uploaded Image"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                              display: "block",
                                              margin: "0 0",
                                              borderRadius: "8px",
                                              boxShadow:
                                                "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        )}
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText>
                                          <Typography
                                            variant="h6"
                                            style={{ marginLeft: "-12px" }}
                                          >
                                            {selectedLanguage?.value === "English" ? "Please Select Any Date:" : "தயவுசெய்து எந்த தேதியையும் தேர்ந்தெடுக்கவும்:"}
                                          </Typography>
                                        </ListItemText>
                                      </ListItem>
                                      <Divider />
                                      <br />

                                      <List style={list1}>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="date"
                                          placeholder="Please Enter Answer"
                                          style={textboxstyle}
                                          value={selectedRadioSub1Page[ind]}
                                          onChange={(e) => {
                                            handleRadioSub1Page(
                                              e.target.value,
                                              ind
                                            );
                                            handleRadioButtonChangeSub1(
                                              item,
                                              index,
                                              ind,
                                              e.target.value,
                                              ind === 0
                                                ? autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) => Number(match) + 1
                                                )
                                                : autoSubquestion.replace(
                                                  /\d+/,
                                                  (match) =>
                                                    Number(match) + (ind + 1)
                                                )
                                            );
                                          }}
                                        />
                                      </List>
                                      <br />
                                      <Divider />
                                    </List>
                                  );
                                }
                              })}
                          </List>
                        </>
                      );
                    }
                  }
                })}
              <br />

              {interviewGetForm?.length > 0 &&
                userName !== "" &&
                password !== "" &&
                startStatus &&
                true && (
                  <>
                    {indexViewQuest < interviewGetForm?.length - 1 && (
                      <Box sx={{
                        display: "flex",
                        justifyContent: indexViewQuest !== 0 ? "space-between" : "flex-end",
                        gap: 2,
                      }}>
                        {interviewGetForm?.length > 0 &&
                          userName !== "" &&
                          password !== "" &&
                          startStatus && (
                            <>
                              {indexViewQuest !== 0 && interviewGetForm?.length > 0 && (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  startIcon={<ChevronLeftIcon />}
                                  onClick={() => {
                                    handlePreviousButton();
                                  }}
                                >
                                  Prev
                                </Button>
                              )}

                            </>
                          )}
                        <Box sx={{ display: "flex", gap: 2 }}>

                          {interviewGetForm[indexViewQuest]?.questionpreference === "Ignore" &&
                            <Button
                              variant="outlined"
                              color="secondary"
                              startIcon={<BlockIcon />}  // or whichever icon you prefer
                              onClick={(e) => {
                                // Add your ignore functionality here
                                handleIgnore("next", e);

                              }}
                            >
                              Ignore
                            </Button>}
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ChevronRightIcon />}
                            onClick={() => {

                              let primaryAnswer = interviewGetForm[indexViewQuest]?.userans;
                              let firstCheckArray = Array.isArray(primaryAnswer) && primaryAnswer?.length === 0;
                              let firstCheckStr = ((typeof primaryAnswer) === "string") && (primaryAnswer === "");



                              let secondaryAnswer = (interviewGetForm[indexViewQuest]?.secondarytodo?.length > 0 && secondaryTodo?.length > 0) ? interviewGetForm[indexViewQuest]?.secondarytodo[0]?.userans : "";
                              let secondaryCheckArray = secondaryTodo?.length > 0 && Array.isArray(secondaryAnswer) && secondaryAnswer?.length === 0;
                              let secondaryCheckStr = secondaryTodo?.length > 0 && ((typeof secondaryAnswer) === "string") && (secondaryAnswer === "");

                              let secondaryLoopAnswer = (interviewGetForm[indexViewQuest]?.secondarytodo?.length > 0 && sub1todo?.length > 0) ? interviewGetForm[indexViewQuest]?.secondarytodo[sub1todo?.length]?.userans : "";
                              let secondaryLoopCheckArray = sub1todo?.length > 0 && Array.isArray(secondaryLoopAnswer) && secondaryLoopAnswer?.length === 0;
                              let secondaryLoopCheckStr = sub1todo?.length > 0 && ((typeof secondaryLoopAnswer) === "string") && (secondaryLoopAnswer === "");

                              if (((!primaryAnswer || firstCheckArray || firstCheckStr))) {
                                // setShowEmptyAlert();
                                console.log("log1")
                                handleClickOpenerrEmpty();
                                return;
                              }
                              else if (((secondaryTodo?.length > 0 && secondaryAnswer === "") || secondaryCheckArray || secondaryCheckStr)) {
                                console.log("log2")
                                handleClickOpenerrEmpty();
                                return;
                              }
                              else if (((sub1todo?.length > 0 && secondaryLoopAnswer === "") || secondaryLoopCheckArray || secondaryLoopCheckStr)) {
                                console.log("log3")
                                handleClickOpenerrEmpty();
                                return;
                              }
                              if (interviewGetForm[indexViewQuest]?.informreason) {
                                let cuurQuest = interviewGetForm[indexViewQuest]
                                let descriptions = (cuurQuest?.type === "Date" || cuurQuest?.type === "Date Range") ? cuurQuest?.datedescription : cuurQuest?.optionArr?.some(data => data?.options === "NOANSWER") ? `Eligible:${cuurQuest?.optionArr[0]?.description}` : Array.isArray(cuurQuest?.userans) ? cuurQuest?.optionArr?.filter(item => cuurQuest?.userans?.includes(item.options))?.map(data => `${data.status}:${data?.description}`)?.join(",") : cuurQuest?.optionArr?.filter(item => cuurQuest?.userans === item.options)?.map(data => `${data.status}:${data?.description}`)?.join(",");
                                setShowDescFinalAlert(
                                  <>
                                    <ErrorOutlineOutlinedIcon
                                      sx={{ fontSize: "100px", color: "orange" }}
                                    />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`${descriptions} - ${interviewGetForm[indexViewQuest]?.informreason}`}</p>
                                  </>
                                );
                                handleClickOpenerrDescFinal();
                              } else {
                                handleConditionCheck();
                              }
                            }}
                          >
                            Next
                          </Button>
                        </Box>
                      </Box>
                    )}
                    {indexViewQuest >= interviewGetForm?.length - 1 && (

                      <Box sx={{
                        display: "flex",
                        justifyContent: indexViewQuest !== 0 ? "space-between" : "flex-end",
                        gap: 2,
                      }}>
                        {interviewGetForm?.length > 0 &&
                          userName !== "" &&
                          password !== "" &&
                          startStatus && (
                            <>
                              {indexViewQuest !== 0 && interviewGetForm?.length > 0 && (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  startIcon={<ChevronLeftIcon />}
                                  onClick={() => {
                                    handlePreviousButton();
                                  }}
                                >
                                  Prev
                                </Button>
                              )}

                            </>
                          )}
                        <Box sx={{ display: "flex", gap: 2 }}>

                          {interviewGetForm[indexViewQuest]?.questionpreference === "Ignore" &&
                            <Button
                              variant="outlined"
                              color="secondary"
                              startIcon={<BlockIcon />}  // or whichever icon you prefer
                              onClick={(e) => {
                                // Add your ignore functionality here
                                handleIgnore("submit", e);

                              }}
                            >
                              Ignore
                            </Button>}
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ChevronRightIcon />}
                            sx={{ float: "right" }}
                            onClick={(e) => {

                              let primaryAnswer = interviewGetForm[indexViewQuest]?.userans;
                              let firstCheckArray = Array.isArray(primaryAnswer) && primaryAnswer?.length === 0;
                              let firstCheckStr = ((typeof primaryAnswer) === "string") && (primaryAnswer === "");



                              let secondaryAnswer = (interviewGetForm[indexViewQuest]?.secondarytodo?.length > 0 && secondaryTodo?.length > 0) ? interviewGetForm[indexViewQuest]?.secondarytodo[0]?.userans : "";
                              let secondaryCheckArray = secondaryTodo?.length > 0 && Array.isArray(secondaryAnswer) && secondaryAnswer?.length === 0;
                              let secondaryCheckStr = secondaryTodo?.length > 0 && ((typeof secondaryAnswer) === "string") && (secondaryAnswer === "");

                              let secondaryLoopAnswer = (interviewGetForm[indexViewQuest]?.secondarytodo?.length > 0 && sub1todo?.length > 0) ? interviewGetForm[indexViewQuest]?.secondarytodo[sub1todo?.length]?.userans : "";
                              let secondaryLoopCheckArray = sub1todo?.length > 0 && Array.isArray(secondaryLoopAnswer) && secondaryLoopAnswer?.length === 0;
                              let secondaryLoopCheckStr = sub1todo?.length > 0 && ((typeof secondaryLoopAnswer) === "string") && (secondaryLoopAnswer === "");

                              if (((!primaryAnswer || firstCheckArray || firstCheckStr))) {
                                // setShowEmptyAlert();
                                console.log("log1")
                                handleClickOpenerrEmpty();
                                return;
                              }
                              else if (((secondaryTodo?.length > 0 && secondaryAnswer === "") || secondaryCheckArray || secondaryCheckStr)) {
                                console.log("log2")
                                handleClickOpenerrEmpty();
                                return;
                              }
                              else if (((sub1todo?.length > 0 && secondaryLoopAnswer === "") || secondaryLoopCheckArray || secondaryLoopCheckStr)) {
                                console.log("log3")
                                handleClickOpenerrEmpty();
                                return;
                              }

                              if (interviewGetForm[indexViewQuest]?.informreason) {
                                let cuurQuest = interviewGetForm[indexViewQuest]
                                let descriptions = (cuurQuest?.type === "Date" || cuurQuest?.type === "Date Range") ? cuurQuest?.datedescription : cuurQuest?.optionArr?.some(data => data?.options === "NOANSWER") ? `Eligible:${cuurQuest?.optionArr[0]?.description}` : Array.isArray(cuurQuest?.userans) ? cuurQuest?.optionArr?.filter(item => cuurQuest?.userans?.includes(item.options))?.map(data => `${data.status}:${data?.description}`)?.join(",") : cuurQuest?.optionArr?.filter(item => cuurQuest?.userans === item.options)?.map(data => `${data.status}:${data?.description}`)?.join(",");
                                setShowDescFinalAlert(
                                  <>
                                    <ErrorOutlineOutlinedIcon
                                      sx={{ fontSize: "100px", color: "orange" }}
                                    />
                                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{`${descriptions} - ${interviewGetForm[indexViewQuest]?.informreason}`}</p>
                                  </>
                                );
                                handleClickOpenerrDescFinal();
                              } else {
                                handleSubmit(e);
                              }
                            }}
                          >
                            Submit
                          </Button>
                        </Box>
                      </Box>

                    )}
                  </>
                )}

              {interviewGetForm?.length > 0 && !startStatus && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ChevronRightIcon />}
                    onClick={() => {
                      handleStart();
                    }}
                    sx={{ float: "right" }}
                  >
                    Start
                  </Button>
                  <br /> <br />
                </>
              )}
            </div>
          </div>
        </>

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
              <Button
                variant="contained"
                color="error"
                onClick={handleCloseerr}
              >
                ok
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
        {/* DESC ALERT DIALOG */}
        <Box>
          <Dialog
            open={isDescOpen}
            onClose={handleCloseerrDesc}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent
              sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
            >
              <Typography variant="h6">{showDescAlert}</Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={handleCloseerrDesc}
              >
                ok
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
        {/* FINAL DESC ALERT DIALOG */}
        <Box>
          <Dialog
            open={isDescFinalOpen}
            onClose={handleCloseerrDescFinal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent
              sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
            >
              <Typography variant="h6">{showDescFinalAlert}</Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={(e) => {
                  handleCloseerrDescFinal();
                  if (indexViewQuest < interviewGetForm?.length - 1) {

                    handleConditionCheck()
                  } else if (indexViewQuest >= interviewGetForm?.length - 1) {
                    handleSubmit(e)
                  }
                }}
              >
                ok
              </Button>
            </DialogActions>
          </Dialog>
        </Box>

        {/* Floating Icon Button */}
        {/* {interviewGetForm?.length > 0 && startStatus &&
            <Fab
              color="primary"
              aria-label="add"
              onClick={() => setAdditionalOpen(true)
              }
              sx={{ position: "fixed", bottom: 16, right: 16 }}
            >
              <Add />
            </Fab>
     
          } */}
        <ScreenshotInterviewRounds roundDetails={roundDetails} isUserRoleAccess={userData} />

        {/* Popup Dialog */}
        <Dialog open={additionalOpen} onClose={() => setAdditionalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Additional Information for this Question
            <Button
              onClick={() => {
                setAdditionalOpen(false);
                setInterviewGetForm(prevForm =>
                  prevForm.map((item, index) =>
                    index === indexViewQuest ? { ...item, additionalinformation: "" } : item
                  )
                )
              }}
              sx={{ position: "absolute", right: 8, top: 8, minWidth: "auto" }}
            >
              <Close />
            </Button>
          </DialogTitle>
          <br />
          <DialogContent>
            <TextField
              label="Enter additional details..."
              multiline
              fullWidth
              minRows={3}
              variant="outlined"
              // value={additionalInfo}
              value={interviewGetForm[indexViewQuest]?.additionalinformation || ""}
              onChange={(e) =>
                setInterviewGetForm(prevForm =>
                  prevForm.map((item, index) =>
                    index === indexViewQuest ? { ...item, additionalinformation: e.target.value } : item
                  )
                )

              }
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setAdditionalOpen(false)} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* EMPTY ALERT DIALOG */}
        <Box>
          <Dialog
            open={isEmptyOpen}
            onClose={handleCloseerrEmpty}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent
              sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
            >
              <Typography variant="h6">{showEmptyAlert}</Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={handleCloseerrEmpty}
              >
                ok
              </Button>
            </DialogActions>
          </Dialog>
        </Box>


        {/* view model */}
        <Dialog
          open={openview}
          onClose={handleClickOpenview}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          sx={{ marginTop: "50px" }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Designation Requirement Page
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={4} sm={12} xs={12}>
                <InputLabel>
                  {" "}
                  <b>Designation </b>
                </InputLabel>
                <Typography>{designationReqView.designation}</Typography>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <InputLabel>
                  {" "}
                  <b>Department </b>
                </InputLabel>
                <Typography>{designationReqView.department}</Typography>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <InputLabel>
                  {" "}
                  <b>Language</b>
                </InputLabel>
                <Typography>{designationReqView.language}</Typography>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <InputLabel>
                  {" "}
                  <b>Skill </b>
                </InputLabel>
                <Typography>{designationReqView.skill}</Typography>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <InputLabel>
                  {" "}
                  <b>Reconsideration Days </b>
                </InputLabel>
                <Typography>{designationReqView?.dayscount}</Typography>
              </Grid>
              <br /> <br />
              <Grid item md={12} xs={12} sm={12}>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <InputLabel>
                      <b>Education</b>
                    </InputLabel>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <InputLabel>
                      {" "}
                      <b>Category</b>
                    </InputLabel>
                    <Typography>{designationReqView.category + ","}</Typography>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <InputLabel>
                      {" "}
                      <b>Sub Category</b>
                    </InputLabel>
                    <Typography>
                      {designationReqView.subcategory + ","}
                    </Typography>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <InputLabel>
                      {" "}
                      <b>Specialization</b>
                    </InputLabel>
                    <Typography>{designationReqView.education + ","}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid item md={4} xs={12} sm={12}>
                <InputLabel>
                  <b>Experience</b>
                </InputLabel>
                <Grid container spacing={1}>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>From</Typography>
                    <Grid item md={15} xs={12} sm={12}>
                      <Typography>{designationReqView.experiencefrom}</Typography>
                    </Grid>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>To</Typography>
                    <Grid item md={15} xs={12} sm={12}>
                      <Typography>{designationReqView.experienceto}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <InputLabel>
                  <b>Salary</b>
                </InputLabel>
                <Grid container spacing={1}>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>From</Typography>
                    <Grid item md={15} xs={12} sm={12}>
                      <Typography>{designationReqView.salaryfrom}</Typography>
                    </Grid>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>To</Typography>
                    <Grid item md={15} xs={12} sm={12}>
                      <Typography>{designationReqView.salaryto}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <InputLabel>
                  <b>Notice Period</b>
                </InputLabel>
                <Grid container spacing={1}>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>Extimate</Typography>
                    <Grid item md={15} xs={12} sm={12}>
                      <Typography>
                        {designationReqView.noticeperiodfrom}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>{`No.of ${designationReqView.noticeperiodfrom}s`}</Typography>
                    <Grid item md={15} xs={12} sm={12}>
                      <Typography>{designationReqView.noticeperiodto}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                lg={8}
                md={8}
                sm={{ display: "none" }}
                xs={{ display: "none" }}
              >
                {" "}
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <InputLabel>
                  {" "}
                  <b>Job Description </b>
                </InputLabel>
                <Typography>
                  {convertToNumberedList(designationReqView.jobdescription)}
                </Typography>{" "}
                <br />
                <br />
                <br />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <InputLabel>
                  {" "}
                  <b>Job Requirements </b>
                </InputLabel>
                <Typography>
                  {convertToNumberedList(designationReqView.jobrequirements)}
                </Typography>{" "}
                <br />
                <br />
                <br />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <InputLabel>
                  {" "}
                  <b>Job Benefits </b>
                </InputLabel>
                <Typography>
                  {convertToNumberedList(designationReqView.jobbenefits)}
                </Typography>{" "}
                <br />
                <br />
                <br />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <InputLabel>
                  {" "}
                  <b>Role And Responsibilities </b>
                </InputLabel>
                <Typography>
                  {convertToNumberedList(designationReqView.rolesandres)}
                </Typography>{" "}
                <br />
                <br />
                <br />
              </Grid>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseview}
              // sx={buttonStyles.btncancel}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </Box>
        </Dialog>
      </div>
      <br />
      <br />
    </div>
  );
}

export default InterviewFormHr;
