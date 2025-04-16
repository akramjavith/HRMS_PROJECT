import React, { useState, useEffect, useRef, useContext } from "react";
import { FormGroup, TableRow, TableCell, TextareaAutosize, OutlinedInput, Checkbox, TableBody, TableHead, Table, Dialog, TableContainer, Paper, DialogContent, DialogActions, Select, MenuItem, Radio, InputLabel, RadioGroup, FormControlLabel, Box, FormControl, TextField, Typography, Grid, Button, } from "@mui/material"
import { userStyle, useraccessStyle } from './candidatestyle';
import { useParams, useNavigate } from 'react-router-dom';
import "jspdf-autotable";
import "cropperjs/dist/cropper.css";
import "react-image-crop/dist/ReactCrop.css";
import "./candidate.css";
import { handleApiError } from "../components/Errorhandling";
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import axios from 'axios';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import HomeIcon from '@mui/icons-material/Home';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import PaymentsIcon from '@mui/icons-material/Payments';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import Selects, { components } from "react-select";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { SERVICE } from "../services/Baseservice";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { MultiSelect } from "react-multi-select-component";

function Candidate() {








    const [addcandidate, setAddcandidate] = useState({
        role: "", prefix: "Mr", firstname: "", lastname: "", email: "",
        mobile: "", whatsapp: "", website: "", street: "", city: "", state: "",
        postalcode: "", country: "", experience: "", qualification: "MCA",
        currentjobtitle: "", currentemployer: "", expectedsalary: "",
        currentsalary: "", skillset: "", additionalinfo: "", linkedinid: "",
        // status: "New", source: "Added by User",
        sourcecandidate: "Walk-in",
        educationdetails: "",
        experiencedetails: "", resumefile: "", coverletterfile: "",
        experienceletterfile: "", phonecheck: false, dateofbirth: "", age: "", skill: []
    });
    const [educationDetails, setEducationDetails] = useState({
        school: "", department: "", degree: "", fromduration: "", toduration: "", pursuing: false
    })
    const [educationtodo, setEducationtodo] = useState([])

    const [experienceDetails, setExperienceDetails] = useState({
        occupation: "", company: "", summary: "", fromduration: "", toduration: "", currentlyworkhere: false
    })
    const [experiencetodo, setExperiencetodo] = useState([])
    const [jobopenening, setJobOpeing] = useState([]);

    const sourcecandidateOption = [
        { label: "Walk-in", value: "Walk-in" },
        { label: "Reference", value: "Reference" },
        { label: "Advertisement", value: "Advertisement" },
        { label: "Jobfar", value: "Jobfar" },
        { label: "Social Media", value: "Social Media" },
    ];


    const [showAlert, setShowAlert] = useState();
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    const getPhoneNumber = () => {

        if (addcandidate.phonecheck) {
            setAddcandidate({ ...addcandidate, whatsapp: addcandidate.mobile })
        } else {
            setAddcandidate({ ...addcandidate, whatsapp: "" })
        }
    }
    useEffect(
        () => {
            getPhoneNumber();
        }, [addcandidate.phonecheck]
    )

    const [size, setSize] = useState("small");
    const [steperDisplay, setSteperDisplay] = useState(false)

    const [queueCheck, setQueueCheck] = useState(false);

    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    const [skill, setSkill] = useState([]);

    const id = useParams().id

    const getviewCode = async () => {
        try {
            let res = await axios.get(`${SERVICE.JOBOPENING_SINGLE}/${id}`);
            setJobOpeing(res.data.sjobopening);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        getviewCode()
    }, [id]);

    const fetchAllSkill = async () => {
        try {
            let res_queue = await axios.get(SERVICE.SKILLSET);
            setSkill(res_queue?.data?.skillsets?.map((t) => ({
                ...t,
                label: t.name,
                value: t.name
            })))
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    useEffect(() => { fetchAllSkill() }, [])

    const [selectedskill, setSelectedSkill] = useState([]);
    let [valueCate, setValueCate] = useState("")

    const handleSkilChange = (options) => {

        setValueCate(options.map((a, index) => {
            return a.value
        }))
        setSelectedSkill(options);
    };

    const renderValueSkill = (valueCate, _skill) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Skill";
    };

    const educationTodo = () => {

        if (educationDetails.school == "" && educationDetails.department == "" && educationDetails.degree == "") {
            setShowAlert("Please Enter Atleast one field!");
            handleClickOpenerr();
        }
        else if (educationDetails !== '') {
            setEducationtodo([...educationtodo, educationDetails]);
            setEducationDetails({
                school: "", department: "", degree: "", fromduration: "", toduration: "", pursuing: false
            })
        }
    }
    const educationTodoremove = (index) => {
        const newTasks = [...educationtodo];
        newTasks.splice(index, 1);
        setEducationtodo(newTasks);
    };

    const experienceTodo = () => {

        if (experienceDetails.occupation == "" && experienceDetails.company == "" && experienceDetails.summary == "") {
            setShowAlert("Please Enter Atleast one field!");
            handleClickOpenerr();
        }
        else if (experienceDetails !== '') {
            setExperiencetodo([...experiencetodo, experienceDetails]);
            setExperienceDetails({
                occupation: "", company: "", summary: "", fromduration: "", toduration: "", currentlyworkhere: false
            })
        }
    }
    const experienceTodoremove = (index) => {
        const newTasks = [...experiencetodo];
        newTasks.splice(index, 1);
        setExperiencetodo(newTasks);
    };
    const qualificationOption = [
        { label: 'MCA', value: "MCA" },
        { label: 'BE', value: "BE" },
        { label: 'BSc', value: "BSc" },
        { label: 'MS', value: "MS" },
        { label: 'BTech', value: "BTech" },
        { label: 'ME', value: "ME" },
        { label: 'Diploma', value: "Diploma" },
        { label: 'ITI', value: "ITI" },
    ];

    const [resumefiles, setResumeFiles] = useState([]);

    const handleResumeUpload = (event) => {
        const resume = event.target.files;

        for (let i = 0; i < resume.length; i++) {
            const reader = new FileReader();
            const file = resume[i];
            reader.readAsDataURL(file);
            reader.onload = () => {
                setResumeFiles((prevFiles) => [
                    ...prevFiles,
                    { name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" },
                ]);
            };
        }
    };
    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const handleFileDelete = (index) => {
        setResumeFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const [coverletter, setCoverletter] = useState([]);
    const handleCoverletterUpload = (event) => {
        const cover = event.target.files;

        for (let i = 0; i < cover.length; i++) {
            const reader = new FileReader();
            const file = cover[i];
            reader.readAsDataURL(file);
            reader.onload = () => {
                setCoverletter((prevFiles) => [
                    ...prevFiles,
                    { name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "cover letter" },
                ]);
            };
        }
    };
    const renderFilePreviewcover = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const handleFileDeletecover = (index) => {
        setCoverletter((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const [experienceletter, setExperienceletter] = useState([]);

    const handleExperienceletterUpload = (event) => {
        const experience = event.target.files;

        for (let i = 0; i < experience.length; i++) {
            const reader = new FileReader();
            const file = experience[i];
            reader.readAsDataURL(file);
            reader.onload = () => {
                setExperienceletter((prevFiles) => [
                    ...prevFiles,
                    { name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "experience letter" },
                ]);
            };
        }
    };

    const renderFilePreviewexp = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const handleFileDeleteexp = (index) => {
        setExperienceletter((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    function isValidEmail(email) {
        // Regular expression for a simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // const [todos, setTodos] = useState([]);
    const backPage = useNavigate();

    const sendRequest = async () => {

        try {
            let res_queue = await axios.post(SERVICE.CANDIDATES_CREATE,
                {

                    role: String(jobopenening.recruitmentname),
                    prefix: String(addcandidate.prefix),
                    firstname: String(addcandidate.firstname),
                    lastname: String(addcandidate.lastname),
                    fullname: String(addcandidate.firstname + " " + addcandidate.lastname),
                    email: String(addcandidate.email),
                    mobile: Number(addcandidate.mobile),
                    whatsapp: Number(addcandidate.whatsapp),
                    phonecheck: Boolean(addcandidate.phonecheck),
                    adharnumber: Number(addcandidate.adharnumber),
                    pannumber: Number(addcandidate.pannumber),
                    age: Number(addcandidate.age),
                    dateofbirth: String(addcandidate.dateofbirth),
                    street: String(addcandidate.street),
                    city: String(addcandidate.city),
                    state: String(addcandidate.state),
                    postalcode: Number(addcandidate.postalcode),
                    country: String(addcandidate.country),
                    experience: String(addcandidate.experience),
                    qualification: String(addcandidate.qualification),
                    currentjobtitle: String(addcandidate.currentjobtitle),
                    currentemployer: String(addcandidate.currentemployer),
                    expectedsalary: String(addcandidate.expectedsalary),
                    currentsalary: String(addcandidate.currentsalary),
                    skillset: String(addcandidate.skillset),
                    sourcecandidate: String(addcandidate.sourcecandidate),
                    additionalinfo: String(addcandidate.additionalinfo),
                    linkedinid: String(addcandidate.linkedinid),
                    resumefile: [...resumefiles],
                    coverletterfile: [...coverletter],
                    experienceletterfile: [...experienceletter],
                    educationdetails: [...educationtodo],
                    experiencedetails: [...experiencetodo],
                    skill: [...valueCate],
                    addedby: [
                        {
                            name: String(addcandidate.firstname),
                            date: String(new Date()),
                        },
                    ],
                });

            setQueueCheck(true);
            setShowAlert("Added Successfully");
            handleClickOpenerr();
            setAddcandidate({
                prefix: "Mr", firstname: "", lastname: "", email: "",
                mobile: "", whatsapp: "", website: "", street: "", city: "", state: "",
                postalcode: "", country: "", experience: "", qualification: "MCA",
                currentjobtitle: "", currentemployer: "", expectedsalary: "",
                currentsalary: "", skillset: "", sourcecandidate: "Walk-in", additionalinfo: "", linkedinid: "",
                status: "New", source: "Added by User", educationdetails: "",
                experiencedetails: "", resumefile: "", coverletterfile: "",
                experienceletterfile: "",
            });
            setEducationtodo([]);
            setExperiencetodo([]);
            setExperienceletter([])
            setCoverletter([])
            setResumeFiles([])
            setEducationDetails({
                school: "", department: "", degree: "", fromduration: "", toduration: "", pursuing: false
            })
            setExperienceDetails({
                occupation: "", company: "", summary: "", fromduration: "", toduration: "", currentlyworkhere: false
            })
            backPage('/career/response');

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    const handleSubmit = (e) => {
        if (addcandidate.firstname == "") {
            setShowAlert("Please Enter First Name");
            handleClickOpenerr();
        }
        else if (addcandidate.lastname == "") {
            setShowAlert("Please Enter Last Name");
            handleClickOpenerr();
        }
        else if (resumefiles == 0) {
            setShowAlert("Please upload resume");
            handleClickOpenerr();
        }
        else {
            sendRequest()
        }
    }

    const [isMobile, setIsMobile] = useState(false);
    const [isMobile1, setIsMobile1] = useState(false);
    // const [fontSize, setFontsize] = useState('50px')
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 900);
            setIsMobile1(window.innerWidth <= 900);
            setSteperDisplay(window.innerWidth <= 900)

        };
        handleResize(); // Call the handleResize function once to set the initial state
        window.addEventListener('resize', handleResize); // Listen for window resize events
        return () => {
            window.removeEventListener('resize', handleResize); // Clean up the event listener on component unmount
        };
    }, []);

    const handleMobile = (e) => {
        if (e.length > 10) {
            setShowAlert("Mobile number can't more than 10 characters!")
            handleClickOpenerr();
            let num = e.slice(0, 10);
            setAddcandidate({ ...addcandidate, mobile: num })
        }
    }
    const handleWhatsapp = (e) => {
        if (e.length > 10) {
            setShowAlert("Whats app number can't more than 10 characters!")
            handleClickOpenerr();
            let num = e.slice(0, 10);
            setAddcandidate({ ...addcandidate, whatsapp: num })
        }
    }
    const handlePostal = (e) => {
        if (e.length > 6) {
            setShowAlert("Postal code can't more than 6 characters!")
            handleClickOpenerr();
            let num = e.slice(0, 6);
            setAddcandidate({ ...addcandidate, postalcode: num })
        }
    }

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
        },
    }));

    const stepOne = () => {
        if (addcandidate.firstname == "") {
            setShowAlert("Please Enter First Name");
            handleClickOpenerr();
        }
        else if (addcandidate.lastname == "") {
            setShowAlert("Please Enter Last Name");
            handleClickOpenerr();
        }
        else if ((!isValidEmail((addcandidate.email))) && addcandidate.email != "") {
            setShowAlert(
                <>
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter  Valid Email"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            nextStep();
        }
    }
    const stepTwo = () => {
        nextStep();
    }
    const stepThree = () => {
        nextStep();
    }
    const stepFour = () => {
        nextStep();
    }

    const [step, setStep] = useState(1);
    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };


    const renderStepOne = () => {
        return (
            <>
                <Box>
                    <Typography sx={userStyle.heading}>
                        Basic Information
                    </Typography>
                    <br />
                    <Grid container spacing={5} sx={useraccessStyle.pageresponsive}>
                        <Grid item lg={10} md={10} xs={12} sm={12}>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b>Role</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="text"
                                            value={jobopenening.recruitmentname}
                                            sx={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right", '& .css-qf47h-MuiGrid-root': { '@media only screen and (max-width: 1150px)': { color: "red !important" } } }} >
                                    <InputLabel><b style={{ color: "red" }}>*</b><b>First Name</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12} sx={{ display: "flex" }}>
                                    <Grid item md={3} sm={3} xs={3}>
                                        <FormControl size="large" fullWidth>
                                            <Select
                                                size={size}
                                                placeholder="Mr."
                                                value={addcandidate.prefix}
                                                onChange={(e) => {
                                                    setAddcandidate({ ...addcandidate, prefix: e.target.value });
                                                }}
                                                style={{
                                                    borderColor: '#8cc1db',
                                                    borderWidth: '2px',
                                                    borderStyle: 'solid',
                                                    '@media only screen and (max-width: 550px)': {
                                                        "& .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input": {
                                                            fontSize: "15px",
                                                            color: "red"
                                                        },
                                                    }
                                                }}
                                            >
                                                <MenuItem value="Mr">Mr</MenuItem>
                                                <MenuItem value="Ms">Ms</MenuItem>
                                                <MenuItem value="Mrs">Mrs</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={9} sm={9} xs={9}>
                                        <FormControl size="small" fullWidth>
                                            <TextField
                                                size={size}
                                                id="component-outlined"
                                                type="text"
                                                sx={{
                                                    border: " 2px solid #8cc1db",
                                                }}
                                                value={addcandidate.firstname}
                                                onChange={(e) => {
                                                    setAddcandidate({
                                                        ...addcandidate,
                                                        firstname: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b style={{ color: "red" }}>*</b><b>Last Name</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="text"
                                            value={addcandidate.lastname}
                                            onChange={(e) => {
                                                setAddcandidate({
                                                    ...addcandidate,
                                                    lastname: e.target.value,
                                                });
                                            }}
                                            sx={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b> Email</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="email"
                                            value={addcandidate.email}
                                            onChange={(e) => {
                                                setAddcandidate({
                                                    ...addcandidate,
                                                    email: e.target.value,
                                                });
                                            }}
                                            sx={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b> Mobile</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            value={addcandidate.mobile}
                                            onChange={(e) => {
                                                setAddcandidate({
                                                    ...addcandidate,
                                                    mobile: e.target.value,
                                                });
                                                handleMobile(e.target.value)
                                            }}
                                            style={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid><br />
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay} style={{ marginTop: "15px", }}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={addcandidate.phonecheck} onChange={(e) => setAddcandidate({ ...addcandidate, phonecheck: !addcandidate.phonecheck })} />} label="Same as Whats app number" />
                                    </FormGroup>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay} style={{ marginTop: "15px", }}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b> Whats app</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            value={addcandidate.whatsapp}
                                            onChange={(e) => {
                                                setAddcandidate({
                                                    ...addcandidate,
                                                    whatsapp: e.target.value,
                                                });
                                                handleWhatsapp(e.target.value);
                                            }}
                                            style={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b> Age</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            value={addcandidate.age}
                                            onChange={(e) => {
                                                if (e.target.value.length < 4) {
                                                    setAddcandidate({
                                                        ...addcandidate,
                                                        age: e.target.value,
                                                    });
                                                }

                                            }}
                                            style={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b> Date of Birth</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="date"
                                            sx={userStyle.input}
                                            value={addcandidate.dateofbirth}
                                            onChange={(e) => {
                                                setAddcandidate({
                                                    ...addcandidate,
                                                    dateofbirth: e.target.value,
                                                });
                                            }}
                                            style={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={10} md={10} xs={12} sm={12} sx={userStyle.next}>
                            <Button className="next" variant="contained" sx={userStyle.nextbutton} onClick={() => { stepOne() }}>
                                <b>Next</b> &emsp;<EastIcon sx={{ '@media only screen and (max-width: 900px)': { fontSize: "medium" } }} />
                            </Button>
                        </Grid>
                    </Grid>
                </Box >
            </>
        );
    };

    const renderStepTwo = () => {
        return (
            <>
                <Box>
                    <Typography sx={userStyle.heading}>
                        Address Information
                    </Typography>
                    <br />
                    <Grid container spacing={5} sx={useraccessStyle.pageresponsive}>
                        <Grid item lg={10} md={10} xs={12} sm={12}>

                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b>Street</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="text"
                                            value={addcandidate.street}
                                            onChange={(e) => {
                                                setAddcandidate({
                                                    ...addcandidate,
                                                    street: e.target.value,
                                                });
                                            }}
                                            sx={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b> City</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="text"
                                            value={addcandidate.city}
                                            onChange={(e) => {
                                                setAddcandidate({
                                                    ...addcandidate,
                                                    city: e.target.value,
                                                });
                                            }}
                                            sx={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b> State</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="text"
                                            value={addcandidate.state}
                                            onChange={(e) => {
                                                setAddcandidate({
                                                    ...addcandidate,
                                                    state: e.target.value,
                                                });
                                            }}
                                            style={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b> Postal code</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            value={addcandidate.postalcode}
                                            onChange={(e) => {
                                                setAddcandidate({
                                                    ...addcandidate,
                                                    postalcode: e.target.value,
                                                });
                                                handlePostal(e.target.value)
                                            }}
                                            style={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b> Country</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="text"
                                            value={addcandidate.country}
                                            onChange={(e) => {
                                                setAddcandidate({
                                                    ...addcandidate,
                                                    country: e.target.value,
                                                });
                                            }}
                                            style={{
                                                border: " 2px solid #8cc1db",

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b> Aadhar number</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            value={addcandidate.adharnumber}
                                            onChange={(e) => {
                                                if (e.target.value.length < 13) {
                                                    setAddcandidate({
                                                        ...addcandidate,
                                                        adharnumber: e.target.value,
                                                    });
                                                }
                                            }}
                                            style={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b> Pan Number</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="text"
                                            sx={userStyle.input}
                                            value={addcandidate.pannumber}
                                            onChange={(e) => {
                                                if (e.target.value.length < 11) {
                                                    setAddcandidate({
                                                        ...addcandidate,
                                                        pannumber: e.target.value,
                                                    });
                                                }
                                            }}
                                            style={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item lg={10} md={10} xs={10} sm={10} sx={userStyle.next}>
                            <Button className="next" variant="contained"
                                sx={userStyle.Previousbutton} onClick={prevStep}> <WestIcon sx={{ '@media only screen and (max-width: 900px)': { fontSize: "medium" } }} />&emsp; <b>Previous</b>
                            </Button>&emsp;&emsp;
                            <Button className="next" variant="contained"
                                sx={userStyle.nextbutton}
                                onClick={stepTwo}>
                                <b>Next</b> &emsp;<EastIcon sx={{ '@media only screen and (max-width: 900px)': { fontSize: "medium" } }} />
                            </Button>
                        </Grid>
                    </Grid >
                </Box >
            </>
        );
    };

    const renderStepThree = () => {
        return (
            <>
                <Box>
                    <Typography sx={userStyle.heading}>
                        Professional Details
                    </Typography>
                    <br />
                    <Grid container spacing={5} sx={useraccessStyle.pageresponsive}>
                        <Grid item lg={10} md={10} xs={12} sm={12}>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b> Skill set known</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <MultiSelect
                                            options={skill}
                                            value={selectedskill}
                                            onChange={handleSkilChange}
                                            valueRenderer={renderValueSkill}
                                            labelledBy="Please Select Category"

                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={5} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b>Experience in Years</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            sx={userStyle.input}
                                            size={size}
                                            id="component-outlined"
                                            type="number"
                                            value={addcandidate.experience}
                                            onChange={(e) => {
                                                setAddcandidate({
                                                    ...addcandidate,
                                                    experience: e.target.value,
                                                });
                                            }}
                                            style={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={5} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b> Highest Qualification held</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <Select
                                            size={size}
                                            options={qualificationOption}
                                            placeholder="Please Select"
                                            value={addcandidate.qualification}
                                            onChange={(e) => {
                                                setAddcandidate({ ...addcandidate, qualification: e.target.value });
                                            }}
                                            sx={{
                                                border: "2px solid #8cc1db",
                                            }}
                                        >
                                            {qualificationOption.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b> Current Job title</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="text"
                                            value={addcandidate.currentjobtitle}
                                            onChange={(e) => {
                                                setAddcandidate({
                                                    ...addcandidate,
                                                    currentjobtitle: e.target.value,
                                                });
                                            }}
                                            style={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b> Current Employer</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="text"
                                            sx={userStyle.input}
                                            value={addcandidate.currentemployer}
                                            onChange={(e) => {
                                                setAddcandidate({
                                                    ...addcandidate,
                                                    currentemployer: e.target.value,
                                                });
                                            }}
                                            style={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b>Expected Salary</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="text"
                                            value={addcandidate.expectedsalary}
                                            onChange={(e) => {
                                                setAddcandidate({
                                                    ...addcandidate,
                                                    expectedsalary: e.target.value,
                                                });
                                            }}
                                            style={{
                                                border: " 2px solid #8cc1db",

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b>Current Salary</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="text"
                                            value={addcandidate.currentsalary}
                                            onChange={(e) => {
                                                setAddcandidate({
                                                    ...addcandidate,
                                                    currentsalary: e.target.value,
                                                });
                                            }}
                                            style={{
                                                border: " 2px solid #8cc1db",

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b> Skill set</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextareaAutosize
                                            size={size}
                                            id="component-outlined"
                                            minRows={5}
                                            value={addcandidate.skillset}
                                            onChange={(e) => {
                                                setAddcandidate({ ...addcandidate, skillset: e.target.value });
                                            }}
                                            style={{
                                                border: " 2px solid #8cc1db",
                                                backgroundColor: "inherit"
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b>Additional Info</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextareaAutosize
                                            size={size}
                                            id="component-outlined"
                                            minRows={5}
                                            value={addcandidate.additionalinfo}
                                            onChange={(e) => {
                                                setAddcandidate({ ...addcandidate, additionalinfo: e.target.value });
                                            }}
                                            style={{
                                                border: " 2px solid #8cc1db",
                                                backgroundColor: "inherit"
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>


                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={5} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b> How Did You Know As</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <Select
                                            size={size}
                                            options={sourcecandidateOption}
                                            placeholder="Please Select"
                                            value={addcandidate.sourcecandidate}
                                            onChange={(e) => {
                                                setAddcandidate({ ...addcandidate, sourcecandidate: e.target.value });
                                            }}
                                            sx={{
                                                border: "2px solid #8cc1db",
                                            }}
                                        >
                                            {sourcecandidateOption.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>



                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={3} md={3} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b>  Linked In Id</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={9} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="text"
                                            value={addcandidate.linkedinid}
                                            onChange={(e) => {
                                                setAddcandidate({
                                                    ...addcandidate,
                                                    linkedinid: e.target.value,
                                                });
                                            }}
                                            style={{
                                                border: " 2px solid #8cc1db",

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>


                        </Grid>
                        <Grid item lg={10} md={10} xs={10} sm={10} sx={userStyle.next}>
                            <Button className="next" variant="contained"
                                sx={userStyle.Previousbutton} onClick={prevStep}> <WestIcon sx={{ '@media only screen and (max-width: 900px)': { fontSize: "medium" } }} />&emsp; <b>Previous</b>
                            </Button>&emsp;&emsp;
                            <Button className="next" variant="contained"
                                sx={userStyle.nextbutton}
                                onClick={stepThree}>
                                <b>Next</b> &emsp;<EastIcon sx={{ '@media only screen and (max-width: 900px)': { fontSize: "medium" } }} />
                            </Button>
                        </Grid>
                    </Grid >
                </Box >
            </>
        );
    };

    const renderStepFour = () => {
        return (
            <>
                <Box>
                    <Typography sx={userStyle.heading}>
                        Education details
                    </Typography>
                    <br />
                    <Grid container spacing={5} sx={useraccessStyle.pageresponsive}>
                        <Grid item lg={10} md={10} xs={12} sm={12}>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={4} md={5} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b>Institute / School</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={8} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="text"
                                            value={educationDetails.school}
                                            onChange={(e) => {
                                                setEducationDetails({
                                                    ...educationDetails,
                                                    school: e.target.value,
                                                });
                                            }}
                                            sx={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={4} md={5} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b> Major / Department</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={8} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="text"
                                            value={educationDetails.department}
                                            onChange={(e) => {
                                                setEducationDetails({
                                                    ...educationDetails,
                                                    department: e.target.value,
                                                });
                                            }}
                                            sx={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={4} md={5} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b>Degree</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={8} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="text"
                                            value={educationDetails.degree}
                                            onChange={(e) => {
                                                setEducationDetails({
                                                    ...educationDetails,
                                                    degree: e.target.value,
                                                });
                                            }}
                                            sx={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={4} md={5} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b>Duration</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={8} md={9} xs={12} sm={12} sx={{ display: "flex" }}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="month"
                                            value={educationDetails.fromduration}
                                            onChange={(e) => {
                                                setEducationDetails({
                                                    ...educationDetails,
                                                    fromduration: e.target.value,
                                                });

                                            }}
                                            sx={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                    <Typography sx={{ margin: "10px 10px 0 10px" }}>To
                                    </Typography>
                                    <FormControl fullWidth sx={{ marginTop: "-25px" }} >
                                        <Typography>&nbsp;
                                        </Typography>
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="month"
                                            value={educationDetails.toduration}
                                            onChange={(e) => {
                                                setEducationDetails({
                                                    ...educationDetails,
                                                    toduration: e.target.value,
                                                });
                                            }}
                                            sx={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplaycheck}>
                                <Grid item lg={4} md={4} xs={8} sm={8} sx={{ textAlign: "right" }}>
                                    <InputLabel><b>Currently pursuing</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={8} md={4} xs={2} sm={2}>
                                    <FormControl size="small">
                                        <Checkbox
                                            checked={educationDetails.pursuing}
                                            onChange={(e) =>
                                                setEducationDetails({
                                                    ...educationDetails,
                                                    pursuing: !educationDetails.pursuing,
                                                })
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={{ marginLeft: "30vw", marginTop: "20px", '@media only screen and (max-width: 500px)': { marginLeft: "25vw" }, '@media only screen and (max-width: 350px)': { marginLeft: "15vw" } }}>
                                <Grid item md={10} sm={12} xs={12}>
                                    <Button variant="outlined" sx={{ textTransform: "capitalize", '@media only screen and (max-width: 500px)': { fontSize: "13px" } }} onClick={educationTodo}><AddIcon />&nbsp; Add Education Details</Button>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplaytable}>
                                <Grid item md={12} sm={12} xs={12}>
                                    <TableContainer component={Paper}>
                                        <Table
                                            sx={{ minWidth: 650, border: '2px solid #8cc1db' }} aria-label="simple table"

                                            id="usertable"
                                        >
                                            <TableHead sx={{ fontWeight: "600" }}>
                                                <TableRow>
                                                    <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}><b style={{ color: "#5756a2", fontFamily: 'JostMedium', }}>SNo</b></TableCell>
                                                    <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}><b style={{ color: "#5756a2", fontFamily: 'JostMedium', }}>School</b></TableCell>
                                                    <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}><b style={{ color: "#5756a2", fontFamily: 'JostMedium', }}>Department</b></TableCell>
                                                    <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}><b style={{ color: "#5756a2", fontFamily: 'JostMedium', }}>Degree</b></TableCell>
                                                    <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}><b style={{ color: "#5756a2", fontFamily: 'JostMedium', }}>Duration</b></TableCell>
                                                    <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}><b style={{ color: "#5756a2", fontFamily: 'JostMedium', }}>Pursuing</b></TableCell>
                                                    <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}><b style={{ color: "#5756a2", fontFamily: 'JostMedium', }}>Action</b></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody align="left">
                                                {educationtodo?.length > 0 ? (
                                                    educationtodo?.map((row, index) => (
                                                        <TableRow >
                                                            <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}>{index + 1}</TableCell>
                                                            <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}>{row.school}</TableCell>
                                                            <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}>{row.department}</TableCell>
                                                            <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}>{row.degree}</TableCell>
                                                            <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}>{row.fromduration + " to " + row.toduration}</TableCell>
                                                            <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}>{row.pursuing ? "true" : "false"}</TableCell>
                                                            <TableCell><CloseIcon sx={{ color: "red", cursor: "pointer" }} onClick={() => { educationTodoremove(index) }} /></TableCell>
                                                        </TableRow>
                                                    )))
                                                    :
                                                    <TableRow> <TableCell colSpan={8} align="center">No Data Available</TableCell> </TableRow>}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item lg={10} md={10} xs={10} sm={10} sx={userStyle.next}>
                            <Button className="next" variant="contained"
                                sx={userStyle.Previousbutton} onClick={prevStep}> <WestIcon sx={{ '@media only screen and (max-width: 900px)': { fontSize: "medium" } }} />&emsp; <b>Previous</b>
                            </Button>&emsp;&emsp;
                            <Button className="next" variant="contained"
                                sx={userStyle.nextbutton}
                                onClick={stepFour}>
                                <b>Next</b> &emsp;<EastIcon sx={{ '@media only screen and (max-width: 900px)': { fontSize: "medium" } }} />
                            </Button>
                        </Grid>
                    </Grid >
                </Box >
            </>
        );
    };

    const renderStepFive = () => {
        return (
            <>
                <Box>
                    <Typography sx={userStyle.heading}>
                        Experience Details
                    </Typography>
                    <br />
                    <Grid container spacing={5} sx={useraccessStyle.pageresponsive}>
                        <Grid item lg={10} md={10} xs={12} sm={12}>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={4} md={5} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b>Occupation / Title</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={8} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="text"
                                            value={experienceDetails.occupation}
                                            onChange={(e) => {
                                                setExperienceDetails({
                                                    ...experienceDetails,
                                                    occupation: e.target.value,
                                                });
                                            }}
                                            sx={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={4} md={5} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b>Company</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={8} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="text"
                                            value={experienceDetails.company}
                                            onChange={(e) => {
                                                setExperienceDetails({
                                                    ...experienceDetails,
                                                    company: e.target.value,
                                                });
                                            }}
                                            sx={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={4} md={5} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b>Summary</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={8} md={9} xs={12} sm={12}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="text"
                                            value={experienceDetails.summary}
                                            onChange={(e) => {
                                                setExperienceDetails({
                                                    ...experienceDetails,
                                                    summary: e.target.value,
                                                });
                                            }}
                                            sx={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplay}>
                                <Grid item lg={4} md={5} xs={12} sm={12} sx={{ textAlign: "right" }}>
                                    <InputLabel><b>Work Duration</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={8} md={9} xs={12} sm={12} sx={{ display: "flex" }}>
                                    <FormControl fullWidth >
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="month"
                                            value={experienceDetails.fromduration}
                                            onChange={(e) => {
                                                setExperienceDetails({
                                                    ...experienceDetails,
                                                    fromduration: e.target.value,
                                                });
                                            }}
                                            sx={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                    <Typography sx={{ margin: "10px 10px 0 10px" }}>To
                                    </Typography>
                                    <FormControl fullWidth sx={{ marginTop: "-25px" }} >
                                        <Typography>&nbsp;
                                        </Typography>
                                        <TextField
                                            size={size}
                                            id="component-outlined"
                                            type="month"
                                            value={experienceDetails.toduration}
                                            onChange={(e) => {
                                                setExperienceDetails({
                                                    ...experienceDetails,
                                                    toduration: e.target.value,
                                                });
                                            }}
                                            sx={{
                                                border: " 2px solid #8cc1db",
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplaycheck}>
                                <Grid item lg={4} md={4} xs={8} sm={8} sx={{ textAlign: "right" }}>
                                    <InputLabel><b>I Currently Work here</b>:&emsp;</InputLabel>
                                </Grid>
                                <Grid item lg={8} md={4} xs={2} sm={2}>
                                    <FormControl size="small">
                                        <Checkbox
                                            checked={experienceDetails.currentlyworkhere}
                                            onChange={(e) =>
                                                setExperienceDetails({
                                                    ...experienceDetails,
                                                    currentlyworkhere: !experienceDetails.currentlyworkhere,
                                                })
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid sx={{ marginLeft: "30vw", marginTop: "20px", '@media only screen and (max-width: 500px)': { marginLeft: "25vw" }, '@media only screen and (max-width: 350px)': { marginLeft: "15vw" } }}>
                                <Grid item md={10} sm={12} xs={12}>
                                    <Button variant="outlined" sx={{ textTransform: "capitalize", '@media only screen and (max-width: 500px)': { fontSize: "13px" } }} onClick={experienceTodo}><AddIcon />&nbsp; Add Experience Details</Button>
                                </Grid>
                            </Grid>
                            <Grid sx={useraccessStyle.containercontentdisplaytable}>
                                <Grid item md={12} sm={12} xs={12}>
                                    <TableContainer component={Paper}>
                                        <Table
                                            sx={{ minWidth: 650, border: '2px solid #8cc1db' }} aria-label="simple table"
                                            id="usertable"
                                        >
                                            <TableHead sx={{ fontWeight: "600" }}>
                                                <TableRow>
                                                    <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}><b style={{ color: "#5756a2", fontFamily: 'JostMedium', }}>SNo</b></TableCell>
                                                    <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}><b style={{ color: "#5756a2", fontFamily: 'JostMedium', }}>Occupation</b></TableCell>
                                                    <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}><b style={{ color: "#5756a2", fontFamily: 'JostMedium', }}>Company</b></TableCell>
                                                    <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}><b style={{ color: "#5756a2", fontFamily: 'JostMedium', }}>Summay</b></TableCell>
                                                    <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}><b style={{ color: "#5756a2", fontFamily: 'JostMedium', }}>Work Duration</b></TableCell>
                                                    <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}><b style={{ color: "#5756a2", fontFamily: 'JostMedium', }}>Work Here</b></TableCell>
                                                    <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}><b style={{ color: "#5756a2", fontFamily: 'JostMedium', }}>Action</b></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody align="left">
                                                {experiencetodo?.length > 0 ? (
                                                    experiencetodo?.map((row, index) => (
                                                        <TableRow >
                                                            <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}>{index + 1}</TableCell>
                                                            <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}>{row.occupation}</TableCell>
                                                            <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}>{row.company}</TableCell>
                                                            <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}>{row.summary}</TableCell>
                                                            <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}>{row.fromduration + " to " + row.toduration}</TableCell>
                                                            <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}>{row.currentlyworkhere ? "true" : "false"}</TableCell>
                                                            <TableCell sx={{ borderRight: "2px solid #8cc1db", borderBottom: "2px solid #8cc1db" }}><CloseIcon sx={{ color: "red", cursor: "pointer" }} onClick={() => { experienceTodoremove(index) }} /></TableCell>
                                                        </TableRow>
                                                    )))
                                                    :
                                                    <TableRow> <TableCell colSpan={8} align="center">No Data Available</TableCell> </TableRow>}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={10} md={10} xs={12} sm={12} sx={{ display: "flex", marginLeft: "40px", justifyContent: "center", "@media only screen and (max-width:550px)": { flexDirection: "column" } }} >
                            <Grid item lg={4} md={4} xs={12} sm={12} sx={{ display: 'flex', "@media only screen and (max-width:550px)": { flexDirection: "column" } }}>
                                <Typography sx={userStyle.importheadtext} style={{ marginLeft: "5px" }}>  Resume <b style={{ color: "red" }}>*</b>  </Typography>&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
                                <Button variant="outlined" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: '5px', } }} >
                                    Upload
                                    <input type='file' id="resume"
                                        accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                                        name='file' hidden onChange={handleResumeUpload}
                                    />
                                </Button>
                            </Grid>
                            <Grid item lg={6} md={6} xs={12} sm={12} sx={{}}>
                                {resumefiles?.length > 0 &&
                                    (resumefiles.map((file, index) => (
                                        <>
                                            <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                                                <Grid item lg={8} md={8} sm={8} xs={8}>
                                                    <Typography>{file.name}</Typography>
                                                </Grid>
                                                <Grid item lg={1} md={1} sm={1} xs={1}>
                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                                </Grid>
                                                <Grid item lg={1} md={1} sm={1} xs={1}>
                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDelete(index)}><DeleteIcon /></Button>

                                                </Grid>
                                            </Grid>
                                        </>
                                    )))}
                                {/* </Typography> */}
                            </Grid>
                        </Grid>
                        <Grid item lg={10} md={10} xs={12} sm={12} sx={{ display: "flex", marginLeft: "40px", justifyContent: "center", "@media only screen and (max-width:550px)": { flexDirection: "column" } }} >
                            <Grid item lg={4} md={4} xs={12} sm={12} sx={{ display: 'flex', "@media only screen and (max-width:550px)": { flexDirection: "column" } }}>
                                <Typography sx={userStyle.importheadtext} style={{ marginLeft: "5px" }}> Cover letter   </Typography>&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
                                <Button variant="outlined" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: '5px', } }} >
                                    Upload
                                    <input type='file' id="resume"
                                        accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                                        name='file' hidden onChange={handleCoverletterUpload}
                                    />
                                </Button>
                            </Grid>
                            <Grid item lg={6} md={6} xs={12} sm={12} sx={{}}>
                                {coverletter?.length > 0 &&
                                    (coverletter.map((file, index) => (
                                        <>
                                            <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                                                <Grid item lg={8} md={8} sm={8} xs={8}>
                                                    <Typography>{file.name}</Typography>
                                                </Grid>
                                                <Grid item lg={1} md={1} sm={1} xs={1}>
                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewcover(file)} />
                                                </Grid>
                                                <Grid item lg={1} md={1} sm={1} xs={1}>
                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeletecover(index)}><DeleteIcon /></Button>

                                                </Grid>
                                            </Grid>
                                        </>
                                    )))}
                                {/* </Typography> */}
                            </Grid>
                        </Grid>
                        <Grid item lg={10} md={10} xs={12} sm={12} sx={{ display: "flex", marginLeft: "40px", justifyContent: "center", "@media only screen and (max-width:550px)": { flexDirection: "column" } }} >
                            <Grid item lg={4} md={4} xs={12} sm={12} sx={{ display: 'flex', "@media only screen and (max-width:550px)": { flexDirection: "column" } }}>
                                <Typography sx={userStyle.importheadtext} style={{ marginLeft: "5px" }}>  Experience Letter   </Typography>&ensp;
                                <Button variant="outlined" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: '5px', } }} >
                                    Upload
                                    <input type='file' id="resume"
                                        accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                                        name='file' hidden onChange={handleExperienceletterUpload}
                                    />
                                </Button>
                            </Grid>
                            <Grid item lg={6} md={6} xs={12} sm={12} sx={{}}>
                                {experienceletter?.length > 0 &&
                                    (experienceletter.map((file, index) => (
                                        <>
                                            <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                                                <Grid item lg={8} md={8} sm={8} xs={8}>
                                                    <Typography>{file.name}</Typography>
                                                </Grid>
                                                <Grid item lg={1} md={1} sm={1} xs={1}>
                                                    <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewexp(file)} />
                                                </Grid>
                                                <Grid item lg={1} md={1} sm={1} xs={1}>
                                                    <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteexp(index)}><DeleteIcon /></Button>

                                                </Grid>
                                            </Grid>
                                        </>
                                    )))}
                            </Grid>
                        </Grid>
                        <Grid item lg={10} md={10} xs={10} sm={10} sx={userStyle.next}>
                            <Button className="next" variant="contained"
                                sx={userStyle.Previousbutton} onClick={prevStep}> <WestIcon sx={{ '@media only screen and (max-width: 900px)': { fontSize: "medium" } }} />&emsp; <b>Previous</b>
                            </Button>&emsp;&emsp;
                            <Button className="next" variant="contained"
                                sx={userStyle.nextbutton}
                                onClick={handleSubmit}>
                                <b>Save</b> &emsp;
                            </Button>
                        </Grid>
                    </Grid >
                </Box >
            </>
        );
    };

    const renderIndicator = () => {
        return (
            <Box >
                <Grid container spacing={2}>
                    {steperDisplay ?
                        <>
                            <Grid item lg={12} md={12} sm={12} xs={12} >
                                <Box >
                                    <ul className="indicatorverticalwebsite">
                                        <li className={step >= 1 ? "active" : null}>
                                            <PersonPinIcon sx={{ fontSize: "50px", "@media only screen and (max-width:550px)": { fontSize: "40px !important" } }} />
                                            <Box
                                                sx={{
                                                    borderTop: "2px solid",
                                                    marginTop: "28px",
                                                    width: "100px",
                                                    '@media only screen and (max-width: 850px)': {
                                                        display: "none"
                                                    },
                                                }}
                                            >&ensp;</Box>
                                        </li>
                                        <li className={step >= 2 ? "active" : null}>
                                            <HomeIcon sx={{ fontSize: "50px", "@media only screen and (max-width:550px)": { fontSize: "40px !important", } }} />

                                            <Box
                                                sx={{
                                                    borderTop: "2px solid",
                                                    marginTop: "28px",
                                                    width: "100px",
                                                    '@media only screen and (max-width: 850px)': {
                                                        display: "none"
                                                    },
                                                }}
                                            >&ensp;</Box>
                                        </li>
                                        <li className={step >= 3 ? "active" : null}>
                                            <FamilyRestroomIcon sx={{ fontSize: "50px", "@media only screen and (max-width:550px)": { fontSize: "40px !important", } }} />
                                            <Box
                                                sx={{
                                                    borderTop: "2px solid",
                                                    marginTop: "28px",
                                                    width: "100px",
                                                    '@media only screen and (max-width: 850px)': {
                                                        display: "none"
                                                    },
                                                }}
                                            >&ensp;</Box>
                                            &ensp;
                                        </li>
                                        <li className={step >= 4 ? "active" : null}>
                                            <SchoolIcon sx={{ fontSize: "50px", "@media only screen and (max-width:550px)": { fontSize: "40px !important", } }} />
                                            <Box
                                                sx={{
                                                    borderTop: "2px solid",
                                                    marginTop: "28px",
                                                    width: "100px",
                                                    '@media only screen and (max-width: 850px)': {
                                                        display: "none"
                                                    },
                                                }}
                                            >&ensp;</Box>
                                            &ensp;
                                        </li>
                                        <li className={step >= 5 ? "active" : null}>
                                            <AppRegistrationIcon sx={{ fontSize: "50px", "@media only screen and (max-width:550px)": { fontSize: "40px !important", } }} />
                                        </li>
                                    </ul>
                                </Box>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                {step === 1 ? renderStepOne() : null}
                                {step === 2 ? renderStepTwo() : null}
                                {step === 3 ? renderStepThree() : null}
                                {step === 4 ? renderStepFour() : null}
                                {step === 5 ? renderStepFive() : null}
                            </Grid>
                        </>
                        :
                        <>
                            <Grid item lg={9.2} md={9.2} sm={12} xs={12}>
                                {step === 1 ? renderStepOne() : null}
                                {step === 2 ? renderStepTwo() : null}
                                {step === 3 ? renderStepThree() : null}
                                {step === 4 ? renderStepFour() : null}
                                {step === 5 ? renderStepFive() : null}
                            </Grid>
                            <Grid item lg={2.8} md={2.8} sm={12} xs={12} className="indicatorwebsite" sx={{ height: '100%', position: 'sticky', top: '0', }}>
                                <ul style={{ marginLeft: '45px' }}>
                                    <li className={step >= 1 ? "active" : null}>
                                        <PersonPinIcon style={{ fontSize: "60px", }} />
                                        <Typography>Basic Information</Typography>
                                        <div
                                            style={{
                                                borderLeft: "2px solid",
                                                marginLeft: "28px",
                                                height: "60px"
                                            }}
                                        >&ensp;</div>
                                    </li>
                                    <li className={step >= 2 ? "active" : null}>
                                        <HomeIcon style={{ fontSize: "60px" }} />
                                        <Typography>Address Information</Typography>
                                        <div
                                            style={{
                                                borderLeft: "2px solid",
                                                marginLeft: "28px",
                                                height: "60px"
                                            }}
                                        >&ensp;</div>
                                    </li>
                                    <li className={step >= 3 ? "active" : null}>
                                        <FamilyRestroomIcon style={{ fontSize: "60px" }} />
                                        <Typography>Professional Details</Typography>
                                        <div
                                            style={{
                                                borderLeft: "2px solid",
                                                marginLeft: "28px",
                                                height: "60px"
                                            }}
                                        >&ensp;</div>
                                        &ensp;
                                    </li>
                                    <li className={step >= 4 ? "active" : null}>
                                        <SchoolIcon style={{ fontSize: "60px" }} />
                                        <Typography>Education details</Typography>
                                        <div
                                            style={{
                                                borderLeft: "2px solid",
                                                marginLeft: "28px",
                                                height: "60px"
                                            }}
                                        >&ensp;</div>
                                        &ensp;
                                    </li>
                                    <li className={step >= 5 ? "active" : null}>
                                        <AppRegistrationIcon style={{ fontSize: "60px" }} />
                                        <Typography>Experience Details</Typography>
                                        <div
                                            style={{
                                                borderLeft: "2px solid",
                                                marginLeft: "28px",
                                                height: "60px"
                                            }}
                                        >&ensp;</div>
                                        &ensp;
                                    </li>
                                    <li className={step >= 6 ? "active" : null}>
                                        <BorderLinearProgress variant="determinate" value={step * 20} />
                                        &ensp;
                                    </li>
                                </ul>
                            </Grid>
                        </>
                    }
                </Grid>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'tomato' }} />
                        <Typography variant="h6" sx={{ fontFamily: "JostMedium", fontWeight: "bold" }}>{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" color="error" sx={{ color: 'tomato' }} onClick={handleClose} >ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    };

    return (
        <Box>
            {/* <Navbar /><br /><br /><br /><br /> */}
            <Box sx={{ width: '100%' }}>
                <Box component="main" className='contents' >
                    {renderIndicator()}
                </Box>
            </Box>
            {/* <Footer /> */}
        </Box>
    );
}

export default Candidate;