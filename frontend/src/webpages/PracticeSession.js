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

function PracticeSession() {
    const idGen = useParams().id;
    const GroupingId = useParams()?.groupingid;
    const userId = useParams()?.userid;

    const userInputRef = useRef(null);
    const quoteCharsRef = useRef([]);
    const mistakesRef = useRef(0);
    const scrollRef = useRef(0);
    const timeRef = useRef(0);
    const questionLengthRef = useRef(0);


    useEffect(() => {
        const screenWidth = window.innerWidth;
        scrollRef.current = 200;
        if (screenWidth <= 768) {
            scrollRef.current = 100;
        } else if (screenWidth <= 1024) {
            scrollRef.current = 200;
        }
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 100, behavior: 'smooth' });
    }, []);

    const [interviewGet, setInterviewGet] = useState([]);
    const [interviewGetForm, setInterviewGetForm] = useState([]);
    console.log(interviewGetForm)

    const [indexViewQuest, setIndexViewQuest] = useState(0);

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



    const [selectedRadioSecondary, setSelectedRadioSecondary] = useState([]);
    const [selectedRadioSub1Page, setSelectedRadioSub1Page] = useState([]);
    const [selectedRadioSub2Page, setSelectedRadioSub2Page] = useState([]);


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




    let count = 0;
    //add function
    const sendRequest = async (answer) => {
        console.log(count);
        count++
        try {
            let finalAnswer = answer?.map((t, index) => {
                const speed = t.userans?.includes("InComplete")
                    ? "InComplete"
                    : `${t.typingspeedans} wpm`;

                const accuracy = t.userans?.includes("InComplete")
                    ? "InComplete"
                    : `${t.typingaccuracyans} %`;

                const mistakes = t.userans?.includes("InComplete")
                    ? "InComplete"
                    : t.typingmistakesans;
                const status = t.typingresult === "Eligible" ? true : false;
                const timetakeninseconds = t.userans?.includes("InComplete")
                    ? "InComplete"
                    : `${moment.utc(t.timetaken * 1000).format("mm:ss")}`;

                const speedstatus =
                    t?.typingresultstatus?.length > 0
                        ? t?.typingresultstatus[0]
                        : false;
                const accuracystatus =
                    t?.typingresultstatus?.length > 0
                        ? t?.typingresultstatus[1]
                        : false;
                const mistakesstatus =
                    t?.typingresultstatus?.length > 0
                        ? t?.typingresultstatus[2]
                        : false;

                const actualspeed =
                    t?.typingspeedvalidation === "Between"
                        ? `Between ${t?.typingspeedfrom} to ${t?.typingspeedto}`
                        : `${t?.typingspeedvalidation} ${t?.typingspeed}`;
                const actualacuuracy =
                    t?.typingaccuracyvalidation === "Between"
                        ? `Between ${t?.typingaccuracyfrom} to ${t?.typingaccuracyto}`
                        : `${t?.typingaccuracyvalidation} ${t?.typingaccuracy}`;
                const actualmistakes =
                    t?.typingmistakesvalidation === "Between"
                        ? `Between ${t?.typingmistakesfrom} to ${t?.typingmistakesto}`
                        : `${t?.typingmistakesvalidation} ${t?.typingmistakes}`;
                const actualtime = t?.typingduration;
                return {
                    question: t.question,
                    questionid: t._id,
                    accuracy,
                    accuracystatus,
                    speed,
                    speedstatus,
                    mistakes,
                    mistakesstatus,
                    timetaken: timetakeninseconds,
                    actualtime,
                    individualresult: status,
                    actualspeed,
                    actualacuuracy,
                    actualmistakes
                }
            })
            let overallresult = finalAnswer?.every(data => data?.individualresult)
            let subprojectscreate = await axios.post(SERVICE.ADD_TYPING_SESSION_RESPONSE, {
                company: userData?.company,
                branch: userData?.branch,
                unit: userData?.unit,
                team: userData?.team,
                department: userData?.department,
                employeename: userData?.companyname,
                username: userData?.username,
                designation: userData?.designation,
                employeedbid: userData?._id,
                category: groupingData?.category,
                subcategory: groupingData?.subcategory,
                groupingid: groupingData?._id,
                overallresult,
                result: finalAnswer,
                addedby: [
                    {
                        name: String(userName),
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
            setUserName("");
            setPassword("");
            setPhonenum("");
            localStorage.removeItem("timerDuration");
            localStorage.removeItem("formFilled");





            backPage(
                `/practicesessionresult/${subprojectscreate?.data?.createdData?._id}`
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


    const handleConditionCheck = (typetes) => {
        setIndexViewQuest(indexViewQuest + 1);

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
        setNextButton(false);

    };

    const [duration, setDuration] = useState("");
    const [durationInitial, setDurationInitial] = useState("");
    useEffect(() => {
        const storedDuration = localStorage.getItem("timerDuration");
        const storedFormData = localStorage.getItem("formFilled");
        if (storedDuration && storedFormData) {
            setDuration(storedDuration);
        } else {
            fetchInterviewGenerateTyping()
        }
    }, []);

    useEffect(() => {
        if (duration !== durationInitial) {
            localStorage.setItem("timerDuration", duration);
        }
    }, [duration]);

    useEffect(() => {
        if (
            interviewGetForm?.length > 0
        ) {
            localStorage.setItem("formFilled", true);
        }
    }, [interviewGetForm, userName, password, startStatus]);

    const intervalIdRef = useRef(null);
    // useEffect(() => {
    //     const allFilled = localStorage.getItem("formFilled");
    //     if (allFilled) {
    //         intervalIdRef.current = setInterval(() => {
    //             setDuration((prevTime) => {
    //                 const newTime = reduceTime(prevTime);
    //                 if (newTime === "00:00:00") {
    //                     setShowDescAlert(
    //                         <>
    //                             <ErrorOutlineOutlinedIcon
    //                                 sx={{ fontSize: "100px", color: "orange" }}
    //                             />
    //                             <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //                                 "Time Up! Click OK to Submit your form"
    //                             </p>
    //                         </>
    //                     );
    //                     handleClickOpenerrDesc();
    //                     clearInterval(intervalIdRef.current);
    //                 }
    //                 return newTime;
    //             });
    //         }, 1000);

    //         return () => {
    //             clearInterval(intervalIdRef.current);
    //         };
    //     }
    // }, [interviewGetForm, userName, password, startStatus]);

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


    const [valueSetInterview, setValueSetInterview] = useState("");
    const [userData, setUserData] = useState({});
    const [groupingData, setGroupingData] = useState({});
    const fetchInterviewGenerateTyping = async () => {
        try {
            const [typingQuestions, userResponse] =
                await Promise.all([
                    axios.get(`${SERVICE.GET_TYPING_SESSION_QUESTIONS}/${GroupingId}`),
                    axios.get(`${SERVICE.USER_SINGLE}/${userId}`),
                ]);

            setUserData(userResponse?.data?.suser);
            setGroupingData(typingQuestions?.data?.allPracticeSessionQuestions)


            // Get the questions array
            let allquestions = [...typingQuestions.data.allPracticeSessionQuestions.practiceQuestions];

            // Fisher-Yates shuffle algorithm
            for (let i = allquestions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1)); // Random index
                [allquestions[i], allquestions[j]] = [allquestions[j], allquestions[i]]; // Swap elements
            }

            let answeer = allquestions

            setInterviewGetForm(answeer?.length > 0 ? answeer : []);
            setDuration(`23:00:00`);
            setDurationInitial(`23:00:00`);

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
                        console.log("mistake happenoing in time")
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
                        (Number(value) >= Number(thresholdfrom) &&
                            Number(value) <= Number(thresholdto)) || (Number(value) >= Number(threshold))
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

        });
        const check =
            userInputChars.length === quoteCharsRef.current.length &&
            userInputChars.every(
                (char, index) => char === quoteCharsRef.current[index].innerText
            );
        const currentInputlen = userInputRef.current.value;
        if (check || currentInputlen?.length === questionLengthRef.current) {

            const currentInput = userInputRef.current.value;
            const currentMistakes = mistakesRef.current;
            console.log("handleInput");
            displayResult(time, true, currentInput, currentMistakes);
        }
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





    const textboxstyle = {
        width: "100%",
        maxWidth: "500px",
        boxSizing: "border-box",
    };

    return (
        <div style={{ backgroundColor: "white" }}>
            <div className="interviewFormContainer">
                <Headtitle title={"TYPING PRACTICE"} />
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
                                interviewGetForm?.map((data, index) => {
                                    if (index === indexViewQuest) {
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
                                                        {/* <TimerComponent /> */}
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


                                            </List>
                                        );
                                    }
                                })}
                            <br />


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

            </div>
            <br />
            <br />
        </div>
    );
}

export default PracticeSession;
