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
} from "@mui/material";
import Radio from "@mui/material/Radio";
import InfoIcon from "@mui/icons-material/Info";
import { handleApiError } from "../../components/Errorhandling";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { MultiSelect } from "react-multi-select-component";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { userStyle } from "../../pageStyle";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Headtitle from "../../components/Headtitle";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function InterFormGenerate() {
  const [interviewGetForm, setInterviewGetForm] = useState([]);
  const [indexViewQuest, setIndexViewQuest] = useState(0);
  const [onGetStatus, setOnGetStatus] = useState("");
  const [onDescStatus, setOnDescStatus] = useState(false);
  const [startStatus, setStartStatus] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
  // Description Popup model
  const [isDescOpen, setIsDescOpen] = useState(false);
  const [showDescAlert, setShowDescAlert] = useState();
  const handleClickOpenerrDesc = () => {
    setIsDescOpen(true);
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
          answers: item.answers,
          statusAns: item.statusAns,
          optionArr: item.optionArr.filter(
            (datas) => datas.status !== "Not-Eligible"
          ),
        };
      });
    sendRequest(answer);
  };

  const [selectedSubPageName, setSelectedSubPageName] = useState([]);
  const handleSubPageChange = (options) => {
    setSelectedSubPageName(options);
  };
  //rendering function for options(value field with comma)
  const customValueRendererSubPage = (valueCate, _categories) => {
    return valueCate
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select ";
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  //add function
  const sendRequest = async (answer) => {
    try {
      let subprojectscreate = await axios.post(SERVICE.CREATE_USER_RESPONSE, {
        username: name,
        email: email,
        phonenumber: String(phonenum),
        questionId: idGen,
        interviewForm: answer,
        addedby: [
          {
            name: String(name),
            date: String(new Date()),
          },
        ],
      });
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
      setName("");
      setEmail("");
      setPhonenum("");
      localStorage.removeItem("timerDuration");
      localStorage.removeItem("formFilled");
      backPage("/interview/interviewendpage");
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const [isValidEmail, setIsValidEmail] = useState(false);
  const backPage = useNavigate();
  const nextStep = () => {
    const newErrors = {};
    // Check the validity of field1
    if (!name) {
      newErrors.name = (
        <Typography style={{ color: "red" }}>Name must be required</Typography>
      );
    }
    if (!email) {
      newErrors.email = (
        <Typography style={{ color: "red" }}>Email must be required</Typography>
      );
    } else if (!isValidEmail) {
      newErrors.email = (
        <Typography style={{ color: "red" }}>
          Please enter valid email
        </Typography>
      );
    }
    if (!phonenum) {
      newErrors.phonenum = (
        <Typography style={{ color: "red" }}>
          Phone no must be required
        </Typography>
      );
    }
    setErrors(newErrors);
  };

  


  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
    const answer = interviewGetForm
      .filter((data) => data.userans)
      .map((item) => {
        return {
          question: item.question,
          userans: item.userans,
          type: item.type,
          answers: item.answers,
          statusAns: item.statusAns,
          optionArr: item.optionArr.filter(
            (datas) => datas.status !== "Not-Eligible"
          ),
        };
      });


  
    if (name === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (email === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Email"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (!isValidEmail) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Valid Email"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (phonenum === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Phone Number"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (answer.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Answer Ay One of the Qustions"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
    }
  };
  const handleConditionCheck = () => {
    if (onGetStatus === true && startStatus === true) {
      setIndexViewQuest(indexViewQuest + 1);
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
            answers: item.answers,
            statusAns: item.statusAns,
            optionArr: item.optionArr
              .filter(
                (datas) =>
                  datas.status == "Not-Eligible" || datas.status == "Hold"
              )
              .map((datas) => ({
                description: datas.description,
              })),
          };
        });
      const lastObject = answer[answer.length - 1];
      const descriptions = lastObject.optionArr.map(
        (option) => option.description
      );
      setShowDescAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {descriptions.flat()}
          </p>
        </>
      );
      handleClickOpenerrDesc();
    } else {
      const answer = interviewGetForm
        .filter((data) => data.userans)
        .map((item) => {
          return {
            question: item.question,
            userans: item.userans,
            type: item.type,
            answers: item.answers,
            statusAns: item.statusAns,
            optionArr: item.optionArr.filter(
              (datas) => datas.status !== "Not-Eligible"
            ),
          };
        });
      sendRequest(answer);
    }
  };

  const idGen = useParams().id;
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
      interviewGetForm.length > 0 &&
      name !== "" &&
      isValidEmail &&
      startStatus &&
      phonenum !== ""
    ) {
      localStorage.setItem("formFilled", true);
    }
  }, [interviewGetForm, name, isValidEmail, phonenum, startStatus]);

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
  }, [interviewGetForm, name, isValidEmail, phonenum, startStatus]);

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
      let res_vendor = await axios.get(
        `${SERVICE.INTERVIEWQUESTIONSORDER_SINGLE}/${idGen}`
      );
      setDuration(`${res_vendor?.data?.sinterviewquestionsorder?.duration}:00`);
      setDurationInitial(
        `${res_vendor?.data?.sinterviewquestionsorder?.duration}:00`
      );
      const sortedQuestions =
        res_vendor?.data.sinterviewquestionsorder?.question?.map((value) => {
          return res_vendor?.data?.sinterviewquestionsorder?.interviewForm?.find(
            (q) => q.question.includes(value)
          );
        });
      setInterviewGetForm(sortedQuestions);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  //change form
  const handlechangecontactpersonal = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value?.slice(0, 10);
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setPhonenum(inputValue > 0 ? inputValue : 0);
    }
  };

  const handleRadioButtonChange = (data, index, value) => {
    if (data.type === "Radio") {
      let ans = interviewGetForm[index].optionArr.find((item) => {
        if (item.options === value) {
          return item;
        }
      });
      interviewGetForm[index].userans = value;
      interviewGetForm[index].status = ans?.status;
      if (ans?.status === "Eligible") {
        // interviewGetForm[index].status = ans?.status;
        setOnGetStatus(true);
      } else if (ans?.status === "Not-Eligible" || ans?.status === "Hold") {
        setOnDescStatus(true);
        setOnGetStatus(false);
      } else {
        setOnGetStatus(false);
      }
    }
    if (data.type === "MultipleChoice") {
      const answer = value.map((options) => options.value);
      let ans = interviewGetForm[index].optionArr.filter((data) =>
        answer.includes(data.options)
      );
      let check = ans.some((data) => data.status === "Not-Eligible");
      let checkAns = ans.filter((data) => data.status !== "Not-Eligible");
      let checkFail = ans.filter((data) => data.status === "Not-Eligible");
      setOnGetStatus(checkAns.length > checkFail.length);
      interviewGetForm[index].userans = answer;
      interviewGetForm[index].status =
        checkAns.length > checkFail.length ? "Eligible" : "Not-Eligible";
    }
    if (data.type === "TextBox") {
      let ans = [interviewGetForm[index]?.answers?.toLowerCase()]?.includes(
        value?.toLowerCase()
      );
      setOnGetStatus(ans);
      interviewGetForm[index].userans = value;
      interviewGetForm[index].status = data?.statusAns;
    }
  };
  const durationParts = duration.split(":");
  const hours = durationParts[0];
  const minutes = durationParts[1];
  const seconds = durationParts[2];

  return (
    <Box>
      <Headtitle title={"INTERVIEW FORM"} />
      {!startStatus && (
        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={userStyle.HeaderText}
            style={{ alignSelf: "flex-start" }}
          >
            Interview Form{" "}
          </Typography>
        </Box>
      )}
      <>
        <Box sx={userStyle.dialogbox}>
          {!startStatus && (
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Manage Interview Form
                </Typography>
              </Grid>
            </Grid>
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
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      />
                      {errors.name && <div>{errors.name}</div>}
                      <br />
                      <br />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Email<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="email"
                        placeholder="Please Enter Email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setIsValidEmail(validateEmail(e.target.value));
                        }}
                      />
                      {errors.email && <div>{errors.email}</div>}
                      <br />
                      <br />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Phone Number<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="Number"
                        sx={userStyle.input}
                        placeholder="Please Enter Phone Number"
                        value={phonenum}
                        onChange={(e) => {
                          setPhonenum(e.target.value > 0 ? e.target.value : 0);
                          handlechangecontactpersonal(e);
                        }}
                      />
                      {errors.phonenum && <div>{errors.phonenum}</div>}
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}
          {interviewGetForm.length > 0 &&
            name !== "" &&
            isValidEmail &&
            phonenum !== "" &&
            startStatus &&
            interviewGetForm?.map((data, index) => {
              if (index === indexViewQuest) {
                if (data?.type === "Radio") {
                  return (
                    <List component="nav" aria-label="quiz question">
                      <ListItem
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          style={{
                            alignSelf: "flex-start",
                            flexDirection: "row",
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "10px",
                            border: "2px solid #d5eaf3",
                            padding: "10px",
                            borderRadius: "5px",
                            width: "250px",
                            marginLeft: "-15px",
                            fontWeight: "bold",
                            backgroundColor: "#ecf0f1",
                          }}
                        >
                          <ListItemIcon>
                            <InfoIcon
                              style={{ color: "black", fontSize: "30px" }}
                            />
                          </ListItemIcon>
                          <Box
                            style={{
                              color: "black",
                              fontSize: "18px",
                              fontWeight: "bold",
                              fontFamily: "'Noto Sans Tirhuta', sans-serif",
                            }}
                          >{`Question No.${index + 1} of ${
                            interviewGetForm.length
                          }`}</Box>
                        </Box>
                        <div
                          style={{
                            alignSelf: "flex-end",
                            marginBottom: "10px",
                            marginRight: "15px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                border: "2px solid #d5eaf3",
                                backgroundColor: "#ecf0f1",
                                padding: "15px",
                                width: "80px",
                                borderRadius: "5px",
                                fontSize: "20px",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {hours}
                            </div>
                            <div
                              style={{
                                border: "2px solid #d5eaf3",
                                padding: "15px",
                                width: "80px",
                                borderRadius: "5px",
                                backgroundColor: "#ecf0f1",
                                fontSize: "20px",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {minutes}
                            </div>
                            <div
                              style={{
                                border: "2px solid #d5eaf3",
                                padding: "15px",
                                width: "80px",
                                borderRadius: "5px",
                                backgroundColor: "#ecf0f1",
                                fontSize: "20px",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {seconds}
                            </div>
                          </div>
                        </div>
                      </ListItem>
                      <Paper
                        style={{
                          border: "2px solid #d5eaf3",
                          padding: "5px",
                          borderRadius: "5px",
                          width: "100%",
                          fontWeight: "bold",
                        }}
                      >
                        <ListItem>
                          <ListItemText>
                            <Typography
                              style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                fontFamily: "Arial, Helvetica, sans-serif",
                              }}
                              variant="h6"
                            >{`Q. ${data?.question}`}</Typography>
                          </ListItemText>
                        </ListItem>
                      </Paper>
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

                      <List
                        style={{
                          border: "3px solid #ecf0f1",
                          padding: "5px",
                          borderRadius: "5px",
                          width: "100%",
                          fontWeight: "bold",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          name="radio-buttons-group"
                          value={data?.userans}
                          onChange={(e) =>
                            handleRadioButtonChange(data, index, e.target.value)
                          }
                        >
                          {data.optionArr.map((item) => {
                            return (
                              <FormControlLabel
                                value={`${item.options}`}
                                control={<Radio />}
                                label={`${item.options}`}
                                style={{
                                  marginLeft: "10px",
                                }}
                              />
                            );
                          })}
                        </RadioGroup>
                      </List>
                      <br />
                      <Divider />
                    </List>
                  );
                } else if (data?.type === "TextBox") {
                  return (
                    <List component="nav" aria-label="quiz question">
                      <ListItem
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          style={{
                            alignSelf: "flex-start",
                            flexDirection: "row",
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "10px",
                            border: "2px solid #d5eaf3",
                            backgroundColor: "#ecf0f1",
                            padding: "15px",
                            borderRadius: "5px",
                            width: "250px",
                            marginLeft: "-15px",
                            fontWeight: "bold",
                          }}
                        >
                          <ListItemIcon>
                            <InfoIcon
                              style={{ color: "black", fontSize: "30px" }}
                            />
                          </ListItemIcon>
                          <Box
                            style={{
                              color: "black",
                              fontSize: "20px",
                              fontWeight: "bold",
                            }}
                          >{`Question No.${index + 1} of ${
                            interviewGetForm.length
                          }`}</Box>
                        </Box>
                        <div
                          style={{
                            alignSelf: "flex-end",
                            marginBottom: "10px",
                            marginRight: "15px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                border: "2px solid #d5eaf3",
                                backgroundColor: "#ecf0f1",
                                padding: "15px",
                                width: "80px",
                                borderRadius: "5px",
                                fontSize: "20px",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {hours}
                            </div>
                            <div
                              style={{
                                border: "2px solid #d5eaf3",
                                padding: "15px",
                                width: "80px",
                                borderRadius: "5px",
                                backgroundColor: "#ecf0f1",
                                fontSize: "20px",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {minutes}
                            </div>
                            <div
                              style={{
                                border: "2px solid #d5eaf3",
                                padding: "15px",
                                width: "80px",
                                borderRadius: "5px",
                                backgroundColor: "#ecf0f1",
                                fontSize: "20px",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {seconds}
                            </div>
                          </div>
                        </div>
                      </ListItem>
                      <Paper
                        style={{
                          border: "2px solid #d5eaf3",
                          padding: "5px",
                          borderRadius: "5px",
                          width: "100%",
                          fontWeight: "bold",
                        }}
                      >
                        <ListItem>
                          <ListItemText>
                            <Typography
                              style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                fontFamily: "Arial, Helvetica, sans-serif",
                              }}
                              variant="h6"
                            >{`Q. ${data?.question}`}</Typography>
                          </ListItemText>
                        </ListItem>
                      </Paper>
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

                      <List
                        style={{
                          border: "3px solid #ecf0f1",
                          padding: "15px",
                          borderRadius: "5px",
                          width: "100%",
                          fontWeight: "bold",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Answer"
                          style={{
                            width: "500px",
                            marginLeft: "10px",
                          }}
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
                    </List>
                  );
                } else if (data?.type === "MultipleChoice") {
                  return (
                    <>
                      <List component="nav" aria-label="quiz question">
                        <ListItem
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            style={{
                              alignSelf: "flex-start",
                              flexDirection: "row",
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "10px",
                              border: "2px solid #d5eaf3",
                              padding: "15px",
                              borderRadius: "5px",
                              width: "250px",
                              marginLeft: "-15px",
                              fontWeight: "bold",
                              backgroundColor: "#ecf0f1",
                            }}
                          >
                            <ListItemIcon>
                              <InfoIcon
                                style={{ color: "black", fontSize: "30px" }}
                              />
                            </ListItemIcon>
                            <Box
                              style={{
                                color: "black",
                                fontSize: "20px",
                                fontWeight: "bold",
                              }}
                            >{`Question No.${index + 1} of ${
                              interviewGetForm.length
                            }`}</Box>
                          </Box>
                          <div
                            style={{
                              alignSelf: "flex-end",
                              marginBottom: "10px",
                              marginRight: "15px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  border: "2px solid #d5eaf3",
                                  backgroundColor: "#ecf0f1",
                                  padding: "15px",
                                  width: "80px",
                                  borderRadius: "5px",
                                  fontSize: "20px",
                                  fontWeight: "600",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {hours}
                              </div>
                              <div
                                style={{
                                  border: "2px solid #d5eaf3",
                                  padding: "15px",
                                  width: "80px",
                                  borderRadius: "5px",
                                  backgroundColor: "#ecf0f1",
                                  fontSize: "20px",
                                  fontWeight: "600",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {minutes}
                              </div>
                              <div
                                style={{
                                  border: "2px solid #d5eaf3",
                                  padding: "15px",
                                  width: "80px",
                                  borderRadius: "5px",
                                  backgroundColor: "#ecf0f1",
                                  fontSize: "20px",
                                  fontWeight: "600",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {seconds}
                              </div>
                            </div>
                          </div>
                        </ListItem>
                        <Paper
                          style={{
                            border: "2px solid #d5eaf3",
                            padding: "5px",
                            borderRadius: "5px",
                            width: "100%",
                            fontWeight: "bold",
                          }}
                        >
                          <ListItem>
                            <ListItemText>
                              <Typography
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "600",
                                  fontFamily: "Arial, Helvetica, sans-serif",
                                }}
                                variant="h6"
                              >{`Q. ${data?.question}`}</Typography>
                            </ListItemText>
                          </ListItem>
                        </Paper>
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

                        <List
                          style={{
                            border: "3px solid #ecf0f1",
                            padding: "15px",
                            borderRadius: "5px",
                            width: "100%",
                            fontWeight: "bold",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <Grid container style={{ marginLeft: "10px" }}>
                            <Grid items md={3} sx={12} sm={12}>
                              <MultiSelect
                                size="small"
                                options={data?.optionArr?.map((d) => ({
                                  ...d,
                                  label: d.options,
                                  value: d.options,
                                }))}
                                value={selectedSubPageName}
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
                      </List>
                    </>
                  );
                }
              }
            })}
          <br />
          {interviewGetForm.length > 0 &&
            name !== "" &&
            isValidEmail &&
            phonenum !== "" &&
            startStatus && (
              <>
                {indexViewQuest < interviewGetForm.length - 1 && (
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
                {indexViewQuest >= interviewGetForm.length - 1 && (
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
          {interviewGetForm.length > 0 &&
            name !== "" &&
            isValidEmail &&
            phonenum !== "" &&
            !startStatus && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ChevronRightIcon />}
                  onClick={() => {
                    setStartStatus(true);
                  }}
                  sx={{ float: "right" }}
                >
                  Start
                </Button>
                <br /> <br />
              </>
            )}
        </Box>
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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
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
    </Box>
  );
}

export default InterFormGenerate;
