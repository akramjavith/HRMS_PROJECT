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
} from "@mui/material";
import Radio from "@mui/material/Radio";
import { handleApiError } from "../components/Errorhandling";
import InfoIcon from "@mui/icons-material/Info";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RadioGroup from "@mui/material/RadioGroup";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Backdrop } from "@mui/material";
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

function InterviewFormHr() {
  const idGen = useParams().id;
  const startedby = useParams()?.from;
  const usename = useParams()?.username;
  const pass = useParams()?.password;
  const roundids = useParams()?.roundid;
  const candidateid = useParams()?.candidateid;

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

  const [isLoading, setIsLoading] = useState(false);

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
      let subprojectscreate = await axios.post(SERVICE.CREATE_USER_RESPONSE, {
        username: userName,
        password: password,
        // phonenumber: String(phonenum),
        testcategory: String(testCategory),
        testsubcategory: String(testSubCategory),
        questionId: idGen,
        interviewForm: answer,
        addedby: [
          {
            name: String(userName),
            date: String(new Date()),
          },
        ],
      });

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
  const handleConditionCheck = () => {
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

  //get all Sub vendormasters.
  const fetchInterviewGenerateHr = async () => {
    try {
      setIsLoading(true);
      let single_round = await axios.post(
        `${SERVICE.INTERVIEW_ROUND}/${candidateid}/${roundids}`
      );
      let res_vendor = await axios.get(
        `${SERVICE.INTERVIEWQUESTIONSORDER_SINGLE}/${idGen}`
      );
      setDuration(`${res_vendor.data.sinterviewquestionsorder.duration}:00`);
      setDurationInitial(
        `${res_vendor.data.sinterviewquestionsorder.duration}:00`
      );
      setInterviewGet(res_vendor.data.sinterviewquestionsorder);

      let res = await axios.get(SERVICE.INTERVIEWQUESTION);

      let cat = res_vendor.data.sinterviewquestionsorder?.category;
      let subcat = res_vendor.data.sinterviewquestionsorder?.subcategory;

      setTestCategory(cat);
      setTestSubCategory(subcat);

      let byyy = startedby === "autologin" ? true : false;

      let intQues = res?.data?.interviewquestions?.filter(
        (data) =>
          data.category === cat &&
          data.subcategory === subcat &&
          !data?.typingtest
      );

      setAllQuestionArray(single_round?.data?.interviewRound?.interviewForm);

      let exceptTyping = single_round?.data?.interviewRound?.interviewForm;

      // let mainSame = single_round?.data?.interviewRound?.interviewForm;

      let mainSame = exceptTyping?.map((data) => {
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
              };
            } else {
              return {
                ...data1,
                uploadedimage: "",
                uploadedimagename: "",
                data: "",
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
          };
        } else {
          return {
            ...data,
            uploadedimage: "",
            uploadedimagename: "",
            data: "",
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
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [allInterviewQuestions, setAllInterviewQuestions] = useState([]);

  //get all Sub vendormasters.
  const fetchInterviewQuestions = async () => {
    try {
      let res = await axios.get(SERVICE.INTERVIEWQUESTION);

      setAllInterviewQuestions(res?.data?.interviewquestions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchInterviewQuestions();
  }, []);

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

  return (
    <div style={{ backgroundColor: "white" }}>
      <LoadingBackdrop open={isLoading} />
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
                          handleConditionCheck();
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

export default InterviewFormHr;
