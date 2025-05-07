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
  IconButton,
  InputAdornment,
  FormGroup,
  Checkbox,
  Backdrop,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Radio from "@mui/material/Radio";
import { handleApiError } from "../components/Errorhandling";
import InfoIcon from "@mui/icons-material/Info";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { MultiSelect } from "react-multi-select-component";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
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



import CandidateDocumentsApprovalPage from "./CandidateDocumentApprovalPage";
import LanguageIcon from '@mui/icons-material/Language';
import Select from "react-select";

function InterviewTestRound() {

  const [isDocumentOpen, setIsDocumentOpen] = useState(false);
  const handleClickOpenDocument = () => {
    setIsDocumentOpen(true);
  };
  const handleCloseDocument = () => {
    setIsDocumentOpen(false);
  };

  const [isLoading, setIsLoading] = useState(true);
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
  const languageOptions = [
    { value: "English", label: "English" },
    { value: "தமிழ்", label: "தமிழ்" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState({ value: 'English', label: 'English' }); // Default to English

  const handleChange = (selectedOption) => {
    setSelectedLanguage(selectedOption);

  };
  const idGen = useParams().id;
  const idGenCheck = useParams().idgen;
  const startedby = useParams()?.from;
  const mode = useParams()?.mode;
  const testcount = useParams()?.testcount;
  const candidateid = useParams()?.candidateid;
  const roundid = useParams()?.roundid;
  const autofill = useParams()?.autofill;

  useEffect(() => {
    if (autofill === "true") {
      autoFillCredentials();
    }
  }, [autofill]);

  const autoFillCredentials = async () => {
    try {
      let single_cand = await axios.get(
        `${SERVICE.CANDIDATES_SINGLE}/${candidateid}`
      );
      setUserName(single_cand.data.scandidates?.username);
      setPassword(single_cand.data.scandidates?.password);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

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
  const [prevButton, setPrevButton] = useState(true);
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

  useEffect(() => {
    if (testcount < 0) {
      testStatusUpdate(roundid, "Completed");
    } else if (testcount > 0) {
      testStatusUpdate(roundid, "Interview Scheduled");
    }
  }, [testcount, roundid]);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
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
      .filter((data) => data.userans)
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
          attendby: "Candidate",
        };
      });
    sendRequest(answer);
  };

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
  const handleSecondaryNameChange = (options, index) => {
    setSelectedSecondaryName((prevState) => {
      const updatedValues = [...prevState];
      updatedValues[index] = options; // Update the value at the specified index
      return updatedValues;
    });
  };
  const [selectedSub1PageName, setSelectedSub1PageName] = useState([]);
  const handleSub1PageChange = (options, index) => {
    setSelectedSub1PageName((prevState) => {
      const updatedValues = [...prevState];
      updatedValues[index] = options; // Update the value at the specified index
      return updatedValues;
    });
    // setSelectedSub1PageName(options);
  };

  //rendering function for options(value field with comma)
  const customValueRendererSubPage = (valueCate, _categories) => {
    return valueCate
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select ";
  };
  const customValueRendererSecondary = (valueCate, _categories) => {
    if (valueCate) {
      // Ensure valueCate is not undefined
      return valueCate?.map(({ label }) => label).join(", ");
    } else {
      return "Please Select";
    }
  };

  const customValueRendererSub1Page = (valueCate, _categories) => {
    if (valueCate) {
      return valueCate?.map(({ label }) => label).join(", ");
    } else {
      return "Please Select";
    }
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
        linkid: String(roundid),
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
      let byyy = startedby === "autologin" ? true : false;
      let subprojectscreate = await axios.put(
        `${SERVICE.UPDATE_INTERVIEWROUNDSTATUS}/${id}`,
        {
          roundstatus:
            remainingQuestionArray?.length > 0 && byyy
              ? "Hr Completed"
              : remainingQuestionArray?.length > 0 && !byyy
                ? "Candidate Completed"
                : "Completed",
          interviewForm: answer,
          totalmarks: String(totalMarks),
          eligiblemarks: String(eligibleMarks),
          // questiontype: valueSetInterview?.typetest,
          // questioncount: valueQuestCount
          //   ? Number(valueQuestCount.questioncount) +
          //     Number(valueSetInterview?.questioncount)
          //   : 0 + Number(valueSetInterview?.questioncount),
          // questioncountfrom: valueQuestCount
          //   ? Number(valueQuestCount.questioncountfrom) +
          //     (Number(valueQuestCount.questioncountto) -
          //       Number(valueQuestCount.questioncountfrom) +
          //       1)
          //   : valueSetInterview?.countfrom,
          // questioncountto: valueQuestCount
          //   ? Number(valueQuestCount.questioncountto) +
          //     (Number(valueQuestCount.questioncountto) -
          //       Number(valueQuestCount.questioncountfrom) +
          //       1)
          //   : valueSetInterview?.countto,
          questiontype: valueSetInterview?.typetest,
          questioncount: valueSetInterview?.questioncount,
          questioncountfrom: valueSetInterview?.countfrom,
          questioncountto: valueSetInterview?.countto,
          testcompletedat: new Date(),
          interviewFormLog: interviewFormLogArray
            ? [...interviewFormLogArray, answer]
            : [answer],
        }
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //add function
  const sendRequest = async (answer) => {
    try {
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

      backPage(`/interview/interviewendpage/test/${candidateid}/${roundid}`);
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
      handleCloseDocument();
      handleCloseTable();
      await interviewLogin();
    }
  };
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();

    let primaryAnswer = interviewGetForm[indexViewQuest]?.userans;
    let firstCheckArray = Array.isArray(primaryAnswer) && primaryAnswer?.length === 0;
    let firstCheckStr = ((typeof primaryAnswer) === "string") && (primaryAnswer === "");



    if ((mode !== "typingtest") && (!primaryAnswer || firstCheckArray || firstCheckStr)) {
      // setShowEmptyAlert();
      console.log("log1")
      handleClickOpenerrEmpty();
      return;
    }
    nextStep();
    const answer = interviewGetForm
      .filter((data) => data.userans)
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
          attendby: "Candidate",
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
  const [additionalOpen, setAdditionalOpen] = useState(false);
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
  const handleConditionCheck = (typetes) => {

    let primaryAnswer = interviewGetForm[indexViewQuest]?.userans;
    let firstCheckArray = Array.isArray(primaryAnswer) && primaryAnswer?.length === 0;
    let firstCheckStr = ((typeof primaryAnswer) === "string") && (primaryAnswer === "");



    if ((mode !== "typingtest") && (!primaryAnswer || firstCheckArray || firstCheckStr)) {
      // setShowEmptyAlert();
      console.log("log1")
      handleClickOpenerrEmpty();
      return;
    }

    const answer = interviewGetForm
      .filter((data) => data.userans)
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
    setQuote("");
    setStartTime(null);
    setIndexViewQuest(indexViewQuest + 1);
    // sendRequestNext(answer)
    setNextButton(false);
    setSub1todo([]);
    setSecondaryTodo([]);
    setSub2Todo([]);
    setSub3Todo([]);
    setSub4Todo([]);
    setSelectedSecondaryName([]);
    setSelectedSub1PageName([]);
    setSelectedSubPageName([]);
  };

  //add function
  const sendRequestNext = async (answer) => {
    try {
      let subprojectscreate = await axios.put(
        `${SERVICE.SINGLE_TRAINING_USER_RESPONSE}/${interviewGet?._id}`,
        {
          interviewForm: answer,
          testattended: "false",
          addedby: [
            {
              name: String(userName),
              date: String(new Date()),
            },
          ],
        }
      );
      // backPage("/task/training/master/traininguserpanel");
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const sendRequestStarted = async (id, idGen, roundid) => {
    try {
      //   let subprojectscreate = await axios.post(`${SERVICE.CREATE_USER_RESPONSE}`, {
      //     interviewForm: [],
      //     candidateid: id,
      //     candidateid: idGen,
      //     testattended: "false",
      //     addedby: [
      //       {
      //         name: String(userName),
      //         date: String(new Date()),
      //       },
      //     ],
      //   });
      // backPage("/task/training/master/traininguserpanel");
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const handleConditionCheckBack = (typetes) => {
    setQuote("");
    setStartTime(null);
    setNextButton(true);
    setIndexViewQuest(indexViewQuest - 1);
  };

  const [duration, setDuration] = useState("");
  const [durationInitial, setDurationInitial] = useState("");
  useEffect(() => {
    const storedDuration = localStorage.getItem("timerDuration");
    const storedFormData = localStorage.getItem("formFilled");
    if (storedDuration && storedFormData) {
      setDuration(storedDuration);
    } else {
      fetchInterviewGenerate();
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
      // phonenum !== ""
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

  const [interviewFormLogArray, setInterviewFormLogArray] = useState([]);
  const [retestCount, setRetestCount] = useState(0);
  const [retestFor, setRetestFor] = useState("");
  const [valueSetInterview, setValueSetInterview] = useState({});
  const [valueQuestCount, setValueQuestCount] = useState("");


  const convertToNumberedList = (htmlContent) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;

    const listItems = Array.from(tempElement.querySelectorAll("li"));
    listItems.forEach((li, index) => {
      li.innerHTML = `\u2022 ${li.innerHTML}\n`;
    });

    return tempElement.innerText;
  };

  const DetailItem = ({ label, value }) => (
    <Box sx={{ marginBottom: 2 }}>
      <Typography variant="subtitle2" fontWeight="bold">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: "#333" }}>
        {value || "-"}
      </Typography>
    </Box>
  );

  const [openTable, setOpenTable] = useState(false)
  const handleOpenTable = () => {
    setOpenTable(true)
  }
  const handleCloseTable = () => {
    setOpenTable(false)
  }

  const [canidateDetails, setCandidateDetails] = useState([]);
  const [singleDesignationRequirements, setSingleDesignationRequirements] = useState({});
  const getCandidateDetails = async () => {
    try {
      let single_cand = await axios.get(
        `${SERVICE.CANDIDATES_SINGLE}/${candidateid}`
      );

      let res_project = await axios.get(SERVICE.DESIGNATIONREQUIREMENTS);

      let res = await axios.get(`${SERVICE.JOBOPENING_SINGLE}/${single_cand.data?.scandidates?.jobopeningsid}`);

      let singleJobData = res?.data?.sjobopening;

      const itemsWithSerialNumber = res_project?.data?.designationreq;

      setSingleDesignationRequirements(itemsWithSerialNumber?.find(data => data?.designation === singleJobData?.designation) || {})
      setCandidateDetails(single_cand.data.scandidates);
      return { singleCandidate: single_cand.data.scandidates, singleJobData };
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [totalMarks, setTotalMarks] = useState(0);
  const [eligibleMarks, setEligibleMarks] = useState(0);
  //get all Sub vendormasters.
  const fetchInterviewGenerate = async () => {
    try {
      const [single_round, res_deptandteam, interQust, interQuestions] =
        await Promise.all([
          axios.post(`${SERVICE.INTERVIEW_ROUND}/${candidateid}/${roundid}`),
          axios.post(SERVICE.CANDIDATES, { jobopeningsid: idGenCheck }),
          axios.get(`${SERVICE.INTERVIEWQUESTIONGROUPING}`),
          axios.get(`${SERVICE.ALL_ONLINE_TEST_QUESTION}`),
        ]);
      let { singleCandidate, singleJobData } = await getCandidateDetails();
      let preanswer = res_deptandteam?.data?.allcandidate?.filter((data) => {
        return (
          data?.overallstatus ===
          single_round?.data?.interviewRound?.roundname &&
          data?.workmode === singleCandidate?.workmode &&
          data?.candidatestatusexp === singleCandidate?.candidatestatusexp &&
          data.interviewrounds?.some(
            (item) =>
              item.roundname ===
              single_round?.data?.interviewRound?.roundname &&
              item.roundstatus === "Completed"
          )
        );
      });
      let interviewFilter = single_round?.data?.interviewRound;

      let checkQuest = interQust?.data?.interviewgroupingquestion?.find(
        (data) =>
          singleJobData?.designation === data.designation &&
          interviewFilter?.roundname === data.round &&
          data.mode === "Online or Interview Test" &&
          interviewFilter?.testname === data.testname
      );


      // let intQuesAll = interQuestions?.data?.onlinetestquestions?.filter(
      //   (data) =>
      //     checkQuest?.category === data.category &&
      //     checkQuest?.subcategory?.includes(data.subcategory)
      // );

      const finalTotalQuestionCount =
        (checkQuest?.typetest === "Running" || checkQuest?.typetest === "Random")
          ? Number(checkQuest?.questioncount)
          : (Number(checkQuest?.countto) - Number(checkQuest?.countfrom) + 1);
      const subcategories = checkQuest?.subcategory ?? [];
      const totalSubcategories = subcategories.length;

      const baseCount = Math.floor(finalTotalQuestionCount / totalSubcategories);
      const remainder = finalTotalQuestionCount % totalSubcategories;

      let allPickedQuestions = [];
      let remainingNeeded = finalTotalQuestionCount;

      // Step 1: Try to get questions from each subcategory
      let availableQuestionsBySubcat = {};

      subcategories.forEach((subcat) => {
        const filtered = interQuestions?.data?.onlinetestquestions?.filter(
          (data) =>
            data.category === checkQuest.category &&
            data.subcategory === subcat
        );

        availableQuestionsBySubcat[subcat] = filtered ?? [];
      });

      // Step 2: Pick from each subcategory as per calculated count
      subcategories.forEach((subcat, index) => {
        const count = baseCount + (index < remainder ? 1 : 0);
        const available = availableQuestionsBySubcat[subcat] ?? [];

        if (available.length > 0) {
          const picked = available.sort(() => 0.5 - Math.random()).slice(0, count);
          allPickedQuestions.push(...picked);
          remainingNeeded -= picked.length;

          // Remove picked questions from pool to avoid reuse
          availableQuestionsBySubcat[subcat] = available.filter(
            (q) => !picked.includes(q)
          );
        }
      });

      // Step 3: Fill remaining slots from any subcategory that still has questions
      if (remainingNeeded > 0) {
        let extraPool = Object.values(availableQuestionsBySubcat).flat();
        extraPool = extraPool.sort(() => 0.5 - Math.random()); // shuffle

        allPickedQuestions.push(...extraPool.slice(0, remainingNeeded));
      }

      // Step 4: Make sure final count is exact
      const intQuesAll = allPickedQuestions.slice(0, finalTotalQuestionCount);

      // Check if both values exist
      const hasWorkMode = !!singleCandidate?.workmode;
      const hasStatusExp = !!singleCandidate?.candidatestatusexp;

      const sortedQuestion = intQuesAll?.filter((questionObj) => {


        const { workmode = [], candidatestatusexp = [] } = questionObj;

        if ((!hasWorkMode || !hasStatusExp) || (workmode?.length === 0 && candidatestatusexp?.length === 0) || singleCandidate?.workmode === "Please Select Work Mode" || singleCandidate?.candidatestatusexp === "Please Select Candidate Status") {          // If any required value is missing, return the question
          return true;
        }

        // Check if singleCandidate's values exist in intQues arrays
        return workmode.includes(singleCandidate.workmode) && candidatestatusexp.includes(singleCandidate.candidatestatusexp);
      });


      let totMarks = Number(intQuesAll?.length || "0");
      let eligMarks = Number(checkQuest?.questioncount || "0");
      let eqLen = intQuesAll?.length === sortedQuestion?.length;
      let lenDiff = intQuesAll?.length - sortedQuestion?.length;
      // Ensure values do not go negative
      let finalTotalMarks = Math.max(eqLen ? totMarks : (totMarks - lenDiff), 0);

      let totalQuestions = finalTotalMarks || 0;
      let percentage = totMarks > 0 ? (eligMarks / totMarks) * 100 : 0;
      let eligibleMark = totalQuestions > 0 ? Math.round((percentage / 100) * totalQuestions) : 0;
      let finalEligibleMarks = Math.max(eqLen ? eligMarks : eligibleMark, 0);

      let finalquestioncount = sortedQuestion?.length >= Number(checkQuest?.questioncount) ? Number(checkQuest?.questioncount) : finalEligibleMarks;





      let totMarks1 = Number(checkQuest?.totalmarks || "0");
      let eligMarks1 = Number(checkQuest?.eligiblemarks || "0");
      let eqLen1 = sortedQuestion?.length >= totMarks1;
      // Ensure values do not go negative
      let finalTotalMarks1 = Math.max(eqLen1 ? totMarks1 : (sortedQuestion?.length), 0);
      let totalQuestions1 = finalTotalMarks1 || 0;
      let percentage1 = totMarks1 > 0 ? (eligMarks1 / totMarks1) * 100 : 0;
      let eligibleMark1 = totalQuestions1 > 0 ? Math.round((percentage1 / 100) * totalQuestions1) : 0;
      let finalEligibleMarks1 = Math.max(eqLen1 ? eligMarks1 : eligibleMark1, 0);



      setTotalMarks(finalTotalMarks1)
      setEligibleMarks(finalEligibleMarks1)
      let answer =
        preanswer?.length > 0
          ? preanswer?.sort((a, b) => {
            // Find the testcompletedat of Round 1 for each candidate
            const aTestCompletedAt = a.interviewrounds.find(
              (round) =>
                round.roundname ===
                single_round?.data?.interviewRound?.roundname
            )?.testcompletedat;
            const bTestCompletedAt = b.interviewrounds.find(
              (round) =>
                round.roundname ===
                single_round?.data?.interviewRound?.roundname
            )?.testcompletedat;

            // Convert testcompletedat to Date objects
            const aDate = new Date(aTestCompletedAt);
            const bDate = new Date(bTestCompletedAt);

            // Sort candidates based on testcompletedat, ascending order
            if (aDate < bDate) return -1;
            if (aDate > bDate) return 1;
            return 0;
          })
          : [];

      setInterviewFormLogArray(
        single_round?.data?.interviewRound?.interviewFormLog
      );
      setRetestCount(single_round?.data?.interviewRound?.retestcount);
      setRetestFor(single_round?.data?.interviewRound?.retestfor);


      let checKAnswer =
        answer?.length > 0 &&
        answer[answer.length - 1].interviewrounds?.find(
          (vic) =>
            vic.roundname === single_round?.data?.interviewRound?.roundname &&
            checkQuest?.typetest === vic?.questiontype
        );

      let liveDiff =
        checkQuest?.typetest === "Manual" &&
        parseInt(checkQuest?.countto) - parseInt(checkQuest?.countfrom);
      let preUserDiff =
        checKAnswer?.questiontype === "Manual" &&
        parseInt(checKAnswer?.questioncountto) -
        parseInt(checKAnswer?.questioncountfrom);

      let liveRunDiff =
        checkQuest?.typetest === "Running"
          ? parseInt(finalquestioncount)
          : 0;
      let preUserRunDiff =
        checKAnswer?.questiontype === "Running"
          ? parseInt(finalquestioncount)
          : 0;

      setValueQuestCount(checKAnswer);






      // setValueSetInterview(checkQuest);
      let data_question =
        checkQuest &&
        sortedQuestion

      let manualCountDiff =
        checKAnswer?.questiontype &&
        Number(checKAnswer?.questioncountto) -
        Number(checKAnswer?.questioncountfrom);

      let manualCountDiffinc =
        manualCountDiff &&
        `${Number(checKAnswer?.questioncountfrom) + Number(manualCountDiff) + 1
        } - ${Number(checKAnswer?.questioncountto) + Number(manualCountDiff) + 1
        }`;

      let manualcount =
        manualCountDiffinc && liveDiff === preUserDiff
          ? manualCountDiffinc
          : `${Number(checkQuest?.countfrom)}-${Number(checkQuest?.countto)}`;

      let runningcount = checKAnswer?.questiontype
        ? Number(checKAnswer?.questioncount) + Number(liveRunDiff)
        : finalquestioncount;

      setValueSetInterview({
        totalmarks: checkQuest?.totalmarks,
        eligiblemarks: checkQuest?.eligiblemarks,
        typetest: checkQuest?.typetest,
        questioncount:
          checkQuest?.typetest === "Random"
            ? finalquestioncount
            : checkQuest?.typetest === "Running"
              ? runningcount >= data_question?.length
                ? Number(runningcount) - Number(data_question?.length)
                : Number(runningcount)
              : 0,
        countfrom:
          checkQuest?.typetest === "Manual"
            ? Number(manualcount?.split("-")[0]) > data_question?.length
              ? 1
              : Number(manualcount?.split("-")[0])
            : 0,
        countto:
          checkQuest?.typetest === "Manual"
            ? Number(manualcount?.split("-")[0]) > data_question?.length
              ? manualCountDiff + 1
              : manualcount?.split("-")[1]
            : 0,
      });

      function filterData(required, count) {
        let startIndex, endIndex;
        switch (required) {
          case "Manual":
            // let checkCount = response ? response?.questioncount : count
            let checkCount = count;
            let startIndexManual =
              parseInt(checkCount?.split("-")[0]) > data_question?.length
                ? 0
                : parseInt(checkCount?.split("-")[0]) - 1;
            let endIndexManual =
              startIndexManual +
              1 +
              (parseInt(checkCount?.split("-")[1]) -
                parseInt(checkCount?.split("-")[0]));

            if (endIndexManual > data_question?.length) {
              endIndexManual = endIndexManual % data_question?.length;
            }
            if (endIndexManual === 0) {
              endIndexManual = data_question?.length;
            }
            if (startIndexManual > endIndexManual) {
              const firstPart = data_question.slice(startIndexManual);
              const secondPart = data_question.slice(0, endIndexManual);

              return firstPart.concat(secondPart);
            } else {
              return data_question?.slice(startIndexManual, endIndexManual);
            }

          case "Running":
            //   let startIndex = (parseInt(response?.questioncount) - parseInt(count)) > data_question.length ? 0 : (parseInt(response?.questioncount) - parseInt(count));
            let startIndex = checKAnswer?.questiontype
              ? parseInt(checKAnswer?.questioncount) > data_question.length
                ? 0
                : parseInt(checKAnswer?.questioncount)
              : 0;
            let endIndex = startIndex + parseInt(finalquestioncount);
            // Adjust endIndex if it exceeds the length of the array
            if (endIndex > data_question.length) {
              endIndex = endIndex - data_question.length;
            }
            // If endIndex becomes 0, set it to the last index
            if (endIndex === 0) {
              endIndex = data_question.length;
            }

            // If startIndex is greater than endIndex after adjustments, wrap around
            if (startIndex > endIndex) {
              const firstPart = data_question.slice(startIndex);
              const secondPart = data_question.slice(0, endIndex);
              return firstPart.concat(secondPart);
            } else {
              return data_question.slice(startIndex, endIndex);
            }

          case "Random":
            let randomIndices = [];
            const getRandomData = () => {
              while (randomIndices.length < parseInt(count)) {
                const randomIndex = Math.floor(
                  Math.random() * data_question.length
                );
                if (!randomIndices.includes(randomIndex)) {
                  randomIndices.push(randomIndex);
                }
              }
              return randomIndices.map((index) => data_question[index]);
            };
            return getRandomData();
          default:
            return "Invalid criteria";
        }
      }

      //   let manualcount = checKAnswer?.questiontype
      //     ? `${
      //         Number(checKAnswer?.questioncountfrom) +
      //         (Number(checKAnswer?.questioncountto) -
      //           Number(checKAnswer?.questioncountfrom) +
      //           1)
      //       }-${
      //         Number(checKAnswer?.questioncountto) +
      //         (Number(checKAnswer?.questioncountto) -
      //           Number(checKAnswer?.questioncountfrom) +
      //           1)
      //       }`
      //     : `${checkQuest?.countfrom}-${checkQuest?.countto}`;

      let answeer = filterData(
        checkQuest?.typetest,
        checkQuest?.typetest === "Manual"
          ? manualcount
          : checkQuest?.typetest === "Running"
            ? runningcount
            : finalquestioncount
      );


      setInterviewGetForm(answeer?.length > 0 ? answeer : []);

      setDuration(`${checkQuest.duration}:00`);
      setDurationInitial(`${checkQuest.duration}:00`);

      let cat = checkQuest?.category;
      let subcat = checkQuest?.subcategory;

      setTestCategory(cat);
      setTestSubCategory(subcat);
      setNextButton(true);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    } finally {
      setIsLoading(false);
    }
  };

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

  // useEffect(() => {
  //   renderNewQuote();
  // }, []);

  const startTest = () => {
    setMistakes(0);
    setStartSingleStatus("Started");
    clearInterval(timer);
    setTimer(setInterval(updateTimer, 1000));
  };

  const updateTimer = () => {
    setTime((prevTime) => {
      if (prevTime === 0) {
        displayResult(prevTime, false);
        return null;
      }
      return prevTime - 1;
    });
  };

  const reduceNumber = (number) => {
    return number - 1;
  };

  // const intervalIdRefSingle = useRef(timeInitial);
  // useEffect(() => {
  //   if (startSingleStatus === "Started") {
  //     intervalIdRef.current = setInterval(() => {
  //       setTime((prevTime) => {
  //         const newTime = reduceNumber(prevTime);
  //         if (newTime == 0) {
  //           // setShowDescAlert(
  //           //   <>
  //           //     <ErrorOutlineOutlinedIcon
  //           //       sx={{ fontSize: "100px", color: "orange" }}
  //           //     />
  //           //     <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //           //       "Time Up! Click OK to Submit your form"
  //           //     </p>
  //           //   </>
  //           // );
  //           // handleClickOpenerrDesc();
  //           displayResult(newTime, false);
  //           clearInterval(intervalIdRefSingle.current);
  //         }
  //         return newTime;
  //       });
  //     }, 1000);

  //     return () => {
  //       clearInterval(intervalIdRef.current);
  //       setTime(null);
  //     };
  //   }
  // }, [startSingleStatus === "Started"]);

  const displayResult = (pretime, from) => {
    // let timeTaken =
    //   pretime !== 0 ? (timeInitial - pretime) / 100 : timeInitial / 100;

    // const wpm = (typingtestInput.length / 5 / (timeTaken / 60)).toFixed(2);

    // let accuracy;
    // if (typingtestInput.length === 0) {
    //   accuracy = 0; // If no characters were typed, accuracy is 0
    // } else {
    //   accuracy = Math.round(
    //     ((typingtestInput.length - mistakes) / typingtestInput.length) * 100
    //   );
    // }

    // document.querySelector(".result").style.display = "block";
    // userInputRef.current.disabled = true;

    let timeTaken = 1;
    if (pretime !== 0) {
      timeTaken = (timeInitial - pretime) / 100;
    }

    // const { speed, accuracy } = calculateSpeedAndAccuracy(
    //   Number(timeInitial),
    //   quote?.length,
    //   typingtestInput.length,
    //   mistakes
    // );

    // const wpm = speed.toFixed(2);

    const wpm = (typingtestInput.length / 5 / timeTaken).toFixed(2);
    const accuracy = Math.round(
      ((typingtestInput.length - mistakes) / typingtestInput.length) * 100
    );

    // document.getElementById("wpm").innerText = `${wpm} wpm`;
    // document.getElementById("accuracy").innerText = `${accuracy} %`;

    interviewGetForm[indexViewQuest].typingspeedans = wpm;
    interviewGetForm[indexViewQuest].typingaccuracyans = accuracy;
    interviewGetForm[indexViewQuest].typingmistakesans = mistakes;
    interviewGetForm[indexViewQuest].userans =
      typingtestInput.length > 1
        ? [
          `Speed - ${wpm} wpm`,
          `Accuracy - ${accuracy}%`,
          `Mistakes - ${mistakes}`,
        ]
        : ["InComplete"];
    interviewGetForm[indexViewQuest].useransstatus = [
      typingtestDatas?.typingspeedstatus,
      typingtestDatas?.typingaccuracystatus,
      typingtestDatas?.typingmistakesstatus,
    ];

    const isValid = (
      value,
      validation,
      threshold,
      thresholdfrom,
      thresholdto
    ) => {
      switch (validation) {
        case "Less Than":
          return Number(value) < Number(threshold);
        case "Less Than or Equal to":
          return Number(value) <= Number(threshold);
        case "Greater Than":
          return Number(value) > Number(threshold);
        case "Greater Than or Equal to":
          return Number(value) >= Number(threshold);
        case "Between":
          return (
            Number(value) >= Number(thresholdfrom) &&
            Number(value) <= Number(thresholdto)
          );
        default:
          return false;
      }
    };

    const isValidStatus = (
      value,
      validation,
      threshold,
      status,
      thresholdfrom,
      thresholdto
    ) => {
      return (
        isValid(value, validation, threshold, thresholdfrom, thresholdto) &&
        (status === "Eligible" || status === "Informative")
      );
    };

    // Speed check
    let isValidSpeed = isValidStatus(
      wpm,
      typingtestDatas?.typingspeedvalidation,
      typingtestDatas?.typingspeed,
      typingtestDatas?.typingspeedstatus,
      typingtestDatas?.typingspeedfrom,
      typingtestDatas?.typingspeedto
    );

    // Accuracy check
    let isValidAccuracy = isValidStatus(
      accuracy,
      typingtestDatas?.typingaccuracyvalidation,
      typingtestDatas?.typingaccuracy,
      typingtestDatas?.typingaccuracystatus,
      typingtestDatas?.typingaccuracyfrom,
      typingtestDatas?.typingaccuracyto
    );

    // Mistakes check
    let isValidMistakes = isValidStatus(
      mistakes,
      typingtestDatas?.typingmistakesvalidation,
      typingtestDatas?.typingmistakes,
      typingtestDatas?.typingmistakesstatus,
      typingtestDatas?.typingmistakesfrom,
      typingtestDatas?.typingmistakesto
    );

    let eligibleResult = isValidSpeed || isValidAccuracy || isValidMistakes;

    let finalResult = from && eligibleResult ? true : false;

    interviewGetForm[indexViewQuest].typingresult = finalResult
      ? "Eligible"
      : "Not Eligible";

    // setOnGetStatus(finalResult);
    clearInterval(timer);
    setTimer(null);
    setTime(null);

    setStartSingleStatus("Ended");

    if (indexViewQuest >= interviewGetForm?.length - 1) {
      const answer = interviewGetForm
        .filter((data) => data.userans)
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
            attendby: "Candidate",
          };
        });
      sendRequest(answer);
    } else {
      handleConditionCheck(finalResult);
    }
  };

  const handleInput = (input) => {
    if (input.length === 1 && !startTime) {
      setStartTime(Date.now());
      startTest();
    }
    setTypingTestInput(input);
    const quoteChars = document.querySelectorAll(".quote-chars");
    const userInputChars = input.split("");

    quoteChars.forEach((char, index) => {
      if (char.innerText === userInputChars[index]) {
        char.classList.add("success");
      } else if (!userInputChars[index]) {
        char.classList.remove("success");
        char.classList.remove("fail");
      } else {
        if (!char.classList.contains("fail")) {
          setMistakes((prevMistakes) => prevMistakes + 1);
          char.classList.add("fail");
        }
      }

      const check = Array.from(quoteChars).every((element) =>
        element.classList.contains("success")
      );

      if (check) {
        displayResult(time, true);
      }
    });
  };

  const userInputRef = React.createRef();
  const [startTime, setStartTime] = useState(null);
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
      const updatedUserAns = value.target.checked
        ? [...(interviewGetForm[index].userans || []), value.target.value]
        : interviewGetForm[index].userans.filter(
          (ans) => ans !== value.target.value
        );

      const answer = updatedUserAns;

      // const answer = value?.map((options) => options?.value);
      let ans = interviewGetForm[index]?.optionArr?.filter((data) =>
        answer?.includes(data?.options)
      );
      let check = ans?.some((data) => data?.status === "Not-Eligible");
      let checkAns = ans?.filter((data) => data?.status !== "Not-Eligible");
      let checkFail = ans?.filter((data) => data?.status === "Not-Eligible");

      interviewGetForm[index].userans = answer;
      interviewGetForm[index].status =
        checkAns?.length > checkFail?.length ||
          checkAns?.length === checkFail?.length
          ? "Eligible"
          : "Not-Eligible";
      if (updatedUserAns?.length !== 0) {
        setNextButton(true);
      } else {
        setNextButton(false);
      }
    }
    if (data?.type === "TextBox") {
      let checkNoAnswer = interviewGetForm[index]?.answers === "No Answer";
      let isValid = interviewGetForm[index]?.answers == value;

      interviewGetForm[index].userans = value;
      interviewGetForm[index].status = checkNoAnswer
        ? "Eligible"
        : isValid
          ? "Eligible"
          : "Not-Eligible";

      if (value !== "") {
        setNextButton(true);
      } else {
        setNextButton(false);
      }
    }
    if (data?.type === "Text-Alpha") {
      const textOnly = value.replace(/[^a-zA-Z\s;]/g, "");

      let checkNoAnswer = interviewGetForm[index]?.answers === "No Answer";
      let isValid = interviewGetForm[index]?.answers == textOnly;

      interviewGetForm[index].userans = textOnly;
      interviewGetForm[index].status = checkNoAnswer
        ? "Eligible"
        : isValid
          ? "Eligible"
          : "Not-Eligible";

      if (textOnly !== "") {
        setNextButton(true);
      } else {
        setNextButton(false);
      }
    }
    if (data?.type === "Text-Numeric") {
      const numericOnly = value.replace(/[^0-9.;\s]/g, "");
      let checkNoAnswer = interviewGetForm[index]?.answers === "No Answer";

      let isValid = interviewGetForm[index]?.answers == numericOnly;

      interviewGetForm[index].userans = numericOnly;
      interviewGetForm[index].status = checkNoAnswer
        ? "Eligible"
        : isValid
          ? "Eligible"
          : "Not-Eligible";

      if (numericOnly !== "") {
        setNextButton(true);
      } else {
        setNextButton(false);
      }
    }

    // setInterviewGetForm(updatedArray);
    setSelectedRadioSecondary([]);
    setSelectedRadioSub1Page([]);
    setSelectedRadioSub2Page([]);
  };

  window.addEventListener("beforeunload", function (event) {
    // Clear local storage
    localStorage.removeItem("timerDuration");
    localStorage.removeItem("formFilled");
  });

  const durationParts = duration.split(":");
  const hours = durationParts[0];
  const minutes = durationParts[1];
  const seconds = durationParts[2];

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

  return (
    <div style={{ backgroundColor: "white" }}>
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
              {!startStatus && (
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "25px",
                    fontWeight: "bold",
                  }}
                >
                  <Typography
                    style={{
                      fontSize: "25px",
                      fontWeight: "bold",
                      fontFamily: "Lemon, serif",
                    }}
                  >
                    INTERVIEW FORM
                  </Typography>
                </Box>
              )}
              <br />
              {!startStatus && (
                <Box
                  style={{
                    overflowY: "visible",
                    height: "max-content",
                    padding: "20px",
                    maxWidth: "100% !important",
                    borderRadius: "none",
                    fontFamily: "auto",
                    "& .MuiTable-root": {
                      borderBottom: "none !important",
                      paddingTop: "20px",
                      paddingBottom: "20px",
                    },
                    "& .MuiTableCell-root": {
                      fontSize: "18px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      background: "#8080800f",
                      border: "1px solid #00000021",
                    },
                    "& .MuiOutlinedInput-root": {
                      height: "40px",
                    },
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid
                      container
                      spacing={2}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Grid item md={4} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Username<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            // placeholder="Please Enter Name"
                            value={userName}
                            onChange={(e) => {
                              setUserName(e.target.value);
                            }}
                          />
                          {errors.userName && <div>{errors.userName}</div>}
                          <br />
                          <br />
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Grid item md={4} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Password<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type={showLivePassword ? "text" : "password"}
                            // placeholder="Please Enter Email"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              // setIsValidEmail(validateEmail(e.target.value));
                            }}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowLivePassword}
                                  onMouseDown={handleMouseDownLivePassword}
                                  edge="end"
                                >
                                  {!showLivePassword ? (
                                    <VisibilityOff sx={{ fontSize: "25px" }} />
                                  ) : (
                                    <Visibility sx={{ fontSize: "25px" }} />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                          {errors.password && <div>{errors.password}</div>}
                          <br />
                          <br />
                          {errorMessage && (
                            <div
                              className="alert alert-danger"
                              style={{
                                color: "red",
                                fontSize: "10px !imporant",
                                textAlign: "center",
                              }}
                            >
                              {errorMessage}
                            </div>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/* <Grid
                      container
                      spacing={2}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Grid item md={4} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Phone Number<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="Number"
                            sx={userStyle.input}
                            // placeholder="Please Enter Phone Number"
                            value={phonenum}
                            onChange={(e) => {
                              setPhonenum(
                                e.target.value > 0 ? e.target.value : 0
                              );
                              handlechangecontactpersonal(e);
                            }}
                          />
                          {errors.phonenum && <div>{errors.phonenum}</div>}
                        </FormControl>
                      </Grid>
                    </Grid> */}
                  </Grid>
                </Box>
              )}
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
                              {data && data?.documentFiles?.length > 0 && (
                                <img
                                  src={data?.documentFiles[0].preview}
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
                            {data && data?.documentFiles?.length > 0 && (
                              <img
                                src={data?.documentFiles[0].preview}
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
                            {data && data?.documentFiles?.length > 0 && (
                              <img
                                src={data?.documentFiles[0].preview}
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
                            {data && data?.documentFiles?.length > 0 && (
                              <img
                                src={data?.documentFiles[0].preview}
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
                              {data && data?.documentFiles?.length > 0 && (
                                <img
                                  src={data?.documentFiles[0].preview}
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
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ChevronRightIcon />}
                        onClick={() => {
                          handleConditionCheck(false);
                        }}
                        sx={{ float: "right" }}
                      >
                        Next
                      </Button>
                    )}
                    {indexViewQuest >= interviewGetForm?.length - 1 && (
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ChevronRightIcon />}
                        sx={{ float: "right" }}
                        onClick={handleSubmit}
                      >
                        Submit
                      </Button>
                    )}
                  </>
                )}
              {interviewGetForm?.length > 0 &&
                userName !== "" &&
                password !== "" &&
                startStatus &&
                prevButton && (
                  <>
                    {indexViewQuest !== 0 && interviewGetForm?.length > 0 && (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ChevronLeftIcon />}
                        onClick={() => {
                          handleConditionCheckBack();
                        }}
                        sx={{ float: "left" }}
                      >
                        Prev
                      </Button>
                    )}
                    <br /> <br />
                    <br />
                  </>
                )}
              {interviewGetForm?.length > 0 && !startStatus && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ChevronRightIcon />}
                    onClick={() => {
                      // handleStart();
                      const newErrors = {};
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


                      setErrors(newErrors);
                      if (Object.keys(newErrors)?.length === 0 && canidateDetails?.interviewrounds?.length === 1) {
                        handleOpenTable();
                      }
                      else if (Object.keys(newErrors)?.length === 0 && canidateDetails.approval === "sentforapproval") {
                        handleClickOpenDocument();
                      } else if (Object.keys(newErrors)?.length === 0) {
                        handleStart();
                      }
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

        {/* Floating Icon Button */}
        {/* {interviewGetForm?.length > 0 &&
          <Tooltip title="Give additional information about this question if needed" arrow>
            <Fab
              color="primary"
              aria-label="add"
              onClick={() => setAdditionalOpen(true)
              }
              sx={{ position: "fixed", bottom: 16, right: 16 }}
            >
              <Add />
            </Fab>
          </Tooltip>} */}
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
        {/* Candidate DOcument Verification Popup */}
        <Box>
          <Dialog
            open={isDocumentOpen}
            maxWidth="md"
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent >
              <br />
              <CandidateDocumentsApprovalPage id={canidateDetails?.approvalid} user={canidateDetails} handleStart={handleStart} /> {/* ✅ Render your component here */}
            </DialogContent>
          </Dialog>
        </Box>

        <Dialog
          open={openTable}
          onClose={handleCloseTable}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="xl"
          sx={{ marginTop: "50px" }}
        >
          <Box sx={{ padding: 4, backgroundColor: "#f9f9f9" }}>
            <Typography variant="h5" gutterBottom>
              Designation Requirement & Candidate Details
            </Typography>

            <Grid container spacing={3}>
              {/* Left Column: Designation Details */}
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 3, backgroundColor: "#e3f2fd" }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    🧾 Designation Requirements
                  </Typography>
                  <DetailItem label="Designation" value={singleDesignationRequirements?.designation} />
                  <DetailItem label="Department" value={singleDesignationRequirements?.department} />
                  <DetailItem label="Language" value={singleDesignationRequirements?.language?.join(",")} />
                  <DetailItem label="Skill" value={singleDesignationRequirements?.skill?.join(",")} />
                  <DetailItem label="Education" value={`${singleDesignationRequirements?.category?.join(",") || "-"}/${singleDesignationRequirements?.subcategory?.join(",") || "-"}/${singleDesignationRequirements?.education?.join(",") || "-"}`} />
                  <DetailItem label="Experience" value={`From ${singleDesignationRequirements?.experiencefrom || ""} to ${singleDesignationRequirements?.experienceto || ""} years`} />
                  <DetailItem label="Salary" value={`From ₹${singleDesignationRequirements?.salaryfrom || ""} to ₹${singleDesignationRequirements?.salaryto || ""}`} />
                  {/* <DetailItem label="Notice Period" value={`From ${singleDesignationRequirements?.noticeperiodfrom} to ${singleDesignationRequirements?.noticeperiodto}`} /> */}
                  <DetailItem label="Job Description" value={convertToNumberedList(singleDesignationRequirements?.jobdescription)} />
                  <DetailItem label="Job Requirements" value={convertToNumberedList(singleDesignationRequirements?.jobrequirements)} />
                  <DetailItem label="Job Benefits" value={convertToNumberedList(singleDesignationRequirements?.jobbenefits)} />
                  {/* <DetailItem label="Roles & Responsibilities" value={convertToNumberedList(singleDesignationRequirements?.rolesandres)} /> */}
                </Paper>
              </Grid>

              {/* Right Column: Candidate Details */}
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 3, backgroundColor: "#e8f5e9" }}>
                  <Typography variant="h6" gutterBottom color="success.main">
                    👤 Candidate Details
                  </Typography>
                  <DetailItem label="Name" value={canidateDetails?.fullname} />
                  <DetailItem label="Skill" value={canidateDetails?.skill?.join(",") || ""} />
                  <DetailItem label="Certification" value={canidateDetails?.skill?.join(",") || ""} />
                  <DetailItem label="Experience in Domain" value={`${canidateDetails?.domainexperience || 0} ${canidateDetails?.domainexperienceestimation || "Years"} `} />
                  <DetailItem label="Expected Salary" value={`₹${canidateDetails?.expectedsalary || 0} ${canidateDetails?.expectedsalaryopts || ""} `} />
                  <DetailItem label="Education" value={canidateDetails?.educationdetails?.length > 0 ? canidateDetails?.educationdetails?.map((data, index) => `${index + 1}. ${data?.categoryedu || ""}/${data?.subcategoryedu || ""}/${data?.specilization || ""}/${data?.fromduration || ""} to ${data?.toduration || ""}/${data?.percentage || ""}%`) : ""} />
                  {/* <DetailItem label="Expected Salary" value={`₹${canidateDetails?.expectedSalary}`} />
                        <DetailItem label="Notice Period" value={`${canidateDetails?.noticePeriod}`} />
                        <DetailItem label="Available From" value={canidateDetails?.joiningDate} />
                        <DetailItem label="Previous Company" value={canidateDetails?.previousCompany} /> */}
                </Paper>
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="center" mt={4}>
              <Button variant="contained" color="secondary" onClick={handleCloseTable}>
                Close
              </Button>
              &nbsp;
              &nbsp;
              <Button variant="contained" color="success" onClick={handleStart}>
                Start
              </Button>
            </Box>
          </Box>
        </Dialog>
      </div>
      <br />
      <br />
    </div>
  );
}

export default InterviewTestRound;