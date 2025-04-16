
import React, { useEffect, useState, useContext } from "react";
import {
    Box,
    Typography,
    Dialog,
    FormControlLabel,
    Checkbox,
    DialogContent,
    DialogActions,
    FormControl, Paper,
    Grid, TableCell, TableRow, TableBody, Table, TableHead, Select,
    Button,
    MenuItem,
    TableContainer,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import { styled } from '@mui/material/styles';
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import csvIcon from "../../../components/Assets/CSV.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import { Delete } from "@material-ui/icons";
import { FaExpand } from "react-icons/fa";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { makeStyles } from "@material-ui/core";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link, useNavigate, useParams } from "react-router-dom";
import Tab from "@material-ui/core/Tab";
import SearchIcon from '@mui/icons-material/Search';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import { ThreeDots } from 'react-loader-spinner'


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
        complete: {
            textTransform: 'capitalize !IMPORTANT',
            padding: '7px 19px',
            backgroundColor: "#00905d",
            height: 'fit-content'
        }
    },
}));



function TaskTabs() {
    const [viewImage, setViewImage] = useState("");
    const [showFullscreen, setShowFullscreen] = useState(false);
    const classes = useStyles();

    const [developerTask, setDeveloperTask] = useState([]);
    const [pbiUploadDev, setPbiUploadDev] = useState([]);
    const [pbiUploadtester, setPbiUploadtester] = useState([]);
    const [resourcesDev, setResourcesDev] = useState([]);
    const [checktask, setchecktask] = useState(false);
    const [todosedit, setTodosedit] = useState([]);
    const [filteredtasks, setFilteredtasks] = useState([]);
    const [filteredtaskstester, setFilteredtaskstester] = useState([]);
    const [filteredassigned, setFilteredassigned] = useState([]);
    const [usersid, setUsersid] = useState([]);
    const { auth, setAuth } = useContext(AuthContext);
    const [value, setValue] = useState('1');
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [isErrorOpenFiles, setIsErrorOpenFiles] = useState(false);
    const [showAlert, setShowAlert] = useState();
    // view model
    const [openview, setOpenview] = useState(false);
    const [indexData, setIndex] = useState("");

    const [chooseval, setchooseval] = useState("Development");


    const { isUserRoleAccess } = useContext(UserRoleAccessContext);
    // Error Popup model
    const handleClickOpenerr = async () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const id = useParams().id;

    const rowData = async () => {
        try {
            let res_project = await axios.get(`${SERVICE.TASK_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },

            });
            await profilePic(res_project?.data?.stask?.assignedbyprofileimg)
            setchecktask(true);
            setDeveloperTask(res_project?.data?.stask);
            setPbiUploadDev(res_project?.data?.stask?.pbiupload);
            setPbiUploadtester(res_project?.data?.stask?.pbitester);
            setResourcesDev(res_project?.data?.stask?.resources);
            setFilteredtasks(res_project?.data?.stask?.checkpointsdev);
            setFilteredtaskstester(res_project?.data?.stask?.usecasetester);
            setFilteredassigned(res_project?.data?.stask?.assignedtodeveloper);
            setTodosedit(res_project?.data?.stask?.checkpointsdev);

        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    useEffect(() => {
        rowData();
    }, [id]);



    //developer checkpoints
    // Group todos by their title values
    const groupedTodos = filteredtasks.reduce((groups, todo) => {

        const groupKey = todo.title;
        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(todo);
        return groups;
    }, {});

    //returncount developer checkpoints
    const returnedGroup = groupedTodos['Returned'] || []; // Get the "Returned" todos

    const groupedReturnedTodos = returnedGroup.reduce((groups, todo) => {
        const returnCount = todo.returncount;
        if (!groups[returnCount]) {
            groups[returnCount] = [];
        }
        groups[returnCount].push(todo);
        return groups;
    }, {});

    //tester usecases
    const groupedTodosusecases = filteredtaskstester.reduce((groups, todo) => {

        const groupKey = todo.title;
        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(todo);
        return groups;
    }, {});



    const handleClickOpenerrFiles = async (index) => {
        setIndex(index);
        setIsErrorOpenFiles(true);
    };
    const handleCloseerrFiles = () => {

        setIsErrorOpenFiles(false);
    };


    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };




    const handleFullscreenClick = () => {
        setShowFullscreen(true);
    };

    const handleFullscreenClose = () => {
        setShowFullscreen(false);
    };


    const getFileIcon = (fileName) => {
        const extension = fileName.split(".").pop();
        switch (extension) {
            case "pdf":
                return pdfIcon;
            case "doc":
            case "docx":
                return wordIcon;
            case "xls":
            case "xlsx":
                return excelIcon;
            case "csv":
                return csvIcon;
            default:
                return fileIcon;
        }
    };


    //LoginUser image Access

    const profilePic = async (userprofile) => {
        try {
            let res = await axios.post(SERVICE.USERTASKPROFILE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                userprofile: String(userprofile)
            });
            setUsersid(res?.data?.users);

        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleDownload = async (file) => {
        try {
            const response = await fetch(file.preview);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = file.name;
            link.click();
            URL.revokeObjectURL(url);
            window.open(link, "_blank");
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    let totalDuration = 0;

    if (developerTask.checkpointsdev) {
        developerTask.checkpointsdev?.forEach((checkpoint) => {
            const startTimes = checkpoint.starttime;
            const endTimes = checkpoint.endtime;
            let checkpointDuration = 0;

            // Check if startTimes and endTimes have the same length

            for (let i = 0; i < startTimes.length; i++) {
                const startTimeParts = startTimes[i]?.split(' ')[0].split(':');
                const endTimeParts = endTimes[i]?.split(' ')[0].split(':');

                // Check if startTimeParts and endTimeParts have the correct length
                if (
                    startTimeParts?.length === 3 &&
                    endTimeParts?.length === 3 &&
                    (checkpoint.state === 'paused' || checkpoint.state === 'stopped')
                ) {
                    const startTime = new Date();
                    startTime.setHours(parseInt(startTimeParts[0], 10));
                    startTime.setMinutes(parseInt(startTimeParts[1], 10));
                    startTime.setSeconds(parseInt(startTimeParts[2], 10));

                    const endTime = new Date();
                    endTime.setHours(parseInt(endTimeParts[0], 10));
                    endTime.setMinutes(parseInt(endTimeParts[1], 10));
                    endTime.setSeconds(parseInt(endTimeParts[2], 10));

                    const duration = endTime - startTime;
                    checkpointDuration += duration;
                }
            }


            totalDuration += checkpointDuration;
        });
    }

    if (developerTask.usecasetester) {
        developerTask.usecasetester?.forEach((usecase) => {
            const startTimes = usecase.starttime;
            const endTimes = usecase.endtime;
            let usecaseDuration = 0;

            // Check if startTimes and endTimes have the same length

            for (let i = 0; i < startTimes.length; i++) {
                const startTimeParts = startTimes[i]?.split(' ')[0].split(':');
                const endTimeParts = endTimes[i]?.split(' ')[0].split(':');

                // Check if startTimeParts and endTimeParts have the correct length
                if (
                    startTimeParts?.length === 3 &&
                    endTimeParts?.length === 3 &&
                    (usecase.state === 'paused' || usecase.state === 'stopped')
                ) {
                    const startTime = new Date();
                    startTime.setHours(parseInt(startTimeParts[0], 10));
                    startTime.setMinutes(parseInt(startTimeParts[1], 10));
                    startTime.setSeconds(parseInt(startTimeParts[2], 10));

                    const endTime = new Date();
                    endTime.setHours(parseInt(endTimeParts[0], 10));
                    endTime.setMinutes(parseInt(endTimeParts[1], 10));
                    endTime.setSeconds(parseInt(endTimeParts[2], 10));

                    const duration = endTime - startTime;
                    usecaseDuration += duration;
                }
            }


            totalDuration += usecaseDuration;
        });
    }

    const durationInSeconds = Math.floor(totalDuration / 1000);
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    const formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;


    //OVERALL TIME STATUS

    const data = developerTask.calculatedtime; // Represents 5 hours
    const data2 = formattedDuration; // Represents a duration in the format '1:18:00'

    // Convert data to the same format as data2 ('hh:mm:ss')
    const dataHours = Math.floor(data);
    const dataMinutes = Math.floor((data % 1) * 60);
    const dataSeconds = 0; // Since data represents hours, there are no seconds
    const formattedData = `${dataHours.toString().padStart(2, '0')}:${dataMinutes.toString().padStart(2, '0')}:${dataSeconds.toString().padStart(2, '0')}`;
    let result;
    // Compare the values
    if (formattedData > data2) {
        result = 'On time';
    } else if (formattedData < data2) {
        result = 'Delay';
    } else {
        result = 'On time';
    }

    const calculateTotalTime = (idval) => {
        const matchedItem = filteredtasks.find((item) => item.idval === idval);
        const startTimes = matchedItem?.starttime;
        const endTimes = matchedItem?.endtime;

        let totalTime = 0;

        for (let i = 0; i < startTimes?.length; i++) {
            const startTime = new Date(`01/01/2023 ${startTimes[i]}`);
            const endTime = new Date(`01/01/2023 ${endTimes[i]}`);

            const timeDifference = Math.abs(endTime - startTime);
            totalTime += +timeDifference;
        }

        // Convert totalTime to hours, minutes, and seconds
        const hours = Math.floor((totalTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((totalTime % (1000 * 60)) / 1000);

        return `${hours}:${minutes}:${seconds}`;
    };


    return (
        <Box sx={userStyle.container}>

            {!checktask ?

                <Box style={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                    <ThreeDots
                        height="80"
                        width="80"
                        radius="9"
                        color="#1976d2"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClassName=""
                        visible={true}
                    />
                </Box>
                :
                <>
                    <Box>
                        <Typography variant="h5">Task Details</Typography><br />
                        <Grid container spacing={2}>
                            <Grid item md={6} lg={6} sm={6} xs={12}>

                            </Grid>
                            <Grid item md={6} lg={6} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <Typography variant="h6"> Estimate Time</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: '600', fontFamily: 'auto' }}>
                                            {/* {developerTask.calculatedtime} {"Minutes"} */}
                                            {(developerTask.calculatedtime === 1
                                                ? `${developerTask.calculatedtime} Minute`
                                                : developerTask.calculatedtime >= 60
                                                    ? (
                                                        <>
                                                            {`${developerTask.calculatedtime} Minutes`} <br />
                                                            {`(${Math.floor(developerTask.calculatedtime / 60)}:${developerTask.calculatedtime % 60}:${Math.floor((developerTask.calculatedtime % 1) * 60)})`}
                                                        </>
                                                    )
                                                    : `${developerTask.calculatedtime} Minutes`)}
                                        </Typography>

                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <Typography variant="h6">  Actual Time</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: '600', fontFamily: 'auto', color: 'red' }}> {formattedDuration}</Typography>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <Typography variant="h6">Status</Typography>

                                        <Typography sx={{
                                            padding: '2px 5px',
                                            width: 'fit-content',
                                            background: result == "On time" ? "#52af52" : "#d63535",
                                            borderRadius: '10px',
                                            color: 'white'
                                        }}>{result}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} lg={3} sm={6} xs={12}>
                                <Typography variant="h6">Project</Typography>
                                <Typography variant="h6" sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>{developerTask.projectname}</Typography>
                            </Grid>
                            <Grid item md={3} lg={3} sm={6} xs={12}>
                                <Typography variant="h6">Sub Project</Typography>
                                <Typography variant="h6" sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>{developerTask.subprojectname}</Typography>
                            </Grid>
                            <Grid item md={3} lg={3} sm={6} xs={12}>
                                <Typography variant="h6">Module</Typography>
                                <Typography variant="h6" sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>{developerTask.module}</Typography>
                            </Grid>
                            <Grid item md={3} lg={3} sm={6} xs={12}>
                                <Typography variant="h6"> Sub Module</Typography>
                                <Typography variant="h6" sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>{developerTask.submodule}</Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <br />
                        {/* added the subpages */}
                        <Grid container spacing={2}>
                            <Grid item md={3} lg={3} sm={6} xs={12}>
                                <Typography variant="h6"> Main Page</Typography>
                                <Typography variant="h6" sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>{developerTask.mainpage}</Typography>
                            </Grid>
                            <Grid item md={3} lg={3} sm={6} xs={12}>
                                <Typography variant="h6"> Subpage 1</Typography>
                                <Typography variant="h6" sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>{developerTask.subpageone}</Typography>
                            </Grid>
                            <Grid item md={3} lg={3} sm={6} xs={12}>
                                <Typography variant="h6"> Subpage 2</Typography>
                                <Typography variant="h6" sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>{developerTask.subpagetwo}</Typography>
                            </Grid>
                            <Grid item md={3} lg={3} sm={6} xs={12}>
                                <Typography variant="h6"> Subpage 3</Typography>
                                <Typography variant="h6" sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>{developerTask.subpagethree}</Typography>
                            </Grid>
                            <Grid item md={3} lg={3} sm={6} xs={12}>
                                <Typography variant="h6"> Subpage 4</Typography>
                                <Typography variant="h6" sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>{developerTask.subpagefour}</Typography>
                            </Grid>
                            <Grid item md={3} lg={3} sm={6} xs={12}>
                                <Typography variant="h6"> Subpage 5</Typography>
                                <Typography variant="h6" sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>{developerTask.subpagefive}</Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <Typography variant="h6">Task ID </Typography>
                                <Typography variant="h6" sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>{developerTask.taskid}</Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <Typography variant="h6">Task Name : </Typography>
                                <Typography variant="h6" sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>{developerTask.taskname}</Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <Typography variant="h6">Assigned Date</Typography>
                                <Typography variant="h6" sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>{developerTask.assigneddate}</Typography>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12} >
                                <Typography variant="h6">Assigned By</Typography>
                                <Box style={{ display: 'flex', gap: '10px' }}>
                                    {usersid?.profileimage ? (
                                        <>
                                            <img src={usersid?.profileimage} alt="User profile picture"
                                                style={{ height: 50, width: 50, borderRadius: "50%", maxHeight: { xs: 233, md: 167 }, maxWidth: { xs: 350, md: 250 }, alignItems: "flex-end", justifyContent: "center" }}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <img
                                                src="https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"
                                                alt=""
                                                style={{ borderRadius: "50%" }}
                                                height={50}
                                            />
                                        </>
                                    )}
                                    <Typography variant="h6" style={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>{developerTask.assignedby}</Typography>
                                </Box>

                            </Grid>

                        </Grid>
                    </Box>
                    <br />
                    <br />
                    <br />
                    {/* <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                    <Grid container>

                    </Grid>
                        <Select
                            fullWidth
                            value={chooseval}
                            onChange={(e) => setchooseval(e.target.value)}
                        >
                            <MenuItem value="Development" key={"Development"}>Development</MenuItem>
                            <MenuItem value="Testing" key={"Testing"}>Testing</MenuItem>
                        </Select>
                    </Box> */}
                    <Typography variant="h6">Task Details :</Typography>
                    <br />
                    <br />
                    <Box container spacing={2}>
                        <div>
                            <TabContext value={value} >
                                <Box style={{
                                    borderBottom: 1, borderColor: 'divider',
                                    borderRadius: '4px',
                                    boxShadow: '0px 0px 4px #b7b1b1',
                                    border: '1px solid #c3c3c3',
                                    overflow: 'hidden',
                                    marginBottom: '0px',
                                    boxSizing: 'border-box',
                                }}>
                                    <TabList onChange={handleChange} aria-label="lab API tabs example" sx={{
                                        backgroundColor: '#f5f5f5', borderRadius: '4px',
                                        '.MuiTab-textColorPrimary.Mui-selected': {
                                            color: 'white',
                                            border: '1px solid #b5afaf',
                                            borderBottom: 'none',
                                            background: ' #3346569c'
                                        },
                                        '.css-1aquho2-MuiTabs-indicator': {
                                            background: 'none',
                                        }

                                    }}>
                                        <Tab label="PBI" value="1"
                                            sx={userStyle.tablelistStyle}
                                        // }}  
                                        />


                                        <Tab label="Description" value="2" sx={userStyle.tablelistStyle} />

                                        <Tab label="Resources" value="3" sx={userStyle.tablelistStyle} />
                                        <Tab label="PBI Tester" value="4" sx={userStyle.tablelistStyle} />
                                        <Tab label="Description Tester" value="5" sx={userStyle.tablelistStyle} />
                                    </TabList>
                                </Box>
                                <TabPanel value="1" index={0} sx={userStyle.tabpanelstyle}>
                                    {pbiUploadDev.map((data) => {
                                        return <>
                                            {data.type.includes("image/") ?
                                                <>
                                                    <img src={data.preview} alt={data.name} style={{ maxHeight: '100px', marginTop: '10px' }} />
                                                    <Button style={userStyle.buttonedit}
                                                        onClick={() => {
                                                            handleClickOpenview();
                                                            setViewImage(data.preview);
                                                        }} ><VisibilityOutlinedIcon style={{ fontsize: "large" }} /></Button>
                                                </>
                                                :
                                                <>
                                                    <Box >
                                                        {/* <Button variant="contained" className="glow-button" onClick={() => renderFilePreview(data)}>Clock In</Button>; */}
                                                        <Button variant='contained' onClick={() => renderFilePreview(data)} style={{ textTranform: 'capitalize' }}><SearchIcon />Preview</Button>
                                                    </Box>
                                                    <img className={classes.preview} src={getFileIcon(data.name)} height="100" alt="file icon" />
                                                </>
                                            }
                                        </>

                                    })}
                                </TabPanel>
                                <TabPanel value="2" index={1} sx={userStyle.tabpanelstyle}>
                                    <div dangerouslySetInnerHTML={{ __html: developerTask.description }}></div>
                                </TabPanel>
                                <TabPanel value="3" index={2} sx={userStyle.tabpanelstyle}>
                                    {resourcesDev.map((data, index) => {
                                        return <>
                                            <Box key={index}>

                                                <Button variant='contained' onClick={() => renderFilePreview(data)} style={{ textTranform: 'capitalize' }}><SearchIcon />Preview</Button>
                                            </Box>
                                            {data.type.includes("image/") ? (
                                                <img src={data.preview} alt={data.name} height="100" style={{ maxWidth: "-webkit-fill-available" }} />
                                            ) : (
                                                <img className={classes.preview} src={getFileIcon(data.name)} height="100" alt="file icon" />
                                            )}
                                            <Typography onClick={() => { handleDownload(data) }} style={{ onClick: "pointer" }}>{data.name}</Typography>

                                        </>

                                    })}
                                </TabPanel>
                                <TabPanel value="4" index={3} sx={userStyle.tabpanelstyle}>
                                    {pbiUploadtester.map((data) => {
                                        return <>
                                            {data.type.includes("image/") ?
                                                <>
                                                    <img src={data.preview} alt={data.name} style={{ maxHeight: '100px', marginTop: '10px' }} />
                                                    <Button sx={userStyle.buttonedit}
                                                        onClick={() => {
                                                            handleClickOpenview();
                                                            setViewImage(data.preview);
                                                        }} ><VisibilityOutlinedIcon style={{ fontsize: "large" }} /></Button>
                                                </>
                                                :
                                                <>
                                                    <Box >
                                                        <Button variant='contained' onClick={() => renderFilePreview(data)} sx={{ textTranform: 'capitalize' }}><SearchIcon />Preview</Button>
                                                    </Box>
                                                    <img className={classes.preview} src={getFileIcon(data.name)} height="100" alt="file icon" />
                                                </>
                                            }
                                        </>
                                    })}
                                </TabPanel>
                                <TabPanel value="5" index={4} sx={userStyle.tabpanelstyle}>
                                    <div dangerouslySetInnerHTML={{ __html: developerTask.description }}></div>
                                </TabPanel>
                            </TabContext>
                        </div>
                    </Box>
                    <br />
                    <br />
                    <br />
                    <Box >
                        <Grid container spacing={2}>
                            <Grid item md={2}>
                                <Typography variant="h6">Check Points :</Typography>
                            </Grid>
                            <Grid item md={4}>
                                <Select
                                    fullWidth
                                    value={chooseval}
                                    onChange={(e) => setchooseval(e.target.value)}
                                >
                                    <MenuItem value="Development" key={"Development"}>Development</MenuItem>
                                    <MenuItem value="Testing" key={"Testing"}>Testing</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                        <br />
                        <>
                            {chooseval == "Development" ?
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 900 }}
                                        aria-label="customized table"
                                        id="usertable">
                                        <TableHead>
                                            <StyledTableRow>
                                                <StyledTableCell sx={{ maxWidth: '30px' }} ></StyledTableCell>
                                                <StyledTableCell >Checkpoints</StyledTableCell>
                                                <StyledTableCell sx={{ minWidth: 'fit-content' }}>Estimate Time</StyledTableCell>
                                                <StyledTableCell sx={{ minWidth: 'fit-content' }}>Priority</StyledTableCell>
                                                <StyledTableCell >Actual Time</StyledTableCell>
                                                <StyledTableCell>Image</StyledTableCell>
                                                <StyledTableCell sx={{ minWidth: '100px' }}>Status</StyledTableCell>
                                                <StyledTableCell sx={{ minWidth: '100px' }}>Done By</StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody>


                                            {Object.keys(groupedTodos).map((title, i) => {
                                                if (title !== "Returned") {
                                                    return (
                                                        <>
                                                            <StyledTableRow key={title}>
                                                                <StyledTableCell colSpan={8}> <h3>{title}</h3> </StyledTableCell>
                                                            </StyledTableRow>
                                                            {
                                                                groupedTodos[title].map((data, index) => {

                                                                    const lastStartTime = data.starttime[data.starttime.length - 1]
                                                                    const lastEndTime = data.endtime[data.endtime.length - 1]

                                                                    // Parse the first time string into a Date object
                                                                    const time1 = new Date(`01/01/2023 ${lastStartTime}`);

                                                                    // Get the current time
                                                                    const time2 = new Date(`01/01/2023 ${lastEndTime}`);

                                                                    // Calculate the time difference in milliseconds
                                                                    const timeDifference = Math.abs(time2 - time1);

                                                                    // Convert milliseconds to hours, minutes, and seconds
                                                                    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
                                                                    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                                                                    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                                                                    const data1 = `${data.time} minutes`; // Assuming `data.time` is in the format of hours
                                                                    const data2 = calculateTotalTime(data.idval);

                                                                    const convertToTimeFormat = (duration) => {
                                                                        if (duration.includes('hours')) {
                                                                            const hours = parseInt(duration.split(' ')[0], 10);
                                                                            return `0:${hours * 60}:0`;
                                                                        } else if (duration.includes('minutes')) {
                                                                            const minutes = parseInt(duration.split(' ')[0], 10);
                                                                            return `0:${minutes}:0`;
                                                                        }

                                                                        return duration;
                                                                    };

                                                                    const formatToSeconds = (timeFormat) => {
                                                                        const [hours, minutes, seconds] = timeFormat.split(':').map((str) => parseInt(str, 10));
                                                                        return hours * 3600 + minutes * 60 + seconds;
                                                                    };

                                                                    const formattedData1 = convertToTimeFormat(data1);
                                                                    const duration1 = formatToSeconds(formattedData1);
                                                                    const duration2 = formatToSeconds(data2);

                                                                    let greaterDuration;

                                                                    if (duration1 > duration2) {
                                                                        greaterDuration = "On Time";
                                                                    } else if (duration2 > duration1) {
                                                                        greaterDuration = "Delay";
                                                                    } else {
                                                                        greaterDuration = "";
                                                                    }


                                                                    return (

                                                                        <StyledTableRow key={index}>
                                                                            <StyledTableCell sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>
                                                                                <FormControl >
                                                                                    <FormControlLabel
                                                                                        sx={{ color: data.isreturn == "returned" ? "red" : "inherit" }}
                                                                                        control={
                                                                                            <Checkbox
                                                                                                checked={(data?.files)?.length > 0 ? true : false}

                                                                                                name=""
                                                                                                disabled={(data?.files)?.length > 0 ? true : false}

                                                                                            />
                                                                                        }
                                                                                        label={" " + data.label}
                                                                                    />
                                                                                </FormControl>
                                                                            </StyledTableCell>
                                                                            <StyledTableCell sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>
                                                                                {data.label}

                                                                            </StyledTableCell>
                                                                            <StyledTableCell>

                                                                                <Typography variant="subtitle2">
                                                                                    {data.time === 1
                                                                                        ? `${data.time} Minute`
                                                                                        : data.time >= 60
                                                                                            ? (
                                                                                                <>
                                                                                                    {`${data.time} Minutes`} <br />
                                                                                                    {`(${Math.floor(data.time / 60)}:${data.time % 60}:${Math.floor((data.time % 1) * 60)})`}
                                                                                                </>
                                                                                            )
                                                                                            : `${data.time} Minutes`}
                                                                                </Typography>

                                                                            </StyledTableCell>
                                                                            <StyledTableCell sx={{ display: 'flex', justifyContent: 'center', alignItems: "center", borderBottom: 'none', }}>

                                                                                <Typography sx={{
                                                                                    backgroundColor:
                                                                                        (data.priority) === "Low" || (data.priority) === "low" || (data.priority) === "low1" || (data.priority) === "low2" || (data.priority) === "low3" || (data.priority) === "Low1" || (data.priority) === "Low2" || (data.priority) === "Low3" ? "#a9d0a9" :
                                                                                            (data.priority) === "Medium" || (data.priority) === "medium" || (data.priority) === "Medium1" || (data.priority) === "Medium2" || (data.priority) === "Medium3" || (data.priority) === "medium1" || (data.priority) === "medium2" || (data.priority) === "medium3" ? "#a9a9cb" : "#ff0000b5",
                                                                                    textTransform: "capitalize",
                                                                                    padding: "1px 6px",
                                                                                    maxWidth: "fit-content",
                                                                                    borderRadius: "13%",
                                                                                    color: "white",
                                                                                    marginTop: '17px',
                                                                                    lineHeight: "1.3",
                                                                                    fontSize: "11px", // Note the correct spelling of fontSize

                                                                                    // Media query for small screens
                                                                                    '@media (max-width: 600px)': {
                                                                                        fontSize: "medium",
                                                                                        padding: "1px 4px",
                                                                                    }
                                                                                }}>
                                                                                    {data.priority}
                                                                                </Typography>

                                                                            </StyledTableCell>
                                                                            <StyledTableCell>
                                                                                {calculateTotalTime(data.idval)}
                                                                            </StyledTableCell>
                                                                            <StyledTableCell>
                                                                                <Typography>{(data?.files)?.map((file) => (
                                                                                    <>
                                                                                        <Box sx={{ display: 'flex' }}>
                                                                                            <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                                                                <Typography variant="subtitle2">
                                                                                                    {file.name}{" "}
                                                                                                </Typography>
                                                                                            </Box>
                                                                                            <Button
                                                                                                sx={{ padding: '0px' }}
                                                                                                onClick={() => {
                                                                                                    handleClickOpenview();
                                                                                                    setViewImage(file?.preview);
                                                                                                }}
                                                                                            >
                                                                                                <VisibilityIcon style={{ fontsize: "large", padding: '0px !IMPORTANT' }} />
                                                                                            </Button>
                                                                                        </Box>
                                                                                    </>
                                                                                ))}

                                                                                </Typography>
                                                                            </StyledTableCell>
                                                                            <StyledTableCell>
                                                                                {
                                                                                    data.state == "" ?
                                                                                        <Box sx={{
                                                                                            padding: '2px 5px',
                                                                                            width: 'max-content',
                                                                                            background: "#e6bc7b",
                                                                                            borderRadius: '8px',
                                                                                            color: '#140f0f',
                                                                                            fontSize: "12px"
                                                                                        }}> {"Not yet started"}</Box>
                                                                                        :

                                                                                        <Box sx={{
                                                                                            padding: '2px 5px',
                                                                                            width: 'max-content',
                                                                                            background: greaterDuration == "On Time" ? "#52af52" : "#d63535",
                                                                                            borderRadius: '10px',
                                                                                            color: 'white'
                                                                                        }}>            {greaterDuration}</Box>
                                                                                }


                                                                            </StyledTableCell>
                                                                            <StyledTableCell>
                                                                                {data.checkuser}
                                                                            </StyledTableCell>
                                                                        </StyledTableRow>


                                                                    )
                                                                })
                                                            }
                                                        </>
                                                    )
                                                }
                                            })}

                                            {Object.keys(groupedReturnedTodos).map((returnCount, i) => {

                                                return (
                                                    <>
                                                        <StyledTableRow key={returnCount}>
                                                            <StyledTableCell colSpan={8}> <h3>Return Count: {returnCount}</h3> </StyledTableCell>
                                                        </StyledTableRow>
                                                        {
                                                            groupedReturnedTodos[returnCount].map((data, index) => {

                                                                const lastStartTime = data.starttime[data.starttime.length - 1]
                                                                const lastEndTime = data.endtime[data.endtime.length - 1]

                                                                // Parse the first time string into a Date object
                                                                const time1 = new Date(`01/01/2023 ${lastStartTime}`);

                                                                // Get the current time
                                                                const time2 = new Date(`01/01/2023 ${lastEndTime}`);

                                                                // Calculate the time difference in milliseconds
                                                                const timeDifference = Math.abs(time2 - time1);

                                                                // Convert milliseconds to hours, minutes, and seconds
                                                                const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
                                                                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                                                                const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                                                                const data1 = `${data.time} minutes`; // Assuming `data.time` is in the format of hours
                                                                const data2 = calculateTotalTime(data.idval);

                                                                const convertToTimeFormat = (duration) => {
                                                                    if (duration.includes('hours')) {
                                                                        const hours = parseInt(duration.split(' ')[0], 10);
                                                                        return `0:${hours * 60}:0`;
                                                                    } else if (duration.includes('minutes')) {
                                                                        const minutes = parseInt(duration.split(' ')[0], 10);
                                                                        return `0:${minutes}:0`;
                                                                    }

                                                                    return duration;
                                                                };

                                                                const formatToSeconds = (timeFormat) => {
                                                                    const [hours, minutes, seconds] = timeFormat.split(':').map((str) => parseInt(str, 10));
                                                                    return hours * 3600 + minutes * 60 + seconds;
                                                                };

                                                                const formattedData1 = convertToTimeFormat(data1);
                                                                const duration1 = formatToSeconds(formattedData1);
                                                                const duration2 = formatToSeconds(data2);

                                                                let greaterDuration;

                                                                if (duration1 > duration2) {
                                                                    greaterDuration = "On Time";
                                                                } else if (duration2 > duration1) {
                                                                    greaterDuration = "Delay";
                                                                } else {
                                                                    greaterDuration = "";
                                                                }


                                                                return (

                                                                    <StyledTableRow key={index}>
                                                                        <StyledTableCell sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all', background: 'rgb(183 9 9 / 31%)' }}>
                                                                            <FormControl >
                                                                                <FormControlLabel
                                                                                    sx={{ color: data.isreturn == "returned" ? "red" : "inherit" }}
                                                                                    control={
                                                                                        <Checkbox
                                                                                            checked={(data?.files)?.length > 0 ? true : false}

                                                                                            name=""
                                                                                            disabled={(data?.files)?.length > 0 ? true : false}

                                                                                        />
                                                                                    }
                                                                                    label={" " + data.label}
                                                                                />
                                                                            </FormControl>
                                                                        </StyledTableCell>
                                                                        <StyledTableCell sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all', background: 'rgb(183 9 9 / 31%)' }}>
                                                                            {data.label}

                                                                        </StyledTableCell>
                                                                        <StyledTableCell sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all', background: 'rgb(183 9 9 / 31%)' }}>

                                                                            <Typography variant="subtitle2">
                                                                                {data.time === 1
                                                                                    ? `${data.time} Minute`
                                                                                    : data.time >= 60
                                                                                        ? (
                                                                                            <>
                                                                                                {`${data.time} Minutes`} <br />
                                                                                                {`(${Math.floor(data.time / 60)}:${data.time % 60}:${Math.floor((data.time % 1) * 60)})`}
                                                                                            </>
                                                                                        )
                                                                                        : `${data.time} Minutes`}
                                                                            </Typography>

                                                                        </StyledTableCell>
                                                                        <StyledTableCell sx={{ background: 'rgb(183 9 9 / 31%)' }}>

                                                                            <Typography sx={{
                                                                                backgroundColor: "#ff0000b5",
                                                                                textTransform: "capitalize",
                                                                                padding: "1px 6px",
                                                                                maxWidth: "fit-content",
                                                                                borderRadius: "13%",
                                                                                color: "white",
                                                                                marginTop: '17px',
                                                                                lineHeight: "1.3",
                                                                                fontSize: "11px", // Note the correct spelling of fontSize

                                                                                // Media query for small screens
                                                                                '@media (max-width: 600px)': {
                                                                                    fontSize: "medium",
                                                                                    padding: "1px 4px",
                                                                                }
                                                                            }}>
                                                                                {"High"}
                                                                            </Typography>

                                                                        </StyledTableCell>
                                                                        <StyledTableCell sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all', background: 'rgb(183 9 9 / 31%)' }}>
                                                                            {calculateTotalTime(data.idval)}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all', background: 'rgb(183 9 9 / 31%)' }}>
                                                                            <Typography>{(data?.files)?.map((file) => (
                                                                                <>
                                                                                    <Box sx={{ display: 'flex' }}>
                                                                                        <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                                                            <Typography variant="subtitle2">
                                                                                                {file.name}{" "}
                                                                                            </Typography>
                                                                                        </Box>
                                                                                        <Button
                                                                                            sx={{ padding: '0px' }}
                                                                                            onClick={() => {
                                                                                                handleClickOpenview();
                                                                                                setViewImage(file?.preview);
                                                                                            }}
                                                                                        >
                                                                                            <VisibilityIcon style={{ fontsize: "large", padding: '0px !IMPORTANT' }} />
                                                                                        </Button>
                                                                                    </Box>
                                                                                </>
                                                                            ))}

                                                                            </Typography>
                                                                        </StyledTableCell>
                                                                        <StyledTableCell sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all', background: 'rgb(183 9 9 / 31%)' }}>
                                                                            {
                                                                                data.state == "" ?
                                                                                    <Box sx={{
                                                                                        padding: '2px 5px',
                                                                                        width: 'max-content',
                                                                                        background: "#e6bc7b",
                                                                                        borderRadius: '8px',
                                                                                        color: '#140f0f',
                                                                                        fontSize: "12px"
                                                                                    }}> {"Not yet started"}</Box>
                                                                                    :

                                                                                    <Box sx={{
                                                                                        padding: '2px 5px',
                                                                                        width: 'max-content',
                                                                                        background: greaterDuration == "On Time" ? "#52af52" : "#d63535",
                                                                                        borderRadius: '10px',
                                                                                        color: 'white'
                                                                                    }}>            {greaterDuration}</Box>
                                                                            }


                                                                        </StyledTableCell>
                                                                        <StyledTableCell sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all', background: 'rgb(183 9 9 / 31%)' }}>
                                                                            {data.checkuser}
                                                                        </StyledTableCell>
                                                                    </StyledTableRow>


                                                                )
                                                            })
                                                        }
                                                    </>
                                                )

                                            })}



                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                :
                                <TableContainer component={Paper}>
                                    <Table
                                        sx={{ minWidth: 700 }}
                                        aria-label="customized table"
                                        id="usertable"
                                    >
                                        <TableHead>
                                            <StyledTableRow>
                                                <StyledTableCell sx={{ maxWidth: '30px' }} ></StyledTableCell>
                                                <StyledTableCell >Checkpoints</StyledTableCell>
                                                <StyledTableCell sx={{ minWidth: 'fit-content' }}>Estimate Time</StyledTableCell>
                                                <StyledTableCell >Actual Time</StyledTableCell>
                                                <StyledTableCell>Image</StyledTableCell>
                                                <StyledTableCell sx={{ minWidth: '120px' }}>Status</StyledTableCell>
                                                <StyledTableCell sx={{ minWidth: '100px' }}>Done By</StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody>



                                            {Object.keys(groupedTodosusecases).map((title, i) => {
                                                if (title !== "Returned") {
                                                    return (
                                                        <>
                                                            <StyledTableRow key={title}>
                                                                <StyledTableCell colSpan={8}> <h3>{title}</h3> </StyledTableCell>
                                                            </StyledTableRow>
                                                            {
                                                                groupedTodosusecases[title].map((data, index) => {


                                                                    const lastStartTime = data.starttime[data.starttime.length - 1]
                                                                    const lastEndTime = data.endtime[data.endtime.length - 1]

                                                                    // Parse the first time string into a Date object
                                                                    const time1 = new Date(`01/01/2023 ${lastStartTime}`);

                                                                    // Get the current time
                                                                    const time2 = new Date(`01/01/2023 ${lastEndTime}`);

                                                                    // Calculate the time difference in milliseconds
                                                                    const timeDifference = Math.abs(time2 - time1);

                                                                    // Convert milliseconds to hours, minutes, and seconds
                                                                    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
                                                                    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                                                                    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);


                                                                    const data1 = `${data.time} minutes`; // Assuming `data.time` is in the format of hours
                                                                    const data2 = calculateTotalTime(data.idval);

                                                                    const convertToTimeFormat = (duration) => {
                                                                        if (duration.includes('hours')) {
                                                                            const hours = parseInt(duration.split(' ')[0], 10);
                                                                            return `0:${hours * 60}:0`;
                                                                        } else if (duration.includes('minutes')) {
                                                                            const minutes = parseInt(duration.split(' ')[0], 10);
                                                                            return `0:${minutes}:0`;
                                                                        }

                                                                        return duration;
                                                                    };

                                                                    const formatToSeconds = (timeFormat) => {
                                                                        const [hours, minutes, seconds] = timeFormat.split(':').map((str) => parseInt(str, 10));
                                                                        return hours * 3600 + minutes * 60 + seconds;
                                                                    };

                                                                    const formattedData1 = convertToTimeFormat(data1);
                                                                    const duration1 = formatToSeconds(formattedData1);
                                                                    const duration2 = formatToSeconds(data2);

                                                                    let greaterDuration;

                                                                    if (duration1 > duration2) {
                                                                        greaterDuration = "On Time";
                                                                    } else if (duration2 > duration1) {
                                                                        greaterDuration = "Delay";
                                                                    } else {
                                                                        greaterDuration = "";
                                                                    }


                                                                    return (

                                                                        <StyledTableRow key={index}>
                                                                            <StyledTableCell align="center">  <FormControl>
                                                                                <FormControlLabel
                                                                                    control={
                                                                                        <Checkbox
                                                                                            checked={(data?.files)?.length > 0 ? true : false}

                                                                                            name=""
                                                                                            disabled={(data?.files)?.length > 0 ? true : false}

                                                                                        />
                                                                                    }
                                                                                />
                                                                            </FormControl></StyledTableCell>
                                                                            <StyledTableCell align="left" sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}> <Typography >{data.label}</Typography></StyledTableCell>
                                                                            <StyledTableCell align="left">
                                                                                {/* {data.time}{" Minutes"} */}
                                                                                {data.time == 1 ? `${data.time} Mintue` : data.time >= 60 ? `${data.time} Mintues (${(data.time / 60).toFixed(2)} Hours)` : `${data.time} Mintues`}
                                                                            </StyledTableCell>

                                                                            <StyledTableCell align="left">{calculateTotalTime(filteredtaskstester[index])}</StyledTableCell>
                                                                            <StyledTableCell align="left"><Typography>{(data?.files)?.map((file) => (

                                                                                <>
                                                                                    <Box sx={{ display: 'flex' }}>
                                                                                        <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                                                            <Typography variant="subtitle2">
                                                                                                {file.name}{" "}
                                                                                            </Typography>
                                                                                        </Box>
                                                                                        <Button
                                                                                            sx={{ padding: '0px' }}
                                                                                            onClick={() => {
                                                                                                handleClickOpenview();
                                                                                                setViewImage(file?.preview);
                                                                                            }}
                                                                                        >
                                                                                            <VisibilityIcon style={{ fontsize: "large", padding: '0px !IMPORTANT' }} />
                                                                                        </Button>
                                                                                    </Box>
                                                                                </>
                                                                            ))}

                                                                            </Typography></StyledTableCell>
                                                                            <StyledTableCell aling="left">
                                                                                {
                                                                                    data.state == "" ?
                                                                                        <Box sx={{
                                                                                            padding: '2px 5px',
                                                                                            width: 'max-content',
                                                                                            background: "#e6bc7b",
                                                                                            borderRadius: '8px',
                                                                                            color: '#140f0f',
                                                                                            fontSize: "12px"
                                                                                        }}>            {"Not yet started"}</Box>
                                                                                        :

                                                                                        <Box sx={{
                                                                                            padding: '2px 5px',
                                                                                            width: 'max-content',
                                                                                            background: greaterDuration == "On Time" ? "#52af52" : "#d63535",
                                                                                            borderRadius: '10px',
                                                                                            color: 'white'
                                                                                        }}>            {greaterDuration}</Box>
                                                                                }

                                                                            </StyledTableCell>
                                                                            <StyledTableCell>{developerTask.assignedtotester}</StyledTableCell>
                                                                        </StyledTableRow>

                                                                    )
                                                                })
                                                            }
                                                        </>
                                                    )
                                                }
                                            })}

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            }
                            <br />
                        </>

                    </Box>
                </>}

            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent style={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} >
                <DialogContent style={{ maxWidth: "100%", alignItems: "center" }}>
                    <img
                        src={viewImage}
                        alt={viewImage}
                        style={{ maxWidth: "100%", marginTop: "10px" }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            cursor: "pointer",
                            padding: "5px",
                            backgroundColor: "rgba(255,255,255,0.8)",
                        }}
                        onClick={handleFullscreenClick}
                    >
                        <FaExpand size={20} />
                    </div>
                    {showFullscreen && (
                        <div
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: "rgba(0,0,0,0.8)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 999,
                            }}
                            onClick={handleFullscreenClose}
                        >
                            <img src={viewImage} alt="Preview" style={{ maxWidth: "100%" }} />
                        </div>
                    )}
                    <Button variant="contained" style={{ padding: '7px 19px', backgroundColor: "#00905d", height: 'fit-content', color: "white" }}
                        onClick={handleCloseview}>
                        {" "}
                        Back{" "}
                    </Button>
                </DialogContent>
            </Dialog>
        </Box >
    );
}

export default TaskTabs;