import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, FormControl, TableBody, TextField, TableRow, FormControlLabel, TableCell, Select,
    MenuItem, DialogContent, Grid, Dialog, DialogActions, Paper, Table, TableHead, TableContainer, Button,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Checkbox from "@mui/material/Checkbox";
import "jspdf-autotable";
import "react-quill/dist/quill.snow.css";
import { SERVICE } from "../../../services/Baseservice";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import { makeStyles } from "@material-ui/core";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import csvIcon from "../../../components/Assets/CSV.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import { Delete } from "@material-ui/icons";
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext'
import { ThreeDots } from 'react-loader-spinner'
import { green } from '@mui/material/colors';
import Headtitle from "../../../components/Headtitle";
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { FaExpand, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import TabPanel from '@mui/lab/TabPanel';
import Tab from "@material-ui/core/Tab";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';



const useStyles = makeStyles((theme) => ({
    inputs: {
        display: "none",
    },
    preview: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: theme?.spacing(2),
        "& > *": {
            margin: theme?.spacing(1),
        },
    },
}));

function Tasktoday() {
    const classes = useStyles();

    const [isTodayDeveloperIncomplete, setIsTodayDeveloperIncomplete] = useState([]);
    const [TaskDetailEdit, setTaskDetailEdit] = useState({});
    const [filteredtasks, setFilteredtasks] = useState([]);
    const { auth } = useContext(AuthContext);
    const { isUserRoleAccess, isUserRoleCompare } = useContext(UserRoleAccessContext);
    const [viewImage, setViewImage] = useState("");
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [todosedit, setTodosedit] = useState([]);
    const [selectedOptionedit, setSelectedOptionedit] = useState(null);
    const [editingIndexedit, setEditingIndexedit] = useState(-1);
    const [editedTodoedit, setEditedTodoedit] = useState("");
    const [editedTododesedit, setEditedTododesedit] = useState("");
    const [editTodoUsersedit, seteditTodoUsersedit] = useState("");
    const [editedTodoFiles, setEditedTodoFiles] = useState([]);
    const [findImageIndex, setFindImageIndex] = useState("");
    const [indexData, setIndex] = useState("");
    const [todoCheck, setTodoCheck] = useState(false);
    const [isErrorOpenFiles, setIsErrorOpenFiles] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [value, setValue] = useState('1');
    const [filteredassigned, setFilteredassigned] = useState([]);
    const [pbiUploadDev, setPbiUploadDev] = useState([]);
    const [resourcesDev, setResourcesDev] = useState([]);
    const [developerTask, setDeveloperTask] = useState([]);

    const id = useParams().id;

    const handleFullscreenClick = () => {
        setShowFullscreen(true);
    };

    const handleFullscreenClose = () => {
        setShowFullscreen(false);
    };


    const handleClickOpenerrFiles = async (index) => {
        setIndex(index);
        setIsErrorOpenFiles(true);
    };


    const handleCloseerrFiles = () => {

        setIsErrorOpenFiles(false);
    };


    // Error Popup model
    const handleClickOpenerr = async () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const fetchtodayDeveloperIncomplete = async () => {
        try {
            let res = await axios.post(SERVICE.TASKHOMETODAYDEVINCOMPLETE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                homeuseraccess: String(isUserRoleCompare[0].access),
                homeuserlogin: String(isUserRoleAccess.username)
            })
            // setIsTaskdots(true);
            setIsTodayDeveloperIncomplete(res?.data?.tasks)

        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // get single row to view page....
    const getviewCode = async (e) => {
        try {

            let res = await axios.get(`${SERVICE.TASK_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTaskDetailEdit(res?.data?.stask);
            setFilteredtasks(res?.data?.stask?.checkpointsdev);
            setTodosedit(res?.data?.stask?.checkpointsdev);

        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const getcheckpoints = async (id) => {
        try {

            let res = await axios.get(`${SERVICE.TASK_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }

            });
            setTodosedit(res?.data?.stask?.checkpointsdev);



         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }


    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);

    const handleClickOpenerrTodo = async (e, index, updateid, value) => {
        setFindImageIndex(e);
        setTodoCheck(value);
        setIndex(index);
        setIsErrorOpen(true);
    };

    const handleCloseerrtodo = () => {
        setIsErrorOpen(false);
        setSelectedFiles([]);
    };




    // view model
    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };



    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };



    //Added the timer functionality 
    const now = new Date();
    const [runningIndex, setRunningIndex] = useState(null);


    const handleUpdateTodoEditrunning = async (index) => {

        let resdev = await axios.post(SERVICE.TASKCHECKTIMER, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`
            },
            homeuserloginchecktimer: String(isUserRoleAccess.username)
        })
        let res_project = await axios.get(`${SERVICE.TASK_SINGLE}/${task_det_id}`, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`
            },

        });
        let oldstarttime = (res_project?.data?.stask?.checkpointsdev[index].starttime);

        if (resdev.data.tasks.length == 0) {

            const newTodosedit = [...todosedit];
            newTodosedit[index].starttime = [...oldstarttime, (now.toLocaleTimeString())];
            newTodosedit[index].state = "running";
            setTodosedit(newTodosedit);
            await sendEditRequest(newTodosedit);
            setRunningIndex(index);
            setEditingIndexedit(-1);
        }
        else {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '18px', fontWeight: 800 }}>{`Timer Already Running in ${resdev.data.tasks[0].taskname}`}</p>
                </>
            );
            handleClickOpenerr();
        }

    };


    const handleUpdateTodoEditpaused = async (index) => {

        let res_project = await axios.get(`${SERVICE.TASK_SINGLE}/${task_det_id}`, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`
            },

        });
        let oldendtime = (res_project?.data?.stask?.checkpointsdev[index].endtime);
        const newTodosedit = [...todosedit];
        newTodosedit[index].endtime = [...(oldendtime), now.toLocaleTimeString()];
        newTodosedit[index].state = "paused";
        setTodosedit(newTodosedit);
        await sendEditpausRequest(newTodosedit);
        setRunningIndex(null);

    };

    let task_det_id = TaskDetailEdit._id;
    const sendEditRequest = async (todoval) => {
        try {
            let res = await axios?.put(`${SERVICE.TASK_SINGLE}/${task_det_id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                checkpointsdev: todoval
            })
            handleCloseerrtodo();
            setSelectedFiles([]);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    const sendEditpausRequest = async (todoval) => {
        try {
            let res = await axios.put(`${SERVICE.TASK_SINGLE}/${task_det_id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                checkpointsdev: todoval
            })
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    let datenow = Date.now();;
    const [timestamp, setTimestamp] = useState(Date.now());


    useEffect(() => {
        const interval = setInterval(() => {
            setTimestamp(Date.now());
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);


    const calculateTotalTime = (data) => {
        const startTimes = data.starttime;
        const endTimes = data.endtime;


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


    const [editedprocstatus, setEditedprocstatus] = useState("")
    const [totaltimevalue, settotaltimevalue] = useState("")

    const handleEditTodoEdit = (index, status, time) => {
        setEditingIndexedit(index);
        setEditedprocstatus(status)
        settotaltimevalue(time)
        setEditedTodoFiles(todosedit[index]?.files); // Set the initial files state
        setSelectedOptionedit(null);
    };


    const handleUpdateTodoEdit = async () => {

        let res_project = await axios.get(`${SERVICE.TASK_SINGLE}/${id}`, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`
            },

        });

        let oldendtime = (res_project?.data?.stask?.checkpointsdev[editingIndexedit].endtime);

        const newTodosedit = [...todosedit];

        newTodosedit[editingIndexedit].files = selectedFiles;
        // added the timer
        newTodosedit[editingIndexedit].state = "stopped";
        newTodosedit[editingIndexedit].endtime = [...(res_project?.data?.stask?.checkpointsdev[editingIndexedit].endtime), now.toLocaleTimeString()];
        newTodosedit[editingIndexedit].processstatus = editedprocstatus;
        newTodosedit[editingIndexedit].difftime = totaltimevalue;

        setTodosedit(newTodosedit);
        setRunningIndex(null);
        setEditingIndexedit(-1);
        setEditedTodoedit("");
        sendEditRequeststop(newTodosedit)
        setEditedTododesedit("");
        seteditTodoUsersedit("");
        setEditedTodoFiles([]);

    };


    const sendEditRequeststop = async (todosvalue) => {
        try {
            let res = await axios.put(`${SERVICE.TASK_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                checkpointsdev: todosvalue
            })
            handleCloseerrFiles();
            setSelectedFiles([])
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }



    const handleInputChange = (event, index) => {
        const files = event.target.files;
        let newSelectedFiles = [...selectedFiles];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Check if the file is an image
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => {
                    newSelectedFiles.push({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        preview: reader.result,
                        base64: reader.result.split(",")[1],
                        index: indexData
                    });
                    setSelectedFiles(newSelectedFiles);
                    setEditedTodoFiles(newSelectedFiles);
                };
                reader.readAsDataURL(file);
            }
            //   else {
            //     setShowAlert(
            //       <>
            //         <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
            //         <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Only Accept Images!"}</p>
            //       </>
            //     );
            //     handleClickOpenerr();
            //   }
        }
    };

    const handleDeleteFile = (index) => {
        const newSelectedFiles = [...selectedFiles];
        newSelectedFiles.splice(index, 1);
        setSelectedFiles(newSelectedFiles);
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


    const updatedTodos = filteredassigned.map(todo => {

        if (todo.label == isUserRoleAccess?.username) {
            return { ...todo, status: 'complete' };
        }
        return todo;
    });

    const sendCompleRequest = () => {
        if (filteredtasksnew.every(item => item.files.length > 0)) {
            sendcompleteEditRequest();
        } else {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please complete all the checkpoints"}</p>
                </>
            );
            handleClickOpenerr();
        }
    }

    const sendcompleteEditRequest = async () => {
        try {
            let res = await axios.put(`${SERVICE.TASK_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignedtodeveloper: updatedTodos
            })
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }



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

    const filteredtasksnew = filteredtasks?.map((task, index) => ({
        ...task,
        index: index.toString(),
        endtime: task.endtime,
        processstatus: task.processstatus
    })).filter((task, index) => task.checkuser == isUserRoleAccess?.username)
        .map((task, i) => ({
            ...task,
            id: id,
            indexval: task.index.toString()
        }));

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = isTodayDeveloperIncomplete?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
    }, [isTodayDeveloperIncomplete])

    //table sorting
    const [sorting, setSorting] = useState({ column: '', direction: '' });

    const handleSorting = (column) => {
        const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
        setSorting({ column, direction });
    };

    const sortedData = items.sort((a, b) => {
        if (sorting.direction === 'asc') {
            return a[sorting.column] > b[sorting.column] ? 1 : -1;
        } else if (sorting.direction === 'desc') {
            return a[sorting.column] < b[sorting.column] ? 1 : -1;
        }
        return 0;
    });
    const renderSortingIcon = (column) => {
        if (sorting.column !== column) {
            return <>
                <Box sx={{ color: '#bbb6b6' }}>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropUpOutlinedIcon />
                    </Grid>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropDownOutlinedIcon />
                    </Grid>
                </Box>
            </>;
        } else if (sorting.direction === 'asc') {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        } else {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        }
    };

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1);
    };

    //datatable....
    const [searchQuery, setSearchQuery] = useState("");
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };
    const filteredDatas = items.filter((item) =>
        Object.values(item).some((value) =>
            value.toString().toLowerCase().startsWith(searchQuery.toLowerCase())
        )
    );

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }


    useEffect(
        () => {
            fetchtodayDeveloperIncomplete();
        }, []
    )

    return (
        <>
            <Box sx={userStyle.container}>
                <Box>
                    <Headtitle title={'TODAY TASK LIST'} />
                    <Typography sx={userStyle.HeaderText}>Today Task List</Typography>
                    <Grid style={userStyle.dataTablestyle}>
                        <Box>
                            <label >Show entries:</label>
                            <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "67px" }}>
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                                <MenuItem value={(isTodayDeveloperIncomplete.length)}>All</MenuItem>
                            </Select>
                        </Box>
                        <Box>
                            <FormControl fullWidth size="small" >
                                <Typography>Search</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </FormControl>
                        </Box>
                    </Grid>

                    <TableContainer component={Paper}>
                        <Table
                            sx={{ minWidth: 700, }}
                            aria-label="customized table"
                            id="usertable"
                        // ref={tableRef}
                        >
                            <TableHead sx={{ fontWeight: "600" }}>
                                <StyledTableRow>
                                    {/* <StyledTableCell onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell> */}
                                    <StyledTableCell onClick={() => handleSorting("taskid")}> <Box sx={userStyle.tableheadstyle}> <Box>Task ID</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon("taskid")}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting("taskname")}><Box sx={userStyle.tableheadstyle}><Box>Task Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon("taskname")}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting("assigneddate")}><Box sx={userStyle.tableheadstyle}> <Box>Date</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon("assigneddate")}</Box> </Box> </StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting("assignedby")} > <Box sx={userStyle.tableheadstyle}> <Box>AssignedBy</Box><Box>{renderSortingIcon("assignedby")}</Box></Box> </StyledTableCell>
                                    <StyledTableCell>Actions</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody align="left">
                                {filteredData.length > 0 ? (
                                    filteredData?.map((row, index) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell align="left"> {row.taskid} </StyledTableCell>
                                            <StyledTableCell align="left"> {row.taskname}</StyledTableCell>
                                            <StyledTableCell align="left">{row.assigneddate}</StyledTableCell>
                                            <StyledTableCell align="left">{row.assignedby}</StyledTableCell>
                                            <StyledTableCell component="th" scope="row">
                                                <Button
                                                    sx={userStyle.buttonedit}
                                                    onClick={() => {
                                                        handleClickOpeninfo();
                                                        getviewCode(row._id);
                                                    }}
                                                >
                                                    <VisibilityOutlinedIcon
                                                        style={{ fontsize: "large" }}
                                                    />
                                                </Button>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))) : <StyledTableRow> <StyledTableCell colSpan={5} align="center">No Data Available</StyledTableCell> </StyledTableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box style={userStyle.dataTablestyle}>
                        <Box>
                            Showing {filteredData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                        </Box>
                        <Box>
                            <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                <FirstPageIcon />
                            </Button>
                            <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                <NavigateBeforeIcon />
                            </Button>
                            {pageNumbers?.map((pageNumber) => (
                                <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={((page)) === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
                                    {pageNumber}
                                </Button>
                            ))}
                            {lastVisiblePage < totalPages && <span>...</span>}
                            <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                <NavigateNextIcon />
                            </Button>
                            <Button onClick={() => setPage((totalPages))} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                <LastPageIcon />
                            </Button>
                        </Box>
                    </Box>
                </Box>
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

            {/* view model */}
            <Dialog
                open={openInfo}
                onClose={handleCloseinfo}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <Box sx={{ width: "990px", padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> Today Task Info </Typography>

                        <Grid container spacing={2}>
                        </Grid>
                        <br />
                        <br />
                        <Typography>Task Details :</Typography>
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
                                            />


                                            <Tab label="Description" value="2" sx={userStyle.tablelistStyle} />

                                            <Tab label="Resources" value="3" sx={userStyle.tablelistStyle} />
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
                                </TabContext>
                            </div>
                        </Box>
                        <br />
                        <br />


                        {/* ALERT POPUP DIALOG */}
                        <Box >
                            <Dialog
                                open={isErrorOpenFiles}
                                onClose={handleCloseerrFiles}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogContent
                                    style={{ width: "550px", textAlign: "center", alignItems: "center" }}
                                >
                                    {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                                    <div>
                                        <input
                                            className={classes.inputs}
                                            type="file"
                                            id="file-inputuploadfiletask"
                                            multiple
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="file-inputuploadfiletask" style={{ textAlign: "center", padding: '7px 14px' }}>
                                            <Button style={userStyle.btncancel} component="span">
                                                <AddCircleOutlineIcon /> &ensp; Add Images
                                            </Button>
                                        </label>

                                        <Grid container>
                                            {selectedFiles?.map((file, index) => (
                                                file.index === indexData ?
                                                    <>
                                                        <Grid item md={3} sm={11} xs={11}>
                                                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                                                <Typography variant="subtitle2">
                                                                </Typography>
                                                            </Box>
                                                            <img src={file.preview} height={100} />
                                                        </Grid>
                                                        <Grid item md={1} sm={1} xs={1}>

                                                            <Button
                                                                sx={{
                                                                    padding: '14px 14px', marginTop: '16px', minWidth: '40px !important', borderRadius: '50% !important', ':hover': {
                                                                        backgroundColor: '#80808036', // theme.palette.primary.main

                                                                    },
                                                                }}
                                                                onClick={() => handleDeleteFile(index)}
                                                            >
                                                                <FaTrash style={{ fontSize: "large", color: "#a73131" }} />
                                                            </Button>
                                                            <Button
                                                                style={userStyle.buttonedit}
                                                                onClick={() => {
                                                                    handleClickOpenview();
                                                                    setViewImage(file.preview);
                                                                }}
                                                            >
                                                                <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                                                            </Button>
                                                        </Grid>
                                                    </> : ""
                                            ))}
                                        </Grid>
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    <Button variant="contained" disabled={selectedFiles.length <= 0} color="primary" onClick={() => { handleUpdateTodoEdit(); sendEditRequest(); }}>
                                        ok
                                    </Button>
                                    <Button variant="contained" style={userStyle.btncancel} onClick={handleCloseerrFiles}>
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Box>

                        {/* ALERT DIALOG */}
                        <Box>
                            <Dialog
                                open={isErrorOpen}
                                onClose={handleCloseerr}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogContent style={{ width: '400px', textAlign: 'center', alignItems: 'center' }}>
                                    <Typography variant="h6" >{showAlert}</Typography>
                                </DialogContent>
                                <DialogActions>
                                    <Button variant="contained" style={{ background: "#da2f2f", color: 'white', padding: '7px 14px', borderRadius: '4px' }} onClick={handleCloseerr}>ok</Button>
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

                        <br />
                        <br />
                        <br />
                        <Box sx={{ padding: "12px" }}>
                            <Typography>Check Points :</Typography>
                            <br />
                            <br />
                            {
                                filteredtasksnew?.map((data, index) => {
                                    const lastStartTime = data.starttime[data.starttime.length - 1]
                                    const lastEndTime = data.endtime[data.endtime.length - 1]

                                    // Parse the first time string into a Date object
                                    const time1 = new Date(`01/01/2023 ${lastStartTime}`);

                                    // Get the current time
                                    const time2 = new Date(`01/01/2023 ${lastEndTime}`);

                                    // Calculate the time difference in milliseconds
                                    const timeDifference = Math.abs(time2 - time1);
                                    const timeDifferencecurrent = Math.abs(timestamp - time1);

                                    // Convert milliseconds to hours, minutes, and seconds
                                    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
                                    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                                    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
                                    //timer is running
                                    const hours1 = Math.floor((timeDifferencecurrent / (1000 * 60 * 60)) % 24);
                                    const minutes1 = Math.floor((timeDifferencecurrent % (1000 * 60 * 60)) / (1000 * 60));
                                    const seconds1 = Math.floor((timeDifferencecurrent % (1000 * 60)) / 1000);

                                    const data1 = `${data.time} hours`; // Assuming `data.time` is in the format of hours
                                    const data2 = calculateTotalTime(filteredtasksnew[index]);

                                    const convertToTimeFormat = (duration) => {
                                        if (duration.includes('hours')) {
                                            const hours = parseInt(duration.split(' ')[0], 10);
                                            return `0:${hours * 60}:0`;
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
                                        greaterDuration = "on going";
                                    }

                                    return (
                                        <>
                                            <Grid container spacing={2}>
                                                <Grid md={4} sm={12} xs={12} sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>
                                                    <FormControl>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={(data?.files)?.length > 0 ? true : false}
                                                                    onClick={(e) => {

                                                                        handleEditTodoEdit(data.indexval, greaterDuration);

                                                                        handleClickOpenerrFiles(index);

                                                                    }}
                                                                    name=""
                                                                    disabled={(data?.files)?.length > 0 ? true : false}

                                                                />
                                                            }
                                                            label={data.label}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid md={1} sm={12} xs={12}>

                                                    <Typography variant="subtitle2">
                                                        {data.time}{" Hours"}

                                                    </Typography>

                                                </Grid>
                                                <Grid md={3} sm={12} xs={12}>
                                                    <Typography>{(data?.files)?.map((file) => (

                                                        <>
                                                            <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                                <Typography variant="subtitle2">
                                                                    {file.name}{" "}
                                                                </Typography>
                                                            </Box>
                                                        </>
                                                    ))}</Typography>
                                                </Grid>
                                                <Grid md={1} sm={12} xs={12}>
                                                    <Typography style={{ background: greaterDuration == "On Time" ? "#34a034ed" : greaterDuration == "Delay" ? "#f82c2ceb" : "grey", width: 'max-content', borderRadius: '14px', color: 'white', padding: "0px 5px" }} variant="subtitle2" >
                                                        {greaterDuration}
                                                    </Typography>

                                                </Grid>
                                                <Grid md={1} sm={12} xs={12}>
                                                    <Typography variant="subtitle2">
                                                        {data.state == "running" ?
                                                            `${hours1 ? hours1 : 0}:${minutes1 ? minutes1 : 0}:${seconds1 ? seconds1 : 0}`

                                                            : data.state == "paused" ? calculateTotalTime(filteredtasksnew[index]) :
                                                                `${hours ? hours : 0}:${minutes ? minutes : 0}:${seconds ? seconds : 0}`}

                                                    </Typography>

                                                </Grid>

                                                <Grid md={2} sm={12} xs={12} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>

                                                    {data.state === "running" ? (
                                                        <Button style={{ textTransform: 'capitalize', padding: '3px 18px', background: '#f5f5f5', border: '1px solid', color: '#0000008f' }} onClick={() => { handleUpdateTodoEditpaused(data.indexval) }}>Pause</Button>
                                                    ) : (
                                                        <Button style={{ textTransform: 'capitalize', padding: '3px 22px', background: '#f5f5f5', border: runningIndex !== null && runningIndex !== index || data.state == "stopped" ? "none" : '1px solid', color: '#0000008f' }}
                                                            disabled={runningIndex !== null && runningIndex !== index || data.state == "stopped"}
                                                            onClick={() => { handleUpdateTodoEditrunning(data.indexval); }}
                                                        >
                                                            Start
                                                        </Button>
                                                    )}

                                                </Grid>
                                            </Grid>

                                            <br />
                                        </>
                                    );
                                })
                            }
                        </Box>
                    </>
                    <br />
                    <br />
                    <Grid container spacing={2}>
                        <Button variant="contained" onClick={handleCloseinfo}>
                            {" "}
                            Back{" "}
                        </Button>
                    </Grid>
                </Box>
            </Dialog>


            {/* ALERT POPUP DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerrtodo}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "550px", textAlign: "center", alignItems: "center" }}
                    >

                        <div>
                            <input
                                className={classes?.inputs}
                                type="file"
                                accept="image/*"
                                id="file-inputuploadfiletask"
                                multiple
                                onChange={handleInputChange}
                            />
                            <label htmlFor="file-inputuploadfiletask" style={{ textAlign: "center" }}>
                                <Button sx={userStyle?.btncancel} component="span">
                                    <AddCircleOutlineIcon /> &ensp; Add Images
                                </Button>
                            </label>

                            <Grid container>
                                {selectedFiles?.map((file, index) => (
                                    file?.index === indexData ?
                                        <>
                                            <Grid item md={3} sm={11} xs={11}>
                                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                                    {/* <Typography variant="subtitle2">
                            {file?.name}{" "}
                          </Typography> */}

                                                </Box>
                                                <img src={file?.preview} height={100} />
                                            </Grid>
                                            <Grid item md={1} sm={1} xs={1}>
                                                <Button
                                                    sx={{
                                                        padding: '14px 14px', marginTop: '16px', minWidth: '40px !important', borderRadius: '50% !important', ':hover': {
                                                            backgroundColor: '#80808036', // theme.palette.primary.main

                                                        },
                                                    }}
                                                    onClick={() => handleDeleteFile(index)}
                                                >
                                                    <FaTrash style={{ fontSize: "large", color: "#a73131" }} />
                                                </Button>
                                                <Button
                                                    sx={{ padding: '0px' }}
                                                    onClick={() => {
                                                        handleClickOpenview();
                                                        setViewImage(file?.preview);
                                                    }}
                                                >
                                                    <VisibilityIcon style={{ fontsize: "large" }} />
                                                </Button>
                                            </Grid>
                                        </> : ""
                                ))}
                            </Grid>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" style={{
                            background: '#1976d2', borderRadius: '3px', padding: '7px 14px', color: 'white', '&:hover': {
                                '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                                    backgroundColor: '#f4f4f4',
                                },
                            },
                        }} onClick={() => { handleUpdateTodoEdit(); sendEditRequest() }}>
                            ok
                        </Button>
                        <Button variant="contained" style={{
                            backgroundColor: '#f4f4f4',
                            color: '#444',
                            boxShadow: 'none',
                            padding: '7px 14px',
                            borderRadius: '3px',
                            border: '1px solid #0000006b',
                            '&:hover': {
                                '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                                    backgroundColor: '#f4f4f4',
                                },
                            },
                        }} onClick={handleCloseerrtodo}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    )

}
export default Tasktoday;