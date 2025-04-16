import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import InfoIcon from "@mui/icons-material/Info";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import axios from "axios";
import "jspdf-autotable";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";
import { handleApiError } from "../components/Errorhandling";
import Headtitle from "../components/Headtitle";
import hilifelogo from "../login/hilifelogo.png";
import { SERVICE } from "../services/Baseservice";

function ExitInterview() {
  const testName = useParams().testname;
  const startedby = useParams()?.from;
  const testcount = useParams()?.testcount;
  const candidateid = useParams()?.candidateid;
  const roundid = useParams()?.roundid;


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



  const [selectedSecondaryName, setSelectedSecondaryName] = useState([]);

  const [selectedSub1PageName, setSelectedSub1PageName] = useState([]);

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const [islogin, setislogin] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  const interviewLogin = async () => {
    try {
      const res = await axios.post(SERVICE.EXITINTERVIEW_LOGIN, {
        username: String(userName),
        password: String(password),
      });

      if (res?.data?.loginstatus === true) {
        setStartStatus(true);
        // await testStatusUpdate(res?.data?.candidateroundid, "On Progress");
        // setCandidateRoundId(res?.data?.candidateroundid);
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
        `${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`,
        {
          interviewForm: answer
        }
      );
    } catch (err) {
      console.log(err);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //add function
  const sendRequest = async (answer) => {
    try {
      await testAnswerUpdate(candidateid, answer);
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

      backPage(`/exitinterview/exitinterviewendpage`);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

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
    setErrors(newErrors);
    if (Object.keys(newErrors)?.length === 0) {
      await interviewLogin();
    }
  };
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
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

    else if (answer?.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Answer Any One of the Questions"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest(answer);
    }
  };
  const handleConditionCheck = (typetes) => {
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



  //get all Sub vendormasters.
  const fetchInterviewGenerate = async () => {
    console.log(testName)
    try {
      const [interQust, interQuestions] =
        await Promise.all([
          axios.get(`${SERVICE.EXITINTERVIEWTESTMASTER}`),
          axios.get(`${SERVICE.ALLEXITINTERVIEWQUESTIONS}`),
        ]);
      let [testnamenew, combinedData] = testName.split('(');
      let [categorynew, subcategorynew] = combinedData?.replace(')', "").split("-");

      let getData = interQust?.data?.interviewtestmasters?.filter((data) => data?.testname === testnamenew?.trimEnd() && data?.category === categorynew && data?.subcategory === subcategorynew);
      setInterviewGetForm(interQuestions?.data?.exitquestions?.filter((data) => {
        return getData?.some((item) => item?.category === data?.category && item?.subcategory === data?.subcategory)
      }));
      setNextButton(true);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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


  const displayResult = (pretime, from) => {


    let timeTaken = 1;
    if (pretime !== 0) {
      timeTaken = (timeInitial - pretime) / 100;
    }


    const wpm = (typingtestInput.length / 5 / timeTaken).toFixed(2);
    const accuracy = Math.round(
      ((typingtestInput.length - mistakes) / typingtestInput.length) * 100
    );

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
        <div
          style={{
            padding: "10px",
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            backgroundColor: "black",
          }}
        >
          <img
            src={hilifelogo}
            alt="Logo"
            style={{ height: "50px", width: "auto", marginRight: "10px" }}
          />
          <h2 style={{ color: "white", fontSize: "1.5rem", margin: 0 }}>
            HIHRMS
          </h2>
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
                                    >{`Question No.${index + 1} of ${interviewGetForm?.length
                                      }`}</Box>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={3}></Grid>
                              </Grid>
                            </ListItem>
                            <Paper style={paper1}>
                              <ListItem>
                                <ListItemText>
                                  <Typography
                                    style={typography1}
                                    variant="h6"
                                  >{`Q. ${data?.question}`}</Typography>
                                </ListItemText>
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
                                  Please choose one of the following answers:
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
                                    label={`${item.options}`}
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
                                  >{`Question No.${index + 1} of ${interviewGetForm?.length
                                    }`}</Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3}></Grid>
                            </Grid>
                          </ListItem>
                          <Paper style={paper1}>
                            <ListItem>
                              <ListItemText>
                                <Typography
                                  style={typography1}
                                  variant="h6"
                                >{`Q. ${data?.question}`}</Typography>
                              </ListItemText>
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
                                Please Fill The Below Text Box:
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
                                  >{`Question No.${index + 1} of ${interviewGetForm?.length
                                    }`}</Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3}></Grid>
                            </Grid>
                          </ListItem>
                          <Paper style={paper1}>
                            <ListItem>
                              <ListItemText>
                                <Typography
                                  style={typography1}
                                  variant="h6"
                                >{`Q. ${data?.question}`}</Typography>
                              </ListItemText>
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
                                Please Fill The Below Text Box:
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
                                  >{`Question No.${index + 1} of ${interviewGetForm?.length
                                    }`}</Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3}></Grid>
                            </Grid>
                          </ListItem>
                          <Paper style={paper1}>
                            <ListItem>
                              <ListItemText>
                                <Typography
                                  style={typography1}
                                  variant="h6"
                                >{`Q. ${data?.question}`}</Typography>
                              </ListItemText>
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
                                Please Fill The Below Text Box:
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
                                    >{`Question No.${index + 1} of ${interviewGetForm?.length
                                      }`}</Box>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={3}></Grid>
                              </Grid>
                            </ListItem>
                            <Paper style={paper1}>
                              <ListItem>
                                <ListItemText>
                                  <Typography
                                    style={typography1}
                                    variant="h6"
                                  >{`Q. ${data?.question}`}</Typography>
                                </ListItemText>
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
                                  Multiple Choice:
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
                                          label={option.options}
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
      </div>
      <br />
      <br />
    </div>
  );
}

export default ExitInterview;