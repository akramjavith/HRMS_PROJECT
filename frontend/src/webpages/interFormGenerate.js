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
} from "@mui/material";
import Radio from "@mui/material/Radio";
import InfoIcon from "@mui/icons-material/Info";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { handleApiError } from "../components/Errorhandling";
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

function InterFormGenerate() {
  const idGen = useParams().id;
  const startedby = useParams()?.from;
  const mode = useParams()?.mode;
  const testcount = useParams()?.testcount;
  const candidateid = useParams()?.candidateid;
  const roundid = useParams()?.roundid;
  const autofill = useParams()?.autofill;

  const userInputRef = useRef(null);
  const quoteCharsRef = useRef([]);
  const mistakesRef = useRef(0);
  const scrollRef = useRef(0);
  const timeRef = useRef(0);
  const questionLengthRef = useRef(0);

  useEffect(() => {
    if (autofill === "true") {
      autoFillCredentials();
    }
  }, [autofill]);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    scrollRef.current = 200;
    if (screenWidth <= 768) {
      scrollRef.current = 100;
    } else if (screenWidth <= 1024) {
      scrollRef.current = 200;
    }
  }, []);

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
          secondarytodo: item?.secondarytodo,
          answers: item.answers,
          statusAns: item.statusAns,
          typingspeedans: item?.typingspeedans,
          typingaccuracyans: item?.typingaccuracyans,
          typingmistakesans: item?.typingmistakesans,
          useransstatus: item?.useransstatus,
          optionArr: item.optionArr,
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

  // const handleSubPageChange = (options) => {
  //   setSelectedSubPageName(options);
  // };

  const [selectedSecondaryName, setSelectedSecondaryName] = useState([]);
  // const handleSecondaryNameChange = (options, index) => {
  //   setSelectedSecondaryName((prevState) => {
  //     const updatedValues = [...prevState];
  //     updatedValues[index] = options; // Update the value at the specified index
  //     return updatedValues;
  //   });
  // };

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
  // const handleSub1PageChange = (options, index) => {
  //   setSelectedSub1PageName((prevState) => {
  //     const updatedValues = [...prevState];
  //     updatedValues[index] = options; // Update the value at the specified index
  //     return updatedValues;
  //   });
  // };

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
      let finalAnswer =
        mode === "typingtest"
          ? answer
          : await concordiateArrays(
              allQuestionArray,
              remainingQuestionArray,
              answer
            );
      let subprojectscreate = await axios.post(SERVICE.CREATE_USER_RESPONSE, {
        username: userName,
        password: password,
        // phonenumber: String(phonenum),
        testcategory: String(testCategory),
        testsubcategory: String(testSubCategory),
        questionId: idGen,
        interviewForm: finalAnswer,
        addedby: [
          {
            name: String(userName),
            date: String(new Date()),
          },
        ],
      });

      await testAnswerUpdate(candidateRoundId, finalAnswer);
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

      let noteligible = finalAnswer?.some(
        (data) => data?.typingresult === "Not Eligible"
      );

      let retestfor =
        retestFor === "Both" ||
        (retestFor === "Not Eligible" && noteligible) ||
        (retestFor === "Eligible" && !noteligible);

      if (
        retestfor &&
        mode === "typingtest" &&
        retestCount > 0 &&
        Number(testcount) !== retestCount
      ) {
        backPage(
          `/interview/interviewendpage/typingtest/${testcount}/${candidateid}/${roundid}/${idGen}`
        );
      } else {
        backPage(
          `/interview/interviewendpage/${mode}/${candidateid}/${roundid}`
        );
      }
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
  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
    const answer = interviewGetForm
      .filter((data) => data.userans)
      .map((item) => {
        return {
          ...item,
          question: item.question,
          userans: item.userans,
          type: item.type,
          secondarytodo: item?.secondarytodo,
          answers: item.answers,
          statusAns: item.statusAns,
          typingspeedans: item?.typingspeedans,
          typingaccuracyans: item?.typingaccuracyans,
          typingmistakesans: item?.typingmistakesans,
          useransstatus: item?.useransstatus,
          optionArr: item.optionArr,
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
  const handleConditionCheck = (typetes) => {
    setSub1todo([]);
    setSecondaryTodo([]);
    setSub2Todo([]);
    setSub3Todo([]);
    setSub4Todo([]);
    setSelectedSecondaryName([]);
    setSelectedSub1PageName([]);
    // || typetes === true

    if (true && startStatus === true) {
      setIndexViewQuest(indexViewQuest + 1);
      if (interviewGetForm[indexViewQuest + 1]?.questionattended) {
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

        // if (
        //   interviewGetForm[indexViewQuest + 1]?.type === "MultipleChoice" &&
        //   interviewGetForm[indexViewQuest + 1]?.questionattended &&
        //   interviewGetForm[indexViewQuest + 1]?.userans?.length > 0
        // ) {
        //   handleSubPageChange(
        //     interviewGetForm[indexViewQuest + 1]?.userans?.map((data) => ({
        //       label: data,
        //       value: data,
        //     }))
        //   );
        // }

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
      if (mode === "typingtest") {
        let quote = interviewGetForm[indexViewQuest + 1]?.question;
        let duration = interviewGetForm[indexViewQuest + 1]?.typingduration;
        let {
          typingspeed,
          typingspeedvalidation,
          typingspeedfrom,
          typingspeedto,
          typingspeedstatus,
          typingaccuracy,
          typingaccuracyvalidation,
          typingaccuracyfrom,
          typingaccuracyto,
          typingaccuracystatus,
          typingmistakes,
          typingmistakesvalidation,
          typingmistakesfrom,
          typingmistakesto,
          typingmistakesstatus,
        } = interviewGetForm[indexViewQuest + 1];
        setTypingTestDatas({
          typingspeed: typingspeed,
          typingspeedvalidation: typingspeedvalidation,
          typingspeedfrom: typingspeedfrom,
          typingspeedto: typingspeedto,
          typingspeedstatus: typingspeedstatus,

          typingaccuracy: typingaccuracy,
          typingaccuracyvalidation: typingaccuracyvalidation,
          typingaccuracyfrom: typingaccuracyfrom,
          typingaccuracyto: typingaccuracyto,
          typingaccuracystatus: typingaccuracystatus,

          typingmistakes: typingmistakes,
          typingmistakesvalidation: typingmistakesvalidation,
          typingmistakesfrom: typingmistakesfrom,
          typingmistakesto: typingmistakesto,
          typingmistakesstatus: typingmistakesstatus,
        });
        // let arr = quote?.split("").map((value) => {
        //   return "<span class='quote-chars'>" + value + "</span>";
        // });
        // setQuote(arr.join(""));
        setTypingQuestion(quote);
        questionLengthRef.current = quote?.length;
        const [minutesStr, secondsStr] = duration?.split(":");

        // Parse the minutes and seconds strings into integers
        const minutes = parseInt(minutesStr, 10);
        const seconds = parseInt(secondsStr, 10);

        // Calculate the total seconds
        const totalSeconds = minutes * 60 + seconds;
        //join array for displaying

        setMistakes(0);
        setTime(Number(totalSeconds));
        setTimeInitial(totalSeconds);
        setTypingTestInput("");
      }
      setNextButton(false);
    } else if (
      startStatus === true &&
      onGetStatus === false &&
      onDescStatus === true
    ) {
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
        .filter((data) => data.userans)
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
            secondarytodo: item?.secondarytodo,
            answers: item.answers,
            statusAns: item.statusAns,
            optionArr: item.optionArr,
          };
        });
      sendRequest(answer);
    }
  };

  const handlePreviousButton = () => {
    let prevInd = indexViewQuest - 1;
    setIndexViewQuest(indexViewQuest - 1);

    setSecondaryTodo(
      interviewGetForm[prevInd]?.secondarytodo?.slice(0, 1) ?? []
    );

    // if (
    //   interviewGetForm[prevInd]?.type === "MultipleChoice" &&
    //   interviewGetForm[prevInd]?.userans?.length > 0
    // ) {
    //   handleSubPageChange(
    //     interviewGetForm[prevInd]?.userans?.map((data) => ({
    //       label: data,
    //       value: data,
    //     }))
    //   );
    // }

    if (
      interviewGetForm[prevInd]?.secondarytodo[0]?.type === "MultipleChoice" &&
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
  };

  const [duration, setDuration] = useState("");
  const [durationInitial, setDurationInitial] = useState("");
  useEffect(() => {
    const storedDuration = localStorage.getItem("timerDuration");
    const storedFormData = localStorage.getItem("formFilled");
    if (storedDuration && storedFormData) {
      setDuration(storedDuration);
    } else {
      mode === "typingtest"
        ? fetchInterviewGenerateTyping()
        : fetchInterviewGenerate();
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
  //get all Sub vendormasters.
  const fetchInterviewGenerate = async () => {
    try {
      let single_round = await axios.post(
        `${SERVICE.INTERVIEW_ROUND}/${candidateid}/${roundid}`
      );
      setInterviewFormLogArray(
        single_round?.data?.interviewRound?.interviewFormLog
      );
      setRetestCount(single_round?.data?.interviewRound?.retestcount);
      setRetestFor(single_round?.data?.interviewRound?.retestfor);
      let res_vendor = await axios.get(
        `${SERVICE.INTERVIEWQUESTIONSORDER_SINGLE}/${idGen}`
      );
      setDuration(`${res_vendor.data.sinterviewquestionsorder.duration}:00`);
      setDurationInitial(
        `${res_vendor.data.sinterviewquestionsorder.duration}:00`
      );
      setInterviewGet(res_vendor.data.sinterviewquestionsorder);
      const sortedQuestions =
        res_vendor?.data.sinterviewquestionsorder?.question?.map((value) => {
          return res_vendor?.data?.sinterviewquestionsorder?.interviewForm?.find(
            (q) => q.question.includes(value)
          );
        });

      setAllQuestionArray(sortedQuestions);

      let res = await axios.get(SERVICE.INTERVIEWQUESTION);

      let cat = res_vendor.data.sinterviewquestionsorder?.category;
      let subcat = res_vendor.data.sinterviewquestionsorder?.subcategory;

      setTestCategory(cat);
      setTestSubCategory(subcat);

      let intQues = res?.data?.interviewquestions?.filter(
        (data) =>
          data.category === cat &&
          data.subcategory === subcat &&
          (data?.testattendby === "Both" || data?.testattendby === "Candidate")
      );

      let mainSame = sortedQuestions
        ?.filter((ques) => intQues?.some((val) => val.name === ques?.question))
        ?.map((data) => {
          let foundData = intQues?.find((item) => item?.name == data?.question);
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
                  data: foundSubsame?.files[0]?.data || "",
                  attendby: "Candidate",
                  testcount: Number(testcount),
                };
              } else {
                return {
                  ...data1,
                  uploadedimage: "",
                  uploadedimagename: "",
                  data: "",
                  attendby: "Candidate",
                  testcount: Number(testcount),
                };
              }
            });
            return {
              ...data,
              uploadedimage: foundData?.uploadedimage || "",
              uploadedimagename: foundData?.uploadedimagename || "",
              data: foundData?.files[0]?.data || "",
              typingtesttype: foundData?.questiontype || "",
              secondarytodo: subsame,
              attendby: "Candidate",
              testcount: Number(testcount),
            };
          } else {
            return {
              ...data,
              uploadedimage: "",
              uploadedimagename: "",
              data: "",
              attendby: "Candidate",
              testcount: Number(testcount),
              secondarytodo: (data?.secondarytodo || []).map((subsame) => ({
                ...subsame,
                uploadedimage: "",
                uploadedimagename: "",
                data: "",
              })),
            };
          }
        });

      setRemainingQuestionArray(
        sortedQuestions?.filter(
          (obj) => !mainSame?.some((item) => item._id === obj._id)
        )
      );

      setInterviewGetForm(mainSame);
      setNextButton(true);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [valueSetInterview, setValueSetInterview] = useState("");
  const fetchInterviewGenerateTyping = async () => {
    try {
      const [single_round, res_deptandteam, interQust, interQuestions] =
        await Promise.all([
          axios.post(`${SERVICE.INTERVIEW_ROUND}/${candidateid}/${roundid}`),
          axios.post(SERVICE.CANDIDATES, { jobopeningsid: idGen }),
          axios.get(`${SERVICE.INTERVIEWQUESTIONGROUPING}`),
          axios.get(`${SERVICE.GET_INT_FORM_DESIGN}`),
        ]);

      let preanswer = res_deptandteam?.data?.allcandidate?.filter((data) => {
        return (
          data?.overallstatus ===
            single_round?.data?.interviewRound?.roundname &&
          data.interviewrounds?.some(
            (item) =>
              (item.roundname ===
                single_round?.data?.interviewRound?.roundname &&
                item.roundstatus === "Completed") ||
              (item.roundstatus === "Interview Scheduled" &&
                item?.interviewFormLog?.length > 0)
          )
        );
      });

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

      const interviewFilter = single_round?.data?.interviewRound;
      const checkQuest = interQust?.data?.interviewgroupingquestion?.find(
        (data) =>
          data.designation === interviewFilter?.designation &&
          data.round === interviewFilter?.roundname &&
          data.mode === "Typing Test"
      );

      let lastcandround =
        answer?.length > 0 &&
        answer[answer.length - 1]?.interviewrounds?.find(
          (vic) =>
            vic.roundname === single_round?.data?.interviewRound?.roundname &&
            vic?.questiontype === checkQuest?.typetest
        );

      let liveDiff =
        checkQuest?.typetest === "Manual" &&
        parseInt(checkQuest?.countto) - parseInt(checkQuest?.countfrom);
      let preUserDiff =
        lastcandround?.questiontype === "Manual" &&
        parseInt(lastcandround?.questioncountto) -
          parseInt(lastcandround?.questioncountfrom);

      let liveRunDiff =
        checkQuest?.typetest === "Running"
          ? parseInt(checkQuest?.questioncount)
          : 0;

      let manualCountDiff =
        lastcandround?.questiontype &&
        Number(lastcandround?.questioncountto) -
          Number(lastcandround?.questioncountfrom);

      let manualCountDiffinc =
        manualCountDiff &&
        `${
          Number(lastcandround?.questioncountfrom) + Number(manualCountDiff) + 1
        } - ${
          Number(lastcandround?.questioncountto) + Number(manualCountDiff) + 1
        }`;

      let runningcount = lastcandround?.questiontype
        ? Number(lastcandround?.questioncount) + Number(liveRunDiff)
        : checkQuest?.questioncount;

      let manualcount =
        manualCountDiffinc && liveDiff === preUserDiff
          ? manualCountDiffinc
          : `${Number(checkQuest?.countfrom)}-${Number(checkQuest?.countto)}`;

      const data_question =
        checkQuest &&
        interQuestions?.data?.interviewformdesign?.filter(
          (data) =>
            data.category === checkQuest.category &&
            data.subcategory === checkQuest.subcategory &&
            data.designation.includes(checkQuest.designation) &&
            data.type === "Typing Test"
        );

      setValueSetInterview({
        typetest: checkQuest?.typetest,
        questioncount:
          checkQuest?.typetest === "Random"
            ? checkQuest?.questioncount
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
            // let startIndex = parseInt(count);
            // let endIndex = startIndex + parseInt(count);
            let startIndex = lastcandround?.questiontype
              ? parseInt(lastcandround?.questioncount) > data_question.length
                ? 0
                : parseInt(lastcandround?.questioncount)
              : 0;
            let endIndex = startIndex + parseInt(checkQuest?.questioncount);
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

      const answeer = filterData(
        checkQuest?.typetest,
        checkQuest?.typetest === "Manual"
          ? manualcount
          : checkQuest?.typetest === "Running"
          ? runningcount
          : checkQuest?.questioncount
      );

      setInterviewFormLogArray(
        single_round?.data?.interviewRound?.interviewFormLog
      );
      setRetestCount(single_round?.data?.interviewRound?.retestcount);
      setRetestFor(single_round?.data?.interviewRound?.retestfor);
      setInterviewGetForm(answeer?.length > 0 ? answeer : []);
      setDuration(`${checkQuest.duration}:00`);
      setDurationInitial(`${checkQuest.duration}:00`);

      setTestCategory(checkQuest?.category);
      setTestSubCategory(checkQuest?.subcategory);
      setNextButton(true);

      setPrevButton(false);
      let {
        typingspeed,
        typingspeedvalidation,
        typingspeedfrom,
        typingspeedto,
        typingspeedstatus,
        typingaccuracy,
        typingaccuracyvalidation,
        typingaccuracyfrom,
        typingaccuracyto,
        typingaccuracystatus,
        typingmistakes,
        typingmistakesvalidation,
        typingmistakesfrom,
        typingmistakesto,
        typingmistakesstatus,
      } = answeer[0];

      setTypingTestDatas({
        typingspeed: typingspeed,
        typingspeedvalidation: typingspeedvalidation,
        typingspeedfrom: typingspeedfrom,
        typingspeedto: typingspeedto,
        typingspeedstatus: typingspeedstatus,

        typingaccuracy: typingaccuracy,
        typingaccuracyvalidation: typingaccuracyvalidation,
        typingaccuracyfrom: typingaccuracyfrom,
        typingaccuracyto: typingaccuracyto,
        typingaccuracystatus: typingaccuracystatus,

        typingmistakes: typingmistakes,
        typingmistakesvalidation: typingmistakesvalidation,
        typingmistakesfrom: typingmistakesfrom,
        typingmistakesto: typingmistakesto,
        typingmistakesstatus: typingmistakesstatus,
      });

      let quote = answeer[0]?.question;
      setTypingQuestion(quote);
      questionLengthRef.current = quote?.length;
      const [minutesStr, secondsStr] = answeer[0]?.typingduration?.split(":");

      // Parse the minutes and seconds strings into integers
      const minutes = parseInt(minutesStr, 10);
      const seconds = parseInt(secondsStr, 10);

      // Calculate the total seconds
      const totalSeconds = minutes * 60 + seconds;

      setTime(Number(totalSeconds));
      setTimeInitial(totalSeconds);
      setTypingTestInput("");
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
  const [formatedQuote, setFormatedQuote] = useState("");
  const [typingQuestion, setTypingQuestion] = useState("");
  const [time, setTime] = useState(null);
  const [timeInitial, setTimeInitial] = useState();
  const [timer, setTimer] = useState(null);
  const [mistakes, setMistakes] = useState(0);

  // useEffect(() => {
  //   renderNewQuote();
  // }, []);

  useEffect(() => {
    // const arr = typingQuestion.split("").map((value, index) => {&#x23CE;
    //   return `<span class='quote-chars' key=${index}>${value}</span>`;
    // });
    const arr = typingQuestion.split("").map((value, index) => {
      if (value === "\n") {
        // If the value is a newline character, return the arrow span and a <br> tag wrapped in a span
        return `<span class='arrow-span'>&#x21B5;</span><span class='quote-chars' key=${index}>\n</span>`;
      }
      // Otherwise, return the value wrapped in a span with the class 'quote-chars'
      return `<span class='quote-chars' key=${index}>${value}</span>`;
    });
    let spantag = arr.join("");
    const formattedQuotes = spantag.replace(/\n/g, "<br>");

    setQuote(spantag);

    setFormatedQuote(formattedQuotes);
  }, [typingQuestion]);

  const startTest = () => {
    setMistakes(0);
    clearInterval(timer);
    // setTimer(setInterval(updateTimer, 1000));
  };

  // const updateTimer = () => {
  //   setTime((prevTime) => {
  //     if (prevTime === 0) {
  //       clearInterval(timer);
  //       const currentInput = userInputRef.current.value;
  //       const currentMistakes = mistakesRef.current;
  //       displayResult(prevTime, true, currentInput, currentMistakes);
  //       return null;
  //     } else {
  //       return prevTime - 1;
  //     }
  //   });
  // };
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (startTime) {
      setMistakes(0);
      clearInterval(timeRef.current);
      timeRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;

          if (newTime === 0) {
            const currentInput = userInputRef.current.value;
            const currentMistakes = mistakesRef.current;
            displayResult(newTime, true, currentInput, currentMistakes);
            clearInterval(timeRef.current);
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(timeRef.current);
    }

    return () => {
      clearInterval(timeRef.current);
    };
  }, [startTime]);

  const displayResult = (pretime, from, currinp, currmis) => {
    // let timeTaken = 1;
    // if (pretime !== 0) {
    // }
    //google speed calculation
    let timeTaken = (timeInitial - pretime) / 60;
    const totalWords = currinp.length / 5;
    const wpm = (totalWords / timeTaken).toFixed(2);

    const accuracy = Math.round(
      ((currinp.length - currmis) / currinp.length) * 100
    );

    interviewGetForm[indexViewQuest].typingspeedans = wpm;
    interviewGetForm[indexViewQuest].typingaccuracyans = accuracy;
    interviewGetForm[indexViewQuest].typingmistakesans = currmis;
    interviewGetForm[indexViewQuest].timetaken = timeInitial - pretime;
    interviewGetForm[indexViewQuest].attendby = "Candidate";
    interviewGetForm[indexViewQuest].userans =
      currinp.length > 0
        ? [
            `Speed - ${wpm} wpm`,
            `Accuracy - ${accuracy}%`,
            `Mistakes - ${currmis}`,
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
        case "Equal to":
          return Number(value) === Number(threshold);
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
      currmis,
      typingtestDatas?.typingmistakesvalidation,
      typingtestDatas?.typingmistakes,
      typingtestDatas?.typingmistakesstatus,
      typingtestDatas?.typingmistakesfrom,
      typingtestDatas?.typingmistakesto
    );

    let eligibleResult = isValidSpeed && isValidAccuracy && isValidMistakes;

    let finalResult = from && eligibleResult ? true : false;

    interviewGetForm[indexViewQuest].typingresult = finalResult
      ? "Eligible"
      : "Not Eligible";

    interviewGetForm[indexViewQuest].typingresultstatus = [
      isValidSpeed,
      isValidAccuracy,
      isValidMistakes,
    ];

    // setOnGetStatus(finalResult);
    clearInterval(timer);
    setTimer(null);
    setTime(null);
    setQuote("");
    setStartTime(null);

    if (indexViewQuest >= interviewGetForm?.length - 1) {
      const answer = interviewGetForm
        .filter((data) => data.userans)
        .map((item) => {
          return {
            ...item,
            question: item.question,
            userans: item.userans,
            type: item.type,
            secondarytodo: item?.secondarytodo,
            answers: item.answers,
            statusAns: item.statusAns,
            typingspeedans: item?.typingspeedans,
            typingaccuracyans: item?.typingaccuracyans,
            typingmistakesans: item?.typingmistakesans,
            useransstatus: item?.useransstatus,
            optionArr: item.optionArr,
          };
        });
      sendRequest(answer);
    } else {
      handleConditionCheck(finalResult);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const div = document.getElementById("quote");
      div.scrollTop += 20; // Adjust the scroll amount as needed
      scrollRef.current = 0;
    }
  };

  const handleInput = (e) => {
    e.preventDefault();
    let input = e.target.value;
    if (input.length === 1 && !startTime) {
      setStartTime(Date.now());
      startTest();
    }
    setTypingTestInput(input);
    // const quoteChars = document.querySelectorAll(".quote-chars");
    const userInputChars = input.split("");
    if (input.length % scrollRef.current === 0 && scrollRef.current !== 0) {
      const div = document.getElementById("quote");
      div.scrollTop += 50; // Adjust the scroll amount as needed
      // scrollRef.current = 0;
    }

    quoteCharsRef.current.forEach((char, index) => {
      if (char.innerText === userInputChars[index]) {
        char.classList.add("success");
      } else if (!userInputChars[index]) {
        char.classList.remove("success");
        char.classList.remove("fail");
      } else {
        if (!char.classList.contains("fail")) {
          // setMistakes((prevMistakes) => prevMistakes + 1);
          setMistakes((prevMistakes) => {
            const updatedMistakes = prevMistakes + 1;
            mistakesRef.current = updatedMistakes; // Update mistakesRef
            return updatedMistakes;
          });
          char.classList.add("fail");
        }
      }

      // const check = Array.from(quoteChars).every((element) =>
      //   element.classList.contains("success")
      // );
      const check =
        userInputChars.length === quoteCharsRef.current.length &&
        userInputChars.every(
          (char, index) => char === quoteCharsRef.current[index].innerText
        );
      const currentInputlen = userInputRef.current.value;
      if (check || currentInputlen?.length === questionLengthRef.current) {
        const currentInput = userInputRef.current.value;
        const currentMistakes = mistakesRef.current;
        displayResult(time, true, currentInput, currentMistakes);
      }
    });
  };

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

      // const modifiedSecondaryTodo = data?.secondarytodo?.map(item => ({
      //   ...item,
      //   nextbtn: true,
      //   nextquestion: false
      // }));

      // const answerSecondary = modifiedSecondaryTodo?.filter(
      //   item => item?.options === value && item?.extraquestion === "Sub Question"
      // );

      const answerSecondary = data?.secondarytodo?.filter(
        (item) =>
          item?.options === value && item?.extraquestion === "Sub Question"
      );
      answerSecondary?.length > 0 ? setNextButton(false) : setNextButton(true);
      setSecondaryTodo(answerSecondary?.length > 0 ? answerSecondary : []);
      interviewGetForm[index].userans = value;
      interviewGetForm[index].status = ans?.status;
      interviewGetForm[index].questionattended = true;

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
        ? data?.secondarytodo?.filter(
            (item) =>
              (item?.options == validationsOptions ||
                item?.options === "NOANSWER") &&
              item?.extraquestion === "Sub Question"
          )
        : isValid
        ? data?.secondarytodo?.filter(
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
        : interviewGetForm[index]?.optionArr[0].status;

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
                userans: [],
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

      let newFind = updatedArray.find((item, inds) => inds === index);
      let eligibileorNotData = newFind?.secondarytodo[
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

      let newFind = updatedArray.find((item, inds) => inds === index);
      let eligibileorNotData = newFind?.secondarytodo[subindex].optionslist[0];
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

      let newFind = updatedArray.find((item, inds) => inds === index);
      let eligibileorNotData = newFind?.secondarytodo[subindex].optionslist[0];
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

      let newFind = updatedArray.find((item, inds) => inds === index);
      let eligibileorNotData = newFind?.secondarytodo[subindex].optionslist[0];
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
      let newFind = updatedArray.find((item, inds) => inds === index);
      let eligibileorNotData = newFind?.secondarytodo[subindex].optionslist[0];
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
      let newFind = updatedArray.find((item, inds) => inds === index);
      let fromdate = newFind?.secondarytodo[subindex].optionslist[0].answer;
      let todate = newFind?.secondarytodo[subindex].optionslist[1].answer;

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
    let number = parseInt(whatques.match(/\d+/)[0]);
    let upcomingquestions = [];
    for (let i = number; i <= 100; i++) {
      upcomingquestions.push(`Sub Question ${i}`);
    }

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

      let newFind = updatedArray.find((item, inds) => inds === index);
      let eligibileorNotData = newFind?.secondarytodo[
        subindex
      ].optionslist.find((item) => item.answer === value);
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

      let newFind = updatedArray.find((item, inds) => inds === index);
      let eligibileorNotData = newFind?.secondarytodo[subindex].optionslist[0];
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

      let newFind = updatedArray.find((item, inds) => inds === index);
      let eligibileorNotData = newFind?.secondarytodo[subindex].optionslist[0];
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

      let newFind = updatedArray.find((item, inds) => inds === index);
      let eligibileorNotData = newFind?.secondarytodo[subindex].optionslist[0];
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
      } else if (!eligibileorNot && validations === "Between") {
        if (
          Number(value) >= Number(eligibileorNotData.betweenfrom) &&
          Number(value) <= Number(eligibileorNotData.betweento)
        ) {
          isValid = true;
        }
      } else if (!eligibileorNot && validations === "Equal to") {
        if (Number(value) === Number(validationsOptions)) {
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
      let newFind = updatedArray.find((item, inds) => inds === index);
      let eligibileorNotData = newFind?.secondarytodo[subindex].optionslist[0];
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
      let newFind = updatedArray.find((item, inds) => inds === index);
      let fromdate = newFind?.secondarytodo[subindex].optionslist[0].answer;
      let todate = newFind?.secondarytodo[subindex].optionslist[1].answer;

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
                                    >{`Question No.${index + 1} of ${
                                      interviewGetForm?.length
                                    }`}</Box>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={3}></Grid>
                                <TimerComponent />
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            Please choose one of the following
                                            answers:
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
                                              label={`${item?.answer}`}
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
                                              >{`Q. ${item?.question}`}</Typography>
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
                                                        label={option.answer}
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            Please Select Any Date:
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            Please Select Any Date:
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            Please choose one of the following
                                            answers:
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
                                              label={`${item?.answer}`}
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
                                              >{`Q. ${item?.question}`}</Typography>
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
                                                        label={option.answer}
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            Please Select Any Date:
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            Please Select Any Date:
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
                                  >{`Question No.${index + 1} of ${
                                    interviewGetForm?.length
                                  }`}</Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3}></Grid>
                              <TimerComponent />
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please choose one of the following
                                          answers:
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
                                            label={`${item?.answer}`}
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                                      label={option.answer}
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please choose one of the following
                                          answers:
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
                                            label={`${item?.answer}`}
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                                      label={option.answer}
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                  >{`Question No.${index + 1} of ${
                                    interviewGetForm?.length
                                  }`}</Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3}></Grid>
                              <TimerComponent />
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please choose one of the following
                                          answers:
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
                                            label={`${item?.answer}`}
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                                      label={option.answer}
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please choose one of the following
                                          answers:
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
                                            label={`${item?.answer}`}
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                                      label={option.answer}
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                  >{`Question No.${index + 1} of ${
                                    interviewGetForm?.length
                                  }`}</Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3}></Grid>
                              <TimerComponent />
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please choose one of the following
                                          answers:
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
                                            label={`${item?.answer}`}
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                                      label={option.answer}
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please choose one of the following
                                          answers:
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
                                            label={`${item?.answer}`}
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                                      label={option.answer}
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                  >{`Question No.${index + 1} of ${
                                    interviewGetForm?.length
                                  }`}</Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3}></Grid>
                              <TimerComponent />
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
                                Please Select Any Date:
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please choose one of the following
                                          answers:
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
                                            label={`${item?.answer}`}
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                                      label={option.answer}
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please choose one of the following
                                          answers:
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
                                            label={`${item?.answer}`}
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                                      label={option.answer}
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                  >{`Question No.${index + 1} of ${
                                    interviewGetForm?.length
                                  }`}</Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3}></Grid>
                              <TimerComponent />
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
                                Please Select Any Date:
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please choose one of the following
                                          answers:
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
                                            label={`${item?.answer}`}
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                                      label={option.answer}
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please choose one of the following
                                          answers:
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
                                            label={`${item?.answer}`}
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                                      label={option.answer}
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                    >{`Question No.${index + 1} of ${
                                      interviewGetForm?.length
                                    }`}</Box>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={3}></Grid>
                                <TimerComponent />
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            Please choose one of the following
                                            answers:
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
                                              label={`${item?.answer}`}
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
                                              >{`Q. ${item?.question}`}</Typography>
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
                                                        label={option.answer}
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            Please Select Any Date:
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            Please Select Any Date:
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            Please choose one of the following
                                            answers:
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
                                              label={`${item?.answer}`}
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
                                              >{`Q. ${item?.question}`}</Typography>
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
                                                        label={option.answer}
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            Please Select Any Date:
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                            Please Select Any Date:
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
                    } else if (data?.type === "Typing Test") {
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
                                  >{`Question No.${index + 1} of ${
                                    interviewGetForm?.length
                                  }`}</Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3}></Grid>
                              <TimerComponent />
                            </Grid>
                          </ListItem>
                          <Paper style={paper1}>
                            <ListItem
                              style={{
                                maxHeight: "200px",
                                // overflowY: "auto",
                              }}
                            >
                              <ListItemText>
                                <Typography
                                  style={typography1}
                                  variant="h6"
                                  // sx={{
                                  //   maxHeight: "200px",
                                  //   overflowY: "auto",
                                  //   padding: "20px",
                                  // }}
                                >
                                  <div
                                    id="quote"
                                    onPaste={(e) => e.preventDefault()}
                                    onCopy={(e) => e.preventDefault()}
                                    onCut={(e) => e.preventDefault()}
                                    onDrag={(e) => e.preventDefault()}
                                    onDrop={(e) => e.preventDefault()}
                                    onContextMenu={(e) => e.preventDefault()}
                                    style={{
                                      maxHeight: "200px",
                                      overflowY: "auto",
                                      padding: "20px",
                                      fontSize: "1.5rem",
                                      whiteSpace: "pre-wrap",
                                      lineHeight: "25px",
                                    }}
                                    dangerouslySetInnerHTML={{
                                      __html: formatedQuote,
                                    }}
                                    ref={(el) =>
                                      (quoteCharsRef.current =
                                        el &&
                                        el.querySelectorAll(".quote-chars"))
                                    }
                                  ></div>
                                </Typography>
                              </ListItemText>
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
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                              }}
                            >
                              <ListItemText>
                                <Typography
                                  variant="h6"
                                  style={{ marginRight: "12px" }}
                                >
                                  Please Enter The Above Text Here:
                                </Typography>
                              </ListItemText>

                              <div className="stats">
                                <p style={{ margin: "0 10px" }}>
                                  Time:{" "}
                                  <span id="timer">
                                    {moment.utc(time * 1000).format("mm:ss")}
                                  </span>
                                </p>
                                <p style={{ margin: "0 10px" }}>
                                  Mistakes:{" "}
                                  <span id="mistakes">{mistakes}</span>
                                </p>
                              </div>
                            </div>
                          </ListItem>
                          <Divider />
                          <br />

                          <List style={list1}>
                            <div className="container">
                              <textarea
                                ref={userInputRef}
                                value={typingtestInput}
                                rows="5"
                                id="quote-input"
                                placeholder="Type here to start the test..."
                                onChange={(e) => {
                                  handleInput(e);
                                }}
                                onKeyDown={handleKeyDown}
                                onPaste={(e) => e.preventDefault()}
                                onCopy={(e) => e.preventDefault()}
                                onCut={(e) => e.preventDefault()}
                                onDrag={(e) => e.preventDefault()}
                                onDrop={(e) => e.preventDefault()}
                                onContextMenu={(e) => e.preventDefault()}
                                style={{
                                  width: "100%",
                                  height: "250px",
                                  fontSize: "30px",
                                }}
                              ></textarea>
                            </div>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please choose one of the following
                                          answers:
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
                                            label={`${item?.answer}`}
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                                      label={option.answer}
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please choose one of the following
                                          answers:
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
                                            label={`${item?.answer}`}
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
                                            >{`Q. ${item?.question}`}</Typography>
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
                                                      label={option.answer}
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                                          >{`Q. ${item?.question}`}</Typography>
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
                                          Please Select Any Date:
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
                    }
                  }
                })}
              <br />

              {interviewGetForm?.length > 0 &&
                userName !== "" &&
                password !== "" &&
                startStatus &&
                (mode === "typingtest" ? false : true) && (
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
                          handlePreviousButton();
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

export default InterFormGenerate;
