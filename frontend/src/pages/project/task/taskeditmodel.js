



import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, FormControl, TableBody, TextField, TableRow, FormControlLabel, TableCell, Select,
    MenuItem, DialogContent, Grid, Dialog, DialogActions, DialogTitle, DialogContentText, Paper, Table, TableHead, TableContainer, Button, InputLabel
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import axios from "axios";
import { FaPrint, FaFilePdf, FaTrash, FaEdit } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { useReactToPrint } from "react-to-print";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import jsPDF from "jspdf";
import Checkbox from "@mui/material/Checkbox";
import "jspdf-autotable";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import moment from "moment-timezone";
import { SERVICE } from "../../../services/Baseservice";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import { makeStyles } from "@material-ui/core";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import csvIcon from "../../../components/Assets/CSV.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import { FaPlus } from "react-icons/fa";
import Selects from "react-select";
import { Link } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext'
import { ThreeDots } from 'react-loader-spinner'
import { green } from '@mui/material/colors';
import { useParams } from "react-router-dom";
import CircularProgress, { circularProgressClasses, } from '@mui/material/CircularProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const useStyles = makeStyles((theme) => ({
    inputs: {
        display: "none",
    },
    preview: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: theme.spacing(2),
        "& > *": {
            margin: theme.spacing(1),
        },
    },
}));

function FacebookCircularProgress(props) {
    return (
        <Box style={{ position: 'relative' }}>
            <CircularProgress
                variant="determinate"
                style={{
                    color: (theme) =>
                        theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                }}
                size={40}
                thickness={4}
                {...props}
                value={100}
            />
            <CircularProgress
                variant="indeterminate"
                disableShrink
                style={{
                    color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                    animationDuration: '550ms',
                    position: 'absolute',
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: 'round',
                    },
                }}
                size={40}
                thickness={4}
                {...props}
            />
        </Box>
    );
}


