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
import CancelIcon from '@mui/icons-material/Cancel';
import BlockIcon from '@mui/icons-material/Block';
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
import ScreenshotInterviewRounds from "../components/ScreenshotInterviewRounds";
import { Fab, DialogTitle, TextField, Tooltip, FormLabel } from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import LanguageIcon from '@mui/icons-material/Language';
import Select from "react-select";
function InterviewTestRoundCheck() {
    const [isLoading, setIsLoading] = useState(true);

    const languageOptions = [
        { value: "English", label: "English" },
        { value: "தமிழ்", label: "தமிழ்" },
    ];

    const [selectedLanguage, setSelectedLanguage] = useState({ value: 'English', label: 'English' }); // Default to English

    const handleChange = (selectedOption) => {
        setSelectedLanguage(selectedOption);

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
    const idGen = useParams().id;
    const idGenCheck = useParams().idgen;
    const startedby = useParams()?.from;
    const mode = useParams()?.mode;
    const candidateid = useParams()?.candidateid;
    const roundid = useParams()?.roundid;
    const autofill = useParams()?.autofill;


    const testname = useParams()?.testname;
    const designation = useParams()?.designation;
    const roundname = useParams()?.roundname;
    const employeename = useParams()?.employeename;

    const roundDetails = {
        roundname
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

    // useEffect(() => {
    //     if (testcount < 0) {
    //         testStatusUpdate(roundid, "Completed");
    //     } else if (testcount > 0) {
    //         testStatusUpdate(roundid, "Interview Scheduled");
    //     }
    // }, [testcount, roundid]);

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const handleClickOpenCancel = () => {
        setIsCancelOpen(true);
    };
    const handleCloseCancel = () => {
        setIsCancelOpen(false);
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




    //add function
    const sendRequest = async (answer) => {
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

            let subprojectscreate = await axios.post(SERVICE.CREATE_INTERVIEW_TEST_RESPONSE, {
                designation,
                round: roundname,
                employeename: userData?.companyname,
                company: userData?.company,
                branch: userData?.branch,
                unit: userData?.unit,
                team: userData?.team,
                department: userData?.department,
                interviewForm: answer,
                mode: mode,
                testname,
                category: catSubCat?.category,
                subcategory: catSubCat?.subcategory,
                questiontype: valueSetInterview?.typetest,
                questioncount: valueSetInterview?.questioncount,
                questioncountfrom: valueSetInterview?.countfrom,
                questioncountto: valueSetInterview?.countto,
                date: moment().format("YYYY-MM-DD"),
                time: moment().format("HH:mm"),
                totalmarks: ignoredquestions?.length > 0 ? String(finalTotalMarks) : String(totalMarks),
                eligiblemarks: ignoredquestions?.length > 0 ? String(finalEligibleMarks) : String(eligibleMarks),
            });

            // await testAnswerUpdate(candidateRoundId, answer);
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

            const linksArray = JSON.parse(localStorage.getItem("roundLinks") || "[]");
            let currentIndex = parseInt(localStorage.getItem("currentIndex") || "0");

            if (currentIndex < linksArray.length - 1) {
                currentIndex += 1;
                localStorage.setItem("currentIndex", currentIndex.toString());
                window.location.href = linksArray[currentIndex].link; // Open next round in same tab
            } else {
                localStorage.removeItem("roundLinks");
                localStorage.removeItem("currentIndex");

                backPage(
                    `/interview/interviewendpage/testing/${mode}/${subprojectscreate?.data?.createdresponse?._id}`
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
    //submit option for saving
    const handleSubmit = (e, ignore) => {
        e.preventDefault();
        nextStep();

        let primaryAnswer = interviewGetForm[indexViewQuest]?.userans;
        let firstCheckArray = Array.isArray(primaryAnswer) && primaryAnswer?.length === 0;
        let firstCheckStr = ((typeof primaryAnswer) === "string") && (primaryAnswer === "");



        if (!ignore && (mode !== "typingtest") && (!primaryAnswer || firstCheckArray || firstCheckStr)) {
            // setShowEmptyAlert();
            console.log("log1")
            handleClickOpenerrEmpty();
            return;
        }

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
                    attendby: "Candidate",
                };
            });
        if (answer?.length < 1) {
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
            handleConditionCheck(false, true)
        } else {
            handleSubmit(event, true)
        }

    }
    const [additionalOpen, setAdditionalOpen] = useState(false);
    const handleConditionCheck = (typetes, ignore) => {

        let primaryAnswer = interviewGetForm[indexViewQuest]?.userans;
        let firstCheckArray = Array.isArray(primaryAnswer) && primaryAnswer?.length === 0;
        let firstCheckStr = ((typeof primaryAnswer) === "string") && (primaryAnswer === "");



        if (!ignore && (mode !== "typingtest") && (!primaryAnswer || firstCheckArray || firstCheckStr)) {
            // setShowEmptyAlert();
            console.log("log1")
            handleClickOpenerrEmpty();
            return;
        }

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
            interviewGetForm?.length > 0
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


    const [canidateDetails, setCandidateDetails] = useState([])
    const getCandidateDetails = async () => {
        try {

            setCandidateDetails({});
            return {};
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    const [totalMarks, setTotalMarks] = useState(0);
    const [eligibleMarks, setEligibleMarks] = useState(0);
    //get all Sub vendormasters.
    const [catSubCat, setCatSubCat] = useState({
        category: "",
        subcategory: [],
    })

    const [userData, setUserData] = useState({});
    useEffect(() => {
        getUserDetails();
    }, [employeename]);
    const getUserDetails = async () => {
        let single_user = await axios.get(
            `${SERVICE.USER_SINGLE}/${employeename}`
        );
        setUserData(single_user?.data?.suser)
    }
    const fetchInterviewGenerate = async () => {
        try {
            const [interQust, interQuestions] =
                await Promise.all([
                    axios.get(`${SERVICE.INTERVIEWQUESTIONGROUPING}`),
                    axios.get(`${SERVICE.ALL_ONLINE_TEST_QUESTION}`),
                ]);
            let singleCandidate = await getCandidateDetails();

            let checkQuest = interQust?.data?.interviewgroupingquestion?.find(
                (data) =>
                    data?.designation === designation &&
                    data?.round === roundname &&
                    data.mode === "Online or Interview Test" &&
                    testname === data.testname
            );

            const res_deptandteam = await axios.post(SERVICE.DYNAMIC_TEST_RESPONSE, {
                pipeline: [
                    {
                        $match: {
                            designation,
                            round: roundname,
                            mode,
                            testname,
                            questiontype: checkQuest?.typetest
                        }
                    },
                    {
                        $sort: { createdAt: -1 } // Sort by createdAt in descending order (latest first)
                    },
                    {
                        $limit: 1 // Get only the most recent document
                    }
                ]
            });
            let preanswer = res_deptandteam?.data?.interviewquestions



            setCatSubCat({
                category: checkQuest?.category,
                subcategory: checkQuest?.subcategory,
            })

            // let intQuesAllss = interQuestions?.data?.onlinetestquestions?.filter(
            //     (data) =>
            //         checkQuest?.category === data.category &&
            //         checkQuest?.subcategory?.includes(data.subcategory)
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

                if ((!hasWorkMode || !hasStatusExp) || (workmode?.length === 0 && candidatestatusexp?.length === 0)) {
                    // If any required value is missing, return the question
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
                    ? preanswer
                    : [];

            setInterviewFormLogArray(
                []
            );
            setRetestCount(checkQuest?.retestcount);
            setRetestFor(checkQuest?.retestfor);


            let checKAnswer =
                answer?.length > 0 &&
                answer[answer.length - 1]

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

    // useEffect(() => {
    //     const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    //     window.addEventListener("beforeunload", beforeUnloadHandler);
    //     return () => {
    //         window.removeEventListener("beforeunload", beforeUnloadHandler);
    //     };
    // }, []);

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
                                                                        >{selectedLanguage?.value === "English" ? `Question No.${index + 1} of ${interviewGetForm?.length
                                                                            }` : `கேள்வி எண்.${index + 1} of ${interviewGetForm?.length
                                                                            }`}</Box>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item xs={12} md={3}></Grid>
                                                            </Grid>
                                                        </ListItem>
                                                        <Paper style={{ ...paper1, position: "relative" }}>
                                                            <ListItem

                                                            >
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
                                                                {/* Additional Info Button */}
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
                                                                    {selectedLanguage?.value === "English" ? "Please choose one of the following answers:" : "பின்வரும் பதில்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்:"}                                                                </Typography>
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
                                                        <ListItem

                                                        >
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
                                                            {/* Additional Info Button */}
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
                                                        <ListItem

                                                        >
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
                                                            {/* Additional Info Button */}
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
                                                        <ListItem

                                                        >
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
                                                            {/* Additional Info Button */}
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
                                                            <ListItem

                                                            >
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
                                                                {/* Additional Info Button */}
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

                            {interviewGetForm?.length > 0 && (
                                <>
                                    {indexViewQuest < interviewGetForm?.length - 1 && (
                                        <Box sx={{
                                            display: "flex",
                                            justifyContent: prevButton && indexViewQuest !== 0 ? "space-between" : "flex-end",
                                            gap: 2,
                                        }}>
                                            {interviewGetForm?.length > 0 &&
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
                                                            >
                                                                Prev
                                                            </Button>
                                                        )}

                                                    </>
                                                )}
                                            <Box sx={{ display: "flex", gap: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    endIcon={<CancelIcon />}
                                                    onClick={() => {
                                                        // backPage(`/interview/interviewroundstestverification`);

                                                        setShowAlert(
                                                            <>
                                                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                                                                <Typography variant="h6" sx={{ fontWeight: 600, mt: 2 }}>
                                                                    Are you sure you want to cancel this test?
                                                                </Typography>
                                                            </>
                                                        );
                                                        handleClickOpenCancel();
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
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
                                                        handleConditionCheck(false, false);
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
                                            justifyContent: prevButton && indexViewQuest !== 0 ? "space-between" : "flex-end",
                                            gap: 2,
                                        }}>
                                            {interviewGetForm?.length > 0 &&
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
                                                            >
                                                                Prev
                                                            </Button>
                                                        )}

                                                    </>
                                                )}
                                            <Box sx={{ display: "flex", gap: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    endIcon={<CancelIcon />}
                                                    onClick={() => {
                                                        backPage(`/interview/interviewroundstestverification`);
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
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
                                                    onClick={(e) => {
                                                        handleSubmit(e);
                                                    }}
                                                >
                                                    Submit
                                                </Button>
                                            </Box>
                                        </Box>
                                    )}
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

                {/* cancel popup */}

                <Box>
                    <Dialog
                        open={isCancelOpen}
                        onClose={handleCloseCancel}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent
                            sx={{
                                width: "350px",
                                textAlign: "center",
                                alignItems: "center",
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                pt: 4,
                            }}
                        >
                            {showAlert}
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    handleCloseCancel(); // Close dialog
                                    backPage("/interview/interviewroundstestverification"); // Redirect
                                }}
                            >
                                Yes
                            </Button>
                            <Button variant="outlined" onClick={handleCloseCancel}>
                                No
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

                {/* <Fab
                    // color="primary"
                    aria-label="add"
                    // onClick={() => setAdditionalOpen(true)
                    // }
                    sx={{ position: "fixed", bottom: 16, right: 16 }}
                > */}
                <ScreenshotInterviewRounds roundDetails={roundDetails} isUserRoleAccess={userData} />
                {/* </Fab> */}
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
            </div>
            <br />
            <br />
            <LoadingBackdrop open={isLoading} />
        </div>
    );
}

export default InterviewTestRoundCheck;