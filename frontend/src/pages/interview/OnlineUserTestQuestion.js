import React, { useState, useEffect, useRef, useContext } from "react";
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
} from "@mui/material";
import Radio from "@mui/material/Radio";
import InfoIcon from "@mui/icons-material/Info";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { MultiSelect } from "react-multi-select-component";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import "jspdf-autotable";
import axios from "axios";
import { BASE_URL } from "../../services/Authservice";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Headtitle from "../../components/Headtitle";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import hilifelogo from "../../login/hilifelogo.png";
import moment from "moment-timezone";
import "../../App.css";
import { off } from "process";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { AuthContext } from "../../context/Appcontext";


function OnlineUserTestQuestion() {
  const [interviewGet, setInterviewGet] = useState([]);
  const [interviewGetForm, setInterviewGetForm] = useState([]);
  const [secondaryTodo, setSecondaryTodo] = useState([]);
  const [sub1todo, setSub1todo] = useState([]);
  const [sub2Todo, setSub2Todo] = useState([]);
  const [sub3Todo, setSub3Todo] = useState([]);
  const [sub4Todo, setSub4Todo] = useState([]);
  const [indexViewQuest, setIndexViewQuest] = useState(0);
  const [onGetStatus, setOnGetStatus] = useState(false);
  const [onDescStatus, setOnDescStatus] = useState(false);
  const [startStatus, setStartStatus] = useState(true);
  const [nextButton, setNextButton] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [phonenum, setPhonenum] = useState("");
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
  const [isTotalMarks, setIsTotalMarks] = useState(false);
  const handleClickOpenTotalMarks = () => {
    setIsTotalMarks(true);
  };
  const handleCloseTotalMarks = () => {
    setIsTotalMarks(false);
    const url = `${BASE_URL}/task/training/master/traininguserpanel`
    window.open(url, "_self");
    //  backPage(url)
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
          question: item.question,
          userans: item.userans,
          type: item.type,
          secondarytodo: item.secondarytodo,
          answers: item.answers,
          statusAns: item.statusAns,
          useransstatus: item?.useransstatus,
          optionArr: item.optionArr.filter(
            (datas) => datas.status !== "Not-Eligible"
          ),
        };
      });


    // sendRequest(answer);
  };

  const [selectedRadioSecondary, setSelectedRadioSecondary] = useState([]);
  const [selectedRadioSub1Page, setSelectedRadioSub1Page] = useState([]);
  const [selectedRadioSub2Page, setSelectedRadioSub2Page] = useState([]);

  //rendering function for options(value field with comma)
  const customValueRendererSubPage = (valueCate, _categories) => {
    return valueCate
      ? valueCate?.map(({ label }) => label).join(", ")
      : "Please Select ";
  };
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const [errorMessage, setErrorMessage] = useState("");
  const [candidateRoundId, setCandidateRoundId] = useState("");

  //add function
  const sendRequest = async (answer) => {
    try {
      let subprojectscreate = await axios.put(`${SERVICE.SINGLE_TRAINING_USER_RESPONSE}/${interviewGet?._id}`, {
        interviewForm: answer,
        testattended: "true",
        totalmarks: interviewGetForm?.length,
        totalmarksobtained: interviewGetForm?.filter(data => data?.status === "Eligible")?.length,
     
        addedby: [
          {
            name: String(userName),
            date: String(new Date()),
          },
        ],
      });

      let res = await axios.put(
        `${SERVICE.SINGLE_TRAINING_FOR_USER}/${idGen}`,
        {
          taskstatus: "Completed",
          state: "paused",
        }
      )
      setUserName("");
      setPassword("");
      setPhonenum("");
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  //add function
  const sendRequestNext = async (answer) => {
    try {
      let subprojectscreate = await axios.put(`${SERVICE.SINGLE_TRAINING_USER_RESPONSE}/${interviewGet?._id}`, {
        interviewForm: answer,
        testattended: "false",
        addedby: [
          {
            name: String(userName),
            date: String(new Date()),
          },
        ],
      });
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const backPage = useNavigate();
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
  };

  console.log(interviewGetForm , 'interviewGetForm')
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const answer = interviewGetForm?.filter((data) => data.userans)
      ?.map((item) => {
        return {
          question: item.question,
          userans: item.userans,
          type: item.type,
          answers: item.answers,
          documentFiles: item.documentFiles,
          status: item.status,
          optionArr: item.optionArr
        };
      });
    if (interviewGetForm?.every(data => (data?.userans === undefined || data.userans?.length < 1))) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Answer All the Questions"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      handleClickOpenTotalMarks();
      sendRequest(answer);
    }
  };

  // console.log(interviewGetForm , "interviewGetForm")
  const handleConditionCheck = (typetes) => {
    const answer = interviewGetForm?.map((item) => {
      return {
        question: item.question,
        userans: item.userans,
        type: item.type,
        answers: item.answers,
        status: item.status,
        documentFiles: item.documentFiles,
        optionArr: item.optionArr
      };
    });
    setStartTime(null);
    setIndexViewQuest(indexViewQuest + 1);
    sendRequestNext(answer)
    setNextButton(false);
    setSub1todo([]);
    setSecondaryTodo([]);
    setSub2Todo([]);
    setSub3Todo([]);
    setSub4Todo([]);
  };
  const handleConditionCheckBack = (typetes) => {
    setStartTime(null);
    setNextButton(true);
    setIndexViewQuest(indexViewQuest - 1);
    setSub1todo([]);
    setSecondaryTodo([]);
    setSub2Todo([]);
    setSub3Todo([]);
    setSub4Todo([]);
  };

  const idGen = useParams().id;
  const startedby = useParams()?.from;
  const usename = useParams()?.username;
  const pass = useParams()?.password;
  const roundids = useParams()?.roundid;

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
    const [hours, minutes, seconds] = currentTime.split(":");
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

  //get all Sub vendormasters.
  const fetchInterviewGenerate = async () => {
    try {

      let checkInterview = await axios.get(`${SERVICE.ALL_TRAINING_USER_RESPONSE}`);
      let response = checkInterview?.data?.traininguserresponses?.find(data => data.trainingid === idGen)
      setInterviewGet(response)
      if (response && response?.interviewForm?.length > 0  && response.testattended === "false") {
        setInterviewGetForm(response?.interviewForm)
      } 
     else if (response && response?.interviewForm?.length > 0 && response.testattended === "true" ) {
      const url = `${BASE_URL}/task/training/master/trainingpostponedlist`
      window.open(url, "_self");
      }else {
        if (response) {
          const [res_vendor, res_question, res_question_master] = await Promise.all([
            axios.get(`${SERVICE.SINGLE_TRAINING_FOR_USER}/${idGen}`),
            axios.get(`${SERVICE.ALL_ONLINE_TEST_QUESTION}`),
            axios.get(`${SERVICE.ALL_ONLINE_TEST_MASTER}`)
          ]);
          const data_vendor = res_vendor?.data?.strainingforuser;
          const data_vendor_split = data_vendor?.testnames?.split("-(");
          const cateSubCate = data_vendor?.testnames?.replace("(", "")?.replace(")", "")?.split("-")
          let data_question = res_question?.data?.onlinetestquestions?.filter(item => cateSubCate[cateSubCate.length - 2] === item?.category && cateSubCate[cateSubCate.length - 1] === item?.subcategory);
          const data_question_master = res_question_master.data.onlinetestmasters.find(data => data_vendor_split[0] === data?.testname);
          console.log(data_question , data_question_master )
          setDuration(`${data_vendor.duration}:00`);
          setDurationInitial(
            `${data_vendor.duration}:00`
          );
          function filterData(required, count) {
            let startIndex, endIndex;
            switch (required) {

              case "Manual":
                let checkCount = response ? response?.questioncount : count
                let startIndexManual = (parseInt(checkCount?.split("-")[0])) > data_question?.length ? 0 : (parseInt(checkCount?.split("-")[0]) - 1) ;
                let endIndexManual = startIndexManual +( parseInt(checkCount?.split("-")[1]) - parseInt(checkCount?.split("-")[0]));

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
                  let startIndex = (parseInt(response?.questioncount) - parseInt(count)) > data_question.length ? 0 : (parseInt(response?.questioncount) - parseInt(count));
                  let endIndex = startIndex + parseInt(count);
                  // Adjust endIndex if it exceeds the length of the array
                  if (endIndex > data_question.length) {
                    endIndex = (endIndex - data_question.length);
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
                        const randomIndex = Math.floor(Math.random() * data_question.length);
                        if (!randomIndices.includes(randomIndex)) {
                          randomIndices.push(randomIndex);
                        }
                      }
                      return randomIndices.map(index => data_question[index]);
                    };
                  return getRandomData();
              default:
                return "Invalid criteria";
            }
          }

          let answeer = filterData(data_question_master?.type, data_question_master?.type === "Manual" ? `${data_question_master?.countfrom}-${data_question_master?.countto}` : data_question_master?.questioncount)
          setInterviewGetForm(answeer?.length > 0 ? answeer : []);
        }
      }
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };


  const [startTime, setStartTime] = useState(null);
  const [selectedSubPageName, setSelectedSubPageName] = useState([]);
  const handleSubPageChange = (options) => {
    setSelectedSubPageName(options);
  };
  const handleRadioButtonChange = (data, index, value, from) => {
    setSecondaryTodo([]);
    setSub1todo([]);
    setSub2Todo([]);
    setSub3Todo([]);
    setSub4Todo([]);
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
      const answer = value?.map((options) => options?.value);
      let ans = interviewGetForm[index]?.optionArr?.filter((data) =>
        answer?.includes(data?.options)
      );
      let check = ans?.some((data) => data?.status === "Not-Eligible");
      let checkAns = ans?.filter((data) => data?.status !== "Not-Eligible");
      let checkFail = ans?.filter((data) => data?.status === "Not-Eligible")

      interviewGetForm[index].userans = answer;
      interviewGetForm[index].status =
        checkAns?.length > checkFail?.length ||
          checkAns?.length === checkFail?.length
          ? "Eligible"
          : "Not-Eligible";
      if (value?.length !== 0) {
        setNextButton(true);
      } else {
        setNextButton(false);
      }
    }
    if (data?.type === "TextBox") {
      let checkNoAnswer = interviewGetForm[index]?.answers === "No Answer";
      let isValid = interviewGetForm[index]?.answers == value

      interviewGetForm[index].userans = value;
      interviewGetForm[index].status = checkNoAnswer
        ? "Eligible"
        : isValid ? "Eligible" : "Not-Eligible";


      if (value !== "") {
        setNextButton(true);
      } else {
        setNextButton(false);
      }
    }
    if (data?.type === "Text-Alpha") {
      const textOnly = value.replace(/[^a-zA-Z\s;]/g, "");

      let checkNoAnswer = interviewGetForm[index]?.answers === "No Answer";
      let isValid = interviewGetForm[index]?.answers == textOnly


      interviewGetForm[index].userans = textOnly;
      interviewGetForm[index].status = checkNoAnswer
        ? "Eligible"
        : isValid ? "Eligible" : "Not-Eligible";



      if (textOnly !== "") {
        setNextButton(true);
      } else {
        setNextButton(false);
      }
    }
    if (data?.type === "Text-Numeric") {
      const numericOnly = value.replace(/[^0-9.;\s]/g, "");
      let checkNoAnswer = interviewGetForm[index]?.answers === "No Answer";

      let isValid = interviewGetForm[index]?.answers == numericOnly


      interviewGetForm[index].userans = numericOnly;
      interviewGetForm[index].status = checkNoAnswer
        ? "Eligible"
        : isValid ? "Eligible" : "Not-Eligible";

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

  return (
    <div style={{ backgroundColor: "white" }}>
      <div className="interviewFormContainer">
        <Headtitle title={"ONLINE TEST FORM"} />
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
                    ONLINE TEST FORM
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
              {/* Started Online test */}
              {interviewGetForm?.length > 0 &&
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
                                  Please Select Any Options:
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
                                  <MultiSelect
                                    size="small"
                                    options={data?.optionArr?.map((d) => ({
                                      ...d,
                                      label: d.options,
                                      value: d.options,
                                    }))}
                                    value={((data?.userans === undefined) || data?.userans?.length < 1 ) ? [] : data?.userans?.map(data => ({
                                      label: data,
                                      value: data
                                    }))}
                                    onChange={(e) => {
                                      handleSubPageChange(e);
                                      handleRadioButtonChange(data, index, e);
                                    }}
                                    valueRenderer={customValueRendererSubPage}
                                  />
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
              {interviewGetForm?.length > 0 && (
                <>
                  {indexViewQuest !== 0 && (indexViewQuest <= interviewGetForm?.length - 1) && (
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<ChevronRightIcon />}
                      onClick={() => {
                        handleConditionCheckBack(false);
                      }}
                      sx={{ float: "left" }}
                    >
                      Prev
                    </Button>
                  )}
                </>
              )}
              {interviewGetForm?.length > 0 &&
                interviewGetForm[indexViewQuest].userans && (
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

        {/* DESC ALERT DIALOG */}
        <Box>
          <Dialog
            open={isTotalMarks}
            onClose={handleCloseTotalMarks}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="sm"
            fullWidth={true}
          >
            <DialogContent
              sx={{ textAlign: "center", alignItems: "center" }}
            >
              <Typography variant="h6">{`Total No of Questions Attended  : ${interviewGetForm?.length}`}</Typography><br /> <br />
              <Typography variant="h6">{`Total Marks Secured : ${interviewGetForm?.filter(data => data?.status === "Eligible")?.length}`}</Typography><br /> <br />
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={handleCloseTotalMarks}
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

export default OnlineUserTestQuestion;