const Taskeditmodel = ({ idval, rowval, alldatacombine, fetchAllTasks }) => {

    const [checkedall, setCheckedall] = useState(false);
    const [todosallusers, settodosallusers] = useState([]);

    const [getrowid, setRowGetid] = useState("");
    const [TaskDetailEdit, setTaskDetailEdit] = useState({
        project: "",
        subproject: "",
        module: "",
        submodule: "",
        taskname: "",
        taskid: "",
        calculatedtime: "",
        priority: "",
        assignedby: "",
        assignedbyprofileimg: "",
        assignedmode: "",
        assigneddate: "",
        assignedtodeveloper: "",
        description: "",
        pbiupload: "",
        resources: "",
        checkpointsdev: "",
        assignedtotester: "",
        descriptiontester: "",
        pbitester: "",
        usecasetester: "",

    });

    const { isUserRoleCompare, allProjects, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    let username = isUserRoleAccess.username;

    const [TaskDetailList, setTaskDetailList] = useState([]);

    // EDITOR BOX
    const [textEdit, setTextEdit] = useState();
    const [textSummEdit, setTextSummaryEdit] = useState();

    const [prioritiesEdit, setprioritiesEdit] = useState([]);

    const [assignedtotesteredit, setAssignedtotesteredit] = useState([]);

    //FETCHCHECKPOINTS
    const [taskcheckdefaults, settaskcheckdefaults] = useState([]);
    const [taskcheckdefaults2, settaskcheckdefaults2] = useState([]);

    const [checktaskedit, setchecktaskedit] = useState(false);
    const [deverrormsg, setdeverrormsg] = useState("");
    const [devcheckerrormsg, setdevcheckerrormsg] = useState("");
    const [deverrormsgedit, setdeverrormsgedit] = useState("");
    const [testererrormsgedit, settestererrormsgedit] = useState("");
    const [devcheckerrormsgedit, setdevcheckerrormsgedit] = useState("");
    const [editCalculateTime, setEditCalculatedTime] = useState(0);
    const [taskscaltime, settaskscaltime] = useState([]);
    const classes = useStyles();
    // let formattedDate = yyyy + "-" + mm + "-" + dd;
    const [assignedtodeveloperedit, setAssignedtodeveloperedit] = useState([]);

    const [projects, setProjects] = useState([]);
    const [subprojects, setSubprojects] = useState([]);
    const [modules, setModules] = useState([]);


    const [editTimeCalculation, setEditTimeCalculation] = useState("");
    const [timeCalculation, setTimeCalculation] = useState(0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [calculatedTimeEdit, setCalculatedTimeEdit] = useState("");
    const [checked, setChecked] = useState(false);
    const [checkededit, setCheckededit] = useState(false);


    const [todoscheckedit, setTodoscheckedit] = useState([]);
    const [selectedOptioncheckedit, setSelectedOptioncheckedit] = useState(null);
    const [editingIndexcheckedit, setEditingIndexcheckedit] = useState(-1);
    const [editedTodocheckedit, setEditedTodocheckedit] = useState("");
    const [editedTododescheckedit, setEditedTododescheckedit] = useState("");
    const [newTodoTitlecheckedit, setNewTodoTitlecheckedit] = useState("");

    const [newTodoPrioritiesedit, setNewTodoPrioritiesedit] = useState("");
    const [editTodoPriorityedit, seteditTodoPriorityedit] = useState("");

    const [todoscheck, setTodoscheck] = useState([]);
    const [subcategorylist, setSubcategorylist] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("");
    const [datafetchedit, setDatafetchedit] = useState("");
    const [existingoptionedit, setExistingoptionedit] = useState("");
    const [nameedit, setNameedit] = useState("");
    const [inputvalueedit, setInputvalueedit] = useState("");
    const [sizeheightedit, setSizeheightedit] = useState("");
    const [sizewidthedit, setSizewidthedit] = useState("");
    const [colouredit, setColouredit] = useState("");
    const [directionedit, setDirectionedit] = useState("");
    const [positionedit, setPositionedit] = useState("");

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    // Error Popup model
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    //check points
    const [todos, setTodos] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [editedTodo, setEditedTodo] = useState("");
    const [editedTododes, setEditedTododes] = useState("");
    const [newTodoTitle, setNewTodoTitle] = useState("");
    const [newTodoUser, setNewTodoUser] = useState("");
    const [editTodoUser, seteditTodoUser] = useState("");

    const [newTodoStatus, setNewTodoStatus] = useState("");
    const timer = useRef();

    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
    };

    useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    const id = useParams().id;

    const [todos2, setTodos2] = useState([]);
    const [selectedOption2, setSelectedOption2] = useState(null);
    const [editingIndex2, setEditingIndex2] = useState(-1);
    const [editedTodo2, setEditedTodo2] = useState("");
    const [editedTododes2, setEditedTododes2] = useState("");
    const [newTodoTitle2, setNewTodoTitle2] = useState("");

    //first addfile...
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFilesedit, setSelectedFilesedit] = useState([]);

    //2nd file....
    const [assignfile, setAssignfile] = useState([]);
    const [assignfileedit, setAssignfileEdit] = useState([]);
    //3rd file...

    const [uploadfiles, setUploadfiles] = useState([]);
    const [uploadfilesedit, setUploadfilesEdit] = useState([])

    // Edit model
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [taskData, setTaskData] = useState([]);
    const [calculatedTime, setCalculatedTime] = useState("");
    const [calTimeMode, setCalTimeMod] = useState("");
    const [timeRestrict, setTimeRestrict] = useState("");
    //For Edit Section --> Estimate Time Functionality

    const [calTimeModeEdit, setCalTimeModEdit] = useState("");
    const [timeRestrictEdit, setTimeRestrictEdit] = useState("");

    //checkpoint edit start

    const [todosedit, setTodosedit] = useState([]);
    const [selectedOptionedit, setSelectedOptionedit] = useState(null);
    const [editingIndexedit, setEditingIndexedit] = useState(-1);
    const [editedTodoedit, setEditedTodoedit] = useState("");
    const [editedTododesedit, setEditedTododesedit] = useState("");
    const [newTodoTitleedit, setNewTodoTitleedit] = useState("");
    const [newTodoUsersedit, setNewTodoUsersedit] = useState("");
    const [editTodoUsersedit, seteditTodoUsersedit] = useState("");
    const [newTodoStatusedit, setNewTodoStatusedit] = useState("");
    const [newTodoPriorityedit, setNewTodoPrioritysedit] = useState("");
    const [editTodopriority, seteditTodoPriority] = useState("");
    const [title, setTitle] = useState("");

    // Usecaase tester for edit

    // Usecaase tester for edit
    const [todos2edit, setTodos2edit] = useState([]);
    const [selectedOption2edit, setSelectedOption2edit] = useState(null);
    const [editingIndex2edit, setEditingIndex2edit] = useState(-1);
    const [editedTodo2edit, setEditedTodo2edit] = useState("");
    const [editedTododes2edit, setEditedTododes2edit] = useState("");
    const [newTodoTitle2edit, setNewTodoTitle2edit] = useState("");
    const [title2, setTitle2] = useState("");

    // work order state
    const [teamData, setTeamsData] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [workOrder, setWorkOrder] = useState({
        assignby: "", assignmode: "", assigndate: "", team: "", calculatedtime: "",
    })
    const [workOrderTodos, setWorkOrderTodos] = useState([])

    const [selectedProgress, setSelectedProgress] = useState('');
    const [showReplaceConfirmation, setShowReplaceConfirmation] = useState(false);

    let loginid = localStorage.LoginUserId;
    const authToken = localStorage.APIToken;

    //updated by data added
    let updateby = TaskDetailEdit?.updatedby;
    let addedby = TaskDetailEdit?.addedby;

    const [isLoading, setIsLoading] = useState(true); // Add loading state

    //get single row to edit Page
    const getCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setchecktaskedit(true);
            setRowGetid(res?.data?.staskAssignBoardList);
            setTaskDetailEdit(res?.data?.staskAssignBoardList);
            setWorkOrder(res?.data?.staskAssignBoardList);
            setTodoscheck(res?.data?.staskAssignBoardList?.subComReq);
            setWorkOrderTodos(res?.data?.staskAssignBoardList?.workorders);
            // Set default value for workOrder.team if it's not already set
            if (!workOrder.team && res?.data?.staskAssignBoardList?.team) {
                setWorkOrder({ ...workOrder, team: res.data.staskAssignBoardList.team });
            }
            handleClickOpenEdit();
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const [selectedTeam, setSelectedTeam] = useState(""); // Initialize with an empty string
    const [editDeveloper, setEditDeveloper] = useState([]);

    //work order starts
    //fetch teams
    const fetchteams = async () => {
        try {
            let teams = await axios.get(SERVICE.TEAMS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setTeamsData(teams?.data?.teamsdetails);
            let res_employee = await axios.get(SERVICE.USERALLLIMIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let result = res_employee?.data?.users?.filter((d) => {
                if (d.team === workOrder.team) {
                    return d.username
                }
            })
            setEditDeveloper(result)
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        fetchteams();
    }, [editDeveloper, workOrder])

    //get all employees list details
    const fetchEmployee = async (value) => {
        try {
            let res_employee = await axios.get(SERVICE.USERALLLIMIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let result = res_employee?.data?.users?.filter((d) => {
                if (d.team === value) {
                    return d.username
                }
            })
            setEmployees(result)
            setIsLoading(false);
        } catch (err) {setIsLoading(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    // get all shifts
    const fetchAllPriority = async () => {
        try {
            let res_priority = await axios.get(SERVICE.PRIORITY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setPriorities(res_priority?.data?.priorities);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        fetchAllPriority();
    }, [])

    // work progress onchange
    const handleProgressChange = (e) => {
        setSelectedProgress(e.target.value);
    };

    const [subComponentEditing, setSubComponentEditing] = useState(workOrderTodos.map(() => []));

    const addProgressItem = (idval) => {

        if (workOrder.assignmode == "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Assign Mode"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (workOrder.assigndate == "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Assigned Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (workOrder.team == "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Team"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (workOrder.calculatedtime == "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Fill Calculated Time"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedProgress == "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Work Progress"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            // Check if the selected work progress already exists in the list
            const existingTodo = workOrderTodos.find(
                (todo) => todo.progress === selectedProgress
            );

            if (existingTodo) {
                // Work progress already exists, show an alert
                // alert("Work progress already exists!");
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Work progress already exists"}</p>
                    </>
                );
                handleClickOpenerr();

                return; // Do not add a duplicate todo
            }
            else if (workOrderTodos.length > 0) {
                setShowReplaceConfirmation(true);
            }
            else {
                // Use map to extract subComponent and subEstTime from todoscheck
                const newRequirement = {
                    progress: selectedProgress,
                    idval: idval,
                    subComponents: todoscheck.map((item, subIndex) => ({
                        id: `${idval}_${subIndex}`,
                        subcomponent: item.subcomponent,
                        subEstTime: item.subEstTime,
                        developer: "",
                        priority: "",
                    })),
                };
                setWorkOrderTodos([...workOrderTodos, newRequirement]);
                setSubComponentEditing([...subComponentEditing, Array(todoscheck.length).fill(false)]);

            }
        }
    };

    // Work order todo update
    const handleWorkOrderUpdateTodoEdit = (progressIndex, subComponentIndex, reference, inputvalue) => {
        const updatedTodos = [...workOrderTodos];
        updatedTodos[progressIndex].subComponents[subComponentIndex][reference] = inputvalue;
        setWorkOrderTodos(updatedTodos);
    };

    // Initialize subComponentEditing when workOrderTodos or todoscheck change
    useEffect(() => {
        const numRows = workOrderTodos.length;
        const numCols = todoscheck.length;
        const initialEditingState = Array(numRows)
            .fill()
            .map(() => Array(numCols).fill(false));
        setSubComponentEditing(initialEditingState);
    }, [workOrderTodos, todoscheck]);


    // work order popup replace function
    const handleReplaceConfirmationYes = () => {
        // Get the last item in the workOrderTodos array
        const lastTodoIndex = workOrderTodos.length - 1;
        if (lastTodoIndex >= 0) {
            const updatedTodos = [...workOrderTodos];
            updatedTodos[lastTodoIndex] = {
                progress: selectedProgress,
                idval: lastTodoIndex, // You can use the index as idval
                subComponents: todoscheck.map((item, subIndex) => ({
                    id: `${lastTodoIndex}_${subIndex}`,
                    subcomponent: item.subcomponent,
                    subEstTime: item.subEstTime,
                    developer: "",
                    priority: "",
                })),
            };

            // Update the state with the replaced work progress
            setWorkOrderTodos(updatedTodos);
            setSubComponentEditing([...subComponentEditing, Array(todoscheck.length).fill(false)]);
        }

        // Close the confirmation dialog
        setShowReplaceConfirmation(false);
    };

    // Function to handle "No" button click in the confirmation dialog
    const handleReplaceConfirmationNo = (idval) => {
        // Close the confirmation dialog
        setShowReplaceConfirmation(false);

        // Add the new work progress
        const newRequirement = {
            progress: selectedProgress,
            idval: idval,
            subComponents: todoscheck.map((item, subIndex) => ({
                id: `${idval}_${subIndex}`, // This should generate IDs like "idval_0", "idval_1", etc.
                subcomponent: item.subcomponent,
                subEstTime: item.subEstTime,
                developer: "",
                priority: "",
            })),
        };

        setWorkOrderTodos([...workOrderTodos, newRequirement]);
        setSubComponentEditing([...subComponentEditing, Array(todoscheck.length).fill(false)]);
    };

    // Work order todo toggle icons
    const toggleSubComponentEditing = (id) => {
        const [progressIndex, subIndex] = id.split("_").map(Number); // Split the ID to get progressIndex and subIndex
        const newSubComponentEditing = [...subComponentEditing];
        newSubComponentEditing[progressIndex][subIndex] = !newSubComponentEditing[progressIndex][subIndex];
        setSubComponentEditing(newSubComponentEditing);
    };

    //work order ends

    //editing the single data for Edit Page
    let task_det_id = getrowid._id;

    const sendEditRequest = async () => {
        try {
            let taskAsignBoard = await axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${task_det_id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                project: TaskDetailEdit.project,
                subproject: TaskDetailEdit.subproject,
                module: TaskDetailEdit.module,
                submodule: TaskDetailEdit.submodule,
                pagetype: TaskDetailEdit.pagetype,
                mainpage: TaskDetailEdit.mainpage,
                subpage: TaskDetailEdit.subpage,
                name: TaskDetailEdit.name,
                estimationtype: TaskDetailEdit.estimationtype,
                estimationtime: TaskDetailEdit.estimationtime,
                status: "assigned",
                taskassignboardliststatus: String(TaskDetailEdit.taskassignboardliststatus),
                // componentgrouping: selectedComponentgrp.value,
                // component: selectedComponent.value,
                // subcomponent: selectedSubComponent.value,
                // count: TaskDetailEdit.count,
                subComReq: [...todoscheck],
                updatedby: [
                    ...updateby, {
                        name: String(username),
                        date: String(new Date()),
                    },
                ],
                //workorder
                assignby: String(workOrder.assignby),
                assignmode: String(workOrder.assignmode),
                assigndate: String(workOrder.assigndate),
                team: String(workOrder.team),
                calculatedtime: String(workOrder.calculatedtime),
                workorders: workOrderTodos,
            });
            setTaskDetailEdit(taskAsignBoard.data);
            setWorkOrder(taskAsignBoard.data);
            handleCloseModEdit();

        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //Edit Button
    const editSubmit = (e) => {
        e.preventDefault();
        sendEditRequest();
    };

    const getOpenDetails = (e) => {
        handleClickOpenerr();
    }

    // Edit model
    const handleClickOpenEdit = async () => {
        // await fetchSubProjectDropdownsedit();
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setIsEditOpen(false);
        setCheckedall(false)
    };

    return (
        <>
            {isUserRoleCompare[0]?.etask && (
                <>
                    <Button
                        sx={userStyle.buttonedit}
                        onClick={() => {
                            handleClickOpenEdit();
                            getCode(idval);
                        }}
                    >
                        <FaEdit style={{ fontsize: "large" }} />
                    </Button>
                </>
            )}
            <Dialog
                open={isEditOpen}
                onClose={handleCloseModEdit}
                aria-labelledby="alert-dialog-time"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <>
                    <Box sx={userStyle.dialogbox}>
                        <Typography sx={userStyle.HeaderText}> Edit Task </Typography>
                        <br />
                        {!checktaskedit ?
                            <>
                                <Box style={{ display: 'flex', justifyContent: 'center', paddingTop: '220px', minHeight: '600px', maxHeight: '800px', minWidth: "700px" }}>
                                    <FacebookCircularProgress />
                                </Box>
                            </>
                            :
                            <>
                                <Accordion sx={{ boxShadow: "none" }} defaultExpanded={true}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography style={{ fontWeight: 'bold', textAlign: 'left', fontSize: '18px', color: '#333', margin: '20px 0' }}>Task Details</Typography>
                                    </AccordionSummary>
                                    <Grid container spacing={2}>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <Typography>Project <b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    // options={projectEdit}
                                                    value={TaskDetailEdit.project}
                                                />
                                            </FormControl>
                                        </Grid>
                                        {/* {subprojectnone == "None" ? null : */}
                                        <Grid item md={4} xs={12} sm={12}>
                                            <Typography>Sub Project  <b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    value={TaskDetailEdit.subproject}
                                                />
                                            </FormControl>
                                        </Grid>
                                        {/* } */}
                                        <Grid item md={4} xs={12} sm={12}>
                                            <Typography>Module  <b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl size="small" fullWidth>
                                                <TextField
                                                    value={TaskDetailEdit.module}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography> SubModule Name  <b style={{ color: "red" }}>*</b></Typography>
                                                <TextField
                                                    value={TaskDetailEdit.submodule}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={4} xs={12} sm={12}>
                                            <Typography>Page Type<b style={{ color: "red" }}>*</b></Typography>
                                            <TextField
                                                size="small"
                                                variant="outlined"
                                                fullWidth
                                                value={TaskDetailEdit.pagetype}
                                            />

                                        </Grid>
                                        {TaskDetailEdit?.pagetype?.split("-")[0] === "MAINPAGE" ?
                                            <Grid item md={4} xs={12} sm={12}>
                                                <Typography>Mainpage Name<b style={{ color: "red" }}>*</b></Typography>
                                                <FormControl fullWidth size="small" >
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        value={TaskDetailEdit.name}
                                                    // onChange={(e) => { setMainPageDropName(e.target.value); }}
                                                    />
                                                </FormControl>
                                            </Grid> :
                                            TaskDetailEdit?.pagetype?.split("-")[0] === "SUBPAGE" ?
                                                <>
                                                    <Grid item md={4} xs={12} sm={12}>
                                                        <Typography>Main Page<b style={{ color: "red" }}>*</b></Typography>
                                                        {/* <Selects */}
                                                        <TextField
                                                            size="small"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={TaskDetailEdit.mainpage}
                                                        />
                                                    </Grid>
                                                    <Grid item md={4} xs={12} sm={12}>
                                                        <Typography>Subpage Name<b style={{ color: "red" }}>*</b></Typography>
                                                        <FormControl fullWidth size="small" >
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                type="text"
                                                                value={TaskDetailEdit.name}
                                                            // onChange={(e) => { setSubPageDropNameEdit(e.target.value); }}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </>
                                                :
                                                TaskDetailEdit?.pagetype?.split("-")[0] === "SUBSUBPAGE" ?
                                                    <>
                                                        <Grid item md={4} xs={12} sm={12}>
                                                            <Typography>Main Page<b style={{ color: "red" }}>*</b></Typography>
                                                            <TextField
                                                                size="small"
                                                                variant="outlined"
                                                                fullWidth
                                                                value={TaskDetailEdit.mainpage}
                                                            />
                                                        </Grid>
                                                        <Grid item md={4} xs={12} sm={12}>
                                                            <Typography>Sub page<b style={{ color: "red" }}>*</b></Typography>
                                                            <TextField
                                                                size="small"
                                                                variant="outlined"
                                                                fullWidth
                                                                value={TaskDetailEdit.subpage}
                                                            />
                                                        </Grid>
                                                        <Grid item md={4} xs={12} sm={12}>
                                                            <Typography>Subssub page<b style={{ color: "red" }}>*</b></Typography>
                                                            <FormControl fullWidth size="small" >
                                                                <OutlinedInput
                                                                    id="component-outlined"
                                                                    type="text"
                                                                    value={TaskDetailEdit.name}
                                                                // onChange={(e) => { setSubSubPageDropNameEdit(e.target.value); }}

                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                    </> : ""
                                        }
                                        <Grid item md={4} xs={12} sm={12}>
                                            <Typography>Estimation Type<b style={{ color: "red" }}>*</b></Typography>
                                            <TextField
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={TaskDetailEdit.estimationtype}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}

                                            >
                                            </TextField>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <Typography>Estimation Time<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small" >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="Number"
                                                    placeholder="please enter time"
                                                    value={TaskDetailEdit.estimationtime}
                                                />

                                            </FormControl>
                                        </Grid>

                                    </Grid>
                                </Accordion>
                                <br />
                                {/* <hr style={{ color: '#fbf5f559', height: '1px' }} /> */}
                                <br />

                                <Box>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography sx={{ fontWeight: 'bold', textAlign: 'left', fontSize: '18px', color: '#333', margin: '20px 0' }}>Requirements</Typography>
                                        </AccordionSummary>
                                        <Grid container spacing={2} sx={{ padding: '10px' }}>
                                            <Grid item md={1.5} xs={12} sm={12}>
                                                <Typography sx={{ fontWeight: "bold" }}>S.No</Typography>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <Typography sx={{ fontWeight: "bold" }}>Sub-Component Name<b style={{ color: "red" }}>*</b></Typography>
                                            </Grid>
                                            <Grid item md={2.5} xs={12} sm={12}>
                                                <Typography sx={{ fontWeight: "bold" }}>Estimation Time<b style={{ color: "red" }}>*</b></Typography>
                                            </Grid>
                                            <Grid item md={2.5} xs={12} sm={12}>
                                                <Typography sx={{ fontWeight: "bold" }}>Estimation Type<b style={{ color: "red" }}>*</b></Typography>
                                            </Grid>
                                            <Grid item md={2.5} xs={12} sm={12}> </Grid>
                                        </Grid><br />
                                        {todoscheck.length > 0 && todoscheck.map((data, index) => (
                                            <>
                                                <Grid container spacing={2} sx={{ paddingLeft: '10px' }}>
                                                    <Grid item md={1.5} xs={12} sm={12}>
                                                        <Typography>{index + 1 + " " + "."}</Typography>
                                                    </Grid>
                                                    <Grid item md={3} xs={12} sm={12}>
                                                        <Typography>{data.subcomponent}</Typography>
                                                    </Grid>
                                                    <Grid item md={2.5} xs={12} sm={12}>
                                                        <Typography>{data.subEstTime}</Typography>
                                                    </Grid>
                                                    <Grid item md={2.5} xs={12} sm={12}>
                                                        <Typography>{data.subEstType}</Typography>
                                                    </Grid>
                                                    <Grid item md={2.5} xs={12} sm={12}></Grid>
                                                    {/* <Grid item md={1} xs={12} sm={12}>
                                                            <Button>Edit Time</Button>
                                                        </Grid>
                                                        <Grid item md={1} xs={12} sm={12}>
                                                            <Button onClick={() => { getOpenDetails(index); }}>View More</Button>
                                                        </Grid> */}
                                                </Grid><br />
                                            </>
                                        ))}
                                    </Accordion>
                                </Box><br></br>

                                {/* workprogress details */}
                                <Box sx={{ borderTop: '1px solid #8080802e' }}>
                                    <Accordion sx={{ boxShadow: "none", }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography sx={{ fontWeight: 'bold', textAlign: 'left', fontSize: '18px', color: '#333', margin: '20px 0' }} >Work Order</Typography>
                                        </AccordionSummary>
                                        <Grid container spacing={2} sx={{ minHeight: "250px", paddingLeft: '20px', paddingRight: '20px' }}>
                                            <Grid item md={4} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography >Assigned By <b style={{ color: "red" }}>*</b></Typography>
                                                    <TextField readOnly size="small"
                                                        value={workOrder.assignby ? workOrder.assignby : isUserRoleAccess.username} />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={4} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography >Assign Mode <b style={{ color: "red" }}>*</b></Typography>
                                                    <Select
                                                        fullWidth
                                                        labelId="demo-select-small"
                                                        id="demo-select-small"
                                                        MenuProps={{
                                                            PaperProps: {
                                                                style: {
                                                                    maxHeight: 200,
                                                                    width: 80,
                                                                },
                                                            },
                                                        }}
                                                        value={workOrder.assignmode}
                                                        onChange={(e) => { setWorkOrder({ ...workOrder, assignmode: e.target.value }); }}
                                                        inputProps={{ 'aria-label': 'Without label' }}
                                                    >
                                                        <MenuItem value="Auto"> {"Auto"} </MenuItem>
                                                        <MenuItem value="Manual"> {"Manual"} </MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={4} sm={12} xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography >Assigned Date <b style={{ color: "red" }}>*</b></Typography>
                                                    <TextField size="small"
                                                        value={workOrder.assigndate ? workOrder.assigndate : today}
                                                        type="date"
                                                        onChange={(e) => { setWorkOrder({ ...workOrder, assigndate: e.target.value, }) }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={4} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography >Team <b style={{ color: "red" }}>*</b></Typography>
                                                    <Select
                                                        fullWidth
                                                        labelId="demo-select-small"
                                                        id="demo-select-small"
                                                        MenuProps={{
                                                            PaperProps: {
                                                                style: {
                                                                    maxHeight: 200,
                                                                    width: 80,
                                                                },
                                                            },
                                                        }}
                                                        value={workOrder.team}
                                                        onChange={(e) => {
                                                            setWorkOrder({
                                                                ...workOrder, team: e.target.value,
                                                                calculatedtime: TaskDetailEdit.estimationtype === "Hours" ? TaskDetailEdit.estimationtime * 60 : TaskDetailEdit.estimationtype === "Year" ? TaskDetailEdit.estimationtime + " " + "Year" : TaskDetailEdit.estimationtype === "Month" ? TaskDetailEdit.estimationtime + " " + "Month" : workOrder.calculatedtime,


                                                            }); fetchEmployee(e.target.value)
                                                        }}
                                                        inputProps={{ 'aria-label': 'Without label' }}
                                                    >
                                                        {teamData && teamData.map((item, index) => (
                                                            <MenuItem key={index} value={item.teamname}> {item.teamname} </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={4} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography >Calculated Time <b style={{ color: "red" }}>*</b></Typography>
                                                    <TextField size="small"
                                                        value={TaskDetailEdit.estimationtype === "Hours" ? TaskDetailEdit.estimationtime * 60 + " " + "Minutes" : TaskDetailEdit.estimationtype === "Year" ? TaskDetailEdit.estimationtime + " " + "Year" : TaskDetailEdit.estimationtype === "Month" ? TaskDetailEdit.estimationtime + " " + "Month" : workOrder.calculatedtime}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={4} xs={12} sm={12}></Grid>
                                            <Grid item md={4} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography >Work Progress <b style={{ color: "red" }}>*</b></Typography>
                                                    <Select
                                                        fullWidth
                                                        labelId="demo-select-small"
                                                        id="demo-select-small"
                                                        MenuProps={{
                                                            PaperProps: {
                                                                style: {
                                                                    maxHeight: 200,
                                                                    width: 80,
                                                                },
                                                            },
                                                        }}
                                                        value={selectedProgress}
                                                        onChange={handleProgressChange}
                                                        displayEmpty
                                                        inputProps={{ 'aria-label': 'Without label' }}
                                                    >
                                                        <MenuItem value="UI Design"> {"UI Design"} </MenuItem>
                                                        <MenuItem value="Development"> {"Development"} </MenuItem>
                                                        <MenuItem value="Source Integration"> {"Source Integration"} </MenuItem>
                                                        <MenuItem value="Test Development"> {"Test Development"} </MenuItem>
                                                        <MenuItem value="Test Environment"> {"Test Environment"} </MenuItem>
                                                        <MenuItem value="Production Deployment"> {"Production Deployment"} </MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={2} sm={1} xs={1}>
                                                <Button
                                                    variant="contained"
                                                    style={{
                                                        height: "30px",
                                                        minWidth: "20px",
                                                        padding: "19px 13px",
                                                        color: "white",
                                                        marginTop: "24px",
                                                        background: "rgb(25, 118, 210)",
                                                    }}
                                                    onClick={() => addProgressItem(workOrderTodos?.length)}
                                                >
                                                    <FaPlus style={{ fontSize: "15px" }} />
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        <br /><br />
                                        <Grid container spacing={2}>
                                            <Grid item md={12}>
                                                {workOrderTodos?.map((progress, progressIndex) => (
                                                    <Grid container spacing={1} key={progressIndex} sx={{ margin: '0 auto' }}>
                                                        <Grid item md={12}>
                                                            <Grid sx={{ display: "flex" }}>
                                                                <Typography sx={{ fontWeight: 'bold' }}>{progressIndex + 1 + '.' + ' ' + progress.progress}</Typography>
                                                                <Link target={"_blank"}
                                                                    to={`/project/task/taskview/${id}`}>
                                                                    <Button variant="text" sx={userStyle.buttondelete}><VisibilityOutlinedIcon sx={{ marginTop: "-5px", }} /></Button>
                                                                </Link>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item md={1}>
                                                            <Typography sx={{ fontWeight: "bold" }}>S.No</Typography>
                                                        </Grid>
                                                        <Grid item md={2.5}>
                                                            <Typography sx={{ fontWeight: "bold" }}>Sub-Component Name</Typography>
                                                        </Grid>
                                                        <Grid item md={2}>
                                                            <Typography sx={{ fontWeight: "bold" }}>Estimation Time</Typography>
                                                        </Grid>
                                                        <Grid item md={2.5}>
                                                            <Typography sx={{ fontWeight: "bold" }}>Developer</Typography>
                                                        </Grid>
                                                        <Grid item md={2.5}>
                                                            <Typography sx={{ fontWeight: "bold" }}>Priority</Typography>
                                                        </Grid>
                                                        <Grid item md={1.5}></Grid>
                                                        <Grid item md={12}>
                                                            {progress.subComponents?.map((subComponent, subIndex) => (
                                                                <Grid container spacing={1} key={subComponent.id}>
                                                                    <Grid item md={1}>
                                                                        <Typography>{subIndex + 1 + '.'}</Typography>
                                                                    </Grid>
                                                                    <Grid item md={2.5}>
                                                                        <Typography>{subComponent.subcomponent}</Typography>
                                                                    </Grid>
                                                                    <Grid item md={2}>
                                                                        <Typography>{subComponent.subEstTime}</Typography>
                                                                    </Grid>
                                                                    <Grid item md={6.5}>
                                                                        {subComponentEditing?.[progressIndex]?.[subIndex] ? (
                                                                            // Display mode
                                                                            <>
                                                                                <Grid container spacing={1}>
                                                                                    <Grid item md={4}>

                                                                                        {employees.length > 0 ? (
                                                                                            <Select
                                                                                                fullWidth
                                                                                                size="small"
                                                                                                labelId="demo-select-small"
                                                                                                id="demo-select-small"
                                                                                                placeholder="Select Developer"
                                                                                                MenuProps={{
                                                                                                    PaperProps: {
                                                                                                        style: {
                                                                                                            maxHeight: 200,
                                                                                                            width: 80,
                                                                                                        },
                                                                                                    },
                                                                                                }}
                                                                                                value={subComponent.developer}
                                                                                                onChange={(e) => handleWorkOrderUpdateTodoEdit(progressIndex, subIndex, "developer", e.target.value)}
                                                                                                inputProps={{ 'aria-label': 'Without label' }}
                                                                                            >
                                                                                                {employees.map((item, empIndex) => (
                                                                                                    <MenuItem key={empIndex} value={item.firstname + " " + item.lastname}>
                                                                                                        {item.firstname + " " + item.lastname}
                                                                                                    </MenuItem>
                                                                                                ))}
                                                                                            </Select>
                                                                                        ) : (
                                                                                            <Select
                                                                                                fullWidth
                                                                                                size="small"
                                                                                                labelId="demo-select-small"
                                                                                                id="demo-select-small"
                                                                                                placeholder="Select Developer"
                                                                                                MenuProps={{
                                                                                                    PaperProps: {
                                                                                                        style: {
                                                                                                            maxHeight: 200,
                                                                                                            width: 80,
                                                                                                        },
                                                                                                    },
                                                                                                }}
                                                                                                value={subComponent.developer}
                                                                                                onChange={(e) => handleWorkOrderUpdateTodoEdit(progressIndex, subIndex, "developer", e.target.value)}
                                                                                                inputProps={{ 'aria-label': 'Without label' }}
                                                                                            >
                                                                                                {editDeveloper.map((item, empIndex) => (
                                                                                                    <MenuItem key={empIndex} value={item.firstname + " " + item.lastname}>
                                                                                                        {item.firstname + " " + item.lastname}
                                                                                                    </MenuItem>
                                                                                                ))}
                                                                                            </Select>
                                                                                        )}
                                                                                    </Grid>
                                                                                    <Grid item md={4}>
                                                                                        {/* Render priority dropdown */}
                                                                                        <Select
                                                                                            fullWidth
                                                                                            size="small"
                                                                                            labelId="demo-select-small"
                                                                                            id="demo-select-small"
                                                                                            placeholder="Select Priority"
                                                                                            MenuProps={{
                                                                                                PaperProps: {
                                                                                                    style: {
                                                                                                        maxHeight: 200,
                                                                                                        width: 80,
                                                                                                    },
                                                                                                },
                                                                                            }}
                                                                                            value={subComponent.priority}
                                                                                            onChange={(e) => handleWorkOrderUpdateTodoEdit(progressIndex, subIndex, "priority", e.target.value)}
                                                                                            inputProps={{ 'aria-label': 'Without label' }}
                                                                                        >
                                                                                            {priorities.map((item, priIndex) => (
                                                                                                <MenuItem key={priIndex} value={item.name}>{item.name}</MenuItem>
                                                                                            ))}
                                                                                        </Select>
                                                                                    </Grid>
                                                                                    <Grid item md={1}>
                                                                                        <Button
                                                                                            variant="contained"
                                                                                            sx={{
                                                                                                minWidth: '20px',
                                                                                                minHeight: '41px',
                                                                                                background: 'transparent',
                                                                                                boxShadow: 'none',
                                                                                                marginTop: '0px !important',
                                                                                                '&:hover': {
                                                                                                    background: '#f4f4f4',
                                                                                                    borderRadius: '50%',
                                                                                                    minHeight: '41px',
                                                                                                    minWidth: '20px',
                                                                                                    boxShadow: 'none',
                                                                                                },
                                                                                            }}
                                                                                            onClick={() => {
                                                                                                // Save changes and toggle editing state when CheckCircleIcon is clicked
                                                                                                // Implement the logic to save the selected value here
                                                                                                toggleSubComponentEditing(subComponent.id); // Toggle editing state for this subComponent
                                                                                            }}
                                                                                        >
                                                                                            <CheckCircleOutlinedIcon style={{ color: "#216d21", fontSize: "1.5rem" }} />
                                                                                        </Button>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        ) : (
                                                                            // Edit mode
                                                                            <>
                                                                                <Grid container spacing={1}>
                                                                                    <Grid item md={4}>
                                                                                        <Typography>{subComponent.developer}</Typography>
                                                                                    </Grid>
                                                                                    <Grid item md={4}>
                                                                                        <Typography>{subComponent.priority}</Typography>
                                                                                    </Grid>
                                                                                    <Grid item md={1}>
                                                                                        <Button
                                                                                            variant="contained"
                                                                                            sx={{
                                                                                                minWidth: '20px',
                                                                                                minHeight: '41px',
                                                                                                background: 'transparent',
                                                                                                boxShadow: 'none',
                                                                                                marginTop: '0px !important',
                                                                                                '&:hover': {
                                                                                                    background: '#f4f4f4',
                                                                                                    borderRadius: '50%',
                                                                                                    minHeight: '41px',
                                                                                                    minWidth: '20px',
                                                                                                    boxShadow: 'none',
                                                                                                },
                                                                                            }}
                                                                                            onClick={() => {
                                                                                                // Toggle editing state when Edit icon is clicked
                                                                                                toggleSubComponentEditing(subComponent.id); // Toggle editing state for this subComponent
                                                                                            }}
                                                                                        >
                                                                                            <BorderColorOutlinedIcon style={{ color: "#1976d2", fontSize: "1.2rem" }} />
                                                                                        </Button>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </>
                                                                        )}
                                                                    </Grid>
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Grid>
                                        {/* Replace Alert Dialog */}
                                        <Dialog
                                            open={showReplaceConfirmation}
                                            onClose={() => setShowReplaceConfirmation(false)}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            <DialogTitle id="alert-dialog-title">Replace Existing Progress?</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">
                                                    Do you want to replace the existing progress or add it alongside the existing one?
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => handleReplaceConfirmationNo(workOrderTodos.length)} color="primary">
                                                    No
                                                </Button>
                                                <Button onClick={() => handleReplaceConfirmationYes(workOrderTodos.length)} color="primary" autoFocus>
                                                    Yes
                                                </Button>
                                            </DialogActions>
                                        </Dialog><br /><br />
                                    </Accordion>
                                </Box>
                                <br /><br />
                                <Box sx={userStyle.dialogbox}>
                                    <Grid container spacing={2}>
                                        <Grid item md={6} xs={12} sm={12}>
                                            <Button variant="contained" style={{
                                                padding: '7px 16px',
                                                borderRadius: '3px',
                                                color: 'white',
                                                background: 'rgb(25, 118, 210)',
                                            }} onClick={editSubmit}>
                                                Update
                                            </Button>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={12}>
                                            <Button style={{
                                                backgroundColor: '#f4f4f4',
                                                color: '#444',
                                                boxShadow: 'none',
                                                borderRadius: '3px',
                                                padding: '7px 16px',
                                                border: '1px solid #0000006b',
                                                '&:hover': {
                                                    '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                                                        backgroundColor: '#f4f4f4',
                                                    },
                                                },
                                            }} onClick={handleCloseModEdit}>
                                                Cancel
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </>
                        }

                    </Box>
                </>
            </Dialog >


            {/* ALERT DIALOG */}
            < Box >
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        style={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >

                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box >

            {/* ALERT DIALOG */}
            < Box >
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        style={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box >

        </>
    )

}

export default Taskeditmodel;